import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS here
import { MapPin, Users, Square, Brain, Terminal, Server, Database, Code, Building } from 'lucide-react';

interface DistrictData {
  name: string;
  area: number;
  population: number;
  density: number;
  color: string;
  center: [number, number];
}

interface AgentlandLocation {
  name: string;
  type: 'headquarters' | 'datacenter' | 'office' | 'partner';
  description: string;
  position: [number, number];
  icon: React.ReactNode;
}

const SaarlandMap: React.FC = () => {
  const mapRef = useRef<any>(null); // Will store the Leaflet map instance
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  // const [mapLoaded, setMapLoaded] = useState(false); // mapLoaded state might not be needed for init logic

  // Agentland locations across Saarland
  const agentlandLocations: AgentlandLocation[] = [
    {
      name: "ClaudeOSaar Headquarters",
      type: "headquarters",
      description: "Main headquarters of ClaudeOSaar with executive offices, R&D center, and flagship workspace showroom.",
      position: [49.235, 6.997], // Saarbrücken
      icon: <Building className="h-5 w-5 text-primary-500" />
    },
    {
      name: "Saarbrücken Data Center",
      type: "datacenter",
      description: "Primary data center facility with high-performance computing infrastructure for AI workspaces.",
      position: [49.244, 7.017], // Saarbrücken
      icon: <Server className="h-5 w-5 text-blue-500" />
    },
    {
      name: "agentland.saarland Innovation Lab",
      type: "office",
      description: "Research lab focused on next-generation AI agent development and testing.",
      position: [49.313, 6.752], // Saarlouis
      icon: <Brain className="h-5 w-5 text-purple-500" />
    },
    {
      name: "Terminal Access Point",
      type: "office",
      description: "Customer demonstration center for terminal.claudeosaar.saarland with hands-on training.",
      position: [49.468, 7.169], // St. Wendel
      icon: <Terminal className="h-5 w-5 text-green-500" />
    },
    {
      name: "Documentation Center",
      type: "office",
      description: "Technical writing and documentation team for docs.claudeosaar.saarland.",
      position: [49.347, 7.180], // Neunkirchen
      icon: <Code className="h-5 w-5 text-yellow-500" />
    },
    {
      name: "Backup Data Center",
      type: "datacenter",
      description: "Secondary data center for disaster recovery and business continuity.",
      position: [49.214, 7.333], // Homburg (Saarpfalz-Kreis)
      icon: <Database className="h-5 w-5 text-red-500" />
    },
    {
      name: "MCP Research Facility",
      type: "partner",
      description: "Joint research facility with Saarland University focused on MCP Server development.",
      position: [49.257, 7.045], // Saarbrücken (University area)
      icon: <Server className="h-5 w-5 text-orange-500" />
    }
  ];

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

        // Add district circles and markers
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

        // Add agentland location markers
        agentlandLocations.forEach((location) => {
          // Create a custom pulsing marker for agentland locations
          const getMarkerHtml = (isSelected: boolean) => {
            let typeColor = '';
            switch(location.type) {
              case 'headquarters': typeColor = '#3b82f6'; break; // primary blue
              case 'datacenter': typeColor = '#6366f1'; break; // indigo
              case 'office': typeColor = '#a855f7'; break; // purple
              case 'partner': typeColor = '#ec4899'; break; // pink
            }
            
            return `
              <div class="relative">
                <div class="${isSelected ? 'animate-pulse' : ''}" style="background-color: ${typeColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; z-index: 10; position: absolute; top: 4px; left: 4px;"></div>
                <div class="${isSelected ? 'animate-ping' : ''}" style="background-color: ${typeColor}; opacity: 0.3; width: 20px; height: 20px; border-radius: 50%; z-index: 5;"></div>
              </div>
            `;
          };

          const marker = L.marker(location.position, {
            icon: L.divIcon({
              className: 'agentland-marker',
              html: getMarkerHtml(false),
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(mapInstance);

          // Create popup with custom style
          const popupContent = `
            <div class="p-4 min-w-[250px]">
              <div class="flex items-center gap-2 mb-2">
                <div style="color: ${location.type === 'headquarters' ? '#3b82f6' : location.type === 'datacenter' ? '#6366f1' : location.type === 'office' ? '#a855f7' : '#ec4899'};" class="rounded-full p-1.5 bg-black/20">
                  ${location.type === 'headquarters' 
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>' 
                    : location.type === 'datacenter' 
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>' 
                    : location.type === 'office' 
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.05 3.05a7 7 0 0 1 9.9 9.9L3.05 28.95a7 7 0 0 1-9.9-9.9L9.05 3.05"/><path d="M9.05 3.05a7 7 0 0 1 9.9 9.9"/></svg>' 
                    : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'}
                </div>
                <h3 class="font-bold text-base">${location.name}</h3>
              </div>
              <p class="text-sm text-gray-300 mb-2">${location.description}</p>
              <div class="text-xs font-medium text-gray-400 bg-black/20 px-2 py-1 rounded inline-block">
                ${location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </div>
            </div>
          `;
          marker.bindPopup(popupContent);

          marker.on('mouseover', () => {
            setSelectedLocation(location.name);
            // Update marker to pulsing state
            marker.setIcon(L.divIcon({
              className: 'agentland-marker',
              html: getMarkerHtml(true),
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            }));
          });
          
          marker.on('mouseout', () => {
            setSelectedLocation(null);
            // Revert marker to normal state
            marker.setIcon(L.divIcon({
              className: 'agentland-marker',
              html: getMarkerHtml(false),
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            }));
          });
          
          // Open popup on click
          marker.on('click', () => {
            marker.openPopup();
          });
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

  // Calculate average density for reference (used in previous UI)
  // const avgDensity = Math.round(totals.population / totals.area);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            agentland.saarland Network
          </h2>
          <p className="text-xl text-gray-400">
            Serving all six districts of Saarland with our sovereign AI infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div id="saarland-map" style={{ height: '600px', width: '100%', background: '#1f2937' }} />
              <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-400">
                  © OpenStreetMap contributors | © CARTO
                </p>
              </div>
              
              {/* Map Legend */}
              <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-xs font-medium text-white mb-2">Legend</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neutral-600 border border-white"></div>
                    <span className="text-xs text-gray-300">District Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
                    <span className="text-xs text-gray-300">Headquarters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 border border-white"></div>
                    <span className="text-xs text-gray-300">Data Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 border border-white"></div>
                    <span className="text-xs text-gray-300">Office</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500 border border-white"></div>
                    <span className="text-xs text-gray-300">Partner Facility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Selected Agentland Location */}
            <div className="bg-neutral-800/70 backdrop-blur-sm rounded-xl p-6 border border-neutral-700">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                agentland.saarland Locations
              </h3>
              
              {selectedLocation ? (
                (() => {
                  const location = agentlandLocations.find(loc => loc.name === selectedLocation);
                  if (!location) return null;
                  
                  let bgColor = '';
                  switch(location.type) {
                    case 'headquarters': bgColor = 'bg-blue-500/20'; break;
                    case 'datacenter': bgColor = 'bg-indigo-500/20'; break;
                    case 'office': bgColor = 'bg-purple-500/20'; break;
                    case 'partner': bgColor = 'bg-pink-500/20'; break;
                  }
                  
                  return (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-lg flex items-center gap-3 ${bgColor}`}>
                        {location.icon}
                        <h4 className="font-semibold text-white">{location.name}</h4>
                      </div>
                      <p className="text-neutral-300 text-sm">{location.description}</p>
                      <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-neutral-700/50 text-neutral-300">
                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                      </div>
                    </div>
                  );
                })()
              ) : selectedDistrict ? (
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
                  <div className="grid grid-cols-1 gap-2 text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-neutral-500" />
                      <span><span className="text-neutral-500">Area:</span> {districtData[selectedDistrict].area} km²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span><span className="text-neutral-500">Population:</span> {districtData[selectedDistrict].population.toLocaleString('de-DE')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-400">Hover over a location or district to see details</p>
              )}
            </div>

            {/* Agentland Locations List */}
            <div className="bg-neutral-800/70 backdrop-blur-sm rounded-xl p-6 border border-neutral-700">
              <h3 className="text-xl font-bold mb-4 text-white">Our Facilities</h3>
              <div className="space-y-2">
                {agentlandLocations.map((location, index) => {
                  let bgColor = '';
                  let borderColor = '';
                  
                  switch(location.type) {
                    case 'headquarters': 
                      bgColor = 'bg-blue-500/10'; 
                      borderColor = selectedLocation === location.name ? 'border-blue-500' : 'border-transparent';
                      break;
                    case 'datacenter': 
                      bgColor = 'bg-indigo-500/10'; 
                      borderColor = selectedLocation === location.name ? 'border-indigo-500' : 'border-transparent';
                      break;
                    case 'office': 
                      bgColor = 'bg-purple-500/10'; 
                      borderColor = selectedLocation === location.name ? 'border-purple-500' : 'border-transparent';
                      break;
                    case 'partner': 
                      bgColor = 'bg-pink-500/10'; 
                      borderColor = selectedLocation === location.name ? 'border-pink-500' : 'border-transparent';
                      break;
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${bgColor} ${borderColor} ${
                        selectedLocation === location.name ? 'ring-1 ring-white' : ''
                      }`}
                      onMouseEnter={() => setSelectedLocation(location.name)}
                      onMouseLeave={() => setSelectedLocation(null)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {location.icon}
                          <span className="text-white font-medium text-sm">{location.name}</span>
                        </div>
                        <span className="text-neutral-400 text-xs capitalize">{location.type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* District Summary */}
            <div className="bg-neutral-800/70 backdrop-blur-sm rounded-xl p-6 border border-neutral-700">
              <h3 className="text-xl font-bold mb-4 text-white">Saarland Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Total Area
                  </span>
                  <span className="font-semibold text-white">{totals.area.toFixed(1)} km²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Population
                  </span>
                  <span className="font-semibold text-white">{totals.population.toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    ClaudeOSaar Facilities
                  </span>
                  <span className="font-semibold text-white">{agentlandLocations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Data Centers
                  </span>
                  <span className="font-semibold text-white">{agentlandLocations.filter(l => l.type === 'datacenter').length}</span>
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
