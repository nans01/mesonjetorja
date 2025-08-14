import { Stack } from "expo-router";

export default function VideosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Videos",
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="video"
        options={{
          title: "Video",
          headerBackTitle: "Videos",
        }}
      />
    </Stack>
  );
}
