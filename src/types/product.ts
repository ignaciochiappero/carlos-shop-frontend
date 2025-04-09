//front-new\src\types\product.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface CartItem {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
}
