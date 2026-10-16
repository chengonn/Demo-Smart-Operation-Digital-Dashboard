import { t, getLocale } from "../../demo/i18n";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartService from '../../services/ChartService';
import styles from './time_efficiency.module.css';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TimeEfficiencyChartProps {
  chartId: number;
}

const TimeEfficiencyChart: React.FC<TimeEfficiencyChartProps> = ({ chartId }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChartService.getChartData(chartId);
        const chartInfo = response.data;
        const data = JSON.parse(chartInfo.chartData);

        // 移除時間部分，只保留日期
        const formattedDates = data.date.map((date: string) => date.split(' ')[0]);

        const labels = Array.from(new Set(formattedDates));
        const datasets = data.productionLineName.reduce((acc: any, lineName: string, index: number) => {
          if (!acc[lineName]) {
            acc[lineName] = {
              label: lineName,
              data: [],
              borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              borderWidth: 2,
              fill: true, // 設為 true 使其變成堆疊面積圖
            };
          }
          acc[lineName].data.push({
            x: formattedDates[index], // 使用格式化後的日期
            y: data.timeEfficiency[index],
          });
          return acc;
        }, {});

        setChartData({
          labels,
          datasets: Object.values(datasets),
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [chartId]);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>{t("工時效率")}</div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false, // 禁用工具提示
            },
            datalabels: {
              display: false, // 隱藏數據標籤
            },
          },
          scales: {
            x: {
              type: 'time',
              time: { unit: 'day' },
              title: { display: true, text: '日期' },
              grid: {
                display: true, // 顯示 x 軸的網格線
              },
              ticks: {
                display: true, // 顯示 x 軸上的刻度
                callback: function(value: any) {
                  // 格式化日期顯示
                  return new Date(value).toLocaleDateString(getLocale()); // 自訂日期格式
                },
              },
            },
            y: {
              title: { display: true, text: '工時效率 (%)' },
              stacked: true, // 啟用堆疊顯示
              grid: {
                display: true, // 顯示 y 軸的網格線
                borderWidth: 0, // 隱藏 y 軸的邊框
              }as any,
              ticks: {
                display: true, // 顯示 y 軸上的刻度
                callback: function(value: number) {
                  return `${value}%`; // 顯示百分比
                }as any,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default TimeEfficiencyChart;
