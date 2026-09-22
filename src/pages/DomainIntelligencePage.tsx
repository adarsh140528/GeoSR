import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { DISASTER_STATS, AGRICULTURE_STATS, URBAN_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { 
  Globe2, 
  Flame, 
  Sprout, 
  Building2, 
  Download, 
  ArrowRight, 
  Layers, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface DomainIntelligencePageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const DomainIntelligencePage: React.FC<DomainIntelligencePageProps> = ({ onNavigate, showToast }) => {
  const [activeDomain, setActiveDomain] = useState<'DISASTER' | 'AGRICULTURE' | 'URBAN'>('DISASTER');
  const [selectedDisaster, setSelectedDisaster] = useState<'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'LANDSLIDE' | 'WILDFIRE'>('FLOOD');
  const [selectedMonth, setSelectedMonth] = useState('SEP');
  const [selectedYear, setSelectedYear] = useState('2026');

  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Domain Intelligence Modules</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
            SPECIALIZED SECTORAL MODELS FOR DISASTER RESPONSE, AGRO-HYDROLOGY, AND URBAN MORPHOLOGY
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn"
            onClick={() => showToast(`Exporting ${activeDomain} Intelligence Dossier & Vector Layers.`)}
          >
            <Download size={13} />
            <span>EXPORT {activeDomain} REPORT</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('reports')}
          >
            <span>INTELLIGENCE REPORTS</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* PRIMARY DOMAIN SELECTOR TABS */}
      <div className="tabs-nav" style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}>
        <button
          className={`tab-btn ${activeDomain === 'DISASTER' ? 'active' : ''}`}
          onClick={() => setActiveDomain('DISASTER')}
        >
          <Flame size={13} style={{ marginRight: '5px', display: 'inline', color: 'var(--critical)' }} />
          Disaster Intelligence
        </button>
        <button
          className={`tab-btn ${activeDomain === 'AGRICULTURE' ? 'active' : ''}`}
          onClick={() => setActiveDomain('AGRICULTURE')}
        >
          <Sprout size={13} style={{ marginRight: '5px', display: 'inline', color: 'var(--deep-sage)' }} />
          Agriculture Intelligence
        </button>
        <button
          className={`tab-btn ${activeDomain === 'URBAN' ? 'active' : ''}`}
          onClick={() => setActiveDomain('URBAN')}
        >
          <Building2 size={13} style={{ marginRight: '5px', display: 'inline', color: 'var(--slate)' }} />
          Urban Intelligence
        </button>
      </div>

      {/* DOMAIN 1: DISASTER INTELLIGENCE */}
      {activeDomain === 'DISASTER' && (
        <div className="flex-col" style={{ gap: '14px' }}>
          {/* Disaster Hazard Selector */}
          <div className="panel" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="tech-label">HAZARD SELECTOR:</span>
                {(['FLOOD', 'EARTHQUAKE', 'CYCLONE', 'LANDSLIDE', 'WILDFIRE'] as const).map(d => (
                  <button
                    key={d}
                    className={`btn btn-xs ${selectedDisaster === d ? 'btn-primary' : ''}`}
                    onClick={() => {
                      setSelectedDisaster(d);
                      showToast(`Hazard model loaded: ${d}`);
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <span className="badge badge-critical">RESPONSE ACTIVE</span>
            </div>
          </div>

          <div className="grid-split-3-2">
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">
                  <ShieldAlert size={14} color="var(--critical)" />
                  <span>RAPID INUNDATION & DAMAGE PRIORITY MAP</span>
                </span>
                <span className="badge badge-critical">17 CRITICAL ZONES</span>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                <GisMapCanvas 
                  mode="disaster-flood" 
                  height={400} 
                  title="FLOOD INUNDATION MODEL"
                  badgeText="SEVERITY: TIER 1"
                />
              </div>
            </div>

            <div className="flex-col" style={{ gap: '12px' }}>
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">DAMAGE CLASSIFICATION TIERS</span>
                </div>
                <div className="panel-body flex-col" style={{ gap: '8px' }}>
                  {DISASTER_STATS.riskLevels.map((tier, idx) => (
                    <div key={idx} className="metric-box" style={{ borderLeft: `3px solid ${tier.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>{tier.level}</span>
                        <span className="mono" style={{ fontWeight: 600 }}>{tier.count} zones</span>
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--secondary-text)', marginTop: '2px' }}>{tier.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">INFRASTRUCTURE IMPACT</span>
                </div>
                <table className="tech-table">
                  <tbody>
                    <tr>
                      <td>Buildings Inundated / Damaged</td>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--critical)' }}>{DISASTER_STATS.infrastructure.buildings} structures</td>
                    </tr>
                    <tr>
                      <td>Submerged Road Corridors</td>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--warning)' }}>{DISASTER_STATS.infrastructure.roads} segments (8.4 km)</td>
                    </tr>
                    <tr>
                      <td>Vegetation Buffer Loss</td>
                      <td className="mono">{DISASTER_STATS.infrastructure.vegetation} hectares</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN 2: AGRICULTURE INTELLIGENCE */}
      {activeDomain === 'AGRICULTURE' && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <Sprout size={14} color="var(--deep-sage)" />
                <span>NASHIK GODAVARI VALLEY CADASTRAL PARCELS</span>
              </span>
              <span className="badge badge-ready">426 MONITORED PARCELS</span>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <GisMapCanvas 
                mode="agriculture-nashik" 
                height={420} 
                title="NASHIK AGRI PARCELS"
                badgeText="AVG NDVI 0.68"
              />
            </div>
          </div>

          <div className="flex-col" style={{ gap: '12px' }}>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">CROP VIGOR SUMMARY</span>
              </div>
              <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="metric-box">
                  <div className="metric-label">TOTAL FIELDS</div>
                  <div className="metric-value">{AGRICULTURE_STATS.totalFields}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">AVERAGE NDVI</div>
                  <div className="metric-value" style={{ color: 'var(--deep-sage)' }}>{AGRICULTURE_STATS.averageNdvi}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">OPTIMAL VIGOR</div>
                  <div className="metric-value" style={{ color: 'var(--deep-sage)' }}>{AGRICULTURE_STATS.healthy}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">WATER STRESS</div>
                  <div className="metric-value" style={{ color: 'var(--critical)' }}>{AGRICULTURE_STATS.stress}</div>
                </div>
              </div>
            </div>

            {/* Phenology chart */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">MULTI-TEMPORAL NDVI PHENOLOGY</span>
              </div>
              <div className="panel-body" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', padding: '10px 14px 0 14px', borderBottom: '1px solid var(--border-main)' }}>
                  {AGRICULTURE_STATS.timeSeries.map(ts => {
                    const barHeight = Math.round((ts.ndvi / 1.0) * 65);
                    const isSel = selectedMonth === ts.month;
                    return (
                      <div 
                        key={ts.month} 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => setSelectedMonth(ts.month)}
                      >
                        <span className="mono" style={{ fontSize: '9.5px', fontWeight: 600, color: isSel ? 'var(--deep-sage)' : 'var(--secondary-text)' }}>{ts.ndvi}</span>
                        <div style={{
                          width: '32px',
                          height: `${barHeight}px`,
                          backgroundColor: isSel ? 'var(--deep-sage)' : 'var(--primary-sage)',
                          borderRadius: '2px 2px 0 0'
                        }}></div>
                        <span className="tech-label" style={{ fontSize: '9.5px', fontWeight: isSel ? 700 : 500 }}>{ts.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN 3: URBAN INTELLIGENCE */}
      {activeDomain === 'URBAN' && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <Building2 size={14} color="var(--slate)" />
                <span>URBAN EXPANSION VECTORS & BUILT-UP EXTENTS</span>
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['2019', '2022', '2026'].map(yr => (
                  <button
                    key={yr}
                    className={`btn btn-xs ${selectedYear === yr ? 'btn-primary' : ''}`}
                    onClick={() => setSelectedYear(yr)}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <GisMapCanvas 
                mode="urban-growth" 
                height={420} 
                title={`URBAN EXTENT ${selectedYear}`}
                badgeText="+21.4% GROWTH"
              />
            </div>
          </div>

          <div className="flex-col" style={{ gap: '12px' }}>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">URBAN AGGLOMERATION METRICS</span>
              </div>
              <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="metric-box">
                  <div className="metric-label">STRUCTURES</div>
                  <div className="metric-value">{URBAN_STATS.buildings.toLocaleString()}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">ROAD NETWORK</div>
                  <div className="metric-value">{URBAN_STATS.roadNetwork}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">BUILT-UP AREA</div>
                  <div className="metric-value">{URBAN_STATS.builtUpArea}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">7-YR GROWTH</div>
                  <div className="metric-value" style={{ color: 'var(--warning)' }}>{URBAN_STATS.growthRate}</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">SECTORAL MORPHOLOGY</span>
              </div>
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Sector</th>
                    <th>Area</th>
                    <th style={{ textAlign: 'right' }}>Density</th>
                  </tr>
                </thead>
                <tbody>
                  {URBAN_STATS.zones.map((z, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{z.name}</td>
                      <td className="mono">{z.builtArea}</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{z.density}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
