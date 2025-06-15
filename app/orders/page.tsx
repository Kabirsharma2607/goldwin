'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api, Order } from '@/lib/api';

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: X,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Button asChild variant="outline">
            <Link href="/order-history">View Order History</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                When you place orders, they will appear here.
              </p>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status];
              const statusColor = statusColors[order.status];
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={statusColor}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/product/${item.product.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-yellow-600 transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Shipping Address */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}