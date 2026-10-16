import { t, getLocale } from "../../demo/i18n";
import React, { useState, useEffect } from 'react';
import styles from './dashBoardForm.module.css';
import closeIcon from '../../assets/icon/X.svg';
import ChartService from '../../services/ChartService';
import { createApplication } from '../../services/application';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardService from '../../services/DashboardService';
import { fetchAllUsers } from '../../services/UserAccountService';
import { Dashboard } from '../../services/types/dashboard';

interface MultiStepFormProps {
  onClose: () => void;
  exportData: () => Promise<void>;
  currentUserId: string;
  onDashboardCreated: (dashboard: Dashboard, charts: any[]) => void;
  selectedDashboard?: Dashboard | null;
}

interface Chart {
  id: number;
  name: string;
  isAdded: boolean;
  observable: boolean;
  showcaseImage?: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onClose, exportData, currentUserId, onDashboardCreated, selectedDashboard }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<{ id: number, name: string, observable: boolean }[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const [applyReason, setApplyReason] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedChartForApplication, setSelectedChartForApplication] = useState<number | null>(null);
  const [selectedChartId, setSelectedChartId] = useState<number | null>(null);
  const [createdDashboardId, setCreatedDashboardId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedDashboard) {
      setDashboardName(selectedDashboard.name);
      setDashboardDescription(selectedDashboard.description || '');
      fetchAvailableCharts(Number(selectedDashboard.id));
    }
  }, [selectedDashboard]);

  useEffect(() => {
    // Fetch dashboard details when currentStep is 1
    const fetchDashboardDetails = async () => {
      if (selectedDashboard && currentStep === 1) {
        try {
          const dashboardId = Number(selectedDashboard.id);
          const response = await DashboardService.getDashboardById(String(dashboardId));
          if (response) {
            setDashboardDescription(response.description || '');
          }
        } catch (error) {
          console.error('獲取儀表板詳情失敗:', error);
          alert(t('獲取儀表板詳情失敗，請稍後再試'));
        }
      }
    };

    fetchDashboardDetails();
  }, [currentStep, selectedDashboard]);

  const fetchAvailableCharts = async (dashboardId: number) => {
    try {
      const response = await ChartService.getAvailableCharts(dashboardId);
      const chartsData: Chart[] = Array.isArray(response.data) ? response.data : [];
      setCharts(chartsData);
      const initialSelectedKPIs = chartsData
        .filter((chart: Chart) => chart.isAdded)
        .map((chart: Chart) => chart.id);
      setSelectedKPIs(initialSelectedKPIs);
    } catch (error) {
      console.error('獲取可用圖表失敗:', error);
      alert(t('獲取可用圖表失敗 請稍後再試'));
    }
  };

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await ChartService.getAvailableCharts();
        const chartsData = Array.isArray(response.data) ? response.data : [];
        setCharts(chartsData);
      } catch (error) {
        console.error('Failed to fetch charts:', error);
        alert(t('無法取得圖表 請稍後再試'));
      }
    };
    fetchCharts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await fetchAllUsers();
        console.log(userList);
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        alert(t('無法取得用戶資料 請稍後再試'));
      }
    };
    fetchUsers();
  }, []);

  const handleKpiSelection = (kpiId: number) => {
    if (charts.find(chart => chart.id === kpiId)?.observable) {
      setSelectedKPIs(prev => prev.includes(kpiId) ? prev.filter(id => id !== kpiId) : [...prev, kpiId]);
    }
  };

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartId(Number(e.target.value));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChartId) {
      alert(t('請選擇一個圖表進行申請'));
      return;
    }

    try {
      const requestData = {
        chartId: selectedChartId,
        applicant: currentUserId,
        guarantor: selectedUser || '',
        startDateStr: formatDate(startDate),
        endDateStr: formatDate(endDate),
        reason: requestContent,
      };
      const response = await createApplication(requestData);
      if (response.result) {
        alert(t('請求提交成功'));
        setIsFormVisible(false);
      } else {
        alert(t('請求提交失敗：' + response.message));
      }
    } catch (error) {
      console.error('提交 KPI 請求時出錯:', error);
      alert(t('提交 KPI 請求失敗。請重試。'));
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleClose = () => {
    onClose();
  };

  const handleApplyMore = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedChartForApplication(null);
  };

  const handleSubmit = async () => {
    if (dashboardName) {
      try {
        let dashboardId: any;

        if (selectedDashboard) {
          const id = Number(selectedDashboard.id);
          if (!id || isNaN(id)) {
            alert(t('無效的儀表板 ID'));
            return;
          }
          dashboardId = id;

          await DashboardService.updateDashboard(String(dashboardId), {
            name: dashboardName,
            description: dashboardDescription,
          });

          setCreatedDashboardId(dashboardId);
          alert(t('儀表板更新成功'));
          setCurrentStep(2);
        } else {
          const newDashboard = await DashboardService.createDashboard({
            name: dashboardName,
            description: dashboardDescription,
          });
          console.log('新建儀表板回應:', newDashboard);

          const createdId = newDashboard?.dashboardId;
          if (createdId) {
            setCreatedDashboardId(createdId);
            alert(t('儀表板創建成功'));
            setCurrentStep(2);
          } else {
            throw new Error('dashboardId missing from the response');
          }
        }
      } catch (error: any) {
        console.error('儀表板創建/更新失敗，錯誤內容:', error.response?.data || error.message);
        alert(t('儀表板創建或更新失敗。請重試。'));
      }
    } else {
      alert(t('請輸入儀表板名稱。'));
    }
  };

  const confirmChartSelection = async () => {
    if (!createdDashboardId || isNaN(createdDashboardId)) {
      alert(t('無效的儀表板 ID'));
      return;
    }

    const selectedChartsData = charts.filter(chart => selectedKPIs.includes(chart.id));
    setSelectedCharts(selectedChartsData);

    try {
      await ChartService.addChartsToDashboard(Number(createdDashboardId), selectedKPIs);
      alert(t('圖表已成功新增到儀表板'));
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('新增圖表失敗:', error);
      alert(t('新增圖表失敗 請重試'));
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await handleSubmit();
    } else if (currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <form id={styles.msform}>
          <div onClick={handleClose} className={styles.closeForm}>
            <img src={t(closeIcon)} alt={t("關閉表單")} />
          </div>
          <ul id={styles.progressbar}>
            <li className={currentStep >= 0 ? styles.active : ''}>{t("設定名稱")}</li>
            <li className={currentStep >= 1 ? styles.active : ''}>{t("說明文字")}</li>
            <li className={currentStep >= 2 ? styles.active : ''}>{t("選擇圖表")}</li>

          </ul>

          {currentStep === 0 && (
            <fieldset>
              <h2 className={styles.fstitle}>{t("儀表板名稱")}</h2>
              <input
                type="text"
                name="dashboardName"
                placeholder={t("請輸入儀表板名稱")}
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                required
                autoComplete='off'
              />
              <button className={`${styles.actionButton} ${styles.next} ${styles.firstNext}`} type="button" onClick={handleNext}>{t("下一步")}</button>
            </fieldset>
          )}

          {currentStep === 1 && (
            <fieldset>
              <h2 className={styles.fsTitle}>{t("填寫儀表板說明文字")}</h2>
              <h3 className={styles.fsSubtitle}>{t("非必填")}</h3>
              <textarea
                className={styles.dashboardDescription}
                name="dashboardDescription"
                placeholder={t("請輸入儀表板說明文字")}
                value={dashboardDescription}
                onChange={(e) => setDashboardDescription(e.target.value)}
                required
              />
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.actionButton} onClick={previousStep}>{t("上一步")}</button>
                <button type="button" className={styles.actionButton} onClick={handleNext}>{t("下一步")}</button>
              </div>
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset>
              <h2 className={styles.fsTitle}>{t("選擇圖表")}</h2>
              <h3 className={styles.fsSubtitle}>

                {t("選擇想顯示在此儀表板的圖表")}
                <br />
                <button type="button" className={styles.applyMore} onClick={handleApplyMore}>{t("或是點此申請無權限圖表")}</button>
              </h3>

              <div className={styles.theKPIs}>
                {Array.isArray(charts) && charts.map(chart => (
                  <div
                    key={chart.id}
                    className={`${styles.checkboxWrapper} ${!chart.observable ? styles.disabled : ''} ${selectedKPIs.includes(chart.id) ? styles.selected : ''}`}
                  >
                    <div
                      className={styles.LabelImgContainer}
                      onClick={() => chart.observable && handleKpiSelection(chart.id)}
                      style={{ cursor: chart.observable ? 'pointer' : 'default' }}
                    >
                      <input
                        type="checkbox"
                        id={`kpi-${chart.id}`}
                        checked={selectedKPIs.includes(chart.id)}
                        onChange={(e) => e.stopPropagation()}
                        disabled={!chart.observable}
                        className={styles.kpiInputs}
                      />
                      <label
                        htmlFor={`kpi-${chart.id}`}
                        className={!chart.observable ? styles.disabledLabel : ''}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!chart.observable) {
                            alert(t('您沒有查看此圖表的權限，若有需要請點擊申請'));
                          }
                        }}
                      >
                        {t(chart.name)}
                      </label>
                      {chart.showcaseImage && (
                        <img
                          src={t(chart.showcaseImage)}
                          alt={t('示意圖缺失')}
                          className={styles.showcaseImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (chart.observable) {
                              handleKpiSelection(chart.id);
                            } else {
                              alert(t('您沒有查看此圖表的權限，若有需要請點擊申請'));
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>


              <div className={styles.buttonGroup}>
                <button type="button" className={styles.actionButton} onClick={previousStep}>{t("上一步")}</button>
                <button type="button" className={styles.actionButton} onClick={confirmChartSelection}>{t("下一步")}</button>
              </div>
            </fieldset>
          )}



        </form>
      </div>

      {isFormVisible && (
        <div className={styles.checkFormContainer}>
          <div className={styles.formOverlay} onClick={handleCloseForm}></div>
          <div onClick={(e) => e.stopPropagation()} className={styles.checkFormContent}>
            <h2>{t("申請KPI圖表")}</h2>
            <form onSubmit={handleRequestSubmit}>
              {/* <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIapplicant'>申請人</label>
                <input
                  id='KPIapplicant'
                  type="text"
                  value={currentUserId}
                  readOnly
                  className={styles.KPIapplicant}
                />
              </div> */}

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIguarantor'>{t("您的保證人")}</label>
                <div className={styles.select}>

                  <select
                    id='KPIguarantor'
                    value={selectedUser || ''}
                    onChange={(e) => setSelectedUser(e.target.value)}>

                    <option className={styles.theKpiOption}>{t("請選擇")}</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id} className={styles.applyKpiOption}>{t(user.userName)}</option>
                    ))}
                  </select>

                </div>
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor="chart-select">{t("欲申請圖表")}</label>
                <div className={styles.select}>

                  <select id="chart-select" value={selectedChartId ?? ''} onChange={handleChartChange}>
                    <option className={styles.theKpiOption}>{t("請選擇圖表")}</option>                    {charts.map(chart => (
                      <option key={chart.id} value={chart.id} className={styles.applyKpiOption}>
                        {t(chart.name)} {t(chart.observable ? '' : '(不可觀察)')}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIstartDate'>{t("開始日期")}</label>
                <DatePicker locale={getLocale()}
                  id='KPIstartDate'
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  placeholderText="請選擇開始時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIendDate'>{t("結束日期")}</label>
                <DatePicker locale={getLocale()}
                  id='KPIendDate'
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  placeholderText="請選擇結束時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              </div>

              <div className={styles.LastapplyKPIlabelGroup}>
                <textarea
                  className={styles.applyKPItextarea}
                  placeholder={t("請填寫此次申請理由")}
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                  required
                />
              </div>

              <div className={styles.KPIbuttonGroup}>
                <button type="button" className={styles.cancel} onClick={handleCloseForm}>{t("取消")}</button>
                <button type="submit" className={styles.submit}>{t("提交")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div >
  );
};

export default MultiStepForm;
