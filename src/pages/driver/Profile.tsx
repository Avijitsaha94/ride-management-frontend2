/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppSelector, useAppDispatch } from '@/store';
import { useUpdateDriverMutation } from '@/store/api/driverApi';
import { updateUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Loader2,
  Camera,
  Lock,
  Car,
  Star,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
});

const vehicleSchema = z.object({
  model: z.string().min(2, 'Vehicle model is required'),
  licensePlate: z.string().min(3, 'License plate is required'),
  color: z.string().min(2, 'Vehicle color is required'),
  type: z.string().min(2, 'Vehicle type is required'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type VehicleFormData = z.infer<typeof vehicleSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function DriverProfile() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [updateDriver, { isLoading: isUpdatingProfile }] = useUpdateDriverMutation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const driverUser = user && 'vehicleDetails' in user ? user : null;

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      model: driverUser?.vehicleDetails?.model || '',
      licensePlate: driverUser?.vehicleDetails?.licensePlate || '',
      color: driverUser?.vehicleDetails?.color || '',
      type: driverUser?.vehicleDetails?.type || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    try {
      const result = await updateDriver({
        id: user.id,
        data: {
          name: data.name,
          phone: data.phone || undefined,
        },
      }).unwrap();

      dispatch(updateUser(result.data));
      toast.success(result.message || 'Profile updated successfully!');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  const onVehicleSubmit = async (data: VehicleFormData) => {
    if (!user?.id) return;

    try {
      const result = await updateDriver({
        id: user.id,
        data: {
          vehicleDetails: {
            model: data.model,
            licensePlate: data.licensePlate,
            color: data.color,
            type: data.type,
          },
        },
      }).unwrap();

      dispatch(updateUser(result.data));
      toast.success(result.message || 'Vehicle details updated successfully!');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update vehicle details';
      toast.error(errorMessage);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);

    // Simulate API call for password change
    setTimeout(() => {
      console.log('Password change data:', data);
      toast.success('Password changed successfully!');
      passwordForm.reset();
      setIsChangingPassword(false);
    }, 1500);
  };

  const handleAvatarUpload = () => {
    toast.success('Avatar upload feature - Coming soon!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account and vehicle information</p>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={handleAvatarUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                <p className="text-slate-600 mb-2">{user?.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {user?.role}
                  </Badge>
                  {user?.status && (
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {user.status}
                    </Badge>
                  )}
                  {driverUser && 'availability' in driverUser && (
                    <Badge
                      variant={driverUser.availability === 'online' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {driverUser.availability}
                    </Badge>
                  )}
                </div>
              </div>
              {driverUser && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold">{driverUser.rating?.toFixed(1) || '0.0'}</div>
                    <div className="text-xs text-slate-600">Rating</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Car className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold">{driverUser.totalRides || 0}</div>
                    <div className="text-xs text-slate-600">Rides</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">৳{(driverUser.earnings || 0).toFixed(0)}</div>
                    <div className="text-xs text-slate-600">Earned</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className={`pl-10 ${
                            profileForm.formState.errors.name ? 'border-red-500' : ''
                          }`}
                          {...profileForm.register('name')}
                        />
                      </div>
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          value={user?.email}
                          disabled
                          className="pl-10 bg-slate-50"
                        />
                      </div>
                      <p className="text-xs text-slate-500">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          placeholder="+880 1234567890"
                          className={`pl-10 ${
                            profileForm.formState.errors.phone ? 'border-red-500' : ''
                          }`}
                          {...profileForm.register('phone')}
                        />
                      </div>
                      {profileForm.formState.errors.phone && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Member Since */}
                    <div className="space-y-2">
                      <Label htmlFor="memberSince">Member Since</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="memberSince"
                          value={
                            user?.createdAt
                              ? format(new Date(user.createdAt), 'MMMM yyyy')
                              : 'N/A'
                          }
                          disabled
                          className="pl-10 bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Vehicle Tab */}
      <TabsContent value="vehicle">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Vehicle Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">Vehicle Model *</Label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="model"
                      placeholder="Toyota Corolla"
                      className={`pl-10 ${
                        vehicleForm.formState.errors.model ? 'border-red-500' : ''
                      }`}
                      {...vehicleForm.register('model')}
                    />
                  </div>
                  {vehicleForm.formState.errors.model && (
                    <p className="text-sm text-red-500">
                      {vehicleForm.formState.errors.model.message}
                    </p>
                  )}
                </div>

                {/* License Plate */}
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate *</Label>
                  <Input
                    id="licensePlate"
                    placeholder="DHA-1234"
                    className={vehicleForm.formState.errors.licensePlate ? 'border-red-500' : ''}
                    {...vehicleForm.register('licensePlate')}
                  />
                  {vehicleForm.formState.errors.licensePlate && (
                    <p className="text-sm text-red-500">
                      {vehicleForm.formState.errors.licensePlate.message}
                    </p>
                  )}
                </div>

                {/* Vehicle Color */}
                <div className="space-y-2">
                  <Label htmlFor="color">Vehicle Color *</Label>
                  <Input
                    id="color"
                    placeholder="White"
                    className={vehicleForm.formState.errors.color ? 'border-red-500' : ''}
                    {...vehicleForm.register('color')}
                  />
                  {vehicleForm.formState.errors.color && (
                    <p className="text-sm text-red-500">
                      {vehicleForm.formState.errors.color.message}
                    </p>
                  )}
                </div>

                {/* Vehicle Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Input
                    id="type"
                    placeholder="Sedan"
                    className={vehicleForm.formState.errors.type ? 'border-red-500' : ''}
                    {...vehicleForm.register('type')}
                  />
                  {vehicleForm.formState.errors.type && (
                    <p className="text-sm text-red-500">
                      {vehicleForm.formState.errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Vehicle Details'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 ${
                      passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''
                    }`}
                    {...passwordForm.register('currentPassword')}
                  />
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 ${
                      passwordForm.formState.errors.newPassword ? 'border-red-500' : ''
                    }`}
                    {...passwordForm.register('newPassword')}
                  />
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 ${
                      passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    {...passwordForm.register('confirmPassword')}
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Security Tips</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Use a strong password with at least 8 characters</li>
                  <li>• Include uppercase, lowercase, numbers, and symbols</li>
                  <li>• Never share your password with anyone</li>
                  <li>• Change your password regularly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Activity Tab */}
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-slate-600">
                    {user?.createdAt
                      ? format(new Date(user.createdAt), 'PPP')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Last Login</p>
                  <p className="text-sm text-slate-600">Today at 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Account Status</p>
                  <Badge
                    variant={user?.status === 'active' ? 'default' : 'destructive'}
                    className="capitalize mt-1"
                  >
                    {user?.status || 'Active'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Driver Status</p>
                  <Badge
                    variant={
                      driverUser && 'availability' in driverUser && driverUser.availability === 'online'
                        ? 'default'
                        : 'secondary'
                    }
                    className="capitalize mt-1"
                  >
                    {driverUser && 'availability' in driverUser
                      ? driverUser.availability
                      : 'Offline'}
                  </Badge>
                </div>
              </div>
              {driverUser && (
                <>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">License Number</p>
                      <p className="text-sm text-slate-600">
                        {driverUser.licenseNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Not enabled</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</DashboardLayout>
);
}