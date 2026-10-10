import React from 'react';
import Svg, { Polyline, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
import { hexToRgba } from './chartConfig';

interface Props {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

// Tiny inline trend chart for KPI cards (no axes, no labels).
const Sparkline: React.FC<Props> = ({ data, color, width = 72, height = 28 }) => {
  if (!data.length) return <Svg width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const pad = 3;
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = pad + (height - pad * 2) * (1 - (v - min) / range);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gid = `spark-${color.replace('#', '')}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.28} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Polygon points={areaPoints} fill={`url(#${gid})`} />
      <Polyline
        points={points}
        fill="none"
        stroke={hexToRgba(color, 0.95)}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Sparkline;
