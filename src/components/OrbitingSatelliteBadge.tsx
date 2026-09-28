import React from 'react';

interface OrbitingSatelliteBadgeProps {
  size?: number;
}

export const OrbitingSatelliteBadge: React.FC<OrbitingSatelliteBadgeProps> = ({ size = 130 }) => {
  return (
    <div className="orbit-hero-wrapper" style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Subtle dark atmospheric radial — NO bright glow */}
      <div style={{
        position: 'absolute',
        inset: '-12px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(67,112,160,0.1) 0%, rgba(58,110,104,0.05) 45%, transparent 70%)',
      }} />

      {/* SVG Dual Orbit Rings — desaturated */}
      <svg width={size} height={size} viewBox="0 0 130 130" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="orbitGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4370A0" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#3A6E68" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4370A0" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C4E7A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3A7080" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Primary elliptical orbit track */}
        <ellipse 
          cx="65" cy="65" rx="58" ry="24" 
          fill="none" 
          stroke="url(#orbitGrad1)" 
          strokeWidth="1" 
          strokeDasharray="5 4" 
          transform="rotate(-26 65 65)" 
        />
        {/* Secondary counter orbit track */}
        <ellipse 
          cx="65" cy="65" rx="52" ry="19" 
          fill="none" 
          stroke="url(#orbitGrad2)" 
          strokeWidth="0.8" 
          strokeDasharray="3 5" 
          transform="rotate(38 65 65)" 
        />
      </svg>

      {/* Continuously Revolving Satellite */}
      <div className="revolving-orbit-carrier" style={{
        position: 'absolute', top: '50%', left: '50%', width: 0, height: 0
      }}>
        <div className="revolving-satellite-craft">
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
            {/* Left Solar Array — muted slate blue */}
            <rect x="1" y="9" width="7" height="8" rx="1.2" fill="#2D4A6A" stroke="#3D6B8E" strokeWidth="0.8" />
            <line x1="4.5" y1="9" x2="4.5" y2="17" stroke="#4A7090" strokeWidth="0.5" />
            <line x1="1" y1="13" x2="8" y2="13" stroke="#4A7090" strokeWidth="0.5" />

            {/* Central Bus — dark steel */}
            <rect x="9" y="8" width="8" height="10" rx="1.8" fill="#1C2535" stroke="#2D3A4E" strokeWidth="0.8" />
            <circle cx="13" cy="12" r="2.2" fill="#304F6A" stroke="#4370A0" strokeWidth="0.6" />
            <rect x="10.5" y="15" width="5" height="2" rx="0.5" fill="#7A6030" />

            {/* Right Solar Array */}
            <rect x="18" y="9" width="7" height="8" rx="1.2" fill="#2D4A6A" stroke="#3D6B8E" strokeWidth="0.8" />
            <line x1="21.5" y1="9" x2="21.5" y2="17" stroke="#4A7090" strokeWidth="0.5" />
            <line x1="18" y1="13" x2="25" y2="13" stroke="#4A7090" strokeWidth="0.5" />

            {/* Antenna */}
            <line x1="13" y1="8" x2="13" y2="4" stroke="#3D4A58" strokeWidth="1" strokeLinecap="round" />
            <circle cx="13" cy="3" r="1.5" fill="#4A7A5E" />
          </svg>
        </div>
      </div>

      {/* Central Badge — official logo */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '84px', height: '84px',
        borderRadius: '20px',
        background: 'rgba(9, 11, 15, 0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(67, 112, 160, 0.35)',
        border: '1.5px solid rgba(67,112,160,0.4)',
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
            filter: 'drop-shadow(0 2px 8px rgba(67, 112, 160, 0.5))'
          }}
        />
      </div>
    </div>
  );
};
