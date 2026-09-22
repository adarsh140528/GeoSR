import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, QUALITY_CHECKS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { 
  UploadCloud, 
  FileCheck, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  CloudSun, 
  Database,
  MapPin,
  Sparkles
} from 'lucide-react';

interface ProjectSetupPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ProjectSetupPage: React.FC<ProjectSetupPageProps> = ({ onNavigate, showToast }) => {
  const [activeMask, setActiveMask] = useState<'none' | 'cloud' | 'haze' | 'valid'>('cloud');

  const bandsMetadata = [
    { band: 'B02', name: 'Blue (490 nm)', res: '10 m', bits: '16-bit UINT' },
    { band: 'B03', name: 'Green (560 nm)', res: '10 m', bits: '16-bit UINT' },
    { band: 'B04', name: 'Red (665 nm)', res: '10 m', bits: '16-bit UINT' },
    { band: 'B08', name: 'NIR (842 nm)', res: '10 m', bits: '16-bit UINT' },
    { band: 'B11', name: 'SWIR-1 (1610 nm)', res: '20 m', bits: '16-bit UINT' },
    { band: 'B12', name: 'SWIR-2 (2190 nm)', res: '20 m', bits: '16-bit UINT' }
  ];

  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Project Setup & Data Quality Check</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
            RASTER INGESTION, CALIBRATION METADATA, AND ATMOSPHERIC RADIOMETRIC INTEGRITY
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            showToast('Setup verified (Score 94/100). Launching Super Resolution Lab.');
            onNavigate('super-resolution');
          }}
        >
          <span>CONTINUE TO SUPER RESOLUTION</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* COMBINED TWO COLUMN WORKSPACE: LEFT (UPLOAD & PREVIEW) | RIGHT (METADATA & QA) */}
      <div className="grid-split-3-2">
        {/* LEFT: DATASET DROPZONE & SCENE QA CANVAS */}
        <div className="flex-col" style={{ gap: '14px' }}>
          {/* Active File Ingested */}
          <div className="panel" style={{ padding: '14px' }}>
            <div style={{
              border: '1px dashed var(--border-main)',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '4px', backgroundColor: 'var(--soft-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-sage)' }}>
                  <FileCheck size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>sentinel2_urban_mumbai_20260910.tif</div>
                  <div style={{ fontSize: '11px', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    Cloud-Optimized GeoTIFF (COG) · 284.6 MB · 6 Optical/SWIR Channels · BOA Reflectance
                  </div>
                </div>
              </div>
              <span className="badge badge-ready">VERIFIED</span>
            </div>
          </div>

          {/* Satellite Map with Quality Mask Toggles */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <CloudSun size={14} color="var(--deep-sage)" />
                <span>SCENE QUALITY RASTER & MASKS</span>
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  className={`btn btn-xs ${activeMask === 'cloud' ? 'btn-primary' : ''}`}
                  onClick={() => setActiveMask('cloud')}
                >
                  Cloud Mask (4.2%)
                </button>
                <button 
                  className={`btn btn-xs ${activeMask === 'haze' ? 'btn-primary' : ''}`}
                  onClick={() => setActiveMask('haze')}
                >
                  Haze (0.12)
                </button>
                <button 
                  className={`btn btn-xs ${activeMask === 'valid' ? 'btn-primary' : ''}`}
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
                title="RAW 10M SCENE QA"
                badgeText={`MASK: ${activeMask.toUpperCase()}`}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: DATASET METADATA & SCIENTIFIC QUALITY CHECKLIST */}
        <div className="flex-col" style={{ gap: '14px' }}>
          {/* Metadata Grid */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">DATASET SPECIFICATION</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--secondary-text)' }}>EPSG:32643</span>
            </div>
            <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <div className="metric-box">
                <div className="tech-label" style={{ fontSize: '9px' }}>CONSTELLATION / SENSOR</div>
                <div className="mono" style={{ fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{CURRENT_PROJECT.sensor}</div>
              </div>
              <div className="metric-box">
                <div className="tech-label" style={{ fontSize: '9px' }}>NATIVE RESOLUTION</div>
                <div className="mono" style={{ fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{CURRENT_PROJECT.resolution} GSD</div>
              </div>
              <div className="metric-box">
                <div className="tech-label" style={{ fontSize: '9px' }}>ACQUISITION DATE</div>
                <div className="mono" style={{ fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{CURRENT_PROJECT.acquisitionDate}</div>
              </div>
              <div className="metric-box">
                <div className="tech-label" style={{ fontSize: '9px' }}>CLOUD COVERAGE</div>
                <div className="mono" style={{ fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{CURRENT_PROJECT.cloudCoverage}</div>
              </div>
            </div>
          </div>

          {/* Quality Audit Checklist */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">DATA QUALITY AUDIT</span>
              <span className="badge badge-ready">SCORE: 94 / 100</span>
            </div>
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Audit Parameter</th>
                  <th>Observed</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {QUALITY_CHECKS.map((chk, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{chk.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--secondary-text)' }}>Threshold: {chk.threshold}</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>{chk.value}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="badge badge-ready" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Check size={11} />
                        PASS
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
