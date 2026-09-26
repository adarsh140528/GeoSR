import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { PROJECTS_DATA } from '../data/mockData';
import { ProjectThumbnail } from '../components/ProjectThumbnail';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  ExternalLink, 
  MapPin, 
  X 
} from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('Coastal Chennai Storm Surge');
  const [newSensor, setNewSensor] = useState('Sentinel-2 L2A');

  const filtered = PROJECTS_DATA.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast(`Project workspace "${newProjectName}" created.`);
  };

  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND & FLOATING SATELLITE */}
      <PageHeaderHero 
        accentColor="blue"
        categoryText="PROJECT REPOSITORY"
        title="Projects &"
        titleGradientText="Workspaces"
        subtitle="Manage your multi-spectral satellite datasets, processing runs, and model benchmarks"
        actions={
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} />
            <span>New Project</span>
          </button>
        }
      />

      {/* SEARCH AND FILTER BAR */}
      <div className="panel" style={{ padding: '10px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Search projects by name, sensor, or domain..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 36px',
              fontSize: '12.5px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
              backgroundColor: '#F8FAFC'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="pill-badge pill-slate">Total: {PROJECTS_DATA.length}</span>
          <span className="pill-badge pill-green">Active: 1</span>
          <span className="pill-badge pill-teal">Completed: 1</span>
          <span className="pill-badge pill-amber">Processing: 1</span>
        </div>
      </div>

      {/* PROJECTS TABLE */}
      <div className="panel">
        <table className="tech-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Domain</th>
              <th>Dataset & Resolution</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(project => (
              <tr key={project.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ProjectThumbnail type={project.thumbnailType} size={38} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{project.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={11} />
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`pill-badge ${project.thumbnailType === 'urban' ? 'pill-blue' : project.thumbnailType === 'flood' ? 'pill-rose' : 'pill-green'}`}>
                    {project.type}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="mono" style={{ fontSize: '12px', fontWeight: 600 }}>{project.sensor}</span>
                    <span className="pill-badge pill-green" style={{ fontSize: '10.5px', padding: '1px 6px' }}>
                      {project.resolution} → 2.5m
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`pill-badge ${project.status === 'Active' ? 'pill-green' : project.status === 'Completed' ? 'pill-teal' : 'pill-amber'}`}>
                    {project.status === 'Active' && <span className="live-pulse-dot" style={{ width: '5px', height: '5px' }} />}
                    <span>{project.status}</span>
                  </span>
                </td>
                <td className="mono" style={{ fontSize: '12px' }}>{project.acquisitionDate}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      if (project.id === 'urban-mumbai') onNavigate('project-workspace');
                      else onNavigate('domain');
                    }}
                  >
                    <span>Open Workspace</span>
                    <ExternalLink size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW PROJECT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Create Satellite Analysis Project</span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '16px' }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="modal-body flex-col" style={{ gap: '14px' }}>
                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Project Name</label>
                  <input 
                    type="text" 
                    value={newProjectName} 
                    onChange={e => setNewProjectName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none' }}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Sensor / Platform</label>
                    <select 
                      value={newSensor} 
                      onChange={e => setNewSensor(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none', backgroundColor: '#FFFFFF' }}
                    >
                      <option>Sentinel-2 L2A (10m Multi-spectral)</option>
                      <option>Landsat 8/9 OLI (30m Optical)</option>
                      <option>PlanetScope (3m Constellation)</option>
                    </select>
                  </div>
                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Target Resolution</label>
                    <select style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none', backgroundColor: '#FFFFFF' }}>
                      <option>4× Super-Resolution (10m → 2.5m)</option>
                      <option>2× Super-Resolution (10m → 5.0m)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '5px' }}>Coordinate Reference System (CRS)</label>
                  <input 
                    type="text" 
                    defaultValue="EPSG:32643 (UTM Zone 43N)" 
                    style={{ width: '100%', padding: '8px 12px', fontSize: '12.5px', border: '1px solid var(--border-subtle)', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Workspace</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
