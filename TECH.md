# GeoSR-X Technical Specification

## Technical Objective

The implementation should combine a pretrained Sentinel-2
super-resolution model with a geospatial processing pipeline, validation
layer, downstream GeoAI modules and an interactive web application.

## Recommended Model Strategy

Use a pretrained model first.

### Primary

``` text
SEN2SR mamba-main
Input: 10 Sentinel-2 bands
Input base resolution: 10 m
Output: 10 bands at 2.5 m
Scale: 4×
```

SEN2SR is explicitly designed for Sentinel-2 and provides pretrained
models up to 2.5 m. Its full pipeline handles the 10-band Sentinel-2
configuration. The project documentation also describes tiled inference
for larger images.

### Fallback

``` text
SEN2SRLite full
```

This should be used if the Mamba runtime is difficult to install or the
available GPU is insufficient.

## Band Configuration

Recommended ten-band ordering:

``` text
B04
B03
B02
B08
B05
B06
B07
B8A
B11
B12
```

Keep this ordering consistent across:

-   data loader
-   preprocessing
-   model input
-   output metadata
-   visualization

The RGBN variant uses:

``` text
B04, B03, B02, B08
```

## Data Normalization

Sentinel-2 surface reflectance commonly needs conversion to the
numerical range expected by the selected model.

The exact normalization must follow the model's official preprocessing
instructions.

Do not hard-code normalization assumptions into the general pipeline
without documenting them.

## Inference Pipeline

``` text
GeoTIFF / Sentinel Product
        ↓
Read raster + metadata
        ↓
Band validation
        ↓
Cloud / invalid-pixel check
        ↓
Normalize
        ↓
Tile into model-sized patches
        ↓
SEN2SR inference
        ↓
Overlap blending
        ↓
Denormalization
        ↓
Restore geospatial metadata
        ↓
Write GeoTIFF
```

## Large Image Processing

Do not load an entire large satellite scene into GPU memory.

Use:

``` text
Scene
 ↓
Tiles
 ↓
Batch inference
 ↓
Overlap
 ↓
Weighted blending
 ↓
Final raster
```

The official SEN2SR tooling supports tiled inference for images larger
than its training patch size.

## Backend Architecture

``` text
FastAPI
│
├── scenes/
│   ├── upload
│   ├── metadata
│   └── validation
│
├── inference/
│   ├── jobs
│   ├── model loading
│   └── tiled prediction
│
├── validation/
│   ├── spectral
│   ├── observation
│   └── uncertainty
│
├── geospatial/
│   ├── raster
│   ├── vector
│   └── export
│
└── analytics/
    ├── buildings
    ├── roads
    ├── landcover
    └── change
```

## Async Job Architecture

Super-resolution should not block the HTTP request.

``` text
Client
  ↓
POST /inference
  ↓
Create Job
  ↓
Queue
  ↓
GPU Worker
  ↓
Inference
  ↓
Store Output
  ↓
Update Job
  ↓
Client Polls / Receives Status
```

A first prototype can use FastAPI background tasks. A production-style
implementation can move to Celery/RQ with Redis.

## Database

Use PostgreSQL + PostGIS for production-oriented metadata.

Example:

``` sql
CREATE TABLE scenes (
    id UUID PRIMARY KEY,
    name TEXT,
    source TEXT,
    acquisition_date DATE,
    crs TEXT,
    resolution_m FLOAT,
    created_at TIMESTAMP
);
```

``` sql
CREATE TABLE inference_jobs (
    id UUID PRIMARY KEY,
    scene_id UUID,
    model_name TEXT,
    status TEXT,
    input_resolution FLOAT,
    output_resolution FLOAT,
    output_path TEXT,
    created_at TIMESTAMP
);
```

## Storage

Recommended:

``` text
Object Storage
├── raw/
├── processed/
├── sr/
├── uncertainty/
├── vectors/
└── reports/
```

Do not store large GeoTIFF binaries directly in PostgreSQL.

## Validation Layer

### Observation Consistency

Concept:

``` text
SR Output
   ↓
Simulated degradation
   ↓
Compare against input
```

Example metric:

``` text
observation_error =
mean_absolute_error(input, degraded_sr)
```

### Spectral Consistency

Compare spectral indices:

``` text
NDVI_input
NDVI_sr
```

Example:

``` text
ndvi_difference =
abs(mean(NDVI_input) - mean(NDVI_sr))
```

This is only a demo metric unless computed from actual imagery.

## Uncertainty

Prototype approach:

``` text
Multiple predictions
        ↓
Pixel-wise disagreement
        ↓
Normalized uncertainty map
```

More advanced options:

-   MC dropout
-   Deep ensembles
-   Conformal calibration
-   Heteroscedastic prediction

## Downstream AI

Use separate models for:

``` text
Building Segmentation
Road Segmentation
Land-Cover Classification
Change Detection
```

Do not train all downstream models jointly in the first implementation.

## Demo Hard-Coded Layer

The frontend can initially use:

``` json
{
  "processing": {
    "status": "completed",
    "progress": 100,
    "time_seconds": 8.7
  },
  "quality": {
    "cloud_cover_percent": 4.8,
    "quality_score": 94
  },
  "reconstruction": {
    "input_resolution_m": 10,
    "output_resolution_m": 2.5,
    "scale": 4
  },
  "reliability": {
    "confidence_percent": 91,
    "high_uncertainty_percent": 7
  },
  "downstream": {
    "building_iou": 0.78,
    "change_f1": 0.81
  },
  "demo_only": true
}
```

These values are strictly for UI demonstration.

## Production Rule

Never allow:

``` text
demo_only = true
```

data to be mixed with real experiment results.

Use separate namespaces:

``` text
/demo/*
/experiments/*
/production/*
```

## API Error Handling

Return structured errors:

``` json
{
  "error": {
    "code": "MISSING_BAND",
    "message": "Required Sentinel-2 band B08 is missing.",
    "request_id": "req-demo-001"
  }
}
```

Possible codes:

``` text
INVALID_RASTER
MISSING_BAND
INVALID_CRS
UNSUPPORTED_RESOLUTION
GPU_UNAVAILABLE
MODEL_LOAD_FAILED
INFERENCE_FAILED
OUTPUT_WRITE_FAILED
```

## Model Loading

Load the model once per worker.

Do not:

``` text
request → load model → inference → unload
```

Prefer:

``` text
worker startup
    ↓
load model
    ↓
keep model in memory
    ↓
process jobs
```

## Performance

Optimize using:

-   FP16 where validated
-   GPU inference
-   tiled processing
-   batch inference
-   pinned memory
-   asynchronous job handling

Do not sacrifice geospatial correctness for speed.

## Security

-   Validate uploaded files.
-   Restrict file sizes.
-   Avoid arbitrary path traversal.
-   Store uploads outside the application source directory.
-   Sanitize metadata.
-   Authenticate production users.
-   Log inference jobs.
-   Separate demo and real data.

## Deployment

Development:

``` text
Next.js
+
FastAPI
+
Local GPU
```

Prototype cloud:

``` text
Frontend
   ↓
Backend API
   ↓
GPU Worker
   ↓
Object Storage
   ↓
PostGIS
```

## Technology Stack

``` text
Frontend: Next.js + TypeScript + Tailwind
Backend: FastAPI + Python
AI: PyTorch
SR: SEN2SR
Raster: Rasterio + GDAL
Vector: GeoPandas + Shapely
Database: PostgreSQL + PostGIS
Queue: Redis + Celery/RQ
Container: Docker
Maps: MapLibre / Leaflet
```
