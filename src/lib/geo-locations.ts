/** Public-record / lead geo nodes for Meridian globe */
export const geoLocations = [
  {
    "id": "GEO-NYC-E71",
    "name": "9 East 71st / E66 Manhattan",
    "lat": 40.7715,
    "lng": -73.9654,
    "status": "SOLID",
    "entity_id": "E-E66",
    "details": "Publicly associated NYC properties in reporting and dockets. Association \u2260 guilt for third parties.",
    "hub_rel": "property"
  },
  {
    "id": "GEO-PALM-BEACH",
    "name": "358 El Brillo Way, Palm Beach",
    "lat": 26.7003,
    "lng": -80.0365,
    "status": "SOLID",
    "entity_id": "E-PALM-BEACH",
    "details": "Florida residence; origin of 2005 PBPD investigation.",
    "hub_rel": "origin"
  },
  {
    "id": "GEO-LSJ",
    "name": "Little St. James, USVI",
    "lat": 18.301,
    "lng": -64.824,
    "status": "SOLID",
    "entity_id": "E-LITTLE-ST-JAMES",
    "details": "Private island in USVI AG settlement residue.",
    "hub_rel": "property"
  },
  {
    "id": "GEO-GSJ",
    "name": "Great St. James, USVI",
    "lat": 18.315,
    "lng": -64.83,
    "status": "MAYBE",
    "entity_id": null,
    "details": "Operator/estate track island adjacent to LSJ; confirm in inventory.",
    "hub_rel": "property"
  },
  {
    "id": "GEO-ZORRO",
    "name": "Zorro Ranch, NM",
    "lat": 35.284,
    "lng": -105.904,
    "status": "SOLID",
    "entity_id": "E-ZORRO",
    "details": "New Mexico property publicly associated.",
    "hub_rel": "property"
  },
  {
    "id": "GEO-TETERBORO",
    "name": "Teterboro Airport (arrest 2019)",
    "lat": 40.8501,
    "lng": -74.0608,
    "status": "SOLID",
    "entity_id": "E-EPSTEIN",
    "details": "2019 arrest locus (public).",
    "hub_rel": "event"
  },
  {
    "id": "GEO-MCC",
    "name": "MCC New York",
    "lat": 40.7125,
    "lng": -74.001,
    "status": "SOLID",
    "entity_id": "E-EPSTEIN",
    "details": "Death in custody Aug 2019; public OCME/DOJ record.",
    "hub_rel": "event"
  },
  {
    "id": "GEO-USVI-HUB",
    "name": "USVI estate / AG venue",
    "lat": 18.3419,
    "lng": -64.9307,
    "status": "SOLID",
    "entity_id": "E-SOUTHERN-TRUST",
    "details": "USVI AG settlement + estate administration venue.",
    "hub_rel": "legal"
  },
  {
    "id": "GEO-SDNY",
    "name": "USAO SDNY / Manhattan federal",
    "lat": 40.714,
    "lng": -74.002,
    "status": "SOLID",
    "entity_id": "E-SDNY",
    "details": "Charging/prosecution venue Epstein & Maxwell.",
    "hub_rel": "legal"
  },
  {
    "id": "GEO-PARIS",
    "name": "Paris apartment (public reports)",
    "lat": 48.8647,
    "lng": 2.292,
    "status": "MAYBE",
    "entity_id": null,
    "details": "Public reporting of Paris property; confirm deed/estate inventory.",
    "hub_rel": "property"
  }
] as const;
export const meridianHub = {
  "name": "New York (SDNY / MCC / E71 axis)",
  "lat": 40.7128,
  "lng": -74.006,
  "note": "Analytical hub for flight/property convergence \u2014 not a guilt finding"
} as const;
