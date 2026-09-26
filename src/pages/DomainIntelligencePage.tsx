import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { DISASTER_STATS, AGRICULTURE_STATS, URBAN_STATS } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
  Globe2, 
  Flame, 
  Sprout, 
  Building2, 
  Download, 
  ArrowRight, 
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
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="emerald"
        categoryText="SECTORAL ANALYSIS MODELS"
        title="Domain"
        titleGradientText="Intelligence"
        subtitle="Specialized sector models for disaster response, agro-hydrology, and urban planning"
        actions={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => showToast(`Exporting ${activeDomain} Report & Vector Layers.`)}
            >
              <Download size={13} />
              <span>Export Report</span>
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('reports')}
            >
              <span>View Reports</span>
              <ArrowRight size={13} />
            </button>
          </>
        }
      />

      {/* TOP DOMAIN SELECTOR PILLS */}
      <div className="category-pill-bar">
        <button 
          className={`category-pill ${activeDomain === 'DISASTER' ? 'active' : ''}`}
          onClick={() => setActiveDomain('DISASTER')}
        >
          <ShieldAlert size={14} />
          <span>Disaster Response</span>
        </button>

        <button 
          className={`category-pill ${activeDomain === 'AGRICULTURE' ? 'active' : ''}`}
          onClick={() => setActiveDomain('AGRICULTURE')}
        >
          <Sprout size={14} />
          <span>Agriculture & Forestry</span>
        </button>

        <button 
          className={`category-pill ${activeDomain === 'URBAN' ? 'active' : ''}`}
          onClick={() => setActiveDomain('URBAN')}
        >
          <Building2 size={14} />
          <span>Urban Planning</span>
        </button>
      </div>

      {/* DOMAIN 1: DISASTER */}
      {activeDomain === 'DISASTER' && (
        <div className="flex-col" style={{ gap: '16px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'FLOOD', label: 'Flood Inundation' },
              { id: 'EARTHQUAKE', label: 'Earthquake Damage' },
              { id: 'CYCLONE', label: 'Cyclone Impact' },
              { id: 'LANDSLIDE', label: 'Landslide Risk' },
              { id: 'WILDFIRE', label: 'Wildfire Burn' }
            ].map(d => (
              <button
                key={d.id}
                className={`btn btn-sm ${selectedDisaster === d.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedDisaster(d.id as any)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="grid-split-3-2">
            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-rose" />
                  <span className="panel-title">Flood Inundation Overlay</span>
                </div>
                <span className="pill-badge pill-rose">17 Critical Sites</span>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                <GisMapCanvas 
                  mode="disaster-flood" 
                  height={420} 
                  title="Assam — Brahmaputra Valley"
                  badgeText="Flood Inundation"
                />
              </div>
            </div>

            <div className="flex-col" style={{ gap: '14px' }}>
              <div className="panel">
                <div className="panel-header">
                  <div className="section-accent">
                    <span className="accent-bar accent-bar-rose" />
                    <span className="panel-title">Flood Impact Summary</span>
                  </div>
                </div>
                <div className="panel-body flex-col" style={{ gap: '10px' }}>
                  {DISASTER_STATS.riskLevels.map((rl, idx) => (
                    <div key={idx} className="metric-box" style={{ borderLeft: `4px solid ${rl.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{rl.level}</span>
                        <span className="mono" style={{ fontWeight: 700 }}>{rl.count} sites</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{rl.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="section-accent">
                    <span className="accent-bar accent-bar-rose" />
                    <span className="panel-title">Infrastructure Impact</span>
                  </div>
                </div>
                <table className="tech-table">
                  <tbody>
                    <tr>
                      <td>Inundated Buildings</td>
                      <td className="mono" style={{ fontWeight: 700, color: '#BE123C' }}>{DISASTER_STATS.infrastructure.buildings} structures</td>
                    </tr>
                    <tr>
                      <td>Submerged Road Corridors</td>
                      <td className="mono" style={{ fontWeight: 700, color: '#B45309' }}>{DISASTER_STATS.infrastructure.roads} segments (8.4 km)</td>
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

      {/* DOMAIN 2: AGRICULTURE */}
      {activeDomain === 'AGRICULTURE' && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <div className="section-accent">
                <span className="accent-bar accent-bar-emerald" />
                <span className="panel-title">Nashik Cadastral Parcels</span>
              </div>
              <span className="pill-badge pill-green">426 Monitored Parcels</span>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <GisMapCanvas 
                mode="agriculture-nashik" 
                height={420} 
                title="Nashik Agri Parcels"
                badgeText="Avg NDVI 0.68"
              />
            </div>
          </div>

          <div className="flex-col" style={{ gap: '14px' }}>
            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-emerald" />
                  <span className="panel-title">Crop Vigor Summary</span>
                </div>
              </div>
              <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="metric-box">
                  <div className="metric-label">TOTAL FIELDS</div>
                  <div className="metric-value">{AGRICULTURE_STATS.totalFields}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">AVERAGE NDVI</div>
                  <div className="metric-value" style={{ color: '#047857' }}>{AGRICULTURE_STATS.averageNdvi}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">OPTIMAL VIGOR</div>
                  <div className="metric-value" style={{ color: '#047857' }}>{AGRICULTURE_STATS.healthy}</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">WATER STRESS</div>
                  <div className="metric-value" style={{ color: '#BE123C' }}>{AGRICULTURE_STATS.stress}</div>
                </div>
              </div>
            </div>

            {/* Phenology chart */}
            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-emerald" />
                  <span className="panel-title">NDVI Phenology Time Series</span>
                </div>
              </div>
              <div className="panel-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '95px', padding: '10px 14px 0 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                  {AGRICULTURE_STATS.timeSeries.map(ts => {
                    const barHeight = Math.round((ts.ndvi / 1.0) * 65);
                    const isSel = selectedMonth === ts.month;
                    return (
                      <div 
                        key={ts.month} 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => setSelectedMonth(ts.month)}
                      >
                        <span className="mono" style={{ fontSize: '10px', fontWeight: 700, color: isSel ? 'var(--primary-blue)' : 'var(--text-secondary)' }}>{ts.ndvi}</span>
                        <div style={{
                          width: '34px',
                          height: `${barHeight}px`,
                          backgroundColor: isSel ? 'var(--primary-blue)' : '#10B981',
                          borderRadius: '3px 3px 0 0',
                          transition: 'all 0.2s ease'
                        }} />
                        <span className="tech-label" style={{ fontSize: '10px', fontWeight: isSel ? 800 : 600 }}>{ts.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN 3: URBAN */}
      {activeDomain === 'URBAN' && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <div className="section-accent">
                <span className="accent-bar accent-bar-blue" />
                <span className="panel-title">Urban Extents & Expansion</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['2019', '2022', '2026'].map(yr => (
                  <button
                    key={yr}
                    className={`btn btn-xs ${selectedYear === yr ? 'btn-primary' : 'btn-secondary'}`}
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
                title={`Urban Extent ${selectedYear}`}
                badgeText="+21.4% Growth"
              />
            </div>
          </div>

          <div className="flex-col" style={{ gap: '14px' }}>
            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-blue" />
                  <span className="panel-title">Urban Growth Metrics</span>
                </div>
              </div>
              <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                  <div className="metric-value" style={{ color: '#047857' }}>{URBAN_STATS.growthRate}</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-blue" />
                  <span className="panel-title">Zonal Breakdown</span>
                </div>
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
