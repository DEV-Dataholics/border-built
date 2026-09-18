<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\WinnerModel;
use App\Models\CommunityHighlightModel;

class WinnerController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function index()
    {
        $winnerModel = new WinnerModel();
        $winners = $winnerModel->orderBy('created_at', 'DESC')->findAll();

        $formatted = array_map(function ($w) {
            return [
                'id'           => $w['id'],
                'userId'       => $w['user_id'],
                'giveawayId'   => $w['giveaway_id'],
                'name'         => $w['name'],
                'location'     => $w['location'],
                'country'      => $w['country'],
                'flag'         => $w['flag'],
                'car'          => $w['car'],
                'carImage'     => $w['car_image'],
                'badgeText'    => $w['badge_text'],
                'totalEntries' => (int) $w['total_entries'],
                'wonAt'        => $w['won_at'],
                'createdAt'    => $w['created_at'],
                'updatedAt'    => $w['updated_at'],
            ];
        }, $winners);

        return $this->respond($formatted);
    }

    public function communityHighlights()
    {
        $communityModel = new CommunityHighlightModel();
        $highlights = $communityModel->orderBy('created_at', 'DESC')->findAll();

        $formatted = array_map(function ($h) {
            return [
                'id'        => $h['id'],
                'title'     => $h['title'],
                'location'  => $h['location'],
                'emoji'     => $h['emoji'],
                'image'     => $h['image'],
                'linkUrl'   => $h['link_url'] ?? null,
                'createdAt' => $h['created_at'],
                'updatedAt' => $h['updated_at'],
            ];
        }, $highlights);

        return $this->respond($formatted);
    }
}
