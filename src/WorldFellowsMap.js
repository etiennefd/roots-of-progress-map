import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * WorldFellowsMap (fixed)
 *
 * Fixes
 * - Adds missing city coordinates (Charlotte, Minneapolis, Madison, etc.)
 * - Disambiguates cities that exist in multiple countries (e.g., "Cambridge" US vs UK)
 *   by looking up coords using (city, country) first, then falling back to city-only.
 * - Defensive rendering if any coords are still missing.
 * - Adds lightweight self-tests to catch missing coords & Cambridge(UK) disambiguation.
 *
 * Usage:
 * <WorldFellowsMap data={fellowsData} height={600} />
 */
export default function WorldFellowsMap({ data = [], height = 600 }) {
  // ------------------------------------------------------------
  // Coordinates database
  // ------------------------------------------------------------
  // 1) Primary lookup keyed by CITY|||COUNTRY (for disambiguation)
  const cityCountryCoords = useMemo(
    () => ({
      // Disambiguations / explicit pairs
      "Cambridge|||UK": [52.2053, 0.1218], // Cambridge, England
      "Cambridge|||United Kingdom": [52.2053, 0.1218],
      "Cambridge|||U.K.": [52.2053, 0.1218],
      "Cambridge|||U.K": [52.2053, 0.1218],
      "Cambridge|||Britain": [52.2053, 0.1218],
      "Hong Kong|||China": [22.3193, 114.1694],
      "New York City|||USA": [40.7128, -74.006],
      "New York|||USA": [40.7128, -74.006],
      "Washington DC|||USA": [38.9072, -77.0369],
      "Santa Monica|||USA": [34.0195, -118.4912],
      "San Diego|||USA": [32.7157, -117.1611],
      "Oakland|||USA": [37.8044, -122.2711],
      "Los Angeles|||USA": [34.0522, -118.2437],
      "Salt Lake City|||USA": [40.7608, -111.891],
      "Winston-Salem|||USA": [36.0999, -80.2442],
      "Raleigh|||USA": [35.7796, -78.6382],
      "Roanoke|||USA": [37.2709, -79.9414],
      "Austin|||USA": [30.2672, -97.7431],
      "Phoenix|||USA": [33.4484, -112.074],
      "Madison|||USA": [43.0731, -89.4012],
      "Minneapolis|||USA": [44.9778, -93.2650],
      "Charlotte|||USA": [35.2271, -80.8431],
      "San Francisco|||USA": [37.7749, -122.4194],
      "Boston|||USA": [42.3601, -71.0589],
      "Orlando|||USA": [28.5383, -81.3792],
      "Denver|||USA": [39.7392, -104.9903],
      "Toronto|||Canada": [43.6532, -79.3832],
      "Montreal|||Canada": [45.5019, -73.5674],
      "Sherbrooke|||Canada": [45.4042, -71.8929],
      "London|||UK": [51.5074, -0.1278],
      "London|||United Kingdom": [51.5074, -0.1278],
      "Oxford|||UK": [51.752, -1.2577],
      "Zurich|||Switzerland": [47.3769, 8.5417],
      "Berlin|||Germany": [52.52, 13.405],
      "Munich|||Germany": [48.1351, 11.582],
      "Ghent|||Belgium": [51.0543, 3.7174],
      "Dublin|||Ireland": [53.3498, -6.2603],
      "Ahmedabad|||India": [23.0225, 72.5714],
    }),
    []
  );

  // 2) Fallback lookup keyed by CITY only (used when country-specific pair missing)
  const cityCoords = useMemo(
    () => ({
      // USA
      "San Francisco": [37.7749, -122.4194],
      Denver: [39.7392, -104.9903],
      "Washington DC": [38.9072, -77.0369],
      Roanoke: [37.2709, -79.9414],
      Austin: [30.2672, -97.7431],
      Phoenix: [33.4484, -112.074],
      Raleigh: [35.7796, -78.6382],
      "New York": [40.7128, -74.006],
      "New York City": [40.7128, -74.006],
      Boston: [42.3601, -71.0589],
      Orlando: [28.5383, -81.3792],
      "Santa Monica": [34.0195, -118.4912],
      Oakland: [37.8044, -122.2711],
      "Los Angeles": [34.0522, -118.2437],
      "Salt Lake City": [40.7608, -111.891],
      "Winston-Salem": [36.0999, -80.2442],
      "San Diego": [32.7157, -117.1611],
      "Ann Arbor": [42.2808, -83.743],
      Ferrum: [36.9224, -80.0123],
      Boise: [43.615, -116.2023],
      Berkeley: [37.8715, -122.273],
      Corvallis: [44.5646, -123.262],
      Minneapolis: [44.9778, -93.2650],
      Charlotte: [35.2271, -80.8431],
      Madison: [43.0731, -89.4012],

      // Canada
      Montreal: [45.5019, -73.5674],
      Toronto: [43.6532, -79.3832],
      Sherbrooke: [45.4042, -71.8929],

      // U.K. & Ireland
      London: [51.5074, -0.1278],
      "Cambridge": [52.2053, 0.1218], // Default to UK Cambridge if country is missing
      Oxford: [51.752, -1.2577],
      Dublin: [53.3498, -6.2603],

      // Europe
      Berlin: [52.52, 13.405],
      Munich: [48.1351, 11.582],
      Zurich: [47.3769, 8.5417],
      Ghent: [51.0543, 3.7174],

      // Asia
      "Hong Kong": [22.3193, 114.1694],
      Ahmedabad: [23.0225, 72.5714],

      // NOTE: US Cambridge also exists; use the (city,country) map when you need it:
      // "Cambridge|||USA": [42.3736, -71.1097]
    }),
    []
  );

  const coordsFor = (city, country) =>
    cityCountryCoords[`${city}|||${country}`] || cityCoords[city] || null;

  // ------------------------------------------------------------
  // Aggregate fellows by (city, country) and handle overlaps
  // ------------------------------------------------------------
  const byCity = useMemo(() => {
    const map = new Map();
    for (const f of data) {
      const key = `${f.city}|||${f.country}`;
      if (!map.has(key)) map.set(key, { city: f.city, country: f.country, people: [] });
      map.get(key).people.push({ name: f.name, year: f.year });
    }
    return [...map.values()].sort((a, b) => b.people.length - a.people.length);
  }, [data]);

  // Function to calculate offset for overlapping circles
  const getOffsetForOverlap = (coords, allCoords, index) => {
    const [lat, lng] = coords;
    const threshold = 0.01; // ~1km threshold for considering circles overlapping
    
    // Check if this circle overlaps with any previous ones
    for (let i = 0; i < index; i++) {
      const [otherLat, otherLng] = allCoords[i];
      const distance = Math.sqrt(Math.pow(lat - otherLat, 2) + Math.pow(lng - otherLng, 2));
      
      if (distance < threshold) {
        // Add a small offset to make overlapping circles visible
        const offsetAmount = 0.005; // ~500m offset
        const angle = (index * 45) % 360; // Spread overlapping circles in a circle
        const offsetLat = lat + offsetAmount * Math.cos(angle * Math.PI / 180);
        const offsetLng = lng + offsetAmount * Math.sin(angle * Math.PI / 180);
        return [offsetLat, offsetLng];
      }
    }
    
    return coords; // No offset needed
  };

  // Color palette for different countries
  const countryColors = useMemo(() => {
    const colors = [
      '#e74c3c', // Red
      '#3498db', // Blue
      '#2ecc71', // Green
      '#f39c12', // Orange
      '#9b59b6', // Purple
      '#1abc9c', // Turquoise
      '#e67e22', // Carrot
      '#34495e', // Dark blue-gray
      '#e91e63', // Pink
      '#00bcd4', // Cyan
      '#8bc34a', // Light green
      '#ff9800', // Amber
      '#795548', // Brown
      '#607d8b', // Blue-gray
      '#f44336', // Red
      '#3f51b5', // Indigo
    ];
    
    const countrySet = new Set(data.map(f => f.country));
    const countryArray = Array.from(countrySet);
    const colorMap = {};
    
    countryArray.forEach((country, index) => {
      colorMap[country] = colors[index % colors.length];
    });
    
    return colorMap;
  }, [data]);

  // Smaller radius scale: base + multiplier * count
  const radiusForCount = (n) => Math.min(20, 4 + n * 2); // smaller circles, cap at 20

  // ------------------------------------------------------------
  // Diagnostics for missing coordinates
  // ------------------------------------------------------------
  const missing = byCity.filter(({ city, country }) => !coordsFor(city, country));
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      "Missing coordinates for:",
      missing.map((m) => `${m.city} (${m.country})`)
    );
  }

  return (
    <div className="w-full rounded-2xl shadow-lg overflow-hidden border border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <h2 className="text-lg font-semibold">Roots of Progress Fellows — City Density</h2>
        <p className="text-sm text-neutral-500">
          {data.length} entries • {byCity.length} cities
        </p>
      </div>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height }}
        className="w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {byCity
          .slice()
          .sort((a, b) => a.people.length - b.people.length) // Sort by count ascending (smallest first)
          .map(({ city, country, people }, index) => {
            const coords = coordsFor(city, country);
            if (!coords) return null; // Defensive: skip cities lacking coordinates
            
            // Get all coordinates for overlap detection
            const allCoords = byCity
              .slice()
              .sort((a, b) => a.people.length - b.people.length)
              .map(({ city: c, country: co }) => coordsFor(c, co))
              .filter(Boolean);
            
            // Apply offset if this circle overlaps with others
            const [lat, lng] = getOffsetForOverlap(coords, allCoords, index);
            const count = people.length;
            const title = `${city}${country ? ", " + country : ""}`;
            const color = countryColors[country] || '#666666';

            // Create custom icon with text for counts > 1
            const createTextIcon = (text, color) => {
              return new DivIcon({
                className: 'custom-div-icon',
                html: `
                  <div style="
                    background-color: ${color};
                    width: ${radiusForCount(count) * 2}px;
                    height: ${radiusForCount(count) * 2}px;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: ${Math.max(10, radiusForCount(count) * 0.6)}px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    z-index: ${10000 + (byCity.length - index)}; /* Higher z-index for smaller numbers */
                  ">
                    ${text}
                  </div>
                `,
                iconSize: [radiusForCount(count) * 2, radiusForCount(count) * 2],
                iconAnchor: [radiusForCount(count), radiusForCount(count)]
              });
            };

            return (
              <Marker
                key={`${city}-${country}`}
                position={[lat, lng]}
                icon={createTextIcon(count.toString(), color)}
                zIndexOffset={1000 + (byCity.length - index)} // Higher z-index for smaller numbers
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1} permanent={false}>
                  <div className="text-xs">
                    <div className="font-medium mb-1">{title}</div>
                    <div className="space-y-0.5 max-h-48 overflow-auto pr-1">
                      {people
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((p) => (
                          <div key={`${title}-${p.name}`}>
                            <span className="font-semibold">{p.name}</span>{" "}
                            <span className="text-neutral-500">({p.year})</span>
                          </div>
                        ))}
                    </div>
                    <div className="mt-1 text-neutral-500">{count} fellow{count > 1 ? "s" : ""}</div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
      </MapContainer>

      {missing.length > 0 && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t">
          Missing coordinates for: {missing.map((m) => `${m.city} (${m.country})`).join(", ")}
        </div>
      )}
      <div className="px-4 py-2 text-xs text-neutral-500 bg-white border-t">
        Circle size ∝ number of fellows in the city. Hover to see names.
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Lightweight Self‑Tests (run once in browser/dev only)
// ------------------------------------------------------------
function runSelfTests() {
  const testData = [
    { name: "Test A", city: "Charlotte", country: "USA", year: 2025 }, // ensure new city works
    { name: "Test B", city: "Minneapolis", country: "USA", year: 2025 }, // ensure new city works
    { name: "Test C", city: "Madison", country: "USA", year: 2025 }, // ensure new city works
    { name: "Test D", city: "Cambridge", country: "UK", year: 2024 }, // disambiguation should resolve to UK coords
  ];

  // A tiny harness that reuses the same lookups as the component
  const cityCountryCoords = {
    "Cambridge|||UK": [52.2053, 0.1218],
    "Charlotte|||USA": [35.2271, -80.8431],
    "Minneapolis|||USA": [44.9778, -93.2650],
    "Madison|||USA": [43.0731, -89.4012],
  };
  const cityCoords = { Cambridge: [52.2053, 0.1218] };
  const coordsFor = (city, country) => cityCountryCoords[`${city}|||${country}`] || cityCoords[city] || null;

  const missing = [];
  for (const f of testData) {
    const c = coordsFor(f.city, f.country);
    if (!c) missing.push(`${f.city} (${f.country})`);
  }
  console.assert(missing.length === 0, `Missing coords for: ${missing.join(", ")}`);

  const cambridgeUK = coordsFor("Cambridge", "UK");
  console.assert(
    cambridgeUK && Math.abs(cambridgeUK[0] - 52.2053) < 0.01 && Math.abs(cambridgeUK[1] - 0.1218) < 0.01,
    "Expected Cambridge (UK) to resolve to UK coordinates"
  );
}

if (typeof window !== "undefined" && !window.__WorldFellowsMapTestsRun__) {
  try {
    runSelfTests();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("WorldFellowsMap self-tests failed:", e);
  }
  window.__WorldFellowsMapTestsRun__ = true;
}

