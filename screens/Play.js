import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Constants from "../constants/Constants";

const interstitial = InterstitialAd.createForAdRequest(Constants.ADMOB_INTERSTITIAL_ID, {
  requestNonPersonalizedAdsOnly: false,
});

export function Play({ route }) {
  const { gameId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
      interstitial.show();
    });

    interstitial.load();

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetch(Constants.GAME_URL + gameId)
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          setLoading(false);
          if (json?.title) {
            navigation.setOptions({ title: json.title });
          }
        })
        .catch(() => setLoading(false));
  }, [gameId, navigation]);

  const INJECT_JS = `
    setInterval(() => {
      document.querySelectorAll('video, .ads, .fg-ad-container, iframe').forEach(el => el.remove());
    }, 500);
    true;
  `;

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  if (loading) {
    return (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#4e73df" />
          <Text style={styles.loadingScreenText}>Loading game...</Text>
        </View>
    );
  }

  if (!data?.embed) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Game URL not found or failed to load!</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
      <View style={[styles.container, isFullScreen && styles.fullScreen]}>
        {!isFullScreen && (
            <View style={styles.header}>
              <Text style={styles.gameTitle} numberOfLines={1} ellipsizeMode="tail">
                {data.title || "Game"}
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={toggleFullScreen}>
                  <Ionicons name="expand" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
        )}

        <WebView
            source={{ uri: data.embed }}
            style={styles.webview}
            javaScriptEnabled
            injectedJavaScriptBeforeContentLoaded={INJECT_JS}
            injectedJavaScript={INJECT_JS}
            onError={() => console.error("An error occurred while loading the WebView.")}
            startInLoadingState
            renderLoading={() => (
                <View style={styles.loadingScreen}>
                  <ActivityIndicator size="large" color="#4e73df" />
                  <Text style={styles.loadingScreenText}>Starting game...</Text>
                </View>
            )}
        />

        {isFullScreen && (
            <View style={styles.fullScreenControls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleFullScreen}>
                <Ionicons name="contract" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  gameTitle: { flex: 1, fontSize: 16, fontWeight: "bold", color: "#333" },
  buttonsContainer: { flexDirection: "row", alignItems: "center" },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  webview: { flex: 1 },
  fullScreenControls: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
    zIndex: 101,
  },
  controlButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingScreenText: { marginTop: 10, fontSize: 16, color: "#333" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginBottom: 20 },
  backButton: { backgroundColor: "#4e73df", padding: 15, borderRadius: 10 },
  backButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});