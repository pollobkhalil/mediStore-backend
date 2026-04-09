export type TMedicine = {
  name: string;
  brand: string;
  price: number;
  stockQuantity: number;
  expiryDate: Date;
  description?: string;
  image?: string;
  isPrescription: boolean;
  categoryId: string;
  sellerId: string;
};