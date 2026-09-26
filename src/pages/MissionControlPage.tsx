import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, PROJECTS_DATA, PROCESSING_STEPS, SYSTEM_SERVICES } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { ProjectThumbnail } from '../components/ProjectThumbnail';
import { OrbitingSatelliteBadge } from '../components/OrbitingSatelliteBadge';
import { FloatingSatelliteIcon } from '../components/FloatingSatelliteIcon';
import { 
  ArrowRight, 
  Sparkles, 
  GitCompare, 
  Globe2, 
  FileText, 
  Cpu, 
  Plus, 
  Play, 
  Check, 
  RotateCcw, 
  Layers, 
  Activity, 
  Database, 
  ExternalLink 
} from 'lucide-react';

interface MissionControlPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({ onNavigate, showToast }) => {
  const [activeStepId, setActiveStepId] = useState(6);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStepId(1);
    showToast('Starting end-to-end processing pipeline simulation...');
    
    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current <= 9) {
        setActiveStepId(current);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        showToast('Pipeline execution complete (2.5m GSD generated with 32.8 dB PSNR).');
      }
    }, 700);
  };

  return (
    <div className="flex-col" style={{ gap: '22px' }}>
      {/* 1. HERO SECTION WITH PHOTOGRAPHIC SPACE/EARTH BACKDROP & REVOLVING SATELLITE HERO BADGE */}
      <div className="hero-container">
        {/* Photographic Earth Atmosphere Background Overlay */}
        <div className="hero-space-photo-bg" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>
            <div className="section-accent" style={{ marginBottom: '6px' }}>
              <span className="accent-bar accent-bar-blue" />
              <span className="tech-label" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>
                MISSION CONTROL & OVERVIEW
              </span>
            </div>
            
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Satellite Super-Resolution <span className="gradient-text">for deeper insights</span>
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px', lineHeight: 1.6 }}>
              Manage your satellite datasets, run physics-constrained super-resolution from 10m to 2.5m, and extract actionable GeoAI features.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <FloatingSatelliteIcon size={26} />
              <button 
                className="btn btn-primary"
                onClick={() => onNavigate('projects')}
              >
                <Plus size={14} />
                <span>New Project</span>
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => onNavigate('project-workspace')}
              >
                <span>Open Active Workspace</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* REVOLVING SATELLITE HERO BADGE */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
            <OrbitingSatelliteBadge size={135} />
          </div>
        </div>
      </div>

      {/* 2. MAIN SECTION: CURRENT ACTIVE PROJECT & STEP-BY-STEP PROCESSING PIPELINE */}
      <div className="grid-split-3-2">
        {/* LEFT: CURRENT ACTIVE PROJECT PANEL */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-blue" />
              <span className="panel-title">CURRENT ACTIVE PROJECT</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="pill-badge pill-green">
                <span className="live-pulse-dot" />
                <span>Active</span>
              </span>
            </div>
          </div>
          
          <div className="panel-body flex-col" style={{ gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {CURRENT_PROJECT.name}
              </h2>
              
              {/* COLOR-CODED PASTEL PILL BADGES */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span className="pill-badge pill-blue">
                  <Database size={11} />
                  <span>{CURRENT_PROJECT.sensor}</span>
                </span>
                <span className="pill-badge pill-green">
                  <Layers size={11} />
                  <span>{CURRENT_PROJECT.resolution} → 2.5m (4×)</span>
                </span>
                <span className="pill-badge pill-purple">
                  <span>{CURRENT_PROJECT.crs}</span>
                </span>
                <span className="pill-badge pill-amber">
                  <span>Acq: {CURRENT_PROJECT.acquisitionDate}</span>
                </span>
                <span className="pill-badge pill-slate">
                  <span>Cloud: {CURRENT_PROJECT.cloudCoverage}</span>
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginTop: '12px', lineHeight: 1.55 }}>
                Physics-constrained super-resolution model configured with 6 multispectral bands. Point Spread Function (PSF) and atmospheric radiative transfer bounds validated.
              </p>
            </div>

            {/* MINI GIS MAP PREVIEW */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <GisMapCanvas 
                mode="2.5m-geosr"
                height={210}
                title="Urban Mumbai 2.5m"
                badgeText="PSNR 32.8 dB"
                showControls={false}
              />
            </div>

            {/* ACTION BUTTONS WITH SATELLITE MOTIF */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <FloatingSatelliteIcon size={22} />
              <button 
                className="btn btn-primary"
                onClick={() => onNavigate('project-workspace')}
              >
                <span>Open Project Workspace</span>
                <ArrowRight size={13} />
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => onNavigate('super-resolution')}
              >
                <Sparkles size={13} />
                <span>Super Resolution Lab</span>
              </button>
              <button 
                className="btn"
                onClick={() => onNavigate('project-setup')}
              >
                <span>Setup & QA</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILED STEP-BY-STEP PROCESSING PIPELINE */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-teal" />
              <span className="panel-title">PROCESSING PIPELINE</span>
            </div>
            
            <button 
              className="btn btn-xs btn-secondary"
              disabled={isSimulating}
              onClick={handleRunSimulation}
            >
              {isSimulating ? (
                <>
                  <RotateCcw size={11} className="animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play size={11} />
                  <span>Simulate Run</span>
                </>
              )}
            </button>
          </div>

          <div className="panel-body" style={{ padding: '16px 20px' }}>
            <div className="stepper-list">
              {PROCESSING_STEPS.map((step, idx) => {
                const isCompleted = step.id < activeStepId;
                const isActive = step.id === activeStepId;
                const isPending = step.id > activeStepId;

                return (
                  <div key={step.id} className="stepper-item">
                    {/* Connecting Line */}
                    {idx < PROCESSING_STEPS.length - 1 && (
                      <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
                    )}

                    {/* Step Node */}
                    <div className={`stepper-node ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                      {isCompleted ? (
                        <Check size={14} strokeWidth={2.5} />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div style={{ flex: 1, paddingTop: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                          color: isActive ? 'var(--primary-blue)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}>
                          {step.name}
                        </div>
                        
                        {isActive && (
                          <span className="pill-badge pill-blue" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                            In Progress
                          </span>
                        )}
                        {isCompleted && (
                          <span className="pill-badge pill-green" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                            Done
                          </span>
                        )}
                      </div>
                      
                      <div style={{ 
                        fontSize: '10.5px', 
                        color: isPending ? 'var(--text-muted)' : 'var(--text-secondary)', 
                        marginTop: '1px' 
                      }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO COLUMN: RECENT PROJECTS WITH THUMBNAILS & SYSTEM STATUS */}
      <div className="grid-split-3-2">
        {/* RECENT PROJECTS TABLE WITH THUMBNAILS */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-purple" />
              <span className="panel-title">RECENT PROJECTS</span>
            </div>
            <button className="btn btn-xs btn-secondary" onClick={() => onNavigate('projects')}>
              <span>View All Projects</span>
              <ArrowRight size={11} />
            </button>
          </div>

          <table className="tech-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Domain</th>
                <th>Sensor</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS_DATA.map(project => (
                <tr key={project.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ProjectThumbnail type={project.thumbnailType} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12.5px' }}>{project.name}</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Updated: {project.acquisitionDate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`pill-badge ${project.thumbnailType === 'urban' ? 'pill-blue' : project.thumbnailType === 'flood' ? 'pill-rose' : 'pill-green'}`}>
                      {project.type}
                    </span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: '11.5px' }}>{project.sensor}</span>
                  </td>
                  <td>
                    <span className={`pill-badge ${project.status === 'Active' ? 'pill-green' : project.status === 'Completed' ? 'pill-teal' : 'pill-amber'}`}>
                      {project.status === 'Active' && <span className="live-pulse-dot" style={{ width: '5px', height: '5px' }} />}
                      <span>{project.status}</span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-xs btn-secondary"
                      onClick={() => {
                        if (project.id === 'urban-mumbai') onNavigate('project-workspace');
                        else onNavigate('domain');
                      }}
                    >
                      <span>Open</span>
                      <ExternalLink size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYSTEM STATUS SERVICES WITH WAVE GRADIENT */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-emerald" />
              <span className="panel-title">SYSTEM STATUS</span>
            </div>
            <span className="pill-badge pill-green">
              <span className="live-pulse-dot" />
              <span>Operational</span>
            </span>
          </div>

          <div className="panel-body flex-col" style={{ gap: '10px', flex: 1, position: 'relative' }}>
            {SYSTEM_SERVICES.map((srv, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>{srv.name}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '1px' }}>{srv.desc}</div>
                </div>
                <span className="pill-badge pill-green" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  {srv.status}
                </span>
              </div>
            ))}

            {/* WAVE GRADIENT FOOTER */}
            <div style={{
              marginTop: 'auto',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(236, 253, 245, 0.95) 100%)',
              border: '1px solid #D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#059669" />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#065F46' }}>CUDA Acceleration Online</span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>24.2 TFLOPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PLATFORM CAPABILITIES HIGHLIGHT BAND */}
      <div>
        <div className="section-accent" style={{ marginBottom: '12px' }}>
          <span className="accent-bar accent-bar-blue" />
          <span className="tech-label" style={{ fontWeight: 700 }}>PLATFORM CAPABILITIES & ANALYSIS TOOLS</span>
        </div>

        <div className="grid-5">
          {/* Card 1: Super Resolution */}
          <div 
            className="panel" 
            style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onClick={() => onNavigate('super-resolution')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(37, 99, 235, 0.35)'
            }}>
              <Sparkles size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Super Resolution</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '3px', lineHeight: 1.4 }}>
                10m → 2.5m continuous physics reconstruction.
              </div>
            </div>
          </div>

          {/* Card 2: GeoAI */}
          <div 
            className="panel" 
            style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onClick={() => onNavigate('geoai')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#8B5CF6',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(139, 92, 246, 0.35)'
            }}>
              <Cpu size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>GeoAI Analysis</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '3px', lineHeight: 1.4 }}>
                Building footprints & road network extraction.
              </div>
            </div>
          </div>

          {/* Card 3: Change Detection */}
          <div 
            className="panel" 
            style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onClick={() => onNavigate('change-detection')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(13, 148, 136, 0.35)'
            }}>
              <GitCompare size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Change Detection</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '3px', lineHeight: 1.4 }}>
                Multi-temporal difference & delta maps.
              </div>
            </div>
          </div>

          {/* Card 4: Domain Models */}
          <div 
            className="panel" 
            style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onClick={() => onNavigate('domain')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(16, 185, 129, 0.35)'
            }}>
              <Globe2 size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Domain Models</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '3px', lineHeight: 1.4 }}>
                Disaster, Agriculture & Urban morphology.
              </div>
            </div>
          </div>

          {/* Card 5: Reports */}
          <div 
            className="panel" 
            style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onClick={() => onNavigate('reports')}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#64748B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(100, 116, 139, 0.35)'
            }}>
              <FileText size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Reports</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '3px', lineHeight: 1.4 }}>
                Audits, COG GeoTIFF & GeoJSON exports.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
