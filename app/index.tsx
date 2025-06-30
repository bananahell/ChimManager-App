import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Camera } from "react-native-vision-camera";
import {
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

export default function App() {
  const [data, setData] = useState({ string1: "", string2: "" });
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Camera permissions and setup
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      const url = codes[0]?.value;
      if (url) {
        try {
          // Extract IP from QR code URL (http://192.168.x.x:5000/data)
          const extractedIp = url.split("/")[2].split(":")[0];
          setIpAddress(extractedIp);
          setShowScanner(false);
        } catch (e) {
          Alert.alert("Error", "Invalid QR code format");
        }
      }
    },
  });

  useEffect(() => {
    // Request camera permission when scanner is shown
    if (showScanner && !hasPermission) {
      requestPermission();
    }
  }, [showScanner]);

  useEffect(() => {
    if (!ipAddress) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://${ipAddress}:5000/data`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Connection Error", "Could not reach the server");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [ipAddress]);

  if (showScanner) {
    if (!hasPermission) {
      return (
        <View style={styles.container}>
          <Text>Camera permission is required to scan QR codes</Text>
        </View>
      );
    }

    if (!device) {
      return (
        <View style={styles.container}>
          <Text>Camera device not found</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
        <View style={styles.overlay}>
          <Text style={styles.scanText}>Scan the QR Code</Text>
          <Button title="Cancel" onPress={() => setShowScanner(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ipAddress ? (
        <>
          <Text style={styles.text}>Connected to: {ipAddress}</Text>
          <Text style={styles.text}>{data.string1}</Text>
          <Text style={styles.text}>{data.string2}</Text>
          <Button
            title="Scan New QR Code"
            onPress={() => setShowScanner(true)}
          />
        </>
      ) : (
        <>
          <Text style={styles.text}>No server connected</Text>
          <Button title="Scan QR Code" onPress={() => setShowScanner(true)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    margin: 10,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  scanText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
});
