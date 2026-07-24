import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MetricSnapshot } from '../data/db';

interface MetricChartProps {
    data: MetricSnapshot[];
    metricKey: 'cpuUsage' | 'memoryUsage' | 'latencyMs';
    title: string;
    color: string;
    unit: string;
}

export function MetricChart({ data, metricKey, title, color, unit }: MetricChartProps) {
    // Formata o timestamp Unix para exibir apenas as horas e minutos (ex: 14:30)
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
            <h3 style={{ margin: '0 0 1rem 0', color: '#333', fontFamily: 'sans-serif' }}>{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            stroke="#888"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="#888"
                            fontSize={12}
                            unit={unit}
                        />
                        <Tooltip
                            labelFormatter={(label) => {
                                if (label && (typeof label === 'number' || typeof label === 'string')) {
                                    return new Date(label).toLocaleString();
                                }
                                return '';
                            }}
                            // Tipamos o value como genérico e aceitamos que o Recharts envie qualquer tipo válido
                            formatter={(value: any) => [`${value}${unit}`, title]}
                        />
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
