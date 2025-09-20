import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Upload, Phone, Mail, CreditCard, Building, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VendorFormData {
  name: string;
  shopName: string;
  phone: string;
  email: string;
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  manualLatitude: string;
  manualLongitude: string;
  aadhaarImage: File | null;
  panImage: File | null;
  shopImage: File | null;
}

interface VendorRegistrationFormProps {
  onSubmit: (data: VendorFormData) => void;
}

export function VendorRegistrationForm({ onSubmit }: VendorRegistrationFormProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    shopName: '',
    phone: '',
    email: '',
    aadhaarNumber: '',
    panNumber: '',
    gstNumber: '',
    address: '',
    location: null,
    manualLatitude: '',
    manualLongitude: '',
    aadhaarImage: null,
    panImage: null,
    shopImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VendorFormData>>({});

  const handleInputChange = (field: keyof VendorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (field: 'aadhaarImage' | 'panImage' | 'shopImage', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            // Clear manual coordinates when auto location is captured
            manualLatitude: '',
            manualLongitude: ''
          }));
          toast.success('Location captured successfully!');
          setLoading(false);
        },
        (error) => {
          toast.error('Failed to get location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<VendorFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.aadhaarNumber.trim() && !formData.panNumber.trim()) {
      newErrors.aadhaarNumber = 'Either Aadhaar or PAN number is required';
    }
    if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Validate manual coordinates if provided
    if (formData.manualLatitude && (isNaN(Number(formData.manualLatitude)) || Number(formData.manualLatitude) < -90 || Number(formData.manualLatitude) > 90)) {
      newErrors.manualLatitude = 'Invalid latitude (must be between -90 and 90)';
    }
    if (formData.manualLongitude && (isNaN(Number(formData.manualLongitude)) || Number(formData.manualLongitude) < -180 || Number(formData.manualLongitude) > 180)) {
      newErrors.manualLongitude = 'Invalid longitude (must be between -180 and 180)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Merge manual coordinates into location if provided
      const finalFormData = {
        ...formData,
        location: formData.location || (formData.manualLatitude && formData.manualLongitude ? {
          latitude: Number(formData.manualLatitude),
          longitude: Number(formData.manualLongitude)
        } : null)
      };
      onSubmit(finalFormData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Registration
            </h1>
            <p className="text-muted-foreground">Complete your business registration to join our marketplace</p>
          </div>

          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90">
            <CardHeader className="pb-6">
              <div className="w-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Registration Details
                  </span>
                  <span className="text-muted-foreground">Step 1 of 2</span>
                </div>
              </div>
            </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg">Personal Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email ID *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
              </div>
            </div>

            {/* Shop Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg">Shop Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shopName">
                  <Building className="inline h-4 w-4 mr-1" />
                  Shop Name *
                </Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  placeholder="Enter your shop name"
                />
                {errors.shopName && <p className="text-destructive text-sm">{errors.shopName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber">
                  <CreditCard className="inline h-4 w-4 mr-1" />
                  GST Number *
                </Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  placeholder="Enter GST number"
                />
                {errors.gstNumber && <p className="text-destructive text-sm">{errors.gstNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
                {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
              </div>

              <div className="space-y-4">
                <Label>
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location Coordinates (Optional)
                </Label>
                
                {/* Auto Location Button */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={loading}
                      className="flex-shrink-0"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {loading ? 'Getting Location...' : 'Get Current Location'}
                    </Button>
                    {formData.location && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-muted-foreground">
                          Location captured: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Manual Entry */}
                  <div className="border-t pt-3">
                    <Label className="text-sm text-muted-foreground mb-3 block">Or enter coordinates manually:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="manualLatitude" className="text-sm">Latitude</Label>
                        <Input
                          id="manualLatitude"
                          type="number"
                          step="any"
                          value={formData.manualLatitude}
                          onChange={(e) => {
                            handleInputChange('manualLatitude', e.target.value);
                            // Clear auto location if manual entry is made
                            if (e.target.value) {
                              setFormData(prev => ({ ...prev, location: null }));
                            }
                          }}
                          placeholder="e.g., 28.6139"
                          disabled={!!formData.location}
                        />
                        {errors.manualLatitude && <p className="text-destructive text-sm">{errors.manualLatitude}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="manualLongitude" className="text-sm">Longitude</Label>
                        <Input
                          id="manualLongitude"
                          type="number"
                          step="any"
                          value={formData.manualLongitude}
                          onChange={(e) => {
                            handleInputChange('manualLongitude', e.target.value);
                            // Clear auto location if manual entry is made
                            if (e.target.value) {
                              setFormData(prev => ({ ...prev, location: null }));
                            }
                          }}
                          placeholder="e.g., 77.2090"
                          disabled={!!formData.location}
                        />
                        {errors.manualLongitude && <p className="text-destructive text-sm">{errors.manualLongitude}</p>}
                      </div>
                    </div>
                    
                    {(formData.manualLatitude || formData.manualLongitude) && !formData.location && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          Manual coordinates: {formData.manualLatitude || '0'}, {formData.manualLongitude || '0'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg">Document Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                    placeholder="Enter Aadhaar number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    placeholder="Enter PAN number"
                  />
                </div>
              </div>
              {errors.aadhaarNumber && <p className="text-destructive text-sm">{errors.aadhaarNumber}</p>}
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Upload className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg">Upload Documents</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarImage">
                    <Upload className="inline h-4 w-4 mr-1" />
                    Aadhaar/PAN Image
                  </Label>
                  <Input
                    id="aadhaarImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('aadhaarImage', e.target.files?.[0] || null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopImage">
                    <Upload className="inline h-4 w-4 mr-1" />
                    Shop Image *
                  </Label>
                  <Input
                    id="shopImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('shopImage', e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Continue to Payment
            </Button>
          </form>
        </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}