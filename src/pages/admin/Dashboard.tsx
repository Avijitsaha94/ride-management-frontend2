import { useGetAllUsersQuery } from '@/store/api/userApi';
import { useGetAllRidesQuery } from '@/store/api/rideApi';
import { useGetAllDriversQuery } from '@/store/api/driverApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { User, Ride, Driver } from '@/types';
import { Link } from 'react-router-dom';
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Calendar,
  UserCheck,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function AdminDashboard() {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUsersQuery();
  const { data: ridesData, isLoading: ridesLoading, error: ridesError } = useGetAllRidesQuery();
  const { data: driversData, isLoading: driversLoading, error: driversError } = useGetAllDriversQuery();

  if (usersLoading || ridesLoading || driversLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (usersError || ridesError || driversError) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load dashboard data" />
      </DashboardLayout>
    );
  }

  const users = usersData?.data || [];
  const rides = ridesData?.data || [];
  const drivers = driversData?.data || [];

  const totalUsers = users.filter((u: User) => u.role === 'USER').length;
  const totalDrivers = drivers.length;
  const totalRides = rides.length;
  const totalRevenue = rides
    .filter((r: Ride) => r.status === 'COMPLETED')
    .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  // Today's stats
  const today = new Date();
  const todayRides = rides.filter((r: Ride) => {
    const rideDate = new Date(r.createdAt || '');
    return (
      rideDate.getDate() === today.getDate() &&
      rideDate.getMonth() === today.getMonth() &&
      rideDate.getFullYear() === today.getFullYear()
    );
  });

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
    },
    {
      title: 'Total Drivers',
      value: totalDrivers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
    },
    {
      title: 'Total Rides',
      value: totalRides,
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+23%',
    },
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+15%',
    },
  ];

  // Chart data - Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dailyData = last7Days.map((date) => {
    const dayRides = rides.filter((r: Ride) => {
      const rideDate = new Date(r.createdAt || '');
      return (
        rideDate.getDate() === date.getDate() &&
        rideDate.getMonth() === date.getMonth() &&
        rideDate.getFullYear() === date.getFullYear()
      );
    });
    const revenue = dayRides
      .filter((r: Ride) => r.status === 'COMPLETED')
      .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);
    return {
      date: format(date, 'EEE'),
      rides: dayRides.length,
      revenue: Number(revenue.toFixed(2)),
    };
  });

  const recentRides = rides.slice(0, 5);
  const onlineDrivers = drivers.filter((d: Driver) => d.availability === 'online').length;

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Welcome to the admin control panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Users</h3>
                    <p className="text-slate-600 text-sm">View and manage all users</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/rides" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Rides</h3>
                    <p className="text-slate-600 text-sm">Oversee all ride activities</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/analytics" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">View Analytics</h3>
                    <p className="text-slate-600 text-sm">Detailed insights & reports</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Total Rides Today</p>
                  <p className="text-2xl font-bold">{todayRides.length}</p>
                </div>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Online Drivers</p>
                  <p className="text-2xl font-bold">{onlineDrivers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Active Rides</p>
                  <p className="text-2xl font-bold">
                    {rides.filter(
                      (r: Ride) =>
                        r.status === 'ACCEPTED' ||
                        r.status === 'PICKED_UP' ||
                        r.status === 'IN_TRANSIT'
                    ).length}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Platform Status</span>
                <Badge className="bg-green-100 text-green-700">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">API Status</span>
                <Badge className="bg-green-100 text-green-700">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Database</span>
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Payment Gateway</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">SMS Service</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rides Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Rides (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip labelStyle={{ color: '#000' }} />
                  <Line
                    type="monotone"
                    dataKey="rides"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `৳${value.toFixed(2)}`}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Rides */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Rides</CardTitle>
              <Button variant="ghost" asChild>
                <Link to="/admin/rides">
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
                <p className="text-slate-600">Rides will appear here once users start booking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRides.map((ride: Ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getStatusColor(ride.status)}>{ride.status}</Badge>
                          {ride.createdAt && (
                            <span className="text-sm text-slate-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(ride.createdAt), 'MMM dd, HH:mm')}
                            </span>
                          )}
                        </div>
                        <p className="font-medium truncate">{ride.pickupLocation}</p>
                        <p className="text-sm text-slate-600 truncate">
                          Rider: {ride.user?.name || 'N/A'} • Driver:{' '}
                          {ride.driver?.name || 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      {ride.fare && (
                        <p className="font-semibold text-green-600">৳{ride.fare.toFixed(2)}</p>
                      )}
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