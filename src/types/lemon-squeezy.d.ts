
interface LemonSqueezyCheckoutOptions {
  product: string;
  embed?: boolean;
  email?: string;
  custom_data?: Record<string, string>;
}

interface LemonSqueezy {
  // The LemonSqueezy global doesn't actually have an open method
  // It uses links with the class 'lemonsqueezy-button' to trigger checkouts
  initialize?: () => void;
}

interface Window {
  LemonSqueezy: LemonSqueezy;
}
