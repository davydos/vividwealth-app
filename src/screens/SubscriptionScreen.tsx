import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, SafeAreaView } from 'react-native';
import { initPurchases, getOfferings, purchasePackage, restorePurchases } from '../utils/subscriptionManager';

const SubscriptionScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [offerings, setOfferings] = useState(null);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize RevenueCat
        initPurchases();
        
        // Load available offerings
        const offerings = await getOfferings();
        setOfferings(offerings);
      } catch (err) {
        console.error('Failed to load subscription offerings:', err);
        setError('Failed to load subscription options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handlePurchase = async (pkg) => {
    try {
      setPurchasing(true);
      setError(null);
      
      const entitlements = await purchasePackage(pkg);
      if (Object.keys(entitlements).length > 0) {
        setSuccess(true);
        Alert.alert('Success', 'Thank you for your subscription!');
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      setError('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      setError(null);
      
      const entitlements = await restorePurchases();
      if (Object.keys(entitlements).length > 0) {
        setSuccess(true);
        Alert.alert('Success', 'Your subscription has been restored!');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found to restore.');
      }
    } catch (err) {
      console.error('Restore failed:', err);
      setError('Failed to restore purchases. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>VividWealth Premium</Text>
        
        <Text style={styles.subheader}>
          Unlock all features with a premium subscription
        </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4caf50" />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        ) : error && !offerings ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={() => window.location.reload()}>
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : offerings ? (
          <View style={styles.offeringsContainer}>
            {offerings.availablePackages?.map((pkg, index) => (
              <TouchableOpacity
                key={index}
                style={styles.packageCard}
                onPress={() => handlePurchase(pkg)}
                disabled={purchasing || success}
              >
                <Text style={styles.packageTitle}>{pkg.product.title || pkg.identifier}</Text>
                <Text style={styles.packageDescription}>{pkg.product.description}</Text>
                <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                
                <TouchableOpacity
                  style={[styles.subscribeButton, (purchasing || success) && styles.disabledButton]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={purchasing || success}
                >
                  <Text style={styles.subscribeButtonText}>
                    {purchasing ? 'Processing...' : success ? 'Subscribed' : 'Subscribe'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={purchasing}>
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No subscription options available at this time.</Text>
          </View>
        )}
        
        {error && offerings && (
          <Text style={styles.errorMessage}>{error}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  offeringsContainer: {
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#4caf50',
  },
  subscribeButton: {
    backgroundColor: '#4caf50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default SubscriptionScreen; 