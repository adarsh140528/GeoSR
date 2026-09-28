import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Compass, Maximize2, Layers, RefreshCw, Upload, ImageIcon } from 'lucide-react';
import { useUserImage } from '../context/ImageContext';

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
  onUploadClick?: () => void;
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
  onSplitPosChange,
  onUploadClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { userImage, metadata, setUserImageFromFile } = useUserImage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!userImage) return;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        await setUserImageFromFile(e.target.files[0]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Helper to choose appropriate filtered source canvas depending on mode
  const getSourceCanvas = useCallback((): HTMLCanvasElement | null => {
    if (!userImage) return null;

    switch (mode) {
      case '10m-raw':
        return userImage.blurred;
      case '2.5m-geosr':
        return userImage.sharp;
      case 'bicubic':
        return userImage.bicubic;
      case 'difference':
      case 'edge':
        return userImage.diff;
      case 'uncertainty':
      case 'reliability':
        return userImage.uncertainty;
      case 'geoai':
        return userImage.geoaiOverlay;
      case 'change-detection':
        return userImage.changeOverlay;
      case 'disaster-flood':
        return userImage.disasterOverlay;
      case 'agriculture-nashik':
        return userImage.agriOverlay;
      case 'urban-growth':
        return userImage.urbanOverlay;
      default:
        return userImage.original;
    }
  }, [userImage, mode]);

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

    // Deep Dark Base
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, width, heightPx);

    const source = getSourceCanvas();

    if (source) {
      ctx.save();
      ctx.translate(width / 2 + effectiveCenter[0], heightPx / 2 + effectiveCenter[1]);
      ctx.scale(effectiveZoom, effectiveZoom);
      ctx.translate(-width / 2, -heightPx / 2);

      // Draw the actual image canvas scaled to cover the container maintaining ratio
      const imgRatio = source.width / source.height;
      const containerRatio = width / heightPx;
      let drawW = width;
      let drawH = heightPx;
      let offsetX = 0;
      let offsetY = 0;

      if (containerRatio > imgRatio) {
        drawH = width / imgRatio;
        offsetY = (heightPx - drawH) / 2;
      } else {
        drawW = heightPx * imgRatio;
        offsetX = (width - drawW) / 2;
      }

      ctx.drawImage(source, offsetX, offsetY, drawW, drawH);

      // Subtle coordinate grid crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x, heightPx + 200); ctx.stroke();
      }
      for (let y = 0; y < heightPx; y += 80) {
        ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(width + 200, y); ctx.stroke();
      }

      ctx.restore();
    }
  }, [getSourceCanvas, effectiveZoom, effectiveCenter, height]);

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
      style={{ height, cursor: !userImage ? 'default' : isDragging ? 'grabbing' : 'crosshair', position: 'relative' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <input ref={fileInputRef} type="file" accept="image/*,.tif,.tiff" style={{ display: 'none' }} onChange={handleFileChange} />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Upload Placeholder when no image loaded */}
      {!userImage && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(6, 8, 16, 0.88)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '12px', padding: '20px', zIndex: 12, textAlign: 'center'
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: '12px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-accent)'
          }}>
            <ImageIcon size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: 2 }}>
              No Satellite Image Uploaded
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              Upload your aerial/satellite image to process and view {title || mode}
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={13} /> Upload Image File
          </button>
        </div>
      )}

      {/* Top Left Title / Layer Selection */}
      {(title || showLayerBar) && userImage && (
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
          {metadata && (
            <span className="pill-badge pill-slate mono" style={{ fontSize: '10px' }}>
              {metadata.filename}
            </span>
          )}
        </div>
      )}

      {/* Map Navigation Controls */}
      {showControls && userImage && (
        <div className="gis-controls">
          <button className="gis-btn" title="Zoom In" onClick={handleZoomIn}><ZoomIn size={14} /></button>
          <button className="gis-btn" title="Zoom Out" onClick={handleZoomOut}><ZoomOut size={14} /></button>
          <button className="gis-btn" title="Reset View" onClick={handleReset}><RefreshCw size={13} /></button>
          <button className="gis-btn" title="North Orientation"><Compass size={14} /></button>
          <button className="gis-btn" title="Toggle Fullscreen"><Maximize2 size={13} /></button>
        </div>
      )}

      {/* Dynamic Scale Bar */}
      {showScaleBar && userImage && (
        <div className="gis-scale-bar">
          <div style={{ width: '36px', height: '2px', backgroundColor: '#0F172A' }} />
          <span>{(100 / effectiveZoom).toFixed(0)} m</span>
          <span style={{ color: '#94A3B8' }}>|</span>
          <span>1:{Math.round(2500 / effectiveZoom)}</span>
        </div>
      )}

      {/* Live Probe & Coordinate Readout */}
      {showCoordinates && hoverCoords && userImage && (
        <div className="gis-coords">
          <span className="mono">{hoverCoords.lat}°N, {hoverCoords.lon}°E</span>
          <span style={{ color: '#94A3B8', marginLeft: '6px' }}>|</span>
          <span className="mono" style={{ marginLeft: '6px', color: 'var(--primary-blue)', fontWeight: 600 }}>B4:{hoverCoords.b4} B8:{hoverCoords.b8}</span>
        </div>
      )}

      {customOverlay}
    </div>
  );
};

