import { Stack, useLocalSearchParams } from "expo-router";

export default function TextbooksLayout() {
  const { title } = useLocalSearchParams();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Mësonjëtorja",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="[textbook_id]"
        options={({ route }) => {
          const params = route.params as { title?: string } | undefined;
          return {
            title: params?.title ?? "Textbook",
            headerLargeTitle: true,
            headerBackTitle: "Textbooks",
          };
        }}
      />
    </Stack>
  );
}
