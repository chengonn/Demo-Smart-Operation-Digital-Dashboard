import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartService from '../../services/ChartService';
import styles from './subcontracting_refund_rate.module.css';

// 註冊 Chart.js 必要組件
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

interface SubcontractingRefundRateProps {
  chartId: number;
}

const SubcontractingRefundRateChart: React.FC<SubcontractingRefundRateProps> = ({ chartId }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ChartService.getChartData(chartId);
        if (response.result && response.data) {
          const rawData = JSON.parse(response.data.chartData);

          // 分組計算每個品號的退貨率
          const groupedData = rawData.productNumber.reduce((acc: any, product: string, index: number) => {
            const processedVolume = parseFloat(rawData.processedVolume[index]);
            const refundVolume = parseFloat(rawData.refundVolume[index]);
            if (!acc[product]) {
              acc[product] = { totalProcessed: 0, totalRefund: 0 };
            }
            acc[product].totalProcessed += processedVolume;
            acc[product].totalRefund += refundVolume;
            return acc;
          }, {});

          // 生成最終數據結構
          const labels = Object.keys(groupedData);
          const data = labels.map((label) => {
            const { totalProcessed, totalRefund } = groupedData[label];
            return totalProcessed > 0 ? (totalRefund / totalProcessed) * 100 : 0;
          });

          // 隨機生成顏色
          const backgroundColor = labels.map(
            () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`
          );

          setChartData({
            labels,
            datasets: [
              {
                data,
                backgroundColor,
              },
            ],
          });
        } else {
          setError('Failed to fetch chart data');
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Error fetching chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [chartId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!chartData) return <div>No data available</div>;

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset;
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const total = dataset.data.reduce((acc: number, value: number) => acc + value, 0);
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${currentValue.toFixed(2)}% (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: '#000',
        formatter: (value: number, context: any) => `${value.toFixed(2)}%`,
        font: {
          size: 12,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>委外加工退貨率</div>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SubcontractingRefundRateChart;
