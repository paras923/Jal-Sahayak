/* ============================================================
   JAL SAHAYAK — Main Application
   Saurashtra Drought & Groundwater Advisor
   ============================================================ */

// ── State ──────────────────────────────────────────────────
const App = {
  data: null,
  currentDistrict: 'Rajkot',
  currentLang: 'en',
  theme: localStorage.getItem('theme') || 'light',
  weatherCache: {},
  charts: {},
  selectedMapDistrict: null,
};

// ── District coordinates for Open-Meteo API ─────────────────
const DISTRICT_COORDS = {
  'Rajkot':            { lat: 22.3039, lon: 70.8022 },
  'Jamnagar':          { lat: 22.4707, lon: 70.0577 },
  'Junagadh':          { lat: 21.5222, lon: 70.4579 },
  'Bhavnagar':         { lat: 21.7645, lon: 72.1519 },
  'Amreli':            { lat: 21.6027, lon: 71.2218 },
  'Porbandar':         { lat: 21.6440, lon: 69.6293 },
  'Surendranagar':     { lat: 22.7278, lon: 71.6490 },
  'Morbi':             { lat: 22.8173, lon: 70.8378 },
  'Gir Somnath':       { lat: 20.9026, lon: 70.3721 },
  'Botad':             { lat: 22.1693, lon: 71.6672 },
  'Devbhoomi Dwarka':  { lat: 22.2394, lon: 68.9685 },
};

// ── Full i18n Translation Dictionaries ─────────────────────
const I18N = {
  en: {
    // Nav
    nav_home: '🏠 Home', nav_dashboard: '📊 Dashboard', nav_map: '🗺️ Risk Map',
    nav_trends: '📈 GW Trends', nav_advisory: '🤖 AI Advisory',
    nav_resources: '🌾 Farmer Resources', nav_about: 'ℹ️ About',
    nav_dashboard_short: 'Live Dashboard', nav_map_short: 'District Risk Map',
    nav_trends_short: 'GW Trends', nav_advisory_short: 'AI Advisory',
    nav_resources_short: 'Farmer Resources', nav_about_short: 'About & Data Sources',
    // Hero
    hero_badge: 'Gujarat · Saurashtra Region · 11 Districts',
    hero_title: 'Intelligent Drought & Groundwater Advisor for Saurashtra',
    hero_desc: 'Empowering farmers, municipal bodies, and water authorities with real-time drought risk monitoring, historical groundwater trend analytics, and AI-driven actionable advisories across all 11 Saurashtra districts.',
    cta_dashboard: '📊 Live Dashboard', cta_map: '🗺️ District Risk Map', cta_advisory: '🤖 Get AI Advisory',
    // Counters
    counter_districts: 'Saurashtra Districts', counter_wells: 'Wells Monitored',
    counter_gw: 'Irrigated Land on Groundwater', counter_storage: 'MCM Additional Storage (SPSJSY)',
    // Home sections
    crisis_eyebrow: 'The Crisis at a Glance',
    crisis_title: "Why Saurashtra's Water Future Demands Attention",
    crisis_desc: 'A semi-arid peninsular region with no perennial rivers, hard-rock basalt aquifers, and rainfall variability of ~40% — making it one of India\'s most drought-prone zones.',
    timeline_eyebrow: 'Historical Context',
    timeline_title: "From Crisis to Conservation: Saurashtra's Water Journey",
    districts_eyebrow: 'District Risk Overview', districts_title: 'All 11 Districts at a Glance',
    features_eyebrow: 'Platform Features', features_title: 'Everything You Need to Monitor & Act',
    feat_dash_title: 'Live Dashboard', feat_dash_desc: 'Real-time weather via Open-Meteo API, drought risk index, groundwater depletion charts, and per-district stats.',
    feat_map_title: 'Interactive Risk Map', feat_map_desc: 'SVG clickable map of all 11 districts color-coded by CGWB groundwater stress categories with pattern overlays for accessibility.',
    feat_trends_title: 'Groundwater Trends', feat_trends_desc: '15-year historical dataset, rainfall vs recharge correlation, pre/post conservation-movement comparison, CSV export.',
    feat_adv_title: 'AI Advisory Engine', feat_adv_desc: 'Select your district, crop, and land size — get irrigation scheduling, water structure recommendations, and a 90-day drought risk forecast.',
    feat_res_title: 'Farmer Resources', feat_res_desc: 'Water-saving techniques, government scheme links (PMKSY, Jal Shakti), KVK contacts — available in English, Gujarati & Hindi.',
    feat_about_title: 'Data & Methodology', feat_about_desc: 'Transparent data sources (CGWB, IMD, Open-Meteo), risk index methodology, citations, and disclaimer information.',
    // Footer
    footer_brand_desc: 'Intelligent Drought & Groundwater Depletion Advisor for Saurashtra, Gujarat, India. Built for farmers, local bodies, and water authorities.',
    footer_platform: 'Platform', footer_resources: 'Resources', footer_data_sources: 'Data Sources',
    // Dashboard
    dash_title: 'District Water Intelligence Center',
    dash_subtitle: "Real-time weather + historical groundwater analytics for Saurashtra's 11 districts",
    label_select_district: 'Select District:',
    stat_rainfall: 'Latest Annual Rainfall', stat_rainfall_sub: 'vs 500mm avg',
    stat_gw_depth: 'Groundwater Depth', stat_gw_depth_sub: 'metres below ground level',
    stat_wells: 'Wells with Depletion', stat_risk: 'Drought Risk Index',
    stat_reservoir: 'Est. Reservoir / Check Dam Fill',
    chart_rainfall_title: 'Annual Rainfall Trend',
    chart_gauge_title: 'Drought Risk Gauge', chart_gauge_sub: 'Composite index (0–100)',
    chart_depletion_title: 'District-wise Groundwater Depletion (%)',
    chart_depletion_sub: '% of monitored wells showing depletion · All 11 Saurashtra districts',
    chart_forecast_title: '7-Day Rainfall & Temperature Forecast',
    // Map
    map_title: 'District Groundwater Risk Map',
    map_subtitle: 'Click any district to view detailed stats and advisory · Color + pattern coded per CGWB classification',
    map_legend_title: 'Groundwater Stress Classification (CGWB)',
    table_title: 'All Districts — Sortable Comparison',
    table_subtitle: 'Click any column header to sort · Click a row to view district details',
    // Trends
    trends_title: 'Groundwater Trend Analytics',
    trends_subtitle: 'Historical multi-year analysis · Rainfall-recharge correlation · Pre/post conservation-movement comparison',
    trends_analyse: 'Analyse District:',
    tab_regional: 'Regional Rainfall', tab_gwdepth: 'GW Depth Trend',
    tab_recharge: 'Conservation Impact', tab_correlation: 'Rainfall-GW Correlation',
    // Advisory
    adv_title: 'AI-Powered Water Advisory',
    adv_subtitle: 'Irrigation scheduling · Water structure recommendations · 30/60/90-day drought forecast · Crop-specific guidance',
    adv_form_title: 'Generate Advisory',
    adv_form_desc: 'Enter your farm details to receive a personalized water management advisory.',
    adv_label_district: 'Your District', adv_label_crop: 'Primary Crop', adv_label_land: 'Land Size (hectares)',
    adv_engine_note: '💡 Advisory generated by a <strong>rule-based engine</strong> using rainfall deficit, groundwater depth, CGWB stress classification, and crop water requirements. Works fully offline — no paid API required.',
    adv_btn_generate: '🤖 Generate Advisory',
    adv_quick_select: 'QUICK SELECT DISTRICT',
    adv_output_title: 'Advisory Output',
    adv_placeholder_title: 'Your Advisory Will Appear Here',
    adv_placeholder_desc: 'Select your district, crop type, and land size, then click <strong>"Generate Advisory"</strong> to receive a personalized water management plan.',
    // Resources
    res_title: 'Farmer Resources',
    res_subtitle: 'Water-saving techniques · Government schemes · KVK contacts · Best practices',
    res_irr_eyebrow: 'Irrigation Techniques', res_irr_title: 'Water-Saving Irrigation Methods',
    res_drip_title: 'Drip Irrigation (Tapak Sinchai)',
    res_drip_desc: 'Delivers water directly to the root zone, reducing consumption by 35–50% vs flood irrigation. Ideal for groundnut, cotton, vegetables. 95%+ water-use efficiency.',
    res_sprinkler_title: 'Sprinkler Irrigation (Chhantakav)',
    res_sprinkler_desc: 'Simulates rainfall for even water distribution. Saves 20–30% water. Best for wheat, bajra, jowar, and field crops with undulating terrain.',
    res_mulch_title: 'Mulching (Aavaran)',
    res_mulch_desc: 'Covering soil with crop residue or plastic reduces evaporation by 30–40%, suppresses weeds, and improves soil moisture retention between irrigations.',
    res_laser_title: 'Laser Land Levelling',
    res_laser_desc: 'Precision land levelling using GPS/laser technology improves irrigation efficiency by 20–30%, reduces water-logging and ensures uniform crop stand.',
    res_drought_var_title: 'Drought-Resistant Varieties',
    res_drought_var_desc: 'GG-20, TAG-24 (groundnut); NH-615 (wheat); GHB-732 (bajra) are drought-tolerant varieties recommended for Saurashtra by SAU Junagadh.',
    res_pond_title: 'Farm Pond Construction (Khet Talavdi)',
    res_pond_desc: 'On-farm ponds (20×20×3m) harvest runoff for supplemental irrigation. Under PMKSY, 50% subsidy available to small/marginal farmers in Saurashtra.',
    res_schemes_eyebrow: 'Government Schemes', res_schemes_title: 'Key Water & Agriculture Schemes',
    res_pmksy_desc: "India's flagship irrigation scheme: 'Har Khet Ko Pani, More Crop Per Drop.' Provides 55% subsidy on drip/sprinkler installation for small farmers, farm pond construction support, and watershed development.",
    res_kvk_eyebrow: 'Contact & Support', res_kvk_title: 'Krishi Vigyan Kendra (KVK) Contacts',
    // About
    about_title: 'About & Data Sources',
    about_subtitle: 'Methodology, data provenance, citations, and platform disclaimer',
    about_purpose_title: '🎯 Platform Purpose',
    about_purpose_desc: 'Jal Sahayak is a research and advisory tool designed to help farmers, local bodies, and water authorities in Saurashtra, Gujarat understand drought risk and groundwater depletion. It aggregates publicly available research data, live weather APIs, and rule-based analytics to provide actionable water management guidance.',
    about_disclaimer: 'This is an advisory tool only. It is NOT a substitute for official CGWB, IMD, or state government data. Always consult your local agricultural officer or KVK before major farming decisions.',
    about_method_title: '🔢 Drought Risk Index Methodology',
    about_method_desc: 'The composite drought index (0–100) is calculated as:',
    about_method_thresholds: 'Thresholds: 0–25 = Low · 25–50 = Moderate · 50–75 = Severe · 75+ = Extreme',
    about_citations_title: '📚 Data Sources & Citations',
    cite_cgwb_title: '🏛️ CGWB Annual Reports',
    cite_cgwb_desc: 'Central Ground Water Board Annual Reports 2007–2020. Used for well depletion statistics, groundwater stress classifications.',
    cite_jhrs_title: '📖 Journal of Hydrology Regional Studies',
    cite_jhrs_desc: 'Volume 4, 2015. Groundwater recharge movement analysis comparing pre/post SPSJSY impact in Saurashtra-Kachchh.',
    cite_iwp_title: '🌊 India Water Portal',
    cite_iwp_desc: 'indiawaterportal.org — Saurashtra rainfall statistics, drought chronology, rainwater harvesting movement documentation.',
    cite_openmeteo_title: '☁️ Open-Meteo API',
    cite_openmeteo_desc: 'Free, no-key weather API. Used for live current weather, temperature, humidity, and precipitation for each district headquarters.',
    cite_wasmo_title: '🌾 Gujarat WASMO',
    cite_wasmo_desc: 'Water and Sanitation Management Organisation, Gujarat. SPSJSY check dam statistics, farm pond data, water structure inventory.',
    cite_dataset_title: '📊 Illustrative Dataset',
    cite_dataset_desc: 'All groundwater depth and rainfall figures displayed in charts are illustrative datasets seeded from the above published sources. Last updated: Jan 2024.',
    about_tech_title: '🛠️ Technology Stack',
    about_tech_nokey: 'No paid API keys required',
    about_tech_engine: 'Rule-based AI advisory engine',
    about_tech_dataset: 'Single-file JSON dataset (swappable)',
    about_tech_llm_note: '💡 LLM Integration Note: The advisory page uses a deterministic rule-based engine. To upgrade to LLM-generated natural language: in js/app.js, replace the generateAdvisory() output with an API call to any OpenAI-compatible endpoint, passing the district/crop/risk parameters as context. The JSON data structure is designed to be swapped for a live CGWB API feed without UI changes.',
  },

  gu: {
    // Nav
    nav_home: '🏠 હોમ', nav_dashboard: '📊 ડૅશબોર્ડ', nav_map: '🗺️ જોખમ નકશો',
    nav_trends: '📈 ભૂગર્ભ જળ ટ્રેન્ડ', nav_advisory: '🤖 AI સલાહ',
    nav_resources: '🌾 ખેડૂત સંસાધનો', nav_about: 'ℹ️ વિષે',
    nav_dashboard_short: 'લાઇવ ડૅશબોર્ડ', nav_map_short: 'જિલ્લો જોખમ નકશો',
    nav_trends_short: 'ભૂ.જ. ટ્રેન્ડ', nav_advisory_short: 'AI સલાહ',
    nav_resources_short: 'ખેડૂત સંસાધનો', nav_about_short: 'વિષે અને ડેટા સ્ત્રોત',
    // Hero
    hero_badge: 'ગુજરાત · સૌરાષ્ટ્ર પ્રદેશ · ૧૧ જિલ્લા',
    hero_title: 'સૌરાષ્ટ્ર માટે બુદ્ધિશાળી દુષ્કાળ અને ભૂગર્ભ જળ સલાહકાર',
    hero_desc: 'ખેડૂતો, નગરપાલિકાઓ અને જળ સત્તામંડળોને વાસ્તવિક સમય દુષ્કાળ જોખમ દેખરેખ, ઐતિહાસિક ભૂગર્ભ જળ ટ્રેન્ડ વિશ્લેષણ અને AI-સંચાલિત ક્રિયાપ્રવૃત્ત સલાહ સાથે સક્ષમ બનાવો.',
    cta_dashboard: '📊 લાઇવ ડૅશબોર્ડ', cta_map: '🗺️ જિલ્લો જોખમ નકશો', cta_advisory: '🤖 AI સલાહ મેળવો',
    // Counters
    counter_districts: 'સૌરાષ્ટ્ર જિલ્લા', counter_wells: 'નિહારાયેલ કૂવા',
    counter_gw: 'ભૂગર્ભ જળ પર સિંચાઈ ભૂમિ', counter_storage: 'MCM વધારાનો સંગ્રહ (SPSJSY)',
    // Home sections
    crisis_eyebrow: 'એક ઝલક: સંકટ',
    crisis_title: 'સૌરાષ્ટ્રના જળ ભવિષ્ય પર ધ્યાન આપવું શા માટે જરૂરી છે',
    crisis_desc: 'કોઈ બારમાસી નદી નહીં, કઠોર-ખડક બેસાલ્ટ જળભૃત અને ~40% વરસાદ ચલ — ભારતના સૌથી વધુ દુષ્કાળ-સંભવ ઝોન પૈકીનો એક.',
    timeline_eyebrow: 'ઐતિહાસિક સંદર્ભ',
    timeline_title: 'સંકટથી સંરક્ષણ સુધી: સૌરાષ્ટ્રની જળ યાત્રા',
    districts_eyebrow: 'જિલ્લો જોખમ સારાંશ', districts_title: 'એક નજરે ૧૧ જિલ્લા',
    features_eyebrow: 'પ્લૅટફૉર્મ સુવિધાઓ', features_title: 'નિહારો અને પ્રક્રિયા કરો',
    feat_dash_title: 'લાઇવ ડૅશબોર્ડ', feat_dash_desc: 'Open-Meteo API દ્વારા વાસ્તવિક સમય હવામાન, દુષ્કાળ જોખમ સૂચકાંક, ભૂગર્ભ જળ ઘટાડા ચાર્ટ.',
    feat_map_title: 'ઇન્ટરેક્ટિવ જોખમ નકશો', feat_map_desc: 'CGWB ભૂગર્ભ જળ તાણ વર્ગ અનુસાર રંગ-સંકેત SVG ક્લિક કરી શકાય તેવો નકશો.',
    feat_trends_title: 'ભૂગર્ભ જળ ટ્રેન્ડ', feat_trends_desc: '15-વર્ષ ઐતિહાસિક ડેટાસૅટ, વરસાદ-ભૂ.જ. સહ-સંબંધ, CSV નિકાસ.',
    feat_adv_title: 'AI સલાહ એન્જિન', feat_adv_desc: 'તમારો જિલ્લો, પાક અને ભૂમિ-કદ પસંદ કરો — સિંચાઈ સૂચિ, જળ-સ્ત્રોત ભલામણ અને 90-દિવસ દુષ્કાળ પૂર્વ-અનુમાન મેળવો.',
    feat_res_title: 'ખેડૂત સંસાધનો', feat_res_desc: 'પાણી બચાવ તકનીક, સરકારી યોજના લિંક (PMKSY, જળ શક્તિ), KVK સ્ત્રોત.',
    feat_about_title: 'ડેટા અને પ્રણાલી', feat_about_desc: 'CGWB, IMD, Open-Meteo ડેટા સ્ત્રોત, જોખમ સૂચકાંક પ્રણાલી, ઉદ્ધૃત, અસ્વીકૃતિ.',
    // Footer
    footer_brand_desc: 'સૌરાષ્ટ્ર, ગુજરાત, ભારત માટે બુદ્ધિશાળી દુષ્કાળ અને ભૂગર્ભ જળ ઘટાડા સલાહકાર.',
    footer_platform: 'પ્લૅટફૉર્મ', footer_resources: 'સ્ત્રોત', footer_data_sources: 'ડેટા સ્ત્રોત',
    // Dashboard
    dash_title: 'જિલ્લો જળ ઇન્ટેલિજન્સ કેન્દ્ર',
    dash_subtitle: 'સૌરાષ્ટ્રના ૧૧ જિલ્લા માટે વાસ્તવિક સમય હવામાન + ઐતિહાસિક ભૂગર્ભ જળ વિશ્લેષણ',
    label_select_district: 'જિલ્લો પસંદ કરો:',
    stat_rainfall: 'તાજો વાર્ષિક વરસાદ', stat_rainfall_sub: '500mm સરેરાશ સામે',
    stat_gw_depth: 'ભૂગર્ભ જળ ઊંડાઈ', stat_gw_depth_sub: 'ધરાતળ નીચે મીટर',
    stat_wells: 'ઘટાડો ધરાવતા કૂવા', stat_risk: 'દુષ્કાળ જોખમ સૂચકાંક',
    stat_reservoir: 'ભંડાર / ચેક ડૅમ ભરાવ અનુ.',
    chart_rainfall_title: 'વાર્ષિક વરસાદ ટ્રેન્ડ',
    chart_gauge_title: 'દુષ્કાળ જોખમ ગૉજ', chart_gauge_sub: 'સંયુક્ત સૂચકાંક (0–100)',
    chart_depletion_title: 'જિલ્લાવાર ભૂગર્ભ જળ ઘટાડ (%)',
    chart_depletion_sub: '% નિહારાયેલ કૂવા ઘટાડ દર્શાવે · ૧૧ સૌ. જિ.',
    chart_forecast_title: '7-દિવસ વરસાદ & તાપ-માન પૂર્વ-અનુમાન',
    // Map
    map_title: 'જિલ્લો ભૂગર્ભ જળ જોખમ નકશો',
    map_subtitle: 'વિગત અને સલાહ માટે ગમે તે જિલ્લો ક્લિક કરો',
    map_legend_title: 'ભૂગર્ભ જળ તાણ વર્ગ (CGWB)',
    table_title: 'તમામ જિલ્લા — સૉર્ટ કરી શકાય',
    table_subtitle: 'સૉર્ટ કરવા કૉલમ હૅડર ક્લિક કરો · વિગત માટે પંક્તિ ક્લિક કરો',
    // Trends
    trends_title: 'ભૂગર્ભ જળ ટ્રેન્ડ વિશ્લેષણ',
    trends_subtitle: 'ઐતિહાસિક આધારભૂત વિશ્લેષણ · વરસાદ-ભૂ.જ. સહ-સંબંધ · પૂર્વ/પશ્ચ સંરક્ષણ સરખામણી',
    trends_analyse: 'જિલ્લો વિશ્લેષો:',
    tab_regional: 'ક્ષેત્રીય વરસાદ', tab_gwdepth: 'ભૂ.જ. ઊંડાઈ ટ્રેન્ડ',
    tab_recharge: 'સંરક્ષણ અસર', tab_correlation: 'વરસાદ-ભૂ.જ. સહ-સંબંધ',
    // Advisory
    adv_title: 'AI-સંચાલિત જળ સલાહ',
    adv_subtitle: 'સિંચાઈ સૂચિ · જળ-સ્ત્રોત ભલામણ · 30/60/90-દિવસ દુષ્કાળ પૂર્વ-અનુમાન · પાક-વિશેષ માર્ગદર્શન',
    adv_form_title: 'સલાહ ઉત્પન્ન કરો',
    adv_form_desc: 'વ્યક્તિગત જળ વ્યવસ્થાપન સલાહ મેળવવા ખેડૂત વિગત દાખલ કરો.',
    adv_label_district: 'તમારો જિલ્લો', adv_label_crop: 'મુખ્ય પાક', adv_label_land: 'ભૂમિ કદ (હૅક.)',
    adv_engine_note: '💡 નિયમ-આધારિત એન્જિન દ્વારા ઉત્પન્ન: વર્તમાન ઘટાડો, ભૂ.જ. ઊંડાઈ, CGWB તાણ વર્ગ, પ્રાદેશિક જળ-જ્ઞાન — ઑફ-લાઇન ઑપ.',
    adv_btn_generate: '🤖 સલાહ ઉત્પન્ન કરો',
    adv_quick_select: 'ઝડપી જિલ્લો પસંદ',
    adv_output_title: 'સલાહ પરિણામ',
    adv_placeholder_title: 'તમારી સલાહ અહીં દેખાશે',
    adv_placeholder_desc: 'તમારો જિલ્લો, પ્રાથમિક પાક અને ભૂમિ-કદ પસંદ કરો, "સલાહ ઉત્પન્ન કરો" ક્લિક કરો.',
    // Resources
    res_title: 'ખેડૂત સંસાધનો',
    res_subtitle: 'પાણી બચાવ તકનીક · સરકારી યોજનાઓ · KVK સ્ત્રોત · શ્રેષ્ઠ પ્રણાલી',
    res_irr_eyebrow: 'સિંચાઈ તકનીક', res_irr_title: 'પાણી-બચત સિંચાઈ પદ્ધતિઓ',
    res_drip_title: 'ટપક સિંચાઈ (ડ્રિપ ઇરિગેશન)',
    res_drip_desc: 'પાણી સીધું મૂળ ઝોન સુધી પહોંચાડે છે, પૂર સિંચાઈ કરતાં 35–50% ઓછો વપરાશ. મગફળી, કપાસ, શાકભાજી માટે આદર્શ.',
    res_sprinkler_title: 'છંટકાવ સિંચાઈ (સ્પ્રિંકલર)',
    res_sprinkler_desc: 'સમાન પાણી વિતરણ માટે વરસાદ જેવી અસર. 20–30% પાણી બચત. ઘઉં, બાજરી, જુવાર અને ઢળાવ ભૂમિ પાક માટે શ્રેષ્ઠ.',
    res_mulch_title: 'આવરણ (Mulching)',
    res_mulch_desc: 'પાક અવશેષ અથવા પ્લાસ્ટિકથી જમીન ઢાંકવાથી 30–40% બાષ્પીભવન ઘટે, ઘાસ ઓછું ઊગે, સિંચાઈ વચ્ચે ભૂ-ઊ ઘટતી નથી.',
    res_laser_title: 'લેઝર ભૂ-સ્તરીકરણ',
    res_laser_desc: 'GPS/લેઝર ટેકનોલૉજીથી ચોક્કસ ભૂ-સ્તરીકરણ, 20–30% સિંચાઈ-કાર્ય-ક્ષમ સ્ત.',
    res_drought_var_title: 'દુષ્કાળ-સહનશીલ જાત',
    res_drought_var_desc: 'GG-20, TAG-24 (મગફળી); NH-615 (ઘઉં); GHB-732 (બાજરી) — SAU જૂનાગઢ ભ.',
    res_pond_title: 'ખેત તળાવ (ખેત તળાવડી)',
    res_pond_desc: 'ખેત-તળાવ (20×20×3m) ચોમાસાનું જળ સંગ્રહ. PMKSY 50% સહાય ઉ.',
    res_schemes_eyebrow: 'સરકારી યોજનાઓ', res_schemes_title: 'મુખ્ય જળ અને કૃષિ યોજનાઓ',
    res_pmksy_desc: "ભારત-પ્રધાન-સિંચાઈ-યોજના — 55% સહાય ટ./છ. સિ., ખ.ત., વૉટ-ડ.",
    res_kvk_eyebrow: 'સ્ત્રોત અને સહાય', res_kvk_title: 'કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) — સૌ.',
    // About
    about_title: 'વિષે અને ડેટા સ્ત્રોત',
    about_subtitle: 'પ્રણાલી, ડેટા ઉદ્ભવ, ઉદ્ધૃત અને પ્લૅટફૉર્મ અસ્વીકૃતિ',
    about_purpose_desc: 'જળ સહાયક એ એક સંશોધન અને સલાહ સાધન છે જે સૌરાષ્ટ્ર, ગુજરાતના ખેડૂતો, સ્થાનિક સ્વરાજ્ય સંસ્થાઓ અને જળ સત્તામંડળોને દુષ્કાળ જોખમ અને ભૂગર્ભ જળ ઘટાડો સમજવામાં મદદ કરવા ડિઝાઇન થયેલ છે. તે સાર્વજનિક સંશોધન ડેટા, લાઇવ હવામાન API અને નિયમ-આધારિત વિશ્લેષણ એકત્ર કરીને ક્રિયાપ્રવૃત્ત જળ વ્યવસ્થાપન માર્ગદર્શન પૂરું પાડે છે.',
    about_disclaimer: 'આ માત્ર સલાહ સાધન છે. તે સત્તાવાર CGWB, IMD અથવા રાજ્ય સરકારના ડેટાનો વિકલ્પ નથી. કોઈ પણ મોટા ખેતી નિર્ણય પહેલા તમારા સ્થાનિક કૃષિ અધિકારી અથવા KVK ની સલાહ લો.',
    about_purpose_title: '🎯 પ્લૅટફૉર્મ હેતુ',
    about_method_title: '🔢 દુષ્કાળ જોખમ સૂચકાંક પ્રણાલી',
    about_method_desc: 'સંયુક્ત દુષ્કાળ સૂચકાંક (0–100) આ રીતે ગણવામાં આવે છે:',
    about_method_thresholds: 'મર્યાદા: 0–25 = ઓછો · 25–50 = મધ્યમ · 50–75 = ગંભીર · 75+ = અત્યંત',
    about_citations_title: '📚 ડેટા સ્ત્રોત અને ઉદ્ધૃત',
    cite_cgwb_title: '🏛️ CGWB વાર્ષિક અહેવાલ',
    cite_cgwb_desc: 'કેન્દ્રીય ભૂ-જળ બૉર્ડ વાર્ષિક અહેવાલ 2007–2020. કૂવા ઘટાડા આંકડા અને ભૂ-જળ તાણ વર્ગ માટે ઉપયોગ.',
    cite_jhrs_title: '📖 જર્નલ ઑફ હાઇડ્રૉલૉજી રિજ્યૉનલ સ્ટડીઝ',
    cite_jhrs_desc: 'ભાગ 4, 2015. SPSJSY પૂર્વ/પશ્ચ સૌરાષ્ટ્ર-કચ્છ ભૂ-જળ પુનઃભરણ ચળવળ વિશ્લેષણ.',
    cite_iwp_title: '🌊 ઇન્ડિયા વૉટર પૉર્ટલ',
    cite_iwp_desc: 'indiawaterportal.org — સૌરાષ્ટ્ર વરસાદ આંકડા, દુષ્કાળ ઇતિહાસ, વરસાદ સંગ્રહ ચળવળ દસ્તાવેજ.',
    cite_openmeteo_title: '☁️ Open-Meteo API',
    cite_openmeteo_desc: 'મફત, કી-મુક્ત હવામાન API. દરેક જિલ્લા મથક માટે વાસ્તવિક સમય હવામાન, તાપ-માન, ભેજ અને વરસાદ માટે ઉપયોગ.',
    cite_wasmo_title: '🌾 ગુજરાત WASMO',
    cite_wasmo_desc: 'જળ અને સ્વચ્છતા વ્યવસ્થાપન સંગઠન, ગુજરાત. SPSJSY ચેક-ડૅમ આંકડા, ખેત-તળાવ ડેટા, જળ-માળખા સૂચિ.',
    cite_dataset_title: '📊 દૃષ્ટાંત ડેટાસૅટ',
    cite_dataset_desc: 'ચાર્ટમાં દર્શાવેલ ભૂ-જળ ઊંડાઈ અને વરસાદ આંકડા ઉપરોક્ત પ્રકાશિત સ્ત્રોતોમાંથી બીજ-ગ્રહ કરેલ દૃષ્ટાંત ડેટા છે. છેલ્લો અপડૅટ: જાન્યુ. 2024.',
    about_tech_title: '🛠️ ટૅકનૉલૉજી સ્ટૅક',
    about_tech_nokey: 'કોઈ પૅઇડ API કી જરૂરી નથી',
    about_tech_engine: 'નિયમ-આધારિત AI સલાહ એન્જિન',
    about_tech_dataset: 'સિંગલ-ફાઇલ JSON ડેટાસૅટ (બદલાવ-યોગ્ય)',
    about_tech_llm_note: '💡 LLM ઇન્ટિગ્રેશન નૉટ: સલાહ પૃષ્ઠ નિર્ણાયક નિયમ-આધારિત એન્જિન વાપરે છે. LLM-ઉત્પન્ન ભાષામાં અપગ્રેડ કરવા: js/app.js માં generateAdvisory() આઉટપૂટ ને OpenAI-સૉ.API કૉલ સાથે બ.ક., જિ./પ./જ.પ. ઇ. સ. પ.ક. JSON ડ.સ. CGWB API ફીડ માટે UI ફ.ઇ. ઘ.ઇ.',
  },

  hi: {
    // Nav
    nav_home: '🏠 होम', nav_dashboard: '📊 डैशबोर्ड', nav_map: '🗺️ जोखिम मानचित्र',
    nav_trends: '📈 भूजल ट्रेंड', nav_advisory: '🤖 AI सलाह',
    nav_resources: '🌾 किसान संसाधन', nav_about: 'ℹ️ परिचय',
    nav_dashboard_short: 'लाइव डैशबोर्ड', nav_map_short: 'जिला जोखिम मानचित्र',
    nav_trends_short: 'भूजल ट्रेंड', nav_advisory_short: 'AI सलाह',
    nav_resources_short: 'किसान संसाधन', nav_about_short: 'परिचय और डेटा स्रोत',
    // Hero
    hero_badge: 'गुजरात · सौराष्ट्र क्षेत्र · 11 जिले',
    hero_title: 'सौराष्ट्र के लिए बुद्धिमान सूखा और भूजल सलाहकार',
    hero_desc: 'किसानों, नगर निकायों और जल प्राधिकरणों को वास्तविक समय सूखा जोखिम निगरानी, ऐतिहासिक भूजल ट्रेंड विश्लेषण और AI-संचालित कार्रवाई योग्य सलाह के साथ सशक्त बनाएं।',
    cta_dashboard: '📊 लाइव डैशबोर्ड', cta_map: '🗺️ जिला जोखिम मानचित्र', cta_advisory: '🤖 AI सलाह लें',
    // Counters
    counter_districts: 'सौराष्ट्र जिले', counter_wells: 'निगरानी किए गए कुएँ',
    counter_gw: 'भूजल पर सिंचाई भूमि', counter_storage: 'MCM अतिरिक्त भंडारण (SPSJSY)',
    // Home sections
    crisis_eyebrow: 'एक नज़र में संकट',
    crisis_title: 'सौराष्ट्र के जल भविष्य पर ध्यान देना क्यों जरूरी है',
    crisis_desc: 'कोई बारहमासी नदी नहीं, कठोर-चट्टान बेसाल्ट जलभृत और ~40% वर्षा परिवर्तनशीलता — भारत के सबसे अधिक सूखा-प्रवण क्षेत्रों में से एक।',
    timeline_eyebrow: 'ऐतिहासिक संदर्भ',
    timeline_title: 'संकट से संरक्षण तक: सौराष्ट्र की जल यात्रा',
    districts_eyebrow: 'जिला जोखिम सारांश', districts_title: 'एक नज़र में 11 जिले',
    features_eyebrow: 'प्लेटफॉर्म सुविधाएं', features_title: 'निगरानी और कार्रवाई के लिए सब कुछ',
    feat_dash_title: 'लाइव डैशबोर्ड', feat_dash_desc: 'Open-Meteo API के माध्यम से रियल-टाइम मौसम, सूखा जोखिम सूचकांक, भूजल कमी चार्ट।',
    feat_map_title: 'इंटरेक्टिव जोखिम मानचित्र', feat_map_desc: 'CGWB भूजल तनाव श्रेणियों के अनुसार रंग-कोडित 11 जिलों का SVG क्लिक करने योग्य मानचित्र।',
    feat_trends_title: 'भूजल ट्रेंड', feat_trends_desc: '15-वर्ष ऐतिहासिक डेटासेट, वर्षा-भूजल सहसंबंध, CSV निर्यात।',
    feat_adv_title: 'AI सलाह इंजन', feat_adv_desc: 'अपना जिला, फसल और भूमि आकार चुनें — सिंचाई अनुसूची, जल संरचना अनुशंसाएं और 90-दिन सूखा पूर्वानुमान पाएं।',
    feat_res_title: 'किसान संसाधन', feat_res_desc: 'जल बचत तकनीक, सरकारी योजना लिंक (PMKSY, जल शक्ति), KVK संपर्क।',
    feat_about_title: 'डेटा और पद्धति', feat_about_desc: 'CGWB, IMD, Open-Meteo डेटा स्रोत, जोखिम सूचकांक पद्धति, उद्धरण, अस्वीकरण।',
    // Footer
    footer_brand_desc: 'सौराष्ट्र, गुजरात, भारत के लिए बुद्धिमान सूखा और भूजल कमी सलाहकार।',
    footer_platform: 'प्लेटफॉर्म', footer_resources: 'संसाधन', footer_data_sources: 'डेटा स्रोत',
    // Dashboard
    dash_title: 'जिला जल इंटेलिजेंस केंद्र',
    dash_subtitle: 'सौराष्ट्र के 11 जिलों के लिए रियल-टाइम मौसम + ऐतिहासिक भूजल विश्लेषण',
    label_select_district: 'जिला चुनें:',
    stat_rainfall: 'नवीनतम वार्षिक वर्षा', stat_rainfall_sub: '500mm औसत के सापेक्ष',
    stat_gw_depth: 'भूजल गहराई', stat_gw_depth_sub: 'जमीन से मीटर नीचे',
    stat_wells: 'कमी वाले कुएँ', stat_risk: 'सूखा जोखिम सूचकांक',
    stat_reservoir: 'जलाशय / चेक डैम भराव अनु.',
    chart_rainfall_title: 'वार्षिक वर्षा ट्रेंड',
    chart_gauge_title: 'सूखा जोखिम गेज', chart_gauge_sub: 'मिश्रित सूचकांक (0–100)',
    chart_depletion_title: 'जिलेवार भूजल कमी (%)',
    chart_depletion_sub: '% निगरानी कुएँ कमी दर्शाते हैं · सौ. के 11 जिले',
    chart_forecast_title: '7-दिन वर्षा और तापमान पूर्वानुमान',
    // Map
    map_title: 'जिला भूजल जोखिम मानचित्र',
    map_subtitle: 'विस्तृत जानकारी के लिए किसी भी जिले पर क्लिक करें',
    map_legend_title: 'भूजल तनाव वर्गीकरण (CGWB)',
    table_title: 'सभी जिले — सॉर्ट करें',
    table_subtitle: 'सॉर्ट के लिए कॉलम हेडर क्लिक करें · विवरण के लिए पंक्ति क्लिक करें',
    // Trends
    trends_title: 'भूजल ट्रेंड विश्लेषण',
    trends_subtitle: 'ऐतिहासिक बहु-वर्षीय विश्लेषण · वर्षा-भूजल सहसंबंध · पूर्व/पश्च संरक्षण तुलना',
    trends_analyse: 'जिला विश्लेषण:',
    tab_regional: 'क्षेत्रीय वर्षा', tab_gwdepth: 'भूजल गहराई ट्रेंड',
    tab_recharge: 'संरक्षण प्रभाव', tab_correlation: 'वर्षा-भूजल सहसंबंध',
    // Advisory
    adv_title: 'AI-संचालित जल सलाह',
    adv_subtitle: 'सिंचाई अनुसूची · जल संरचना अनुशंसाएं · 30/60/90-दिन सूखा पूर्वानुमान · फसल-विशिष्ट मार्गदर्शन',
    adv_form_title: 'सलाह उत्पन्न करें',
    adv_form_desc: 'व्यक्तिगत जल प्रबंधन सलाह के लिए अपने खेत का विवरण दर्ज करें।',
    adv_label_district: 'आपका जिला', adv_label_crop: 'मुख्य फसल', adv_label_land: 'भूमि आकार (हेक्टेयर)',
    adv_engine_note: '💡 सलाह एक <strong>नियम-आधारित इंजन</strong> द्वारा उत्पन्न: वर्षा कमी, भूजल गहराई, CGWB तनाव वर्ग, फसल जल आवश्यकता। पूरी तरह ऑफलाइन — कोई भुगतान API की आवश्यकता नहीं।',
    adv_btn_generate: '🤖 सलाह उत्पन्न करें',
    adv_quick_select: 'त्वरित जिला चुनें',
    adv_output_title: 'सलाह परिणाम',
    adv_placeholder_title: 'आपकी सलाह यहाँ दिखेगी',
    adv_placeholder_desc: 'अपना जिला, फसल प्रकार और भूमि आकार चुनें, फिर <strong>"सलाह उत्पन्न करें"</strong> पर क्लिक करें।',
    // Resources
    res_title: 'किसान संसाधन',
    res_subtitle: 'जल बचत तकनीक · सरकारी योजनाएं · KVK संपर्क · सर्वोत्तम अभ्यास',
    res_irr_eyebrow: 'सिंचाई तकनीक', res_irr_title: 'जल-बचत सिंचाई विधियाँ',
    res_drip_title: 'ड्रिप सिंचाई (टपक सिंचाई)',
    res_drip_desc: 'जड़ क्षेत्र में सीधे पानी देता है, बाढ़ सिंचाई की तुलना में 35–50% खपत कम करता है। मूंगफली, कपास, सब्जियों के लिए आदर्श।',
    res_sprinkler_title: 'स्प्रिंकलर सिंचाई (छंटकाव)',
    res_sprinkler_desc: 'समान जल वितरण के लिए वर्षा का अनुकरण। 20–30% पानी बचाता है। गेहूं, बाजरा, जोवार के लिए सर्वोत्तम।',
    res_mulch_title: 'मल्चिंग (आवरण)',
    res_mulch_desc: 'फसल अवशेष या प्लास्टिक से मिट्टी ढकने से 30–40% वाष्पीकरण कम होता है, खरपतवार दबता है।',
    res_laser_title: 'लेज़र भूमि समतलन',
    res_laser_desc: 'GPS/लेज़र तकनीक से सटीक भूमि समतलन, 20–30% सिंचाई दक्षता सुधारता है।',
    res_drought_var_title: 'सूखा-प्रतिरोधी किस्में',
    res_drought_var_desc: 'GG-20, TAG-24 (मूंगफली); NH-615 (गेहूं); GHB-732 (बाजरा) — SAU जूनागढ़ द्वारा अनुशंसित।',
    res_pond_title: 'खेत तालाब निर्माण (खेत तलावड़ी)',
    res_pond_desc: 'खेत तालाब (20×20×3m) अपवाह जल संचय करते हैं। PMKSY के तहत 50% सब्सिडी उपलब्ध।',
    res_schemes_eyebrow: 'सरकारी योजनाएं', res_schemes_title: 'प्रमुख जल एवं कृषि योजनाएं',
    res_pmksy_desc: "भारत की प्रमुख सिंचाई योजना — 55% सब्सिडी, ड्रिप/स्प्रिंकलर, खेत तालाब, वाटरशेड विकास।",
    res_kvk_eyebrow: 'संपर्क और सहायता', res_kvk_title: 'कृषि विज्ञान केंद्र (KVK) संपर्क — सौराष्ट्र',
    // About
    about_title: 'परिचय और डेटा स्रोत',
    about_subtitle: 'पद्धति, डेटा उद्गम, उद्धरण और प्लेटफॉर्म अस्वीकरण',
    about_purpose_desc: 'जल सहायक एक शोध और सलाह उपकरण है जो सौराष्ट्र, गुजरात के किसानों, स्थानीय निकायों और जल अधिकारियों को सूखा जोखिम और भूजल कमी समझने में मदद करता है।',
    about_disclaimer: 'यह केवल एक सलाह उपकरण है। यह आधिकारिक CGWB, IMD या राज्य सरकार के डेटा का विकल्प नहीं है। कोई भी बड़ा कृषि निर्णय लेने से पहले अपने स्थानीय कृषि अधिकारी या KVK से परामर्श करें।',
    about_purpose_title: '🎯 प्लेटफॉर्म उद्देश्य',
    about_method_title: '🔢 सूखा जोखिम सूचकांक पद्धति',
    about_method_desc: 'संयुक्त सूखा सूचकांक (0–100) इस प्रकार गणना की जाती है:',
    about_method_thresholds: 'सीमाएं: 0–25 = कम · 25–50 = मध्यम · 50–75 = गंभीर · 75+ = अत्यंत',
    about_citations_title: '📚 डेटा स्रोत और उद्धरण',
    cite_cgwb_title: '🏛️ CGWB वार्षिक रिपोर्ट',
    cite_cgwb_desc: 'केंद्रीय भूजल बोर्ड वार्षिक रिपोर्ट 2007–2020। कूप क्षरण आंकड़े और भूजल तनाव वर्गीकरण के लिए उपयोग।',
    cite_jhrs_title: '📖 जर्नल ऑफ हाइड्रोलॉजी रीजनल स्टडीज',
    cite_jhrs_desc: 'भाग 4, 2015। SPSJSY पूर्व/बाद सौराष्ट्र-कच्छ भूजल पुनर्भरण आंदोलन विश्लेषण।',
    cite_iwp_title: '🌊 इंडिया वाटर पोर्टल',
    cite_iwp_desc: 'indiawaterportal.org — सौराष्ट्र वर्षा आंकड़े, सूखा इतिहास, वर्षाजल संचयन आंदोलन दस्तावेज़।',
    cite_openmeteo_title: '☁️ Open-Meteo API',
    cite_openmeteo_desc: 'निःशुल्क, बिना-कुंजी मौसम API। प्रत्येक जिला मुख्यालय के लिए वास्तविक समय मौसम, तापमान, आर्द्रता और वर्षा के लिए उपयोग।',
    cite_wasmo_title: '🌾 गुजरात WASMO',
    cite_wasmo_desc: 'जल एवं स्वच्छता प्रबंधन संगठन, गुजरात। SPSJSY चेक-डैम आंकड़े, खेत तालाब डेटा, जल संरचना सूची।',
    cite_dataset_title: '📊 दृष्टांत डेटासेट',
    cite_dataset_desc: 'चार्ट में प्रदर्शित भूजल गहराई और वर्षा आंकड़े उपर्युक्त प्रकाशित स्रोतों से बीजित दृष्टांत डेटा हैं। अंतिम अपडेट: जन. 2024।',
    about_tech_title: '🛠️ टेक्नोलॉजी स्टैक',
    about_tech_nokey: 'कोई भुगतान-योग्य API कुंजी आवश्यक नहीं',
    about_tech_engine: 'नियम-आधारित AI सलाह इंजन',
    about_tech_dataset: 'सिंगल-फाइल JSON डेटासेट (बदलने योग्य)',
    about_tech_llm_note: '💡 LLM इंटीग्रेशन नोट: सलाह पृष्ठ निर्धारक नियम-आधारित इंजन का उपयोग करता है। LLM-जनित भाषा में अपग्रेड करने के लिए: js/app.js में generateAdvisory() आउटपुट को किसी OpenAI-संगत API कॉल से बदलें, जिला/फसल/जोखिम पैरामीटर संदर्भ के रूप में पास करें। JSON डेटा संरचना UI बदलाव के बिना लाइव CGWB API फीड के लिए डिज़ाइन की गई है।',
  },
};

// Apply a language across the entire UI
function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  App.currentLang = lang;
  localStorage.setItem('jalsahayak_lang', lang);

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      // Use innerHTML for keys that may contain <strong> etc.
      el.innerHTML = dict[key];
    }
  });

  // Sync all lang-toggle buttons everywhere on the page
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;
}

// ── Utility helpers ──────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showPage(id) {
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-links a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const navLink = $(`.nav-links a[data-page="${id}"]`);
  if (navLink) navLink.classList.add('active');
  // close mobile menu
  $('.nav-links')?.classList.remove('open');

  // lazy-init page content
  if (id === 'page-dashboard') initDashboard();
  if (id === 'page-map') initMap();
  if (id === 'page-trends') initTrends();
  if (id === 'page-advisory') {
    const distSel = document.getElementById('advisory-district');
    if (distSel && App.data) distSel.value = App.currentDistrict;
    $$('.district-select').forEach(s => { if (s.value !== App.currentDistrict && App.data && App.data.districts[App.currentDistrict]) s.value = App.currentDistrict; });
  }
}

function formatNum(n, decimals = 0) {
  return Number(n).toLocaleString('en-IN', { maximumFractionDigits: decimals });
}

function getRiskInfo(stress) {
  const map = {
    'Safe':          { cls: 'risk-safe',     label: 'Safe',          color: '#22c55e', level: 1 },
    'Semi-Critical': { cls: 'risk-semi',     label: 'Semi-Critical', color: '#eab308', level: 2 },
    'Critical':      { cls: 'risk-critical', label: 'Critical',      color: '#f97316', level: 3 },
    'Over-Exploited':{ cls: 'risk-over',     label: 'Over-Exploited',color: '#ef4444', level: 4 },
  };
  return map[stress] || map['Safe'];
}

function showToast(msg, type = 'info') {
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  const tc = document.getElementById('toast-container');
  if (!tc) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  tc.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function animateCounter(el, target, duration = 1800, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start).toLocaleString('en-IN') + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// ── Theme ────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  App.theme = theme;
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  // Re-draw all live charts with updated colors
  setTimeout(() => refreshChartColors(), 50);
}

// Returns chart axis/legend color based on current theme
function chartColor() {
  return App.theme === 'dark' ? '#94a3b8' : '#64748b';
}

function refreshChartColors() {
  const color = chartColor();
  Object.values(App.charts).forEach(chart => {
    if (!chart || !chart.options) return;
    try {
      if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = color;
      ['x','y','x1','y1'].forEach(axis => {
        if (chart.options.scales?.[axis]) {
          if (chart.options.scales[axis].ticks) chart.options.scales[axis].ticks.color = color;
          if (chart.options.scales[axis].title) chart.options.scales[axis].title.color = color;
        }
      });
      chart.update('none');
    } catch(e) {}
  });
}

// ── Load Data ────────────────────────────────────────────────
// ── Inline fallback data (used when fetch fails, e.g. file:// protocol) ──
const INLINE_DATA = {"_meta":{"description":"Illustrative historical dataset for Saurashtra region groundwater and rainfall trends.","sources":["CGWB Annual Reports 2007–2020","Journal of Hydrology Regional Studies Vol. 4, 2015","India Water Portal","Gujarat WASMO"],"last_updated":"2024-01","disclaimer":"This dataset is illustrative and seeded using published regional statistics."},"region_summary":{"irrigated_land_groundwater_pct":83,"average_annual_rainfall_mm":500,"rainfall_cv_pct":40,"groundwater_extraction_rate_pct":72,"irrigation_share_of_extraction_pct":80,"districts":11,"wells_monitored":1247,"check_dams_built":113738,"farm_ponds_built":240199,"bori_bandhs_built":55917,"additional_storage_mcm":808},"historic_droughts":[{"year":1985,"rainfall_mm":299,"severity":"Severe"},{"year":1986,"rainfall_mm":298,"severity":"Severe"},{"year":1987,"rainfall_mm":93,"severity":"Extreme"},{"year":2000,"rainfall_mm":187,"severity":"Severe"},{"year":2002,"rainfall_mm":242,"severity":"Severe"},{"year":2012,"rainfall_mm":318,"severity":"Moderate"},{"year":2018,"rainfall_mm":356,"severity":"Moderate"}],"districts":{"Rajkot":{"lat":22.3039,"lon":70.8022,"groundwater_stress":"Critical","stress_level":3,"color":"#f97316","area_sq_km":11203,"population":3804558,"major_crops":["Groundnut","Cotton","Wheat","Jowar"],"annual_rainfall":{"2008":456,"2009":612,"2010":503,"2011":489,"2012":318,"2013":541,"2014":478,"2015":521,"2016":467,"2017":598,"2018":356,"2019":487,"2020":623,"2021":511,"2022":498,"2023":534},"groundwater_depth_mbgl":{"2008":8.2,"2009":7.1,"2010":7.8,"2011":8.5,"2012":11.2,"2013":9.4,"2014":9.8,"2015":9.1,"2016":10.3,"2017":8.7,"2018":12.1,"2019":10.8,"2020":8.9,"2021":9.6,"2022":10.2,"2023":9.8},"depletion_pct":68,"description":"Rajkot, the largest city and administrative hub of Saurashtra, faces significant groundwater stress due to rapid urbanization and extensive agricultural extraction."},"Jamnagar":{"lat":22.4707,"lon":70.0577,"groundwater_stress":"Over-Exploited","stress_level":4,"color":"#ef4444","area_sq_km":14125,"population":2160119,"major_crops":["Groundnut","Cotton","Bajra","Garlic"],"annual_rainfall":{"2008":398,"2009":521,"2010":445,"2011":412,"2012":298,"2013":467,"2014":389,"2015":432,"2016":401,"2017":523,"2018":312,"2019":421,"2020":554,"2021":445,"2022":421,"2023":467},"groundwater_depth_mbgl":{"2008":9.8,"2009":8.4,"2010":9.2,"2011":10.1,"2012":13.7,"2013":11.2,"2014":11.8,"2015":10.9,"2016":12.4,"2017":10.2,"2018":14.8,"2019":12.7,"2020":10.5,"2021":11.4,"2022":12.1,"2023":11.7},"depletion_pct":78,"description":"Jamnagar district's coastal location offers limited natural freshwater recharge. Industrial demand from Reliance's refinery complex adds pressure to already stressed aquifers."},"Junagadh":{"lat":21.5222,"lon":70.4579,"groundwater_stress":"Semi-Critical","stress_level":2,"color":"#eab308","area_sq_km":8839,"population":2448427,"major_crops":["Groundnut","Mango","Banana","Kesar Mango"],"annual_rainfall":{"2008":612,"2009":734,"2010":678,"2011":645,"2012":421,"2013":689,"2014":598,"2015":632,"2016":589,"2017":712,"2018":487,"2019":634,"2020":756,"2021":645,"2022":612,"2023":667},"groundwater_depth_mbgl":{"2008":5.4,"2009":4.2,"2010":4.8,"2011":5.6,"2012":8.1,"2013":6.3,"2014":6.7,"2015":6.1,"2016":7.2,"2017":5.4,"2018":9.2,"2019":7.1,"2020":5.3,"2021":6.1,"2022":6.8,"2023":6.4},"depletion_pct":54,"description":"Junagadh benefits from higher rainfall due to the Girnar mountain range. Home to Gir Forest and known for Kesar mangoes, it has relatively better groundwater status."},"Bhavnagar":{"lat":21.7645,"lon":72.1519,"groundwater_stress":"Critical","stress_level":3,"color":"#f97316","area_sq_km":11155,"population":2877961,"major_crops":["Cotton","Groundnut","Sesame","Wheat"],"annual_rainfall":{"2008":478,"2009":589,"2010":534,"2011":502,"2012":334,"2013":556,"2014":489,"2015":523,"2016":476,"2017":601,"2018":367,"2019":498,"2020":634,"2021":523,"2022":501,"2023":534},"groundwater_depth_mbgl":{"2008":7.6,"2009":6.5,"2010":7.1,"2011":7.9,"2012":10.8,"2013":8.9,"2014":9.3,"2015":8.7,"2016":9.8,"2017":8.1,"2018":11.6,"2019":10.2,"2020":8.4,"2021":9.1,"2022":9.7,"2023":9.3},"depletion_pct":65,"description":"Bhavnagar has a major port and is known for shipbreaking at Alang. Agricultural groundwater demand is high for cotton and groundnut cultivation."},"Amreli":{"lat":21.6027,"lon":71.2218,"groundwater_stress":"Over-Exploited","stress_level":4,"color":"#ef4444","area_sq_km":6760,"population":1514190,"major_crops":["Groundnut","Cotton","Castor","Bajra"],"annual_rainfall":{"2008":423,"2009":534,"2010":478,"2011":445,"2012":289,"2013":501,"2014":434,"2015":467,"2016":423,"2017":545,"2018":312,"2019":443,"2020":578,"2021":467,"2022":445,"2023":478},"groundwater_depth_mbgl":{"2008":10.2,"2009":8.9,"2010":9.6,"2011":10.5,"2012":14.1,"2013":11.7,"2014":12.2,"2015":11.4,"2016":12.9,"2017":10.7,"2018":15.3,"2019":13.1,"2020":10.9,"2021":11.8,"2022":12.6,"2023":12.1},"depletion_pct":81,"description":"Amreli has among the highest groundwater depletion rates in Saurashtra, driven by intensive groundnut and cotton cultivation with heavy flood irrigation."},"Porbandar":{"lat":21.6440,"lon":69.6293,"groundwater_stress":"Semi-Critical","stress_level":2,"color":"#eab308","area_sq_km":2294,"population":586062,"major_crops":["Groundnut","Bajra","Vegetables","Coconut"],"annual_rainfall":{"2008":445,"2009":556,"2010":501,"2011":468,"2012":312,"2013":523,"2014":456,"2015":489,"2016":445,"2017":567,"2018":334,"2019":465,"2020":601,"2021":489,"2022":467,"2023":501},"groundwater_depth_mbgl":{"2008":6.8,"2009":5.7,"2010":6.3,"2011":7.1,"2012":9.6,"2013":7.8,"2014":8.2,"2015":7.6,"2016":8.7,"2017":7.0,"2018":10.4,"2019":8.9,"2020":7.1,"2021":7.8,"2022":8.4,"2023":8.0},"depletion_pct":59,"description":"Porbandar, birthplace of Mahatma Gandhi, is the smallest district of Saurashtra. Coastal saline intrusion is a growing threat to freshwater aquifers."},"Surendranagar":{"lat":22.7278,"lon":71.6490,"groundwater_stress":"Over-Exploited","stress_level":4,"color":"#ef4444","area_sq_km":10489,"population":1756268,"major_crops":["Cotton","Groundnut","Wheat","Castor"],"annual_rainfall":{"2008":367,"2009":478,"2010":423,"2011":389,"2012":256,"2013":445,"2014":378,"2015":412,"2016":367,"2017":489,"2018":278,"2019":389,"2020":523,"2021":412,"2022":389,"2023":423},"groundwater_depth_mbgl":{"2008":11.4,"2009":10.1,"2010":10.8,"2011":11.7,"2012":15.6,"2013":13.0,"2014":13.6,"2015":12.7,"2016":14.3,"2017":12.0,"2018":17.1,"2019":14.6,"2020":12.1,"2021":13.2,"2022":14.0,"2023":13.5},"depletion_pct":84,"description":"Surendranagar is one of the most water-stressed districts in Gujarat. Low rainfall combined with cotton cultivation creates severe groundwater pressure."},"Morbi":{"lat":22.8173,"lon":70.8378,"groundwater_stress":"Critical","stress_level":3,"color":"#f97316","area_sq_km":6009,"population":993347,"major_crops":["Groundnut","Bajra","Cotton","Sesame"],"annual_rainfall":{"2008":412,"2009":523,"2010":468,"2011":434,"2012":289,"2013":490,"2014":423,"2015":456,"2016":412,"2017":534,"2018":323,"2019":433,"2020":567,"2021":456,"2022":434,"2023":467},"groundwater_depth_mbgl":{"2008":8.9,"2009":7.6,"2010":8.3,"2011":9.2,"2012":12.3,"2013":10.4,"2014":10.9,"2015":10.2,"2016":11.5,"2017":9.5,"2018":13.2,"2019":11.5,"2020":9.6,"2021":10.4,"2022":11.0,"2023":10.6},"depletion_pct":70,"description":"Morbi is known for its ceramics industry and the Machhu river dam disaster of 1979. Industrial and agricultural water demand strains the district's groundwater."},"Gir Somnath":{"lat":20.9026,"lon":70.3721,"groundwater_stress":"Safe","stress_level":1,"color":"#22c55e","area_sq_km":3755,"population":1223161,"major_crops":["Groundnut","Mango","Coconut","Vegetables"],"annual_rainfall":{"2008":634,"2009":756,"2010":701,"2011":667,"2012":445,"2013":712,"2014":623,"2015":656,"2016":612,"2017":734,"2018":512,"2019":657,"2020":778,"2021":667,"2022":634,"2023":689},"groundwater_depth_mbgl":{"2008":4.1,"2009":3.2,"2010":3.7,"2011":4.4,"2012":6.8,"2013":5.1,"2014":5.5,"2015":4.9,"2016":5.9,"2017":4.3,"2018":7.6,"2019":5.8,"2020":4.2,"2021":4.9,"2022":5.4,"2023":5.0},"depletion_pct":41,"description":"Home to the Somnath temple and Gir Forest (last Asiatic lion habitat), this district benefits from relatively higher rainfall in the foothills of the Western Ghats."},"Botad":{"lat":22.1693,"lon":71.6672,"groundwater_stress":"Critical","stress_level":3,"color":"#f97316","area_sq_km":2822,"population":694405,"major_crops":["Cotton","Groundnut","Bajra","Wheat"],"annual_rainfall":{"2008":445,"2009":556,"2010":501,"2011":468,"2012":312,"2013":523,"2014":456,"2015":489,"2016":445,"2017":567,"2018":334,"2019":465,"2020":601,"2021":489,"2022":467,"2023":501},"groundwater_depth_mbgl":{"2008":8.6,"2009":7.4,"2010":8.0,"2011":8.8,"2012":11.9,"2013":10.0,"2014":10.5,"2015":9.8,"2016":11.1,"2017":9.2,"2018":12.7,"2019":11.1,"2020":9.2,"2021":10.0,"2022":10.7,"2023":10.2},"depletion_pct":67,"description":"Botad is one of the newer districts carved from Bhavnagar district in 2013. It faces moderate to critical groundwater stress with heavy cotton cultivation."},"Devbhoomi Dwarka":{"lat":22.2394,"lon":68.9685,"groundwater_stress":"Semi-Critical","stress_level":2,"color":"#eab308","area_sq_km":4359,"population":752484,"major_crops":["Groundnut","Bajra","Onion","Vegetables"],"annual_rainfall":{"2008":389,"2009":501,"2010":445,"2011":412,"2012":267,"2013":467,"2014":401,"2015":434,"2016":389,"2017":512,"2018":289,"2019":412,"2020":545,"2021":434,"2022":412,"2023":445},"groundwater_depth_mbgl":{"2008":7.2,"2009":6.1,"2010":6.7,"2011":7.5,"2012":10.1,"2013":8.3,"2014":8.7,"2015":8.1,"2016":9.2,"2017":7.5,"2018":10.9,"2019":9.4,"2020":7.6,"2021":8.3,"2022":8.9,"2023":8.5},"depletion_pct":62,"description":"Devbhoomi Dwarka houses the sacred Dwarkadhish temple. Coastal salinity intrusion threatens freshwater availability. Tourism adds pressure to municipal water systems."}},"recharge_movement_comparison":{"pre_movement":{"period":"1975–1984","avg_monsoon_recharge_mcm":142,"avg_annual_rainfall_mm":487,"note":"Before Saurashtra's rainwater harvesting movement, check dam construction was minimal"},"post_movement":{"period":"2004–2009","avg_monsoon_recharge_mcm":289,"avg_annual_rainfall_mm":534,"note":"After SPSJSY and mass check dam building, monsoon recharge approximately doubled"}},"crop_water_requirements":{"Groundnut":{"water_mm":500,"drought_sensitive_stage":"Pegging to pod filling","drip_saving_pct":35},"Cotton":{"water_mm":700,"drought_sensitive_stage":"Boll development","drip_saving_pct":40},"Wheat":{"water_mm":450,"drought_sensitive_stage":"Grain filling","drip_saving_pct":30},"Jowar":{"water_mm":350,"drought_sensitive_stage":"Boot to heading","drip_saving_pct":25},"Bajra":{"water_mm":300,"drought_sensitive_stage":"Earhead emergence","drip_saving_pct":20},"Mango":{"water_mm":600,"drought_sensitive_stage":"Flowering","drip_saving_pct":45},"Castor":{"water_mm":450,"drought_sensitive_stage":"Capsule filling","drip_saving_pct":30},"Sesame":{"water_mm":250,"drought_sensitive_stage":"Flowering to seed fill","drip_saving_pct":20},"Vegetables":{"water_mm":400,"drought_sensitive_stage":"Fruiting","drip_saving_pct":50}}};

async function loadData() {
  try {
    const r = await fetch('data/saurashtra_groundwater.json');
    App.data = await r.json();
  } catch {
    // Fallback to inline data when running via file:// protocol (no server)
    App.data = INLINE_DATA;
  }
}

// ── Weather API (Open-Meteo — free, no key) ──────────────────
async function fetchWeather(district) {
  if (App.weatherCache[district]) return App.weatherCache[district];
  const { lat, lon } = DISTRICT_COORDS[district];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m` +
    `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=7`;
  const r = await fetch(url);
  const d = await r.json();
  App.weatherCache[district] = d;
  return d;
}

// Weather code → emoji + description
function weatherCodeInfo(code) {
  if (code === 0) return { icon: '☀️', desc: 'Clear sky' };
  if (code <= 2)  return { icon: '⛅', desc: 'Partly cloudy' };
  if (code === 3) return { icon: '☁️', desc: 'Overcast' };
  if (code <= 49) return { icon: '🌫️', desc: 'Foggy' };
  if (code <= 59) return { icon: '🌦️', desc: 'Drizzle' };
  if (code <= 69) return { icon: '🌧️', desc: 'Rain' };
  if (code <= 79) return { icon: '❄️', desc: 'Snow' };
  if (code <= 82) return { icon: '🌧️', desc: 'Rain showers' };
  if (code <= 99) return { icon: '⛈️', desc: 'Thunderstorm' };
  return { icon: '🌡️', desc: 'Unknown' };
}

// ── Drought Risk Index calculation ──────────────────────────
function calcDroughtIndex(district, weatherData) {
  const d = App.data.districts[district];
  const years = Object.keys(d.annual_rainfall).sort();
  const recentYears = years.slice(-5);
  const avgRecent = recentYears.reduce((s, y) => s + d.annual_rainfall[y], 0) / recentYears.length;
  const longTermAvg = 500; // Saurashtra baseline
  const rainfallDeficit = Math.max(0, (longTermAvg - avgRecent) / longTermAvg * 100);

  const gw = d.groundwater_depth_mbgl;
  const gwYears = Object.keys(gw).sort();
  const latestGW = gw[gwYears.at(-1)];
  const baselineGW = gw[gwYears[0]];
  const gwDegradation = Math.max(0, (latestGW - baselineGW) / baselineGW * 100);

  const depletion = d.depletion_pct;
  const stressLevel = d.stress_level;

  // Weighted index 0–100
  let index = (rainfallDeficit * 0.35) + (gwDegradation * 0.25) + (depletion * 0.25) + (stressLevel * 5);
  index = Math.min(100, Math.max(0, index));

  let label, color, cls;
  if (index < 25)      { label = 'Low';      color = '#22c55e'; cls = 'risk-safe'; }
  else if (index < 50) { label = 'Moderate'; color = '#eab308'; cls = 'risk-semi'; }
  else if (index < 75) { label = 'Severe';   color = '#f97316'; cls = 'risk-critical'; }
  else                 { label = 'Extreme';  color = '#ef4444'; cls = 'risk-over'; }

  return { index: Math.round(index), label, color, cls, rainfallDeficit: Math.round(rainfallDeficit), gwDegradation: Math.round(gwDegradation) };
}

// ── Advisory Engine (Rule-based) ─────────────────────────────
function generateAdvisory(district, crop, landSize) {
  const d = App.data.districts[district];
  const cropData = App.data.crop_water_requirements[crop] || App.data.crop_water_requirements['Groundnut'];
  const droughtIdx = calcDroughtIndex(district, null);
  const years = Object.keys(d.annual_rainfall).sort();
  const lastYear = years.at(-1);
  const rainfall = d.annual_rainfall[lastYear];
  const rainfallDeficit = Math.round(Math.max(0, (500 - rainfall) / 500 * 100));
  const gwDepth = d.groundwater_depth_mbgl[lastYear];

  // Calculate water needed
  const totalWater = Math.round(cropData.water_mm * landSize);
  const dripSaving = Math.round(totalWater * (cropData.drip_saving_pct / 100));

  // Risk forecast (rule-based projection)
  const baseRisk = droughtIdx.index;
  const forecast30 = Math.min(100, baseRisk + (rainfallDeficit > 30 ? 8 : -5));
  const forecast60 = Math.min(100, forecast30 + (droughtIdx.index > 60 ? 10 : 0));
  const forecast90 = Math.min(100, forecast60 + (d.stress_level >= 3 ? 6 : -3));

  function riskLabel(v) {
    if (v < 25) return { label: 'Low', color: '#22c55e' };
    if (v < 50) return { label: 'Moderate', color: '#eab308' };
    if (v < 75) return { label: 'Severe', color: '#f97316' };
    return { label: 'Extreme', color: '#ef4444' };
  }

  // Irrigation schedule
  let irrigSchedule = '';
  if (droughtIdx.index >= 75) {
    irrigSchedule = `<strong>CRITICAL:</strong> Immediate switch to drip irrigation strongly recommended. 
    Irrigate only at dawn/dusk to minimize evaporation. Reduce irrigation frequency by 30% and 
    prioritize crop-critical stage (${cropData.drought_sensitive_stage}).`;
  } else if (droughtIdx.index >= 50) {
    irrigSchedule = `Reduce irrigation by 20–25%. Schedule irrigations every 
    ${crop === 'Cotton' ? '12–14' : '8–10'} days. Mulch to retain soil moisture. 
    Critical stage protection: ensure adequate moisture during <em>${cropData.drought_sensitive_stage}</em>.`;
  } else if (droughtIdx.index >= 25) {
    irrigSchedule = `Follow standard irrigation scheduling with 10–15% reduction from normal. 
    Monitor soil moisture at 15cm depth. Irrigate when moisture drops below 50% field capacity, 
    especially during ${cropData.drought_sensitive_stage}.`;
  } else {
    irrigSchedule = `Normal irrigation scheduling applies. Consider adopting drip/sprinkler 
    systems proactively to build resilience — typical water savings of ${cropData.drip_saving_pct}% 
    compared to flood irrigation.`;
  }

  // Recommended structures
  let structures = [];
  if (gwDepth > 12) structures.push('Deepening existing wells with prior CGWB approval');
  if (d.stress_level >= 3) structures.push('Farm pond construction (min. 20×20×3m recommended for ' + landSize + ' ha)');
  if (rainfallDeficit > 20) structures.push('Bori-bandh / nala bund to capture monsoon runoff');
  structures.push('Check dam (suitable for basalt aquifer recharge — upstream siting recommended)');
  structures.push('Rooftop rainwater harvesting for domestic use');
  if (landSize > 2) structures.push('Community water user association for collective check dam maintenance');

  // Conservation measures
  let conservation = [];
  conservation.push(`Switch to drip irrigation → save ~${dripSaving.toLocaleString('en-IN')} litres/season`);
  conservation.push('Mulching with crop residue reduces soil evaporation by 30–40%');
  conservation.push(`${crop} is most vulnerable at: ${cropData.drought_sensitive_stage} — ensure moisture then`);
  if (d.stress_level >= 3) conservation.push('Consider shifting to less water-intensive crop (Bajra/Jowar uses 40% less water than ' + crop + ')');
  conservation.push('Laser land levelling improves irrigation efficiency by 20–30%');

  return {
    district, crop, landSize, droughtIdx, rainfallDeficit, gwDepth,
    totalWater, dripSaving,
    irrigSchedule, structures, conservation,
    forecast: [
      { period: '30 Days', ...riskLabel(Math.round(forecast30)), value: Math.round(forecast30) },
      { period: '60 Days', ...riskLabel(Math.round(forecast60)), value: Math.round(forecast60) },
      { period: '90 Days', ...riskLabel(Math.round(forecast90)), value: Math.round(forecast90) },
    ]
  };
}

// ── Destroy a chart safely ───────────────────────────────────
function destroyChart(key) {
  if (App.charts[key]) { App.charts[key].destroy(); delete App.charts[key]; }
}

// ─────────────────────────────────────────────────────────────
// PAGE: LANDING
// ─────────────────────────────────────────────────────────────
function initLanding() {
  // Animate counters
  const counterEls = {
    'ctr-districts':    { val: 11,   suffix: '' },
    'ctr-wells':        { val: 1247, suffix: '' },
    'ctr-gw-dep':       { val: 83,   suffix: '%' },
    'ctr-storage':      { val: 808,  suffix: ' MCM' },
  };
  setTimeout(() => {
    Object.entries(counterEls).forEach(([id, { val, suffix }]) => {
      const el = document.getElementById(id);
      if (el) animateCounter(el, val, 1800, suffix);
    });
  }, 400);

  // Hero canvas cracked earth / water ripple animation
  initHeroCanvas();

  // Drought timeline
  renderDroughtTimeline();
}

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Water ripple effect
  const ripples = [];
  function addRipple() {
    ripples.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0, maxR: 80 + Math.random() * 120,
      opacity: 0.5, growing: true
    });
  }
  setInterval(addRipple, 1200);

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ripples.forEach((rp, i) => {
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 178, 216, ${rp.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      rp.r += 0.8;
      rp.opacity -= 0.008;
      if (rp.opacity <= 0) ripples.splice(i, 1);
    });
    requestAnimationFrame(drawFrame);
  }
  drawFrame();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function renderDroughtTimeline() {
  const el = document.getElementById('drought-timeline');
  if (!el || !App.data) return;
  const events = [
    { year: '1985–87', title: 'Consecutive 3-Year Drought', desc: 'Rainfall: 299mm, 298mm, 93mm — triggered Saurashtra\'s rainwater harvesting movement' },
    { year: '1988', title: 'Sardar Patel Sahkari Jal Sanchay Yojana', desc: 'Launch of SPSJSY — mass check dam and farm pond construction program across Gujarat' },
    { year: '2000–02', title: 'Severe Drought Years', desc: 'Rainfall deficit > 50% pushed groundwater tables to record lows in Amreli and Surendranagar' },
    { year: '2004–09', title: 'Post-Recharge Movement Impact', desc: 'Monsoon recharge doubled (142→289 MCM) vs. 1975–84 baseline. Over 5 lakh water structures built.' },
    { year: '2016', title: 'CGWB Assessment', desc: '59–60% of monitored wells show depletion. Gujarat extraction rate: 72% vs national 62% average.' },
    { year: '2023', title: 'Current Status', desc: '3 of 11 Saurashtra districts classified Over-Exploited; 4 Critical. Drip irrigation adoption at ~28%.' },
  ];
  el.innerHTML = events.map(e => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="tl-year">${e.year}</div>
      <div class="tl-title">${e.title}</div>
      <div class="tl-desc">${e.desc}</div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────────────────────
let dashboardInitialized = false;
let selectorsPopulated = false;

async function initDashboard() {
  if (!App.data) return;
  if (!dashboardInitialized) {
    dashboardInitialized = true;
  }
  populateDistrictSelectors();
  await updateDashboard(App.currentDistrict);
}

function populateDistrictSelectors() {
  if (!App.data) return;
  $$('.district-select').forEach(sel => {
    const districts = Object.keys(App.data.districts);
    sel.innerHTML = districts.map(d => `<option value="${d}">${d}</option>`).join('');
    sel.value = App.currentDistrict;
    if (!sel.dataset.listenerAttached) {
      sel.dataset.listenerAttached = '1';
      sel.addEventListener('change', (e) => {
        App.currentDistrict = e.target.value;
        $$('.district-select').forEach(s => s.value = App.currentDistrict);
        updateDashboard(App.currentDistrict);
      });
    }
  });
}

async function updateDashboard(district) {
  const d = App.data.districts[district];
  if (!d) return;

  // Update district info
  $$('.current-district-name').forEach(el => el.textContent = district);

  // Risk index
  const risk = calcDroughtIndex(district, null);
  const riskEl = document.getElementById('risk-index-val');
  if (riskEl) riskEl.textContent = risk.index;
  const riskLabelEl = document.getElementById('risk-label');
  if (riskLabelEl) {
    riskLabelEl.className = `risk-badge ${risk.cls}`;
    riskLabelEl.textContent = risk.label;
  }

  // Depletion
  const depEl = document.getElementById('gw-depletion-val');
  if (depEl) depEl.textContent = d.depletion_pct + '%';

  // GW depth
  const years = Object.keys(d.groundwater_depth_mbgl).sort();
  const gwDepth = d.groundwater_depth_mbgl[years.at(-1)];
  const gwEl = document.getElementById('gw-depth-val');
  if (gwEl) gwEl.textContent = gwDepth.toFixed(1) + ' m';

  // Stress label
  const stressEl = document.getElementById('gw-stress-label');
  if (stressEl) {
    const ri = getRiskInfo(d.groundwater_stress);
    stressEl.className = `risk-badge ${ri.cls}`;
    stressEl.textContent = d.groundwater_stress;
  }

  // Major crops
  const cropsEl = document.getElementById('major-crops');
  if (cropsEl) cropsEl.textContent = d.major_crops.join(', ');

  // Rainfall gauge
  const rfYears = Object.keys(d.annual_rainfall).sort();
  const lastRf = d.annual_rainfall[rfYears.at(-1)];
  const rfEl = document.getElementById('latest-rainfall');
  if (rfEl) rfEl.textContent = lastRf + ' mm';

  // Rainfall deficit
  const defPct = Math.round(Math.max(0, (500 - lastRf) / 500 * 100));
  const defEl = document.getElementById('rainfall-deficit-pct');
  if (defEl) defEl.textContent = defPct > 0 ? `-${defPct}%` : '+' + Math.abs(defPct) + '%';

  // Animate stat card counters
  animateDashboardStats(district);

  // Draw gauge
  drawGauge('drought-gauge', risk.index, risk.label, risk.color);

  // Draw rainfall chart
  drawRainfallChart(district);

  // Draw GW depletion bar chart
  drawGWDepletionChart();

  // Fetch weather (also triggers forecast chart + reservoir card)
  await updateWeatherWidget(district);
}

function drawGauge(canvasId, value, label, color) {
  const el = document.getElementById(canvasId);
  if (!el) return;
  const svgEl = el;
  const cx = 80, cy = 80, r = 60;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const pct = value / 100;
  const fillAngle = startAngle + pct * Math.PI;

  function polarToXY(a, radius) {
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }

  const trackS = polarToXY(startAngle, r);
  const trackE = polarToXY(endAngle, r);
  const fillE = polarToXY(fillAngle, r);

  svgEl.innerHTML = `
    <path d="M ${trackS.x} ${trackS.y} A ${r} ${r} 0 0 1 ${trackE.x} ${trackE.y}" 
      fill="none" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round"/>
    <path d="M ${trackS.x} ${trackS.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${fillE.x} ${fillE.y}" 
      fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
    <text x="${cx}" y="${cy - 4}" class="gauge-value-text" style="fill:var(--text)">${value}</text>
    <text x="${cx}" y="${cy + 16}" class="gauge-label-text" style="fill:var(--text-muted)">${label}</text>
    <text x="${cx}" y="${cy + 30}" class="gauge-label-text" style="fill:var(--text-muted);font-size:9px">Drought Index</text>
  `;
}

function drawRainfallChart(district) {
  destroyChart('rainfall');
  const d = App.data.districts[district];
  const years = Object.keys(d.annual_rainfall).sort();
  const values = years.map(y => d.annual_rainfall[y]);
  const ctx = document.getElementById('rainfall-chart');
  if (!ctx) return;
  App.charts.rainfall = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Annual Rainfall (mm)',
        data: values,
        borderColor: '#2196c4',
        backgroundColor: 'rgba(33,150,196,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#2196c4',
      }, {
        label: 'Long-term Average (500mm)',
        data: years.map(() => 500),
        borderColor: '#f97316',
        borderDash: [6, 3],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: chartColor(), font: { size: 12 } } } },
      scales: {
        x: { ticks: { color: chartColor(), font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { color: chartColor() }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: false }
      }
    }
  });
}

function drawGWDepletionChart() {
  destroyChart('gwDepletion');
  const districts = Object.keys(App.data.districts);
  const depletions = districts.map(d => App.data.districts[d].depletion_pct);
  const colors = districts.map(d => App.data.districts[d].color || '#2196c4');
  const ctx = document.getElementById('gw-depletion-chart');
  if (!ctx) return;
  App.charts.gwDepletion = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: districts.map(d => d.replace(' ', '\n')),
      datasets: [{
        label: '% Wells with Depletion',
        data: depletions,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: chartColor(), font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: chartColor(), callback: v => v + '%' }, grid: { color: 'rgba(0,0,0,0.05)' }, max: 100 }
      }
    }
  });
}

async function updateWeatherWidget(district) {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;
  widget.innerHTML = `<div class="skeleton" style="height:100px;width:100%;border-radius:12px;"></div>`;
  try {
    const weather = await fetchWeather(district);
    const cur = weather.current;
    const wi = weatherCodeInfo(cur.weathercode);
    const daily = weather.daily;
    const dailyPrecip7 = daily?.precipitation_sum?.reduce((a, b) => a + (b || 0), 0).toFixed(1) || '—';

    widget.innerHTML = `
      <div class="weather-widget">
        <div class="weather-main">
          <div class="weather-icon">${wi.icon}</div>
          <div>
            <div class="weather-temp">${Math.round(cur.temperature_2m)}°C</div>
            <div class="weather-desc">${wi.desc} · ${district}</div>
          </div>
        </div>
        <div class="weather-details">
          <div class="weather-detail-item">💧 Humidity: ${cur.relative_humidity_2m}%</div>
          <div class="weather-detail-item">🌧️ Rain today: ${(cur.precipitation || 0).toFixed(1)} mm</div>
          <div class="weather-detail-item">💨 Wind: ${Math.round(cur.windspeed_10m)} km/h</div>
          <div class="weather-detail-item">📅 7-day total: ${dailyPrecip7} mm</div>
        </div>
        <div class="live-badge" style="align-self:flex-start"><div class="live-dot"></div>Live via Open-Meteo</div>
      </div>`;

    // Draw 7-day forecast chart
    if (daily?.precipitation_sum && daily?.time) {
      drawForecastChart(daily);
    }
    // Update reservoir indicator
    updateReservoirCard(district, cur);
  } catch(e) {
    widget.innerHTML = `
      <div class="weather-widget" style="background:linear-gradient(135deg,#374151,#1f2937)">
        <div class="weather-main"><div class="weather-icon">🌡️</div>
          <div><div class="weather-temp">—</div><div class="weather-desc">Weather unavailable · ${district}</div></div>
        </div>
        <div class="demo-badge">API Error</div>
      </div>`;
    updateReservoirCard(district, null);
  }
}

function drawForecastChart(daily) {
  destroyChart('forecast7d');
  const ctx = document.getElementById('forecast-chart');
  if (!ctx) return;
  const days = daily.time.map(t => {
    const d = new Date(t);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  });
  const maxT = daily.temperature_2m_max || [];
  const minT = daily.temperature_2m_min || [];
  const precip = daily.precipitation_sum || [];
  App.charts.forecast7d = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: precip,
          backgroundColor: 'rgba(33,150,196,0.7)',
          borderColor: '#2196c4',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y',
        },
        {
          label: 'Max Temp (°C)',
          data: maxT,
          type: 'line',
          borderColor: '#f97316',
          backgroundColor: 'transparent',
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'y1',
        },
        {
          label: 'Min Temp (°C)',
          data: minT,
          type: 'line',
          borderColor: '#38b2d8',
          backgroundColor: 'transparent',
          pointRadius: 4,
          tension: 0.3,
          borderDash: [4,3],
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: chartColor(), font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: chartColor(), font: { size: 10 } }, grid: { display: false } },
        y: {
          position: 'left',
          ticks: { color: chartColor(), callback: v => v + ' mm' },
          grid: { color: 'rgba(0,0,0,0.05)' },
          title: { display: true, text: 'Rainfall (mm)', color: chartColor(), font: { size: 10 } }
        },
        y1: {
          position: 'right',
          ticks: { color: chartColor(), callback: v => v + '°C' },
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Temp (°C)', color: chartColor(), font: { size: 10 } }
        }
      }
    }
  });
}

function updateReservoirCard(district, weatherCurrent) {
  const el = document.getElementById('reservoir-card');
  if (!el || !App.data) return;
  const d = App.data.districts[district];
  // Estimate reservoir fill % from rainfall vs long-term avg (heuristic)
  const rfYears = Object.keys(d.annual_rainfall).sort();
  const lastRf = d.annual_rainfall[rfYears.at(-1)];
  const avgRf = rfYears.reduce((s, y) => s + d.annual_rainfall[y], 0) / rfYears.length;
  // Estimate 30–90% based on last rainfall vs average
  const fillPct = Math.min(95, Math.max(8, Math.round((lastRf / avgRf) * 55)));
  const fillColor = fillPct >= 60 ? '#22c55e' : fillPct >= 35 ? '#eab308' : '#ef4444';
  const fillLabel = fillPct >= 60 ? 'Adequate' : fillPct >= 35 ? 'Low' : 'Critical';

  el.innerHTML = `
    <div class="stat-icon" style="background:rgba(20,184,166,0.12)">🏞️</div>
    <div class="stat-value" style="color:${fillColor}">${fillPct}%</div>
    <div class="stat-label">Est. Reservoir / Check Dam Fill</div>
    <div class="stat-change neutral" style="margin-top:6px">
      <span style="color:${fillColor};font-weight:700">${fillLabel}</span> · Based on rainfall ratio
    </div>
    <div class="progress-bar" style="margin-top:8px">
      <div class="progress-fill" style="width:${fillPct}%;background:${fillColor}"></div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// PAGE: MAP
// ─────────────────────────────────────────────────────────────
let mapInitialized = false;

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;
  renderSaurasthraSVGMap();
  showDistrictPanel(App.currentDistrict);
  setTimeout(buildDistrictTable, 100);
}

// SVG path data for Saurashtra's 11 districts (approximate schematic shapes)
const DISTRICT_SVG_PATHS = {
  'Surendranagar': 'M 180 60 L 260 55 L 280 90 L 270 130 L 220 140 L 175 115 Z',
  'Morbi':         'M 260 55 L 330 50 L 350 85 L 330 115 L 280 90 Z',
  'Rajkot':        'M 175 115 L 220 140 L 240 180 L 200 200 L 155 190 L 140 155 Z',
  'Jamnagar':      'M 80 80 L 175 115 L 140 155 L 95 165 L 55 130 L 60 100 Z',
  'Devbhoomi Dwarka': 'M 30 55 L 80 80 L 60 100 L 55 130 L 20 125 L 15 90 Z',
  'Porbandar':     'M 55 130 L 95 165 L 85 195 L 50 185 L 38 160 Z',
  'Junagadh':      'M 85 195 L 140 155 L 155 190 L 160 230 L 130 255 L 90 240 L 75 220 Z',
  'Botad':         'M 200 200 L 240 180 L 265 210 L 250 245 L 215 250 L 195 230 Z',
  'Bhavnagar':     'M 215 250 L 250 245 L 270 285 L 255 320 L 220 325 L 195 295 L 195 265 Z',
  'Amreli':        'M 130 255 L 160 230 L 195 265 L 195 295 L 165 315 L 130 300 L 115 275 Z',
  'Gir Somnath':   'M 90 240 L 130 255 L 115 275 L 130 300 L 110 330 L 75 320 L 65 290 L 70 265 Z',
};

function renderSaurasthraSVGMap() {
  const container = document.getElementById('map-svg-container');
  if (!container || !App.data) return;
  const tooltip = document.getElementById('map-tooltip');

  let svg = `<svg viewBox="0 0 400 380" class="saurashtra-map" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pat-safe" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#22c55e"/>
        <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.3)"/>
      </pattern>
      <pattern id="pat-semi" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#eab308"/>
        <line x1="0" y1="8" x2="8" y2="0" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
      </pattern>
      <pattern id="pat-critical" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#f97316"/>
        <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="8" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      </pattern>
      <pattern id="pat-over" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#ef4444"/>
        <line x1="4" y1="0" x2="4" y2="8" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
        <line x1="0" y1="4" x2="8" y2="4" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      </pattern>
    </defs>
    <!-- Gulf of Khambhat / Arabian Sea hint -->
    <rect x="0" y="0" width="400" height="380" fill="transparent"/>
    <text x="10" y="370" font-size="9" fill="#64748b" font-style="italic">Gulf of Khambhat →</text>
    <text x="10" y="50" font-size="9" fill="#64748b" font-style="italic">← Arabian Sea</text>
  `;

  const patMap = { 'Safe': 'pat-safe', 'Semi-Critical': 'pat-semi', 'Critical': 'pat-critical', 'Over-Exploited': 'pat-over' };

  Object.entries(DISTRICT_SVG_PATHS).forEach(([name, pathD]) => {
    const d = App.data.districts[name];
    const stress = d?.groundwater_stress || 'Safe';
    const pat = patMap[stress];
    // Calculate centroid for label
    const nums = pathD.match(/[\d.]+/g).map(Number);
    let xs = [], ys = [];
    for (let i = 0; i < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i+1]); }
    const cx = xs.reduce((a,b) => a+b,0)/xs.length;
    const cy = ys.reduce((a,b) => a+b,0)/ys.length;
    const shortName = name.replace('Devbhoomi ', 'D.').replace(' ', '\n');
    const lines = name.split(' ');

    svg += `
      <path d="${pathD}" fill="url(#${pat})" class="district-path" data-district="${name}" 
        stroke="white" stroke-width="1.5"/>
      ${lines.map((l, i) => `<text x="${cx}" y="${cy + (i - (lines.length-1)/2)*13}" 
        font-size="9.5" fill="white" text-anchor="middle" 
        style="pointer-events:none;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,0.8)">${l}</text>`).join('')}
    `;
  });

  svg += `</svg>`;
  container.innerHTML = svg + `<div class="map-tooltip" id="map-tooltip"></div>`;

  // Events
  container.querySelectorAll('.district-path').forEach(path => {
    path.addEventListener('mouseenter', (e) => {
      const name = e.target.dataset.district;
      const tip = container.querySelector('#map-tooltip');
      if (tip) {
        const d = App.data.districts[name];
        tip.innerHTML = `<strong>${name}</strong><br><span style="color:${d.color}">${d.groundwater_stress}</span> · ${d.depletion_pct}% depleted`;
        tip.style.opacity = '1';
      }
    });
    path.addEventListener('mousemove', (e) => {
      const tip = container.querySelector('#map-tooltip');
      if (!tip) return;
      const rect = container.getBoundingClientRect();
      tip.style.left = (e.clientX - rect.left + 12) + 'px';
      tip.style.top = (e.clientY - rect.top - 30) + 'px';
    });
    path.addEventListener('mouseleave', () => {
      const tip = container.querySelector('#map-tooltip');
      if (tip) tip.style.opacity = '0';
    });
    path.addEventListener('click', (e) => {
      container.querySelectorAll('.district-path').forEach(p => p.classList.remove('selected'));
      e.target.classList.add('selected');
      showDistrictPanel(e.target.dataset.district);
    });
  });
}

function showDistrictPanel(district) {
  if (!App.data) return;
  App.selectedMapDistrict = district;
  const d = App.data.districts[district];
  if (!d) return;
  const panel = document.getElementById('district-info-panel');
  if (!panel) return;
  const risk = calcDroughtIndex(district, null);
  const ri = getRiskInfo(d.groundwater_stress);
  const years = Object.keys(d.annual_rainfall).sort();
  const lastRf = d.annual_rainfall[years.at(-1)];
  const gwYears = Object.keys(d.groundwater_depth_mbgl).sort();
  const lastGW = d.groundwater_depth_mbgl[gwYears.at(-1)];

  panel.innerHTML = `
    <div class="district-panel-header">
      <div>
        <h3 style="font-size:17px;font-weight:700">${district}</h3>
        <div style="font-size:12px;color:var(--text-muted)">${d.area_sq_km.toLocaleString('en-IN')} km² · Pop. ${(d.population/100000).toFixed(1)}L</div>
      </div>
      <span class="risk-badge ${ri.cls}">${d.groundwater_stress}</span>
    </div>
    <div class="district-panel-body">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">${d.description}</p>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
          <div style="font-size:22px;font-weight:800;font-family:var(--font-display)">${lastRf} mm</div>
          <div style="font-size:11px;color:var(--text-muted)">Last Year Rainfall</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
          <div style="font-size:22px;font-weight:800;font-family:var(--font-display)">${lastGW.toFixed(1)} m</div>
          <div style="font-size:11px;color:var(--text-muted)">GW Depth (mbgl)</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
          <div style="font-size:22px;font-weight:800;font-family:var(--font-display)">${d.depletion_pct}%</div>
          <div style="font-size:11px;color:var(--text-muted)">Wells Depleted</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
          <div style="font-size:22px;font-weight:800;font-family:var(--font-display);color:${risk.color}">${risk.index}</div>
          <div style="font-size:11px;color:var(--text-muted)">Drought Index</div>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px">MAJOR CROPS</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${d.major_crops.map(c => `<span style="background:var(--accent-light);color:var(--accent);padding:3px 10px;border-radius:100px;font-size:12px;font-weight:500">${c}</span>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px">GW DEPTH TREND</div>
        <div style="height:100px"><canvas id="mini-gw-chart"></canvas></div>
      </div>

      <button class="btn btn-primary w-full btn-sm" onclick="App.currentDistrict='${district}'; showPage('page-advisory')">
        🤖 Get Advisory for ${district}
      </button>
    </div>`;

  // Mini GW chart
  setTimeout(() => {
    const mc = document.getElementById('mini-gw-chart');
    if (!mc) return;
    const gwYrs = Object.keys(d.groundwater_depth_mbgl).sort();
    new Chart(mc, {
      type: 'line',
      data: {
        labels: gwYrs,
        datasets: [{
          data: gwYrs.map(y => d.groundwater_depth_mbgl[y]),
          borderColor: d.color || '#2196c4',
          backgroundColor: (d.color || '#2196c4') + '20',
          fill: true, tension: 0.4,
          pointRadius: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { font: { size: 9 }, color: '#64748b', maxRotation: 45 }, grid: { display: false } },
          y: {
            ticks: { font: { size: 9 }, color: '#64748b', callback: v => v + 'm' },
            grid: { color: 'rgba(0,0,0,0.05)' },
            reverse: true // deeper = worse
          }
        }
      }
    });
  }, 100);
}

// ─────────────────────────────────────────────────────────────
// PAGE: TRENDS
// ─────────────────────────────────────────────────────────────
let trendsInitialized = false;

function initTrends() {
  if (!trendsInitialized) {
    trendsInitialized = true;
    // Wire district selector change
    document.getElementById('trends-district-sel')?.addEventListener('change', (e) => {
      destroyChart('trendsGWDepth');
      destroyChart('trendsRfCorr');
      drawGWDepthTrend(e.target.value);
      drawRainfallGWCorrelation(e.target.value);
    });
    document.getElementById('export-csv-btn')?.addEventListener('click', exportCSV);
  }
  // Always draw (handles theme re-entry)
  drawRegionalRainfallTrend();
  const selDistrict = document.getElementById('trends-district-sel')?.value || 'Rajkot';
  drawGWDepthTrend(selDistrict);
  drawRechargeComparison();
  drawRainfallGWCorrelation(selDistrict);
}

function drawRegionalRainfallTrend() {
  destroyChart('trendsRainfall');
  const ctx = document.getElementById('regional-rainfall-chart');
  if (!ctx || !App.data) return;
  const districts = Object.keys(App.data.districts);
  const years = Object.keys(App.data.districts['Rajkot'].annual_rainfall).sort();

  // Average across all districts
  const avgRf = years.map(y => {
    const sum = districts.reduce((s, d) => s + (App.data.districts[d].annual_rainfall[y] || 0), 0);
    return Math.round(sum / districts.length);
  });

  // Historic drought markers
  const droughtYears = App.data.historic_droughts.map(h => h.year.toString());

  App.charts.trendsRainfall = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Avg Rainfall (mm)',
          data: avgRf,
          backgroundColor: avgRf.map((v, i) => {
            if (droughtYears.includes(years[i])) return 'rgba(239,68,68,0.7)';
            return v >= 500 ? 'rgba(34,197,94,0.7)' : 'rgba(33,150,196,0.7)';
          }),
          borderRadius: 4,
        },
        {
          label: 'Long-term Average (500mm)',
          data: years.map(() => 500),
          type: 'line',
          borderColor: '#f97316',
          borderDash: [6, 3],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: chartColor(), font: { size: 12 } } } },
      scales: {
        x: { ticks: { color: chartColor(), font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: chartColor() }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: false }
      }
    }
  });
}

function drawGWDepthTrend(district = 'Rajkot') {
  destroyChart('trendsGWDepth');
  const ctx = document.getElementById('gw-depth-trend-chart');
  if (!ctx || !App.data) return;
  const d = App.data.districts[district];
  const years = Object.keys(d.groundwater_depth_mbgl).sort();
  const depths = years.map(y => d.groundwater_depth_mbgl[y]);

  App.charts.trendsGWDepth = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: `GW Depth - ${district} (m below ground)`,
        data: depths,
        borderColor: d.color || '#2196c4',
        backgroundColor: (d.color || '#2196c4') + '20',
        fill: true, tension: 0.4, pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: chartColor() } } },
      scales: {
        x: { ticks: { color: chartColor(), font: { size: 11 } }, grid: { display: false } },
        y: {
          ticks: { color: chartColor(), callback: v => v + ' m' },
          grid: { color: 'rgba(0,0,0,0.05)' },
          reverse: true,
          title: { display: true, text: 'Depth (m bgl) — Lower = More Depleted', color: chartColor(), font: { size: 11 } }
        }
      }
    }
  });
}

function drawRechargeComparison() {
  destroyChart('rechargeComp');
  const ctx = document.getElementById('recharge-comparison-chart');
  if (!ctx || !App.data) return;
  const pre = App.data.recharge_movement_comparison.pre_movement;
  const post = App.data.recharge_movement_comparison.post_movement;

  App.charts.rechargeComp = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Monsoon Recharge (MCM)', 'Avg Rainfall (mm)', 'Recharge per mm (MCM/mm)'],
      datasets: [
        {
          label: `Pre-Movement ${pre.period}`,
          data: [pre.avg_monsoon_recharge_mcm, pre.avg_annual_rainfall_mm, +(pre.avg_monsoon_recharge_mcm/pre.avg_annual_rainfall_mm).toFixed(2)],
          backgroundColor: 'rgba(239,68,68,0.65)', borderColor: '#ef4444', borderWidth: 2, borderRadius: 6,
        },
        {
          label: `Post-Movement ${post.period}`,
          data: [post.avg_monsoon_recharge_mcm, post.avg_annual_rainfall_mm, +(post.avg_monsoon_recharge_mcm/post.avg_annual_rainfall_mm).toFixed(2)],
          backgroundColor: 'rgba(34,197,94,0.65)', borderColor: '#22c55e', borderWidth: 2, borderRadius: 6,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: chartColor() } } },
      scales: {
        x: { ticks: { color: chartColor() }, grid: { display: false } },
        y: { ticks: { color: chartColor() }, grid: { color: 'rgba(0,0,0,0.05)' } }
      }
    }
  });
}

function drawRainfallGWCorrelation(district = 'Rajkot') {
  destroyChart('trendsRfCorr');
  const ctx = document.getElementById('rf-gw-correlation-chart');
  if (!ctx || !App.data) return;
  const d = App.data.districts[district];
  const rfYears = Object.keys(d.annual_rainfall).sort();
  const gwYears = Object.keys(d.groundwater_depth_mbgl).sort();
  const commonYears = rfYears.filter(y => gwYears.includes(y));

  const points = commonYears.map(y => ({
    x: d.annual_rainfall[y],
    y: d.groundwater_depth_mbgl[y]
  }));

  App.charts.trendsRfCorr = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: `Rainfall vs GW Depth (${district})`,
        data: points,
        backgroundColor: (d.color || '#2196c4') + 'cc',
        borderColor: d.color || '#2196c4',
        pointRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: chartColor() } } },
      scales: {
        x: {
          title: { display: true, text: 'Annual Rainfall (mm)', color: chartColor() },
          ticks: { color: chartColor() }, grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y: {
          title: { display: true, text: 'GW Depth (m bgl)', color: chartColor() },
          ticks: { color: chartColor(), callback: v => v + ' m' },
          grid: { color: 'rgba(0,0,0,0.05)' },
          reverse: true
        }
      }
    }
  });
}

function exportCSV() {
  if (!App.data) return;
  const rows = [['District', 'Year', 'Rainfall_mm', 'GW_Depth_mbgl', 'Stress_Level', 'Depletion_pct']];
  Object.entries(App.data.districts).forEach(([name, d]) => {
    const years = Object.keys(d.annual_rainfall).sort();
    years.forEach(y => {
      rows.push([name, y, d.annual_rainfall[y] || '', d.groundwater_depth_mbgl[y] || '', d.groundwater_stress, d.depletion_pct]);
    });
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'saurashtra_groundwater_data.csv';
  a.click();
  showToast('CSV exported successfully!', 'success');
}

// ─────────────────────────────────────────────────────────────
// PAGE: ADVISORY
// ─────────────────────────────────────────────────────────────
function initAdvisory() {
  populateCropSelect();
  populateDistrictSelectors();
  const form = document.getElementById('advisory-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const district = document.getElementById('advisory-district')?.value;
      const crop = document.getElementById('advisory-crop')?.value;
      const land = parseFloat(document.getElementById('advisory-land')?.value) || 1;
      renderAdvisory(district, crop, land);
    });
  }
}

function populateCropSelect() {
  const sel = document.getElementById('advisory-crop');
  if (!sel || !App.data) return;
  const crops = Object.keys(App.data.crop_water_requirements);
  sel.innerHTML = crops.map(c => `<option value="${c}">${c}</option>`).join('');
}

function renderAdvisory(district, crop, land) {
  const result = document.getElementById('advisory-result-content');
  if (!result) return;

  result.innerHTML = `<div class="skeleton skeleton-chart" style="height:400px"></div>`;

  setTimeout(() => {
    const adv = generateAdvisory(district, crop, land);

    result.innerHTML = `
      <div style="margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h3 style="font-size:18px;font-weight:700">${district} · ${crop} · ${land} ha</h3>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">Advisory generated ${new Date().toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="risk-badge ${adv.droughtIdx.cls}">${adv.droughtIdx.label} Risk</span>
          <span class="demo-badge">Rule-Based AI</span>
        </div>
      </div>

      <div class="advisory-section">
        <h4>📊 District Overview</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:12px">
          <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
            <div style="font-size:24px;font-weight:800;font-family:var(--font-display)">${adv.droughtIdx.index}<span style="font-size:14px">/100</span></div>
            <div style="font-size:11px;color:var(--text-muted)">Drought Index</div>
          </div>
          <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
            <div style="font-size:24px;font-weight:800;font-family:var(--font-display)">${adv.rainfallDeficit}%</div>
            <div style="font-size:11px;color:var(--text-muted)">Rainfall Deficit</div>
          </div>
          <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
            <div style="font-size:24px;font-weight:800;font-family:var(--font-display)">${adv.gwDepth.toFixed(1)}m</div>
            <div style="font-size:11px;color:var(--text-muted)">GW Depth</div>
          </div>
          <div style="text-align:center;padding:12px;background:var(--bg-surface);border-radius:8px">
            <div style="font-size:24px;font-weight:800;font-family:var(--font-display)">${adv.totalWater.toLocaleString('en-IN')}</div>
            <div style="font-size:11px;color:var(--text-muted)">Litres needed/season</div>
          </div>
        </div>
      </div>

      <div class="advisory-section">
        <h4>💧 Irrigation Scheduling</h4>
        <p>${adv.irrigSchedule}</p>
        <div style="margin-top:12px;padding:12px;background:var(--accent-light);border-radius:8px;border-left:3px solid var(--accent)">
          <strong>💡 Drip Irrigation Saving:</strong> By switching from flood to drip, you could save 
          <strong>${adv.dripSaving.toLocaleString('en-IN')} litres/season</strong> on ${land} ha of ${crop}.
        </div>
      </div>

      <div class="advisory-section">
        <h4>🏗️ Recommended Water Conservation Structures</h4>
        <ul>${adv.structures.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>

      <div class="advisory-section">
        <h4>🌱 Crop-Specific Conservation Measures</h4>
        <ul>${adv.conservation.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>

      <div class="advisory-section">
        <h4>🔮 30/60/90-Day Drought Risk Forecast</h4>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
          Rule-based projection based on historical rainfall patterns, current groundwater depth, and seasonal trends. 
          <span class="demo-badge" style="display:inline-flex">Not a meteorological forecast</span>
        </p>
        <div class="forecast-grid">
          ${adv.forecast.map(f => `
            <div class="forecast-item">
              <div class="forecast-period">${f.period}</div>
              <div class="forecast-risk" style="color:${f.color}">${f.label}</div>
              <div style="height:4px;border-radius:2px;background:var(--border);margin:8px 0">
                <div style="height:100%;width:${f.value}%;background:${f.color};border-radius:2px;transition:width 0.8s ease"></div>
              </div>
              <div class="forecast-desc">${f.value}/100</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="source-note">
        ⚠️ This advisory is generated by a deterministic rule-based engine using historical research data. 
        It is for informational and planning purposes only. Consult your local Krishi Vigyan Kendra (KVK) 
        or Agricultural Officer before making major farming decisions.
      </div>
    `;
  }, 600);
}

// ─────────────────────────────────────────────────────────────
// PAGE: FARMER RESOURCES — accordion only (language handled globally)
// ─────────────────────────────────────────────────────────────
function initFarmerResources() {
  $$('.accordion-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      item.classList.toggle('open');
    });
  });
}

// ─────────────────────────────────────────────────────────────
// DISTRICT COMPARISON TABLE (Map Page)
// ─────────────────────────────────────────────────────────────
let distTableSortCol = 'depletion_pct';
let distTableSortAsc = false;

function buildDistrictTable() {
  const el = document.getElementById('district-comparison-table');
  if (!el || !App.data) return;
  renderDistrictTable(el);
}

function renderDistrictTable(container) {
  const districts = Object.entries(App.data.districts);
  districts.sort((a, b) => {
    const va = a[1][distTableSortCol] ?? a[1].stress_level ?? 0;
    const vb = b[1][distTableSortCol] ?? b[1].stress_level ?? 0;
    return distTableSortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const header = [
    { key: 'name',          label: 'District' },
    { key: 'groundwater_stress', label: 'GW Status' },
    { key: 'depletion_pct', label: '% Depleted' },
    { key: 'stress_level',  label: 'Stress Level' },
    { key: 'rainfall',      label: 'Last Rainfall' },
    { key: 'gw_depth',      label: 'GW Depth (m)' },
  ];

  container.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:var(--bg-surface)">
          ${header.map(h => `
            <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;cursor:pointer;white-space:nowrap;border-bottom:2px solid var(--border)"
              onclick="sortDistrictTable('${h.key}')">
              ${h.label} ${distTableSortCol === h.key ? (distTableSortAsc ? '↑' : '↓') : ''}
            </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${districts.map(([name, d]) => {
          const ri = getRiskInfo(d.groundwater_stress);
          const rfYrs = Object.keys(d.annual_rainfall).sort();
          const lastRf = d.annual_rainfall[rfYrs.at(-1)];
          const gwYrs = Object.keys(d.groundwater_depth_mbgl).sort();
          const lastGW = d.groundwater_depth_mbgl[gwYrs.at(-1)];
          return `<tr style="border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s"
            onmouseenter="this.style.background='var(--bg-surface)'"
            onmouseleave="this.style.background=''"
            onclick="showDistrictPanel('${name}');App.selectedMapDistrict='${name}'">
            <td style="padding:10px 12px;font-weight:600">${name}</td>
            <td style="padding:10px 12px"><span class="risk-badge ${ri.cls}" style="font-size:11px">${d.groundwater_stress}</span></td>
            <td style="padding:10px 12px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-weight:700;color:${d.color}">${d.depletion_pct}%</span>
                <div style="width:60px;height:6px;background:var(--border);border-radius:3px;overflow:hidden">
                  <div style="width:${d.depletion_pct}%;height:100%;background:${d.color};border-radius:3px"></div>
                </div>
              </div>
            </td>
            <td style="padding:10px 12px">${'●'.repeat(d.stress_level)}${'○'.repeat(4-d.stress_level)}</td>
            <td style="padding:10px 12px">${lastRf} mm</td>
            <td style="padding:10px 12px">${lastGW.toFixed(1)} m</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function sortDistrictTable(col) {
  const colMap = { 'rainfall': 'rainfall', 'gw_depth': 'gw_depth', 'name': 'name' };
  if (distTableSortCol === col) distTableSortAsc = !distTableSortAsc;
  else { distTableSortCol = col; distTableSortAsc = false; }
  const el = document.getElementById('district-comparison-table');
  if (el) renderDistrictTable(el);
}

// ─────────────────────────────────────────────────────────────
// STAT CARD COUNTER ANIMATION (Dashboard)
// ─────────────────────────────────────────────────────────────
function animateDashboardStats(district) {
  const d = App.data.districts[district];
  const rfYears = Object.keys(d.annual_rainfall).sort();
  const lastRf = d.annual_rainfall[rfYears.at(-1)];
  const gwYears = Object.keys(d.groundwater_depth_mbgl).sort();
  const gwDepth = d.groundwater_depth_mbgl[gwYears.at(-1)];
  const risk = calcDroughtIndex(district, null);

  // Animate rainfall
  const rfEl = document.getElementById('latest-rainfall');
  if (rfEl) animateCounter(rfEl, lastRf, 800, ' mm');

  // Animate gw depth
  const gwEl = document.getElementById('gw-depth-val');
  if (gwEl) {
    let start = 0;
    const timer = setInterval(() => {
      start = Math.min(start + gwDepth / 50, gwDepth);
      gwEl.textContent = start.toFixed(1) + ' m';
      if (start >= gwDepth) clearInterval(timer);
    }, 16);
  }

  // Animate depletion
  const depEl = document.getElementById('gw-depletion-val');
  if (depEl) animateCounter(depEl, d.depletion_pct, 800, '%');

  // Animate risk index
  const riskEl = document.getElementById('risk-index-val');
  if (riskEl) animateCounter(riskEl, risk.index, 900, '');
}

// ─────────────────────────────────────────────────────────────
// PRINT ADVISORY
// ─────────────────────────────────────────────────────────────
function printAdvisory() {
  const content = document.getElementById('advisory-result-content');
  if (!content || content.querySelector('.advisory-placeholder')) {
    showToast('Generate an advisory first before printing.', 'warning');
    return;
  }
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head>
    <title>Jal Sahayak Advisory</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #0f172a; }
      h3 { font-size: 20px; margin-bottom: 4px; }
      h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #3b82d4; margin: 20px 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
      p, li { font-size: 14px; line-height: 1.75; }
      ul { padding-left: 20px; }
      .risk-badge { display: inline-block; padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; border: 1px solid currentColor; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; }
      .logo { font-size: 22px; font-weight: 800; }
      .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
      @media print { body { margin: 20px; } }
    </style>
  </head><body>
    <div class="header">
      <div class="logo">💧 Jal Sahayak</div>
      <div style="font-size:12px;color:#64748b">Printed: ${new Date().toLocaleString('en-IN')}</div>
    </div>
    ${content.innerHTML}
    <div class="footer">
      Jal Sahayak · Saurashtra Drought & Groundwater Advisor · Advisory tool only — not a substitute for official government data.
    </div>
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 300);
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
async function init() {
  // Apply saved theme
  applyTheme(App.theme);

  // Global language switcher
  document.getElementById('global-lang-toggle')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) applyLanguage(btn.dataset.lang);
  });

  // Nav — hamburger + backdrop close
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });
  // Close mobile nav on backdrop tap
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburger && !hamburger?.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyTheme(App.theme === 'dark' ? 'light' : 'dark');
  });

  // Nav link routing
  $$('.nav-links a[data-page], .cta-link[data-page]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(a.dataset.page);
    });
  });

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Scroll navbar shadow
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Load data
  await loadData();

  // Init landing
  initLanding();

  // Init advisory (pre-populate)
  initAdvisory();

  // Init farmer resources
  initFarmerResources();

  // Restore saved language (after data loaded so i18n elements exist)
  const savedLang = localStorage.getItem('jalsahayak_lang') || 'en';
  applyLanguage(savedLang);

  // Show home by default
  showPage('page-home');
}

document.addEventListener('DOMContentLoaded', init);
