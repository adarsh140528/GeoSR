import React, { useState } from 'react';
import type { RouteId } from '../components/AppShell';
import { CURRENT_PROJECT } from '../data/mockData';
import { GisMapCanvas, MapMode } from '../components/GisMapCanvas';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Columns, 
  Sliders, 
  ChevronRight,
  Download
} from 'lucide-react';

interface SuperResolutionPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

export const SuperResolutionPage: React.FC<SuperResolutionPageProps> = ({ onNavigate, showToast }) => {
  const [activeTab, setActiveTab] = useState<'RESULT' | 'SPLIT' | 'COMPARE' | 'RELIABILITY'>('RESULT');
  const [activeBandMode, setActiveBandMode] = useState<'RGB' | 'FALSE COLOR' | 'NDVI' | 'EDGE' | 'DIFFERENCE'>('RGB');
  const [selectedModel, setSelectedModel] = useState<'SEN2SR-mamba-main' | 'SEN2SRLite-full' | 'Bicubic-baseline'>('SEN2SR-mamba-main');
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceProgress, setInferenceProgress] = useState(0);
  const [inferenceStepText, setInferenceStepText] = useState('');
  const [splitPos, setSplitPos] = useState(0.5);
  const [sharedZoom, setSharedZoom] = useState(1);
  const [sharedCenter, setSharedCenter] = useState<[number, number]>([0, 0]);
  const [opacity, setOpacity] = useState(1);

  // Dynamic metrics depending on selected model variant
  const getMetrics = () => {
    if (selectedModel === 'SEN2SR-mamba-main') {
      return { psnr: 32.8, ssim: 0.921, sam: 0.034, match: 94.2, risk: 'LOW', desc: '10 Bands, Mamba/Swin Architecture' };
    }
    if (selectedModel === 'SEN2SRLite-full') {
      return { psnr: 30.5, ssim: 0.895, sam: 0.042, match: 91.8, risk: 'LOW-MODERATE', desc: '10 Bands Lightweight Fallback' };
    }
    return { psnr: 26.4, ssim: 0.782, sam: 0.078, match: 82.1, risk: 'HIGH (No Physics Guard)', desc: 'Standard Bicubic Upsampling' };
  };

  const currentMetrics = getMetrics();

  const handleRunInference = () => {
    setIsInferring(true);
    setInferenceProgress(0);
    setInferenceStepText('Ingesting 10 Sentinel-2 L2A Multispectral Bands...');

    const steps = [
      { pct: 20, text: 'Executing continuous spectral radiance encoding...' },
      { pct: 45, text: 'Applying spatial transformer & high-frequency edge attention...' },
      { pct: 70, text: 'Applying MTF degradation inversion & physics constraint bounds...' },
      { pct: 90, text: 'Computing epistemic uncertainty variance heatmap...' },
      { pct: 100, text: 'Super-resolution 2.5m GeoTIFF output generated successfully!' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setInferenceProgress(steps[stepIdx].pct);
        setInferenceStepText(steps[stepIdx].text);
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsInferring(false);
          showToast(`SEN2SR Inference Completed with ${selectedModel}!`);
        }, 500);
      }
    }, 600);
  };

  const pipelineSteps = [
    { name: 'RAW L2A DATA', type: 'Input', desc: '10 bands @ 10m/20m BOA', status: 'DONE' },
    { name: 'SPECTRAL ENCODER', type: 'Embedding', desc: 'Continuous Radiance Rep.', status: 'DONE' },
    { name: 'SPATIAL TRANSFORMER', type: 'Attention', desc: 'Multi-scale High-Freq Edges', status: 'DONE' },
    { name: 'CROSS-ATTENTION', type: 'Fusion', desc: 'Spectral-Spatial Alignment', status: 'DONE' },
    { name: 'MULTI-SCALE FUSION', type: 'Decoder', desc: '4× Latent Super-Resolution', status: 'DONE' },
    { name: 'PHYSICS CONSTRAINT', type: 'Inversion', desc: 'MTF & Radiative Bounds', status: 'DONE' },
    { name: 'RECONSTRUCTION', type: 'Output', desc: '2.5m Analysis-Ready COG', status: 'DONE' }
  ];

  const getRenderModeForQuadrant = (baseType: 'raw' | 'geosr' | 'ref' | 'diff'): MapMode => {
    if (activeBandMode === 'FALSE COLOR') return 'false-color';
    if (activeBandMode === 'NDVI') return 'ndvi';
    if (activeBandMode === 'EDGE') return 'edge';
    if (activeBandMode === 'DIFFERENCE' || baseType === 'diff') return 'difference';
    if (baseType === 'raw') return '10m-raw';
    if (baseType === 'geosr') return '2.5m-geosr';
    return '2.5m-geosr';
  };

  return (
    <div className="flex-col" style={{ gap: '18px' }}>
      {/* HEADER & TOP LEVEL ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Super Resolution Laboratory</h1>
            <span className="badge badge-warning" style={{ fontSize: '10px' }}>
              DEMO DATA - NOT A MEASURED MODEL RESULT
            </span>
          </div>
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px', marginTop: '2px' }}>
            PHYSICS-GUIDED SPECTRAL-SPATIAL RECONSTRUCTION & SEN2SR MODEL BENCHMARKING
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* MODEL VARIANT SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--surface-main)', border: '1px solid var(--border-main)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
            <Cpu size={13} color="var(--deep-sage)" />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>MODEL:</span>
            <select
              value={selectedModel}
              onChange={(e) => {
                const val = e.target.value as any;
                setSelectedModel(val);
                showToast(`Switched model variant to ${val}`);
              }}
              style={{
                backgroundColor: 'var(--surface-subtle)',
                color: 'var(--primary-text)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '3px',
                fontSize: '11px',
                padding: '2px 6px',
                cursor: 'pointer'
              }}
            >
              <option value="SEN2SR-mamba-main">SEN2SR mamba-main (10-Band 2.5m)</option>
              <option value="SEN2SRLite-full">SEN2SRLite Full (Fallback 2.5m)</option>
              <option value="Bicubic-baseline">Bicubic Baseline (Interpolated 2.5m)</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleRunInference}
            disabled={isInferring}
          >
            <Sparkles size={13} />
            <span>{isInferring ? 'RUNNING SEN2SR...' : 'RUN INFERENCE'}</span>
          </button>
          
          <button 
            className="btn"
            onClick={() => showToast('Exporting 2.5m GeoTIFF Cloud-Optimized Raster.')}
          >
            <Download size={13} />
            <span>EXPORT 2.5M GEOTIFF</span>
          </button>
          <button 
            className="btn"
            onClick={() => onNavigate('geoai')}
          >
            <span>CONTINUE TO GEOAI</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* LIVE INFERENCE PROGRESS OVERLAY BAR */}
      {isInferring && (
        <div className="panel" style={{ backgroundColor: 'rgba(38, 48, 41, 0.95)', borderColor: 'var(--deep-sage)', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--deep-sage)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} className="spin" />
              <span>SEN2SR INFERENCE ENGINE RUNNING — {selectedModel}</span>
            </span>
            <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-sage)' }}>{inferenceProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-muted)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ width: `${inferenceProgress}%`, height: '100%', backgroundColor: 'var(--deep-sage)', transition: 'width 0.4s ease' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--secondary-text)', fontFamily: 'var(--font-mono)' }}>
            {inferenceStepText}
          </div>
        </div>
      )}

      {/* WORKFLOW TABS */}
      <div className="tabs-nav" style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }}>
        <button
          className={`tab-btn ${activeTab === 'RESULT' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESULT')}
        >
          <Sparkles size={13} style={{ marginRight: '5px', display: 'inline' }} />
          Reconstruction Result
        </button>
        <button
          className={`tab-btn ${activeTab === 'SPLIT' ? 'active' : ''}`}
          onClick={() => setActiveTab('SPLIT')}
        >
          <Sliders size={13} style={{ marginRight: '5px', display: 'inline' }} />
          Split Comparison Slider
        </button>
        <button
          className={`tab-btn ${activeTab === 'COMPARE' ? 'active' : ''}`}
          onClick={() => setActiveTab('COMPARE')}
        >
          <Columns size={13} style={{ marginRight: '5px', display: 'inline' }} />
          2×2 Comparison Matrix
        </button>
        <button
          className={`tab-btn ${activeTab === 'RELIABILITY' ? 'active' : ''}`}
          onClick={() => setActiveTab('RELIABILITY')}
        >
          <ShieldCheck size={13} style={{ marginRight: '5px', display: 'inline' }} />
          Reliability & Uncertainty
        </button>
      </div>

      {/* TAB 1: RECONSTRUCTION RESULT (3-COLUMN WORKSPACE) */}
      {activeTab === 'RESULT' && (
        <div className="flex-col" style={{ gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '12px' }}>
            {/* INPUT SCENE */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">INPUT SCENE (NATIVE)</span>
                <span className="badge badge-muted">10 METER</span>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                <GisMapCanvas 
                  mode="10m-raw" 
                  height={280} 
                  title="SENTINEL-2 L2A"
                  badgeText="10m Native"
                />
              </div>
              <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-main)', backgroundColor: 'var(--surface-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Bands: 6 Channels</span>
                  <span className="mono">1098 × 1098 px</span>
                </div>
              </div>
            </div>

            {/* NEURAL PIPELINE FLOWCHART */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">
                  <Cpu size={14} color="var(--deep-sage)" />
                  <span>PHYSICS RECONSTRUCTION PIPELINE</span>
                </span>
                <span className="badge badge-ready">COMPLETE</span>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '12px' }}>
                {pipelineSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      backgroundColor: 'var(--surface-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--deep-sage)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600 }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '11px' }}>{step.name}</div>
                        <div style={{ fontSize: '9.5px', color: 'var(--secondary-text)' }}>{step.desc}</div>
                      </div>
                    </div>
                    <span className="badge badge-ready" style={{ fontSize: '9px' }}>{step.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OUTPUT SCENE */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">GEOSR-X OUTPUT</span>
                <span className="badge badge-ready">2.5 METER</span>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                <GisMapCanvas 
                  mode="2.5m-geosr" 
                  height={280} 
                  title="GEOSR-X 4×"
                  badgeText="2.5m GeoTIFF"
                />
              </div>
              <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-main)', backgroundColor: 'var(--surface-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Observation Match:</span>
                  <span className="mono" style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>94.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* OBJECTIVE METRICS STRIP */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">PHYSICS VALIDATION & OBJECTIVE RECONSTRUCTION METRICS</span>
              <span className="tech-label">SENSOR MTF RESIDUAL: 0.012</span>
            </div>
            <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              <div className="metric-box">
                <div className="metric-label">PEAK SNR (PSNR)</div>
                <div className="metric-value">{currentMetrics.psnr} <span className="metric-unit">dB</span></div>
                <div className="metric-sub">+6.4 dB over bicubic</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">STRUCTURAL SSIM</div>
                <div className="metric-value">{currentMetrics.ssim}</div>
                <div className="metric-sub">Sharp architectural edges</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">SPECTRAL ANGLE (SAM)</div>
                <div className="metric-value">{currentMetrics.sam} <span className="metric-unit">rad</span></div>
                <div className="metric-sub">Radiance preserved</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">OBSERVATION CONSISTENCY</div>
                <div className="metric-value" style={{ color: 'var(--deep-sage)' }}>{currentMetrics.match} <span className="metric-unit">%</span></div>
                <div className="metric-sub">Inversion match</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">HALLUCINATION RISK</div>
                <div className="metric-value" style={{ color: 'var(--deep-sage)' }}>{currentMetrics.risk}</div>
                <div className="metric-sub">Epistemic Variance Guard</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SPLIT COMPARISON SLIDER */}
      {activeTab === 'SPLIT' && (
        <div className="flex-col" style={{ gap: '12px' }}>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <Sliders size={14} color="var(--deep-sage)" />
                <span>INTERACTIVE BEFORE / AFTER RECONSTRUCTION SLIDER</span>
              </span>
              <span className="badge badge-ready">DRAG HANDLE TO COMPARE</span>
            </div>
            <div className="panel-body" style={{ padding: 0, position: 'relative' }}>
              <GisMapCanvas
                mode="2.5m-geosr"
                height={460}
                splitView={true}
                splitPos={splitPos}
                onSplitPosChange={setSplitPos}
                title="10M RAW vs 2.5M GEOSR-X RECONSTRUCTION"
                badgeText={`MODEL: ${selectedModel}`}
              />
            </div>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--surface-subtle)', borderTop: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--secondary-text)' }}>
                Drag the divider handle horizontally across the map canvas to inspect edge sharpening & spectral fidelity.
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-xs" onClick={() => setSplitPos(0.25)}>25% Left</button>
                <button className="btn btn-xs" onClick={() => setSplitPos(0.50)}>50% Center</button>
                <button className="btn btn-xs" onClick={() => setSplitPos(0.75)}>75% Right</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 2×2 COMPARISON MATRIX */}
      {activeTab === 'COMPARE' && (
        <div className="flex-col" style={{ gap: '12px' }}>
          {/* Controls toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['RGB', 'FALSE COLOR', 'NDVI', 'EDGE', 'DIFFERENCE'] as const).map(mode => (
                <button
                  key={mode}
                  className={`btn btn-xs ${activeBandMode === mode ? 'btn-primary' : ''}`}
                  onClick={() => {
                    setActiveBandMode(mode);
                    showToast(`Spectral mode: ${mode}`);
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--surface-main)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', padding: '3px 10px' }}>
              <span className="tech-label" style={{ fontSize: '9px' }}>OPACITY</span>
              <input 
                type="range" 
                min="0.2" 
                max="1" 
                step="0.05"
                value={opacity}
                onChange={e => setOpacity(parseFloat(e.target.value))}
                style={{ width: '60px', cursor: 'pointer' }}
              />
              <span className="mono" style={{ fontSize: '10.5px' }}>{Math.round(opacity * 100)}%</span>
            </div>
          </div>

          {/* 2x2 Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="panel">
              <div className="panel-header" style={{ padding: '6px 12px' }}>
                <span className="panel-title" style={{ fontSize: '11px' }}>1. ORIGINAL INPUT (10 METER)</span>
                <span className="badge badge-muted">SENTINEL-2 L2A</span>
              </div>
              <GisMapCanvas 
                mode={getRenderModeForQuadrant('raw')}
                height={260}
                zoom={sharedZoom}
                center={sharedCenter}
                onZoomChange={setSharedZoom}
                onCenterChange={setSharedCenter}
                opacity={opacity}
                title="10m RAW BOA"
              />
            </div>

            <div className="panel">
              <div className="panel-header" style={{ padding: '6px 12px' }}>
                <span className="panel-title" style={{ fontSize: '11px' }}>2. GEOSR-X RECONSTRUCTION (2.5 METER)</span>
                <span className="badge badge-ready">PHYSICS GUIDED</span>
              </div>
              <GisMapCanvas 
                mode={getRenderModeForQuadrant('geosr')}
                height={260}
                zoom={sharedZoom}
                center={sharedCenter}
                onZoomChange={setSharedZoom}
                onCenterChange={setSharedCenter}
                opacity={opacity}
                title="2.5m SUPER-RESOLVED"
              />
            </div>

            <div className="panel">
              <div className="panel-header" style={{ padding: '6px 12px' }}>
                <span className="panel-title" style={{ fontSize: '11px' }}>3. HIGH-RES AERIAL REFERENCE</span>
                <span className="badge badge-slate">0.5M GROUND TRUTH</span>
              </div>
              <GisMapCanvas 
                mode={getRenderModeForQuadrant('ref')}
                height={260}
                zoom={sharedZoom}
                center={sharedCenter}
                onZoomChange={setSharedZoom}
                onCenterChange={setSharedCenter}
                opacity={opacity}
                title="REFERENCE TRUTH"
              />
            </div>

            <div className="panel">
              <div className="panel-header" style={{ padding: '6px 12px' }}>
                <span className="panel-title" style={{ fontSize: '11px' }}>4. SPECTRAL DIFFERENCE / ERROR MAP</span>
                <span className="badge badge-slate">SAM 0.034 rad</span>
              </div>
              <GisMapCanvas 
                mode="difference"
                height={260}
                zoom={sharedZoom}
                center={sharedCenter}
                onZoomChange={setSharedZoom}
                onCenterChange={setSharedCenter}
                opacity={opacity}
                title="RESIDUAL RESIDUAL"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RELIABILITY & UNCERTAINTY */}
      {activeTab === 'RELIABILITY' && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <ShieldCheck size={14} color="var(--deep-sage)" />
                <span>SPATIAL RELIABILITY & UNCERTAINTY HEATMAP</span>
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge badge-ready">High Conf (71%)</span>
                <span className="badge badge-warning">Moderate (22%)</span>
                <span className="badge badge-critical">Uncert (7%)</span>
              </div>
            </div>
            <div className="panel-body" style={{ padding: '0' }}>
              <GisMapCanvas 
                mode="reliability" 
                height={400} 
                title="BAYESIAN UNCERTAINTY HEATMAP"
                badgeText="VARIANCE &lt; 0.048"
              />
            </div>
          </div>

          <div className="flex-col" style={{ gap: '12px' }}>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">PIXEL CONFIDENCE PARTITION</span>
                <span className="badge badge-ready">ZERO SYNTHETIC ARTIFACTS</span>
              </div>
              <div className="panel-body flex-col" style={{ gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>High Confidence Tier</span>
                    <span className="mono">71.4% (1.73 km²)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '71.4%', height: '100%', backgroundColor: 'var(--deep-sage)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>Moderate Uncertainty Tier</span>
                    <span className="mono">21.8% (0.53 km²)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '21.8%', height: '100%', backgroundColor: 'var(--warning)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>High Uncertainty (Shadows)</span>
                    <span className="mono">6.8% (0.17 km²)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--surface-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '6.8%', height: '100%', backgroundColor: 'var(--critical)' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">CROSS-SENSOR VERIFICATION AUDIT</span>
              </div>
              <table className="tech-table">
                <tbody>
                  <tr>
                    <td>Observation Consistency</td>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>94.2%</td>
                    <td><span className="badge badge-ready">VERIFIED</span></td>
                  </tr>
                  <tr>
                    <td>Spectral Consistency</td>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>91.6%</td>
                    <td><span className="badge badge-ready">VERIFIED</span></td>
                  </tr>
                  <tr>
                    <td>Temporal Invariance</td>
                    <td className="mono" style={{ fontWeight: 600 }}>88.4%</td>
                    <td><span className="badge badge-ready">STABLE</span></td>
                  </tr>
                  <tr>
                    <td>Hallucination Risk</td>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--deep-sage)' }}>LOW (0.048)</td>
                    <td><span className="badge badge-ready">BOUNDED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
