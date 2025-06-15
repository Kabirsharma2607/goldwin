'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, User as UserType } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await api.getUser();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.addresses[0]?.street || '',
          address: {
            street: userData.addresses[0]?.street || '',
            city: userData.addresses[0]?.city || '',
            state: userData.addresses[0]?.state || '',
            zipCode: userData.addresses[0]?.zipCode || '',
            country: userData.addresses[0]?.country || ''
          }
        });
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      // In a real app, you would save to API
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.addresses[0]?.street || '',
        address: {
          street: user.addresses[0]?.street || '',
          city: user.addresses[0]?.city || '',
          state: user.addresses[0]?.state || '',
          zipCode: user.addresses[0]?.zipCode || '',
          country: user.addresses[0]?.country || ''
        }
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
        <p className="text-gray-600">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!editing ? (
            <Button onClick={() => setEditing(true)} className="bg-yellow-500 hover:bg-yellow-600">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-yellow-100 text-yellow-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Verified Email</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Premium Member</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {editing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{user.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        {editing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {editing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{formData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="address" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Default Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      {editing ? (
                        <Input
                          id="street"
                          value={formData.address.street}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, street: e.target.value }
                          }))}
                          placeholder="Enter your street address"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 py-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{user.addresses[0]?.street || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        {editing ? (
                          <Input
                            id="city"
                            value={formData.address.city}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              address: { ...prev.address, city: e.target.value }
                            }))}
                            placeholder="City"
                          />
                        ) : (
                          <p className="py-2">{user.addresses[0]?.city || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State</Label>
                        {editing ? (
                          <Input
                            id="state"
                            value={formData.address.state}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              address: { ...prev.address, state: e.target.value }
                            }))}
                            placeholder="State"
                          />
                        ) : (
                          <p className="py-2">{user.addresses[0]?.state || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        {editing ? (
                          <Input
                            id="zipCode"
                            value={formData.address.zipCode}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              address: { ...prev.address, zipCode: e.target.value }
                            }))}
                            placeholder="ZIP Code"
                          />
                        ) : (
                          <p className="py-2">{user.addresses[0]?.zipCode || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="country">Country</Label>
                        {editing ? (
                          <Input
                            id="country"
                            value={formData.address.country}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              address: { ...prev.address, country: e.target.value }
                            }))}
                            placeholder="Country"
                          />
                        ) : (
                          <p className="py-2">{user.addresses[0]?.country || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Account Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Download My Data</Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}