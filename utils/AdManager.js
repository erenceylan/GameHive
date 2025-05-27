import { ADMOB_IDS, ADMOB_CONFIG } from '../constants/Constants';
import { InterstitialAd, RewardedAd, BannerAd, TestIds } from 'react-native-google-mobile-ads';

class AdManager {
  constructor() {
    this.lastAdTime = 0;
    this.adsShownInSession = 0;
    this.gamePlayCount = 0;
  }

  canShowAd() {
    const now = Date.now();
    const timeSinceLastAd = (now - this.lastAdTime) / 1000;
    
    return (
      this.adsShownInSession < ADMOB_CONFIG.MAX_ADS_PER_SESSION &&
      timeSinceLastAd >= ADMOB_CONFIG.MIN_TIME_BETWEEN_ADS
    );
  }

  async showInterstitial() {
    if (!this.canShowAd()) return false;

    this.gamePlayCount++;
    
    if (this.gamePlayCount % ADMOB_CONFIG.INTERSTITIAL_INTERVAL !== 0) {
      return false;
    }

    const interstitial = InterstitialAd.createForAdRequest(ADMOB_IDS.INTERSTITIAL);

    return new Promise((resolve) => {
      interstitial.addAdEventListener('loaded', () => {
        interstitial.show();
        this.lastAdTime = Date.now();
        this.adsShownInSession++;
        resolve(true);
      });

      interstitial.addAdEventListener('error', () => {
        resolve(false);
      });

      interstitial.load();
    });
  }

  async showRewarded() {
    if (!this.canShowAd()) return false;

    const rewarded = RewardedAd.createForAdRequest(ADMOB_IDS.REWARDED);

    return new Promise((resolve) => {
      rewarded.addAdEventListener('loaded', () => {
        rewarded.show();
        this.lastAdTime = Date.now();
        this.adsShownInSession++;
        resolve(true);
      });

      rewarded.addAdEventListener('earned_reward', (reward) => {
        resolve({ success: true, reward });
      });

      rewarded.addAdEventListener('error', () => {
        resolve(false);
      });

      rewarded.load();
    });
  }

  getBannerProps() {
    return {
      unitId: ADMOB_IDS.BANNER,
      size: 'BANNER',
    };
  }

  resetSession() {
    this.adsShownInSession = 0;
    this.gamePlayCount = 0;
    this.lastAdTime = 0;
  }
}

export default new AdManager();