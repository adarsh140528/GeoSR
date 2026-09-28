import React from 'react';

interface FloatingSatelliteIconProps {
  size?: number;
  className?: string;
}

export const FloatingSatelliteIcon: React.FC<FloatingSatelliteIconProps> = ({ size = 28, className = '' }) => {
  return (
    <div className={`floating-satellite-craft ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle' }}>
      <img 
        src="/logo.png" 
        alt="GeoSR Logo" 
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};
