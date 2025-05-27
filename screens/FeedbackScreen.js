import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export function FeedbackScreen() {
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // Form doğrulama
    if (!feedback.trim()) {
      Alert.alert("Hata", "Lütfen geri bildiriminizi girin.");
      return;
    }
    
    if (rating === 0) {
      Alert.alert("Hata", "Lütfen bir değerlendirme puanı seçin.");
      return;
    }
    
    if (email.trim() && !validateEmail(email)) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    
    // Normalde burada API'ye geri bildirim gönderilirdi
    // Şu an için basit bir bildirim gösterelim
    Alert.alert(
      "Teşekkürler!",
      "Geri bildiriminiz için teşekkür ederiz. Uygulamayı geliştirmemize yardımcı oldunuz!",
      [
        {
          text: "Tamam",
          onPress: () => {
            // Formu temizle ve geri dön
            setFeedback("");
            setRating(0);
            setEmail("");
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  // Basit e-posta doğrulama
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Yıldız derecelendirme bileşeni
  const StarRating = () => {
    const stars = [1, 2, 3, 4, 5];
    
    return (
      <View style={styles.starContainer}>
        {stars.map((star) => (
          <TouchableOpacity 
            key={star}
            onPress={() => setRating(star)}
          >
            <Text style={[
              styles.star,
              rating >= star ? styles.starActive : styles.starInactive
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF9F43" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Geri Bildirim</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Uygulamamızı Değerlendirin</Text>
            <Text style={styles.subtitle}>
              Geri bildiriminiz bizim için değerli! Uygulamayı nasıl daha iyi hale getirebileceğimiz konusunda düşüncelerinizi paylaşın.
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Puanınız</Text>
              <StarRating />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Geri Bildiriminiz</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Deneyiminizi paylaşın veya önerilerinizi yazın..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>E-posta (İsteğe bağlı)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Size geri dönüş yapmamızı isterseniz"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.hint}>E-posta adresiniz gizli tutulacaktır.</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Gönder</Text>
            </TouchableOpacity>
            
            <View style={styles.tipContainer}>
              <Text style={styles.tipTitle}>Bilgi:</Text>
              <Text style={styles.tipText}>
                Uygulamamızı Google Play Store'da da değerlendirebilir ve başkalarının uygulamayı keşfetmesine yardımcı olabilirsiniz.
              </Text>
            </View>
            
            <View style={styles.spacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FF9F43",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Geri butonunu dengelemek için
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  star: {
    fontSize: 40,
    marginRight: 10,
  },
  starActive: {
    color: "#FFD700",
  },
  starInactive: {
    color: "#DDDDDD",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 150,
  },
  hint: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontStyle: "italic",
  },
  submitButton: {
    backgroundColor: "#FF9F43",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tipContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9F43",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  spacer: {
    height: 30,
  },
});

export default FeedbackScreen;