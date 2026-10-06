import React, { useState, useEffect } from 'react';
import styles from './SmartHTML.module.css';
import ChartService from '../../services/ChartService';

interface SmartHTMLProps {
  chartHTML: string;
}

const SmartHTML: React.FC<SmartHTMLProps> = ({ chartHTML }) => {
  const [syncTime, setSyncTime] = useState<string>('');

  useEffect(() => {
    const fetchSyncTime = async () => {
      try {
        const response = await ChartService.getSyncTime();
        if (response.data && response.data.lastSyncTime) {
          setSyncTime(response.data.lastSyncTime);
        }
      } catch (error) {
        console.error('Failed to fetch sync time:', error);
      }
    };

    fetchSyncTime();
  }, []);

  return (
    <div className={styles.iFrameContainer}>

      {chartHTML ? (
        <iframe
          src={chartHTML}
          title="Smart Viewer"
          className={styles.iframe}
        ></iframe>
      ) : (
        <div className='loadingMsg'></div>
      )}

      <div className={styles.syncTime}>
        {syncTime ? `最後同步時間: ${new Date(syncTime).toLocaleString()}` : 'Fetching sync time...'}
      </div>
    </div>
  );
};

export default SmartHTML;

// import React, { useState, useEffect } from 'react';
// import styles from './SmartHTML.module.css';
// import ChartService from '../../services/ChartService';
// import LineChart from '../../component/Chart/LineChart';
// import SubcontractingRefundRateChart from '../../component/Chart/subcontracting_refund_rate';
// import TimeEfficiencyChart from '../../component/Chart/time_efficiency';
// import PurchaseUnitPriceChart from '../../component/Chart/purchase_unit_price';
// import YieldAchievementRateChart from '../../component/Chart/yield_achievement_rate';
// import RefundRateChart from '../../component/Chart/refund_rate';
// import TurnoverRateChart from '../../component/Chart/turnover_rate';
// import CostVarianceChart from '../../component/Chart/cost_variance_rate';
// import InventoryLevelsChart from '../../component/Chart/Inventory_levels';

// interface SmartHTMLProps {
//   chartId: number; // 傳入 chartId 作為屬性
// }

// const SmartHTML: React.FC<SmartHTMLProps> = ({ chartId }) => {
//   const [syncTime, setSyncTime] = useState<string>('');
//   const [chartData, setChartData] = useState<any>(null); // 用於儲存圖表數據

//   useEffect(() => {
//     const fetchSyncTime = async () => {
//       try {
//         const response = await ChartService.getSyncTime();
//         if (response.data && response.data.lastSyncTime) {
//           setSyncTime(response.data.lastSyncTime);
//         }
//       } catch (error) {
//         console.error('Failed to fetch sync time:', error);
//       }
//     };

//     fetchSyncTime();
//   }, []);

//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         const response = await ChartService.getChartData(chartId);
//         if (response.result) {
//           setChartData(response.data); // 儲存圖表數據
//         } else {
//           console.error('Failed to fetch chart data:', response.message);
//         }
//       } catch (error) {
//         console.error('Error fetching chart data:', error);
//       }
//     };

//     fetchChartData();
//   }, [chartId]);

//   const renderChart = () => {
//     switch (chartId) {
//       case 13:
//         return <SubcontractingRefundRateChart chartId={chartId} />;
//       case 11:
//         return <TimeEfficiencyChart chartId={chartId} />;
//       case 15:
//         return <PurchaseUnitPriceChart chartId={chartId} />;
//       case 10:
//         return <YieldAchievementRateChart chartId={chartId} />;
//       case 12:
//         return <RefundRateChart chartId={chartId} />;
//       case 14:
//         return <CostVarianceChart chartId={chartId} />;
//       case 16:
//         return <TurnoverRateChart chartId={chartId} />;
//       case 17:
//         return <InventoryLevelsChart chartId={chartId} />;
//       default:
//         return chartData ? <LineChart data={chartData} /> : <div>Loading chart...</div>;
//     }
//   };

//   return (
//     <div className={styles.iFrameContainer}>
//       {renderChart()}

//       <div className={styles.syncTime}>
//         {syncTime ? `最後同步時間: ${new Date(syncTime).toLocaleString()}` : 'Fetching sync time...'}
//       </div>
//     </div>
//   );
// };

// export default SmartHTML;
