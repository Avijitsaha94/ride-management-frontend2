/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAppSelector } from '@/store';
import { useGetDriverRidesQuery } from '@/store/api/rideApi';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Car,
} from 'lucide-react';
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
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
} from 'recharts';

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

export default function DriverEarnings() {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetDriverRidesQuery(user?.id || '', {
    skip: !user?.id,
  });

  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading earnings..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load earnings data" />
      </DashboardLayout>
    );
  }

  const rides: Ride[] = data?.data || [];
  const completedRides = rides.filter((r: Ride) => r.status === 'COMPLETED');

  // Calculate earnings
  const totalEarnings = completedRides.reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  // Today's earnings
  const todayEarnings = completedRides
    .filter((r: Ride) => {
      const rideDate = new Date(r.createdAt || '');
      const today = new Date();
      return (
        rideDate.getDate() === today.getDate() &&
        rideDate.getMonth() === today.getMonth() &&
        rideDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  // This week's earnings
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekEarnings = completedRides
    .filter((r: Ride) => {
      const rideDate = new Date(r.createdAt || '');
      return rideDate >= weekStart && rideDate <= weekEnd;
    })
    .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  // This month's earnings
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const monthEarnings = completedRides
    .filter((r: Ride) => {
      const rideDate = new Date(r.createdAt || '');
      return rideDate >= monthStart && rideDate <= monthEnd;
    })
    .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  // Calculate percentage changes (mock data for demo)
  const todayChange = 12.5;
  const weekChange = 8.3;
  const monthChange = 15.7;

  const stats = [
    {
      title: 'Today',
      value: `৳${todayEarnings.toFixed(2)}`,
      change: todayChange,
      icon: DollarSign,
    },
    {
      title: 'This Week',
      value: `৳${weekEarnings.toFixed(2)}`,
      change: weekChange,
      icon: Calendar,
    },
    {
      title: 'This Month',
      value: `৳${monthEarnings.toFixed(2)}`,
      change: monthChange,
      icon: TrendingUp,
    },
    {
      title: 'Total Earnings',
      value: `৳${totalEarnings.toFixed(2)}`,
      change: 0,
      icon: DollarSign,
    },
  ];

  // Chart data - Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dailyData = last7Days.map((date) => {
    const dayRides = completedRides.filter((r: Ride) => {
      const rideDate = new Date(r.createdAt || '');
      return (
        rideDate.getDate() === date.getDate() &&
        rideDate.getMonth() === date.getMonth() &&
        rideDate.getFullYear() === date.getFullYear()
      );
    });
    const earnings = dayRides.reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);
    return {
      date: format(date, 'EEE'),
      earnings: Number(earnings.toFixed(2)),
      rides: dayRides.length,
    };
  });

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

  // Custom label renderer for pie chart
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

  const handleDownloadReport = () => {
    toast.success('Downloading earnings report...');
    // In real app, generate and download PDF/CSV
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings</h1>
            <p className="text-slate-600">Track your earnings and performance</p>
          </div>
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    {stat.change !== 0 && (
                      <div
                        className={`flex items-center text-sm font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(stat.change)}%
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as 'daily' | 'weekly' | 'monthly')}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Earnings (Last 7 Days)</CardTitle>
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
                    <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ৳{weekEarnings.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">This Week's Earnings</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {completedRides.filter((r: Ride) => {
                        const rideDate = new Date(r.createdAt || '');
                        return rideDate >= weekStart && rideDate <= weekEnd;
                      }).length}
                    </div>
                    <div className="text-sm text-slate-600">Completed Rides</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ৳{weekEarnings > 0 ? (weekEarnings / (completedRides.filter((r: Ride) => {
                        const rideDate = new Date(r.createdAt || '');
                        return rideDate >= weekStart && rideDate <= weekEnd;
                      }).length || 1)).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-slate-600">Avg per Ride</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ৳{monthEarnings.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">This Month's Earnings</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {completedRides.filter((r: Ride) => {
                        const rideDate = new Date(r.createdAt || '');
                        return rideDate >= monthStart && rideDate <= monthEnd;
                      }).length}
                    </div>
                    <div className="text-sm text-slate-600">Completed Rides</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ৳{monthEarnings > 0 ? (monthEarnings / (completedRides.filter((r: Ride) => {
                        const rideDate = new Date(r.createdAt || '');
                        return rideDate >= monthStart && rideDate <= monthEnd;
                      }).length || 1)).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-slate-600">Avg per Ride</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Methods Distribution */}
        {paymentData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
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

                <div className="space-y-4">
                  {paymentData.map((method) => (
                    <div key={method.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: method.color }}
                        />
                        <span className="font-medium">{method.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{method.value} rides</div>
                        <div className="text-sm text-slate-600">
                          {((method.value / completedRides.length) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            {completedRides.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No earnings yet</h3>
                <p className="text-slate-600">Complete rides to start earning</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedRides.slice(0, 10).map((ride: Ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{ride.pickupLocation}</p>
                      <p className="text-sm text-slate-600">
                        {ride.createdAt
                          ? format(new Date(ride.createdAt), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ৳{ride.fare?.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{ride.paymentMethod}</p>
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