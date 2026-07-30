import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MetricSnapshot } from '../data/db';

interface MetricChartProps {
    data: MetricSnapshot[];
    metricKey: 'cpuUsage' | 'memoryUsage' | 'latencyMs';
    title: string;
    color: string;
    unit: string;
}

/**
 * Reusable, High-Performance SVG Time-Series Chart Component.
 * Consumes continuous streaming telemetry data slices from IndexedDB.
 */
export function MetricChart({ data, metricKey, title, color, unit }: MetricChartProps) {
    
    /**
     * Converts a raw Unix timestamp millisecond value into a readable human clock string.
     * Keeps chart tracking timelines high-density by dropping full calendar metrics.
     * Example: 1718290200000 -> "14:30"
     */
    const formatXAxis = (tickItem: number) => {
        return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginBottom: '1.5rem'
        }}>
            {/* Semantic Header Title Container */}
            <h3 style={{ margin: '0 0 1rem 0', color: '#333', fontFamily: 'sans-serif' }}>{title}</h3>
            
            {/* Fixed Resolution Bounds for Responsive Layout Scaling */}
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        {/* Background Alignment Layout Grid Lines */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        
                        {/* Time Series Horizontal Data Axis Axis Controller */}
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            stroke="#888"
                            fontSize={12}
                        />
                        
                        {/* Performance Value Vertical Axis Controller */}
                        <YAxis
                            stroke="#888"
                            fontSize={12}
                            unit={unit}
                        />
                        
                        {/* Hover Telemetry Content Details Interactive Box */}
                        <Tooltip
                            labelFormatter={(label) => {
                                // Explicit runtime validation protects template evaluation against layout crashes
                                if (label && (typeof label === 'number' || typeof label === 'string')) {
                                    return new Date(label).toLocaleString();
                                }
                                return '';
                            }}
                            // Bypasses strict internal type constraints to securely attach custom dimension string units
                            formatter={(value: any) => [`${value}${unit}`, title]}
                        />
                        
                        {/* Core Data Vector Renderer Pipeline */}
                        <Line
                            type="monotone"
                            dataKey={metricKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
