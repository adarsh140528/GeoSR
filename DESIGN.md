# GeoSR-X Design Document

## Design Goal

The GeoSR-X interface should communicate one central idea:

> **AI-generated spatial detail should be useful, inspectable and
> accompanied by evidence of reliability.**

The application should therefore look like a professional geospatial
analysis platform rather than a generic AI image-enhancement website.

## Design Principles

### Map First

The map is the primary workspace.

### Compare, Do Not Hide

Users should be able to compare:

``` text
Original
vs
Super Resolution
vs
Uncertainty
vs
Detected Features
vs
Change
```

### Explain Confidence

Every generated analytical result should expose confidence or
uncertainty.

### Separate Real and Demo Data

Any hard-coded value must be visibly labelled:

``` text
DEMO DATA
```

### Preserve GIS Context

Users should always know:

-   location
-   acquisition date
-   sensor
-   resolution
-   coordinate system
-   model used

## Main Application Layout

``` text
┌──────────────────────────────────────────────────────────┐
│ GeoSR-X                              DEMO MODE           │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│ Workspace    │                 MAP                       │
│              │                                           │
│ Super Res.   │       Satellite / SR / Change            │
│ Change       │                                           │
│ Disaster     │                                           │
│ Agriculture  │                                           │
│ Urban        │                                           │
│              │                                           │
├──────────────┴───────────────────────────────────────────┤
│ Resolution │ Confidence │ Cloud │ Model │ Status        │
└──────────────────────────────────────────────────────────┘
```

## Navigation

### Overview

Shows:

-   Current project
-   Selected scene
-   Processing status
-   Main metrics

### Super Resolution

Shows:

-   Original imagery
-   SR imagery
-   zoom
-   layer opacity
-   resolution
-   model

### Reliability

Shows:

-   uncertainty map
-   observation consistency
-   spectral consistency
-   reliability legend

### Change Detection

Shows:

-   Date A
-   Date B
-   change layer
-   detected objects
-   confidence

### Applications

Shows:

-   Disaster
-   Agriculture
-   Urban

### Reports

Shows:

-   generated report
-   downloadable GeoTIFF
-   GeoJSON
-   JSON metrics

## Super Resolution Screen

``` text
┌──────────────────────────────────────────────────────────┐
│ SUPER RESOLUTION                                         │
├──────────────────────────────────────────────────────────┤
│ Scene: DEMO-MUMBAI-001                                  │
│ Sensor: Sentinel-2 L2A                                  │
│ Model: SEN2SR Mamba Full                                │
│                                                          │
│ ┌────────────────────┐    ┌────────────────────┐        │
│ │                    │    │                    │        │
│ │     ORIGINAL       │    │    SUPER-RES       │        │
│ │                    │    │                    │        │
│ └────────────────────┘    └────────────────────┘        │
│                                                          │
│ 10 m → 2.5 m      4×       Confidence: 91%             │
│                                                          │
│ [View Uncertainty] [Run Building Analysis]              │
└──────────────────────────────────────────────────────────┘
```

## Reliability Screen

``` text
┌──────────────────────────────────────────────────────────┐
│ RELIABILITY ANALYSIS                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              UNCERTAINTY MAP                             │
│                                                          │
│      [Map with confidence overlay]                       │
│                                                          │
│ High Confidence        72%                               │
│ Moderate               21%                               │
│ High Uncertainty        7%                               │
│                                                          │
│ Observation Error      0.018   DEMO                     │
│ Spectral Difference    0.011   DEMO                     │
└──────────────────────────────────────────────────────────┘
```

## Change Detection Screen

``` text
┌──────────────────────────────────────────────────────────┐
│ CHANGE DETECTION                                         │
├──────────────────────────────────────────────────────────┤
│ Date A: 18 Aug 2025     Date B: 18 Aug 2026             │
│                                                          │
│ ┌────────────────────┐    ┌────────────────────┐        │
│ │       DATE A       │    │       DATE B       │        │
│ └────────────────────┘    └────────────────────┘        │
│                         ↓                                │
│                  CHANGE MAP                              │
│                                                          │
│ Potential Building Changes: 12                           │
│ Potential Road Changes: 3                                │
│ Vegetation Changes: 8                                    │
│ Change F1: 0.81 DEMO                                     │
└──────────────────────────────────────────────────────────┘
```

## Disaster Screen

The disaster workflow should communicate that results are analytical
estimates.

``` text
Event Type: Flood
Before: DEMO-BEFORE-001
After:  DEMO-AFTER-001

Potential affected zones
Critical: 17
Moderate: 32
Low / uncertain: 51
```

All values above are demo-only examples.

## Agriculture Screen

``` text
Crop Area
Vegetation Condition
Field Boundaries
Temporal Change
```

The interface can display sample values initially:

``` text
Fields detected: 1,284 DEMO
Vegetation index mean: 0.62 DEMO
Potential stress zones: 14 DEMO
```

## Urban Screen

``` text
Buildings detected: 4,210 DEMO
Road length: 182 km DEMO
Built-up change: +6.4% DEMO
```

Again, these must never be represented as actual results until
calculated from real imagery.

## Layer System

The map should support toggling:

``` text
☑ Original
☑ Super Resolution
☐ Uncertainty
☐ Buildings
☐ Roads
☐ Land Cover
☐ Change
```

Each layer should have:

-   visibility
-   opacity
-   legend
-   metadata

## Color/Legend Semantics

The final implementation should use accessible, consistent semantics.

Suggested conceptual mapping:

``` text
High confidence     → positive/clear state
Moderate confidence → warning state
High uncertainty    → caution state
Detected change     → change layer
No-data/cloud       → neutral hatch/overlay
```

Do not rely on color alone; include labels and legends.

## Demo Mode Indicator

A persistent badge should be visible:

``` text
● DEMO MODE — SAMPLE VALUES
```

When real inference is enabled:

``` text
● LIVE INFERENCE
```

This prevents judges from confusing hard-coded demonstration values with
measured results.

## Processing Experience

The processing screen should show stages rather than a fake instant
result.

Example:

``` text
✓ Input validated
✓ Bands loaded
✓ Preprocessing
✓ Model loaded
✓ Super-resolution inference
✓ Geospatial reconstruction
✓ Reliability analysis
✓ GeoAI analysis
```

For demo mode, the progress sequence can be simulated.

The UI must still say:

``` text
DEMO PROCESSING
```

## Empty State

When no scene is selected:

``` text
Select a satellite scene to begin.

[Use Demo Scene]
[Upload GeoTIFF]
```

## Error State

Example:

``` text
Unable to process scene.

Missing required band:
B08

Check that the Sentinel-2 product contains all
required bands for the selected model.
```

## Report Design

The report should contain:

``` text
GeoSR-X Analysis Report

Scene Information
Model Information
Input / Output Resolution

Super-Resolution Result

Reliability Analysis

Spectral Consistency

Detected Features

Change Analysis

Limitations

Export Information
```

## Design Rule for Scientific Integrity

Never show:

``` text
2.5 m Ground Truth
```

for the SR result.

Use:

``` text
2.5 m Reconstructed Representation
```

or:

``` text
2.5 m Super-Resolved Output
```

This distinction should appear throughout the application.

## Demo Data Contract

All hard-coded demo responses should include:

``` json
{
  "demo_only": true,
  "source": "synthetic_demo"
}
```

The frontend should reject or flag any demo payload that does not
contain this marker.

## Component Structure

``` text
AppShell
├── Sidebar
├── TopBar
├── MapWorkspace
│   ├── RasterLayer
│   ├── UncertaintyLayer
│   ├── VectorLayer
│   └── ChangeLayer
├── MetricsPanel
├── ProcessingPanel
└── ReportPanel
```

## Backend / Frontend Contract

The frontend should never invent model results itself in production.

Demo mode may use:

``` text
/api/demo/*
```

Real inference should use:

``` text
/api/v1/*
```

This separation makes it easy to remove hard-coded values later.

## Final UX Flow

``` text
Dashboard
   ↓
Select Demo Scene
   ↓
Scene Metadata
   ↓
Run Super Resolution
   ↓
Compare Original / SR
   ↓
Inspect Reliability
   ↓
Run GeoAI
   ↓
Run Change Detection
   ↓
Generate Report
   ↓
Export Geospatial Products
```

## Final Design Statement

GeoSR-X should make the judge understand the entire scientific and
product story within a few minutes:

``` text
Medium-resolution satellite observation
              ↓
       AI reconstruction
              ↓
       Is it reliable?
              ↓
       What changed?
              ↓
       What can we detect?
              ↓
       What can an analyst use?
```

That narrative is more important than adding unnecessary UI features.
