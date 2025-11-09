import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useGetDriverRidesQuery, useUpdateRideStatusMutation } from '@/store/api/rideApi';
import type { Ride } from '@/types';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function DriverActiveRide() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetDriverRidesQuery(user?.id || '', {
    skip: !user?.id,
    pollingInterval: 5000,
  });

  const [updateRideStatus, { isLoading: isUpdating }] = useUpdateRideStatusMutation();
  const [progress, setProgress] = useState(0);

  const rides = data?.data || [];
  const activeRide = rides.find(
    (r: Ride) => r.status === 'ACCEPTED' || r.status === 'PICKED_UP' || r.status === 'IN_TRANSIT'
  );

  useEffect(() => {
    if (!activeRide) {
      navigate('/driver/dashboard');
    }
  }, [activeRide, navigate]);

  useEffect(() => {
    if (activeRide) {
      switch (activeRide.status) {
        case 'ACCEPTED':
          setProgress(25);
          break;
        case 'PICKED_UP':
          setProgress(50);
          break;
        case 'IN_TRANSIT':
          setProgress(75);
          break;
        default:
          setProgress(0);
      }
    }
  }, [activeRide]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading active ride..." />
      </DashboardLayout>
    );
  }

  if (!activeRide) {
    return null;
  }

  const handleStatusUpdate = async (newStatus: 'PICKED_UP' | 'IN_TRANSIT' | 'COMPLETED') => {
    try {
      const result = await updateRideStatus({
        id: activeRide.id,
        data: { status: newStatus },
      }).unwrap();

      toast.success(result.message || 'Status updated successfully!');

      if (newStatus === 'COMPLETED') {
        navigate('/driver/dashboard');
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  const handleCancelRide = async () => {
    if (!confirm('Are you sure you want to cancel this ride?')) return;

    try {
      const result = await updateRideStatus({
        id: activeRide.id,
        data: { status: 'CANCELLED' },
      }).unwrap();

      toast.success(result.message || 'Ride cancelled');
      navigate('/driver/dashboard');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Failed to cancel ride';
      toast.error(errorMessage);
    }
  };

  const handleCall = () => {
    if (activeRide.user?.phone) {
      window.location.href = `tel:${activeRide.user.phone}`;
    }
  };

  const handleMessage = () => {
    if (activeRide.user?.phone) {
      window.location.href = `sms:${activeRide.user.phone}`;
    }
  };

  const getNextAction = () => {
    switch (activeRide.status) {
      case 'ACCEPTED':
        return {
          label: 'Arrived at Pickup',
          nextStatus: 'PICKED_UP' as const,
          description: 'Confirm when you arrive at pickup location',
        };
      case 'PICKED_UP':
        return {
          label: 'Start Trip',
          nextStatus: 'IN_TRANSIT' as const,
          description: 'Start the trip to destination',
        };
      case 'IN_TRANSIT':
        return {
          label: 'Complete Ride',
          nextStatus: 'COMPLETED' as const,
          description: 'Complete the ride when arrived at destination',
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          title: 'Heading to Pickup',
          description: 'Navigate to the pickup location',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      case 'PICKED_UP':
        return {
          title: 'Rider Picked Up',
          description: 'Start the trip to destination',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'IN_TRANSIT':
        return {
          title: 'Trip in Progress',
          description: 'Heading to destination',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        };
      default:
        return {
          title: 'Active Ride',
          description: 'Ride in progress',
          color: 'text-slate-600',
          bgColor: 'bg-slate-100',
        };
    }
  };

  const statusInfo = getStatusInfo(activeRide.status);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Header */}
        <Card className={statusInfo.bgColor}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full ${statusInfo.bgColor} flex items-center justify-center border-4 border-white shadow-lg`}>
                  <Clock className={`h-8 w-8 ${statusInfo.color}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${statusInfo.color}`}>
                    {statusInfo.title}
                  </h2>
                  <p className="text-slate-600">{statusInfo.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {activeRide.status}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Ride Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Accepted</span>
                <span>Picked Up</span>
                <span>In Transit</span>
                <span>Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Action Button */}
        {nextAction && (
          <Card className="border-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Next Step</h3>
                  <p className="text-sm text-slate-600">{nextAction.description}</p>
                </div>
                <Button
                  size="lg"
                  onClick={() => handleStatusUpdate(nextAction.nextStatus)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      {nextAction.label}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">Navigation Map</p>
                <p className="text-sm text-slate-500">Real-time route guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Pickup</p>
                  <p className="font-medium">{activeRide.pickupLocation}</p>
                </div>
              </div>

              <Separator />

              {/* Destination */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Navigation className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Destination</p>
                  <p className="font-medium">{activeRide.dropoffLocation}</p>
                </div>
              </div>

              {activeRide.fare && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                      <span className="text-sm text-slate-500">Fare</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      ৳{activeRide.fare.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {activeRide.paymentMethod && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Payment</span>
                    <span className="font-medium capitalize">{activeRide.paymentMethod}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Rider Info & Actions */}
          <div className="space-y-6">
            {/* Rider Card */}
            {activeRide.user && (
              <Card>
                <CardHeader>
                  <CardTitle>Rider Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                      {activeRide.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{activeRide.user.name}</p>
                      <p className="text-sm text-slate-600">{activeRide.user.email}</p>
                    </div>
                  </div>

                  {activeRide.user.phone && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-slate-400" />
                        <span className="text-sm">{activeRide.user.phone}</span>
                      </div>
                    </>
                  )}

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCall}
                      disabled={!activeRide.user.phone}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleMessage}
                      disabled={!activeRide.user.phone}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cancel Button */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-red-900">Cancel Ride</h3>
                <p className="text-sm text-red-700 mb-4">
                  Only cancel if there's a valid reason
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelRide}
                  disabled={isUpdating}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Cancel Ride
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}