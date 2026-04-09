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

// Define expected query parameters
export type TMedicineQuery = {
  searchTerm?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
};