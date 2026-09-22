export interface ProjectMetadata {
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
  bounds: {
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;
  };
  metrics: {
    psnr: number;
    ssim: number;
    sam: number;
    observationConsistency: number;
    spectralConsistency: number;
    temporalConsistency: number;
    hallucinationRisk: string;
  };
}

export const PROJECTS_DATA: ProjectMetadata[] = [
  {
    id: 'urban-mumbai',
    name: 'Urban Mumbai — Andheri East',
    location: 'Mumbai, Maharashtra, India',
    type: 'Urban Intelligence & Super-Resolution',
    status: 'Active',
    sensor: 'Sentinel-2 L2A',
    resolution: '10 m',
    targetResolution: '2.5 m estimated representation',
    bands: ['B2 (Blue 490nm)', 'B3 (Green 560nm)', 'B4 (Red 665nm)', 'B8 (NIR 842nm)', 'B11 (SWIR1 1610nm)', 'B12 (SWIR2 2190nm)'],
    acquisitionDate: '10 Sep 2026',
    cloudCoverage: '4.2%',
    crs: 'EPSG:32643',
    bounds: {
      latMin: 19.0800,
      latMax: 19.1500,
      lonMin: 72.8200,
      lonMax: 72.8900
    },
    metrics: {
      psnr: 32.8,
      ssim: 0.921,
      sam: 0.034,
      observationConsistency: 94,
      spectralConsistency: 91,
      temporalConsistency: 88,
      hallucinationRisk: 'LOW'
    }
  },
  {
    id: 'flood-assessment',
    name: 'Flood Assessment — Brahmaputra Valley',
    location: 'Assam, India',
    type: 'Disaster Intelligence',
    status: 'Completed',
    sensor: 'Sentinel-2 L2A',
    resolution: '10 m',
    targetResolution: '2.5 m estimated representation',
    bands: ['B2', 'B3', 'B4', 'B8', 'B11', 'B12'],
    acquisitionDate: '18 Aug 2026',
    cloudCoverage: '8.1%',
    crs: 'EPSG:32646',
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
      observationConsistency: 92,
      spectralConsistency: 89,
      temporalConsistency: 94,
      hallucinationRisk: 'LOW'
    }
  },
  {
    id: 'agriculture-nashik',
    name: 'Agriculture Nashik — Godavari Valley',
    location: 'Nashik, Maharashtra, India',
    type: 'Agriculture & Crop Stress',
    status: 'Processing',
    sensor: 'Sentinel-2 L2A',
    resolution: '10 m',
    targetResolution: '2.5 m estimated representation',
    bands: ['B2', 'B3', 'B4', 'B8', 'B8A', 'B11'],
    acquisitionDate: '05 Sep 2026',
    cloudCoverage: '2.6%',
    crs: 'EPSG:32643',
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
      observationConsistency: 96,
      spectralConsistency: 94,
      temporalConsistency: 90,
      hallucinationRisk: 'MINIMAL'
    }
  }
];

export const CURRENT_PROJECT = PROJECTS_DATA[0];

export const SYSTEM_MODULES = [
  { id: 'spectral-encoder', name: 'Spectral Encoder', status: 'READY', latency: '340ms', memory: '1.2 GB', desc: 'Continuous spectral representation and multi-band radiance embedding' },
  { id: 'spatial-transformer', name: 'Spatial Transformer', status: 'READY', latency: '480ms', memory: '2.1 GB', desc: 'Multi-scale spatial attention and high-frequency edge propagation' },
  { id: 'physics-constraint', name: 'Physics Constraint Engine', status: 'READY', latency: '210ms', memory: '0.8 GB', desc: 'MTF degradation inversion and atmospheric radiative transfer bounds' },
  { id: 'uncertainty-engine', name: 'Uncertainty & Hallucination Guard', status: 'READY', latency: '390ms', memory: '1.4 GB', desc: 'Epistemic-aleatoric bayesian variance and spectral consistency testing' },
  { id: 'geoai-engine', name: 'GeoAI Multi-Task Head', status: 'READY', latency: '520ms', memory: '1.9 GB', desc: 'Zero-shot building footprint polygonization and road graph topology extraction' }
];

export const QUALITY_CHECKS = [
  { label: 'Cloud Coverage', value: '4.2%', threshold: '< 10%', status: 'PASS', score: '98/100' },
  { label: 'Aerosol / Haze Index', value: '0.12 (LOW)', threshold: '< 0.35', status: 'PASS', score: '95/100' },
  { label: 'Missing / Dropped Bands', value: '0 of 6', threshold: '0', status: 'PASS', score: '100/100' },
  { label: 'Georeferencing Accuracy', value: 'RMSE 0.28 px', threshold: '< 0.50 px', status: 'PASS', score: '96/100' },
  { label: 'Radiometric Calibration (L2A BOA)', value: 'VALID', threshold: 'BOA Reflectance', status: 'PASS', score: '94/100' },
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
    { class: 'High-Density Built-up', area: '1.48 km²', percent: 38.5, color: '#918274' },
    { class: 'Medium-Density Built-up', area: '0.95 km²', percent: 24.7, color: '#B3A696' },
    { class: 'Paved Infrastructure & Roads', area: '0.42 km²', percent: 10.9, color: '#565A54' },
    { class: 'Urban Canopy & Vegetation', area: '0.64 km²', percent: 16.7, color: '#4E6A4B' },
    { class: 'Inland Water & Drainage', area: '0.35 km²', percent: 9.2, color: '#3E5E72' }
  ]
};

export const CHANGE_DETECTION_STATS = {
  dates: { before: '10 JUN 2026', after: '18 SEP 2026' },
  summary: [
    { type: 'Building Changes (New / Modified)', count: 12, area: '46,200 m²', color: '#C46A42' },
    { type: 'Road Extensions / Widening', count: 3, length: '1.8 km', color: '#B77A32' },
    { type: 'Vegetation Alterations', count: 8, area: '28,400 m²', color: '#58644A' },
    { type: 'Water / Runoff Expansion', count: 4, area: '19,100 m²', color: '#3E5E72' }
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
    { level: 'Critical Damage Zone', count: 17, color: '#A94A3D', desc: 'Severe waterlogging > 1.2m, structural ground subsidence' },
    { level: 'Moderate Damage Zone', count: 32, color: '#B77A32', desc: 'Partial inundation 0.4m - 1.2m, access cut-off' },
    { level: 'Low Impact / Warning Zone', count: 51, color: '#58644A', desc: 'Peripheral surface runoff, transit delays' }
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
