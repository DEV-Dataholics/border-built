/**
 * Standard State Sales Tax Rates (USA)
 * Used across Cart and Checkout for dynamic state-based tax calculations.
 */

export const US_STATE_TAX_RATES = {
  AL: { name: 'Alabama', rate: 0.04 },
  AK: { name: 'Alaska', rate: 0.00 },
  AZ: { name: 'Arizona', rate: 0.056 },
  AR: { name: 'Arkansas', rate: 0.065 },
  CA: { name: 'California', rate: 0.0725 },
  CO: { name: 'Colorado', rate: 0.029 },
  CT: { name: 'Connecticut', rate: 0.0635 },
  DE: { name: 'Delaware', rate: 0.00 },
  DC: { name: 'District of Columbia', rate: 0.06 },
  FL: { name: 'Florida', rate: 0.06 },
  GA: { name: 'Georgia', rate: 0.04 },
  HI: { name: 'Hawaii', rate: 0.04 },
  ID: { name: 'Idaho', rate: 0.06 },
  IL: { name: 'Illinois', rate: 0.0625 },
  IN: { name: 'Indiana', rate: 0.07 },
  IA: { name: 'Iowa', rate: 0.06 },
  KS: { name: 'Kansas', rate: 0.065 },
  KY: { name: 'Kentucky', rate: 0.06 },
  LA: { name: 'Louisiana', rate: 0.0445 },
  ME: { name: 'Maine', rate: 0.055 },
  MD: { name: 'Maryland', rate: 0.06 },
  MA: { name: 'Massachusetts', rate: 0.0625 },
  MI: { name: 'Michigan', rate: 0.06 },
  MN: { name: 'Minnesota', rate: 0.06875 },
  MS: { name: 'Mississippi', rate: 0.07 },
  MO: { name: 'Missouri', rate: 0.04225 },
  MT: { name: 'Montana', rate: 0.00 },
  NE: { name: 'Nebraska', rate: 0.055 },
  NV: { name: 'Nevada', rate: 0.0685 },
  NH: { name: 'New Hampshire', rate: 0.00 },
  NJ: { name: 'New Jersey', rate: 0.06625 },
  NM: { name: 'New Mexico', rate: 0.05125 },
  NY: { name: 'New York', rate: 0.04 },
  NC: { name: 'North Carolina', rate: 0.0475 },
  ND: { name: 'North Dakota', rate: 0.05 },
  OH: { name: 'Ohio', rate: 0.0575 },
  OK: { name: 'Oklahoma', rate: 0.045 },
  OR: { name: 'Oregon', rate: 0.00 },
  PA: { name: 'Pennsylvania', rate: 0.06 },
  RI: { name: 'Rhode Island', rate: 0.07 },
  SC: { name: 'South Carolina', rate: 0.06 },
  SD: { name: 'South Dakota', rate: 0.042 },
  TN: { name: 'Tennessee', rate: 0.07 },
  TX: { name: 'Texas', rate: 0.0825 },
  UT: { name: 'Utah', rate: 0.061 },
  VT: { name: 'Vermont', rate: 0.06 },
  VA: { name: 'Virginia', rate: 0.053 },
  WA: { name: 'Washington', rate: 0.065 },
  WV: { name: 'West Virginia', rate: 0.06 },
  WI: { name: 'Wisconsin', rate: 0.05 },
  WY: { name: 'Wyoming', rate: 0.04 },
};

export const getStateTaxInfo = (stateInput) => {
  if (!stateInput) return { code: '', name: '', rate: 0.00, label: '0%' };
  const raw = String(stateInput).trim().toUpperCase();
  
  // Direct code match
  if (US_STATE_TAX_RATES[raw]) {
    const info = US_STATE_TAX_RATES[raw];
    const pct = `${(info.rate * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
    return { code: raw, name: info.name, rate: info.rate, label: pct };
  }

  // Name match
  for (const [code, info] of Object.entries(US_STATE_TAX_RATES)) {
    if (info.name.toUpperCase() === raw) {
      const pct = `${(info.rate * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
      return { code, name: info.name, rate: info.rate, label: pct };
    }
  }

  return { code: raw, name: stateInput, rate: 0.00, label: '0%' };
};
