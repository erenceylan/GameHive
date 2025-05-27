import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomTabBar from "../components/BottomTabBar";

export function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4e73df" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Çocuk Oyunları Uygulaması Gizlilik Politikası</Text>
          <Text style={styles.date}>Son Güncelleme: 22 Mayıs 2025</Text>
          
          <Text style={styles.paragraph}>
            Bu Gizlilik Politikası, "Çocuk Oyunları" uygulamasını kullanırken toplanan, işlenen ve paylaşılan bilgilere ilişkin uygulamalarımızı açıklar.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Topladığımız Bilgiler</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Otomatik Olarak Toplanan Bilgiler:</Text> Uygulamamızı kullandığınızda cihaz türü, işletim sistemi sürümü, uygulama sürümü, zaman damgaları ve oyun istatistikleri gibi bazı bilgileri otomatik olarak topluyoruz.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Favoriler ve Tercihler:</Text> Oyunlarınızı favorilere eklediğinizde, bu tercihleri cihazınızda saklıyoruz. Bu veriler başka herhangi bir sunucuya aktarılmaz.
          </Text>
          
          <Text style={styles.sectionTitle}>2. Bilgilerinizi Nasıl Kullanıyoruz</Text>
          <Text style={styles.paragraph}>
            Topladığımız bilgileri şu amaçlarla kullanıyoruz:
          </Text>
          <Text style={styles.listItem}>• Uygulamamızı sağlamak, sürdürmek ve iyileştirmek</Text>
          <Text style={styles.listItem}>• Sorunları teşhis etmek ve çözmek</Text>
          <Text style={styles.listItem}>• Kullanıcı tercihlerini kaydetmek</Text>
          <Text style={styles.listItem}>• Uygulamanın nasıl kullanıldığını anlamak</Text>
          
          <Text style={styles.sectionTitle}>3. Bilgilerinizin Paylaşılması</Text>
          <Text style={styles.paragraph}>
            Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz. Sunduğumuz HTML5 oyunları üçüncü taraf sağlayıcılardan gelmektedir ve bu sağlayıcılar kendi gizlilik politikalarına sahip olabilir.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Çocukların Gizliliği</Text>
          <Text style={styles.paragraph}>
            Uygulamamız çocuklar için tasarlanmış olsa da, 13 yaşın altındaki çocuklardan kişisel olarak tanımlanabilir bilgiler toplamıyoruz. Ebeveynler veya yasal vasiler, çocuklarının uygulamamızla etkileşimine ilişkin sorular için bizimle iletişime geçebilirler.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Güvenlik</Text>
          <Text style={styles.paragraph}>
            Bilgilerinizin güvenliğini korumak için çeşitli güvenlik önlemleri uyguluyoruz. Ancak, internet üzerinden hiçbir veri iletim yönteminin veya elektronik depolama yönteminin %100 güvenli olmadığını unutmayın.
          </Text>
          
          <Text style={styles.sectionTitle}>6. Bu Politikadaki Değişiklikler</Text>
          <Text style={styles.paragraph}>
            Gizlilik Politikamızı zaman zaman güncelleyebiliriz. Politikadaki önemli değişiklikleri size bildirmek için makul çaba göstereceğiz.
          </Text>
          
          <Text style={styles.sectionTitle}>7. İletişim</Text>
          <Text style={styles.paragraph}>
            Bu Gizlilik Politikası hakkında sorularınız veya endişeleriniz varsa, lütfen şu adresten bizimle iletişime geçin:
          </Text>
          <Text style={styles.paragraph}>
            contact@childrensgames.example.com
          </Text>
          
          <View style={styles.spacer} />
        </View>
      </ScrollView>
      
      <BottomTabBar active="" />
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
    backgroundColor: "#4e73df",
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 8,
    paddingLeft: 16,
  },
  spacer: {
    height: 100, // Alt menü için boşluk
  },
});

export default PrivacyPolicyScreen;