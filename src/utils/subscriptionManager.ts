import Purchases from 'react-native-purchases';

export function initPurchases() {
  Purchases.setup('YOUR_REVENUECAT_API_KEY');
}

export async function getOfferings() {
  const { offerings } = await Purchases.getOfferings();
  return offerings?.current;
}

export async function purchasePackage(pkg) {
  const { purchaserInfo } = await Purchases.purchasePackage(pkg);
  return purchaserInfo.entitlements.active;
}

export async function restorePurchases() {
  const { purchaserInfo } = await Purchases.restorePurchases();
  return purchaserInfo.entitlements.active;
} 