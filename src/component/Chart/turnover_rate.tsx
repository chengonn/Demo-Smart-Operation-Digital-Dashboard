import { t } from "../../demo/i18n";
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
import styles from './time_efficiency.module.css'; // 重用樣式

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TurnoverRateChartProps {
  chartId: number;
}

const TurnoverRateChart: React.FC<TurnoverRateChartProps> = ({ chartId }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChartService.getChartData(chartId);
        const chartInfo = response.data;
        const data = JSON.parse(chartInfo.chartData);

        const formattedDates = data.date.map((date: string) => date.split(' ')[0]);

        const labels = Array.from(new Set(formattedDates));
        const datasets = data.departmentName.reduce((acc: any, departmentName: string, index: number) => {
          if (!acc[departmentName]) {
            acc[departmentName] = {
              label: departmentName,
              data: [],
              borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              borderWidth: 2,
              fill: false,
            };
          }
          acc[departmentName].data.push({
            x: formattedDates[index],
            y: data.turnoverRate[index],
          });
          return acc;
        }, {});

        setChartData({
          labels,
          datasets: Object.values(datasets),
        });
      } catch (error) {
        console.error('Error fetching turnover rate chart data:', error);
      }
    };

    fetchData();
  }, [chartId]);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>{t("離職率")}</div>
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
            },
            y: {
              title: { display: true, text: '離職率 (%)' },
            },
          },
        }}
      />
    </div>
  );
};

export default TurnoverRateChart;
