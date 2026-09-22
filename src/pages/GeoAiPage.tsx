import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { GEOAI_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { 
  Cpu, 
  Download, 
  Layers, 
  ArrowRight,
  Building2,
  GitBranch,
  Trees,
  Droplets
} from 'lucide-react';

interface GeoAiPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const GeoAiPage: React.FC<GeoAiPageProps> = ({ onNavigate, showToast }) => {
  const [activeTab, setActiveTab] = useState<'BUILDINGS' | 'ROADS' | 'LAND COVER' | 'VEGETATION' | 'WATER'>('BUILDINGS');

  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>GeoAI Multi-Task Feature Extraction</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
            SUPER-RESOLVED VECTOR SEGMENTATION, BUILDING POLYGONS, AND ROAD GRAPH EXTRACTION
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn"
            onClick={() => showToast('Exporting extracted vector features as GeoJSON / Shapefile.')}
          >
            <Download size={13} />
            <span>EXPORT VECTOR GEOJSON</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('change-detection')}
          >
            <span>CHANGE DETECTION</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* TABS SELECTION */}
      <div className="tabs-nav" style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}>
        {(['BUILDINGS', 'ROADS', 'LAND COVER', 'VEGETATION', 'WATER'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid-split-3-2">
        {/* LEFT: VECTOR OVERLAY GIS CANVAS */}
        <div className="panel" style={{ borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
          <div className="panel-header">
            <span className="panel-title">
              <Layers size={14} color="var(--deep-sage)" />
              <span>SUPER-RESOLVED VECTOR OVERLAYS ({activeTab})</span>
            </span>
            <span className="badge badge-ready">EXTRACTION COMPLETE</span>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <GisMapCanvas 
              mode="geoai" 
              height={440} 
              title={`GEOAI ${activeTab}`}
              badgeText="EPSG:32643 VECTOR"
            />
          </div>
        </div>

        {/* RIGHT: TAB-SPECIFIC METRICS & ANALYTICS */}
        <div className="flex-col" style={{ gap: '14px' }}>
          {activeTab === 'BUILDINGS' && (
            <>
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">BUILDING EXTRACTION TELEMETRY</span>
                  <span className="badge badge-slate">2.5M GSD</span>
                </div>
                <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div className="metric-box">
                    <div className="metric-label">TOTAL DETECTED</div>
                    <div className="metric-value">{GEOAI_STATS.buildings.count.toLocaleString()}</div>
                    <div className="metric-sub">Polygons digitized</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">AVG CONFIDENCE</div>
                    <div className="metric-value" style={{ color: 'var(--deep-sage)' }}>{GEOAI_STATS.buildings.avgConfidence}</div>
                    <div className="metric-sub">IoU Concordance &gt; 0.88</div>
                  </div>
                  <div className="metric-box" style={{ gridColumn: 'span 2' }}>
                    <div className="metric-label">TOTAL BUILT-UP FOOTPRINT AREA</div>
                    <div className="metric-value">{GEOAI_STATS.buildings.builtArea}</div>
                    <div className="metric-sub">Commercial: {GEOAI_STATS.buildings.commercial} | Res: {GEOAI_STATS.buildings.residential} | Ind: {GEOAI_STATS.buildings.industrial}</div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">STRUCTURAL TYPOLOGY PARTITION</span>
                </div>
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th>Typology Class</th>
                      <th>Count</th>
                      <th>Area</th>
                      <th style={{ textAlign: 'right' }}>Avg Height</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Residential High-Rise</td>
                      <td className="mono">710</td>
                      <td className="mono">1.18 km²</td>
                      <td className="mono" style={{ textAlign: 'right' }}>32.4 m</td>
                    </tr>
                    <tr>
                      <td>Commercial & Tech Parks</td>
                      <td className="mono">382</td>
                      <td className="mono">0.82 km²</td>
                      <td className="mono" style={{ textAlign: 'right' }}>44.1 m</td>
                    </tr>
                    <tr>
                      <td>Industrial Sheds & Logistics</td>
                      <td className="mono">192</td>
                      <td className="mono">0.43 km²</td>
                      <td className="mono" style={{ textAlign: 'right' }}>14.2 m</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'ROADS' && (
            <>
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">ROAD NETWORK GRAPH EXTRACTION</span>
                  <span className="badge badge-ready">TOPOLOGY VALIDATED</span>
                </div>
                <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div className="metric-box">
                    <div className="metric-label">ROAD SEGMENTS</div>
                    <div className="metric-value">{GEOAI_STATS.roads.segments}</div>
                    <div className="metric-sub">Graph edges extracted</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">TOTAL LENGTH</div>
                    <div className="metric-value">{GEOAI_STATS.roads.totalLength}</div>
                    <div className="metric-sub">Centerline vector sum</div>
                  </div>
                  <div className="metric-box" style={{ gridColumn: 'span 2' }}>
                    <div className="metric-label">GRAPH CONNECTIVITY INDEX</div>
                    <div className="metric-value" style={{ color: 'var(--deep-sage)' }}>{GEOAI_STATS.roads.connectivity}</div>
                    <div className="metric-sub">Arterial: {GEOAI_STATS.roads.arterial} | Secondary: {GEOAI_STATS.roads.secondary}</div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">ROAD CLASSIFICATION BREAKDOWN</span>
                </div>
                <table className="tech-table">
                  <tbody>
                    <tr>
                      <td>Arterial Expressway (WEH Corridor)</td>
                      <td className="mono">{GEOAI_STATS.roads.arterial}</td>
                      <td><span className="badge badge-ready">6-8 LANES</span></td>
                    </tr>
                    <tr>
                      <td>Secondary Arterials (Andheri-Kurla Rd)</td>
                      <td className="mono">{GEOAI_STATS.roads.secondary}</td>
                      <td><span className="badge badge-ready">4 LANES</span></td>
                    </tr>
                    <tr>
                      <td>Local Access & Feeder Roads</td>
                      <td className="mono">{GEOAI_STATS.roads.local}</td>
                      <td><span className="badge badge-muted">2 LANES</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {(activeTab === 'LAND COVER' || activeTab === 'VEGETATION' || activeTab === 'WATER') && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">LAND COVER PARTITION & FRACTION</span>
                <span className="badge badge-muted">TOTAL: 3.84 KM²</span>
              </div>
              <div className="panel-body flex-col" style={{ gap: '10px' }}>
                {GEOAI_STATS.landCover.map((lc, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{lc.class}</span>
                      <span className="mono">{lc.area} ({lc.percent}%)</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${lc.percent}%`, height: '100%', backgroundColor: lc.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
