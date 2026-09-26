import React from 'react';
import { FloatingSatelliteIcon } from './FloatingSatelliteIcon';

interface PageHeaderHeroProps {
  accentColor?: 'blue' | 'teal' | 'emerald' | 'mint' | 'purple' | 'indigo' | 'amber' | 'coral' | 'rose' | 'slate';
  categoryText: string;
  title: string;
  titleGradientText?: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  rightAction?: React.ReactNode;
  showFloatingSatellite?: boolean;
}

export const PageHeaderHero: React.FC<PageHeaderHeroProps> = ({
  accentColor = 'blue',
  categoryText,
  title,
  titleGradientText,
  subtitle,
  description,
  actions,
  rightAction,
  showFloatingSatellite = true
}) => {
  const displayText = subtitle || description;
  const displayActions = actions || rightAction;

  return (
    <div className="page-hero-banner hero-container" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      {/* Photographic Space / Earth Atmospheric Backdrop */}
      <div className="hero-space-photo-bg" />

      {/* Left Title & Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
        <div className="section-accent" style={{ marginBottom: '4px' }}>
          <span className={`accent-bar accent-bar-${accentColor === 'mint' ? 'mint' : accentColor === 'indigo' ? 'indigo' : accentColor === 'teal' ? 'teal' : 'blue'}`} />
          <span className="tech-label" style={{ fontWeight: 700, color: 'var(--cobalt-blue)' }}>
            {categoryText}
          </span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-navy)', letterSpacing: '-0.025em' }}>
          {title} {titleGradientText && <span className="gradient-text">{titleGradientText}</span>}
        </h1>

        {displayText && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', lineHeight: 1.55 }}>
            {displayText}
          </p>
        )}
      </div>

      {/* Right Actions with Floating Satellite */}
      {displayActions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
          {showFloatingSatellite && <FloatingSatelliteIcon size={24} />}
          {displayActions}
        </div>
      )}
    </div>
  );
};
