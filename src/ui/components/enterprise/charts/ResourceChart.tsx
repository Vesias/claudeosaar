import React from 'react';

interface ResourceChartProps {
  data: any[];
  type: 'pie' | 'bar' | 'line' | 'allocation';
}

export function ResourceChart({ data, type }: ResourceChartProps) {
  // For a real implementation, you would use a charting library like recharts or chart.js
  // This is a simplified visualization
  
  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.amount / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;
            
            // Simple pie slice path
            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
            const color = colors[index % colors.length];
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={color}
                  stroke="#1F2937"
                  strokeWidth="2"
                />
                <text
                  x={100 + 50 * Math.cos(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                  y={100 + 50 * Math.sin(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {percentage.toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
        
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <ul className="space-y-2">
            {data.map((item, index) => {
              const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
              const color = colors[index % colors.length];
              
              return (
                <li key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }} />
                  <span className="text-sm text-gray-300">{item.category}: €{item.amount.toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };
  
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value || item.amount || 0));
    
    return (
      <div className="h-64">
        <div className="flex items-end gap-4 h-full">
          {data.map((item, index) => {
            const value = item.value || item.amount || 0;
            const height = (value / maxValue) * 100;
            const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full">
                  <div 
                    className="w-full rounded-t"
                    style={{ 
                      height: `${height * 2}px`,
                      backgroundColor: color,
                      marginTop: `${200 - height * 2}px`
                    }}
                  />
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-300">
                    {value}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-2 text-center">{item.label || item.category}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(item => item.value || item.cost || 0));
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = 150 - ((item.value || item.cost || 0) / maxValue) * 140;
      return `${x},${y}`;
    });
    
    return (
      <div className="h-64">
        <svg className="w-full h-full" viewBox="0 0 300 160">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 35 + 10}
              x2="300"
              y2={i * 35 + 10}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}
          
          {/* Line chart */}
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = 150 - ((item.value || item.cost || 0) / maxValue) * 140;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y="155"
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {item.label || item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };
  
  const renderAllocationChart = () => {
    const tiers = ['free', 'pro', 'enterprise'];
    const colors = { free: '#10B981', pro: '#3B82F6', enterprise: '#8B5CF6' };
    
    return (
      <div className="h-64">
        <div className="grid grid-cols-3 gap-4 h-full">
          {tiers.map(tier => {
            const tierData = data.find(d => d.tier === tier) || { cpu: 0, memory: 0, storage: 0, count: 0 };
            
            return (
              <div key={tier} className="flex flex-col">
                <h4 className="text-sm font-medium mb-2 capitalize">{tier}</h4>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>CPU</span>
                      <span>{tierData.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${tierData.cpu}%`,
                          backgroundColor: colors[tier]
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Memory</span>
                      <span>{tierData.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${tierData.memory}%`,
                          backgroundColor: colors[tier]
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Storage</span>
                      <span>{tierData.storage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${tierData.storage}%`,
                          backgroundColor: colors[tier]
                        }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {tierData.count} workspaces
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  switch (type) {
    case 'pie':
      return renderPieChart();
    case 'bar':
      return renderBarChart();
    case 'line':
      return renderLineChart();
    case 'allocation':
      return renderAllocationChart();
    default:
      return <div>Chart type not supported</div>;
  }
}