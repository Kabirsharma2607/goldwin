"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cartStorage, Cart, CartItem } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCart(cartStorage.getCart());
    setLoading(false);
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cartStorage.updateQuantity(productId, newQuantity);
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartStorage.removeFromCart(productId);
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const clearCart = () => {
    const updatedCart = cartStorage.clearCart();
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Link href="/">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cart.itemCount} items)
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-gray-600 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  Add ${(100 - subtotal).toFixed(2)} more to get free shipping!
                </p>
              )}

              <Button
                asChild
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                size="lg"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full mt-3">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
