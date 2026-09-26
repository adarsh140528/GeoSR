import React from 'react';

interface ProjectThumbnailProps {
  type: 'urban' | 'flood' | 'agri' | string;
  size?: number;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({ type, size = 38 }) => {
  if (type === 'flood') {
    return (
      <div 
        className="project-thumb" 
        style={{ width: size, height: size, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}
      >
        <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
          <rect width="38" height="38" fill="#1E293B" />
          <path d="M-2 18 Q 10 12, 19 22 T 40 16 L 40 38 L -2 38 Z" fill="#0284C7" fillOpacity="0.8" />
          <path d="M-2 24 Q 14 18, 22 28 T 40 22 L 40 38 L -2 38 Z" fill="#0369A1" />
          <circle cx="12" cy="14" r="2.5" fill="#F43F5E" />
          <circle cx="28" cy="12" r="2" fill="#F59E0B" />
          <rect x="6" y="8" width="4" height="4" rx="1" fill="#10B981" />
          <rect x="22" y="6" width="6" height="4" rx="1" fill="#10B981" />
        </svg>
      </div>
    );
  }

  if (type === 'agri') {
    return (
      <div 
        className="project-thumb" 
        style={{ width: size, height: size, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}
      >
        <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
          <rect width="38" height="38" fill="#1E293B" />
          <rect x="2" y="2" width="16" height="16" rx="2" fill="#059669" fillOpacity="0.85" />
          <rect x="20" y="2" width="16" height="10" rx="2" fill="#10B981" fillOpacity="0.7" />
          <rect x="20" y="14" width="16" height="22" rx="2" fill="#047857" />
          <rect x="2" y="20" width="16" height="16" rx="2" fill="#D97706" fillOpacity="0.8" />
          <line x1="18" y1="0" x2="18" y2="38" stroke="#334155" strokeWidth="1" />
          <line x1="0" y1="18" x2="38" y2="18" stroke="#334155" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // Default: Urban Mumbai
  return (
    <div 
      className="project-thumb" 
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}
    >
      <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
        <rect width="38" height="38" fill="#1E293B" />
        {/* Coastline / river */}
        <path d="M0 28 Q 12 24, 20 32 T 38 28 L 38 38 L 0 38 Z" fill="#0284C7" fillOpacity="0.8" />
        {/* Urban Buildings grid */}
        <rect x="4" y="5" width="7" height="6" rx="1" fill="#94A3B8" />
        <rect x="13" y="4" width="9" height="7" rx="1" fill="#CBD5E1" />
        <rect x="24" y="6" width="10" height="8" rx="1" fill="#64748B" />
        <rect x="5" y="14" width="8" height="9" rx="1" fill="#CBD5E1" />
        <rect x="15" y="13" width="11" height="8" rx="1" fill="#94A3B8" />
        <rect x="28" y="16" width="6" height="6" rx="1" fill="#E2E8F0" />
        {/* Road line */}
        <line x1="0" y1="12" x2="38" y2="12" stroke="#475569" strokeWidth="1.5" />
        <line x1="13" y1="0" x2="13" y2="28" stroke="#475569" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
