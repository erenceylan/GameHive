import { RewardedAd as AdMobRewarded } from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../../constants/Constants';

export const showRewarded = () => {
  const rewarded = AdMobRewarded.createForAdRequest(ADMOB_IDS.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
  });

  return new Promise((resolve) => {
    rewarded.addAdEventListener('loaded', () => {
      rewarded.show();
    });

    rewarded.addAdEventListener('earned_reward', (reward) => {
      resolve({ success: true, reward });
    });

    rewarded.addAdEventListener('error', () => {
      resolve({ success: false });
    });

    rewarded.load();
  });
};

export default { showRewarded };