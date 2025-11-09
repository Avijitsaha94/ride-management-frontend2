/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRequestRideMutation } from '@/store/api/rideApi';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Navigation, DollarSign, CreditCard, Loader2 } from 'lucide-react';

const rideRequestSchema = z.object({
  pickupLocation: z.string().min(3, 'Pickup location is required'),
  dropoffLocation: z.string().min(3, 'Drop-off location is required'),
  paymentMethod: z.enum(['cash', 'card', 'wallet']),
});

type RideRequestFormData = z.infer<typeof rideRequestSchema>;

export default function RequestRide() {
  const navigate = useNavigate();
  const [requestRide, { isLoading }] = useRequestRideMutation();
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RideRequestFormData>({
    resolver: zodResolver(rideRequestSchema),
    defaultValues: {
      paymentMethod: 'cash',
    },
  });

  const pickupLocation = watch('pickupLocation');
  const dropoffLocation = watch('dropoffLocation');

  // Estimate fare based on locations (mock calculation)
  const calculateEstimate = () => {
    if (pickupLocation && dropoffLocation && pickupLocation.length > 3 && dropoffLocation.length > 3) {
      // Mock calculation - in real app, call API
      const baseFare = 50;
      const perKmRate = 15;
      const estimatedDistance = Math.random() * 10 + 2; // Random 2-12 km
      const fare = baseFare + (estimatedDistance * perKmRate);
      setEstimatedFare(Math.round(fare));
    }
  };

  const onSubmit = async (data: RideRequestFormData) => {
    try {
      const result = await requestRide({
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        paymentMethod: data.paymentMethod,
      }).unwrap();

      toast.success(result.message || 'Ride requested successfully!');
      navigate('/rider/dashboard');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to request ride. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Request a Ride</h1>
          <p className="text-slate-600">Enter your pickup and destination to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">
                  Pickup Location *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="pickupLocation"
                    placeholder="Enter pickup location"
                    className={`pl-10 ${errors.pickupLocation ? 'border-red-500' : ''}`}
                    {...register('pickupLocation')}
                    onBlur={calculateEstimate}
                  />
                </div>
                {errors.pickupLocation && (
                  <p className="text-sm text-red-500">{errors.pickupLocation.message}</p>
                )}
              </div>

              {/* Dropoff Location */}
              <div className="space-y-2">
                <Label htmlFor="dropoffLocation">
                  Drop-off Location *
                </Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="dropoffLocation"
                    placeholder="Enter destination"
                    className={`pl-10 ${errors.dropoffLocation ? 'border-red-500' : ''}`}
                    {...register('dropoffLocation')}
                    onBlur={calculateEstimate}
                  />
                </div>
                {errors.dropoffLocation && (
                  <p className="text-sm text-red-500">{errors.dropoffLocation.message}</p>
                )}
              </div>

              {/* Fare Estimation */}
              {estimatedFare && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Estimated Fare</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        ৳{estimatedFare}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      * Final fare may vary based on actual distance and traffic
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">
                  Payment Method *
                </Label>
                <Select
                  onValueChange={(value) => setValue('paymentMethod', value as any)}
                  defaultValue="cash"
                >
                  <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit/Debit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="wallet">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Digital Wallet
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/rider/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    'Request Ride'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Real-time Tracking</h3>
              <p className="text-sm text-slate-600">Track your driver in real-time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Multiple Payments</h3>
              <p className="text-sm text-slate-600">Pay with cash, card, or wallet</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Fair Pricing</h3>
              <p className="text-sm text-slate-600">Transparent and competitive fares</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}