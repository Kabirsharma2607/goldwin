'use client';

import Link from 'next/link';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </p>

        {/* Order Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Number</h3>
                <p className="text-gray-600 font-mono">{orderNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                <p className="text-gray-600">
                  {estimatedDelivery.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                We're preparing your items for shipment
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Updates</h3>
              <p className="text-sm text-gray-600">
                You'll receive tracking information via email
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600">
            <Link href="/orders">
              View Order Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>

        {/* Support */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, our customer support team is here to help.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}