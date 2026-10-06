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

interface InventoryLevelsChartProps {
  chartId: number;
}

const InventoryLevelsChart: React.FC<InventoryLevelsChartProps> = ({ chartId }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChartService.getChartData(chartId);
        const chartInfo = response.data;
        const data = JSON.parse(chartInfo.chartData);

        const formattedDates = data.date.map((date: string) => date.split(' ')[0]);
        const labels = Array.from(new Set(formattedDates));

        const datasets = data.productNumber.reduce((acc: any, productNumber: string, index: number) => {
          if (!acc[productNumber]) {
            acc[productNumber] = {
              label: productNumber,
              data: [],
              borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              borderWidth: 2,
              fill: false,
            };
          }
          acc[productNumber].data.push({
            x: formattedDates[index],
            y: data.inventoryLevels[index],
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
      <div className={styles.chartHeader}>庫存水位</div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: { enabled: false },
            datalabels: { display: false },
          },
          scales: {
            x: {
              type: 'time',
              time: { unit: 'day' },
              title: { display: true, text: '日期' },
            },
            y: {
              title: { display: true, text: '庫存水位 (%)' },
            },
          },
        }}
      />
    </div>
  );
};

export default InventoryLevelsChart;
