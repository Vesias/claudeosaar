import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS here
import { MapPin, Users, Square, Activity } from 'lucide-react';

interface DistrictData {
  name: string;
  area: number;
  population: number;
  density: number;
  color: string;
  center: [number, number];
}

const SaarlandMap: React.FC = () => {
  const mapRef = useRef<any>(null); // Will store the Leaflet map instance
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  // const [mapLoaded, setMapLoaded] = useState(false); // mapLoaded state might not be needed for init logic

  // District data with accurate centers
  const districtData: Record<string, DistrictData> = {
    "Regionalverband Saarbrücken": {
      name: "Regionalverband Saarbrücken",
      area: 411.0,
      population: 325352,
      density: 792,
      color: "#F44336",
      center: [49.2354, 6.9969]
    },
    "Landkreis Merzig-Wadern": {
      name: "Landkreis Merzig-Wadern",
      area: 555.1,
      population: 103763,
      density: 187,
      color: "#2196F3",
      center: [49.4417, 6.6382]
    },
    "Landkreis Neunkirchen": {
      name: "Landkreis Neunkirchen",
      area: 249.8,
      population: 131527,
      density: 526,
      color: "#4CAF50",
      center: [49.3476, 7.1797]
    },
    "Landkreis Saarlouis": {
      name: "Landkreis Saarlouis",
      area: 459.0,
      population: 193982,
      density: 423,
      color: "#FFC107",
      center: [49.3134, 6.7523]
    },
    "Saarpfalz-Kreis": {
      name: "Saarpfalz-Kreis",
      area: 418.3,
      population: 142151,
      density: 340,
      color: "#9C27B0",
      center: [49.2139, 7.3329]
    },
    "Landkreis St. Wendel": {
      name: "Landkreis St. Wendel",
      area: 476.0,
      population: 86533,
      density: 182,
      color: "#FF9800",
      center: [49.4678, 7.1686]
    }
  };

  useEffect(() => {
    let mapInstance: any = null; // L.Map type would be better if L is typed

    if (typeof window !== 'undefined' && !mapRef.current) { // Check if mapRef already has an instance
      // Dynamic import for leaflet JS only
      import('leaflet').then((LModule) => {
        const L = LModule.default || LModule; // Handle default export
        
        // Check if the container already has a map
        const mapContainer = document.getElementById('saarland-map');
        if (mapContainer && (mapContainer as any)._leaflet_id) {
          // If it already has a map, don't initialize again
          // This can happen with Fast Refresh. The cleanup should handle it,
          // but this is an extra guard.
          mapRef.current = (mapContainer as any)._leaflet_map; // try to get existing instance
          return;
        }

        mapInstance = L.map('saarland-map', {
          scrollWheelZoom: false,
          zoomControl: true
        }).setView([49.383, 7.023], 9);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(mapInstance);

        Object.entries(districtData).forEach(([name, district]) => {
          const circle = L.circle(district.center, {
            color: district.color,
            fillColor: district.color,
            fillOpacity: 0.3,
            radius: Math.sqrt(district.area) * 500,
            weight: 2
          }).addTo(mapInstance);

          const marker = L.marker(district.center, {
            icon: L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${district.color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(mapInstance);

          const popupContent = `
            <div class="p-4 min-w-[200px]">
              <h3 class="font-bold text-lg mb-2">${district.name}</h3>
              <div class="space-y-1 text-sm">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Fläche:</span> ${district.area} km²
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Einwohner:</span> ${district.population.toLocaleString('de-DE')}
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Dichte:</span> ${district.density} Einw./km²
                </div>
              </div>
            </div>
          `;
          marker.bindPopup(popupContent);
          circle.bindPopup(popupContent);

          const highlightFeature = () => {
            circle.setStyle({ fillOpacity: 0.6, weight: 3 });
            setSelectedDistrict(name);
          };
          const resetHighlight = () => {
            circle.setStyle({ fillOpacity: 0.3, weight: 2 });
            // setSelectedDistrict(null); // Avoid resetting if another feature is hovered quickly
          };

          circle.on('mouseover', highlightFeature);
          circle.on('mouseout', resetHighlight);
          marker.on('mouseover', highlightFeature);
          marker.on('mouseout', resetHighlight);
        });
        mapRef.current = mapInstance;
      });
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // If mapInstance was assigned directly (not through ref immediately)
      // else if (mapInstance) { 
      //   mapInstance.remove();
      // }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Calculate totals
  const totals = Object.values(districtData).reduce(
    (acc, district) => ({
      area: acc.area + district.area,
      population: acc.population + district.population
    }),
    { area: 0, population: 0 }
  );

  const avgDensity = Math.round(totals.population / totals.area);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Saarland Districts - Our Home
          </h2>
          <p className="text-xl text-gray-400">
            Serving all six districts of Saarland from agentland.saarland
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div id="saarland-map" style={{ height: '500px', width: '100%', background: '#1f2937' }} />
              <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-400">
                  © OpenStreetMap contributors | © CARTO
                </p>
              </div>
            </div>
          </div>

          {/* District Info Panel */}
          <div className="space-y-4">
            {/* Selected District Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                District Information
              </h3>
              {selectedDistrict ? (
                <div className="space-y-3">
                  <div 
                    className="p-3 rounded-lg flex items-center gap-3"
                    style={{ backgroundColor: districtData[selectedDistrict].color + '20' }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: districtData[selectedDistrict].color }}
                    />
                    <h4 className="font-semibold text-white">{selectedDistrict}</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-gray-500" />
                      <span><span className="text-gray-500">Area:</span> {districtData[selectedDistrict].area} km²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span><span className="text-gray-500">Population:</span> {districtData[selectedDistrict].population.toLocaleString('de-DE')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span><span className="text-gray-500">Density:</span> {districtData[selectedDistrict].density} people/km²</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Hover over a district to see details</p>
              )}
            </div>

            {/* District List */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-white">All Districts</h3>
              <div className="space-y-2">
                {Object.entries(districtData).map(([name, district]) => (
                  <div
                    key={name}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedDistrict === name ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: district.color + '20' }}
                    onMouseEnter={() => setSelectedDistrict(name)}
                    onMouseLeave={() => setSelectedDistrict(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: district.color }}
                        />
                        <span className="text-white font-medium text-sm">{name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{district.population.toLocaleString('de-DE')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-white">Saarland Total</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Total Area
                  </span>
                  <span className="font-semibold text-white">{totals.area.toFixed(1)} km²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Population
                  </span>
                  <span className="font-semibold text-white">{totals.population.toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Average Density
                  </span>
                  <span className="font-semibold text-white">{avgDensity} people/km²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.leaflet-popup-content-wrapper) {
          background-color: #1f2937 !important;
          color: white !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        :global(.leaflet-popup-content) {
          margin: 0 !important;
        }
        :global(.leaflet-popup-tip) {
          background-color: #1f2937 !important;
        }
        :global(.leaflet-control-zoom) {
          border: 1px solid #374151 !important;
          background-color: #1f2937 !important;
        }
        :global(.leaflet-control-zoom a) {
          background-color: #1f2937 !important;
          color: white !important;
          border-color: #374151 !important;
        }
        :global(.leaflet-control-zoom a:hover) {
          background-color: #374151 !important;
        }
      `}</style>
    </section>
  );
};

export default dynamic(() => Promise.resolve(SaarlandMap), { ssr: false });
