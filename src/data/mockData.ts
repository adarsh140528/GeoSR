export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'Active' | 'Completed' | 'Processing';
  sensor: string;
  resolution: string;
  targetResolution: string;
  bands: string[];
  acquisitionDate: string;
  cloudCoverage: string;
  crs: string;
  thumbnailType: 'urban' | 'flood' | 'agri';
  bounds: {
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;
  };
  metrics?: {
    psnr: number;
    ssim: number;
    sam: number;
    spectralConsistency?: number;
    temporalConsistency?: number;
    hallucinationRisk?: string;
  };
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'urban-mumbai',
    name: 'Urban Mumbai — Andheri East',
    location: 'Mumbai, Maharashtra, India',
    type: 'Urban Morphology',
    status: 'Active',
    sensor: 'Sentinel-2 L2A',
    resolution: '10 m',
    targetResolution: '2.5 m (4×)',
    bands: ['B2', 'B3', 'B4', 'B8', 'B11', 'B12'],
    acquisitionDate: '10 Sep 2026',
    cloudCoverage: '4.2%',
    crs: 'EPSG:32643',
    thumbnailType: 'urban',
    bounds: {
      latMin: 19.1000,
      latMax: 19.1450,
      lonMin: 72.8400,
      lonMax: 72.8950
    },
    metrics: {
      psnr: 32.8,
      ssim: 0.921,
      sam: 0.034,
      spectralConsistency: 91,
      temporalConsistency: 88,
      hallucinationRisk: 'LOW'
    }
  },
  {
    id: 'flood-assessment',
    name: 'Flood Assessment — Brahmaputra Valley',
    location: 'Assam, India',
    type: 'Disaster Inundation',
    status: 'Completed',
    sensor: 'Sentinel-2 L2A',
    resolution: '10 m',
    targetResolution: '2.5 m (4×)',
    bands: ['B2', 'B3', 'B4', 'B8', 'B11', 'B12'],
    acquisitionDate: '18 Aug 2026',
    cloudCoverage: '8.1%',
    crs: 'EPSG:32646',
    thumbnailType: 'flood',
    bounds: {
      latMin: 26.1500,
      latMax: 26.2400,
      lonMin: 91.7000,
      lonMax: 91.8200
    },
    metrics: {
      psnr: 31.4,
      ssim: 0.908,
      sam: 0.041,
      spectralConsistency: 89,
      temporalConsistency: 94,
      hallucinationRisk: 'LOW'
    }
  },
  {
    id: 'agriculture-nashik',
    name: 'Agriculture Nashik — Godavari Valley',
    location: 'Nashik, Maharashtra, India',
    type: 'Crop Health & Stress',
    status: 'Processing',
    sensor: 'Sentinel-2 L2A',
    resolution: '10 m',
    targetResolution: '2.5 m (4×)',
    bands: ['B2', 'B3', 'B4', 'B8', 'B8A', 'B11'],
    acquisitionDate: '05 Sep 2026',
    cloudCoverage: '2.6%',
    crs: 'EPSG:32643',
    thumbnailType: 'agri',
    bounds: {
      latMin: 19.9500,
      latMax: 20.0400,
      lonMin: 73.7400,
      lonMax: 73.8600
    },
    metrics: {
      psnr: 33.5,
      ssim: 0.934,
      sam: 0.029,
      spectralConsistency: 94,
      temporalConsistency: 90,
      hallucinationRisk: 'MINIMAL'
    }
  }
];

export const CURRENT_PROJECT = PROJECTS_DATA[0];

export const PROCESSING_STEPS = [
  { id: 1, name: 'Input Received', desc: '10m Multi-spectral GeoTIFF ingested', status: 'completed' },
  { id: 2, name: 'Validation', desc: 'Radiometric & atmospheric bounds verified', status: 'completed' },
  { id: 3, name: 'Metadata Extraction', desc: 'EPSG:32643, GSD, Solar angles calibrated', status: 'completed' },
  { id: 4, name: 'Band Analysis', desc: '6 bands: B02, B03, B04, B08, B11, B12', status: 'completed' },
  { id: 5, name: 'Preprocessing', desc: 'MTF degradation modeling & spatial alignment', status: 'completed' },
  { id: 6, name: 'Super Resolution', desc: 'SEN2SR continuous transformer reconstruction', status: 'active' },
  { id: 7, name: 'Georeferencing', desc: 'Sub-pixel projection & coordinate alignment', status: 'pending' },
  { id: 8, name: 'Quality Check', desc: 'PSNR, SSIM & SAM spectral fidelity checks', status: 'pending' },
  { id: 9, name: 'Final Output', desc: '2.5m Super-Resolved reflectance GeoTIFF', status: 'pending' }
];

export const SYSTEM_SERVICES = [
  { name: 'Data Ingestion & Calibration Pipeline', status: 'Available', desc: 'Sentinel-2 L2A BOA / Landsat 8/9 ingestion' },
  { name: 'GeoSR-X Neural Reconstruction Engine', status: 'Healthy', desc: 'Continuous spectral-spatial 4× super-resolution' },
  { name: 'GeoAI Multi-Task Feature Services', status: 'Ready', desc: 'Building footprint polygonization & road graphs' },
  { name: 'Multi-Format Export & COG Services', status: 'Available', desc: 'Cloud-Optimized GeoTIFF, GeoJSON & Reports' }
];

export const QUALITY_CHECKS = [
  { label: 'Cloud Coverage', value: '4.2%', threshold: '< 10%', status: 'PASS', score: '98/100' },
  { label: 'Aerosol / Haze Index', value: '0.12 (Low)', threshold: '< 0.35', status: 'PASS', score: '95/100' },
  { label: 'Missing / Dropped Bands', value: '0 of 6', threshold: '0', status: 'PASS', score: '100/100' },
  { label: 'Georeferencing Accuracy', value: 'RMSE 0.28 px', threshold: '< 0.50 px', status: 'PASS', score: '96/100' },
  { label: 'Radiometric Calibration (L2A BOA)', value: 'Valid', threshold: 'BOA Reflectance', status: 'PASS', score: '94/100' },
  { label: 'Sensor Signal-to-Noise Ratio (SNR)', value: '184:1 (B8)', threshold: '> 100:1', status: 'PASS', score: '91/100' }
];

export const GEOAI_STATS = {
  buildings: {
    count: 1284,
    avgConfidence: '91%',
    builtArea: '2.43 km²',
    commercial: 382,
    residential: 710,
    industrial: 192
  },
  roads: {
    segments: 438,
    totalLength: '73.2 km',
    connectivity: '87%',
    arterial: '24.6 km',
    secondary: '38.1 km',
    local: '10.5 km'
  },
  landCover: [
    { class: 'High-Density Built-up', area: '1.48 km²', percent: 38.5, color: '#3B82F6' },
    { class: 'Medium-Density Built-up', area: '0.95 km²', percent: 24.7, color: '#60A5FA' },
    { class: 'Paved Infrastructure & Roads', area: '0.42 km²', percent: 10.9, color: '#64748B' },
    { class: 'Urban Canopy & Vegetation', area: '0.64 km²', percent: 16.7, color: '#10B981' },
    { class: 'Inland Water & Drainage', area: '0.35 km²', percent: 9.2, color: '#06B6D4' }
  ]
};

export const CHANGE_DETECTION_STATS = {
  dates: { before: '10 Jun 2026', after: '18 Sep 2026' },
  summary: [
    { type: 'Building Changes', count: 12, area: '46,200 m²', color: '#F43F5E' },
    { type: 'Road Extensions', count: 3, length: '1.8 km', color: '#F59E0B' },
    { type: 'Vegetation Alterations', count: 8, area: '28,400 m²', color: '#10B981' },
    { type: 'Water / Runoff Expansion', count: 4, area: '19,100 m²', color: '#06B6D4' }
  ],
  changes: [
    { id: 'CHG-01', location: '19.1124°N, 72.8681°E', type: 'Building Construction', delta: '+3,850 m²', confidence: '94%', category: 'Urban' },
    { id: 'CHG-02', location: '19.1240°N, 72.8432°E', type: 'Road Extension (Metro Line 7 Access)', delta: '+620 m', confidence: '91%', category: 'Transport' },
    { id: 'CHG-03', location: '19.0982°N, 72.8550°E', type: 'Industrial Shed Expansion', delta: '+2,100 m²', confidence: '89%', category: 'Commercial' },
    { id: 'CHG-04', location: '19.1350°N, 72.8790°E', type: 'Canopy Loss / Clearing', delta: '-4,200 m²', confidence: '93%', category: 'Vegetation' },
    { id: 'CHG-05', location: '19.0889°N, 72.8310°E', type: 'Drainage Channel Widening', delta: '+840 m²', confidence: '88%', category: 'Hydrology' }
  ]
};

export const DISASTER_STATS = {
  type: 'FLOOD',
  riskLevels: [
    { level: 'Critical Inundation Zone', count: 17, color: '#F43F5E', desc: 'Water depth > 1.2m, structural ground subsidence' },
    { level: 'Moderate Inundation Zone', count: 32, color: '#F59E0B', desc: 'Partial inundation 0.4m - 1.2m, access cut-off' },
    { level: 'Low Impact / Runoff Zone', count: 51, color: '#10B981', desc: 'Peripheral surface runoff, transit delays' }
  ],
  infrastructure: {
    buildings: 43,
    roads: 12,
    vegetation: 27,
    criticalFacilities: ['Andheri Sub-Station 4', 'Saki Naka Health Post', 'Marol Freight Hub']
  }
};

export const AGRICULTURE_STATS = {
  totalFields: 426,
  healthy: 312,
  moderate: 84,
  stress: 30,
  averageNdvi: 0.68,
  timeSeries: [
    { month: 'JUN', ndvi: 0.32, precipitation: '45 mm', temp: '34°C' },
    { month: 'JUL', ndvi: 0.54, precipitation: '180 mm', temp: '29°C' },
    { month: 'AUG', ndvi: 0.72, precipitation: '210 mm', temp: '28°C' },
    { month: 'SEP', ndvi: 0.68, precipitation: '95 mm', temp: '30°C' }
  ],
  crops: [
    { type: 'Table Grapes', parcels: 164, area: '412 ha', avgYieldEst: '18.4 t/ha', health: 'Optimal' },
    { type: 'Pomegranate', parcels: 98, area: '235 ha', avgYieldEst: '12.1 t/ha', health: 'Moderate' },
    { type: 'Onion (Kharif)', parcels: 112, area: '290 ha', avgYieldEst: '21.0 t/ha', health: 'Optimal' },
    { type: 'Soybean', parcels: 52, area: '140 ha', avgYieldEst: '2.8 t/ha', health: 'Stress (Moisture deficit)' }
  ]
};

export const URBAN_STATS = {
  buildings: 2481,
  roadNetwork: '124 km',
  builtUpArea: '18.7 km²',
  growthRate: '+21.4%',
  timeline: [
    { year: '2019', builtUp: '15.4 km²', buildings: 1940, density: '68%' },
    { year: '2022', builtUp: '16.9 km²', buildings: 2180, density: '74%' },
    { year: '2026', builtUp: '18.7 km²', buildings: 2481, density: '81%' }
  ],
  zones: [
    { name: 'MIDC Industrial Sector', builtArea: '5.2 km²', density: '88%', heightAvg: '18 m' },
    { name: 'Chakala Commercial Corridor', builtArea: '4.1 km²', density: '92%', heightAvg: '42 m' },
    { name: 'Marol Residential Cluster', builtArea: '6.4 km²', density: '78%', heightAvg: '24 m' },
    { name: 'Airport Perimeter Buffer', builtArea: '3.0 km²', density: '45%', heightAvg: '12 m' }
  ]
};
