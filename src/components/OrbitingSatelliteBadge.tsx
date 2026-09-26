import React from 'react';

interface OrbitingSatelliteBadgeProps {
  size?: number;
}

export const OrbitingSatelliteBadge: React.FC<OrbitingSatelliteBadgeProps> = ({ size = 130 }) => {
  return (
    <div className="orbit-hero-wrapper" style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Pulsing atmospheric radial aura */}
      <div style={{
        position: 'absolute',
        inset: '-12px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(6, 182, 212, 0.12) 45%, transparent 70%)',
        animation: 'pulse-glow 3.5s ease-in-out infinite'
      }} />

      {/* SVG Dual Orbit Rings */}
      <svg width={size} height={size} viewBox="0 0 130 130" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="orbitGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Primary elliptical orbit track */}
        <ellipse 
          cx="65" cy="65" rx="58" ry="24" 
          fill="none" 
          stroke="url(#orbitGrad1)" 
          strokeWidth="1.5" 
          strokeDasharray="5 3" 
          transform="rotate(-26 65 65)" 
        />
        {/* Secondary counter orbit track */}
        <ellipse 
          cx="65" cy="65" rx="52" ry="19" 
          fill="none" 
          stroke="url(#orbitGrad2)" 
          strokeWidth="1" 
          strokeDasharray="3 4" 
          transform="rotate(38 65 65)" 
        />
      </svg>

      {/* Continuously Revolving Satellite Container */}
      <div className="revolving-orbit-carrier" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0
      }}>
        <div className="revolving-satellite-craft">
          {/* Detailed Satellite SVG Craft */}
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none" style={{ filter: 'drop-shadow(0 2px 5px rgba(15,23,42,0.35))' }}>
            {/* Left Solar Array */}
            <rect x="1" y="9" width="7" height="8" rx="1.2" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.8" />
            <line x1="4.5" y1="9" x2="4.5" y2="17" stroke="#BAE6FD" strokeWidth="0.6" />
            <line x1="1" y1="13" x2="8" y2="13" stroke="#BAE6FD" strokeWidth="0.6" />

            {/* Central Bus */}
            <rect x="9" y="8" width="8" height="10" rx="1.8" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" />
            <circle cx="13" cy="12" r="2.2" fill="#2563EB" stroke="#60A5FA" strokeWidth="0.6" />
            <rect x="10.5" y="15" width="5" height="2" rx="0.5" fill="#F59E0B" />

            {/* Right Solar Array */}
            <rect x="18" y="9" width="7" height="8" rx="1.2" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.8" />
            <line x1="21.5" y1="9" x2="21.5" y2="17" stroke="#BAE6FD" strokeWidth="0.6" />
            <line x1="18" y1="13" x2="25" y2="13" stroke="#BAE6FD" strokeWidth="0.6" />

            {/* Antenna with Beacon */}
            <line x1="13" y1="8" x2="13" y2="4" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
            <circle cx="13" cy="3" r="1.5" fill="#10B981" />
          </svg>
        </div>
      </div>

      {/* Central Blue Tech Badge */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #06B6D4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px -2px rgba(37, 99, 235, 0.45)',
        border: '1.5px solid rgba(255, 255, 255, 0.35)',
        zIndex: 3
      }}>
        {/* Rotating central sensor icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="satellite-spin-icon">
          <path d="M13 7 9 3 5 7l4 4" />
          <path d="m17 11 4 4-4 4-4-4" />
          <path d="m8 12 4 4 6-6-4-4Z" />
          <path d="m16 8 3-3" />
          <path d="M9 21a6 6 0 0 0-6-6" />
        </svg>
      </div>
    </div>
  );
};
