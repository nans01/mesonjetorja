import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Card {
  id: string;
  front: { text: string };
  back: { text: string };
}

interface DeckDetails {
  id: string;
  name: string;
  flashcards: Card[];
}

const TAB_BAR_HEIGHT = 100;
const HEADER_HEIGHT = 60;
const SAFE_AREA_BOTTOM = 34; // Approximate safe area bottom height
const TITLE_HEIGHT = 60; // Approximate title height with padding
const EXTRA_PADDING = 20; // Extra padding to ensure no cropping

// FlipCard component
const FlipCard = ({
  front,
  back,
  direction = "y",
  duration = 500,
  width,
  height,
}: {
  front: string;
  back: string;
  direction?: "x" | "y";
  duration?: number;
  width: number;
  height: number;
}) => {
  const isFlipped = useSharedValue(0);
  const isDirectionX = direction === "x";

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(isFlipped.value, [0, 1], [0, 180]);
    return {
      transform: [
        isDirectionX
          ? { rotateX: withTiming(`${spinValue}deg`, { duration }) }
          : { rotateY: withTiming(`${spinValue}deg`, { duration }) },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(isFlipped.value, [0, 1], [180, 360]);
    return {
      transform: [
        isDirectionX
          ? { rotateX: withTiming(`${spinValue}deg`, { duration }) }
          : { rotateY: withTiming(`${spinValue}deg`, { duration }) },
      ],
      backfaceVisibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
    };
  });

  const handlePress = () => {
    isFlipped.value = isFlipped.value === 0 ? 1 : 0;
  };

  return (
    <Pressable onPress={handlePress} style={{ width, height }}>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            flipCardStyles.card,
            { width, height },
            regularCardAnimatedStyle,
          ]}
        >
          <View style={[flipCardStyles.innerCard, { width, height }]}>
            <Text style={flipCardStyles.text}>{front}</Text>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            flipCardStyles.card,
            { width, height },
            flippedCardAnimatedStyle,
          ]}
        >
          <View style={[flipCardStyles.innerCardFlipped, { width, height }]}>
            <Text style={flipCardStyles.text}>{back}</Text>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const flipCardStyles = StyleSheet.create({
  card: {
    width: 170,
    height: 200,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  innerCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  innerCardFlipped: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  text: {
    color: "#001a72",
    fontSize: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});

export default function DeckDetailsScreen() {
  const { deck_id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [deck, setDeck] = useState<DeckDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!deck_id) {
          setError("No deck_id provided");
          setLoading(false);
          return;
        }
        const url = `https://mesonjetorja.com/api/decks/${deck_id}`;
        console.log("Fetching deck from:", url);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          let errorMsg = `Network response was not ok (status: ${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData?.message) errorMsg += `: ${errorData.message}`;
          } catch {}
          throw new Error(errorMsg);
        }
        const data = await response.json();
        setDeck(data);

        // Set the header title to the deck name
        if (data.name) {
          navigation.setOptions({ title: data.name });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load deck");
      } finally {
        setLoading(false);
      }
    };
    if (deck_id) fetchDeck();
  }, [deck_id, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!deck) return null;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={deck.flashcards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              width: SCREEN_WIDTH,
              height:
                SCREEN_HEIGHT -
                HEADER_HEIGHT -
                TAB_BAR_HEIGHT -
                SAFE_AREA_BOTTOM -
                TITLE_HEIGHT -
                EXTRA_PADDING,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 0,
              paddingVertical: 0,
            }}
          >
            <FlipCard
              front={item.front.text}
              back={item.back.text}
              width={SCREEN_WIDTH - 32}
              height={
                SCREEN_HEIGHT -
                HEADER_HEIGHT -
                TAB_BAR_HEIGHT -
                SAFE_AREA_BOTTOM -
                TITLE_HEIGHT -
                EXTRA_PADDING -
                32
              }
            />
          </View>
        )}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.cardsList}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  cardsList: { gap: 0 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#c00", fontSize: 16 },
});
