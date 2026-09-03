/**
 * api-client.js  —  Saurashtra Drought Advisor
 *
 * Live data-feed client for IMD, CGWB, and GWRDC.
 *
 * Architecture
 * ────────────
 * Each public function tries the live API first; if the feed is
 * disabled (API_CONFIG.forceMock || !feed.enabled), or if the
 * request fails after retries, it falls back silently to the mock
 * data already embedded in the page.
 *
 * The module emits status events on window so the UI can reflect
 * the current data-source state without tight coupling:
 *
 *   window.dispatchEvent(new CustomEvent("datasource:status", {
 *     detail: { source, status, message, ts }
 *   }))
 *
 *   source  : "imd" | "cgwb" | "gwrdc" | "wris"
 *   status  : "live" | "mock" | "loading" | "error"
 *
 * Usage
 * ─────
 *   // Load all district data (rainfall + groundwater + reservoir):
 *   const payload = await DroughtAPI.fetchAll();
 *
 *   // Load a single feed:
 *   const rainfall = await DroughtAPI.fetchRainfall();
 *   const gw       = await DroughtAPI.fetchGroundwater();
 *   const reservoir = await DroughtAPI.fetchReservoir();
 *
 * Each function resolves to a normalised payload (see shapes below)
 * or null on unrecoverable error (UI keeps existing mock data).
 */

/* global API_CONFIG */
"use strict";

const DroughtAPI = (() => {

  // ----------------------------------------------------------------
  // INTERNAL UTILITIES
  // ----------------------------------------------------------------

  /**
   * Fetch with timeout + exponential-backoff retry.
   * Returns the parsed JSON body, or throws on final failure.
   */
  async function fetchWithRetry(url, options = {}, retries = API_CONFIG.maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_CONFIG.fetchTimeoutMs);
    options = { ...options, signal: controller.signal };

    try {
      const res = await fetch(url, options);
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      if (retries > 0) {
        const delay = API_CONFIG.retryBaseMs * (API_CONFIG.maxRetries - retries + 1);
        await new Promise(r => setTimeout(r, delay));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw err;
    }
  }

  /** Build a URL with query-string params. */
  function buildUrl(base, path, params) {
    const qs = new URLSearchParams(params).toString();
    return `${base}${path}${qs ? "?" + qs : ""}`;
  }

  /** Headers for authenticated requests. */
  function authHeaders(apiKey) {
    return { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" };
  }

  /** Emit a data-source status event for the status bar. */
  function emitStatus(source, status, message = "") {
    window.dispatchEvent(new CustomEvent("datasource:status", {
      detail: { source, status, message, ts: new Date().toISOString() }
    }));
  }

  /** True if a feed should be called live. */
  function isLive(feedConfig) {
    return !API_CONFIG.forceMock && feedConfig.enabled;
  }

  // ----------------------------------------------------------------
  // MOCK DATA SHAPES
  // These match exactly the normalised shapes returned by live calls
  // so the rest of the app doesn't need to know the difference.
  // ----------------------------------------------------------------

  const MOCK = {

    /**
     * Rainfall payload shape:
     * {
     *   fetchedAt: ISO string,
     *   source: "mock" | "imd",
     *   monthly: { [district]: { months: string[], actual: number[], normal: number[] } },
     *   seasonal: { [district]: { actual: number, normal: number, deficitPct: number } },
     *   monsoon: { onset: "YYYY-MM-DD", withdrawalExpected: "YYYY-MM-DD", daysLate: number }
     * }
     */
    rainfall() {
      const months = ["Jun","Jul","Aug","Sep","Oct"];
      const actualByDistrict = {
        "Rajkot":271,"Jamnagar":340,"Junagadh":302,"Bhavnagar":334,
        "Amreli":358,"Surendranagar":296,"Morbi":312,"Porbandar":370,
        "Botad":420,"Gir Somnath":389,"Devbhoomi Dwarka":248
      };
      const normal = API_CONFIG.imd.normalRainfallMm;
      const monthly = {};
      for (const d of Object.keys(actualByDistrict)) {
        // Distribute season total across months proportionally to normal distribution
        const normals = [65, 180, 160, 55, 13];  // Saurashtra average
        const totalNorm = normals.reduce((s,v)=>s+v,0);
        const actual = normals.map(n => Math.round(actualByDistrict[d] * n / totalNorm));
        monthly[d] = { months, actual, normal: normals };
      }
      const seasonal = {};
      for (const [d, act] of Object.entries(actualByDistrict)) {
        const norm = normal[d];
        seasonal[d] = { actual: act, normal: norm, deficitPct: Math.round((act - norm) / norm * 100) };
      }
      return {
        fetchedAt: new Date().toISOString(), source: "mock",
        monthly, seasonal,
        monsoon: { onset: "2025-06-20", withdrawalExpected: "2025-10-05", daysLate: 9 }
      };
    },

    /**
     * Groundwater payload shape:
     * {
     *   fetchedAt: ISO string,
     *   source: "mock" | "cgwb",
     *   trends: { [district]: { years: string[], depthMbgl: number[] } },
     *   current: { [district]: { depthMbgl: number, depletionRatePerYear: number, isCritical: boolean } }
     * }
     */
    groundwater() {
      const years = ["2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"];
      const trendsRaw = {
        "Rajkot":           [8.1,9.2,10.4,11.0,11.8,13.2,14.8,13.5,14.1,15.6,16.2,17.4,18.4],
        "Jamnagar":         [5.2,5.8,6.4,6.8,7.1,7.8,8.8,8.1,8.5,9.2,10.0,10.8,11.4],
        "Junagadh":         [7.4,8.5,9.8,10.2,11.0,12.5,14.2,13.0,13.8,15.2,16.5,18.0,19.8],
        "Bhavnagar":        [6.8,7.5,8.2,8.8,9.5,10.8,12.2,11.4,11.8,12.8,13.5,15.0,16.2],
        "Amreli":           [5.8,6.4,7.0,7.5,8.0,8.8,9.8,9.2,9.5,10.2,10.8,11.5,12.1],
        "Surendranagar":    [6.2,7.0,7.8,8.4,9.0,10.0,11.5,10.8,11.2,12.2,13.0,14.2,15.6],
        "Morbi":            [5.5,6.2,6.8,7.2,7.8,8.5,9.8,9.0,9.4,10.4,11.2,12.8,14.2],
        "Porbandar":        [4.5,5.0,5.5,5.8,6.2,6.8,7.8,7.2,7.5,8.2,9.0,10.0,10.8],
        "Botad":            [3.8,4.0,4.2,4.4,4.6,5.0,5.8,5.2,5.5,6.2,6.8,7.5,8.2],
        "Gir Somnath":      [5.2,5.8,6.5,6.8,7.2,7.8,9.0,8.4,8.8,9.8,10.5,12.0,13.8],
        "Devbhoomi Dwarka": [8.8,10.2,12.0,12.8,13.8,15.2,17.0,15.8,16.5,18.0,19.4,21.0,22.1]
      };
      const trends = {};
      const current = {};
      for (const [d, depths] of Object.entries(trendsRaw)) {
        trends[d] = { years, depthMbgl: depths };
        const latest = depths[depths.length - 1];
        const tenYearAgo = depths[depths.length - 11] || depths[0];
        current[d] = {
          depthMbgl: latest,
          depletionRatePerYear: parseFloat(((latest - tenYearAgo) / 10).toFixed(2)),
          isCritical: latest >= API_CONFIG.cgwb.criticalThresholdMbgl
        };
      }
      return { fetchedAt: new Date().toISOString(), source: "mock", trends, current };
    },

    /**
     * Reservoir payload shape:
     * {
     *   fetchedAt: ISO string,
     *   source: "mock" | "gwrdc",
     *   storage: { [district]: { livePct: number, liveMCM: number, capacityMCM: number, reservoirName: string } }
     * }
     */
    reservoir() {
      const pcts = {
        "Rajkot":22,"Jamnagar":40,"Junagadh":24,"Bhavnagar":31,
        "Amreli":38,"Surendranagar":28,"Morbi":31,"Porbandar":42,
        "Botad":62,"Gir Somnath":35,"Devbhoomi Dwarka":15
      };
      const storage = {};
      for (const [d, livePct] of Object.entries(pcts)) {
        const res = API_CONFIG.gwrdc.reservoirs[d][0];
        storage[d] = {
          livePct,
          liveMCM: Math.round(res.capacityMCM * livePct / 100),
          capacityMCM: res.capacityMCM,
          reservoirName: res.name
        };
      }
      return { fetchedAt: new Date().toISOString(), source: "mock", storage };
    },
  };

  // ----------------------------------------------------------------
  // RESPONSE NORMALIZERS
  // Convert live API JSON → the same shape as MOCK functions above.
  // Adjust field names here to match what the real API actually returns.
  // ----------------------------------------------------------------

  function normalizeImdRainfall(raw) {
    /**
     * Expected IMD response structure (placeholder — adjust to match
     * the real API schema once credentials are available):
     * {
     *   meta: { from_date, to_date, generated_at },
     *   districts: [
     *     {
     *       district_code: "GJ_RJT",
     *       district_name: "Rajkot",
     *       monthly: [{ month: "Jun", rainfall_mm: 32, normal_mm: 65 }, ...],
     *       seasonal_total: 271,
     *       seasonal_normal: 467
     *     }, ...
     *   ],
     *   monsoon: { onset_date: "2025-06-20", expected_withdrawal: "2025-10-05", days_late: 9 }
     * }
     */
    const monthly = {};
    const seasonal = {};
    const codeToName = Object.fromEntries(
      Object.entries(API_CONFIG.imd.districtCodes).map(([n,c]) => [c,n])
    );

    for (const d of (raw.districts || [])) {
      const name = codeToName[d.district_code] || d.district_name;
      if (!name) continue;
      monthly[name] = {
        months: (d.monthly || []).map(m => m.month),
        actual: (d.monthly || []).map(m => m.rainfall_mm),
        normal: (d.monthly || []).map(m => m.normal_mm),
      };
      seasonal[name] = {
        actual: d.seasonal_total,
        normal: d.seasonal_normal,
        deficitPct: d.seasonal_normal
          ? Math.round((d.seasonal_total - d.seasonal_normal) / d.seasonal_normal * 100) : 0,
      };
    }
    const m = raw.monsoon || {};
    return {
      fetchedAt: raw.meta?.generated_at || new Date().toISOString(),
      source: "imd", monthly, seasonal,
      monsoon: {
        onset: m.onset_date || null,
        withdrawalExpected: m.expected_withdrawal || null,
        daysLate: m.days_late ?? 0,
      }
    };
  }

  function normalizeCgwbGroundwater(rawArray) {
    /**
     * Expected CGWB GEMS response — array, one entry per well:
     * [
     *   {
     *     well_id: "GJ_W_2401",
     *     district_name: "Rajkot",
     *     readings: [{ year: 2012, depth_mbgl: 8.1 }, ...]
     *   }, ...
     * ]
     */
    const years = rawArray[0]?.readings?.map(r => String(r.year)) || [];
    const trends = {};
    const current = {};
    for (const well of rawArray) {
      const name = well.district_name;
      const depths = well.readings.map(r => r.depth_mbgl);
      trends[name] = { years, depthMbgl: depths };
      const latest = depths[depths.length - 1];
      const tenYearAgo = depths.length >= 11 ? depths[depths.length - 11] : depths[0];
      current[name] = {
        depthMbgl: latest,
        depletionRatePerYear: parseFloat(((latest - tenYearAgo) / 10).toFixed(2)),
        isCritical: latest >= API_CONFIG.cgwb.criticalThresholdMbgl
      };
    }
    return { fetchedAt: new Date().toISOString(), source: "cgwb", trends, current };
  }

  function normalizeGwrdcReservoir(raw) {
    /**
     * Expected GWRDC WRIS response:
     * {
     *   as_of_date: "2025-07-15",
     *   reservoirs: [
     *     { reservoir_id: "AJI_3", district_name: "Rajkot",
     *       live_storage_mcm: 39.6, capacity_mcm: 180, live_pct: 22 }, ...
     *   ]
     * }
     */
    const storage = {};
    for (const r of (raw.reservoirs || [])) {
      storage[r.district_name] = {
        livePct: r.live_pct,
        liveMCM: r.live_storage_mcm,
        capacityMCM: r.capacity_mcm,
        reservoirName: r.reservoir_id,
      };
    }
    return {
      fetchedAt: raw.as_of_date ? new Date(raw.as_of_date).toISOString() : new Date().toISOString(),
      source: "gwrdc", storage
    };
  }

  // ----------------------------------------------------------------
  // PUBLIC API FUNCTIONS
  // ----------------------------------------------------------------

  /**
   * Fetch district-wise rainfall from IMD.
   * Falls back to mock data if feed is disabled or request fails.
   * @returns {Promise<Object>}  Normalised rainfall payload
   */
  async function fetchRainfall() {
    emitStatus("imd", "loading");
    if (!isLive(API_CONFIG.imd)) {
      emitStatus("imd", "mock", "Feed disabled — using sample data");
      return MOCK.rainfall();
    }
    try {
      const today = new Date().toISOString().split("T")[0];
      const fromDate = `${new Date().getFullYear()}-06-01`;
      const url = buildUrl(API_CONFIG.imd.baseUrl, API_CONFIG.imd.endpoints.monthlySummary, {
        from_date: fromDate, to_date: today, state: "GJ"
      });
      const raw = await fetchWithRetry(url, { headers: authHeaders(API_CONFIG.imd.apiKey) });
      const result = normalizeImdRainfall(raw);
      emitStatus("imd", "live", `Live — fetched ${result.fetchedAt}`);
      return result;
    } catch (err) {
      console.warn("[DroughtAPI] IMD fetch failed, falling back to mock:", err.message);
      emitStatus("imd", "error", err.message);
      return MOCK.rainfall();
    }
  }

  /**
   * Fetch groundwater depth time-series from CGWB for all districts.
   * @returns {Promise<Object>}  Normalised groundwater payload
   */
  async function fetchGroundwater() {
    emitStatus("cgwb", "loading");
    if (!isLive(API_CONFIG.cgwb)) {
      emitStatus("cgwb", "mock", "Feed disabled — using sample data");
      return MOCK.groundwater();
    }
    try {
      const wellIds = Object.values(API_CONFIG.cgwb.representativeWells).join(",");
      const url = buildUrl(API_CONFIG.cgwb.baseUrl, API_CONFIG.cgwb.endpoints.districtSummary, {
        well_ids: wellIds, from_year: 2012, to_year: new Date().getFullYear()
      });
      const raw = await fetchWithRetry(url, { headers: authHeaders(API_CONFIG.cgwb.apiKey) });
      const result = normalizeCgwbGroundwater(Array.isArray(raw) ? raw : raw.wells || []);
      emitStatus("cgwb", "live", `Live — fetched ${result.fetchedAt}`);
      return result;
    } catch (err) {
      console.warn("[DroughtAPI] CGWB fetch failed, falling back to mock:", err.message);
      emitStatus("cgwb", "error", err.message);
      return MOCK.groundwater();
    }
  }

  /**
   * Fetch reservoir storage from GWRDC.
   * @returns {Promise<Object>}  Normalised reservoir payload
   */
  async function fetchReservoir() {
    emitStatus("gwrdc", "loading");
    if (!isLive(API_CONFIG.gwrdc)) {
      emitStatus("gwrdc", "mock", "Feed disabled — using sample data");
      return MOCK.reservoir();
    }
    try {
      const url = buildUrl(API_CONFIG.gwrdc.baseUrl, API_CONFIG.gwrdc.endpoints.districtStorage, {
        state: "GJ", region: "SAURASHTRA"
      });
      const raw = await fetchWithRetry(url, { headers: authHeaders(API_CONFIG.gwrdc.apiKey) });
      const result = normalizeGwrdcReservoir(raw);
      emitStatus("gwrdc", "live", `Live — fetched ${result.fetchedAt}`);
      return result;
    } catch (err) {
      console.warn("[DroughtAPI] GWRDC fetch failed, falling back to mock:", err.message);
      emitStatus("gwrdc", "error", err.message);
      return MOCK.reservoir();
    }
  }

  /**
   * Compute the Drought Risk Index (0–100) for a district from live payloads.
   *
   * DRI = 0.25 * rainfallScore + 0.30 * groundwaterScore + 0.25 * soilMoistureProxy + 0.20 * reservoirScore
   *
   * All sub-scores are normalised 0–100 (100 = most extreme).
   * soilMoistureProxy is estimated from rainfall deficit in absence of a live soil-moisture feed.
   *
   * @param {string} district
   * @param {Object} rainfall   — result of fetchRainfall()
   * @param {Object} groundwater — result of fetchGroundwater()
   * @param {Object} reservoir   — result of fetchReservoir()
   * @returns {{ score: number, risk: string }}
   */
  function computeDRI(district, rainfall, groundwater, reservoir) {
    // Rainfall score: 0% deficit→0, −100% deficit→100
    const deficitPct = rainfall.seasonal[district]?.deficitPct ?? 0;
    const rainfallScore = Math.min(100, Math.max(0, Math.abs(deficitPct)));

    // Groundwater score: 0m→0, ≥30m→100 (linear, capped)
    const depth = groundwater.current[district]?.depthMbgl ?? 0;
    const gwScore = Math.min(100, (depth / 30) * 100);

    // Soil moisture proxy: derived from rainfall deficit (0–100)
    const soilScore = Math.min(100, Math.max(0, rainfallScore * 0.9));

    // Reservoir score: 100% full→0, 0% full→100
    const livePct = reservoir.storage[district]?.livePct ?? 50;
    const resScore = Math.max(0, 100 - livePct);

    const score = Math.round(0.25 * rainfallScore + 0.30 * gwScore + 0.25 * soilScore + 0.20 * resScore);
    const risk  = score >= 76 ? "critical" : score >= 51 ? "severe" : score >= 26 ? "moderate" : "normal";
    return { score, risk };
  }

  /**
   * Fetch all three feeds in parallel and merge into a single district-keyed payload
   * ready for direct consumption by the UI layer.
   *
   * Resolved shape:
   * {
   *   fetchedAt: ISO string,
   *   rainfall:   { ... },   // normalised rainfall
   *   groundwater:{ ... },   // normalised groundwater
   *   reservoir:  { ... },   // normalised reservoir
   *   districts: {
   *     [name]: {
   *       risk, score,
   *       rain (formatted deficit string),
   *       depth (formatted string),
   *       depletion (formatted string),
   *       reservoir (formatted pct string),
   *       action (advisory string)
   *     }
   *   }
   * }
   */
  async function fetchAll() {
    const [rainfall, groundwater, reservoir] = await Promise.all([
      fetchRainfall(),
      fetchGroundwater(),
      fetchReservoir(),
    ]);

    const districts = {};
    for (const name of Object.keys(API_CONFIG.imd.districtCodes)) {
      const { score, risk } = computeDRI(name, rainfall, groundwater, reservoir);
      const deficit = rainfall.seasonal[name]?.deficitPct ?? 0;
      const depth   = groundwater.current[name]?.depthMbgl ?? 0;
      const depletion = groundwater.current[name]?.depletionRatePerYear ?? 0;
      const resPct    = reservoir.storage[name]?.livePct ?? 0;
      districts[name] = {
        risk, score,
        rain:      `${deficit > 0 ? "+" : ""}${deficit}%`,
        depth:     `${depth.toFixed(1)} m`,
        depletion: `${depletion > 0 ? "+" : ""}${depletion} m/yr`,
        reservoir: `${resPct}%`,
        action: _advisoryAction(risk, name),
      };
    }

    return {
      fetchedAt: new Date().toISOString(),
      rainfall, groundwater, reservoir,
      districts
    };
  }

  /** Derive a one-line action string from risk level and district name. */
  function _advisoryAction(risk, district) {
    const actions = {
      critical: `⚠️ Restrict new borewells in ${district}. Activate drinking water emergency protocol.`,
      severe:   `🟠 Limit borewell permits in ${district}. Implement deficit irrigation immediately.`,
      moderate: `🟡 Continue water-efficient farming in ${district}. Monitor monthly.`,
      normal:   `✅ Good water availability in ${district}. Build farm ponds for future resilience.`,
    };
    return actions[risk] || actions.moderate;
  }

  // ----------------------------------------------------------------
  // AUTO-REFRESH
  // ----------------------------------------------------------------
  let _refreshTimer = null;

  /**
   * Start auto-refresh with the configured interval.
   * Calls the provided callback(payload) with freshly fetched data.
   * @param {function} callback  — receives the full fetchAll() payload
   */
  function startAutoRefresh(callback) {
    if (API_CONFIG.autoRefreshMs <= 0) return;
    stopAutoRefresh();
    _refreshTimer = setInterval(async () => {
      try {
        const payload = await fetchAll();
        if (typeof callback === "function") callback(payload);
      } catch (e) {
        console.warn("[DroughtAPI] Auto-refresh failed:", e.message);
      }
    }, API_CONFIG.autoRefreshMs);
  }

  function stopAutoRefresh() {
    if (_refreshTimer) { clearInterval(_refreshTimer); _refreshTimer = null; }
  }

  // ----------------------------------------------------------------
  // PUBLIC SURFACE
  // ----------------------------------------------------------------
  return {
    fetchRainfall,
    fetchGroundwater,
    fetchReservoir,
    fetchAll,
    computeDRI,
    startAutoRefresh,
    stopAutoRefresh,
    /** Expose mock generators for testing / offline demo */
    mock: MOCK,
  };

})();
