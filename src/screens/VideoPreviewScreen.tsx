import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { generateVisualization } from '../utils/videoGenerator';
import { calculateTimeframe } from '../utils/timeframe';

interface VideoPreviewScreenProps {
  route: {
    params: {
      goal: string;
    };
  };
  navigation: any;
}

export const VideoPreviewScreen = ({ route, navigation }: VideoPreviewScreenProps) => {
  const { goal } = route.params;
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initiateVisualization = async () => {
      try {
        setLoading(true);
        // Calculate timeframe based on goal
        const timeframeDays = calculateTimeframe(goal);
        
        // Generate visualization
        const url = await generateVisualization(goal, timeframeDays);
        setVideoUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Failed to generate visualization:', err);
        setError('Failed to generate your magical visualization. Please try again.');
        setLoading(false);
      }
    };
    
    initiateVisualization();
  }, [goal]);
  
  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const timeframeDays = calculateTimeframe(goal);
      const url = await generateVisualization(goal, timeframeDays);
      setVideoUrl(url);
    } catch (err) {
      setError('Failed to generate visualization. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manifest Your Visualization</Text>
      
      <View style={styles.previewContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              Creating your magical visualization...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Generate My Visualization</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.videoContainer}>
            {videoUrl ? (
              <React.Fragment>
                <Text style={styles.successText}>Your magical visualization is ready!</Text>
                {/* In a real app, this would be a Video component */}
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.placeholderText}>Video Player</Text>
                  <Text style={styles.goalText}>Goal: {goal}</Text>
                  <Text style={styles.urlText}>URL: {videoUrl}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => console.log('Share video', videoUrl)}
                >
                  <Text style={styles.shareButtonText}>Share Your Vision</Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : (
              <Text style={styles.failedText}>
                Visualization generation failed. Please try again.
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  estimatedTime: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  videoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },
  failedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
  },
  goalText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  urlText: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
  shareButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 