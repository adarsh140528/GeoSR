import React from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT } from '../data/mockData';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  Cpu, 
  GitCompare, 
  ShieldCheck, 
  Globe2
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate, showToast }) => {
  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      {/* ACTIONS TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Geospatial Intelligence Reports</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
            STANDARDIZED EARTH OBSERVATION AUDIT, RECONSTRUCTION CERTIFICATE, AND SPATIAL DOSSIER
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="btn btn-sm"
            onClick={() => showToast('Generated Cloud-Optimized GeoTIFF (COG) download link.')}
          >
            <Download size={12} />
            <span>EXPORT GEOTIFF</span>
          </button>
          <button 
            className="btn btn-sm"
            onClick={() => showToast('Exporting complete multi-layer GeoJSON vector bundle.')}
          >
            <Download size={12} />
            <span>EXPORT GEOJSON</span>
          </button>
          <button 
            className="btn btn-sm"
            onClick={() => showToast('Exporting high-resolution orthorectified PNG render.')}
          >
            <Download size={12} />
            <span>EXPORT PNG</span>
          </button>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => showToast('Generated official GeoSR-X Certified PDF Intelligence Dossier.')}
          >
            <Printer size={12} />
            <span>EXPORT PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="panel" style={{ backgroundColor: '#FFFFFF', padding: '24px 30px' }}>
        {/* REPORT HEADER */}
        <div style={{ borderBottom: '2px solid var(--sidebar-bg)', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="tech-label" style={{ letterSpacing: '0.08em' }}>DOSSIER ID: #2026-UM-884</div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--sidebar-bg)', marginTop: '3px' }}>
              GEOSR-X INTELLIGENCE REPORT
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--secondary-text)', marginTop: '2px' }}>
              Physics-Guided Multi-Spectral Super-Resolution & Spatial Intelligence
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-ready" style={{ fontSize: '10.5px', padding: '3px 8px' }}>
              CERTIFIED OBSERVATION
            </span>
            <div className="mono" style={{ fontSize: '10.5px', color: 'var(--secondary-text)', marginTop: '4px' }}>
              Created: 10 Sep 2026
            </div>
          </div>
        </div>

        {/* METADATA SUMMARY BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '10px 12px', backgroundColor: 'var(--surface-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
          <div>
            <div className="tech-label" style={{ fontSize: '9px' }}>PROJECT</div>
            <div style={{ fontWeight: 600, fontSize: '12px' }}>{CURRENT_PROJECT.name}</div>
          </div>
          <div>
            <div className="tech-label" style={{ fontSize: '9px' }}>SENSOR</div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '12px' }}>{CURRENT_PROJECT.sensor}</div>
          </div>
          <div>
            <div className="tech-label" style={{ fontSize: '9px' }}>ACQUISITION</div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '12px' }}>{CURRENT_PROJECT.acquisitionDate}</div>
          </div>
          <div>
            <div className="tech-label" style={{ fontSize: '9px' }}>GSD RESOLUTION</div>
            <div className="mono" style={{ fontWeight: 600, fontSize: '12px', color: 'var(--deep-sage)' }}>10m → 2.5m (4×)</div>
          </div>
        </div>

        {/* SECTION 1: SUPER RESOLUTION */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-main)', paddingBottom: '5px', marginBottom: '8px' }}>
            <Sparkles size={14} color="var(--deep-sage)" />
            <h2 style={{ fontSize: '13px', fontWeight: 700 }}>1. SUPER RESOLUTION ACCURACY & SPECTRAL RECONSTRUCTION</h2>
          </div>
          <div className="grid-split-3-2">
            <p style={{ fontSize: '11.5px', color: 'var(--secondary-text)', lineHeight: 1.5 }}>
              Physics-guided continuous transformer inversion achieved 4× spatial resolution enhancement with strict Point Spread Function (PSF) modulation constraints. Spectral fidelity is preserved across all 6 calibrated bands.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div className="metric-box">
                <div className="metric-label">PSNR</div>
                <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>32.8 dB</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SSIM</div>
                <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>0.921</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SAM</div>
                <div className="mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-sage)' }}>0.034 rad</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: GEOAI FEATURE EXTRACTIONS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-main)', paddingBottom: '5px', marginBottom: '8px' }}>
            <Cpu size={14} color="var(--deep-sage)" />
            <h2 style={{ fontSize: '13px', fontWeight: 700 }}>2. GEOAI VECTOR FEATURE EXTRACTION</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="panel" style={{ padding: '10px' }}>
              <div className="tech-label" style={{ fontSize: '9px' }}>BUILDINGS</div>
              <div className="mono" style={{ fontSize: '17px', fontWeight: 700, margin: '3px 0' }}>1,284</div>
              <div style={{ fontSize: '10.5px', color: 'var(--secondary-text)' }}>2.43 km² built footprint area at 91% IoU confidence.</div>
            </div>
            <div className="panel" style={{ padding: '10px' }}>
              <div className="tech-label" style={{ fontSize: '9px' }}>ROAD GRAPH</div>
              <div className="mono" style={{ fontSize: '17px', fontWeight: 700, margin: '3px 0' }}>438 segments</div>
              <div style={{ fontSize: '10.5px', color: 'var(--secondary-text)' }}>73.2 km total length with 87% connectivity.</div>
            </div>
            <div className="panel" style={{ padding: '10px' }}>
              <div className="tech-label" style={{ fontSize: '9px' }}>LAND COVER</div>
              <div className="mono" style={{ fontSize: '17px', fontWeight: 700, margin: '3px 0' }}>5 Classes</div>
              <div style={{ fontSize: '10.5px', color: 'var(--secondary-text)' }}>3.84 km² classified scene surface verified.</div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CHANGE ANALYSIS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-main)', paddingBottom: '5px', marginBottom: '8px' }}>
            <GitCompare size={14} color="var(--slate)" />
            <h2 style={{ fontSize: '13px', fontWeight: 700 }}>3. MULTI-TEMPORAL CHANGE AUDIT (JUN 2026 — SEP 2026)</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div className="metric-box">
              <div className="metric-label">NEW BUILDINGS</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 600 }}>12 structures</div>
              <div className="metric-sub">+46,200 m²</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">ROAD EXTENSIONS</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 600 }}>3 corridors</div>
              <div className="metric-sub">+1.8 km</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">VEGETATION CHANGES</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 600 }}>8 zones</div>
              <div className="metric-sub">-28,400 m²</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">WATER DRAINAGE</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 600 }}>4 zones</div>
              <div className="metric-sub">+19,100 m²</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: RELIABILITY & UNCERTAINTY */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-main)', paddingBottom: '5px', marginBottom: '8px' }}>
            <ShieldCheck size={14} color="var(--deep-sage)" />
            <h2 style={{ fontSize: '13px', fontWeight: 700 }}>4. RELIABILITY PROFILE & CERTIFICATION</h2>
          </div>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Reliability Tier</th>
                <th>Pixel Fraction</th>
                <th>Spatial Surface Area</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>High Confidence Tier</td>
                <td className="mono">71.4%</td>
                <td className="mono">1.73 km²</td>
                <td style={{ textAlign: 'right' }}><span className="badge badge-ready">VERIFIED</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--warning)' }}>Moderate Uncertainty Tier</td>
                <td className="mono">21.8%</td>
                <td className="mono">0.53 km²</td>
                <td style={{ textAlign: 'right' }}><span className="badge badge-warning">CAUTION</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--critical)' }}>High Uncertainty (Shadows)</td>
                <td className="mono">6.8%</td>
                <td className="mono">0.17 km²</td>
                <td style={{ textAlign: 'right' }}><span className="badge badge-critical">FLAGGED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
