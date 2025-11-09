import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useGetDriverRidesQuery } from '@/store/api/rideApi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import {
  MapPin,
  Navigation,
  Calendar,
  DollarSign,
  Search,
  Filter,
  ChevronRight,
  Car,
} from 'lucide-react';
import { format } from 'date-fns';

// Type definitions
interface User {
  name: string;
  phone?: string;
}

interface Ride {
  id: string;
  status: string;
  createdAt?: string;
  fare?: number;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod?: string;
  user?: User;
}

export default function DriverRideHistory() {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetDriverRidesQuery(user?.id || '', {
    skip: !user?.id,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading ride history..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load ride history" />
      </DashboardLayout>
    );
  }

  const rides: Ride[] = data?.data || [];

  // Filter rides
  const filteredRides = rides.filter((ride: Ride) => {
    const matchesSearch =
      ride.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRides = filteredRides.slice(startIndex, endIndex);

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

  const totalEarnings = rides
    .filter((r: Ride) => r.status === 'COMPLETED')
    .reduce((sum: number, r: Ride) => sum + (r.fare || 0), 0);

  const stats = [
    {
      label: 'Total Rides',
      value: rides.length,
      color: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: rides.filter((r: Ride) => r.status === 'COMPLETED').length,
      color: 'text-green-600',
    },
    {
      label: 'Cancelled',
      value: rides.filter((r: Ride) => r.status === 'CANCELLED').length,
      color: 'text-red-600',
    },
    {
      label: 'Total Earned',
      value: `৳${totalEarnings.toFixed(2)}`,
      color: 'text-purple-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Ride History</h1>
          <p className="text-slate-600">View and manage all your completed rides</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by location or rider name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rides</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REQUESTED">Requested</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rides List */}
        <Card>
          <CardHeader>
            <CardTitle>All Rides ({filteredRides.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {currentRides.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No rides found'
                    : 'No rides yet'}
                </h3>
                <p className="text-slate-600">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Your completed rides will appear here'}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {currentRides.map((ride: Ride) => (
                    <Link
                      key={ride.id}
                      to={`/driver/rides/${ride.id}`}
                      className="block"
                    >
                      <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                              <Car className="h-5 w-5 text-primary" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              {/* Status & Date */}
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={getStatusColor(ride.status)}>
                                  {ride.status}
                                </Badge>
                                {ride.createdAt && (
                                  <span className="text-sm text-slate-500 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {format(new Date(ride.createdAt), 'MMM dd, yyyy HH:mm')}
                                  </span>
                                )}
                              </div>

                              {/* Locations */}
                              <div className="space-y-1">
                                <div className="flex items-start space-x-2">
                                  <MapPin className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                  <p className="text-sm font-medium">{ride.pickupLocation}</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                  <Navigation className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                  <p className="text-sm text-slate-600">{ride.dropoffLocation}</p>
                                </div>
                              </div>

                              {/* Rider Info */}
                              {ride.user && (
                                <div className="mt-2 text-sm text-slate-600">
                                  Rider: {ride.user.name}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Fare & Arrow */}
                          <div className="flex items-center space-x-4 ml-4">
                            {ride.fare && (
                              <div className="text-right">
                                <div className="flex items-center text-lg font-bold text-green-600">
                                  <DollarSign className="h-4 w-4" />
                                  {ride.fare.toFixed(2)}
                                </div>
                                {ride.paymentMethod && (
                                  <p className="text-xs text-slate-500 capitalize">
                                    {ride.paymentMethod}
                                  </p>
                                )}
                              </div>
                            )}
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <div className="text-sm text-slate-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredRides.length)} of{' '}
                      {filteredRides.length} rides
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            return (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            );
                          })
                          .map((page, index, array) => (
                            <div key={page} className="flex items-center">
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            </div>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}