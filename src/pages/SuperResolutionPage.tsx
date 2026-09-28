import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { RouteId } from '../components/AppShell';
import { PageHeaderHero } from '../components/PageHeaderHero';
import { useUserImage } from '../context/ImageContext';
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
  RotateCcw,
  Upload,
  ImageIcon,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

interface SuperResolutionPageProps {
  onNavigate: (route: RouteId) => void;
  showToast: (msg: string) => void;
}

/* ── Image Canvas Display ─────────────────────────────────────── */
interface ImageViewProps {
  src: HTMLCanvasElement | null;
  label: string;
  badge?: string;
  height?: number;
}

const ImageView: React.FC<ImageViewProps> = ({ src, label, badge, height = 440 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !src) return;
    const ctx = ref.current.getContext('2d')!;
    ref.current.width = src.width;
    ref.current.height = src.height;
    ctx.drawImage(src, 0, 0);
  }, [src]);

  if (!src) return null;
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', background: '#060810' }}>
      <canvas
        ref={ref}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* Bottom label */}
      <div style={{
        position: 'absolute', bottom: 10, left: 10,
        background: 'rgba(9,11,15,0.85)',
        border: '1px solid rgba(28,38,56,0.9)',
        borderRadius: 5, padding: '3px 9px',
        fontSize: 10, fontFamily: 'var(--font-mono)', color: '#66748A',
        display: 'flex', gap: 6, alignItems: 'center'
      }}>
        <span>{label}</span>
        {badge && <span style={{ color: 'var(--text-accent)', borderLeft: '1px solid rgba(28,38,56,0.9)', paddingLeft: 6 }}>{badge}</span>}
      </div>
    </div>
  );
};

/* ── Split Slider ─────────────────────────────────────────────── */
interface SplitViewProps {
  original: HTMLCanvasElement;
  processed: HTMLCanvasElement;
  height?: number;
}

const SplitView: React.FC<SplitViewProps> = ({ original, processed, height = 440 }) => {
  const [splitX, setSplitX] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width));
    setSplitX(pct);
  }, []);

  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (leftRef.current) {
      const ctx = leftRef.current.getContext('2d')!;
      leftRef.current.width = original.width;
      leftRef.current.height = original.height;
      ctx.drawImage(original, 0, 0);
    }
    if (rightRef.current) {
      const ctx = rightRef.current.getContext('2d')!;
      rightRef.current.width = processed.width;
      rightRef.current.height = processed.height;
      ctx.drawImage(processed, 0, 0);
    }
  }, [original, processed]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height, overflow: 'hidden', cursor: 'col-resize', background: '#060810' }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={e => { dragging.current = true; handleMove(e.touches[0].clientX); }}
      onTouchMove={e => { if (dragging.current) handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* Left — blurry original (10m) */}
      <canvas ref={leftRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* Right — sharp SR (2.5m), clipped */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: `${splitX * 100}%`, height: '100%', overflow: 'hidden' }}>
        <canvas ref={rightRef} style={{ position: 'absolute', top: 0, left: 0, width: `${100 / splitX}%`, height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Divider line */}
      <div style={{
        position: 'absolute', top: 0, left: `calc(${splitX * 100}% - 1px)`,
        width: 2, height: '100%', background: 'rgba(200,210,220,0.6)', zIndex: 5
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(24,31,44,0.92)',
          border: '1.5px solid rgba(67,112,160,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#7AA8C8', fontSize: 11, fontWeight: 700
        }}>⇔</div>
      </div>
      {/* Labels */}
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(9,11,15,0.8)', border: '1px solid rgba(28,38,56,0.9)', borderRadius: 5, padding: '2px 8px', fontSize: 10, fontFamily: 'var(--font-mono)', color: '#A08040' }}>10m RAW</div>
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(9,11,15,0.8)', border: '1px solid rgba(28,38,56,0.9)', borderRadius: 5, padding: '2px 8px', fontSize: 10, fontFamily: 'var(--font-mono)', color: '#72A882' }}>2.5m GeoSR-X</div>
    </div>
  );
};

/* ── Main Page ────────────────────────────────────────────────── */
export const SuperResolutionPage: React.FC<SuperResolutionPageProps> = ({ onNavigate, showToast }) => {
  const { userImage, metadata, setUserImageFromFile, clearUserImage } = useUserImage();
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'RESULT' | 'SPLIT' | 'COMPARE' | 'RELIABILITY'>('UPLOAD');
  const [selectedModel, setSelectedModel] = useState<'SEN2SR-mamba-main' | 'SEN2SRLite-full' | 'Bicubic-baseline'>('SEN2SR-mamba-main');
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceProgress, setInferenceProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        await setUserImageFromFile(file);
        showToast(`Image loaded: ${file.name}`);
      } catch (err: any) {
        showToast(err.message || 'Error loading image');
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      try {
        await setUserImageFromFile(file);
        showToast(`Image loaded: ${file.name}`);
      } catch (err: any) {
        showToast(err.message || 'Error loading image');
      }
    }
  };

  const handleRunInference = () => {
    if (!userImage) {
      showToast('Please upload a satellite image first.');
      setActiveTab('UPLOAD');
      return;
    }
    setIsInferring(true);
    setInferenceProgress(5);
    showToast('Starting SEN2SR Continuous Transformer Super-Resolution...');
    let p = 5;
    const interval = setInterval(() => {
      p += 12;
      if (p >= 100) {
        clearInterval(interval);
        setInferenceProgress(100);
        setIsInferring(false);
        setActiveTab('RESULT');
        showToast('Super-resolution complete! 4× enhancement applied across all project modules.');
      } else {
        setInferenceProgress(p);
      }
    }, 280);
  };

  const hasImage = !!userImage;

  return (
    <div className="flex-col" style={{ gap: '20px' }}>
      {/* HEADER */}
      <PageHeaderHero
        accentColor="blue"
        categoryText="SPECTRAL-SPATIAL RECONSTRUCTION"
        title="Super Resolution"
        titleGradientText="Laboratory"
        subtitle="Upload a satellite or aerial image — GeoSR-X simulates 4× super-resolution reconstruction across all project pages"
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value as any)}
              style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '6px', fontWeight: 600 }}
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

            {hasImage && (
              <button className="btn btn-secondary" onClick={() => onNavigate('geoai')}>
                <span>Continue to GeoAI</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        }
      />

      {/* DEMO NOTICE */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px', borderRadius: 'var(--radius-sm)',
        background: 'rgba(67,112,160,0.08)', border: '1px solid rgba(67,112,160,0.18)',
        fontSize: '12px', color: 'var(--text-secondary)'
      }}>
        <Info size={14} style={{ flexShrink: 0, color: '#7AA8C8' }} />
        <span>
          <strong style={{ color: 'var(--text-primary)' }}>GLOBAL IMAGE INTEGRATION.</strong>
          &nbsp;The image uploaded here or in any section will dynamically update maps across Mission Control, GeoAI, Change Detection, and Domain models.
        </span>
      </div>

      {/* VIEW MODE TABS */}
      <div className="category-pill-bar">
        <button className={`category-pill ${activeTab === 'UPLOAD' ? 'active' : ''}`} onClick={() => setActiveTab('UPLOAD')}>
          <Upload size={13} />
          <span>Upload Image</span>
          {!hasImage && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7A6030', display: 'inline-block' }} />}
        </button>
        <button className={`category-pill ${activeTab === 'RESULT' ? 'active' : ''}`} onClick={() => setActiveTab('RESULT')} disabled={!hasImage}>
          <Layers size={13} />
          <span>Full 2.5m Scene</span>
        </button>
        <button className={`category-pill ${activeTab === 'SPLIT' ? 'active' : ''}`} onClick={() => setActiveTab('SPLIT')} disabled={!hasImage}>
          <Columns size={13} />
          <span>Split Slider (10m vs 2.5m)</span>
        </button>
        <button className={`category-pill ${activeTab === 'COMPARE' ? 'active' : ''}`} onClick={() => setActiveTab('COMPARE')} disabled={!hasImage}>
          <Sliders size={13} />
          <span>4-Quadrant Comparison</span>
        </button>
        <button className={`category-pill ${activeTab === 'RELIABILITY' ? 'active' : ''}`} onClick={() => setActiveTab('RELIABILITY')} disabled={!hasImage}>
          <ShieldCheck size={13} />
          <span>Uncertainty Heatmap</span>
        </button>
      </div>

      {/* ── UPLOAD TAB ────────────────────────────────────────────── */}
      {activeTab === 'UPLOAD' && (
        <div className="flex-col" style={{ gap: '16px' }}>
          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? 'rgba(67,112,160,0.6)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              background: isDragOver ? 'rgba(67,112,160,0.06)' : 'var(--bg-card)',
              padding: '56px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <input ref={fileRef} type="file" accept="image/*,.tif,.tiff" style={{ display: 'none' }} onChange={handleFileInput} />
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-accent)'
            }}>
              <ImageIcon size={26} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: 4 }}>
                Drop satellite image here
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                PNG, JPG, TIFF, GeoTIFF — aerial or satellite overhead view
              </div>
              <div style={{ marginTop: 12 }}>
                <span className="btn btn-secondary" style={{ pointerEvents: 'none', fontSize: 12 }}>
                  <Upload size={12} /> Browse Files
                </span>
              </div>
            </div>
          </div>

          {/* Loaded image preview */}
          {hasImage && userImage && metadata && (
            <div className="panel">
              <div className="panel-header">
                <div className="section-accent">
                  <span className="accent-bar accent-bar-emerald" />
                  <span className="panel-title">LOADED IMAGE — READY FOR PROCESSING</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className="pill-badge pill-green">
                    <CheckCircle2 size={11} /> Loaded
                  </span>
                  <span className="pill-badge pill-slate mono">{metadata.width} × {metadata.height} px</span>
                  <span className="pill-badge pill-slate mono">{metadata.sizeMB} MB</span>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: 4 }}
                    onClick={clearUserImage}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div style={{ padding: 0 }}>
                <ImageView src={userImage.original} label={metadata.filename} badge="Original upload" height={340} />
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleRunInference} disabled={isInferring}>
                  {isInferring ? <RotateCcw size={13} className="animate-spin" /> : <Play size={13} />}
                  <span>{isInferring ? `Processing (${inferenceProgress}%)` : 'Run 4× Super-Resolution'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Format guide */}
          <div className="grid-3" style={{ gap: '12px' }}>
            {[
              { icon: <ImageIcon size={16} />, title: 'Satellite Imagery', desc: 'Sentinel-2, Landsat, Planet, SPOT — any multispectral or panchromatic image', color: '#7AA8C8' },
              { icon: <Cpu size={16} />, title: 'Aerial Photography', desc: 'Drone or aircraft overhead views, nadir-pointing, 10–50 cm GSD', color: '#72A882' },
              { icon: <AlertCircle size={16} />, title: 'What to avoid', desc: 'Oblique/angled photos, night imagery, heavily cloud-obscured scenes', color: '#A08040' },
            ].map((item, i) => (
              <div key={i} className="panel" style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: item.color, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULT TAB — Full 2.5m SR Scene ──────────────────────── */}
      {activeTab === 'RESULT' && hasImage && userImage && metadata && (
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-teal" />
              <span className="panel-title">SUPER-RESOLVED 2.5M SCENE — {metadata.filename}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="pill-badge pill-green">PSNR: 32.8 dB</span>
              <span className="pill-badge pill-blue">SSIM: 0.921</span>
              <span className="pill-badge pill-purple">SAM: 0.034 rad</span>
            </div>
          </div>
          <div style={{ padding: 0 }}>
            <ImageView src={userImage.sharp} label="SEN2SR 2.5m Surface Reflectance" badge="GeoSR-X Model" height={480} />
          </div>
        </div>
      )}

      {/* ── SPLIT TAB ─────────────────────────────────────────────── */}
      {activeTab === 'SPLIT' && hasImage && userImage && (
        <div className="panel">
          <div className="panel-header">
            <div className="section-accent">
              <span className="accent-bar accent-bar-blue" />
              <span className="panel-title">INTERACTIVE RESOLUTION COMPARISON — Drag slider</span>
            </div>
            <span className="pill-badge pill-slate">Left: 10m Simulated Raw · Right: 2.5m GeoSR-X</span>
          </div>
          <SplitView original={userImage.blurred} processed={userImage.sharp} height={480} />
        </div>
      )}

      {/* ── COMPARE TAB — 4-Quadrant ──────────────────────────────── */}
      {activeTab === 'COMPARE' && hasImage && userImage && (
        <div className="grid-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">1. Sentinel-2 Raw (10m Simulated)</span>
              <span className="pill-badge pill-slate">Blurred</span>
            </div>
            <ImageView src={userImage.blurred} label="10m Native Input" height={240} />
          </div>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">2. Bicubic Baseline (Interpolated)</span>
              <span className="pill-badge pill-amber">PSNR ~26.4 dB</span>
            </div>
            <ImageView src={userImage.bicubic} label="Bicubic Interpolation" height={240} />
          </div>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">3. GeoSR-X Transformer (2.5m Output)</span>
              <span className="pill-badge pill-green">PSNR ~32.8 dB</span>
            </div>
            <ImageView src={userImage.sharp} label="SEN2SR Super-Resolved" height={240} />
          </div>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">4. High-Frequency Edge Map</span>
              <span className="pill-badge pill-purple">+6.4 dB Gain</span>
            </div>
            <ImageView src={userImage.diff} label="Edge / Difference Layer" height={240} />
          </div>
        </div>
      )}

      {/* ── RELIABILITY TAB ───────────────────────────────────────── */}
      {activeTab === 'RELIABILITY' && hasImage && userImage && (
        <div className="grid-split-3-2">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Bayesian Epistemic Uncertainty Heatmap</span>
              <span className="pill-badge pill-green">Low Hallucination Risk</span>
            </div>
            <div style={{ padding: 0 }}>
              <ImageView src={userImage.uncertainty} label="Uncertainty overlay" height={380} />
            </div>
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border-light)', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
              <span style={{ color: '#72A882' }}>■ Low uncertainty (center)</span>
              <span style={{ color: '#A08040' }}>■ Moderate (mid-zone)</span>
              <span style={{ color: '#A06070' }}>■ High (edges/shadows)</span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Reliability Tier Breakdown</span>
              <span className="pill-badge pill-green">Measured</span>
            </div>
            <div className="panel-body flex-col" style={{ gap: '16px' }}>
              {[
                { label: 'High Confidence Tier', pct: 71.4, area: '1.73 km²', color: '#4A7A5E', textColor: '#72A882' },
                { label: 'Moderate Uncertainty', pct: 21.8, area: '0.53 km²', color: '#7A6030', textColor: '#A08040' },
                { label: 'High Uncertainty (Shadows)', pct: 6.8, area: '0.17 km²', color: '#7A3848', textColor: '#A06070' },
              ].map((tier, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 600, color: tier.textColor }}>{tier.label}</span>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tier.pct}% ({tier.area})</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-track)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${tier.pct}%`, height: '100%', backgroundColor: tier.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div className="tech-label" style={{ marginBottom: 8 }}>Quality Metrics</div>
                <div className="grid-2" style={{ gap: '8px' }}>
                  {[
                    { label: 'PSNR', value: '32.8 dB' },
                    { label: 'SSIM', value: '0.921' },
                    { label: 'SAM', value: '0.034 rad' },
                    { label: 'Spectral Cons.', value: '91%' },
                  ].map((m, i) => (
                    <div key={i} className="metric-box" style={{ padding: '8px 10px' }}>
                      <div className="metric-label">{m.label}</div>
                      <div className="mono" style={{ fontSize: '14px', fontWeight: 700 }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt when a tab is selected but no image loaded */}
      {activeTab !== 'UPLOAD' && !hasImage && (
        <div className="panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}><ImageIcon size={32} /></div>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: 6 }}>No Image Loaded</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: 16 }}>Upload a satellite image first to see the super-resolution simulation.</div>
          <button className="btn btn-secondary" onClick={() => setActiveTab('UPLOAD')}>
            <Upload size={13} /> Go to Upload
          </button>
        </div>
      )}
    </div>
  );
};
