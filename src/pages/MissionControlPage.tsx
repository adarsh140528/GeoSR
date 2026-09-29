import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT, PROJECTS_DATA, PROCESSING_STEPS, SYSTEM_SERVICES } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { ProjectThumbnail } from '../components/ProjectThumbnail';
import { OrbitingSatelliteBadge } from '../components/OrbitingSatelliteBadge';
import { FloatingSatelliteIcon } from '../components/FloatingSatelliteIcon';
import { useUserImage } from '../context/ImageContext';
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
  ExternalLink,
  Upload,
  CheckCircle2,
  Building2,
  GitBranch,
  Trees
} from 'lucide-react';

interface MissionControlPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const MissionControlPage: React.FC<MissionControlPageProps> = ({ onNavigate, showToast }) => {
  const [activeStepId, setActiveStepId] = useState(6);
  const [isSimulating, setIsSimulating] = useState(false);
  const { userImage, metadata, featureAnalysis, setUserImageFromFile } = useUserImage();

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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        await setUserImageFromFile(e.target.files[0]);
        showToast(`Image loaded: ${e.target.files[0].name}`);
      } catch (err: any) {
        showToast(err.message || 'Error loading image');
      }
    }
  };

  // Dynamically derived stats from user uploaded image or default fallback
  const buildingsCount = featureAnalysis ? featureAnalysis.buildingsCount : 842;
  const roadSegments = featureAnalysis ? featureAnalysis.roadSegments : 216;
  const vegPercent = featureAnalysis ? featureAnalysis.vegetationPercent : 18;
  const builtPercent = featureAnalysis ? featureAnalysis.builtUpPercent : 64;

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
              {metadata ? (
                <>Active Image Workspace: <strong style={{ color: 'var(--text-primary)' }}>{metadata.filename}</strong> ({metadata.width}×{metadata.height}px • {metadata.sizeMB} MB). Features extracted dynamically.</>
              ) : (
                "Manage your satellite datasets, run physics-constrained super-resolution from 10m to 2.5m, and extract actionable GeoAI features."
              )}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <FloatingSatelliteIcon size={26} />
              
              <label className="btn btn-primary" style={{ cursor: 'pointer', margin: 0 }}>
                <Upload size={14} />
                <span>Upload Satellite Image</span>
                <input type="file" accept="image/*,.tif,.tiff" style={{ display: 'none' }} onChange={handleFileInput} />
              </label>

              <button 
                className="btn btn-secondary"
                onClick={() => onNavigate('super-resolution')}
              >
                <span>Super Resolution Lab</span>
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
              <span className="panel-title">CURRENT ACTIVE PROJECT SCENE</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="pill-badge pill-green">
                <span className="live-pulse-dot" />
                <span>{userImage ? 'Image Loaded' : 'Active'}</span>
              </span>
            </div>
          </div>
          
          <div className="panel-body flex-col" style={{ gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {metadata ? metadata.filename : CURRENT_PROJECT.name}
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
                {metadata && (
                  <span className="pill-badge pill-purple mono">
                    {metadata.width} × {metadata.height} px
                  </span>
                )}
                <span className="pill-badge pill-amber">
                  <span>Acq: {CURRENT_PROJECT.acquisitionDate}</span>
                </span>
              </div>

              {/* DYNAMIC FEATURE STATS ROW */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '12px',
                padding: '10px 12px',
                background: 'var(--bg-elevated)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={11} color="#3B82F6" /> Buildings
                  </div>
                  <div className="mono" style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {buildingsCount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GitBranch size={11} color="#F59E0B" /> Roads
                  </div>
                  <div className="mono" style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {roadSegments}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trees size={11} color="#10B981" /> Canopy
                  </div>
                  <div className="mono" style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {vegPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* MINI GIS MAP PREVIEW */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <GisMapCanvas 
                mode="2.5m-geosr"
                height={210}
                title={metadata ? metadata.filename : "Urban Mumbai 2.5m"}
                badgeText="2.5m SR Scene"
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
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
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

            {/* CUDA FOOTER */}
            <div style={{
              marginTop: 'auto',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(52,211,153,0.07) 100%)',
              border: '1px solid rgba(14,165,233,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#34D399" />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#34D399' }}>CUDA Acceleration Online</span>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: '#2DD4BF', fontWeight: 700 }}>24.2 TFLOPS</span>
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
              width: '34px', height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(67,112,160,0.15)',
              border: '1px solid rgba(67,112,160,0.22)',
              color: '#7AA8C8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={16} />
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
              width: '34px', height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(92,78,122,0.15)',
              border: '1px solid rgba(92,78,122,0.22)',
              color: '#8878B0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Cpu size={16} />
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
              width: '34px', height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(58,110,104,0.15)',
              border: '1px solid rgba(58,110,104,0.22)',
              color: '#589088',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GitCompare size={16} />
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
              width: '34px', height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(74,122,94,0.15)',
              border: '1px solid rgba(74,122,94,0.22)',
              color: '#72A882',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Globe2 size={16} />
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
              width: '34px', height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56,66,82,0.3)',
              border: '1px solid rgba(56,66,82,0.4)',
              color: '#66748A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={16} />
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
