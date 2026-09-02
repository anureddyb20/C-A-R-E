import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { StatusBar } from 'expo-status-bar';

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [ecgData, setEcgData] = useState([2048]);
  const [hr, setHr] = useState(0);
  const [stress, setStress] = useState(0);
  const [panic, setPanic] = useState(false);

  useEffect(() => {
    // Note for user: Replace with the actual IP address of your ESP32 Gateway on your Wi-Fi network
    const ws = new WebSocket('ws://192.168.1.100:81');

    ws.onopen = () => {
      console.log("Connected to C.A.R.E. Gateway");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        
        // Update vitals
        if (data.hr !== undefined) setHr(data.hr);
        if (data.gsr !== undefined) setStress(data.gsr);
        if (data.panic !== undefined) setPanic(data.panic === 1);

        // Update scrolling ECG chart
        if (data.ecg !== undefined) {
          setEcgData(prevData => {
            const newData = [...prevData, data.ecg];
            if (newData.length > 50) newData.shift(); // Keep last 50 points
            return newData;
          });
        }
      } catch (err) {
        console.log("JSON Parse Error:", err);
      }
    };

    ws.onerror = (e) => {
      console.log("WebSocket Error:", e.message);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, panic ? styles.panicBackground : null]}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>C.A.R.E.</Text>
        <Text style={styles.subtitle}>Mobile Patient Monitor</Text>
      </View>

      {panic && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>EMERGENCY ALERT</Text>
          <Text style={styles.alertSubText}>PANIC BUTTON ACTIVATED</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Heart Rate</Text>
          <Text style={styles.statValue}>{hr} <Text style={styles.unit}>BPM</Text></Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Stress Index</Text>
          <Text style={styles.statValue}>{stress}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Live ECG Telemetry</Text>
        <LineChart
          data={{
            labels: [],
            datasets: [{ data: ecgData }]
          }}
          width={screenWidth - 40} // Margin padding
          height={220}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`, // Medical Teal line
            strokeWidth: 3,
            propsForBackgroundLines: {
              stroke: "#e3e3e3",
            },
          }}
          style={{
            borderRadius: 16,
            marginTop: 10
          }}
          bezier
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Status: Connected to Local Gateway</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F766E', // Medical Teal
  },
  panicBackground: {
    backgroundColor: '#E11D48', // Alert Red
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCFBF1',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 5,
  },
  alertBox: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  alertText: {
    color: '#E11D48',
    fontSize: 24,
    fontWeight: '900',
  },
  alertSubText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#CCFBF1',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  unit: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  chartContainer: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    alignSelf: 'flex-start',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#CCFBF1',
    fontSize: 12,
    opacity: 0.8,
  }
});
