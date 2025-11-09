import { useParams, useNavigate } from 'react-router-dom';
import { useGetRideByIdQuery } from '@/store/api/rideApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import {
  MapPin,
  Navigation,
  Calendar,
  CreditCard,
  User,
  Phone,
  Car,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

export default function RideDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetRideByIdQuery(id || '', {
    skip: !id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading ride details..." />
      </DashboardLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load ride details" />
      </DashboardLayout>
    );
  }

  const ride = data.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ACCEPTED':
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const statusTimeline = [
    { status: 'REQUESTED', label: 'Ride Requested', icon: Clock },
    { status: 'ACCEPTED', label: 'Driver Accepted', icon: CheckCircle2 },
    { status: 'PICKED_UP', label: 'Picked Up', icon: User },
    { status: 'IN_TRANSIT', label: 'In Transit', icon: Car },
    { status: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
  ];

  const currentStatusIndex = statusTimeline.findIndex((s) => s.status === ride.status);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ride Details</h1>
              <p className="text-slate-600">Ride ID: {ride.id}</p>
            </div>
            <Badge className={`${getStatusColor(ride.status)} text-lg px-4 py-2`}>
              {ride.status}
            </Badge>
          </div>
        </div>

        {/* Status Timeline */}
        {ride.status !== 'CANCELLED' && (
          <Card>
            <CardHeader>
              <CardTitle>Ride Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${(currentStatusIndex / (statusTimeline.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusTimeline.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white border-slate-300 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p
                          className={`mt-2 text-xs text-center max-w-20 ${
                            isCompleted ? 'text-slate-900 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pickup */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup Location</p>
                  <p className="font-medium">{ride.pickupLocation}</p>
                </div>
              </div>

              <Separator />

              {/* Dropoff */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Navigation className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Drop-off Location</p>
                  <p className="font-medium">{ride.dropoffLocation}</p>
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date & Time</p>
                  <p className="font-medium">
                    {ride.createdAt
                      ? format(new Date(ride.createdAt), 'PPP p')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {ride.distance && (
                <>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Car className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Distance</p>
                      <p className="font-medium">{ride.distance} km</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment & Driver Info */}
          <div className="space-y-6">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ride.fare && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Base Fare</span>
                    <span className="font-semibold">৳{ride.fare.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">৳{ride.fare?.toFixed(2) || '0.00'}</span>
                </div>

                <Separator />

                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Payment Method</p>
                    <p className="font-medium capitalize">
                      {ride.paymentMethod || 'Cash'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Details */}
            {ride.driver && (
              <Card>
                <CardHeader>
                  <CardTitle>Driver Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                      {ride.driver.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{ride.driver.name}</p>
                      <p className="text-sm text-slate-500">{ride.driver.email}</p>
                    </div>
                  </div>

                  {ride.driver.phone && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p className="font-medium">{ride.driver.phone}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {ride.driver.vehicleDetails && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Vehicle</p>
                          <p className="font-medium">
                            {ride.driver.vehicleDetails.model} - {ride.driver.vehicleDetails.color}
                          </p>
                          {ride.driver.vehicleDetails.licensePlate && (
                            <p className="text-sm text-slate-600">
                              {ride.driver.vehicleDetails.licensePlate}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}