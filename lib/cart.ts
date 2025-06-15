'use client';

import { Product } from './api';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Cart management functions
export const cartStorage = {
  getCart: (): Cart => {
    if (typeof window === 'undefined') {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    try {
      const stored = localStorage.getItem('goldwin-cart');
      if (stored) {
        const cart = JSON.parse(stored) as Cart;
        return cart;
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    
    return { items: [], total: 0, itemCount: 0 };
  },

  saveCart: (cart: Cart): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('goldwin-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  addToCart: (product: Product, quantity: number = 1): Cart => {
    const cart = cartStorage.getCart();
    const existingItem = cart.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    cartStorage.saveCart(cart);
    return cart;
  },

  removeFromCart: (productId: string): Cart => {
    const cart = cartStorage.getCart();
    cart.items = cart.items.filter(item => item.product.id !== productId);
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    cartStorage.saveCart(cart);
    return cart;
  },

  updateQuantity: (productId: string, quantity: number): Cart => {
    const cart = cartStorage.getCart();
    const item = cart.items.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return cartStorage.removeFromCart(productId);
      }
      
      item.quantity = quantity;
      cart.total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      
      cartStorage.saveCart(cart);
    }
    
    return cart;
  },

  clearCart: (): Cart => {
    const cart = { items: [], total: 0, itemCount: 0 };
    cartStorage.saveCart(cart);
    return cart;
  }
};