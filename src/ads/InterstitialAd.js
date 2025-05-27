import { InterstitialAd as AdMobInterstitial } from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../../constants/Constants';

export const showInterstitial = () => {
  const interstitial = AdMobInterstitial.createForAdRequest(ADMOB_IDS.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });

  return new Promise((resolve) => {
    interstitial.addAdEventListener('loaded', () => {
      interstitial.show();
      resolve(true);
    });

    interstitial.addAdEventListener('error', () => {
      resolve(false);
    });

    interstitial.load();
  });
};

export default { showInterstitial };