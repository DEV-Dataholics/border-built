const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminCoupons.jsx', 'utf8');

const isExpiredFunc = `
  const isCouponExpired = (c) => {
    const now = new Date();
    const isInactive = parseInt(c.is_active) === 0;
    const isUsedUp = c.usage_limit && parseInt(c.usage_count) >= parseInt(c.usage_limit);
    const hasExpiredDate = c.expires_at && new Date(c.expires_at) < now;
    return isInactive || isUsedUp || hasExpiredDate;
  };

  const handleBulkDeleteExpired = async () => {
    const expired = coupons.filter(isCouponExpired);
    if (expired.length === 0) {
      alert('No hay cupones expirados/inactivos para eliminar.');
      return;
    }
    if (!window.confirm(\`¿Estás seguro de eliminar \${expired.length} cupones expirados/inactivos?\`)) return;

    setLoading(true);
    try {
      await Promise.all(expired.map(c => fetch(\`\${import.meta.env.VITE_API_URL}/admin/coupons/\${c.id}\`, { method: 'DELETE' })));
      fetchCoupons();
    } catch (err) {
      console.error('Error bulk deleting:', err);
      setLoading(false);
    }
  };
`;

content = content.replace(
  "const handleOpenModal",
  isExpiredFunc + "\n  const handleOpenModal"
);

content = content.replace(
  "<Button onClick={() => handleOpenModal()} className=\"flex items-center gap-2\">",
  `<div className="flex items-center gap-3">
              <Button onClick={handleBulkDeleteExpired} className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-black border-red-500/30">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Limpiar Expirados
              </Button>
              <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">`
);

// We need to properly close the div we added around the Buttons.
content = content.replace(
  "Nuevo CupA3n\n            </Button>\n          </div>",
  "Nuevo CupA3n\n              </Button>\n            </div>\n          </div>"
);

fs.writeFileSync('src/pages/admin/AdminCoupons.jsx', content);
