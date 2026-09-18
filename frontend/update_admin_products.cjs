const fs = require('fs');

let file = 'src/pages/admin/AdminProducts.jsx';
let content = fs.readFileSync(file, 'utf8');

// State initialization
content = content.replace(
  "sizes: '',",
  "sizes: '',\n      nameEs: '',\n      descriptionEs: '',"
);

// Map on edit
content = content.replace(
  "sizes: product.variants?.filter(v => v.size).map(v => v.size).join(', ') || '',",
  "sizes: product.variants?.filter(v => v.size).map(v => v.size).join(', ') || '',\n      nameEs: product.name_es || '',\n      descriptionEs: product.description_es || '',"
);

// Form Inputs
content = content.replace(
  /(\s*)<Input([\s\S]*?)name="name"([\s\S]*?)onChange={handleChange}([\s\S]*?)>([\s\S]*?)<\/Input>/g,
  "$1<Input$2name=\"name\"$3onChange={handleChange}$4>$5</Input>$1<Input name=\"nameEs\" value={formData.nameEs} onChange={handleChange} placeholder=\"TRADUCCIA\"N ES\" className=\"mt-1 border-primary/50 bg-[#111111]\" />"
);
content = content.replace(
  /(\s*)<div className="flex flex-col gap-1">([\s\S]*?)<label className="text-xs font-mono uppercase text-gray-400">Description<\/label>([\s\S]*?)<textarea([\s\S]*?)name="description"([\s\S]*?)onChange={handleChange}([\s\S]*?)><\/textarea>([\s\S]*?)<\/div>/g,
  "$1<div className=\"flex flex-col gap-1\">$2<label className=\"text-xs font-mono uppercase text-gray-400\">Description</label>$3<textarea$4name=\"description\"$5onChange={handleChange}$6></textarea>$1<textarea name=\"descriptionEs\" value={formData.descriptionEs} onChange={handleChange} placeholder=\"TRADUCCIA\"N ES\" className=\"w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors text-sm min-h-[100px] mt-1 border-primary/50 bg-[#111111]\"></textarea>$7</div>"
);

// The regex might be tricky. Let me just use simpler string replaces!
