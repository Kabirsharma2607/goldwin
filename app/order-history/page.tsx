'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Calendar, DollarSign, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, Order } from '@/lib/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // In a real app, this would load all historical orders
        const ordersData = await api.getOrders();
        // Add some mock historical orders
        const historicalOrders: Order[] = [
          ...ordersData,
          {
            id: 'ORD-003',
            date: '2023-12-15',
            status: 'delivered',
            total: 1299.99,
            items: [
              {
                product: {
                  id: '3',
                  name: 'Professional Camera Kit',
                  description: 'Complete photography kit for professionals and enthusiasts.',
                  price: 1299.99,
                  images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500'],
                  category: 'electronics',
                  rating: 4.7,
                  reviews: 89,
                  inStock: true,
                  features: ['4K Video', 'Professional Lens', 'Image Stabilization', 'Weather Sealed']
                },
                quantity: 1,
                price: 1299.99
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
            id: 'ORD-004',
            date: '2023-11-28',
            status: 'delivered',
            total: 749.98,
            items: [
              {
                product: {
                  id: '4',
                  name: 'Luxury Handbag',
                  description: 'Handcrafted leather handbag with elegant design.',
                  price: 599.99,
                  images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500'],
                  category: 'fashion',
                  rating: 4.6,
                  reviews: 203,
                  inStock: true,
                  features: ['Genuine Leather', 'Handcrafted', 'Multiple Compartments']
                },
                quantity: 1,
                price: 599.99
              },
              {
                product: {
                  id: '6',
                  name: 'Athletic Running Shoes',
                  description: 'Performance running shoes with advanced cushioning.',
                  price: 149.99,
                  images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500'],
                  category: 'fashion',
                  rating: 4.7,
                  reviews: 567,
                  inStock: true,
                  features: ['Advanced Cushioning', 'Breathable Mesh']
                },
                quantity: 1,
                price: 149.99
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
        
        setOrders(historicalOrders);
        setFilteredOrders(historicalOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case '1year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(order => new Date(order.date) >= filterDate);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Orders
                </label>
                <Input
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date Range
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'You haven\'t placed any orders yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <Badge className={statusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      
                      <div className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
                        <span className="ml-1">
                          {order.items.map(item => item.product.name).join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders`}>View Details</Link>
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}