export type PaymentInfo = {
  stripe_id: string;
};

export type CustomerData = {
  stripe_id: string | null | undefined;
  active: boolean;
};
