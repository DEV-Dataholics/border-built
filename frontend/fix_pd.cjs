const fs = require('fs');
let file = 'src/pages/ProductDetail.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix product.variants crash
content = content.replace(
  "const sizes = [...new Set(product.variants.map((v) => v.size))];",
  "const sizes = [...new Set((product.variants || []).map((v) => v.size))];"
);
content = content.replace(
  "const colors = [...new Set(product.variants.map((v) => v.color))];",
  "const colors = [...new Set((product.variants || []).map((v) => v.color))];"
);
content = content.replace(
  "const selectedVariant = product.variants.find(",
  "const selectedVariant = (product.variants || []).find("
);

// Fix compareAtPrice to use compare_at_price
content = content.replace(
  "product.compareAtPrice &&",
  "(product.compareAtPrice || product.compare_at_price) &&"
);
content = content.replace(
  "product.compareAtPrice.toFixed(2)",
  "(product.compareAtPrice || product.compare_at_price).toFixed(2)"
);

// Add missing images fallback
// Wait, product.images?.[0] is already there. The onError handler uses Placehold.co.
// Is there any other place where it could crash? 
// What about calculateEntries? Let's check calculateEntries.

fs.writeFileSync(file, content);
