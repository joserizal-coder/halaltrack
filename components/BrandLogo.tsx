
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-2xl ${className}`}>
      <ShieldCheck size={className.includes('w-32') ? 64 : 24} strokeWidth={2.5} />
    </div>
  );
};

export default BrandLogo;
