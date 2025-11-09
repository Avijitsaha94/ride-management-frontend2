import { useAppSelector } from '@/store';
import { useGetDriverRidesQuery } from '@/store/api/rideApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Car,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Calendar,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';

// Type definitions
interface Ride {
  id: string;
  status: string;
  createdAt?: string;
  fare?: number;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod?: string;
}

export default function DriverDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetDriverRidesQuery(user?.id || '', {
    skip: !user?.id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load dashboard data" />
      </DashboardLayout>
    );
  }

  const rides: Ride[] = data?.data || [];
  const completedRides = rides.filter((r: Ride) => r.status === 'COMPLETED');
  const todayRides = rides.filter((r: Ride) => {
    const rideDate = new Date(r.createdAt || '');
    const today = new Date();
    return (
      rideDate.getDate() === today.getDate() &&
      rideDate.getMonth() === today.getMonth() &&
      rideDate.getFullYear() === today.getFullYear()
    );
  });

  const totalEarnings = completedRides.reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);
  const todayEarnings = todayRides
    .filter((r: Ride) => r.status === 'COMPLETED')
    .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  const activeRide = rides.find(
    (r: Ride) =>
      r.status === 'ACCEPTED' || r.status === 'PICKED_UP' || r.status === 'IN_TRANSIT'
  );

  const isOnline =
    user && 'availability' in user ? user.availability === 'online' : false;

  const stats = [
    {
      title: 'Total Earnings',
      value: `৳${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Today Earnings',
      value: `৳${todayEarnings.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed Rides',
      value: completedRides.length,
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Today Rides',
      value: todayRides.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentRides = rides.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'ACCEPTED':
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-700';
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-600">
            {isOnline
              ? "You're online and ready to accept rides"
              : 'Go online to start receiving ride requests'}
          </p>
        </div>

        {/* Status Alert */}
        {!isOnline && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-600 text-white flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">You're Currently Offline</h3>
                    <p className="text-slate-600">
                      Toggle your status to online to start receiving ride requests
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Ride Alert */}
        {activeRide && isOnline && (
          <Card className="border-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">You have an active ride!</h3>
                    <p className="text-slate-600">
                      {activeRide.pickupLocation} → {activeRide.dropoffLocation}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/driver/active-ride">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {isOnline && (
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/driver/requests" className="block">
              <Card className="border-primary hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Incoming Requests</h3>
                      <p className="text-slate-600">View and accept ride requests</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/driver/earnings" className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">View Earnings</h3>
                      <p className="text-slate-600">Check your earnings report</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Driver Stats */}
        {user && 'rating' in user && (
          <Card>
            <CardHeader>
              <CardTitle>Your Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold">{user.rating?.toFixed(1) || '0.0'}</div>
                  <div className="text-sm text-slate-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">{user.totalRides || 0}</div>
                  <div className="text-sm text-slate-600">Total Rides</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">
                    ৳{(user.earnings || 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-slate-600">Total Earnings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Rides */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Rides</CardTitle>
              <Button variant="ghost" asChild>
                <Link to="/driver/rides">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentRides.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rides yet</h3>
                <p className="text-slate-600 mb-4">
                  {isOnline
                    ? 'Wait for ride requests from riders'
                    : 'Go online to start accepting rides'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRides.map((ride: Ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getStatusColor(ride.status)}>
                            {ride.status}
                          </Badge>
                          {ride.createdAt && (
                            <span className="text-sm text-slate-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(ride.createdAt), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                        <p className="font-medium truncate">{ride.pickupLocation}</p>
                        <p className="text-sm text-slate-600 truncate">
                          {ride.dropoffLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {ride.fare && (
                        <div className="text-right">
                          <p className="font-semibold">৳{ride.fare.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">{ride.paymentMethod}</p>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/driver/rides/${ride.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}