import React from 'react';

interface FloatingSatelliteIconProps {
  size?: number;
  className?: string;
}

export const FloatingSatelliteIcon: React.FC<FloatingSatelliteIconProps> = ({ size = 28, className = '' }) => {
  return (
    <div className={`floating-satellite-craft ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0 3px 6px rgba(37,99,235,0.28))' }}>
        {/* Left Solar Panel */}
        <rect x="2" y="11" width="8" height="10" rx="1.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.9" />
        <line x1="6" y1="11" x2="6" y2="21" stroke="#BAE6FD" strokeWidth="0.7" />
        <line x1="2" y1="16" x2="10" y2="16" stroke="#BAE6FD" strokeWidth="0.7" />
        
        {/* Connectors */}
        <rect x="10" y="14.5" width="2" height="3" fill="#64748B" />
        <rect x="20" y="14.5" width="2" height="3" fill="#64748B" />

        {/* Central Satellite Body */}
        <rect x="12" y="9" width="8" height="14" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.9" />
        {/* Optical Sensor Aperture */}
        <circle cx="16" cy="14" r="2.5" fill="#2563EB" stroke="#60A5FA" strokeWidth="0.8" />
        <circle cx="16" cy="14" r="1" fill="#38BDF8" />
        
        {/* Gold Thermal Multi-layer Insulation */}
        <rect x="13.5" y="18" width="5" height="3" rx="0.5" fill="#F59E0B" />

        {/* Right Solar Panel */}
        <rect x="22" y="11" width="8" height="10" rx="1.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.9" />
        <line x1="26" y1="11" x2="26" y2="21" stroke="#BAE6FD" strokeWidth="0.7" />
        <line x1="22" y1="16" x2="30" y2="16" stroke="#BAE6FD" strokeWidth="0.7" />

        {/* Communication Antenna with Signal Beacon */}
        <path d="M16 9 L16 4" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="16" cy="3" r="1.5" fill="#10B981" />
      </svg>
    </div>
  );
};
