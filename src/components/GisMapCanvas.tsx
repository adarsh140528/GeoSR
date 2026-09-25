import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Compass, Maximize2, Layers, Eye, RefreshCw } from 'lucide-react';

export type MapMode = 
  | '10m-raw' 
  | '2.5m-geosr' 
  | 'reference' 
  | 'difference' 
  | 'false-color' 
  | 'ndvi' 
  | 'edge' 
  | 'reliability' 
  | 'geoai' 
  | 'change-detection' 
  | 'disaster-flood' 
  | 'agriculture-nashik' 
  | 'urban-growth';

interface GisMapCanvasProps {
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
  splitPos?: number; // 0 to 1
  onSplitPosChange?: (pos: number) => void;
}

export const GisMapCanvas: React.FC<GisMapCanvasProps> = ({
  mode,
  height = 420,
  showControls = true,
  showCoordinates = true,
  showScaleBar = true,
  showLayerBar = false,
  activeLayers = ['base'],
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
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoords, setHoverCoords] = useState<{ lat: string; lon: string; utm: string; b2: number; b4: number; b8: number } | null>(null);
  const [activeTabLayer, setActiveTabLayer] = useState<string>('RGB');

  const zoom = externalZoom !== undefined ? externalZoom : internalZoom;
  const center = externalCenter !== undefined ? externalCenter : internalCenter;

  const handleZoomIn = () => {
    const next = Math.min(zoom * 1.3, 4);
    if (onZoomChange) onZoomChange(next);
    else setInternalZoom(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(zoom / 1.3, 0.7);
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
    setDragStart({ x: e.clientX - center[0], y: e.clientY - center[1] });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Realistic coordinates for Mumbai / Nashik bounds
    const lat = (19.1150 - (y / rect.height) * 0.04).toFixed(4);
    const lon = (72.8550 + (x / rect.width) * 0.04).toFixed(4);
    const utm = `43N ${(273000 + x * 10).toFixed(0)} ${(2114000 + y * 10).toFixed(0)}`;
    
    // Synthetic multi-spectral reflectance
    const b2 = Math.round(80 + ((x * 3 + y * 7) % 110));
    const b4 = Math.round(95 + ((x * 5 + y * 2) % 120));
    const b8 = mode === 'agriculture-nashik' ? Math.round(210 + (x % 60)) : Math.round(110 + (y % 80));

    setHoverCoords({ lat, lon, utm, b2, b4, b8 });

    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      if (onCenterChange) onCenterChange([newX, newY]);
      else setInternalCenter([newX, newY]);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // High-fidelity procedural GIS rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const heightPx = (canvas.height = typeof height === 'number' ? height : 400);

    ctx.save();
    ctx.clearRect(0, 0, width, heightPx);

    // Apply zoom and pan transformation
    ctx.translate(width / 2 + center[0], heightPx / 2 + center[1]);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -heightPx / 2);

    ctx.globalAlpha = opacity;

    // 1. BASE TERRAIN (Realistic multi-spectral palette)
    if (mode === 'agriculture-nashik') {
      // Agricultural parcel grid
      ctx.fillStyle = '#C8BFA7'; // Soil background
      ctx.fillRect(-200, -200, width + 400, heightPx + 400);

      // Render farming plots with varying NDVI / crop tones
      const plotColors = ['#4A6B3D', '#65884B', '#8FA963', '#B8AA6E', '#8C9E5E', '#3E5C32', '#C48D4C'];
      for (let r = -2; r < 14; r++) {
        for (let c = -2; c < 16; c++) {
          const px = c * 52 + ((r % 2) * 12);
          const py = r * 44;
          const w = 48 + ((r + c) % 8);
          const h = 40 + ((r * c) % 6);
          const colIdx = Math.abs((r * 7 + c * 13) % plotColors.length);

          ctx.fillStyle = plotColors[colIdx];
          ctx.fillRect(px, py, w, h);
          ctx.strokeStyle = '#2B3026';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, w, h);

          // Parcel crop rows texture
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          for (let l = 6; l < h; l += 8) {
            ctx.moveTo(px + 3, py + l);
            ctx.lineTo(px + w - 3, py + l);
          }
          ctx.stroke();
        }
      }

      // Godavari River tributary
      ctx.strokeStyle = '#3E5E72';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-50, heightPx * 0.7);
      ctx.bezierCurveTo(width * 0.3, heightPx * 0.6, width * 0.6, heightPx * 0.85, width + 100, heightPx * 0.75);
      ctx.stroke();

    } else if (mode === 'false-color') {
      // CIR (NIR as Red, Red as Green, Green as Blue)
      ctx.fillStyle = '#6E7778'; // Urban slate
      ctx.fillRect(-200, -200, width + 400, heightPx + 400);

      // Deep red vegetation zones
      const vegPats = [
        { x: 40, y: 30, w: 180, h: 120 },
        { x: 340, y: 160, w: 220, h: 180 },
        { x: 120, y: 260, w: 160, h: 110 }
      ];
      vegPats.forEach(v => {
        ctx.fillStyle = '#942B28'; // Deep CIR vermilion
        ctx.fillRect(v.x, v.y, v.w, v.h);
      });

    } else if (mode === 'ndvi') {
      // NDVI colormap gradient
      const ndviGrad = ctx.createLinearGradient(0, 0, width, heightPx);
      ndviGrad.addColorStop(0, '#C49859'); // Low/Soil
      ndviGrad.addColorStop(0.3, '#A8B35A'); // Moderate
      ndviGrad.addColorStop(0.7, '#4E7D3F'); // High
      ndviGrad.addColorStop(1, '#234C1D'); // Dense Canopy
      ctx.fillStyle = ndviGrad;
      ctx.fillRect(-200, -200, width + 400, heightPx + 400);

      // Add urban low NDVI masks
      ctx.fillStyle = '#7C674F';
      for (let i = 0; i < 20; i++) {
        const bx = 60 + (i % 5) * 110;
        const by = 40 + Math.floor(i / 5) * 80;
        ctx.fillRect(bx, by, 70, 50);
      }

    } else if (mode === 'difference') {
      // Spectral residual map (dark graphite with localized error zones)
      ctx.fillStyle = '#171918';
      ctx.fillRect(-200, -200, width + 400, heightPx + 400);

      // Heat / error blobs (subtle amber and olive)
      const grad = ctx.createRadialGradient(width * 0.45, heightPx * 0.4, 10, width * 0.45, heightPx * 0.4, 120);
      grad.addColorStop(0, 'rgba(183, 122, 50, 0.7)');
      grad.addColorStop(0.6, 'rgba(88, 100, 74, 0.4)');
      grad.addColorStop(1, 'rgba(23, 25, 24, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width * 0.45, heightPx * 0.4, 140, 0, Math.PI * 2);
      ctx.fill();

    } else if (mode === 'reliability') {
      // Reliability & uncertainty zoning
      ctx.fillStyle = '#2A3029'; // Base high confidence
      ctx.fillRect(-200, -200, width + 400, heightPx + 400);

      // High Confidence Zone (71%) - Muted Forest Green
      ctx.fillStyle = 'rgba(77, 107, 74, 0.75)';
      ctx.fillRect(20, 20, width * 0.65, heightPx - 40);

      // Moderate Uncertainty Zone (22%) - Muted Amber
      ctx.fillStyle = 'rgba(183, 122, 50, 0.65)';
      ctx.fillRect(width * 0.65, 30, width * 0.28, heightPx * 0.55);

      // High Uncertainty Zone (7%) - Subdued Red
      ctx.fillStyle = 'rgba(169, 74, 61, 0.75)';
      ctx.beginPath();
      ctx.arc(width * 0.78, heightPx * 0.75, 45, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Standard Urban Mumbai Satellite Palette (Base Surface)
      ctx.fillStyle = '#6E6B62'; // Soil & road asphalt substrate
      ctx.fillRect(-200, -200, width + 400, heightPx + 400);

      // Water body (Mithi River & Mahim Creek estuary)
      ctx.fillStyle = '#2A3F4F';
      ctx.beginPath();
      ctx.moveTo(-50, heightPx * 0.2);
      ctx.bezierCurveTo(width * 0.35, heightPx * 0.15, width * 0.5, heightPx * 0.55, width + 100, heightPx * 0.48);
      ctx.lineTo(width + 100, heightPx * 0.62);
      ctx.bezierCurveTo(width * 0.45, heightPx * 0.7, width * 0.3, heightPx * 0.35, -50, heightPx * 0.36);
      ctx.closePath();
      ctx.fill();

      // Vegetation pockets (Aarey Colony buffer & urban parks)
      const vegPolys = [
        { x: 30, y: 40, w: 140, h: 90 },
        { x: width * 0.65, y: 50, w: 180, h: 140 },
        { x: 60, y: heightPx * 0.65, w: 190, h: 110 }
      ];
      ctx.fillStyle = '#42553B';
      vegPolys.forEach(vp => {
        ctx.beginPath();
        ctx.roundRect(vp.x, vp.y, vp.w, vp.h, [8, 16, 12, 6]);
        ctx.fill();
      });

      // Urban building blocks
      const isPixelated = mode === '10m-raw';
      const buildingCount = isPixelated ? 25 : 120;
      const blurFactor = isPixelated ? 8 : 1;

      for (let i = 0; i < buildingCount; i++) {
        const bx = 40 + (i % (isPixelated ? 5 : 12)) * (isPixelated ? 80 : 38);
        const by = 30 + Math.floor(i / (isPixelated ? 5 : 12)) * (isPixelated ? 65 : 32);
        const bw = isPixelated ? 55 : 24 + ((i * 7) % 18);
        const bh = isPixelated ? 45 : 18 + ((i * 5) % 14);

        if (isPixelated) {
          // 10m Sentinel-2 sensor pixelation effect
          ctx.fillStyle = i % 2 === 0 ? '#8E8A80' : '#A29E93';
          ctx.fillRect(Math.floor(bx / blurFactor) * blurFactor, Math.floor(by / blurFactor) * blurFactor, bw, bh);
        } else {
          // 2.5m Super-Resolved GeoSR-X crisp architectural geometries
          ctx.fillStyle = ['#A8A49A', '#B5B1A6', '#7C7972', '#C2BEB4', '#5F5C56'][i % 5];
          ctx.fillRect(bx, by, bw, bh);
          ctx.strokeStyle = '#32302C';
          ctx.lineWidth = 0.75;
          ctx.strokeRect(bx, by, bw, bh);

          // Roof shadow effect
          ctx.fillStyle = 'rgba(23, 25, 24, 0.35)';
          ctx.fillRect(bx + bw, by + 2, 3, bh);
          ctx.fillRect(bx + 2, by + bh, bw, 3);
        }
      }

      // Transportation grid (Western Express Highway & arterial corridors)
      ctx.strokeStyle = isPixelated ? '#54524C' : '#33312E';
      ctx.lineWidth = isPixelated ? 12 : 6;
      ctx.beginPath();
      // Main Highway
      ctx.moveTo(width * 0.28, -50);
      ctx.lineTo(width * 0.32, heightPx + 50);
      // Andheri-Kurla Link Road
      ctx.moveTo(-50, heightPx * 0.52);
      ctx.lineTo(width + 50, heightPx * 0.48);
      // Secondary Link
      ctx.moveTo(width * 0.7, -50);
      ctx.lineTo(width * 0.65, heightPx + 50);
      ctx.stroke();

      if (!isPixelated) {
        // Crisp lane markings & flyover shadows on GeoSR-X output
        ctx.strokeStyle = '#D1CDC2';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(width * 0.28, -50);
        ctx.lineTo(width * 0.32, heightPx + 50);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 2. VECTOR OVERLAYS BASED ON SPECIAL MODES
    if (mode === 'geoai') {
      // Building Footprint Vector Polygons
      ctx.strokeStyle = '#E0A146'; // Muted gold vector line
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(224, 161, 70, 0.2)';
      for (let i = 0; i < 18; i++) {
        const bx = 50 + (i % 6) * 75;
        const by = 40 + Math.floor(i / 6) * 65;
        ctx.fillRect(bx, by, 48, 36);
        ctx.strokeRect(bx, by, 48, 36);

        // Polygon centroid tag
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px IBM Plex Mono';
        ctx.fillText(`ID-${1024 + i}`, bx + 4, by + 12);
      }

      // Road Centerlines
      ctx.strokeStyle = '#4392C7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.28, 0);
      ctx.lineTo(width * 0.32, heightPx);
      ctx.moveTo(0, heightPx * 0.52);
      ctx.lineTo(width, heightPx * 0.48);
      ctx.stroke();

    } else if (mode === 'change-detection') {
      // Temporal Change Polygons
      // New building additions (Red/Coral)
      ctx.fillStyle = 'rgba(196, 106, 66, 0.45)';
      ctx.strokeStyle = '#C46A42';
      ctx.lineWidth = 2;
      ctx.fillRect(width * 0.42, heightPx * 0.3, 56, 44);
      ctx.strokeRect(width * 0.42, heightPx * 0.3, 56, 44);
      
      ctx.fillRect(width * 0.15, heightPx * 0.65, 48, 40);
      ctx.strokeRect(width * 0.15, heightPx * 0.65, 48, 40);

      // Road Extension (Amber)
      ctx.strokeStyle = '#B77A32';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.32, heightPx * 0.5);
      ctx.lineTo(width * 0.58, heightPx * 0.65);
      ctx.stroke();

      // Canopy Loss (Forest/Olive)
      ctx.fillStyle = 'rgba(88, 100, 74, 0.5)';
      ctx.strokeStyle = '#58644A';
      ctx.strokeRect(width * 0.65, heightPx * 0.2, 70, 50);
      ctx.fillRect(width * 0.65, heightPx * 0.2, 70, 50);

    } else if (mode === 'disaster-flood') {
      // Inundated zones
      ctx.fillStyle = 'rgba(62, 94, 114, 0.65)';
      ctx.beginPath();
      ctx.moveTo(0, heightPx * 0.3);
      ctx.bezierCurveTo(width * 0.4, heightPx * 0.2, width * 0.6, heightPx * 0.8, width, heightPx * 0.55);
      ctx.lineTo(width, heightPx);
      ctx.lineTo(0, heightPx);
      ctx.closePath();
      ctx.fill();

      // Critical damage nodes
      const criticalPoints = [
        { x: width * 0.35, y: heightPx * 0.45, label: 'ZONE 1 - 1.8m INUNDATION' },
        { x: width * 0.55, y: heightPx * 0.68, label: 'ZONE 2 - BRIDGE OVERFLOW' },
        { x: width * 0.2, y: heightPx * 0.75, label: 'ZONE 3 - POWER SUBSTATION' }
      ];

      criticalPoints.forEach(cp => {
        ctx.fillStyle = '#A94A3D';
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#171918';
        ctx.fillRect(cp.x + 10, cp.y - 8, 140, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8.5px IBM Plex Mono';
        ctx.fillText(cp.label, cp.x + 14, cp.y + 3);
      });

    } else if (mode === 'urban-growth') {
      // Multi-temporal urban extents
      ctx.strokeStyle = '#58644A'; // 2019 extent
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 50, width * 0.5, heightPx * 0.5);

      ctx.strokeStyle = '#B77A32'; // 2022 extent
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 35, width * 0.65, heightPx * 0.68);

      ctx.strokeStyle = '#C46A42'; // 2026 current boundary
      ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 20, width * 0.82, heightPx * 0.85);
    }

    // Grid crosshairs / sensor coordinate grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
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
  }, [mode, zoom, center, opacity, height]);

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
              backgroundColor: 'rgba(23, 25, 24, 0.9)', 
              color: '#FFFFFF', 
              padding: '3px 8px', 
              fontSize: '11px', 
              fontWeight: 600,
              borderRadius: '3px',
              border: '1px solid #383C38',
              fontFamily: 'var(--font-mono)'
            }}>
              {title}
            </span>
          )}
          {badgeText && (
            <span style={{ 
              backgroundColor: 'var(--olive)', 
              color: '#FFFFFF', 
              padding: '3px 6px', 
              fontSize: '10px', 
              borderRadius: '3px',
              fontFamily: 'var(--font-mono)'
            }}>
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

      {/* GIS Map Navigation Tools */}
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
          <div style={{ width: '40px', height: '2px', backgroundColor: '#E2E4DE' }}></div>
          <span>{(100 / zoom).toFixed(0)} m</span>
          <span style={{ color: '#727670' }}>|</span>
          <span>1:{Math.round(2500 / zoom)}</span>
        </div>
      )}

      {/* Live Probe & Coordinate Readout */}
      {showCoordinates && hoverCoords && (
        <div className="gis-coords">
          <span>{hoverCoords.lat}°N, {hoverCoords.lon}°E</span>
          <span style={{ color: '#727670', marginLeft: '6px' }}>|</span>
          <span style={{ marginLeft: '6px', color: '#9EC09B' }}>B4:{hoverCoords.b4} B8:{hoverCoords.b8}</span>
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
            boxShadow: '0 0 8px rgba(0,0,0,0.8)',
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
            left: '-12px',
            transform: 'translateY(-50%)',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'var(--deep-sage)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            border: '2px solid #FFFFFF'
          }}>
            ↔
          </div>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '8px',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(23, 25, 24, 0.85)',
            color: '#FFFFFF',
            fontSize: '9.5px',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            2.5m GEOSR-X
          </div>
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '-100px',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(23, 25, 24, 0.85)',
            color: '#FFFFFF',
            fontSize: '9.5px',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            10m RAW L2A
          </div>
        </div>
      )}

      {customOverlay}
    </div>
  );
};
