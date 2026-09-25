import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Cpu,
  GitCompare,
  Globe2,
  FileText,
  CheckCircle2,
  Settings,
  Layers,
  ChevronRight
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

export interface NavItemConfig {
  id: RouteId;
  label: string;
  icon: React.ElementType;
  section: string;
  breadcrumb: string[];
}

export const SIDEBAR_ITEMS: NavItemConfig[] = [
  { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard, section: 'OVERVIEW', breadcrumb: ['MISSION CONTROL'] },
  { id: 'projects', label: 'Projects', icon: FolderKanban, section: 'WORKSPACE', breadcrumb: ['WORKSPACE', 'PROJECTS'] },
  { id: 'super-resolution', label: 'Super Resolution', icon: Sparkles, section: 'ANALYSIS', breadcrumb: ['PROJECTS', 'URBAN MUMBAI', 'SUPER RESOLUTION'] },
  { id: 'geoai', label: 'GeoAI Analysis', icon: Cpu, section: 'ANALYSIS', breadcrumb: ['PROJECTS', 'URBAN MUMBAI', 'GEOAI ANALYSIS'] },
  { id: 'change-detection', label: 'Change Detection', icon: GitCompare, section: 'ANALYSIS', breadcrumb: ['PROJECTS', 'URBAN MUMBAI', 'CHANGE DETECTION'] },
  { id: 'domain', label: 'Domain Intelligence', icon: Globe2, section: 'INTELLIGENCE', breadcrumb: ['PROJECTS', 'URBAN MUMBAI', 'DOMAIN INTELLIGENCE'] },
  { id: 'reports', label: 'Reports', icon: FileText, section: 'OUTPUT', breadcrumb: ['PROJECTS', 'URBAN MUMBAI', 'INTELLIGENCE REPORTS'] }
];

export const PROJECT_TABS: { id: RouteId; label: string }[] = [
  { id: 'project-workspace', label: 'Overview' },
  { id: 'project-setup', label: 'Setup & Quality' },
  { id: 'super-resolution', label: 'Super Resolution' },
  { id: 'geoai', label: 'GeoAI' },
  { id: 'change-detection', label: 'Change Detection' },
  { id: 'domain', label: 'Domain' },
  { id: 'reports', label: 'Reports' }
];

interface AppShellProps {
  currentRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  children: React.ReactNode;
  toastMessage?: string | null;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  children,
  toastMessage
}) => {
  const sections = Array.from(new Set(SIDEBAR_ITEMS.map(n => n.section)));
  const isProjectContext = currentRoute !== 'mission-control' && currentRoute !== 'projects';

  const getBreadcrumbs = () => {
    if (currentRoute === 'mission-control') return ['MISSION CONTROL'];
    if (currentRoute === 'projects') return ['WORKSPACE', 'PROJECTS'];
    const subTab = PROJECT_TABS.find(t => t.id === currentRoute);
    return ['PROJECTS', 'URBAN MUMBAI', subTab?.label.toUpperCase() || 'WORKSPACE'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="app-layout">
      {/* STREAMLINED SIDEBAR (ONLY 6 PRIMARY DESTINATIONS) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-title">
            <span>GeoSR-X</span>
            <span className="brand-badge">PRO</span>
          </div>
          <div className="brand-subtitle">GEOSPATIAL INTELLIGENCE</div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(sec => (
            <div key={sec} className="nav-section">
              <div className="nav-section-title">{sec}</div>
              {SIDEBAR_ITEMS.filter(n => n.section === sec).map(item => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id || 
                  (item.id === 'projects' && currentRoute === 'project-workspace');
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon className="nav-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text" style={{ fontSize: '11px', fontWeight: 500 }}>SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="main-wrapper">
        {/* DEMO MODE NOTICE BANNER */}
        <div style={{
          backgroundColor: 'rgba(183, 122, 50, 0.18)',
          borderBottom: '1px solid var(--warning)',
          color: '#E8CA97',
          padding: '4px 16px',
          fontSize: '10.5px',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: '0.04em'
        }}>
          <div>
            <strong>DEMO MODE ACTIVE:</strong> SIMULATED MODEL RECONSTRUCTION & METRICS — NOT A MEASURED MODEL RESULT
          </div>
          <div style={{ opacity: 0.8 }}>
            SEN2SR Sentinel-2 Reference Model (2.5m)
          </div>
        </div>

        {/* COMPACT TOP HEADER */}
        <header className="top-header">
          <div className="breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="breadcrumb-separator">/</span>}
                <span 
                  className={idx === breadcrumbs.length - 1 ? 'breadcrumb-current' : 'breadcrumb-item'}
                  onClick={() => {
                    if (idx === 0 && crumb === 'PROJECTS') onNavigate('projects');
                    if (idx === 1 && crumb === 'URBAN MUMBAI') onNavigate('project-workspace');
                  }}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="header-meta">
            <div className="meta-pill">
              <span>DATASET:</span>
              <strong>{CURRENT_PROJECT.sensor}</strong>
            </div>
            <div className="meta-pill">
              <span>ACQ:</span>
              <strong>{CURRENT_PROJECT.acquisitionDate}</strong>
            </div>
            <div className="meta-pill">
              <span>STATUS:</span>
              <strong style={{ color: 'var(--deep-sage)' }}>READY</strong>
            </div>
          </div>
        </header>

        {/* CONTEXTUAL PROJECT NAVIGATION BAR (WHEN INSIDE A PROJECT) */}
        {isProjectContext && (
          <div className="project-subnav-bar">
            {PROJECT_TABS.map(tab => {
              const isActive = currentRoute === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`project-subnav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(tab.id)}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* MAIN PAGE CONTAINER */}
        <main className="content-container">
          {children}
        </main>
      </div>

      {/* TOAST NOTIFICATION CONTAINER */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 size={15} color="var(--primary-sage)" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
