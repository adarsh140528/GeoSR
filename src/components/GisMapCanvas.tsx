import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Compass, Maximize2, Layers, RefreshCw } from 'lucide-react';

export type MapMode = 
  | '10m-raw' 
  | '2.5m-geosr' 
  | 'bicubic'
  | 'reference' 
  | 'difference' 
  | 'false-color' 
  | 'ndvi' 
  | 'edge' 
  | 'reliability' 
  | 'uncertainty'
  | 'geoai' 
  | 'change-detection' 
  | 'disaster-flood' 
  | 'agriculture-nashik' 
  | 'urban-growth'
  | string;

export interface GisMapCanvasProps {
  mode: MapMode;
  height?: number | string;
  showControls?: boolean;
  showCoordinates?: boolean;
  showScaleBar?: boolean;
  showLayerBar?: boolean;
  activeLayers?: string[];
  opacity?: number;
  zoom?: number;
  center?: [number, number];
  onZoomChange?: (z: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  title?: string;
  badgeText?: string;
  customOverlay?: React.ReactNode;
  splitView?: boolean;
  splitPos?: number;
  onSplitPosChange?: (pos: number) => void;
}

export const GisMapCanvas: React.FC<GisMapCanvasProps> = ({
  mode,
  height = 360,
  showControls = true,
  showCoordinates = true,
  showScaleBar = true,
  showLayerBar = false,
  opacity = 1,
  zoom: externalZoom,
  center: externalCenter,
  onZoomChange,
  onCenterChange,
  title,
  badgeText,
  customOverlay,
  splitView,
  splitPos,
  onSplitPosChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [internalZoom, setInternalZoom] = useState(1);
  const [internalCenter, setInternalCenter] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTabLayer, setActiveTabLayer] = useState('RGB');
  const [hoverCoords, setHoverCoords] = useState<{ lat: string; lon: string; b4: number; b8: number } | null>(null);

  const effectiveZoom = externalZoom !== undefined ? externalZoom : internalZoom;
  const effectiveCenter = externalCenter !== undefined ? externalCenter : internalCenter;

  const handleZoomIn = () => {
    const next = Math.min(effectiveZoom * 1.25, 4);
    if (onZoomChange) onZoomChange(next);
    else setInternalZoom(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(effectiveZoom / 1.25, 0.6);
    if (onZoomChange) onZoomChange(next);
    else setInternalZoom(next);
  };

  const handleReset = () => {
    if (onZoomChange) onZoomChange(1);
    else setInternalZoom(1);
    if (onCenterChange) onCenterChange([0, 0]);
    else setInternalCenter([0, 0]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - effectiveCenter[0], y: e.clientY - effectiveCenter[1] });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const next: [number, number] = [
        e.clientX - dragStart.x,
        e.clientY - dragStart.y
      ];
      if (onCenterChange) onCenterChange(next);
      else setInternalCenter(next);
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      const lat = (19.1245 + (0.5 - relY) * 0.04).toFixed(4);
      const lon = (72.8682 + (relX - 0.5) * 0.05).toFixed(4);
      const b4 = Math.round(1200 + relX * 400);
      const b8 = Math.round(2800 + (1 - relY) * 900);
      setHoverCoords({ lat, lon, b4, b8 });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 600;
    const heightPx = typeof height === 'number' ? height : 360;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = heightPx * dpr;
    ctx.scale(dpr, dpr);

    // Deep Dark Satellite Base
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, heightPx);

    ctx.save();
    ctx.translate(width / 2 + effectiveCenter[0], heightPx / 2 + effectiveCenter[1]);
    ctx.scale(effectiveZoom, effectiveZoom);
    ctx.translate(-width / 2, -heightPx / 2);

    const isSR = mode === '2.5m-geosr' || mode === 'geoai' || mode === 'change-detection' || mode === 'uncertainty' || mode === 'reliability';

    // 1. Terrain / vegetation background
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(-100, -100, width + 200, heightPx + 200);

    // 2. Agricultural or secondary land parcels
    ctx.fillStyle = mode === 'agriculture-nashik' ? '#14532D' : '#1E3A5F';
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(width * 0.45, 10);
    ctx.lineTo(width * 0.4, heightPx * 0.45);
    ctx.lineTo(20, heightPx * 0.4);
    ctx.closePath();
    ctx.fill();

    // 3. Dense Urban zone
    ctx.fillStyle = isSR ? '#334155' : '#1E293B';
    ctx.beginPath();
    ctx.moveTo(width * 0.35, heightPx * 0.2);
    ctx.lineTo(width * 0.95, heightPx * 0.15);
    ctx.lineTo(width * 0.9, heightPx * 0.9);
    ctx.lineTo(width * 0.3, heightPx * 0.85);
    ctx.closePath();
    ctx.fill();

    // 4. Water body / River
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = isSR ? 20 : 26;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-40, heightPx * 0.8);
    ctx.bezierCurveTo(width * 0.3, heightPx * 0.7, width * 0.6, heightPx * 0.95, width + 40, heightPx * 0.6);
    ctx.stroke();

    // 5. Road networks
    ctx.strokeStyle = isSR ? '#94A3B8' : '#64748B';
    ctx.lineWidth = isSR ? 2.5 : 4.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.1, -20);
    ctx.lineTo(width * 0.85, heightPx + 20);
    ctx.moveTo(-20, heightPx * 0.45);
    ctx.lineTo(width + 20, heightPx * 0.4);
    ctx.moveTo(width * 0.4, heightPx * 0.1);
    ctx.lineTo(width * 0.35, heightPx * 0.9);
    ctx.moveTo(width * 0.65, heightPx * 0.1);
    ctx.lineTo(width * 0.6, heightPx * 0.9);
    ctx.stroke();

    // Crisp buildings for 2.5m
    if (isSR) {
      const buildings = [
        { x: width * 0.42, y: heightPx * 0.25, w: 22, h: 16, color: '#E2E8F0' },
        { x: width * 0.48, y: heightPx * 0.23, w: 30, h: 20, color: '#CBD5E1' },
        { x: width * 0.56, y: heightPx * 0.28, w: 18, h: 25, color: '#94A3B8' },
        { x: width * 0.45, y: heightPx * 0.35, w: 35, h: 24, color: '#E2E8F0' },
        { x: width * 0.54, y: heightPx * 0.38, w: 20, h: 18, color: '#F1F5F9' },
        { x: width * 0.62, y: heightPx * 0.33, w: 28, h: 22, color: '#CBD5E1' },
        { x: width * 0.70, y: heightPx * 0.36, w: 40, h: 30, color: '#94A3B8' },
        { x: width * 0.48, y: heightPx * 0.50, w: 25, h: 20, color: '#CBD5E1' },
        { x: width * 0.56, y: heightPx * 0.52, w: 32, h: 22, color: '#E2E8F0' },
        { x: width * 0.68, y: heightPx * 0.48, w: 45, h: 35, color: '#94A3B8' },
        { x: width * 0.78, y: heightPx * 0.55, w: 24, h: 20, color: '#CBD5E1' },
        { x: width * 0.42, y: heightPx * 0.62, w: 28, h: 18, color: '#E2E8F0' }
      ];

      buildings.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.75;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });
    }

    // Specific Overlays
    if (mode === 'geoai') {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';

      const polys = [
        [ { x: width * 0.42, y: heightPx * 0.25 }, { x: width * 0.42 + 22, y: heightPx * 0.25 }, { x: width * 0.42 + 22, y: heightPx * 0.25 + 16 }, { x: width * 0.42, y: heightPx * 0.25 + 16 } ],
        [ { x: width * 0.48, y: heightPx * 0.23 }, { x: width * 0.48 + 30, y: heightPx * 0.23 }, { x: width * 0.48 + 30, y: heightPx * 0.23 + 20 }, { x: width * 0.48, y: heightPx * 0.23 + 20 } ],
        [ { x: width * 0.70, y: heightPx * 0.36 }, { x: width * 0.70 + 40, y: heightPx * 0.36 }, { x: width * 0.70 + 40, y: heightPx * 0.36 + 30 }, { x: width * 0.70, y: heightPx * 0.36 + 30 } ]
      ];

      polys.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, -20);
      ctx.lineTo(width * 0.85, heightPx + 20);
      ctx.stroke();

    } else if (mode === 'change-detection') {
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';

      ctx.fillRect(width * 0.48, heightPx * 0.50, 25, 20);
      ctx.strokeRect(width * 0.48, heightPx * 0.50, 25, 20);

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.65, heightPx * 0.4);
      ctx.lineTo(width * 0.85, heightPx * 0.43);
      ctx.stroke();

    } else if (mode === 'uncertainty' || mode === 'reliability') {
      const grad = ctx.createRadialGradient(width * 0.55, heightPx * 0.45, 10, width * 0.55, heightPx * 0.45, width * 0.4);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
      grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.4)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, heightPx);

    } else if (mode === 'disaster-flood') {
      ctx.fillStyle = 'rgba(2, 132, 199, 0.7)';
      ctx.beginPath();
      ctx.moveTo(-50, heightPx * 0.4);
      ctx.bezierCurveTo(width * 0.4, heightPx * 0.35, width * 0.6, heightPx * 0.75, width + 50, heightPx * 0.5);
      ctx.lineTo(width + 50, heightPx + 50);
      ctx.lineTo(-50, heightPx + 50);
      ctx.closePath();
      ctx.fill();

      const criticalPoints = [
        { x: width * 0.38, y: heightPx * 0.52, label: 'Zone 1: Residential' },
        { x: width * 0.55, y: heightPx * 0.68, label: 'Zone 2: Bridge Access' },
        { x: width * 0.2, y: heightPx * 0.75, label: 'Zone 3: Substation' }
      ];

      criticalPoints.forEach(cp => {
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#0F172A';
        ctx.fillRect(cp.x + 10, cp.y - 8, 140, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '9px Inter';
        ctx.fillText(cp.label, cp.x + 14, cp.y + 3);
      });
    }

    // Grid crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, -200);
      ctx.lineTo(x, heightPx + 200);
      ctx.stroke();
    }
    for (let y = 0; y < heightPx; y += 100) {
      ctx.beginPath();
      ctx.moveTo(-200, y);
      ctx.lineTo(width + 200, y);
      ctx.stroke();
    }

    ctx.restore();
  }, [mode, effectiveZoom, effectiveCenter, opacity, height]);

  useEffect(() => {
    renderCanvas();
    const handleResize = () => renderCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  return (
    <div 
      ref={containerRef}
      className="gis-map-container"
      style={{ height, cursor: isDragging ? 'grabbing' : 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Top Left Title / Layer Selection */}
      {(title || showLayerBar) && (
        <div className="gis-layer-bar">
          {title && (
            <span style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              color: '#FFFFFF', 
              padding: '4px 10px', 
              fontSize: '11px', 
              fontWeight: 700,
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.01em'
            }}>
              {title}
            </span>
          )}
          {badgeText && (
            <span className="pill-badge pill-green" style={{ fontSize: '10.5px' }}>
              {badgeText}
            </span>
          )}
          {showLayerBar && (
            <>
              {['RGB', 'False Color', 'NDVI', 'Edge'].map(layer => (
                <button
                  key={layer}
                  className={`gis-layer-btn ${activeTabLayer === layer ? 'active' : ''}`}
                  onClick={() => setActiveTabLayer(layer)}
                >
                  {layer}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Map Navigation Controls */}
      {showControls && (
        <div className="gis-controls">
          <button className="gis-btn" title="Zoom In" onClick={handleZoomIn}><ZoomIn size={14} /></button>
          <button className="gis-btn" title="Zoom Out" onClick={handleZoomOut}><ZoomOut size={14} /></button>
          <button className="gis-btn" title="Reset View" onClick={handleReset}><RefreshCw size={13} /></button>
          <button className="gis-btn" title="North Orientation"><Compass size={14} /></button>
          <button className="gis-btn" title="Toggle Fullscreen"><Maximize2 size={13} /></button>
        </div>
      )}

      {/* Dynamic Scale Bar */}
      {showScaleBar && (
        <div className="gis-scale-bar">
          <div style={{ width: '36px', height: '2px', backgroundColor: '#0F172A' }} />
          <span>{(100 / effectiveZoom).toFixed(0)} m</span>
          <span style={{ color: '#94A3B8' }}>|</span>
          <span>1:{Math.round(2500 / effectiveZoom)}</span>
        </div>
      )}

      {/* Live Probe & Coordinate Readout */}
      {showCoordinates && hoverCoords && (
        <div className="gis-coords">
          <span className="mono">{hoverCoords.lat}°N, {hoverCoords.lon}°E</span>
          <span style={{ color: '#94A3B8', marginLeft: '6px' }}>|</span>
          <span className="mono" style={{ marginLeft: '6px', color: 'var(--primary-blue)', fontWeight: 600 }}>B4:{hoverCoords.b4} B8:{hoverCoords.b8}</span>
        </div>
      )}

      {/* Split Slider Divider Overlay */}
      {splitView && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(splitPos ?? 0.5) * 100}%`,
            width: '2px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 10px rgba(0,0,0,0.6)',
            zIndex: 10,
            cursor: 'ew-resize',
            pointerEvents: 'auto'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const handleMouseMove = (moveEvent: MouseEvent) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              const newPos = Math.max(0.05, Math.min(0.95, (moveEvent.clientX - rect.left) / rect.width));
              if (onSplitPosChange) onSplitPosChange(newPos);
            };
            const handleMouseUp = () => {
              window.removeEventListener('mousemove', handleMouseMove);
              window.removeEventListener('mouseup', handleMouseUp);
            };
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-14px',
            transform: 'translateY(-50%)',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.5)',
            border: '2px solid #FFFFFF'
          }}>
            ↔
          </div>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#FFFFFF',
            fontSize: '10.5px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            2.5m Super-Resolved
          </div>
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '-120px',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#FFFFFF',
            fontSize: '10.5px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            10m Sentinel-2 (Raw)
          </div>
        </div>
      )}

      {customOverlay}
    </div>
  );
};
