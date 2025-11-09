/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAppSelector } from '@/store';
import { useGetAllRidesQuery, useAcceptRideMutation } from '@/store/api/rideApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import {
  MapPin,
  Navigation,
  DollarSign,
  Clock,
  Phone,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react';

// Type definitions
interface User {
  name: string;
  phone?: string;
}

interface Ride {
  id: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  fare?: number;
  distance?: number;
  createdAt?: string;
  user?: User;
}

export default function IncomingRequests() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();
  const [acceptingRideId, setAcceptingRideId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetAllRidesQuery(
    { status: 'REQUESTED' },
    {
      pollingInterval: 5000, // Poll every 5 seconds for new requests
    }
  );

  const isOnline =
    user && 'availability' in user ? user.availability === 'online' : false;

  if (!isOnline) {
    return (
      <DashboardLayout>
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">You're Currently Offline</h2>
            <p className="text-slate-600 mb-6">
              Go online from the dashboard to start receiving ride requests
            </p>
            <Button onClick={() => navigate('/driver/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading ride requests..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load ride requests" />
      </DashboardLayout>
    );
  }

  const rides: Ride[] = data?.data || [];
  const requestedRides = rides.filter((r: Ride) => r.status === 'REQUESTED');

  const handleAcceptRide = async (rideId: string) => {
    setAcceptingRideId(rideId);
    try {
      const result = await acceptRide(rideId).unwrap();
      toast.success(result.message || 'Ride accepted successfully!');
      navigate('/driver/active-ride');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to accept ride';
      toast.error(errorMessage);
    } finally {
      setAcceptingRideId(null);
    }
  };

  const handleRejectRide = () => {
    // In real app, call reject API
    toast.success('Ride request rejected');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Incoming Ride Requests</h1>
          <p className="text-slate-600">
            Accept ride requests from nearby riders
          </p>
        </div>

        {/* Online Status */}
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
              <span className="font-medium text-green-900">
                You're online and receiving requests
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        {requestedRides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No Requests Available</h3>
              <p className="text-slate-600 mb-4">
                Waiting for ride requests from riders nearby...
              </p>
              <div className="inline-flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                <span>Listening for new requests</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requestedRides.map((ride: Ride) => (
              <Card key={ride.id} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">New Ride Request</CardTitle>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rider Info */}
                  {ride.user && (
                    <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                        {ride.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{ride.user.name}</p>
                        {ride.user.phone && (
                          <p className="text-sm text-slate-600 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {ride.user.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trip Details */}
                  <div className="space-y-3">
                    {/* Pickup */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Pickup Location</p>
                        <p className="font-medium">{ride.pickupLocation}</p>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <Navigation className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Destination</p>
                        <p className="font-medium">{ride.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fare & Distance */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    {ride.fare && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Estimated Fare</p>
                        <div className="flex items-center text-xl font-bold text-green-600">
                          <DollarSign className="h-5 w-5" />
                          {ride.fare.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {ride.distance && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Distance</p>
                        <p className="text-xl font-bold">{ride.distance} km</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleRejectRide}
                      disabled={isAccepting && acceptingRideId === ride.id}
                    >
                      <X className="mr-2 h-5 w-5" />
                      Reject
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleAcceptRide(ride.id)}
                      disabled={isAccepting && acceptingRideId === ride.id}
                    >
                      {isAccepting && acceptingRideId === ride.id ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Accept Ride
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Request Time */}
                  {ride.createdAt && (
                    <div className="text-center text-sm text-slate-500">
                      Requested{' '}
                      {Math.floor(
                        (Date.now() - new Date(ride.createdAt).getTime()) / 60000
                      )}{' '}
                      minutes ago
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
              Driver Tips
            </h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Accept rides that are convenient for your route</li>
              <li>• Check the pickup location before accepting</li>
              <li>• Respond to requests quickly to increase acceptance rate</li>
              <li>• Contact rider if you need clarification on location</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}