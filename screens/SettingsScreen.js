import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Linking
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomTabBar from "../components/BottomTabBar";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export function SettingsScreen() {
  const navigation = useNavigation();
  
  // App version
  const appVersion = "1.0.0";
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6c5ce7" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#6c5ce7" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Text style={styles.menuSubText}>Learn how we process your data</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate("TermsOfService")}
          >
            <View style={styles.menuIconContainer}>
              <FontAwesome name="file-contract" size={18} color="#6c5ce7" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Terms of Service</Text>
              <Text style={styles.menuSubText}>Rules for using our application</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate("ContactUs")}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="mail" size={20} color="#6c5ce7" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Contact Us</Text>
              <Text style={styles.menuSubText}>Fill out a form for your questions or suggestions</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate("Feedback")}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#6c5ce7" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Feedback</Text>
              <Text style={styles.menuSubText}>Help us improve the application</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Image 
              source={{ uri: "https://img.freepik.com/free-vector/cute-robot-playing-game-console-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4634.jpg" }}
              style={styles.appLogo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Children's Games</Text>
            <Text style={styles.appVersion}>Version {appVersion}</Text>
            <Text style={styles.appDescription}>
              This app brings together safe and fun HTML5 games for children.
              All content has been selected to be suitable for children.
            </Text>
          </View>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <BottomTabBar active="settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#6c5ce7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6c5ce7",
    marginVertical: 10,
    marginHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  menuSubText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 18,
    color: "#ccc",
    fontWeight: "bold",
  },
  aboutContainer: {
    padding: 20,
    alignItems: "center",
  },
  appLogo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  appVersion: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  spacer: {
    height: 100, // Alt menü için boşluk
  },
});

export default SettingsScreen;