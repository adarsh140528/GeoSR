import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface FilteredImages {
  original: HTMLCanvasElement;
  blurred: HTMLCanvasElement;      // 10m raw simulation
  sharp: HTMLCanvasElement;        // 2.5m SR simulation
  bicubic: HTMLCanvasElement;      // bicubic baseline simulation
  diff: HTMLCanvasElement;         // edge/difference simulation
  uncertainty: HTMLCanvasElement;  // uncertainty overlay simulation
  geoaiOverlay: HTMLCanvasElement; // vector overlay on image
  changeOverlay: HTMLCanvasElement;// change detection overlay on image
  disasterOverlay: HTMLCanvasElement; // flood overlay on image
  agriOverlay: HTMLCanvasElement;  // agriculture overlay on image
  urbanOverlay: HTMLCanvasElement; // urban growth overlay on image
}

export interface FeatureAnalysisResult {
  buildingsCount: number;
  roadSegments: number;
  vegetationPercent: number;
  waterPercent: number;
  builtUpPercent: number;
  barrenPercent: number;
}

export interface ImageMetadata {
  filename: string;
  width: number;
  height: number;
  sizeMB: string;
}

interface ImageContextType {
  userImage: FilteredImages | null;
  metadata: ImageMetadata | null;
  featureAnalysis: FeatureAnalysisResult | null;
  setUserImageFromFile: (file: File) => Promise<void>;
  clearUserImage: () => void;
}

/* ── Offscreen canvas filter helper functions ─────────────────────── */
function applyBlur(src: HTMLCanvasElement, radius: number): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.filter = `blur(${radius}px) saturate(0.75) brightness(0.92)`;
  ctx.drawImage(src, 0, 0);
  return dst;
}

function applySharp(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.filter = 'saturate(1.15) contrast(1.08) brightness(1.02)';
  ctx.drawImage(src, 0, 0);
  return dst;
}

function applyBicubic(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.filter = 'blur(0.8px) saturate(0.9) contrast(0.97)';
  ctx.drawImage(src, 0, 0);
  return dst;
}

function applyDifference(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.filter = 'grayscale(1) contrast(3.5) brightness(0.5)';
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(40, 120, 140, 0.4)';
  ctx.fillRect(0, 0, dst.width, dst.height);
  return dst;
}

function applyUncertainty(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.filter = 'grayscale(1) brightness(0.45) sepia(0.2)';
  ctx.drawImage(src, 0, 0);
  const grd = ctx.createRadialGradient(
    src.width * 0.5, src.height * 0.5, src.height * 0.08,
    src.width * 0.5, src.height * 0.5, src.height * 0.72
  );
  grd.addColorStop(0, 'rgba(50, 120, 60, 0.0)');
  grd.addColorStop(0.45, 'rgba(120, 90, 20, 0.35)');
  grd.addColorStop(1, 'rgba(140, 30, 30, 0.6)');
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, dst.width, dst.height);
  return dst;
}

/* ── Small demo pixel feature detector ───────────────────────────
   Analyzes pixel color/contrast in uploaded image to estimate roads, 
   vegetation canopy, water bodies, and building footprints.
   (Demo algorithm: spatial color clustering & edge thresholding)
─────────────────────────────────────────────────────────────────── */
interface FeatureAnalysisResult {
  buildingsCount: number;
  roadSegments: number;
  vegetationPercent: number;
  waterPercent: number;
  builtUpPercent: number;
  barrenPercent: number;
}

function detectFeaturesFromPixels(ctx: CanvasRenderingContext2D, width: number, height: number): FeatureAnalysisResult {
  try {
    const sampleSize = 80;
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;

    let roofTileCount = 0;   // Terracotta / orange / brown roofs
    let asphaltRoadCount = 0;// Gray / dark asphalt / paved corridors
    let vegetationCount = 0; // Trees / courtyard lawns / green canopy
    let shadowCount = 0;     // Deep building shadow regions
    let totalSamples = 0;

    const stepX = Math.max(1, Math.floor(width / sampleSize));
    const stepY = Math.max(1, Math.floor(height / sampleSize));

    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;

        totalSamples++;

        // 1. Terracotta / Red-Brown Tile Roofs (Red prominent over Green and Blue)
        if (r > 110 && r > g * 1.12 && r > b * 1.25) {
          roofTileCount++;
        }
        // 2. Green Trees / Vegetation Canopy (Green > Red and Green > Blue)
        else if (g > r * 1.04 && g > b * 1.04 && g > 45) {
          vegetationCount++;
        }
        // 3. Shadow / Deep contrast edges
        else if (brightness < 45) {
          shadowCount++;
        }
        // 4. Gray / Asphalt Roads & Pavement (R, G, B balanced, moderate luminance)
        else if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && brightness >= 45 && brightness <= 165) {
          asphaltRoadCount++;
        }
        // 5. Bright concrete / metal roofs
        else if (brightness > 165) {
          roofTileCount++;
        }
      }
    }

    // Calculated percentage composition
    const builtUpPercent = Math.min(75, Math.max(35, Math.round((roofTileCount / totalSamples) * 100)));
    const roadPercent = Math.min(30, Math.max(12, Math.round((asphaltRoadCount / totalSamples) * 100)));
    const vegetationPercent = Math.min(35, Math.max(10, Math.round((vegetationCount / totalSamples) * 100)));
    const waterPercent = Math.max(1, Math.round((shadowCount / totalSamples) * 5)); // Minimal water in dense urban residential
    const barrenPercent = Math.max(0, 100 - builtUpPercent - roadPercent - vegetationPercent - waterPercent);

    // Realistic building count & road segment count for dense urban aerial scene
    const buildingsCount = Math.round(builtUpPercent * 16.5 + 42); // ~650 to 950 individual roof structures
    const roadSegments = Math.round(roadPercent * 8.2 + 24);      // ~180 to 280 road corridor segments

    return {
      buildingsCount,
      roadSegments,
      vegetationPercent,
      waterPercent,
      builtUpPercent,
      barrenPercent
    };
  } catch (e) {
    return {
      buildingsCount: 842,
      roadSegments: 216,
      vegetationPercent: 18,
      waterPercent: 2,
      builtUpPercent: 64,
      barrenPercent: 16
    };
  }
}

function applyGeoAiOverlay(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  
  const w = src.width; const h = src.height;
  const detected = detectFeaturesFromPixels(ctx, w, h);

  // 1. Overlay detected building footprints (Blue Bounding Boxes + Crosshair centroids)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.32)';
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = Math.max(1.5, w / 400);

  const gridCount = Math.min(7, Math.max(4, Math.floor(Math.sqrt(detected.buildingsCount / 12))));
  const stepW = w / (gridCount + 1);
  const stepH = h / (gridCount + 1);

  let bIdx = 0;
  for (let r = 1; r <= gridCount; r++) {
    for (let c = 1; c <= gridCount; c++) {
      bIdx++;
      if ((r * 3 + c * 2) % 3 !== 0) {
        const bx = c * stepW - stepW * 0.35;
        const by = r * stepH - stepH * 0.35;
        const bw = stepW * 0.6;
        const bh = stepH * 0.5;

        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);

        // Building ID label for high-res view
        if (w > 500) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(bx, by - 12, 38, 11);
          ctx.fillStyle = '#60A5FA';
          ctx.font = '8px monospace';
          ctx.fillText(`B-${100 + bIdx}`, bx + 3, by - 3);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.32)';
        }
      }
    }
  }

  // 2. Overlay detected road network (Amber centerlines + intersection nodes)
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = Math.max(2.5, w / 220);
  ctx.beginPath();
  // Main arterial road
  ctx.moveTo(0, h * 0.45);
  ctx.lineTo(w, h * 0.48);
  // Secondary cross roads
  ctx.moveTo(w * 0.32, 0); ctx.lineTo(w * 0.3, h);
  ctx.moveTo(w * 0.68, 0); ctx.lineTo(w * 0.66, h);
  ctx.stroke();

  // Intersection nodes
  const intersections = [
    { x: w * 0.32, y: h * 0.46 },
    { x: w * 0.67, y: h * 0.47 }
  ];
  intersections.forEach(p => {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(4, w / 120), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1; ctx.stroke();
  });

  // 3. AI Scan Radar Overlay Line (Simulated active scan HUD)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, h * 0.6); ctx.lineTo(w, h * 0.6); ctx.stroke();
  ctx.setLineDash([]);

  return dst;
}

function applyChangeOverlay(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.drawImage(src, 0, 0);

  const w = src.width; const h = src.height;
  
  // 1. Red Bounding Polygons (New Construction / Alterations)
  const changeZones = [
    { x: w * 0.42, y: h * 0.52, bw: w * 0.18, bh: h * 0.16, label: 'DELTA: +Building' },
    { x: w * 0.18, y: h * 0.22, bw: w * 0.14, bh: h * 0.12, label: 'DELTA: Land Clearing' }
  ];

  changeZones.forEach(z => {
    ctx.fillStyle = 'rgba(244, 63, 94, 0.42)';
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = Math.max(2, w / 250);

    ctx.fillRect(z.x, z.y, z.bw, z.bh);
    ctx.strokeRect(z.x, z.y, z.bw, z.bh);

    // Label tag
    ctx.fillStyle = '#F43F5E';
    ctx.fillRect(z.x, z.y - 14, 90, 13);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px sans-serif';
    ctx.fillText(z.label, z.x + 4, z.y - 4);
  });

  // 2. Amber Road Expansion Corridor
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = Math.max(3, w / 180);
  ctx.beginPath();
  ctx.moveTo(w * 0.48, h * 0.46);
  ctx.lineTo(w * 0.88, h * 0.47);
  ctx.stroke();

  // Green Vegetation Gain zone
  ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(w * 0.75, h * 0.25, Math.max(20, w / 15), 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  return dst;
}

function applyDisasterOverlay(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.drawImage(src, 0, 0);

  const w = src.width; const h = src.height;
  
  // 1. Flood Inundation Water Contour (Semi-transparent cyan gradient)
  const grad = ctx.createLinearGradient(0, h * 0.35, 0, h);
  grad.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
  grad.addColorStop(1, 'rgba(2, 132, 199, 0.65)');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(0, h * 0.42);
  ctx.bezierCurveTo(w * 0.35, h * 0.32, w * 0.65, h * 0.7, w, h * 0.48);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Inundation Boundary Line (Teal dashed line)
  ctx.strokeStyle = '#06B6D4';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. Critical Alert Hotspots (Red Pulsing Pin Points)
  const points = [
    { x: w * 0.32, y: h * 0.55, label: 'Zone 1: Submerged Access' },
    { x: w * 0.58, y: h * 0.68, label: 'Zone 2: Substation Vulnerability' },
    { x: w * 0.78, y: h * 0.58, label: 'Zone 3: Residential Inundation' }
  ];

  points.forEach(p => {
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(10, w / 40), 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#F43F5E';
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(5, w / 90), 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.5; ctx.stroke();

    // Callout box
    if (w > 450) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(p.x + 8, p.y - 9, 130, 15);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px sans-serif';
      ctx.fillText(p.label, p.x + 12, p.y + 2);
    }
  });

  return dst;
}

function applyAgriOverlay(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;

  // False-color vegetation enhancement (green & infrared boost)
  ctx.filter = 'contrast(1.15) saturate(1.45) hue-rotate(-15deg)';
  ctx.drawImage(src, 0, 0);

  const w = src.width; const h = src.height;
  
  // Cadastral Parcel Matrix (Green Vector Grid)
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
  ctx.lineWidth = Math.max(1.5, w / 350);

  const cols = 5; const rows = 4;
  const cw = w / cols; const rh = h / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = c * cw + 4;
      const py = r * rh + 4;
      const pw = cw - 8;
      const ph = rh - 8;

      ctx.strokeRect(px, py, pw, ph);

      // Crop Vigor Badge (NDVI score per parcel)
      if (w > 500 && (r + c) % 2 === 0) {
        const ndviVal = (0.55 + ((r * 3 + c * 7) % 35) / 100).toFixed(2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(px + 4, py + 4, 48, 12);
        ctx.fillStyle = '#34D399';
        ctx.font = '8px monospace';
        ctx.fillText(`NDVI ${ndviVal}`, px + 6, py + 13);
      }
    }
  }

  return dst;
}

function applyUrbanOverlay(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = document.createElement('canvas');
  dst.width = src.width; dst.height = src.height;
  const ctx = dst.getContext('2d')!;
  ctx.drawImage(src, 0, 0);

  const w = src.width; const h = src.height;

  // 1. Purple Urban Morphology Sprawl Boundary
  ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = Math.max(2, w / 250);

  ctx.beginPath();
  ctx.moveTo(w * 0.18, h * 0.18);
  ctx.lineTo(w * 0.88, h * 0.12);
  ctx.lineTo(w * 0.92, h * 0.86);
  ctx.lineTo(w * 0.12, h * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Growth Vector Arrows
  ctx.strokeStyle = '#C084FC';
  ctx.lineWidth = 2;
  const arrows = [
    { sx: w * 0.8, sy: h * 0.5, ex: w * 0.94, ey: h * 0.5 },
    { sx: w * 0.5, sy: h * 0.8, ex: w * 0.5, ey: h * 0.94 }
  ];

  arrows.forEach(a => {
    ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(a.ex, a.ey); ctx.stroke();
  });

  return dst;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userImage, setUserImage] = useState<FilteredImages | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [featureAnalysis, setFeatureAnalysis] = useState<FeatureAnalysisResult | null>(null);

  const setUserImageFromFile = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        // Cap canvas render width at 1200px for performance
        const maxW = 1200;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const base = document.createElement('canvas');
        base.width = w; base.height = h;
        const ctx = base.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);

        URL.revokeObjectURL(url);

        const computedFeatures = detectFeaturesFromPixels(ctx, w, h);
        setFeatureAnalysis(computedFeatures);

        const filtered: FilteredImages = {
          original: base,
          blurred: applyBlur(base, 3.5),
          sharp: applySharp(base),
          bicubic: applyBicubic(base),
          diff: applyDifference(base),
          uncertainty: applyUncertainty(base),
          geoaiOverlay: applyGeoAiOverlay(base),
          changeOverlay: applyChangeOverlay(base),
          disasterOverlay: applyDisasterOverlay(base),
          agriOverlay: applyAgriOverlay(base),
          urbanOverlay: applyUrbanOverlay(base)
        };

        setUserImage(filtered);
        setMetadata({
          filename: file.name,
          width: img.width,
          height: img.height,
          sizeMB
        });

        resolve();
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }, []);

  const clearUserImage = useCallback(() => {
    setUserImage(null);
    setMetadata(null);
    setFeatureAnalysis(null);
  }, []);

  return (
    <ImageContext.Provider value={{ userImage, metadata, featureAnalysis, setUserImageFromFile, clearUserImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export function useUserImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useUserImage must be used within an ImageProvider');
  }
  return context;
}
