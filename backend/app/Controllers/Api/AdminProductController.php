<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProductModel;
use App\Models\ProductVariantModel;

class AdminProductController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    private function processImages($images, $slug)
    {
        if (!is_array($images)) return [];
        $processed = [];

        $candidates = [
            ROOTPATH . '../images/products/',
            FCPATH . 'images/products/',
            FCPATH . '../images/products/',
            FCPATH . '../../images/products/',
            dirname(FCPATH) . '/images/products/',
        ];

        $targetDir = null;
        foreach ($candidates as $dir) {
            if (is_dir($dir) && is_writable($dir)) {
                $targetDir = $dir;
                break;
            }
        }

        if (!$targetDir) {
            foreach ($candidates as $dir) {
                if (@mkdir($dir, 0755, true)) {
                    $targetDir = $dir;
                    break;
                }
            }
        }

        foreach ($images as $idx => $img) {
            if (is_string($img) && strpos($img, 'data:image/') === 0 && strpos($img, ';base64,') !== false) {
                $parts = explode(';base64,', $img);
                $mime = str_replace('data:image/', '', $parts[0]);
                $ext = ($mime === 'jpeg' || $mime === 'jpg') ? 'jpg' : (($mime === 'webp') ? 'webp' : 'png');
                $filename = $slug . '-' . time() . ($idx > 0 ? "-{$idx}" : '') . '.' . $ext;
                $decoded = base64_decode($parts[1]);
                if ($targetDir && file_put_contents($targetDir . $filename, $decoded) !== false) {
                    $processed[] = '/images/products/' . $filename;
                    continue;
                }
            }
            $processed[] = $img;
        }

        return $processed;
    }

    public function index()
    {
        $model = new ProductModel();
        $variantModel = new ProductVariantModel();
        $products = $model->findAll();

        foreach ($products as &$product) {
            $product['images']           = json_decode($product['images'] ?? '[]');
            $product['tags']             = json_decode($product['tags'] ?? '[]');
            $product['price']            = (float) $product['price'];
            $product['compare_at_price'] = $product['compare_at_price'] ? (float) $product['compare_at_price'] : null;
            $product['hasMultiplier']    = (bool) ($product['has_multiplier'] ?? false);
            $product['entryMultiplier']  = $product['entry_multiplier'] !== null ? (int) $product['entry_multiplier'] : 1;
            $product['has_multiplier']   = (bool) ($product['has_multiplier'] ?? false);
            $product['entry_multiplier'] = $product['entry_multiplier'] !== null ? (int) $product['entry_multiplier'] : 1;
            $product['featured']         = (bool) $product['featured'];

            // Fetch variants and calculate stock
            $variants = $variantModel->where('product_id', $product['id'])->findAll();
            $totalStock = 0;
            $colors = [];
            $sizes = [];
            
            foreach ($variants as $v) {
                $totalStock += (int)$v['stock'];
                if (!empty($v['color']) && !in_array($v['color'], $colors)) $colors[] = $v['color'];
                if (!empty($v['size']) && !in_array($v['size'], $sizes)) $sizes[] = $v['size'];
            }
            
            $product['stock'] = $totalStock;
            $product['colors'] = $colors;
            $product['sizes'] = $sizes;
            $product['variants'] = $variants;
        }

        return $this->respond($products);
    }

    public function create()
    {
        $model = new ProductModel();
        $variantModel = new ProductVariantModel();
        $data = $this->request->getJSON(true);

        if (!$data || empty($data['name'])) {
            return $this->fail('Product name is required', 400);
        }

        $hasMultiplier = isset($data['hasMultiplier']) ? (bool) $data['hasMultiplier'] : (isset($data['has_multiplier']) ? (bool) $data['has_multiplier'] : false);
        $entryMultiplier = isset($data['entryMultiplier']) ? (int) $data['entryMultiplier'] : (isset($data['entry_multiplier']) ? (int) $data['entry_multiplier'] : 1);
        $tags = isset($data['tags']) ? (is_array($data['tags']) ? $data['tags'] : explode(',', (string)$data['tags'])) : [];

        $productId = 'prod_' . bin2hex(random_bytes(4));
        $slug = !empty($data['slug']) ? $data['slug'] : strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $data['name'] ?? 'product-' . time()));

        $images = $this->processImages($data['images'] ?? [], $slug);

        $insertData = [
            'id'               => $productId,
            'name'             => $data['name'],
            'name_es'          => $data['nameEs'] ?? ($data['name_es'] ?? null),
            'slug'             => $slug,
            'category'         => $data['category'] ?? 'accessories',
            'description'      => $data['description'] ?? '',
            'description_es'   => $data['descriptionEs'] ?? ($data['description_es'] ?? null),
            'price'            => (float)($data['price'] ?? 0),
            'compare_at_price' => !empty($data['compare_at_price']) ? (float)$data['compare_at_price'] : null,
            'images'           => json_encode($images),
            'tags'             => json_encode(array_map('trim', $tags)),
            'has_multiplier'   => $hasMultiplier ? 1 : 0,
            'entry_multiplier' => $hasMultiplier ? $entryMultiplier : 1,
            'featured'         => isset($data['featured']) ? (int)$data['featured'] : 0,
            'is_active'        => isset($data['isActive']) ? (int)$data['isActive'] : (isset($data['is_active']) ? (int)$data['is_active'] : 1),
        ];

        $model->insert($insertData);

        // Handle variants (Colors & Sizes Cartesian product or basic insert)
        $colors = !empty($data['colors']) ? (is_array($data['colors']) ? $data['colors'] : explode(',', (string)$data['colors'])) : ['Default'];
        $sizes = !empty($data['sizes']) ? (is_array($data['sizes']) ? $data['sizes'] : explode(',', (string)$data['sizes'])) : ['ONE SIZE'];
        $numColors = count($colors);
        $numSizes = count($sizes);
        $totalVariants = $numColors * $numSizes;
        $stockPerVariant = isset($data['stock']) && $totalVariants > 0 ? (int) floor((int)$data['stock'] / $totalVariants) : 0;
        
        foreach ($colors as $color) {
            foreach ($sizes as $size) {
                $variantModel->insert([
                    'product_id' => $productId,
                    'color'      => trim($color),
                    'size'       => trim($size),
                    'stock'      => $stockPerVariant
                ]);
            }
        }

        return $this->respondCreated($insertData);
    }

    public function update($id = null)
    {
        $model = new ProductModel();
        $variantModel = new ProductVariantModel();
        $data = $this->request->getJSON(true);

        $hasMultiplier = isset($data['hasMultiplier']) ? (bool) $data['hasMultiplier'] : (isset($data['has_multiplier']) ? (bool) $data['has_multiplier'] : false);
        $entryMultiplier = isset($data['entryMultiplier']) ? (int) $data['entryMultiplier'] : (isset($data['entry_multiplier']) ? (int) $data['entry_multiplier'] : 1);
        $tags = isset($data['tags']) ? (is_array($data['tags']) ? $data['tags'] : explode(',', (string)$data['tags'])) : [];

        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['nameEs']) || isset($data['name_es'])) $updateData['name_es'] = $data['nameEs'] ?? $data['name_es'];
        if (isset($data['slug'])) $updateData['slug'] = $data['slug'];
        if (isset($data['category'])) $updateData['category'] = $data['category'];
        if (isset($data['description'])) $updateData['description'] = $data['description'];
        if (isset($data['descriptionEs']) || isset($data['description_es'])) $updateData['description_es'] = $data['descriptionEs'] ?? $data['description_es'];
        if (isset($data['price'])) $updateData['price'] = (float)$data['price'];
        if (array_key_exists('compare_at_price', $data)) $updateData['compare_at_price'] = !empty($data['compare_at_price']) ? (float)$data['compare_at_price'] : null;
        if (isset($data['images'])) {
            $slug = $updateData['slug'] ?? 'prod_' . $id;
            $updateData['images'] = json_encode($this->processImages($data['images'], $slug));
        }
        if (isset($data['tags'])) $updateData['tags'] = json_encode(array_map('trim', $tags));
        if (isset($data['hasMultiplier']) || isset($data['has_multiplier'])) $updateData['has_multiplier'] = $hasMultiplier ? 1 : 0;
        if (isset($data['entryMultiplier']) || isset($data['entry_multiplier'])) $updateData['entry_multiplier'] = $hasMultiplier ? $entryMultiplier : 1;
        if (isset($data['featured'])) $updateData['featured'] = (int)$data['featured'];
        if (isset($data['isActive']) || isset($data['is_active'])) $updateData['is_active'] = isset($data['isActive']) ? (int)$data['isActive'] : (int)$data['is_active'];

        if (!empty($updateData)) {
            $model->update($id, $updateData);
        }

        // Update variants (if provided, we recreate them or just update stock)
        if (isset($data['colors']) || isset($data['sizes']) || isset($data['stock'])) {
            // Delete old variants
            $variantModel->where('product_id', $id)->delete();
            
            $colors = !empty($data['colors']) ? (is_array($data['colors']) ? $data['colors'] : explode(',', (string)$data['colors'])) : ['Default'];
            $sizes = !empty($data['sizes']) ? (is_array($data['sizes']) ? $data['sizes'] : explode(',', (string)$data['sizes'])) : ['ONE SIZE'];
            $numColors = count($colors);
            $numSizes = count($sizes);
            $totalVariants = $numColors * $numSizes;
            $stockPerVariant = isset($data['stock']) && $totalVariants > 0 ? (int) floor((int)$data['stock'] / $totalVariants) : 0;
            
            foreach ($colors as $color) {
                foreach ($sizes as $size) {
                    $variantModel->insert([
                        'product_id' => $id,
                        'color'      => trim($color),
                        'size'       => trim($size),
                        'stock'      => $stockPerVariant
                    ]);
                }
            }
        }

        return $this->respond(['status' => 'success']);
    }

    public function delete($id = null)
    {
        $model = new ProductModel();
        $model->delete($id);
        return $this->respondDeleted(['id' => $id]);
    }
}
