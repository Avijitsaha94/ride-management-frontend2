/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserMutation } from '@/store/api/userApi';
import { useGetAllDriversQuery, useUpdateDriverMutation } from '@/store/api/driverApi';
import toast from 'react-hot-toast';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import {
  Search,
  Filter,
  Users,
  UserCheck,
  Shield,
  Ban,
  CheckCircle,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminUsers() {
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUsersQuery();
  const { data: driversData, isLoading: driversLoading, error: driversError } = useGetAllDriversQuery();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateDriver, { isLoading: isUpdatingDriver }] = useUpdateDriverMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'block' | 'suspend' | 'activate' | null;
  }>({ open: false, action: null });

  if (usersLoading || driversLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading users..." />
      </DashboardLayout>
    );
  }

  if (usersError || driversError) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load users data" />
      </DashboardLayout>
    );
  }

  const users = usersData?.data || [];
  const drivers = driversData?.data || [];
  const riders = users.filter((u) => u.role === 'USER');

  const handleAction = async () => {
    if (!selectedUser || !actionDialog.action) return;

    const isDriver = selectedUser.role === 'DRIVER';
    const newStatus =
      actionDialog.action === 'activate'
        ? 'active'
        : actionDialog.action === 'block'
        ? 'blocked'
        : 'suspended';

    try {
      if (isDriver) {
        const result = await updateDriver({
          id: selectedUser.id,
          data: { status: newStatus },
        }).unwrap();
        toast.success(result.message || `Driver ${actionDialog.action}d successfully!`);
      } else {
        const result = await updateUser({
          id: selectedUser.id,
          data: { status: newStatus },
        }).unwrap();
        toast.success(result.message || `User ${actionDialog.action}d successfully!`);
      }
      setActionDialog({ open: false, action: null });
      setSelectedUser(null);
    } catch (error: any) {
      const errorMessage = error?.data?.message || `Failed to ${actionDialog.action} user`;
      toast.error(errorMessage);
    }
  };

  const openActionDialog = (user: any, action: 'block' | 'suspend' | 'activate') => {
    setSelectedUser(user);
    setActionDialog({ open: true, action });
  };

  const filterUsers = (userList: any[]) => {
    return userList.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredRiders = filterUsers(riders);
  const filteredDrivers = filterUsers(drivers);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-700">Blocked</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-700">Suspended</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Unknown</Badge>;
    }
  };

  const UserTable = ({ users, isDriver = false }: { users: any[]; isDriver?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          {isDriver && <TableHead>Vehicle</TableHead>}
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isDriver ? 7 : 6} className="text-center py-12">
              <div className="flex flex-col items-center">
                <Users className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-600">No users found</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || 'N/A'}</TableCell>
              {isDriver && (
                <TableCell>
                  {user.vehicleDetails
                    ? `${user.vehicleDetails.model} - ${user.vehicleDetails.licensePlate}`
                    : 'N/A'}
                </TableCell>
              )}
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {user.status !== 'active' && (
                      <DropdownMenuItem onClick={() => openActionDialog(user, 'activate')}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    {user.status !== 'suspended' && (
                      <DropdownMenuItem onClick={() => openActionDialog(user, 'suspend')}>
                        <Shield className="mr-2 h-4 w-4 text-yellow-600" />
                        Suspend
                      </DropdownMenuItem>
                    )}
                    {user.status !== 'blocked' && (
                      <DropdownMenuItem onClick={() => openActionDialog(user, 'block')}>
                        <Ban className="mr-2 h-4 w-4 text-red-600" />
                        Block
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-slate-600">Manage riders, drivers, and their permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{riders.length}</p>
                  <p className="text-sm text-slate-600">Total Riders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{drivers.length}</p>
                  <p className="text-sm text-slate-600">Total Drivers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{riders.length + drivers.length}</p>
                  <p className="text-sm text-slate-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Tabs */}
        <Card>
          <Tabs defaultValue="riders">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="riders">
                  Riders ({filteredRiders.length})
                </TabsTrigger>
                <TabsTrigger value="drivers">
Drivers ({filteredDrivers.length})
</TabsTrigger>
</TabsList>
</CardHeader>
<CardContent>
<TabsContent value="riders">
<UserTable users={filteredRiders} />
</TabsContent>
<TabsContent value="drivers">
<UserTable users={filteredDrivers} isDriver={true} />
</TabsContent>
</CardContent>
</Tabs>
</Card>
    {/* Action Confirmation Dialog */}
    <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, action: null })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionDialog.action === 'block'
              ? 'Block User'
              : actionDialog.action === 'suspend'
              ? 'Suspend User'
              : 'Activate User'}
          </DialogTitle>
          <DialogDescription>
            {actionDialog.action === 'block' && (
              <>
                Are you sure you want to block <strong>{selectedUser?.name}</strong>? They will
                not be able to access their account.
              </>
            )}
            {actionDialog.action === 'suspend' && (
              <>
                Are you sure you want to suspend <strong>{selectedUser?.name}</strong>? Their
                account will be temporarily disabled.
              </>
            )}
            {actionDialog.action === 'activate' && (
              <>
                Are you sure you want to activate <strong>{selectedUser?.name}</strong>? They
                will regain full access to their account.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setActionDialog({ open: false, action: null })}
          >
            Cancel
          </Button>
          <Button
            variant={actionDialog.action === 'activate' ? 'default' : 'destructive'}
            onClick={handleAction}
            disabled={isUpdatingUser || isUpdatingDriver}
          >
            {isUpdatingUser || isUpdatingDriver ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>Confirm</>
)}
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
</div>
</DashboardLayout>
);
}