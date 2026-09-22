import React from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, PROJECTS_DATA } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { 
  ArrowRight, 
  Sparkles, 
  GitCompare, 
  Globe2, 
  FileText, 
  Cpu,
  CheckCircle2,
  FolderKanban,
  Plus
} from 'lucide-react';

interface MissionControlPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({ onNavigate, showToast }) => {
  const systemServices = [
    { name: 'Data Ingestion & Calibration Pipeline', status: 'Ready', desc: 'Sentinel-2 L2A BOA / Landsat 8/9 ingestion' },
    { name: 'GeoSR-X Physics Neural Engine', status: 'Ready', desc: 'Continuous spectral-spatial 4× super-resolution' },
    { name: 'GeoAI Multi-Task Feature Services', status: 'Ready', desc: 'Building footprint polygonization & road graphs' },
    { name: 'Multi-Format Export Services', status: 'Ready', desc: 'Cloud-Optimized GeoTIFF, GeoJSON & PDF dossiers' }
  ];

  const recentProjects = [
    { name: 'Urban Mumbai', type: 'Urban Intelligence', sensor: 'Sentinel-2 L2A', status: 'Active', updated: '10 Sep 2026', route: 'project-workspace' as RouteId },
    { name: 'Thane Flood Study', type: 'Disaster Intelligence', sensor: 'Sentinel-2 L2A', status: 'Completed', updated: '18 Aug 2026', route: 'domain' as RouteId },
    { name: 'Nashik Agriculture', type: 'Agriculture Intelligence', sensor: 'Sentinel-2 L2A', status: 'Processing', updated: '05 Sep 2026', route: 'domain' as RouteId }
  ];

  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '19px', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Mission Control
          </h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px', marginTop: '2px' }}>
            PHYSICS-GUIDED SPECTRAL-SPATIAL SUPER-RESOLUTION & GEO-INTELLIGENCE PLATFORM
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('projects')}>
            <FolderKanban size={13} />
            <span>ALL PROJECTS</span>
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('project-setup')}>
            <Plus size={13} />
            <span>NEW ANALYSIS</span>
          </button>
        </div>
      </div>

      {/* CURRENT PROJECT HERO PANEL */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">CURRENT ACTIVE PROJECT</span>
          <span className="badge badge-ready">ANALYSIS READY</span>
        </div>
        <div className="panel-body" style={{ padding: '16px' }}>
          <div className="grid-split-3-2">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="tech-label" style={{ marginBottom: '3px' }}>TARGET REGION & DATASET</div>
                <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{CURRENT_PROJECT.name}</h2>
                
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-muted">SENSOR: {CURRENT_PROJECT.sensor}</span>
                  <span className="badge badge-ready">RESOLUTION: {CURRENT_PROJECT.resolution} → 2.5m</span>
                  <span className="badge badge-slate">CRS: {CURRENT_PROJECT.crs}</span>
                  <span className="badge badge-muted">ACQ: {CURRENT_PROJECT.acquisitionDate}</span>
                </div>

                <p style={{ color: 'var(--secondary-text)', fontSize: '12px', marginTop: '12px', lineHeight: 1.5 }}>
                  Physics-constrained super-resolution model configured with 6 multispectral bands. Point spread function (PSF) and atmospheric radiative transfer bounds validated with 4.2% cloud coverage.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => onNavigate('project-workspace')}
                >
                  <span>OPEN PROJECT</span>
                  <ArrowRight size={13} />
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => onNavigate('super-resolution')}
                >
                  <span>SUPER RESOLUTION LAB</span>
                </button>
                <button 
                  className="btn"
                  onClick={() => onNavigate('project-setup')}
                >
                  <span>SETUP & QA</span>
                </button>
              </div>
            </div>

            {/* Map Mini Preview */}
            <div>
              <GisMapCanvas 
                mode="2.5m-geosr"
                height={200}
                title="URBAN MUMBAI 2.5m"
                badgeText="PSNR 32.8 dB"
                showControls={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SUMMARY: RECENT PROJECTS & SYSTEM STATUS */}
      <div className="grid-split-3-2">
        {/* RECENT PROJECTS */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">RECENT PROJECTS</span>
            <button className="btn btn-xs" onClick={() => onNavigate('projects')}>View All</button>
          </div>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Analysis Domain</th>
                <th>Sensor</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <strong style={{ color: 'var(--primary-text)' }}>{p.name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--secondary-text)' }}>Updated: {p.updated}</div>
                  </td>
                  <td>{p.type}</td>
                  <td className="mono">{p.sensor}</td>
                  <td>
                    <span className={`badge ${p.status === 'Active' ? 'badge-ready' : p.status === 'Completed' ? 'badge-slate' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-xs"
                      onClick={() => onNavigate(p.route)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYSTEM STATUS SERVICES */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">SYSTEM STATUS & CORE SERVICES</span>
            <span className="badge badge-ready">ALL OPERATIONAL</span>
          </div>
          <div className="panel-body flex-col" style={{ gap: '8px' }}>
            {systemServices.map((srv, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '11.5px' }}>{srv.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--secondary-text)' }}>{srv.desc}</div>
                </div>
                <span className="badge badge-ready" style={{ fontSize: '9px' }}>READY</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PLATFORM CAPABILITIES STRIP */}
      <div>
        <div className="tech-label" style={{ marginBottom: '8px' }}>PLATFORM CAPABILITIES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          <div className="panel" style={{ cursor: 'pointer', padding: '12px' }} onClick={() => onNavigate('super-resolution')}>
            <Sparkles size={16} color="var(--deep-sage)" style={{ marginBottom: '6px' }} />
            <div style={{ fontWeight: 600, fontSize: '12px' }}>Super Resolution</div>
            <div style={{ color: 'var(--secondary-text)', fontSize: '11px', marginTop: '2px' }}>10m → 2.5m physics reconstruction.</div>
          </div>

          <div className="panel" style={{ cursor: 'pointer', padding: '12px' }} onClick={() => onNavigate('geoai')}>
            <Cpu size={16} color="var(--deep-sage)" style={{ marginBottom: '6px' }} />
            <div style={{ fontWeight: 600, fontSize: '12px' }}>GeoAI Analysis</div>
            <div style={{ color: 'var(--secondary-text)', fontSize: '11px', marginTop: '2px' }}>Building & road graph extractions.</div>
          </div>

          <div className="panel" style={{ cursor: 'pointer', padding: '12px' }} onClick={() => onNavigate('change-detection')}>
            <GitCompare size={16} color="var(--slate)" style={{ marginBottom: '6px' }} />
            <div style={{ fontWeight: 600, fontSize: '12px' }}>Change Detection</div>
            <div style={{ color: 'var(--secondary-text)', fontSize: '11px', marginTop: '2px' }}>Multi-temporal delta mapping.</div>
          </div>

          <div className="panel" style={{ cursor: 'pointer', padding: '12px' }} onClick={() => onNavigate('domain')}>
            <Globe2 size={16} color="var(--primary-sage)" style={{ marginBottom: '6px' }} />
            <div style={{ fontWeight: 600, fontSize: '12px' }}>Domain Intelligence</div>
            <div style={{ color: 'var(--secondary-text)', fontSize: '11px', marginTop: '2px' }}>Disaster, Agriculture & Urban models.</div>
          </div>

          <div className="panel" style={{ cursor: 'pointer', padding: '12px' }} onClick={() => onNavigate('reports')}>
            <FileText size={16} color="var(--secondary-text)" style={{ marginBottom: '6px' }} />
            <div style={{ fontWeight: 600, fontSize: '12px' }}>Reports</div>
            <div style={{ color: 'var(--secondary-text)', fontSize: '11px', marginTop: '2px' }}>Standardized intelligence dossiers.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
