import React from 'react';

interface OrbitingSatelliteBadgeProps {
  size?: number;
}

export const OrbitingSatelliteBadge: React.FC<OrbitingSatelliteBadgeProps> = ({ size = 160 }) => {
  return (
    <div className="orbit-hero-wrapper" style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Subtle dark atmospheric radial */}
      <div style={{
        position: 'absolute',
        inset: '-16px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(67,112,160,0.18) 0%, rgba(58,110,104,0.08) 45%, transparent 75%)',
      }} />

      {/* SVG Dual Orbit Rings */}
      <svg width={size} height={size} viewBox="0 0 160 160" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="orbitGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4370A0" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3A6E68" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4370A0" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C4E7A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3A7080" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Primary elliptical orbit track */}
        <ellipse 
          cx="80" cy="80" rx="72" ry="28" 
          fill="none" 
          stroke="url(#orbitGrad1)" 
          strokeWidth="1.2" 
          strokeDasharray="6 5" 
          transform="rotate(-26 80 80)" 
        />
        {/* Secondary counter orbit track */}
        <ellipse 
          cx="80" cy="80" rx="64" ry="22" 
          fill="none" 
          stroke="url(#orbitGrad2)" 
          strokeWidth="1" 
          strokeDasharray="4 5" 
          transform="rotate(38 80 80)" 
        />
      </svg>

      {/* Central Badge — clean large uncropped official logo */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '135px', height: '135px',
        borderRadius: '26px',
        background: 'rgba(9, 11, 15, 0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(67, 112, 160, 0.3)',
        border: '1.5px solid rgba(67, 112, 160, 0.45)',
        padding: '8px',
        zIndex: 3
      }}>
        <img 
          src="/logo.png" 
          alt="GeoSR Logo" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 14px rgba(67, 112, 160, 0.65))'
          }}
        />
      </div>
    </div>
  );
};
