import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd as AdMobBanner, BannerAdSize } from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../../constants/Constants';

export const BannerAd = () => {
  return (
    <View style={styles.container}>
      <AdMobBanner
        unitId={ADMOB_IDS.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
  },
});

export default BannerAd;