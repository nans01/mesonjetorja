import { Stack } from "expo-router";

export default function DecksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Decks",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="[deck_id]"
        options={{
          headerLargeTitle: true,
          headerBackTitle: "Decks",
        }}
      />
    </Stack>
  );
}
