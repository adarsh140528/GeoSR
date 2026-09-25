# GeoSR-X

> **Uncertainty-aware, physics-guided GeoAI for super-resolution mapping
> of medium-resolution satellite imagery.**

## What Is GeoSR-X?

GeoSR-X converts medium-resolution multispectral satellite observations
into higher-resolution geospatial representations and then uses those
representations for downstream analysis.

The project focuses on **trustworthy super-resolution**, not just visual
sharpening.

``` text
Satellite Image
      ↓
Quality Check
      ↓
Pretrained SEN2SR
      ↓
Super-Resolved GeoTIFF
      ↓
Validation + Uncertainty
      ↓
Buildings / Roads / Land Cover / Change
      ↓
GeoAI Dashboard
```

## Why This Project?

Medium-resolution imagery is excellent for coverage and revisit
frequency, but small objects and localized changes can be difficult to
analyse.

GeoSR-X addresses this by combining:

-   Multispectral super-resolution
-   Pretrained remote-sensing models
-   Spectral validation
-   Observation consistency
-   Uncertainty estimation
-   Downstream GeoAI
-   GIS-ready outputs

## Important Scientific Position

The SR output is a **model reconstruction**, not newly measured
satellite information.

A high-resolution-looking pixel does not automatically mean that the
exact ground truth was captured by the original sensor.

The platform therefore exposes uncertainty and validation information.

## Reference Model

The first implementation uses **SEN2SR**, an open-source Sentinel-2
super-resolution framework.

SEN2SR supports enhancement of Sentinel-2 imagery up to 2.5 m and
provides multiple pretrained variants. The higher-end full model
processes ten Sentinel-2 bands and uses Mamba/Swin-based architectures.

Official repository:

https://github.com/ESAOpenSR/SEN2SR

Model repository:

https://huggingface.co/tacofoundation/SEN2SR

## Recommended Prototype

``` text
Input:
Sentinel-2 L2A
10 bands
10 m base resolution

Model:
SEN2SR mamba-main

Output:
10 bands
2.5 m reconstructed representation
```

For environments where Mamba installation is difficult:

``` text
Fallback:
SEN2SRLite full model
```

## Architecture

``` text
                ┌───────────────────┐
                │ Sentinel-2 Input  │
                └─────────┬─────────┘
                          ↓
                ┌───────────────────┐
                │ Quality Assessment │
                └─────────┬─────────┘
                          ↓
                ┌───────────────────┐
                │     SEN2SR        │
                │  Pretrained SR    │
                └─────────┬─────────┘
                          ↓
                ┌───────────────────┐
                │ Super-Resolved    │
                │ GeoTIFF           │
                └─────────┬─────────┘
                          ↓
             ┌────────────┼────────────┐
             ↓            ↓            ↓
        Reliability   Spectral     GeoAI Tasks
             ↓        Validation        ↓
             └────────────┼────────────┘
                          ↓
                    GIS Dashboard
```

## Repository Structure

``` text
GeoSR-X/
├── frontend/
├── backend/
├── ai/
│   ├── sen2sr/
│   ├── preprocessing/
│   ├── validation/
│   └── uncertainty/
├── geospatial/
├── demo/
├── data/
├── reports/
├── docs/
├── docker/
└── README.md
```

## Demo Mode

The repository may include a completely local demo mode.

Demo mode can use:

-   pre-generated sample imagery
-   hard-coded analytics
-   simulated processing progress
-   sample uncertainty values
-   sample building/change results

This allows the team to demonstrate the product before full model
inference is integrated.

Every simulated result must contain:

``` text
DEMO DATA
NOT A MEASURED MODEL RESULT
```

## Example Demo Object

``` json
{
  "scene": {
    "id": "DEMO-MUMBAI-001",
    "location": "Mumbai",
    "date": "2026-08-18"
  },
  "sr": {
    "input_resolution": "10m",
    "output_resolution": "2.5m",
    "scale": "4x"
  },
  "quality": {
    "cloud_cover": 4.8,
    "valid": true
  },
  "analytics": {
    "confidence": 91,
    "building_iou": 0.78,
    "change_f1": 0.81
  },
  "demo_only": true
}
```

## Local Development

### Backend

``` bash
cd backend
python -m venv .venv
```

Activate the environment and install dependencies:

``` bash
pip install -r requirements.txt
```

Run:

``` bash
uvicorn app.main:app --reload
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

## API Concept

``` text
POST /api/v1/scenes
POST /api/v1/sr/inference
GET  /api/v1/jobs/{job_id}
GET  /api/v1/scenes/{scene_id}
POST /api/v1/change-detection
POST /api/v1/buildings
POST /api/v1/roads
GET  /api/v1/reports/{scene_id}
```

## Example SR Response

``` json
{
  "job_id": "demo-job-001",
  "status": "completed",
  "input_resolution": 10,
  "output_resolution": 2.5,
  "model": "SEN2SR-mamba-main",
  "demo_only": true
}
```

## Team Principle

Build the system in layers:

``` text
Working Demo
     ↓
Real SEN2SR Inference
     ↓
Geospatial Preservation
     ↓
Validation
     ↓
Downstream GeoAI
     ↓
Temporal Intelligence
```

Do not attempt to train a new foundation model before the end-to-end
product works.
