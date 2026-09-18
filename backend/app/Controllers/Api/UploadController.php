<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

/**
 * Serves uploaded files from the writable/uploads directory.
 * These files are not publicly accessible, so this controller acts as a proxy.
 */
class UploadController extends ResourceController
{
    /**
     * Generic serve: called for top-level paths (e.g. uploads/somefile.jpg).
     */
    public function serve($path = '')
    {
        return $this->serveFile($path);
    }

    /**
     * Explicit handler for giveaway sub-directory uploads.
     * Route: uploads/giveaways/(:num)/(:any)  → serveGiveaway($id, $filename)
     */
    public function serveGiveaway($giveawayId = '', $filename = '')
    {
        $path = 'giveaways/' . $giveawayId . '/' . $filename;
        return $this->serveFile($path);
    }

    public function serveCommunity($filename = '')
    {
        $path = 'community/' . $filename;
        return $this->serveFile($path);
    }

    public function serveWinners($filename = '')
    {
        $path = 'winners/' . $filename;
        return $this->serveFile($path);
    }

    /**
     * Shared helper that resolves and streams a file from the writable/uploads dir.
     */
    private function serveFile(string $path)
    {
        $filePath = WRITEPATH . 'uploads' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $path);

        if (!file_exists($filePath) || is_dir($filePath)) {
            return $this->failNotFound('File not found: ' . $filePath);
        }

        $mimeType = mime_content_type($filePath);

        // Only serve image files
        if (strpos($mimeType, 'image/') !== 0) {
            return $this->fail('Not an image file', 403);
        }

        return $this->response
            ->setHeader('Content-Type', $mimeType)
            ->setHeader('Cache-Control', 'public, max-age=31536000')
            ->setBody(file_get_contents($filePath));
    }
}
