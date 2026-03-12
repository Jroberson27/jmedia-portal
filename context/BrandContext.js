import { createContext, useContext, useState } from 'react';
import { CLIENTS } from '../lib/data';
const BrandContext = createContext(null);
const ADMIN_BRAND = { primary:'#E8625A', secondary:'#333', font:'Inter' };
export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(ADMIN_BRAND);
  const applyClientBrand = (clientId) => {
    const c = CLIENTS[clientId];
    if (c) setBrand({ primary:c.color, secondary:c.accentColor, font:c.font });
  };
  const resetBrand = () => setBrand(ADMIN_BRAND);
  return (
    <BrandContext.Provider value={{ brand, applyClientBrand, resetBrand }}>
      <style>{`:root { --brand-primary: ${brand.primary}; --brand-secondary: ${brand.secondary}; --brand-font: '${brand.font}', Inter, sans-serif; }`}</style>
      {children}
    </BrandContext.Provider>
  );
}
export const useBrand = () => useContext(BrandContext);