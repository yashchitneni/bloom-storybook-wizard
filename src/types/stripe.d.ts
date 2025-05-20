
declare interface Window {
  Stripe?: (publicKey: string) => {
    redirectToCheckout: (options: {
      sessionId: string;
    }) => Promise<{
      error?: {
        message: string;
      };
    }>;
  };
}
