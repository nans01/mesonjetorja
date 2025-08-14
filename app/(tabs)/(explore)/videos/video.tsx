import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width: screenWidth } = Dimensions.get("window");
const videoHeight = (screenWidth * 9) / 16; // 16:9 aspect ratio

export default function VideoScreen() {
  const { youtube_id, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set the header title when the component mounts
  useEffect(() => {
    if (title) {
      navigation.setOptions({ title: title as string });
    }
  }, [title, navigation]);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
    if (state === "playing" || state === "paused" || state === "ready") {
      setLoading(false);
    }
  }, []);

  if (!youtube_id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No video ID provided</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        {loading && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff0000" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        <YoutubePlayer
          height={videoHeight}
          width={screenWidth}
          play={playing}
          videoId={youtube_id as string}
          onChangeState={onStateChange}
          onReady={() => setLoading(false)}
          onError={() => {
            setError("Failed to load video");
            setLoading(false);
          }}
        />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  videoContainer: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth,
    height: videoHeight,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
