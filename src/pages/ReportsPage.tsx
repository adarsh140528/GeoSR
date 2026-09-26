import React from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT } from '../data/mockData';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
  Download, 
  Printer, 
  Sparkles, 
  Cpu, 
  GitCompare, 
  ShieldCheck 
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate, showToast }) => {
  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="slate"
        categoryText="ANALYSIS SUMMARY & CERTIFICATES"
        title="Reports &"
        titleGradientText="Export"
        subtitle="Super-resolution audit report, feature extraction summaries, and downloadable packages"
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => showToast('Generated Cloud-Optimized GeoTIFF (COG) download.')}
            >
              <Download size={13} />
              <span>Export GeoTIFF</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => showToast('Exporting complete multi-layer GeoJSON vector bundle.')}
            >
              <Download size={13} />
              <span>Export GeoJSON</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => showToast('Exporting high-resolution PNG render.')}
            >
              <Download size={13} />
              <span>Export PNG</span>
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <Printer size={13} />
              <span>Print Report</span>
            </button>
          </div>
        }
      />

      {/* REPORT CONTAINER */}
      <div className="panel" style={{ padding: '28px 34px' }}>
        {/* DOCUMENT HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '18px', marginBottom: '22px' }}>
          <div>
            <div className="tech-label" style={{ fontSize: '11px', color: 'var(--primary-blue)' }}>GEOSR-X EARTH OBSERVATION SYSTEM</div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>PROJECT ANALYSIS REPORT</h1>
            <div className="mono" style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
              DOC REF: GEOSR-REPORT-2026-0925 • GENERATED: 25 SEP 2026
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="pill-badge pill-green" style={{ fontSize: '12px', padding: '5px 10px' }}>STATUS: VERIFIED</span>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>EPSG:32643 (UTM Zone 43N)</div>
          </div>
        </div>

        {/* METADATA GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', padding: '14px 18px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', marginBottom: '22px', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="tech-label" style={{ fontSize: '9.5px' }}>PROJECT</div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>{CURRENT_PROJECT.name}</div>
          </div>
          <div>
            <div className="tech-label" style={{ fontSize: '9.5px' }}>SENSOR</div>
            <div className="mono" style={{ fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>{CURRENT_PROJECT.sensor}</div>
          </div>
          <div>
            <div className="tech-label" style={{ fontSize: '9.5px' }}>ACQUISITION</div>
            <div className="mono" style={{ fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>{CURRENT_PROJECT.acquisitionDate}</div>
          </div>
          <div>
            <div className="tech-label" style={{ fontSize: '9.5px' }}>RESOLUTION</div>
            <div className="mono" style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-blue)', marginTop: '2px' }}>10m → 2.5m (4×)</div>
          </div>
        </div>

        {/* SECTION 1: SUPER RESOLUTION */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            <Sparkles size={15} color="var(--primary-blue)" />
            <h2 style={{ fontSize: '14px', fontWeight: 800 }}>1. SUPER-RESOLUTION & QUALITY METRICS</h2>
          </div>
          <div className="grid-split-3-2">
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              SEN2SR Continuous Transformer enhancement achieved 4× spatial resolution increase with Point Spread Function (PSF) modulation constraints. Radiometric consistency validated across all calibrated bands.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="metric-box">
                <div className="metric-label">PSNR</div>
                <div className="mono" style={{ fontSize: '16px', fontWeight: 700 }}>32.8 dB</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SSIM</div>
                <div className="mono" style={{ fontSize: '16px', fontWeight: 700 }}>0.921</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SAM</div>
                <div className="mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-blue)' }}>0.034 rad</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: GEOAI FEATURE EXTRACTIONS */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            <Cpu size={15} color="#8B5CF6" />
            <h2 style={{ fontSize: '14px', fontWeight: 800 }}>2. GEOAI FEATURE EXTRACTIONS</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="panel" style={{ padding: '12px 16px' }}>
              <div className="tech-label" style={{ fontSize: '9.5px' }}>BUILDINGS</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>1,284</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>2.43 km² built footprint area at 91% IoU confidence.</div>
            </div>
            <div className="panel" style={{ padding: '12px 16px' }}>
              <div className="tech-label" style={{ fontSize: '9.5px' }}>ROAD GRAPH</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>438 segments</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>73.2 km total length with 87% connectivity.</div>
            </div>
            <div className="panel" style={{ padding: '12px 16px' }}>
              <div className="tech-label" style={{ fontSize: '9.5px' }}>LAND COVER</div>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>5 Classes</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>3.84 km² classified scene surface verified.</div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CHANGE DETECTION */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            <GitCompare size={15} color="#0D9488" />
            <h2 style={{ fontSize: '14px', fontWeight: 800 }}>3. CHANGE DETECTION AUDIT (JUN 2026 – SEP 2026)</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div className="metric-box">
              <div className="metric-label">NEW BUILDINGS</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>12 structures</div>
              <div className="metric-sub mono">+46,200 m²</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">ROAD EXTENSIONS</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>3 corridors</div>
              <div className="metric-sub mono">+1.8 km</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">VEGETATION CHANGES</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>8 zones</div>
              <div className="metric-sub mono">-28,400 m²</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">WATER DRAINAGE</div>
              <div className="mono" style={{ fontSize: '15px', fontWeight: 700 }}>4 zones</div>
              <div className="metric-sub mono">+19,100 m²</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: RELIABILITY */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            <ShieldCheck size={15} color="#10B981" />
            <h2 style={{ fontSize: '14px', fontWeight: 800 }}>4. CONFIDENCE & QUALITY BREAKDOWN</h2>
          </div>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Confidence Tier</th>
                <th>Pixel Fraction</th>
                <th>Surface Area</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: '#047857' }}>High Confidence Tier</td>
                <td className="mono">71.4%</td>
                <td className="mono">1.73 km²</td>
                <td style={{ textAlign: 'right' }}><span className="pill-badge pill-green">Verified</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#B45309' }}>Moderate Uncertainty</td>
                <td className="mono">21.8%</td>
                <td className="mono">0.53 km²</td>
                <td style={{ textAlign: 'right' }}><span className="pill-badge pill-amber">Caution</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#BE123C' }}>High Uncertainty (Shadows)</td>
                <td className="mono">6.8%</td>
                <td className="mono">0.17 km²</td>
                <td style={{ textAlign: 'right' }}><span className="pill-badge pill-rose">Flagged</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
