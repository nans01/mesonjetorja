import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface SubjectMapping {
  [key: string]: string;
}

interface Video {
  id: string;
  title: string;
  cover: string;
  youtube_id: string;
  subject?: string; // Subject ID as string
}

// Card component for a single video
const VideoCard = ({
  video,
  subjectMapping,
}: {
  video: Video;
  subjectMapping: SubjectMapping;
}) => (
  <Link
    href={{
      pathname: "/(tabs)/(explore)/videos/video",
      params: {
        video_id: video.id,
        title: video.title,
        youtube_id: video.youtube_id,
      },
    }}
  >
    <View style={styles.videoCard}>
      <Image source={{ uri: video.cover }} style={styles.videoImage} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        {video.subject && (
          <Text style={styles.videoSubject}>
            {subjectMapping[video.subject] || video.subject}
          </Text>
        )}
      </View>
    </View>
  </Link>
);

// Subject filter component
const SubjectFilter = ({
  subjects,
  selectedSubject,
  onSubjectSelect,
  subjectMapping,
}: {
  subjects: string[];
  selectedSubject: string | null;
  onSubjectSelect: (subject: string | null) => void;
  subjectMapping: SubjectMapping;
}) => (
  <View style={styles.subjectContainer}>
    <FlatList
      data={subjects}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.subjectList}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.subjectChip,
            selectedSubject === item && styles.subjectChipSelected,
          ]}
          onPress={() =>
            onSubjectSelect(selectedSubject === item ? null : item)
          }
        >
          <Text
            style={[
              styles.subjectText,
              selectedSubject === item && styles.subjectTextSelected,
            ]}
          >
            {subjectMapping[item] || item}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item}
    />
  </View>
);

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectMapping, setSubjectMapping] = useState<SubjectMapping>({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://mesonjetorja.com/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setVideos(data);

        // Subject ID to name mapping
        const mapping: SubjectMapping = {
          "67add41bbda4fc7efa50752e": "Matematikë",
          "67add41bbda4fc7efa507534": "Anglisht",
          "67add41bbda4fc7efa507536": "Informatikë",
          "67add41bbda4fc7efa507532": "Kimi",
          "67add41bbda4fc7efa507530": "Fizikë",
          "67add41bbda4fc7efa50752c": "Biologji",
          "67add41bbda4fc7efa50752a": "Geografi",
          "67add41bbda4fc7efa507528": "Histori",
        };
        setSubjectMapping(mapping);

        // Show all subjects regardless of whether they have videos
        const allSubjectIds = Object.keys(mapping).sort();
        setSubjects(allSubjectIds);
      } catch (err: any) {
        setError(err.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Filter videos based on search query and selected subject
  useEffect(() => {
    let filtered = videos;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    // Filter by selected subject
    if (selectedSubject) {
      filtered = filtered.filter((video) => video.subject === selectedSubject);
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, selectedSubject]);

  const handleSubjectSelect = (subject: string | null) => {
    setSelectedSubject(subject);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Subject Filters */}
      <SubjectFilter
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSubjectSelect={handleSubjectSelect}
        subjectMapping={subjectMapping}
      />

      {/* Results */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VideoCard video={item} subjectMapping={subjectMapping} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery || selectedSubject
                  ? "No videos found matching your criteria"
                  : "No videos available"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 20, // Reduced top padding for smaller header
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  subjectContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subjectList: {
    paddingRight: 16,
  },
  subjectChip: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  subjectChipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  subjectText: {
    fontSize: 14,
    color: "#333",
  },
  subjectTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  listContent: {
    gap: 16,
    padding: 16,
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  videoImage: {
    width: 100,
    height: 70,
    resizeMode: "cover",
    marginRight: 12,
    borderRadius: 4,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  videoSubject: {
    fontSize: 12,
    color: "#999",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#c00",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
