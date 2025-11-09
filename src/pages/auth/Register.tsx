import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterMutation } from '@/store/api/authApi';
import { useRegisterDriverMutation } from '@/store/api/driverApi';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Loader2, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Rider Registration Schema
const riderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Driver Registration Schema
const driverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  vehicleModel: z.string().min(2, 'Vehicle model is required'),
  licensePlate: z.string().min(3, 'License plate is required'),
  vehicleColor: z.string().min(2, 'Vehicle color is required'),
  vehicleType: z.string().min(2, 'Vehicle type is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RiderFormData = z.infer<typeof riderSchema>;
type DriverFormData = z.infer<typeof driverSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [registerDriver, { isLoading: isDriverLoading }] = useRegisterDriverMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'rider' | 'driver'>('rider');

  const isLoading = isRegisterLoading || isDriverLoading;

  const riderForm = useForm<RiderFormData>({
    resolver: zodResolver(riderSchema),
  });

  const driverForm = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  });

  const onRiderSubmit = async (data: RiderFormData) => {
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'USER',
      }).unwrap();

      toast.success(result.message || 'Registration successful! Please login.');
      navigate('/login');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const onDriverSubmit = async (data: DriverFormData) => {
    try {
      const result = await registerDriver({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        licenseNumber: data.licensePlate,
        vehicleDetails: {
          model: data.vehicleModel,
          licensePlate: data.licensePlate,
          color: data.vehicleColor,
          type: data.vehicleType,
        },
      }).unwrap();

      toast.success(result.message || 'Driver registration successful! Please login.');
      navigate('/login');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Car className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'rider' | 'driver')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rider">Rider</TabsTrigger>
                <TabsTrigger value="driver">Driver</TabsTrigger>
              </TabsList>

              {/* Rider Registration Form */}
              <TabsContent value="rider">
                <form onSubmit={riderForm.handleSubmit(onRiderSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="rider-name">Full Name</Label>
                      <Input
                        id="rider-name"
                        placeholder="John Doe"
                        {...riderForm.register('name')}
                        className={riderForm.formState.errors.name ? 'border-red-500' : ''}
                      />
                      {riderForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {riderForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="rider-email">Email</Label>
                      <Input
                        id="rider-email"
                        type="email"
                        placeholder="john@example.com"
                        {...riderForm.register('email')}
                        className={riderForm.formState.errors.email ? 'border-red-500' : ''}
                      />
                      {riderForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {riderForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="rider-phone">Phone Number</Label>
                      <Input
                        id="rider-phone"
                        placeholder="+880 1234567890"
                        {...riderForm.register('phone')}
                        className={riderForm.formState.errors.phone ? 'border-red-500' : ''}
                      />
                      {riderForm.formState.errors.phone && (
                        <p className="text-sm text-red-500">
                          {riderForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="rider-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="rider-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...riderForm.register('password')}
                          className={riderForm.formState.errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                      </div>
                      {riderForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {riderForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="rider-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="rider-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...riderForm.register('confirmPassword')}
                          className={
                            riderForm.formState.errors.confirmPassword ? 'border-red-500' : ''
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                      </div>
                      {riderForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {riderForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Register as Rider'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Driver Registration Form */}
              <TabsContent value="driver">
                <form onSubmit={driverForm.handleSubmit(onDriverSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="driver-name">Full Name</Label>
                      <Input
                        id="driver-name"
                        placeholder="John Doe"
                        {...driverForm.register('name')}
                        className={driverForm.formState.errors.name ? 'border-red-500' : ''}
                      />
                      {driverForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="driver-email">Email</Label>
                      <Input
                        id="driver-email"
                        type="email"
                        placeholder="john@example.com"
                        {...driverForm.register('email')}
                        className={driverForm.formState.errors.email ? 'border-red-500' : ''}
                      />
                      {driverForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="driver-phone">Phone Number</Label>
                      <Input
                        id="driver-phone"
                        placeholder="+880 1234567890"
                        {...driverForm.register('phone')}
                        className={driverForm.formState.errors.phone ? 'border-red-500' : ''}
                      />
                      {driverForm.formState.errors.phone && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="driver-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="driver-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...driverForm.register('password')}
                          className={driverForm.formState.errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                      </div>
                      {driverForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="driver-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="driver-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...driverForm.register('confirmPassword')}
                          className={
                            driverForm.formState.errors.confirmPassword ? 'border-red-500' : ''
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                      </div>
                      {driverForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Details Section */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-3">Vehicle Details</h3>
                    </div>

                    {/* Vehicle Model */}
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-model">Vehicle Model</Label>
                      <Input
                        id="vehicle-model"
                        placeholder="Toyota Corolla"
                        {...driverForm.register('vehicleModel')}
                        className={
                          driverForm.formState.errors.vehicleModel ? 'border-red-500' : ''
                        }
                      />
                      {driverForm.formState.errors.vehicleModel && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.vehicleModel.message}
                        </p>
                      )}
                    </div>

                    {/* License Plate */}
                    <div className="space-y-2">
                      <Label htmlFor="license-plate">License Plate</Label>
                      <Input
                        id="license-plate"
                        placeholder="DHA-1234"
                        {...driverForm.register('licensePlate')}
                        className={
                          driverForm.formState.errors.licensePlate ? 'border-red-500' : ''
                        }
                      />
                      {driverForm.formState.errors.licensePlate && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.licensePlate.message}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Color */}
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-color">Vehicle Color</Label>
                      <Input
                        id="vehicle-color"
                        placeholder="White"
                        {...driverForm.register('vehicleColor')}
                        className={
                          driverForm.formState.errors.vehicleColor ? 'border-red-500' : ''
                        }
                      />
                      {driverForm.formState.errors.vehicleColor && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.vehicleColor.message}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Type */}
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-type">Vehicle Type</Label>
                      <Input
                        id="vehicle-type"
                        placeholder="Sedan"
                        {...driverForm.register('vehicleType')}
                        className={
                          driverForm.formState.errors.vehicleType ? 'border-red-500' : ''
                        }
                      />
                      {driverForm.formState.errors.vehicleType && (
                        <p className="text-sm text-red-500">
                          {driverForm.formState.errors.vehicleType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Register as Driver'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}