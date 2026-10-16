import { t } from "../../demo/i18n";
//src\pages\ProfileSetup\AwaitingApproval.tsx
import React from 'react';
import styles from './AwaitingApproval.module.css';
import LOGO from '../../assets/icon/Logo-GIF-crop.gif'

const AwaitingApproval: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>

      <div className={styles.title}>
        <img src={t(LOGO)} className={styles.LOGO} />
        <br />
        <span className={styles.theBig}>{t("等待管理員審核")}</span>
        <span className={styles.theSmall}>{t("您的資料已經提交，請等待管理員審核。")}</span>
      </div>
    </div>
  );
};

export default AwaitingApproval;
