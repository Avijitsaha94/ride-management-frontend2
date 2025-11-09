import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useGetUserRidesQuery } from '@/store/api/rideApi';
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
  AlertCircle,
  Car,
  Clock,
  DollarSign,
} from 'lucide-react';

export default function ActiveRide() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetUserRidesQuery(user?.id || '', {
    skip: !user?.id,
    pollingInterval: 5000, // Poll every 5 seconds for real-time updates
  });

  const [progress, setProgress] = useState(0);

  const rides = data?.data || [];
  const activeRide = rides.find(
    (r) => r.status === 'ACCEPTED' || r.status === 'PICKED_UP' || r.status === 'IN_TRANSIT'
  );

  useEffect(() => {
    if (!activeRide) {
      navigate('/rider/dashboard');
    }
  }, [activeRide, navigate]);

  useEffect(() => {
    // Animate progress based on status
    if (activeRide) {
      switch (activeRide.status) {
        case 'ACCEPTED':
          setProgress(33);
          break;
        case 'PICKED_UP':
          setProgress(66);
          break;
        case 'IN_TRANSIT':
          setProgress(90);
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          title: 'Driver is on the way',
          description: 'Your driver is heading to your pickup location',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        };
      case 'PICKED_UP':
        return {
          title: 'You have been picked up',
          description: 'Enjoy your ride to the destination',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'IN_TRANSIT':
        return {
          title: 'On the way to destination',
          description: 'You will arrive shortly',
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

  const handleCall = () => {
    if (activeRide.driver?.phone) {
      window.location.href = `tel:${activeRide.driver.phone}`;
    }
  };

  const handleMessage = () => {
    if (activeRide.driver?.phone) {
      window.location.href = `sms:${activeRide.driver.phone}`;
    }
  };

  const handleSOS = () => {
    // SOS functionality - would open emergency dialog
    alert('SOS feature - Contact emergency services');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Header */}
        <Card className={statusInfo.bgColor}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full ${statusInfo.bgColor} flex items-center justify-center`}>
                <Car className={`h-8 w-8 ${statusInfo.color}`} />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${statusInfo.color}`}>
                  {statusInfo.title}
                </h2>
                <p className="text-slate-600">{statusInfo.description}</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {activeRide.status}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Ride Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">Live Tracking Map</p>
                <p className="text-sm text-slate-500">Real-time location tracking</p>
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
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
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
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
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
                      <span className="text-sm text-slate-500">Estimated Fare</span>
                    </div>
                    <span className="text-lg font-bold">৳{activeRide.fare.toFixed(2)}</span>
                  </div>
                </>
              )}

              {activeRide.distance && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Car className="h-5 w-5 text-slate-400" />
                      <span className="text-sm text-slate-500">Distance</span>
                    </div>
                    <span className="font-medium">{activeRide.distance} km</span>
                  </div>
                </>
              )}

              {activeRide.duration && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-slate-400" />
                      <span className="text-sm text-slate-500">Duration</span>
                    </div>
                    <span className="font-medium">{activeRide.duration} min</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Driver Info & Actions */}
          <div className="space-y-6">
            {/* Driver Card */}
            {activeRide.driver && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Driver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                      {activeRide.driver.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{activeRide.driver.name}</p>
                      {activeRide.driver.rating && (
                        <p className="text-sm text-slate-600">
                          ⭐ {activeRide.driver.rating.toFixed(1)} rating
                        </p>
                      )}
                    </div>
                  </div>

                  {activeRide.driver.vehicleDetails && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="font-medium">
                            {activeRide.driver.vehicleDetails.model}
                          </p>
                          <p className="text-sm text-slate-600">
                            {activeRide.driver.vehicleDetails.color} •{' '}
                            {activeRide.driver.vehicleDetails.licensePlate}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCall}
                      disabled={!activeRide.driver.phone}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleMessage}
                      disabled={!activeRide.driver.phone}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SOS Button */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Emergency Help</h3>
                    <p className="text-sm text-red-700">Press for immediate assistance</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  size="lg"
                  onClick={handleSOS}
                >
                  <AlertCircle className="mr-2 h-5 w-5" />
                  SOS Emergency
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ride Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Ride Tips</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Always verify driver details before getting in</li>
              <li>• Share your trip details with family or friends</li>
              <li>• Use the SOS button if you feel unsafe</li>
              <li>• Check the license plate matches before boarding</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}