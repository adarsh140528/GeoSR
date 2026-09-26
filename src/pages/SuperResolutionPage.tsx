import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT } from '../data/mockData';
import { GisMapCanvas } from '../components/GisMapCanvas';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Columns, 
  Sliders, 
  Play, 
  RotateCcw 
} from 'lucide-react';

interface SuperResolutionPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const SuperResolutionPage: React.FC<SuperResolutionPageProps> = ({ onNavigate, showToast }) => {
  const [activeTab, setActiveTab] = useState<'RESULT' | 'SPLIT' | 'COMPARE' | 'RELIABILITY'>('RESULT');
  const [selectedModel, setSelectedModel] = useState<'SEN2SR-mamba-main' | 'SEN2SRLite-full' | 'Bicubic-baseline'>('SEN2SR-mamba-main');
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceProgress, setInferenceProgress] = useState(0);
  const [splitPos, setSplitPos] = useState(0.5);

  const handleRunInference = () => {
    setIsInferring(true);
    setInferenceProgress(5);
    showToast('Starting SEN2SR Continuous Transformer Super-Resolution...');

    let p = 5;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        clearInterval(interval);
        setInferenceProgress(100);
        setIsInferring(false);
        showToast('Super-resolution complete! 4× resolution enhancement achieved (PSNR 32.8 dB).');
      } else {
        setInferenceProgress(p);
      }
    }, 300);
  };

  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER WITH PHOTOGRAPHIC EARTH ATMOSPHERE BACKGROUND */}
      <PageHeaderHero 
        accentColor="blue"
        categoryText="SPECTRAL-SPATIAL RECONSTRUCTION"
        title="Super Resolution"
        titleGradientText="Laboratory"
        subtitle="SEN2SR continuous transformer radiance reconstruction (10m → 2.5m GSD)"
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value as any)}
              style={{ padding: '7px 12px', fontSize: '12px', border: '1px solid var(--border-subtle)', borderRadius: '6px', backgroundColor: '#FFFFFF', fontWeight: 600 }}
            >
              <option value="SEN2SR-mamba-main">SEN2SR Transformer 4× (32.8 dB)</option>
              <option value="SEN2SRLite-full">SEN2SR-Lite Fast (30.9 dB)</option>
              <option value="Bicubic-baseline">Bicubic Baseline (26.4 dB)</option>
            </select>

            <button 
              className="btn btn-primary"
              disabled={isInferring}
              onClick={handleRunInference}
            >
              {isInferring ? <RotateCcw size={13} className="animate-spin" /> : <Play size={13} />}
              <span>{isInferring ? `Reconstructing (${inferenceProgress}%)` : 'Run Super-Resolution'}</span>
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('geoai')}
            >
              <span>Continue to GeoAI</span>
              <ArrowRight size={13} />
            </button>
          </div>
        }
      />

      {/* VIEW MODE TABS */}
      <div className="category-pill-bar">
        <button 
          className={`category-pill ${activeTab === 'RESULT' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESULT')}
        >
          <Layers size={13} />
          <span>Full 2.5m Scene</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'SPLIT' ? 'active' : ''}`}
          onClick={() => setActiveTab('SPLIT')}
        >
          <Columns size={13} />
          <span>Split Slider (10m vs 2.5m)</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'COMPARE' ? 'active' : ''}`}
          onClick={() => setActiveTab('COMPARE')}
        >
          <Sliders size={13} />
          <span>4-Quadrant Model Comparison</span>
        </button>

        <button 
          className={`category-pill ${activeTab === 'RELIABILITY' ? 'active' : ''}`}
          onClick={() => setActiveTab('RELIABILITY')}
        >
          <ShieldCheck size={13} />
          <span>Uncertainty Heatmap</span>
        </button>
      </div>

      {/* VIEW RENDERING */}
      {activeTab === 'RESULT' && (
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-teal" />
              <span className="panel-title">SUPER-RESOLVED 2.5M ORTHO-RECTIFIED SURFACE</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="pill-badge pill-green">PSNR: 32.8 dB</span>
              <span className="pill-badge pill-blue">SSIM: 0.921</span>
              <span className="pill-badge pill-purple">SAM: 0.034 rad</span>
            </div>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <GisMapCanvas 
              mode="2.5m-geosr" 
              height={440} 
              title="SEN2SR 2.5m Surface Reflectance"
              badgeText="EPSG:32643"
              showLayerBar={true}
            />
          </div>
        </div>
      )}

      {activeTab === 'SPLIT' && (
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-blue" />
              <span className="panel-title">INTERACTIVE DUAL RESOLUTION SLIDER (10M RAW vs 2.5M GEOSR-X)</span>
            </div>
            <span className="pill-badge pill-blue">Drag slider horizontally</span>
          </div>
          <div className="panel-body" style={{ padding: '0' }}>
            <GisMapCanvas 
              mode="2.5m-geosr" 
              height={440} 
              title="10m Native vs 2.5m Super-Resolved"
              splitView={true}
              splitPos={splitPos}
              onSplitPosChange={setSplitPos}
            />
          </div>
        </div>
      )}

      {activeTab === 'COMPARE' && (
        <div className="grid-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">1. Native Sentinel-2 (10m L2A)</span>
              <span className="pill-badge pill-slate">Raw</span>
            </div>
            <GisMapCanvas mode="10m-raw" height={220} title="Sentinel-2 Raw" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">2. Bicubic Baseline (10m Interpolated)</span>
              <span className="pill-badge pill-amber">PSNR 26.4 dB</span>
            </div>
            <GisMapCanvas mode="bicubic" height={220} title="Bicubic Baseline" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">3. GeoSR-X Continuous Transformer (2.5m)</span>
              <span className="pill-badge pill-green">PSNR 32.8 dB</span>
            </div>
            <GisMapCanvas mode="2.5m-geosr" height={220} title="GeoSR-X 2.5m Output" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">4. Difference & High-Frequency Edges</span>
              <span className="pill-badge pill-purple">+6.4 dB Gain</span>
            </div>
            <GisMapCanvas mode="difference" height={220} title="High-Frequency Edges" />
          </div>
        </div>
      )}

      {activeTab === 'RELIABILITY' && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Bayesian Epistemic Uncertainty Heatmap</span>
              <span className="pill-badge pill-green">Low Hallucination Risk</span>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <GisMapCanvas mode="uncertainty" height={380} title="Uncertainty Heatmap" />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Reliability Tier Breakdown</span>
            </div>
            <div className="panel-body flex-col" style={{ gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#047857' }}>High Confidence Tier</span>
                  <span className="mono" style={{ fontWeight: 700 }}>71.4% (1.73 km²)</span>
                </div>
                <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '71.4%', height: '100%', backgroundColor: '#10B981' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#B45309' }}>Moderate Uncertainty</span>
                  <span className="mono" style={{ fontWeight: 700 }}>21.8% (0.53 km²)</span>
                </div>
                <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '21.8%', height: '100%', backgroundColor: '#F59E0B' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#BE123C' }}>High Uncertainty (Shadows)</span>
                  <span className="mono" style={{ fontWeight: 700 }}>6.8% (0.17 km²)</span>
                </div>
                <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '6.8%', height: '100%', backgroundColor: '#F43F5E' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
