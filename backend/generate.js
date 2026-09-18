const fs = require('fs');
const products = JSON.parse(fs.readFileSync('C:/Users/gruiz/OneDrive/Documentos/Border specs/BorderApp/src/data/seed/products.json', 'utf8'));

let productCode = '';
let variantCode = '';

products.forEach(p => {
    productCode += `            [
                'id'               => '${p.id}',
                'name'             => '${p.name.replace(/'/g, "\\'")}',
                'slug'             => '${p.slug}',
                'category'         => '${p.category}',
                'description'      => '${p.description.replace(/'/g, "\\'")}',
                'price'            => ${p.price},
                'compare_at_price' => ${p.compareAtPrice || 'null'},
                'images'           => json_encode(${JSON.stringify(p.images)}),
                'tags'             => json_encode(${JSON.stringify(p.tags)}),
                'entry_multiplier' => ${p.entryMultiplier || 'null'},
                'featured'         => ${p.featured ? 1 : 0},
            ],\n`;
            
    p.variants.forEach(v => {
        variantCode += `            ['product_id' => '${p.id}', 'size' => '${v.size}', 'color' => '${v.color}', 'stock' => ${v.stock}],\n`;
    });
});

console.log('PRODUCTS:');
console.log(productCode);
console.log('VARIANTS:');
console.log(variantCode);
