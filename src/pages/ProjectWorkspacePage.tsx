import React from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, GEOAI_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Settings, 
  ChevronRight, 
  Layers, 
  Database, 
  Calendar, 
  Compass 
} from 'lucide-react';

interface ProjectWorkspacePageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({ onNavigate, showToast }) => {
  const workflowSteps = [
    { label: 'Data Ingestion', status: 'completed', route: 'project-setup' as RouteId },
    { label: 'Quality Calibration', status: 'completed', route: 'project-setup' as RouteId },
    { label: 'Super Resolution', status: 'completed', route: 'super-resolution' as RouteId },
    { label: 'GeoAI Features', status: 'completed', route: 'geoai' as RouteId },
    { label: 'Change Detection', status: 'completed', route: 'change-detection' as RouteId },
    { label: 'Reports & Export', status: 'ready', route: 'reports' as RouteId }
  ];

  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="blue"
        categoryText="PROJECT WORKSPACE"
        title={CURRENT_PROJECT.name}
        subtitle={`${CURRENT_PROJECT.sensor} • ${CURRENT_PROJECT.resolution} → 2.5m • ${CURRENT_PROJECT.crs} • Acquired ${CURRENT_PROJECT.acquisitionDate}`}
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => onNavigate('project-setup')}>
              <Settings size={13} />
              <span>Setup & Calibration</span>
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('super-resolution')}>
              <Sparkles size={13} />
              <span>Launch Super-Resolution</span>
            </button>
          </>
        }
      />

      {/* HORIZONTAL WORKFLOW PROGRESSION BAR */}
      <div className="workflow-bar">
        {workflowSteps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div 
              className={`workflow-step ${step.status === 'completed' ? 'completed' : 'active'}`}
              onClick={() => onNavigate(step.route)}
            >
              <span className="workflow-step-num">{idx + 1}</span>
              <span>{step.label}</span>
              {step.status === 'completed' && <CheckCircle2 size={13} color="#10B981" />}
            </div>
            {idx < workflowSteps.length - 1 && (
              <ChevronRight size={14} color="var(--border-subtle)" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ACTIVE SCENE CANVAS */}
      <div className="panel">
        <div className="panel-header">
          <div className="section-accent">
            <span className="accent-bar accent-bar-blue" />
            <span className="panel-title">ACTIVE SCENE RECONSTRUCTION CANVAS</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="pill-badge pill-green">2.5m Super-Resolved</span>
            <span className="pill-badge pill-purple">EPSG:32643</span>
          </div>
        </div>
        <div className="panel-body" style={{ padding: '0' }}>
          <GisMapCanvas 
            mode="2.5m-geosr" 
            height={420} 
            title="Urban Mumbai — Andheri East"
            badgeText="PSNR 32.8 dB"
            showLayerBar={true}
          />
        </div>
      </div>

      {/* THREE SUMMARY PANELS */}
      <div className="grid-3">
        {/* 1. QUALITY METRICS */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-blue" />
              <span className="panel-title">Quality Metrics</span>
            </div>
            <button className="btn btn-xs btn-secondary" onClick={() => onNavigate('super-resolution')}>Inspect</button>
          </div>
          <div className="panel-body flex-col" style={{ gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="metric-box">
                <div className="metric-label">PSNR</div>
                <div className="metric-value">32.8<span className="metric-unit">dB</span></div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SSIM</div>
                <div className="metric-value">0.921</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Spectral Angle (SAM):</span>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>0.034 rad</span>
            </div>
          </div>
        </div>

        {/* 2. CONFIDENCE PROFILE */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-emerald" />
              <span className="panel-title">Confidence Profile</span>
            </div>
            <button className="btn btn-xs btn-secondary" onClick={() => onNavigate('super-resolution')}>View Heatmap</button>
          </div>
          <div className="panel-body flex-col" style={{ gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>High Confidence</span>
                <span className="mono" style={{ fontWeight: 700, color: '#10B981' }}>71.4%</span>
              </div>
              <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '71.4%', height: '100%', backgroundColor: '#10B981', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Moderate Uncertainty</span>
                <span className="mono" style={{ fontWeight: 700, color: '#F59E0B' }}>21.8%</span>
              </div>
              <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '21.8%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Uncertainty Score:</span>
              <span className="pill-badge pill-green">Low (0.048)</span>
            </div>
          </div>
        </div>

        {/* 3. EXTRACTED FEATURES */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-purple" />
              <span className="panel-title">Extracted Features</span>
            </div>
            <button className="btn btn-xs btn-secondary" onClick={() => onNavigate('geoai')}>Explore</button>
          </div>
          <div className="panel-body flex-col" style={{ gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="metric-box">
                <div className="metric-label">BUILDINGS</div>
                <div className="metric-value">{GEOAI_STATS.buildings.count.toLocaleString()}</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">ROAD SEGMENTS</div>
                <div className="metric-value">{GEOAI_STATS.roads.segments}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Built-up Footprint:</span>
              <span className="mono" style={{ fontWeight: 700 }}>{GEOAI_STATS.buildings.builtArea}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
