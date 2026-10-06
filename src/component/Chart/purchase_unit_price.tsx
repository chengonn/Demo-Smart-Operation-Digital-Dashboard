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
import styles from './purchase_unit_price.module.css';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PurchaseUnitPriceChartProps {
  chartId: number;
}

const PurchaseUnitPriceChart: React.FC<PurchaseUnitPriceChartProps> = ({ chartId }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChartService.getChartData(chartId);
        const chartInfo = response.data;
        const data = JSON.parse(chartInfo.chartData);

        // Format the dates as needed
        const formattedDates = data.date.map((date: string) => date.split(' ')[0]);

        const labels = Array.from(new Set(formattedDates)); // unique dates
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
            x: formattedDates[index], // formatted date
            y: data.purchaseUnitPrice[index], // purchase price
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
      <div className={styles.chartHeader}>進貨單價</div>
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
              display: false, // 隱藏數據標籤（如果有啟用）
            },
          },
          scales: {
            x: {
              type: 'time',
              time: { unit: 'day' },
              title: { display: true, text: '日期' },
            },
            y: {
              title: { display: true, text: '進貨單價 (元)' },
            },
          },
        }}
      />
    </div>
  );
};

export default PurchaseUnitPriceChart;
