import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartService from '../../services/ChartService';
import styles from './yield_achievement_rate.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface YieldAchievementRateChartProps {
  chartId: number;
}

const YieldAchievementRateChart: React.FC<YieldAchievementRateChartProps> = ({ chartId }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChartService.getChartData(chartId);
        const chartInfo = response.data;
        const data = JSON.parse(chartInfo.chartData);

        // Format the data
        const labels = Array.from(new Set(data.productNumber));
        const datasets = [{
          label: '產量達成率',
          data: data.yieldAchievementRate,
          backgroundColor: 'rgba(0,123,255,0.6)', // Blue background
          borderColor: 'rgba(0,123,255,1)', // Blue border
          borderWidth: 1,
        }];

        setChartData({
          labels,
          datasets,
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
      <div className={styles.chartHeader}>產量達成率</div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: '品號' },
            },
            y: {
              title: { display: true, text: '平均產量達成率 (%)' },
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default YieldAchievementRateChart;
