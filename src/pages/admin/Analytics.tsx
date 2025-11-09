import { useGetAllUsersQuery } from '@/store/api/userApi';
import { useGetAllRidesQuery } from '@/store/api/rideApi';
import { useGetAllDriversQuery } from '@/store/api/driverApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { User, Ride, Driver } from '@/types';
import {
  TrendingUp,
  Users,
  Car,
  DollarSign,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
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
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

// Define interface for driver performance
interface DriverPerformance {
  name: string;
  rides: number;
  earnings: number;
  rating: number;
}

export default function AdminAnalytics() {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUsersQuery();
  const { data: ridesData, isLoading: ridesLoading, error: ridesError } = useGetAllRidesQuery();
  const { data: driversData, isLoading: driversLoading, error: driversError } = useGetAllDriversQuery();

  if (usersLoading || ridesLoading || driversLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading analytics..." />
      </DashboardLayout>
    );
  }

  if (usersError || ridesError || driversError) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load analytics data" />
      </DashboardLayout>
    );
  }

  const users = usersData?.data || [];
  const rides = ridesData?.data || [];
  const drivers = driversData?.data || [];

  const totalRiders = users.filter((u: User) => u.role === 'USER').length;
  const totalDrivers = drivers.length;
  const completedRides = rides.filter((r: Ride) => r.status === 'COMPLETED');
  const totalRevenue = completedRides.reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);
  const averageRideValue = completedRides.length > 0 ? totalRevenue / completedRides.length : 0;

  // Monthly data for current month
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthlyData = daysInMonth.map((date) => {
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
      date: format(date, 'dd'),
      rides: dayRides.length,
      revenue: Number(revenue.toFixed(2)),
      completed: dayRides.filter((r: Ride) => r.status === 'COMPLETED').length,
    };
  });

  // Status distribution
  const statusData = [
    {
      name: 'Completed',
      value: rides.filter((r: Ride) => r.status === 'COMPLETED').length,
      color: '#10b981',
    },
    {
      name: 'Cancelled',
      value: rides.filter((r: Ride) => r.status === 'CANCELLED').length,
      color: '#ef4444',
    },
    {
      name: 'Active',
      value: rides.filter(
        (r: Ride) =>
          r.status === 'ACCEPTED' || r.status === 'PICKED_UP' || r.status === 'IN_TRANSIT'
      ).length,
      color: '#3b82f6',
    },
    {
      name: 'Pending',
      value: rides.filter((r: Ride) => r.status === 'REQUESTED').length,
      color: '#f59e0b',
    },
  ].filter((item) => item.value > 0);

  // Payment method distribution
  const paymentData = [
    {
      name: 'Cash',
      value: completedRides.filter((r: Ride) => r.paymentMethod === 'cash').length,
      color: '#10b981',
    },
    {
      name: 'Card',
      value: completedRides.filter((r: Ride) => r.paymentMethod === 'card').length,
      color: '#3b82f6',
    },
    {
      name: 'Wallet',
      value: completedRides.filter((r: Ride) => r.paymentMethod === 'wallet').length,
      color: '#f59e0b',
    },
  ].filter((item) => item.value > 0);

  // Top performing drivers
  const driverPerformance = drivers
    .map((driver: Driver) => {
      const driverRides = rides.filter((r: Ride) => r.driver?.id === driver.id && r.status === 'COMPLETED');
      const earnings = driverRides.reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);
      return {
        name: driver.name,
        rides: driverRides.length,
        earnings: Number(earnings.toFixed(2)),
        rating: driver.rating || 0,
      };
    })
    .sort((a: DriverPerformance, b: DriverPerformance) => b.earnings - a.earnings)
    .slice(0, 10);

  const stats = [
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+15.3%',
    },
    {
      title: 'Average Ride Value',
      value: `৳${averageRideValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8.1%',
    },
    {
      title: 'Active Users',
      value: totalRiders + totalDrivers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+12.5%',
    },
    {
      title: 'Completion Rate',
      value: `${rides.length > 0 ? ((completedRides.length / rides.length) * 100).toFixed(1) : 0}%`,
      icon: Car,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+3.2%',
    },
  ];

  // Custom label renderer for pie charts
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Detailed insights and performance metrics</p>
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

        {/* Charts Tabs */}
        <Tabs defaultValue="revenue">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="rides">Rides</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue (Current Month)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => `৳${value.toFixed(2)}`}
                      labelStyle={{ color: '#000' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">
                    ৳
                    {monthlyData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600">This Month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">
                    ৳
                    {(monthlyData.reduce((sum, d) => sum + d.revenue, 0) / monthlyData.length).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600">Daily Average</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">
                    ৳{Math.max(...monthlyData.map((d) => d.revenue)).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600">Highest Day</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rides Tab */}
          <TabsContent value="rides">
            <Card>
              <CardHeader>
                <CardTitle>Daily Rides & Completions (Current Month)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip labelStyle={{ color: '#000' }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rides"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Total Rides"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ride Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Ride Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Method Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={driverPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'earnings') return `৳${value.toFixed(2)}`;
                        return value;
                      }}
                      labelStyle={{ color: '#000' }}
                    />
                    <Legend />
                    <Bar dataKey="earnings" fill="#10b981" name="Earnings (৳)" />
                    <Bar dataKey="rides" fill="#3b82f6" name="Total Rides" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Total Riders</p>
                  <p className="text-2xl font-bold text-blue-600">{totalRiders}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Total Drivers</p>
                  <p className="text-2xl font-bold text-green-600">{totalDrivers}</p>
                </div>
                <Car className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Active Drivers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {drivers.filter((d: Driver) => d.availability === 'online').length}
                  </p>
                </div>
                <Car className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Completion Rate</span>
                  <span className="text-sm font-medium">
                    {rides.length > 0
                      ? ((completedRides.length / rides.length) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        rides.length > 0
                          ? (completedRides.length / rides.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Cancellation Rate</span>
                  <span className="text-sm font-medium">
                    {rides.length > 0
                      ? (
                          (rides.filter((r: Ride) => r.status === 'CANCELLED').length / rides.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        rides.length > 0
                          ? (rides.filter((r: Ride) => r.status === 'CANCELLED').length /
                              rides.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Driver Utilization</span>
                  <span className="text-sm font-medium">
                    {totalDrivers > 0
                      ? (
                          (drivers.filter((d: Driver) => d.availability === 'online').length /
                            totalDrivers) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        totalDrivers > 0
                          ? (drivers.filter((d: Driver) => d.availability === 'online').length /
                              totalDrivers) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Average Ride Distance</span>
                  <span className="text-sm font-bold">
                    {completedRides.length > 0
                      ? (
                          completedRides.reduce((sum: number, r: Ride) => sum + (r.distance || 0), 0) /
                          completedRides.length
                        ).toFixed(1)
                      : 0}{' '}
                    km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Average Ride Duration</span>
                  <span className="text-sm font-bold">
                    {completedRides.length > 0
                      ? (
                          completedRides.reduce((sum: number, r: Ride) => sum + (r.duration || 0), 0) /
                          completedRides.length
                        ).toFixed(0)
                      : 0}{' '}
                    min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}