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

export function TermsOfServiceScreen() {
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
        <Text style={styles.headerTitle}>Kullanım Koşulları</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Çocuk Oyunları Kullanım Koşulları</Text>
          <Text style={styles.date}>Son Güncelleme: 22 Mayıs 2025</Text>
          
          <Text style={styles.paragraph}>
            Bu Kullanım Koşulları, "Çocuk Oyunları" mobil uygulamasını ("Uygulama") kullanımınızı düzenlemektedir. Lütfen Uygulamayı kullanmadan önce bu koşulları dikkatlice okuyun.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Kabul</Text>
          <Text style={styles.paragraph}>
            Uygulamayı kullanarak, bu kullanım koşullarını kabul etmiş olursunuz. Bu koşulları kabul etmiyorsanız, lütfen Uygulamayı kullanmayın.
          </Text>
          
          <Text style={styles.sectionTitle}>2. Uygulamanın Kullanımı</Text>
          <Text style={styles.paragraph}>
            Bu Uygulama çocuklar için HTML5 tabanlı oyunlar içermektedir. Uygulamayı yalnızca yasal amaçlarla ve bu koşullara uygun olarak kullanabilirsiniz. Aşağıdaki durumlar yasaktır:
          </Text>
          <Text style={styles.listItem}>• Herhangi bir yasayı ihlal eden veya teşvik eden kullanım</Text>
          <Text style={styles.listItem}>• Uygulamayı kötüye kullanmak veya işlevlerini bozmak</Text>
          <Text style={styles.listItem}>• Uygulamanın güvenliğini tehlikeye atmak</Text>
          <Text style={styles.listItem}>• Uygulamayı kopyalamak, değiştirmek veya türev çalışmalar oluşturmak</Text>
          
          <Text style={styles.sectionTitle}>3. İçerik</Text>
          <Text style={styles.paragraph}>
            Uygulamamız üçüncü taraf sağlayıcılardan HTML5 oyunları içermektedir. Bu oyunlar, herhangi bir zamanda değiştirilebilir, kaldırılabilir veya güncellenebilir. İçeriğin sürekli erişilebilirliğini garanti etmiyoruz.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Fikri Mülkiyet</Text>
          <Text style={styles.paragraph}>
            Uygulama ve içeriğindeki tüm fikri mülkiyet hakları bize veya lisans verenlerimize aittir. Uygulamayı kullanma hakkınız, bu hakları size devretmez. İzinsiz kullanım kesinlikle yasaktır.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Sorumluluk Reddi</Text>
          <Text style={styles.paragraph}>
            Uygulama "olduğu gibi" ve "mevcut olduğu şekilde" sunulmaktadır. Uygulamanın kesintisiz veya hatasız çalışacağını garanti etmiyoruz. Uygulamanın kullanımından doğabilecek herhangi bir doğrudan, dolaylı, tesadüfi veya sonuç olarak ortaya çıkan zararlardan sorumlu değiliz.
          </Text>
          
          <Text style={styles.sectionTitle}>6. Değişiklikler</Text>
          <Text style={styles.paragraph}>
            Bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutarız. Değişiklikleri Uygulama içinde yayınlayacağız. Değişikliklerden sonra Uygulamayı kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.
          </Text>
          
          <Text style={styles.sectionTitle}>7. Uygulanabilir Hukuk</Text>
          <Text style={styles.paragraph}>
            Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir. Bu koşullarla ilgili herhangi bir anlaşmazlık durumunda Türkiye Cumhuriyeti mahkemeleri yetkili olacaktır.
          </Text>
          
          <Text style={styles.sectionTitle}>8. İletişim</Text>
          <Text style={styles.paragraph}>
            Bu kullanım koşulları hakkında sorularınız veya endişeleriniz varsa, lütfen şu adresten bizimle iletişime geçin:
          </Text>
          <Text style={styles.paragraph}>
            contact@childrensgames.example.com
          </Text>
          
          <View style={styles.spacer} />
        </View>
      </ScrollView>
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
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 8,
    paddingLeft: 16,
  },
  spacer: {
    height: 50,
  },
});

export default TermsOfServiceScreen;