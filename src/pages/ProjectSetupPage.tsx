import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, QUALITY_CHECKS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
  FileCheck, 
  ArrowRight, 
  CloudSun, 
  Check, 
  Database, 
  Layers 
} from 'lucide-react';

interface ProjectSetupPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ProjectSetupPage: React.FC<ProjectSetupPageProps> = ({ onNavigate, showToast }) => {
  const [activeMask, setActiveMask] = useState<'none' | 'cloud' | 'haze' | 'valid'>('cloud');

  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="blue"
        categoryText="DATA CALIBRATION & INGESTION"
        title="Setup & Quality"
        titleGradientText="Assurance"
        subtitle="Raster specifications, radiometric metadata, and atmospheric quality verification"
        actions={
          <button 
            className="btn btn-primary"
            onClick={() => {
              showToast('Setup verified (Score 94/100). Opening Super Resolution Lab.');
              onNavigate('super-resolution');
            }}
          >
            <span>Continue to Super Resolution</span>
            <ArrowRight size={13} />
          </button>
        }
      />

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid-split-3-2">
        {/* LEFT: DROPZONE & QUALITY MASK MAP */}
        <div className="flex-col" style={{ gap: '16px' }}>
          {/* Active File Card */}
          <div className="panel" style={{ padding: '16px' }}>
            <div style={{
              border: '1px dashed #CBD5E1',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                  <FileCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>sentinel2_urban_mumbai_20260910.tif</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Cloud-Optimized GeoTIFF (COG) • 284.6 MB • 6 Optical Bands • Surface Reflectance
                  </div>
                </div>
              </div>
              <span className="pill-badge pill-green">Verified</span>
            </div>
          </div>

          {/* Quality Mask Satellite Canvas */}
          <div className="panel">
            <div className="panel-header">
              <div className="section-accent">
                <span className="accent-bar accent-bar-teal" />
                <span className="panel-title">Quality Masks & Atmospheric Analysis</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  className={`btn btn-xs ${activeMask === 'cloud' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveMask('cloud')}
                >
                  Cloud Mask (4.2%)
                </button>
                <button 
                  className={`btn btn-xs ${activeMask === 'haze' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveMask('haze')}
                >
                  Haze Index (0.12)
                </button>
                <button 
                  className={`btn btn-xs ${activeMask === 'valid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveMask('valid')}
                >
                  Clear Extent
                </button>
              </div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <GisMapCanvas 
                mode="10m-raw" 
                height={340} 
                title="Raw 10m Scene QA"
                badgeText={`Mask: ${activeMask.toUpperCase()}`}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: METADATA SPECIFICATIONS & AUDIT CHECKLIST */}
        <div className="flex-col" style={{ gap: '16px' }}>
          {/* Metadata Grid */}
          <div className="panel">
            <div className="panel-header">
              <div className="section-accent">
                <span className="accent-bar accent-bar-purple" />
                <span className="panel-title">Dataset Specifications</span>
              </div>
              <span className="pill-badge pill-purple">EPSG:32643</span>
            </div>
            <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="metric-box">
                <div className="metric-label">SENSOR</div>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{CURRENT_PROJECT.sensor}</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">NATIVE RESOLUTION</div>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{CURRENT_PROJECT.resolution} GSD</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">ACQUISITION DATE</div>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{CURRENT_PROJECT.acquisitionDate}</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">CLOUD COVER</div>
                <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{CURRENT_PROJECT.cloudCoverage}</div>
              </div>
            </div>
          </div>

          {/* Quality Audit Checklist */}
          <div className="panel">
            <div className="panel-header">
              <div className="section-accent">
                <span className="accent-bar accent-bar-emerald" />
                <span className="panel-title">Quality Assurance Checklist</span>
              </div>
              <span className="pill-badge pill-green">Score: 94 / 100</span>
            </div>
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Audit Metric</th>
                  <th>Observed</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {QUALITY_CHECKS.map((chk, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{chk.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Threshold: {chk.threshold}</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 700 }}>{chk.value}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="pill-badge pill-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} strokeWidth={2.5} />
                        <span>Pass</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
