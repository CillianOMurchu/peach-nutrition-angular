export type Brand = 'barebells' | 'nocco' | 'iogenix';
export type Category = 'protein-bar' | 'energy-drink' | 'protein-powder';

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductReview {
  rating: number;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  originalPrice?: number;        // derived from discountPercentage
  discountPercentage: number;
  stockQuantity: number;
  images: ProductImage[];
  description: string;
  review: ProductReview;
  tags: string[];
  featured: boolean;
}