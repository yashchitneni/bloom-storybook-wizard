
interface LemonSqueezyCheckoutOptions {
  variant?: string;
  product?: string;
  embed?: boolean;
  email?: string;
  custom?: Record<string, any>;
}

interface LemonSqueezy {
  initialize?: () => void;
  // Open checkout modal
  open: (options: LemonSqueezyCheckoutOptions) => void;
}

interface Window {
  LemonSqueezy: LemonSqueezy;
}
