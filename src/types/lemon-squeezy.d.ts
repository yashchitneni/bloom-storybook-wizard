
interface LemonSqueezyCheckoutOptions {
  product: string;
  embed?: boolean;
  email?: string;
  custom_data?: Record<string, string>;
}

interface LemonSqueezy {
  open: (options: LemonSqueezyCheckoutOptions) => void;
  initialize?: () => void;
}

interface Window {
  LemonSqueezy: LemonSqueezy;
}
