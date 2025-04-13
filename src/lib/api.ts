//front-new\src\lib\api.ts
import axios, { AxiosError } from "axios";
import {
  CreateProductDto,
  Product,
  UpdateProductDto,
  CartItem,
  WishItem,
} from "@/types/product";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ConfirmEmailCredentials,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  User,
} from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log(API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add a reasonable timeout to prevent long hangs during build
  timeout: 5000,
});

// Helper function to determine if we should use mock data
const shouldUseMockData = () => {
  // Use mock data during build or in development when API calls fail
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PHASE === "phase-production-build" ||
    typeof window === "undefined"
  ); // During SSR/SSG
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Intenta obtener el token del localStorage
      const token = localStorage.getItem("access_token");
      
      // Log para debugging (puedes quitar esto después)
      console.log("Token encontrado:", !!token);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      console.log("Enviando solicitud con token:", token ? token.substring(0, 15) + "..." : null);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Añade también un interceptor para ver las respuestas de error completas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Error en respuesta API:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method,
      });
    }
    return Promise.reject(error);
  }
);




// En front-new/src/lib/api.ts
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
    return Promise.reject(error);
  }
);
// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // For auth operations, we want to propagate the error to handle in the UI
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<{ userSub: string }> => {
    try {
      const response = await api.post("/api/auth/register", credentials);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error; // Propagate auth errors
    }
  },

  confirmEmail: async (
    credentials: ConfirmEmailCredentials
  ): Promise<{ success: boolean }> => {
    try {
      const response = await api.post("/api/auth/confirm", credentials);
      return response.data;
    } catch (error) {
      console.error("Confirm email error:", error);
      throw error; // Propagate auth errors
    }
  },

  resendCode: async (email: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.post("/api/auth/resend-code", { email });
      return response.data;
    } catch (error) {
      console.error("Resend code error:", error);
      throw error; // Propagate auth errors
    }
  },
};




// Trae la info del usuario

export const usersApi = {
  getProfile: async (): Promise<User> => {
    try {
      // Primero intenta el endpoint normal
      try {
        const response = await api.get<User>('/api/users/profile');
        return response.data;
      } catch (profileError) {
        console.log('Error en endpoint normal de perfil, intentando endpoint de prueba');
        // Si falla, intenta el endpoint de prueba
        const testResponse = await api.get<User>('/api/users/test-profile');
        return testResponse.data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch<User>('/api/users/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};





// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>("/api/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching all products:", error);

      return []; // Return empty array in production
    }
  },

  getOne: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);

      throw error; // Re-throw the error for specific product requests
    }
  },

  create: async (product: CreateProductDto): Promise<Product> => {
    try {
      // Crear una copia del producto y asegurarse de que si image está vacío, sea undefined
      // para que no se envíe en la solicitud
      const productToSend = {
        ...product,
      };

      // Si image está vacío o es null, eliminarlo del objeto que se envía
      if ("image" in productToSend && !productToSend.image) {
        delete productToSend.image;
      }

      const response = await api.post<Product>("/api/products", productToSend);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error; // Propagate mutations errors
    }
  },

  update: async (id: string, product: UpdateProductDto): Promise<Product> => {
    try {
      const response = await api.patch<Product>(`/api/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error; // Propagate mutations errors
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error; // Propagate mutations errors
    }
  },

  search: async (term: string): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(
        `/products/search?term=${term}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching products with term '${term}':`, error);

      return []; // Return empty array in production
    }
  },

  getByPriceRange: async (min: number, max: number): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(
        `/products/price-range?min=${min}&max=${max}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products in price range ${min}-${max}:`,
        error
      );

      return []; // Return empty array in production
    }
  },
};

// Cart API
export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    try {
      const response = await api.get<CartItem[]>("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);

      return []; // Return empty cart in production
    }
  },

  addToCart: async (productId: string, quantity: number): Promise<CartItem> => {
    try {
      const response = await api.post<CartItem>("/api/cart", {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to cart:`, error);
      throw error; // Propagate cart mutations errors
    }
  },

  updateQuantity: async (
    productId: string,
    quantity: number
  ): Promise<CartItem> => {
    try {
      const response = await api.patch<CartItem>(`/api/cart/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating quantity for product ${productId} in cart:`,
        error
      );
      throw error; // Propagate cart mutations errors
    }
  },

  removeFromCart: async (productId: string): Promise<void> => {
    try {
      await api.delete(`/api/cart/${productId}`);
    } catch (error) {
      console.error(`Error removing product ${productId} from cart:`, error);
      throw error; // Propagate cart mutations errors
    }
  },
};

// Wishlist API
export const wishlistApi = {
  getWishlist: async (): Promise<WishItem[]> => {
    try {
      const response = await api.get<WishItem[]>("/api/wishlist");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);

      return []; // Return empty wishlist in production
    }
  },

  addToWishlist: async (productId: string): Promise<WishItem> => {
    try {
      const response = await api.post<WishItem>("/api/wishlist", { productId });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to wishlist:`, error);
      throw error; // Propagate wishlist mutations errors
    }
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    try {
      await api.delete(`/api/wishlist/${productId}`);
    } catch (error) {
      console.error(
        `Error removing product ${productId} from wishlist:`,
        error
      );
      throw error; // Propagate wishlist mutations errors
    }
  },
};

export default api;
