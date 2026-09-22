import React from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, GEOAI_STATS, CHANGE_DETECTION_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  GitCompare, 
  ShieldCheck, 
  Settings, 
  FileText,
  ChevronRight,
  MapPin,
  Layers,
  Database
} from 'lucide-react';

interface ProjectWorkspacePageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({ onNavigate, showToast }) => {
  const workflowSteps = [
    { label: 'Data Ready', status: 'completed', route: 'project-setup' as RouteId },
    { label: 'Quality Checked', status: 'completed', route: 'project-setup' as RouteId },
    { label: 'Super Resolution', status: 'completed', route: 'super-resolution' as RouteId },
    { label: 'GeoAI Extracted', status: 'completed', route: 'geoai' as RouteId },
    { label: 'Change Detection', status: 'completed', route: 'change-detection' as RouteId },
    { label: 'Report Generated', status: 'ready', route: 'reports' as RouteId }
  ];

  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      {/* PROJECT HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700 }}>{CURRENT_PROJECT.name}</h1>
            <span className="badge badge-ready">ACTIVE ANALYSIS</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="tech-label">SENSOR:</span>
            <span className="mono" style={{ fontWeight: 600 }}>{CURRENT_PROJECT.sensor}</span>
            <span style={{ color: 'var(--border-main)' }}>•</span>
            <span className="tech-label">GSD:</span>
            <span className="mono" style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>{CURRENT_PROJECT.resolution} → 2.5m</span>
            <span style={{ color: 'var(--border-main)' }}>•</span>
            <span className="tech-label">BANDS:</span>
            <span className="mono">6 Channels</span>
            <span style={{ color: 'var(--border-main)' }}>•</span>
            <span className="tech-label">ACQ:</span>
            <span className="mono">{CURRENT_PROJECT.acquisitionDate}</span>
            <span style={{ color: 'var(--border-main)' }}>•</span>
            <span className="tech-label">CRS:</span>
            <span className="mono">{CURRENT_PROJECT.crs}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('project-setup')}>
            <Settings size={13} />
            <span>Setup & QA</span>
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('super-resolution')}>
            <Sparkles size={13} />
            <span>Launch Super-Res Lab</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL WORKFLOW PROGRESSION INDICATOR */}
      <div className="workflow-bar">
        {workflowSteps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div 
              className={`workflow-step ${step.status === 'completed' ? 'completed' : 'active'}`}
              onClick={() => onNavigate(step.route)}
            >
              <span className="workflow-step-num">{idx + 1}</span>
              <span>{step.label}</span>
              {step.status === 'completed' && <CheckCircle2 size={12} color="var(--primary-sage)" />}
            </div>
            {idx < workflowSteps.length - 1 && (
              <ChevronRight size={13} color="var(--border-main)" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* LARGE SATELLITE MAP HUB */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <Layers size={14} color="var(--deep-sage)" />
            <span>ACTIVE SCENE RECONSTRUCTION CANVAS</span>
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="badge badge-ready">2.5M SUPER-RESOLVED</span>
            <span className="badge badge-muted">EPSG:32643</span>
          </div>
        </div>
        <div className="panel-body" style={{ padding: '0' }}>
          <GisMapCanvas 
            mode="2.5m-geosr" 
            height={420} 
            title="URBAN MUMBAI — ANDHERI EAST"
            badgeText="PSNR 32.8 dB"
            showLayerBar={true}
          />
        </div>
      </div>

      {/* THREE SUMMARY PANELS: LATEST RESULT | RELIABILITY | DETECTED FEATURES */}
      <div className="grid-3">
        {/* 1. LATEST RESULT */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <Sparkles size={13} color="var(--deep-sage)" />
              <span>SUPER-RESOLUTION ACCURACY</span>
            </span>
            <button className="btn btn-xs" onClick={() => onNavigate('super-resolution')}>Inspect</button>
          </div>
          <div className="panel-body flex-col" style={{ gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="metric-box">
                <div className="metric-label">PSNR</div>
                <div className="metric-value">32.8<span className="metric-unit">dB</span></div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SSIM</div>
                <div className="metric-value">0.921</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--secondary-text)' }}>Spectral Angle (SAM):</span>
              <span className="mono" style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>0.034 rad</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: 'var(--secondary-text)' }}>Observation Match:</span>
              <span className="mono" style={{ fontWeight: 600 }}>94.2%</span>
            </div>
          </div>
        </div>

        {/* 2. RELIABILITY PROFILE */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <ShieldCheck size={13} color="var(--deep-sage)" />
              <span>RELIABILITY & RISK</span>
            </span>
            <button className="btn btn-xs" onClick={() => onNavigate('super-resolution')}>View Heatmap</button>
          </div>
          <div className="panel-body flex-col" style={{ gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ fontWeight: 600 }}>High Confidence</span>
                <span className="mono">71.4%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '71.4%', height: '100%', backgroundColor: 'var(--deep-sage)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ fontWeight: 600 }}>Moderate Uncertainty</span>
                <span className="mono">21.8%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '21.8%', height: '100%', backgroundColor: 'var(--warning)' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
              <span style={{ color: 'var(--secondary-text)' }}>Hallucination Risk:</span>
              <span className="badge badge-ready">LOW (0.048)</span>
            </div>
          </div>
        </div>

        {/* 3. DETECTED GEOAI FEATURES */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <Cpu size={13} color="var(--deep-sage)" />
              <span>GEOAI EXTRACTIONS</span>
            </span>
            <button className="btn btn-xs" onClick={() => onNavigate('geoai')}>Explore</button>
          </div>
          <div className="panel-body flex-col" style={{ gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="metric-box">
                <div className="metric-label">BUILDINGS</div>
                <div className="metric-value">{GEOAI_STATS.buildings.count.toLocaleString()}</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">ROAD GRAPH</div>
                <div className="metric-value">{GEOAI_STATS.roads.segments}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--secondary-text)' }}>Built-up Footprint:</span>
              <span className="mono" style={{ fontWeight: 600 }}>{GEOAI_STATS.buildings.builtArea}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: 'var(--secondary-text)' }}>Road Length / Connectivity:</span>
              <span className="mono" style={{ fontWeight: 600 }}>{GEOAI_STATS.roads.totalLength} ({GEOAI_STATS.roads.connectivity})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
