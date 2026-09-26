import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { GEOAI_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
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
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="purple"
        categoryText="MULTI-TASK VECTOR EXTRACTION"
        title="GeoAI Feature"
        titleGradientText="Extraction"
        subtitle="Building footprint polygonization, road network graphs, and land cover classification"
        actions={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => showToast('Exporting extracted vector features as GeoJSON bundle.')}
            >
              <Download size={13} />
              <span>Export GeoJSON</span>
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('change-detection')}
            >
              <span>Continue to Change Detection</span>
              <ArrowRight size={13} />
            </button>
          </>
        }
      />

      {/* FEATURE CLASS TABS */}
      <div className="category-pill-bar">
        <button 
          className={`category-pill ${activeTab === 'BUILDINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('BUILDINGS')}
        >
          <Building2 size={13} />
          <span>Buildings ({GEOAI_STATS.buildings.count})</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'ROADS' ? 'active' : ''}`}
          onClick={() => setActiveTab('ROADS')}
        >
          <GitBranch size={13} />
          <span>Roads ({GEOAI_STATS.roads.segments})</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'LAND COVER' ? 'active' : ''}`}
          onClick={() => setActiveTab('LAND COVER')}
        >
          <Layers size={13} />
          <span>Land Cover (5 Classes)</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'VEGETATION' ? 'active' : ''}`}
          onClick={() => setActiveTab('VEGETATION')}
        >
          <Trees size={13} />
          <span>Canopy & NDVI</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'WATER' ? 'active' : ''}`}
          onClick={() => setActiveTab('WATER')}
        >
          <Droplets size={13} />
          <span>Water & Drainage</span>
        </button>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid-split-3-2">
        {/* LEFT: MAP WITH VECTOR OVERLAYS */}
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-purple" />
              <span className="panel-title">Vector Overlay Layer ({activeTab})</span>
            </div>
            <span className="pill-badge pill-green">Extraction Complete</span>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <GisMapCanvas 
              mode="geoai" 
              height={440} 
              title={`GeoAI ${activeTab}`}
              badgeText="EPSG:32643 Vector"
            />
          </div>
        </div>

        {/* RIGHT: TAB-SPECIFIC METRICS */}
        <div className="flex-col" style={{ gap: '16px' }}>
          {activeTab === 'BUILDINGS' && (
            <>
              <div className="panel">
                <div className="panel-header">
                  <div className="section-accent">
                    <span className="accent-bar accent-bar-blue" />
                    <span className="panel-title">Building Extraction Metrics</span>
                  </div>
                  <span className="pill-badge pill-blue">2.5m GSD</span>
                </div>
                <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div className="metric-box">
                    <div className="metric-label">TOTAL DETECTED</div>
                    <div className="metric-value">{GEOAI_STATS.buildings.count.toLocaleString()}</div>
                    <div className="metric-sub">Polygons digitized</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">AVG CONFIDENCE</div>
                    <div className="metric-value" style={{ color: 'var(--primary-blue)' }}>{GEOAI_STATS.buildings.avgConfidence}</div>
                    <div className="metric-sub">IoU Concordance &gt; 0.88</div>
                  </div>
                  <div className="metric-box" style={{ gridColumn: 'span 2' }}>
                    <div className="metric-label">TOTAL BUILT-UP AREA</div>
                    <div className="metric-value">{GEOAI_STATS.buildings.builtArea}</div>
                    <div className="metric-sub">Commercial: {GEOAI_STATS.buildings.commercial} | Res: {GEOAI_STATS.buildings.residential} | Ind: {GEOAI_STATS.buildings.industrial}</div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="section-accent">
                    <span className="accent-bar accent-bar-blue" />
                    <span className="panel-title">Building Typology Breakdown</span>
                  </div>
                </div>
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th>Class</th>
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
                  <div className="section-accent">
                    <span className="accent-bar accent-bar-amber" />
                    <span className="panel-title">Road Network Extraction</span>
                  </div>
                  <span className="pill-badge pill-green">Topology Validated</span>
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
                    <div className="metric-label">CONNECTIVITY INDEX</div>
                    <div className="metric-value" style={{ color: 'var(--primary-blue)' }}>{GEOAI_STATS.roads.connectivity}</div>
                    <div className="metric-sub">Arterial: {GEOAI_STATS.roads.arterial} | Secondary: {GEOAI_STATS.roads.secondary}</div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="section-accent">
                    <span className="accent-bar accent-bar-amber" />
                    <span className="panel-title">Road Classification</span>
                  </div>
                </div>
                <table className="tech-table">
                  <tbody>
                    <tr>
                      <td>Arterial Expressway (WEH Corridor)</td>
                      <td className="mono">{GEOAI_STATS.roads.arterial}</td>
                      <td><span className="pill-badge pill-blue">6-8 Lanes</span></td>
                    </tr>
                    <tr>
                      <td>Secondary Arterials (Andheri-Kurla Rd)</td>
                      <td className="mono">{GEOAI_STATS.roads.secondary}</td>
                      <td><span className="pill-badge pill-blue">4 Lanes</span></td>
                    </tr>
                    <tr>
                      <td>Local Access & Feeder Roads</td>
                      <td className="mono">{GEOAI_STATS.roads.local}</td>
                      <td><span className="pill-badge pill-slate">2 Lanes</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {(activeTab === 'LAND COVER' || activeTab === 'VEGETATION' || activeTab === 'WATER') && (
            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-emerald" />
                  <span className="panel-title">Land Cover Breakdown</span>
                </div>
                <span className="pill-badge pill-slate">Total: 3.84 km²</span>
              </div>
              <div className="panel-body flex-col" style={{ gap: '12px' }}>
                {GEOAI_STATS.landCover.map((lc, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{lc.class}</span>
                      <span className="mono" style={{ fontWeight: 700 }}>{lc.area} ({lc.percent}%)</span>
                    </div>
                    <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${lc.percent}%`, height: '100%', backgroundColor: lc.color, borderRadius: '4px' }} />
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
