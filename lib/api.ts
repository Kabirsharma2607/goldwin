// Mock API functions for the e-commerce website
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Array<{
    id: string;
    type: 'billing' | 'shipping';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound.',
    price: 299.99,
    originalPrice: 399.99,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'electronics',
    rating: 4.8,
    reviews: 324,
    inStock: true,
    features: ['Noise Cancellation', '30-hour Battery', 'Premium Sound Quality', 'Comfortable Fit']
  },
  {
    id: '2',
    name: 'Designer Watch Collection',
    description: 'Elegant timepiece with precision engineering and timeless design.',
    price: 899.99,
    images: [
      'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'accessories',
    rating: 4.9,
    reviews: 156,
    inStock: true,
    features: ['Swiss Movement', 'Sapphire Crystal', 'Water Resistant', 'Leather Strap']
  },
  {
    id: '3',
    name: 'Professional Camera Kit',
    description: 'Complete photography kit for professionals and enthusiasts.',
    price: 1299.99,
    originalPrice: 1599.99,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'electronics',
    rating: 4.7,
    reviews: 89,
    inStock: true,
    features: ['4K Video', 'Professional Lens', 'Image Stabilization', 'Weather Sealed']
  },
  {
    id: '4',
    name: 'Luxury Handbag',
    description: 'Handcrafted leather handbag with elegant design and premium materials.',
    price: 599.99,
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'fashion',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    features: ['Genuine Leather', 'Handcrafted', 'Multiple Compartments', 'Adjustable Strap']
  },
  {
    id: '5',
    name: 'Smart Home Speaker',
    description: 'Voice-controlled smart speaker with premium audio and AI assistant.',
    price: 179.99,
    images: [
      'https://images.pexels.com/photos/4790263/pexels-photo-4790263.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'electronics',
    rating: 4.5,
    reviews: 412,
    inStock: true,
    features: ['Voice Control', 'Smart Home Integration', 'Premium Audio', 'Compact Design']
  },
  {
    id: '6',
    name: 'Athletic Running Shoes',
    description: 'Performance running shoes with advanced cushioning and breathable design.',
    price: 149.99,
    originalPrice: 199.99,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    category: 'fashion',
    rating: 4.7,
    reviews: 567,
    inStock: true,
    features: ['Advanced Cushioning', 'Breathable Mesh', 'Lightweight Design', 'Durable Construction']
  }
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500',
    productCount: 156
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500',
    productCount: 234
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=500',
    productCount: 89
  },
  {
    id: '4',
    name: 'Home & Garden',
    slug: 'home-garden',
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500',
    productCount: 123
  }
];

// API Functions
export const api = {
  // Products
  getProducts: async (params?: { category?: string; search?: string; limit?: number }): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    let filteredProducts = [...mockProducts];
    
    if (params?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (params?.limit) {
      filteredProducts = filteredProducts.slice(0, params.limit);
    }
    
    return filteredProducts;
  },

  getProduct: async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(p => p.id === id) || null;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProducts.filter(p => p.originalPrice).slice(0, 4);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  },

  getCategory: async (slug: string): Promise<Category | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories.find(c => c.slug === slug) || null;
  },

  // User & Orders
  getUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      addresses: [
        {
          id: '1',
          type: 'shipping',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true
        }
      ]
    };
  },

  getOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 299.99,
        items: [
          {
            product: mockProducts[0],
            quantity: 1,
            price: 299.99
          }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'shipped',
        total: 899.99,
        items: [
          {
            product: mockProducts[1],
            quantity: 1,
            price: 899.99
          }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      }
    ];
  }
};