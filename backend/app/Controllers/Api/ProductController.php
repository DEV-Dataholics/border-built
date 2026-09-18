<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProductModel;
use App\Models\ProductVariantModel;

class ProductController extends ResourceController
{
    protected $format = 'json';

    public function alterDb()
    {
        $db = \Config\Database::connect();
        try {
            $db->query("ALTER TABLE products ADD COLUMN is_active TINYINT(1) DEFAULT 1");
            return $this->respond(['status' => 'success', 'message' => 'Column added']);
        } catch (\Exception $e) {
            return $this->respond(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function index()
    {
        $productModel = new ProductModel();
        $variantModel = new ProductVariantModel();

        // Solo retornar productos activos para la vista pública
        $products = $productModel->where('is_active', 1)->findAll();
        
        foreach ($products as &$product) {
            // Mapeo estricto de tipos para cumplir con el esquema YAML
            $product['images']           = json_decode($product['images'] ?? '[]');
            $product['tags']             = json_decode($product['tags'] ?? '[]');
            $product['price']            = (float) $product['price'];
            $product['compare_at_price'] = $product['compare_at_price'] !== null ? (float) $product['compare_at_price'] : null;
            $product['hasMultiplier']    = (bool) ($product['has_multiplier'] ?? false);
            $product['entryMultiplier']  = $product['entry_multiplier'] !== null ? (int) $product['entry_multiplier'] : 1;
            $product['has_multiplier']   = (bool) ($product['has_multiplier'] ?? false);
            $product['entry_multiplier'] = $product['entry_multiplier'] !== null ? (int) $product['entry_multiplier'] : 1;
            $product['featured']         = (bool) $product['featured'];

            // Buscar variantes para este producto específico
            $variants = $variantModel->where('product_id', $product['id'])->findAll();
            
            // Limpiar los IDs internos de la variante y solo devolver lo pactado en OpenAPI
            $product['variants'] = array_map(function($v) {
                return [
                    'size'  => $v['size'],
                    'color' => $v['color'],
                    'stock' => (int) $v['stock']
                ];
            }, $variants);
        }

        return $this->respond($products);
    }

    public function show($slug = null)
    {
        $productModel = new ProductModel();
        $variantModel = new ProductVariantModel();

        $product = $productModel->where('slug', $slug)->first();
        if (!$product) {
            return $this->failNotFound('Product not found');
        }

        // Format product
        $product['images']           = json_decode($product['images'] ?? '[]');
        $product['tags']             = json_decode($product['tags'] ?? '[]');
        $product['price']            = (float) $product['price'];
        $product['compare_at_price'] = $product['compare_at_price'] !== null ? (float) $product['compare_at_price'] : null;
        $product['hasMultiplier']    = (bool) ($product['has_multiplier'] ?? false);
        $product['entryMultiplier']  = $product['entry_multiplier'] !== null ? (int) $product['entry_multiplier'] : 1;
        $product['has_multiplier']   = (bool) ($product['has_multiplier'] ?? false);
        $product['entry_multiplier'] = $product['entry_multiplier'] !== null ? (int) $product['entry_multiplier'] : 1;
        $product['featured']         = (bool) $product['featured'];

        $variants = $variantModel->where('product_id', $product['id'])->findAll();
        $product['variants'] = array_map(function($v) {
            return [
                'size'  => $v['size'],
                'color' => $v['color'],
                'stock' => (int) $v['stock']
            ];
        }, $variants);

        // Fetch similar products
        $similar = $productModel->where('category', $product['category'])
                                ->where('id !=', $product['id'])
                                ->limit(4)
                                ->findAll();
                                
        // If not enough similar products, get random ones
        if (count($similar) < 4) {
            $others = $productModel->where('id !=', $product['id'])
                                   ->limit(4 - count($similar))
                                   ->findAll();
            $similar = array_merge($similar, $others);
        }

        foreach ($similar as &$sim) {
            $sim['images']           = json_decode($sim['images'] ?? '[]');
            $sim['tags']             = json_decode($sim['tags'] ?? '[]');
            $sim['price']            = (float) $sim['price'];
            $sim['compare_at_price'] = $sim['compare_at_price'] !== null ? (float) $sim['compare_at_price'] : null;
        }

        return $this->respond([
            'product' => $product,
            'similar' => $similar
        ]);
    }
}
