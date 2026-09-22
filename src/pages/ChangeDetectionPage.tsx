import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CHANGE_DETECTION_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { 
  GitCompare, 
  Calendar, 
  Layers, 
  ArrowRight, 
  ListFilter, 
  Download, 
  X
} from 'lucide-react';

interface ChangeDetectionPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const ChangeDetectionPage: React.FC<ChangeDetectionPageProps> = ({ onNavigate, showToast }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Multi-Temporal Change Detection</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
            CO-REGISTERED SUPER-RESOLVED TEMPORAL DELTA ANALYSIS (10 JUN 2026 → 18 SEP 2026)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <ListFilter size={13} />
            <span>VIEW CHANGE DETAILS</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('domain')}
          >
            <span>DOMAIN INTELLIGENCE</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* BEFORE / AFTER DUAL SYNCHRONIZED COMPARISON */}
      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <Calendar size={13} color="var(--secondary-text)" />
              <span>BEFORE ACQUISITION SCENE</span>
            </span>
            <span className="badge badge-muted">{CHANGE_DETECTION_STATS.dates.before}</span>
          </div>
          <GisMapCanvas 
            mode="10m-raw" 
            height={220} 
            title="T1: 10 JUN 2026"
            badgeText="SENTINEL-2 L2A"
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <Calendar size={13} color="var(--deep-sage)" />
              <span>AFTER ACQUISITION SCENE (SUPER-RESOLVED)</span>
            </span>
            <span className="badge badge-ready">{CHANGE_DETECTION_STATS.dates.after}</span>
          </div>
          <GisMapCanvas 
            mode="2.5m-geosr" 
            height={220} 
            title="T2: 18 SEP 2026"
            badgeText="GEOSR-X 2.5m"
          />
        </div>
      </div>

      {/* CHANGE SUMMARY METRICS STRIP */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <GitCompare size={14} color="var(--slate)" />
            <span>CATEGORICAL CHANGE SUMMARY</span>
          </span>
          <span className="tech-label">27 TOTAL DETECTED EVENTS</span>
        </div>
        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {CHANGE_DETECTION_STATS.summary.map((item, idx) => (
            <div key={idx} className="metric-box" style={{ borderLeft: `3px solid ${item.color}` }}>
              <div className="metric-label">{item.type}</div>
              <div className="metric-value">{item.count} <span className="metric-unit">events</span></div>
              <div className="metric-sub mono">{item.area || item.length}</div>
            </div>
          ))}
        </div>
      </div>

      {/* INTEGRATED CHANGE OVERLAY MAP */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <Layers size={14} color="var(--deep-sage)" />
            <span>INTEGRATED CHANGE VECTOR OVERLAY MAP</span>
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#C46A42' }}></span> Building Change
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#B77A32' }}></span> Road Modification
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#58644A' }}></span> Vegetation Alteration
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#3E5E72' }}></span> Water Drainage
            </span>
          </div>
        </div>
        <div className="panel-body" style={{ padding: '0' }}>
          <GisMapCanvas 
            mode="change-detection" 
            height={380} 
            title="TEMPORAL CHANGE OVERLAYS"
            badgeText="27 CHANGE VECTORS"
          />
        </div>
      </div>

      {/* CHANGE DETAILS MODAL */}
      {isDetailsModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <span style={{ fontWeight: 600, fontSize: '13px' }}>MULTI-TEMPORAL CHANGE EVENT LOG</span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}
                onClick={() => setIsDetailsModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0' }}>
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Event ID</th>
                    <th>Coordinates</th>
                    <th>Classification</th>
                    <th>Magnitude Delta</th>
                    <th>Confidence</th>
                    <th style={{ textAlign: 'right' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANGE_DETECTION_STATS.changes.map(chg => (
                    <tr key={chg.id}>
                      <td className="mono" style={{ fontWeight: 600 }}>{chg.id}</td>
                      <td className="mono" style={{ fontSize: '11px' }}>{chg.location}</td>
                      <td>{chg.type}</td>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--primary-text)' }}>{chg.delta}</td>
                      <td className="mono" style={{ color: 'var(--deep-sage)' }}>{chg.confidence}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-muted">{chg.category}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setIsDetailsModalOpen(false)}>Close</button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  showToast('Exporting Change Vector GeoJSON table.');
                  setIsDetailsModalOpen(false);
                }}
              >
                <Download size={13} />
                <span>Export Change Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
