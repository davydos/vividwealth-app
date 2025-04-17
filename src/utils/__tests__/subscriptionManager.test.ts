import { initPurchases, getOfferings, purchasePackage, restorePurchases } from '../subscriptionManager';

// Mock react-native-purchases
jest.mock('react-native-purchases', () => ({
  setup: jest.fn(),
  getOfferings: jest.fn(),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
}));

// Import the mocked module
import Purchases from 'react-native-purchases';

describe('Subscription Manager', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('initPurchases', () => {
    it('initializes RevenueCat SDK with the API key', () => {
      initPurchases();
      expect(Purchases.setup).toHaveBeenCalledWith('YOUR_REVENUECAT_API_KEY');
    });
  });

  describe('getOfferings', () => {
    it('returns the current offerings from RevenueCat', async () => {
      // Mock the response from getOfferings
      const mockOfferings = {
        current: {
          identifier: 'premium',
          availablePackages: [
            {
              identifier: 'monthly',
              product: {
                title: 'Premium Monthly',
                description: 'Monthly subscription',
                priceString: '$9.99'
              }
            },
            {
              identifier: 'annual',
              product: {
                title: 'Premium Annual',
                description: 'Annual subscription',
                priceString: '$99.99'
              }
            }
          ]
        },
        offerings: {}
      };

      (Purchases.getOfferings as jest.Mock).mockResolvedValue({ offerings: mockOfferings });

      const result = await getOfferings();
      expect(Purchases.getOfferings).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOfferings.current);
    });

    it('handles empty offerings gracefully', async () => {
      (Purchases.getOfferings as jest.Mock).mockResolvedValue({ offerings: null });
      
      const result = await getOfferings();
      expect(Purchases.getOfferings).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('purchasePackage', () => {
    it('processes the purchase and returns active entitlements', async () => {
      // Mock package to purchase
      const mockPackage = {
        identifier: 'monthly',
        product: {
          title: 'Premium Monthly',
          priceString: '$9.99'
        }
      };

      // Mock the response from purchasePackage
      const mockPurchaserInfo = {
        entitlements: {
          active: {
            premium: {
              identifier: 'premium',
              isActive: true,
              willRenew: true,
              expirationDate: '2023-12-31T00:00:00Z'
            }
          }
        }
      };

      (Purchases.purchasePackage as jest.Mock).mockResolvedValue({ purchaserInfo: mockPurchaserInfo });

      const result = await purchasePackage(mockPackage);
      expect(Purchases.purchasePackage).toHaveBeenCalledWith(mockPackage);
      expect(result).toEqual(mockPurchaserInfo.entitlements.active);
    });
  });

  describe('restorePurchases', () => {
    it('restores previous purchases and returns active entitlements', async () => {
      // Mock the response from restorePurchases
      const mockPurchaserInfo = {
        entitlements: {
          active: {
            premium: {
              identifier: 'premium',
              isActive: true,
              willRenew: true,
              expirationDate: '2023-12-31T00:00:00Z'
            }
          }
        }
      };

      (Purchases.restorePurchases as jest.Mock).mockResolvedValue({ purchaserInfo: mockPurchaserInfo });

      const result = await restorePurchases();
      expect(Purchases.restorePurchases).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPurchaserInfo.entitlements.active);
    });

    it('handles no restored purchases', async () => {
      // Mock the response with no active entitlements
      const mockPurchaserInfo = {
        entitlements: {
          active: {}
        }
      };

      (Purchases.restorePurchases as jest.Mock).mockResolvedValue({ purchaserInfo: mockPurchaserInfo });

      const result = await restorePurchases();
      expect(Purchases.restorePurchases).toHaveBeenCalledTimes(1);
      expect(result).toEqual({});
    });
  });
}); 