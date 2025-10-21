export type PaymentItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
};

export type PaymentInfo = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
};
