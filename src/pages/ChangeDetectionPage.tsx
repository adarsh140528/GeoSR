import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CHANGE_DETECTION_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { PageHeaderHero } from '../components/PageHeaderHero';
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
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="teal"
        categoryText="MULTI-TEMPORAL DELTA ANALYSIS"
        title="Multi-Temporal"
        titleGradientText="Change Detection"
        subtitle="Co-registered temporal comparison between 10 Jun 2026 and 18 Sep 2026"
        actions={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsDetailsModalOpen(true)}
            >
              <ListFilter size={13} />
              <span>View Change Log</span>
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('domain')}
            >
              <span>Continue to Domain Models</span>
              <ArrowRight size={13} />
            </button>
          </>
        }
      />

      {/* DUAL SYNCHRONIZED COMPARISON */}
      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-slate" />
              <span className="panel-title">Before Acquisition (T1)</span>
            </div>
            <span className="pill-badge pill-slate">{CHANGE_DETECTION_STATS.dates.before}</span>
          </div>
          <GisMapCanvas 
            mode="10m-raw" 
            height={220} 
            title="T1: 10 Jun 2026"
            badgeText="Sentinel-2 L2A"
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-blue" />
              <span className="panel-title">After Acquisition (T2) — Super-Resolved</span>
            </div>
            <span className="pill-badge pill-green">{CHANGE_DETECTION_STATS.dates.after}</span>
          </div>
          <GisMapCanvas 
            mode="2.5m-geosr" 
            height={220} 
            title="T2: 18 Sep 2026"
            badgeText="GeoSR 2.5m"
          />
        </div>
      </div>

      {/* CHANGE SUMMARY METRICS STRIP */}
      <div className="panel">
        <div className="panel-header">
          <div className="section-accent">
            <span className="accent-bar accent-bar-teal" />
            <span className="panel-title">Categorical Change Summary</span>
          </div>
          <span className="pill-badge pill-blue">27 total detected events</span>
        </div>
        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {CHANGE_DETECTION_STATS.summary.map((item, idx) => (
            <div key={idx} className="metric-box" style={{ borderLeft: `4px solid ${item.color}` }}>
              <div className="metric-label">{item.type}</div>
              <div className="metric-value">{item.count} <span className="metric-unit">events</span></div>
              <div className="metric-sub mono" style={{ fontWeight: 600 }}>{item.area || item.length}</div>
            </div>
          ))}
        </div>
      </div>

      {/* INTEGRATED CHANGE OVERLAY MAP */}
      <div className="panel">
        <div className="panel-header">
          <div className="section-accent">
            <span className="accent-bar accent-bar-blue" />
            <span className="panel-title">Integrated Change Vector Overlay</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F43F5E' }} /> Building Changes
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} /> Road Modifications
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Vegetation Alterations
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4' }} /> Water Drainage
            </span>
          </div>
        </div>
        <div className="panel-body" style={{ padding: '0' }}>
          <GisMapCanvas 
            mode="change-detection" 
            height={380} 
            title="Temporal Changes"
            badgeText="27 Change Vectors"
          />
        </div>
      </div>

      {/* CHANGE DETAILS MODAL */}
      {isDetailsModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Multi-Temporal Change Event Log</span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
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
                      <td className="mono" style={{ fontWeight: 700 }}>{chg.id}</td>
                      <td className="mono" style={{ fontSize: '11.5px' }}>{chg.location}</td>
                      <td>{chg.type}</td>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{chg.delta}</td>
                      <td className="mono" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>{chg.confidence}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="pill-badge pill-slate">{chg.category}</span>
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
