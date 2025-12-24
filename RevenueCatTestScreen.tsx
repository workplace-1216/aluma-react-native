import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';

interface ProductDisplay {
  identifier: string;
  title: string;
  description: string;
  price: string;
  packageType: string;
}

const RevenueCatTestScreen: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(
    'goog_HxxdrbmAljOEuvnwEsxwnezpoqj',
  );
  const [userId, setUserId] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string>('');

  // Initialize RevenueCat
  const configureRevenueCat = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Configure RevenueCat
      await Purchases.configure({ apiKey });
      setIsConfigured(true);

      // Set initial user ID if provided
      if (userId.trim()) {
        await Purchases.logIn(userId.trim());
        setCurrentUserId(userId.trim());
      }

      // Fetch offerings and customer info
      await fetchProducts();
      await fetchCustomerInfo();

      Alert.alert('Success', 'RevenueCat configured successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to configure RevenueCat');
      Alert.alert('Error', err.message || 'Failed to configure RevenueCat');
    } finally {
      setIsLoading(false);
    }
  };

  // Change user ID
  const changeUser = async () => {
    if (!isConfigured) {
      Alert.alert('Error', 'Please configure RevenueCat first');
      return;
    }

    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await Purchases.logIn(userId.trim());
      setCurrentUserId(userId.trim());

      // Refresh products and customer info for new user
      await fetchProducts();
      await fetchCustomerInfo();

      Alert.alert('Success', `Switched to user: ${userId.trim()}`);
    } catch (err: any) {
      setError(err.message || 'Failed to change user');
      Alert.alert('Error', err.message || 'Failed to change user');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate random user ID
  const generateRandomUserId = () => {
    const randomId = `user_${Math.random().toString(36).substring(2, 15)}`;
    setUserId(randomId);
  };

  // Fetch products/offerings
  const fetchProducts = async () => {
    if (!isConfigured) return;

    try {
      const offerings = await Purchases.getOfferings();
      const productsList: ProductDisplay[] = [];

      if (offerings.current !== null) {
        const packages = offerings.current.availablePackages;
        packages.forEach((pkg: PurchasesPackage) => {
          productsList.push({
            identifier: pkg.identifier,
            title: pkg.product.title || pkg.identifier,
            description: pkg.product.description || '',
            price: pkg.product.priceString || 'N/A',
            packageType: pkg.packageType,
          });
        });
      }

      setProducts(productsList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    }
  };

  // Fetch customer info
  const fetchCustomerInfo = async () => {
    if (!isConfigured) return;

    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer info');
    }
  };

  // Refresh data
  const refreshData = async () => {
    setIsLoading(true);
    setError('');
    try {
      await fetchProducts();
      await fetchCustomerInfo();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>RevenueCat Test App</Text>

      {/* Configuration Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration</Text>

        <Text style={styles.label}>API Key:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your RevenueCat API key"
          value={apiKey}
          onChangeText={setApiKey}
          editable={!isConfigured}
          autoCapitalize="none"
        />

        <Text style={styles.label}>User ID:</Text>
        <View style={styles.userIdContainer}>
          <TextInput
            style={[styles.input, styles.userIdInput]}
            placeholder="Enter or generate user ID"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.randomButton}
            onPress={generateRandomUserId}
          >
            <Text style={styles.randomButtonText}>Random</Text>
          </TouchableOpacity>
        </View>

        {!isConfigured ? (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={configureRevenueCat}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Configure RevenueCat</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={changeUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Change User</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Status Section */}
      {isConfigured && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.statusText}>
            Configured: <Text style={styles.statusValue}>Yes</Text>
          </Text>
          {currentUserId && (
            <Text style={styles.statusText}>
              Current User:{' '}
              <Text style={styles.statusValue}>{currentUserId}</Text>
            </Text>
          )}
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={refreshData}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Refresh Data</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Error Display */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Customer Info Section */}
      {customerInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Info</Text>
          <Text style={styles.infoText}>
            Original App User ID: {customerInfo.originalAppUserId}
          </Text>
          <Text style={styles.infoText}>
            First Seen: {new Date(customerInfo.firstSeen).toLocaleString()}
          </Text>
          <Text style={styles.infoText}>
            Active Subscriptions:{' '}
            {Object.keys(customerInfo.activeSubscriptions).length}
          </Text>
          <Text style={styles.infoText}>
            Entitlements: {Object.keys(customerInfo.entitlements.active).length}{' '}
            active
          </Text>
        </View>
      )}

      {/* Products Section */}
      {isConfigured && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products ({products.length})</Text>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>
              No products available. Make sure you have configured offerings in
              RevenueCat dashboard.
            </Text>
          ) : (
            products.map((product, index) => (
              <View key={index} style={styles.productCard}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productId}>ID: {product.identifier}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.productType}>{product.packageType}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  userIdContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  userIdInput: {
    flex: 1,
    marginRight: 10,
  },
  randomButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  refreshButton: {
    backgroundColor: '#5856D6',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  statusValue: {
    fontWeight: '600',
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  productCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  productId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  productType: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default RevenueCatTestScreen;
