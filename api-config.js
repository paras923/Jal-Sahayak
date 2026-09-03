/**
 * api-config.js  —  Saurashtra Drought Advisor
 *
 * Central configuration for all live data-feed integrations.
 * To activate a feed: set its `enabled` flag to true and supply
 * the correct `baseUrl` / `apiKey` for your deployment environment.
 *
 * SECURITY: Never commit real API keys here. In production, inject
 * API keys via a server-side proxy or environment variable at build
 * time. The `apiKey` fields below are placeholders only.
 *
 * Data-source documentation:
 *   IMD Open Data    — https://internal.imd.gov.in/open-data/
 *   CGWB GEMS portal — https://cgwb.gov.in/GW-data-access.html
 *   GWRDC WRIS       — https://gwrdc.gujarat.gov.in/wris/
 *   India WRIS       — https://indiawris.gov.in/wris/
 */

const API_CONFIG = {

  // ------------------------------------------------------------------
  // GLOBAL SETTINGS
  // ------------------------------------------------------------------

  /** Milliseconds before a single fetch attempt times out */
  fetchTimeoutMs: 8000,

  /** Number of retry attempts on transient network/5xx errors */
  maxRetries: 2,

  /** Milliseconds to wait between retries (exponential base) */
  retryBaseMs: 1000,

  /**
   * When true the app uses mock/sample data for every feed,
   * regardless of the individual `enabled` flags below.
   * Flip to false only when at least one live feed is configured.
   */
  forceMock: true,

  /** How often (ms) the app auto-refreshes live data (0 = no auto-refresh) */
  autoRefreshMs: 15 * 60 * 1000,   // 15 minutes

  // ------------------------------------------------------------------
  // IMD — India Meteorological Department
  // Rainfall observations and forecasts via IMD Open Data portal.
  // ------------------------------------------------------------------
  imd: {
    enabled: false,
    baseUrl: "https://internal.imd.gov.in/open-data/api/v1",
    apiKey:  "YOUR_IMD_API_KEY_HERE",

    /**
     * Endpoint returning district-level rainfall for a given date range.
     * Query params: district_code, from_date (YYYY-MM-DD), to_date (YYYY-MM-DD)
     * Example: GET /rainfall/district?district_code=GJ_RJT&from_date=2025-06-01&to_date=2025-10-31
     */
    endpoints: {
      districtRainfall:  "/rainfall/district",
      monthlySummary:    "/rainfall/monthly_summary",
      monsoonOnset:      "/monsoon/onset_withdrawal",
      forecast7Day:      "/forecast/district_7day",
    },

    /**
     * Map of app district name → IMD district code.
     * Source: IMD Station Catalogue (2023 edition).
     */
    districtCodes: {
      "Rajkot":           "GJ_RJT",
      "Jamnagar":         "GJ_JAM",
      "Junagadh":         "GJ_JUN",
      "Bhavnagar":        "GJ_BHV",
      "Amreli":           "GJ_AMR",
      "Surendranagar":    "GJ_SND",
      "Morbi":            "GJ_MOR",
      "Porbandar":        "GJ_PBR",
      "Botad":            "GJ_BOT",
      "Gir Somnath":      "GJ_GIR",
      "Devbhoomi Dwarka": "GJ_DWK",
    },

    /** Normal rainfall (mm) per district for the full Kharif season (Jun–Oct). */
    normalRainfallMm: {
      "Rajkot": 467, "Jamnagar": 430, "Junagadh": 520, "Bhavnagar": 472,
      "Amreli": 445, "Surendranagar": 433, "Morbi": 448, "Porbandar": 452,
      "Botad": 440, "Gir Somnath": 530, "Devbhoomi Dwarka": 490,
    },
  },

  // ------------------------------------------------------------------
  // CGWB — Central Ground Water Board
  // Groundwater level monitoring wells accessed via GEMS portal.
  // ------------------------------------------------------------------
  cgwb: {
    enabled: false,
    baseUrl: "https://cgwb.gov.in/GW-data-access/api/v2",
    apiKey:  "YOUR_CGWB_API_KEY_HERE",

    /**
     * Endpoint returning time-series groundwater depth for a well.
     * Query params: well_id, from_year, to_year
     * Example: GET /well/timeseries?well_id=GJ_W_2401&from_year=2012&to_year=2024
     */
    endpoints: {
      wellTimeSeries:    "/well/timeseries",
      districtSummary:   "/district/summary",
      wellsList:         "/wells/list",
    },

    /**
     * Representative monitoring well ID per district.
     * Source: CGWB Gujarat Regional Directory, 2024.
     * Replace with the well closest to your area of interest.
     */
    representativeWells: {
      "Rajkot":           "GJ_W_2401",
      "Jamnagar":         "GJ_W_1801",
      "Junagadh":         "GJ_W_1901",
      "Bhavnagar":        "GJ_W_0901",
      "Amreli":           "GJ_W_0201",
      "Surendranagar":    "GJ_W_3001",
      "Morbi":            "GJ_W_2201",
      "Porbandar":        "GJ_W_2901",
      "Botad":            "GJ_W_1001",
      "Gir Somnath":      "GJ_W_1201",
      "Devbhoomi Dwarka": "GJ_W_0601",
    },

    /** Critical depth threshold in meters below ground level (MBGL). */
    criticalThresholdMbgl: 20,
  },

  // ------------------------------------------------------------------
  // GWRDC — Gujarat Water Resources Development Corporation
  // Reservoir storage levels via Gujarat WRIS.
  // ------------------------------------------------------------------
  gwrdc: {
    enabled: false,
    baseUrl: "https://gwrdc.gujarat.gov.in/wris/api/v1",
    apiKey:  "YOUR_GWRDC_API_KEY_HERE",

    endpoints: {
      reservoirStorage:  "/reservoir/current_storage",
      districtStorage:   "/reservoir/district_summary",
    },

    /**
     * Main reservoir(s) per district and their total live storage capacity (MCM).
     * Source: GWRDC Reservoir Master List (2024).
     */
    reservoirs: {
      "Rajkot":           [{ id: "AJI_3",       name: "Aji-3 Dam",         capacityMCM: 180 }],
      "Jamnagar":         [{ id: "RANJIT_SAGAR", name: "Ranjit Sagar",      capacityMCM: 135 }],
      "Junagadh":         [{ id: "KALWA",        name: "Kalwa Dam",         capacityMCM: 95  }],
      "Bhavnagar":        [{ id: "SHETRUNJI",    name: "Shetrunji Dam",     capacityMCM: 284 }],
      "Amreli":           [{ id: "SHETI",        name: "Sheti Reservoir",   capacityMCM: 58  }],
      "Surendranagar":    [{ id: "DHOLI_DHAJA",  name: "Dholi Dhaja",       capacityMCM: 160 }],
      "Morbi":            [{ id: "MACHHU_2",     name: "Machhu-2 Dam",      capacityMCM: 285 }],
      "Porbandar":        [{ id: "BHADAR",       name: "Bhadar Reservoir",  capacityMCM: 165 }],
      "Botad":            [{ id: "KHARI",        name: "Khari Dam",         capacityMCM: 42  }],
      "Gir Somnath":      [{ id: "HIREN",        name: "Hiren Reservoir",   capacityMCM: 76  }],
      "Devbhoomi Dwarka": [{ id: "RUPEN",        name: "Rupen Dam",         capacityMCM: 88  }],
    },
  },

  // ------------------------------------------------------------------
  // India WRIS — Water Resources Information System
  // Supplementary river flow / soil moisture data (optional).
  // ------------------------------------------------------------------
  wris: {
    enabled: false,
    baseUrl: "https://indiawris.gov.in/wris/api",
    apiKey:  "YOUR_WRIS_API_KEY_HERE",

    endpoints: {
      riverFlow:     "/river/daily_flow",
      soilMoisture:  "/satellite/soil_moisture",
    },
  },

};

// Freeze config to prevent accidental mutation at runtime
Object.freeze(API_CONFIG);
