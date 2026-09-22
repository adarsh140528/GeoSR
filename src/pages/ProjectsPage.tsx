import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { PROJECTS_DATA } from '../data/mockData';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Sparkles,
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
    <div className="flex-col" style={{ gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Project Workspaces</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
            MANAGE SATELLITE MISSIONS, PROCESSING RUNS, AND MULTI-SPECTRAL DATASETS
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={14} />
          <span>+ NEW ANALYSIS</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="panel" style={{ padding: '8px 12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} color="var(--secondary-text)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
          <input 
            type="text" 
            placeholder="Search projects by name, sensor, or domain..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 32px',
              fontSize: '12px',
              border: '1px solid var(--border-main)',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
              backgroundColor: 'var(--surface-subtle)'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="badge badge-muted">TOTAL: {PROJECTS_DATA.length}</span>
          <span className="badge badge-ready">ACTIVE: 1</span>
          <span className="badge badge-slate">COMPLETED: 1</span>
          <span className="badge badge-warning">PROCESSING: 1</span>
        </div>
      </div>

      {/* PROFESSIONAL PROJECTS TABLE */}
      <div className="panel">
        <table className="tech-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Analysis Type</th>
              <th>Dataset</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(project => (
              <tr key={project.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--primary-text)' }}>{project.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={11} />
                    <span>{project.location}</span>
                  </div>
                </td>
                <td>{project.type}</td>
                <td>
                  <span className="mono">{project.sensor}</span>
                  <div style={{ fontSize: '10.5px', color: 'var(--secondary-text)' }}>{project.resolution} → {project.targetResolution.split(' ')[0]}</div>
                </td>
                <td>
                  <span className={`badge ${project.status === 'Active' ? 'badge-ready' : project.status === 'Completed' ? 'badge-slate' : 'badge-warning'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="mono">{project.acquisitionDate}</td>
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
              <span style={{ fontWeight: 600, fontSize: '13px' }}>CREATE SATELLITE ANALYSIS PROJECT</span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="modal-body flex-col" style={{ gap: '12px' }}>
                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '4px' }}>PROJECT IDENTIFIER</label>
                  <input 
                    type="text" 
                    value={newProjectName} 
                    onChange={e => setNewProjectName(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid var(--border-main)', borderRadius: '4px' }}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '4px' }}>CONSTELLATION / SENSOR</label>
                    <select 
                      value={newSensor} 
                      onChange={e => setNewSensor(e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid var(--border-main)', borderRadius: '4px' }}
                    >
                      <option>Sentinel-2 L2A (10m Multi-spectral)</option>
                      <option>Landsat 8/9 OLI (30m Optical)</option>
                      <option>PlanetScope (3m Constellation)</option>
                    </select>
                  </div>
                  <div>
                    <label className="tech-label" style={{ display: 'block', marginBottom: '4px' }}>SUPER-RES TARGET</label>
                    <select style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid var(--border-main)', borderRadius: '4px' }}>
                      <option>4× Physics Super-Resolution (10m → 2.5m)</option>
                      <option>2× Physics Super-Resolution (10m → 5.0m)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="tech-label" style={{ display: 'block', marginBottom: '4px' }}>CRS PROJECTION</label>
                  <input 
                    type="text" 
                    defaultValue="EPSG:32643 (UTM Zone 43N)" 
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid var(--border-main)', borderRadius: '4px' }}
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
