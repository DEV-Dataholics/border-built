<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PollModel;
use App\Models\PollOptionModel;
use App\Models\PollVoteModel;

class AdminPollController extends ResourceController
{
    public function index()
    {
        $pollModel = new PollModel();
        $optionModel = new PollOptionModel();
        $voteModel = new PollVoteModel();

        $polls = $pollModel->orderBy('created_at', 'DESC')->findAll();

        if (empty($polls)) {
            return $this->respond([]);
        }

        // Pre-load all options and votes in bulk to avoid N+1
        $pollIds = array_column($polls, 'id');
        $allOptions = $optionModel->whereIn('poll_id', $pollIds)->findAll();
        $allVotes = $voteModel->whereIn('poll_id', $pollIds)->findAll();

        // Group options by poll_id
        $optionsByPoll = [];
        foreach ($allOptions as $opt) {
            $optionsByPoll[$opt['poll_id']][] = $opt;
        }

        // Count votes by poll_id and option_id
        $voteCountsByPoll = [];
        $totalVotesByPoll = [];
        foreach ($allVotes as $v) {
            $pid = $v['poll_id'];
            $oid = $v['option_id'];
            $totalVotesByPoll[$pid] = ($totalVotesByPoll[$pid] ?? 0) + 1;
            $voteCountsByPoll[$pid][$oid] = ($voteCountsByPoll[$pid][$oid] ?? 0) + 1;
        }

        $response = [];
        foreach ($polls as $poll) {
            $pollId = $poll['id'];
            $options = $optionsByPoll[$pollId] ?? [];
            $totalVotes = $totalVotesByPoll[$pollId] ?? 0;

            $formattedOptions = [];
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
                'id'          => (int)$poll['id'],
                'title'       => $poll['title'],
                'description' => $poll['description'],
                'is_active'   => (bool)$poll['is_active'],
                'total_votes' => (int)$totalVotes,
                'options'     => $formattedOptions,
                'created_at'  => $poll['created_at'],
            ];
        }

        return $this->respond($response);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$data || !isset($data['title']) || empty($data['options']) || !is_array($data['options'])) {
            return $this->fail('El título y al menos 2 opciones son requeridos.');
        }

        if (count($data['options']) < 2) {
            return $this->fail('Una encuesta debe incluir al menos 2 opciones.');
        }

        $pollModel = new PollModel();
        $optionModel = new PollOptionModel();

        $pollData = [
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'is_active'   => isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1,
        ];

        $pollId = $pollModel->insert($pollData);

        if (!$pollId) {
            return $this->fail('No se pudo crear la encuesta.');
        }

        $optionsToInsert = [];
        foreach ($data['options'] as $opt) {
            if (!empty($opt['name'])) {
                $optionsToInsert[] = [
                    'poll_id'    => $pollId,
                    'name'       => $opt['name'],
                    'image_url'  => $opt['image_url'] ?? null,
                ];
            }
        }

        if (!empty($optionsToInsert)) {
            $optionModel->insertBatch($optionsToInsert);
        }

        return $this->respondCreated([
            'message' => 'Encuesta VIP creada exitosamente.',
            'id'      => $pollId,
        ]);
    }

    public function update($id = null)
    {
        $pollModel = new PollModel();
        $poll = $pollModel->find($id);

        if (!$poll) {
            return $this->failNotFound('Encuesta no encontrada.');
        }

        $data = $this->request->getJSON(true);
        $updateData = [];

        if (isset($data['title'])) $updateData['title'] = $data['title'];
        if (isset($data['description'])) $updateData['description'] = $data['description'];
        if (isset($data['is_active'])) $updateData['is_active'] = $data['is_active'] ? 1 : 0;

        if (empty($updateData)) {
            return $this->respondUpdated(['message' => 'Nada que actualizar']);
        }

        if ($pollModel->update($id, $updateData)) {
            return $this->respondUpdated([
                'message' => 'Encuesta actualizada correctamente.',
                'id'      => $id,
            ]);
        }

        return $this->fail('Error al actualizar la encuesta.');
    }

    public function delete($id = null)
    {
        $pollModel = new PollModel();
        $optionModel = new PollOptionModel();
        $voteModel = new PollVoteModel();

        $poll = $pollModel->find($id);

        if (!$poll) {
            return $this->failNotFound('Encuesta no encontrada.');
        }

        // Cascade delete: votes first, then options, then poll
        $voteModel->where('poll_id', $id)->delete();
        $optionModel->where('poll_id', $id)->delete();

        if ($pollModel->delete($id)) {
            return $this->respondDeleted(['message' => 'Encuesta y todos sus datos eliminados exitosamente.']);
        }

        return $this->fail('No se pudo eliminar la encuesta.');
    }

    public function options()
    {
        return $this->response->setStatusCode(200);
    }
}
