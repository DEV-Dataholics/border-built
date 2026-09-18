<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PollModel;
use App\Models\PollOptionModel;
use App\Models\PollVoteModel;
use App\Models\UserModel;

class VipPollController extends ResourceController
{
    public function index()
    {
        $userId = $this->request->getHeaderLine('X-User-Id');
        if (empty($userId)) {
            $userId = $this->request->getGet('user_id');
        }

        if (empty($userId)) {
            return $this->failUnauthorized('Identificador de usuario no proporcionado.');
        }

        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user || ($user['role'] !== 'admin' && empty($user['is_vip']))) {
            return $this->failForbidden('Acceso exclusivo para miembros VIP o Administradores.');
        }

        $pollModel = new PollModel();
        $optionModel = new PollOptionModel();
        $voteModel = new PollVoteModel();

        $polls = $pollModel->where('is_active', 1)->orderBy('created_at', 'DESC')->findAll();

        if (empty($polls)) {
            return $this->respond([]);
        }

        // Pre-load all related data in bulk to avoid N+1
        $pollIds = array_column($polls, 'id');
        $allOptions = $optionModel->whereIn('poll_id', $pollIds)->findAll();
        $allVotes = $voteModel->whereIn('poll_id', $pollIds)->findAll();

        // Group options by poll_id
        $optionsByPoll = [];
        foreach ($allOptions as $opt) {
            $optionsByPoll[$opt['poll_id']][] = $opt;
        }

        // Index votes: total by poll, count by poll+option, user votes by poll
        $totalVotesByPoll = [];
        $voteCountsByPoll = [];
        $userVotesByPoll = [];
        foreach ($allVotes as $v) {
            $pid = $v['poll_id'];
            $oid = $v['option_id'];
            $totalVotesByPoll[$pid] = ($totalVotesByPoll[$pid] ?? 0) + 1;
            $voteCountsByPoll[$pid][$oid] = ($voteCountsByPoll[$pid][$oid] ?? 0) + 1;
            if ($v['user_id'] == $userId) {
                $userVotesByPoll[$pid] = $v;
            }
        }

        $response = [];
        foreach ($polls as $poll) {
            $pollId = $poll['id'];
            $options = $optionsByPoll[$pollId] ?? [];
            $userVote = $userVotesByPoll[$pollId] ?? null;
            $hasVoted = !empty($userVote);
            $totalVotes = $totalVotesByPoll[$pollId] ?? 0;

            $formattedOptions = [];

            if ($hasVoted) {
                foreach ($options as $opt) {
                    $optId = $opt['id'];
                    $count = $voteCountsByPoll[$pollId][$optId] ?? 0;
                    $percentage = $totalVotes > 0 ? round(($count / $totalVotes) * 100, 1) : 0;

                    $formattedOptions[] = [
                        'id'          => (int)$opt['id'],
                        'name'        => $opt['name'],
                        'image_url'   => $opt['image_url'],
                        'votes_count' => (int)$count,
                        'percentage'  => (float)$percentage,
                    ];
                }

                $response[] = [
                    'id'                   => (int)$poll['id'],
                    'title'                => $poll['title'],
                    'description'          => $poll['description'],
                    'is_active'            => (bool)$poll['is_active'],
                    'has_voted'            => true,
                    'user_voted_option_id' => (int)$userVote['option_id'],
                    'total_votes'          => (int)$totalVotes,
                    'options'              => $formattedOptions,
                    'created_at'           => $poll['created_at'],
                ];
            } else {
                // Si NO ha votado: NO incluir porcentajes ni conteos (para evitar trampas)
                foreach ($options as $opt) {
                    $formattedOptions[] = [
                        'id'        => (int)$opt['id'],
                        'name'      => $opt['name'],
                        'image_url' => $opt['image_url'],
                    ];
                }

                $response[] = [
                    'id'                   => (int)$poll['id'],
                    'title'                => $poll['title'],
                    'description'          => $poll['description'],
                    'is_active'            => (bool)$poll['is_active'],
                    'has_voted'            => false,
                    'user_voted_option_id' => null,
                    'options'              => $formattedOptions,
                    'created_at'           => $poll['created_at'],
                ];
            }
        }

        return $this->respond($response);
    }

    public function vote($pollId = null)
    {
        $data = null;
        try {
            $data = $this->request->getJSON(true);
        } catch (\Throwable $e) {
            $input = $this->request->getBody();
            $data = json_decode($input, true);
        }

        if (!$data || !is_array($data)) {
            $input = $this->request->getBody();
            $data = json_decode($input, true);
        }

        if (!$data || !isset($data['user_id']) || !isset($data['option_id'])) {
            return $this->fail('user_id y option_id son requeridos.');
        }

        $userId = $data['user_id'];
        $optionId = (int)$data['option_id'];
        $pollId = (int)$pollId;

        // 1. Validar usuario e is_vip / admin
        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user || ($user['role'] !== 'admin' && empty($user['is_vip']))) {
            return $this->failForbidden('Acceso denegado. Solo usuarios VIP o administradores pueden votar.');
        }

        // 2. Validar existencia de encuesta activa y opción
        $pollModel = new PollModel();
        $poll = $pollModel->find($pollId);

        if (!$poll || empty($poll['is_active'])) {
            return $this->failNotFound('Encuesta no encontrada o inactiva.');
        }

        $optionModel = new PollOptionModel();
        $option = $optionModel->where('id', $optionId)->where('poll_id', $pollId)->first();

        if (!$option) {
            return $this->fail('La opción seleccionada no pertenece a esta encuesta.');
        }

        // 3. Insertar voto (Capturar duplicados a nivel DB)
        $voteModel = new PollVoteModel();

        // Verificar antes por seguridad
        $existingVote = $voteModel->where('poll_id', $pollId)->where('user_id', $userId)->first();
        if ($existingVote) {
            return $this->failForbidden('Ya has emitido tu voto para esta encuesta. El voto es inmutable.');
        }

        try {
            $insertData = [
                'poll_id'   => $pollId,
                'option_id' => $optionId,
                'user_id'   => $userId,
            ];

            if ($voteModel->insert($insertData)) {
                return $this->respondCreated([
                    'message'              => 'Voto registrado exitosamente.',
                    'poll_id'              => $pollId,
                    'user_voted_option_id' => $optionId,
                ]);
            }
        } catch (\Exception $e) {
            // Falla del constraint UNIQUE(poll_id, user_id)
            return $this->failForbidden('Ya has emitido tu voto para esta encuesta.');
        }

        return $this->fail('No se pudo registrar el voto.');
    }

    public function options()
    {
        return $this->response->setStatusCode(200);
    }
}
