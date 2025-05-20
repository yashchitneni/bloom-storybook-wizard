
interface LemonSqueezyCheckoutOptions {
  variant?: string;
  product?: string;
  embed?: boolean;
  email?: string;
  custom?: Record<string, any>;
}

interface LemonSqueezy {
  // Make initialize method available
  initialize: () => void;
  // Open checkout modal
  open: (options: LemonSqueezyCheckoutOptions) => void;
}

interface Window {
  LemonSqueezy: LemonSqueezy;
  createLemonSqueezy?: () => void;
}
