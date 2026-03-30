'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, UTCTimestamp, IChartApi } from 'lightweight-charts';
import { usePriceSocket } from '../hooks/usePriceSocket';

export const TradingChart = ({ marketId, initialData }: { marketId: number, initialData: any[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const { latestUpdate } = usePriceSocket();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#131722' }, textColor: '#d1d4dc' },
      grid: { vertLines: { color: '#334155' }, horzLines: { color: '#334155' } },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // FIX: Using type assertion to access addAreaSeries safely
    const series = (chart as any).addAreaSeries({
      lineColor: '#2962FF',
      topColor: 'rgba(41, 98, 255, 0.3)',
      bottomColor: 'rgba(41, 98, 255, 0)',
      lineWidth: 2,
    });

    if (initialData && initialData.length > 0) {
      series.setData(initialData);
    }
    
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [initialData]);

  useEffect(() => {
    if (latestUpdate && latestUpdate.marketId === marketId && seriesRef.current) {
      seriesRef.current.update({
        time: (Math.floor(Date.parse(latestUpdate.lastUpdated) / 1000)) as UTCTimestamp,
        value: latestUpdate.price,
      });
    }
  }, [latestUpdate, marketId]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};