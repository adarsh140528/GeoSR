import React, { useState } from 'react';
import { 
  Home, 
  FolderKanban, 
  Sliders, 
  Sparkles, 
  Cpu, 
  GitCompare, 
  Globe2, 
  FileText, 
  Settings, 
  HelpCircle, 
  Satellite, 
  CheckCircle2, 
  Layers, 
  Database 
} from 'lucide-react';
import { CURRENT_PROJECT } from '../data/mockData';

export type RouteId = 
  | 'mission-control'
  | 'projects'
  | 'project-workspace'
  | 'project-setup'
  | 'super-resolution'
  | 'geoai'
  | 'change-detection'
  | 'domain'
  | 'reports';

interface AppShellProps {
  currentRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  toastMessage: string | null;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  toastMessage,
  children
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const navItems = [
    { id: 'mission-control' as RouteId, label: 'Overview', icon: Home },
    { id: 'projects' as RouteId, label: 'Projects', icon: FolderKanban },
    { id: 'project-setup' as RouteId, label: 'Setup & Quality', icon: Sliders },
    { id: 'super-resolution' as RouteId, label: 'Super Resolution', icon: Sparkles },
    { id: 'geoai' as RouteId, label: 'GeoAI', icon: Cpu },
    { id: 'change-detection' as RouteId, label: 'Change Detection', icon: GitCompare },
    { id: 'domain' as RouteId, label: 'Domain Models', icon: Globe2 },
    { id: 'reports' as RouteId, label: 'Reports', icon: FileText }
  ];

  return (
    <div className="app-layout">
      {/* MODERN LIGHT HEADER */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo & Brand */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}
            onClick={() => onNavigate('mission-control')}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}>
              <Satellite size={17} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                GeoSR-X
              </span>
            </div>
          </div>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-subtle)' }} />

          {/* ACTIVE DATASET STATUS PILLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="pill-badge pill-blue">
              <Database size={11} />
              <span>{CURRENT_PROJECT.sensor}</span>
            </span>
            <span className="pill-badge pill-green">
              <Layers size={11} />
              <span>{CURRENT_PROJECT.resolution} → 2.5 m (4×)</span>
            </span>
            <span className="pill-badge pill-purple">
              <span>{CURRENT_PROJECT.crs}</span>
            </span>
          </div>
        </div>

        {/* RIGHT CONTROLS & SYSTEM HEALTH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pill-badge pill-green" style={{ padding: '4px 11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-pulse-dot" />
            <span style={{ fontSize: '11.5px', fontWeight: 600 }}>System Ready</span>
          </div>

          <button 
            className="btn btn-sm btn-secondary" 
            title="Settings & Checkpoints"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>
          
          <button 
            className="btn btn-sm btn-secondary" 
            title="Model Documentation"
            onClick={() => setShowHelpModal(true)}
          >
            <HelpCircle size={13} />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (SIDEBAR + WORKSPACE) */}
      <div className="app-main">
        {/* MODERN SIDEBAR WITH ORBIT FOOTER MOTIF */}
        <aside className="app-sidebar">
          <nav className="nav-group">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id || 
                (item.id === 'projects' && currentRoute === 'project-workspace');
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* SIDEBAR FOOTER WITH ORBIT MOTIF */}
          <div className="sidebar-orbit-footer">
            <svg width="100%" height="24" viewBox="0 0 180 24" style={{ position: 'absolute', top: '8px', left: 0, opacity: 0.35 }}>
              <path d="M 0 20 Q 90 2, 180 20" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="3 3" />
            </svg>
            <div className="sidebar-orbit-dot" />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontWeight: 700, fontSize: '11px', color: 'var(--text-primary)' }}>GeoSR-X Runtime</div>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>CUDA 12.2 • SEN2SR v2.4</div>
            </div>
          </div>
        </aside>

        {/* CONTENT WORKSPACE */}
        <main className="app-content">
          {children}
        </main>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={16} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Model & System Settings</span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '16px' }}
                onClick={() => setShowSettingsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body flex-col" style={{ gap: '14px' }}>
              <div>
                <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Active Super-Resolution Checkpoint</label>
                <select style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none', backgroundColor: '#FFFFFF' }}>
                  <option>SEN2SR-Transformer-4X-V2.4.pt (Default)</option>
                  <option>SEN2SR-PhysicsGuided-Reflectance-L2A.pt</option>
                  <option>Bicubic Baseline Interpolator</option>
                </select>
              </div>

              <div>
                <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Compute Acceleration</label>
                <select style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none', backgroundColor: '#FFFFFF' }}>
                  <option>NVIDIA RTX GPU (CUDA 12.2 Accelerated)</option>
                  <option>CPU Fallback (Float32)</option>
                </select>
              </div>

              <div>
                <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Tiling & Batch Size</label>
                <select style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none', backgroundColor: '#FFFFFF' }}>
                  <option>512 × 512 px (Overlap: 64 px)</option>
                  <option>256 × 256 px (Low VRAM)</option>
                  <option>1024 × 1024 px (High VRAM)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowSettingsModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowSettingsModal(false)}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTATION MODAL */}
      {showHelpModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>GeoSR-X Architecture & Documentation</span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '16px' }}
                onClick={() => setShowHelpModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body flex-col" style={{ gap: '12px', fontSize: '12.5px', lineHeight: '1.55' }}>
              <p>
                <strong>GeoSR-X</strong> delivers 4× spatial resolution enhancement for Sentinel-2 L2A multi-spectral observations (10m → 2.5m Ground Sampling Distance).
              </p>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>End-to-End Processing Stages:</div>
                <ol style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-secondary)' }}>
                  <li>Radiometric calibration and atmospheric verification</li>
                  <li>Multi-band radiance continuous representation</li>
                  <li>Spatial transformer high-frequency edge synthesis</li>
                  <li>Point Spread Function (PSF) modulation bounds</li>
                  <li>Epistemic uncertainty & variance heatmap calculation</li>
                  <li>GeoAI building footprint and road graph vector extraction</li>
                </ol>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowHelpModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
