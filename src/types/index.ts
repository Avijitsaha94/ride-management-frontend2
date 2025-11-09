export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'DRIVER' | 'ADMIN';
  status?: 'active' | 'blocked' | 'suspended';
  avatar?: string;
  createdAt?: string;
}

export interface Driver extends User {
  role: 'DRIVER';
  licenseNumber: string;
  vehicleDetails?: {
    model?: string;
    licensePlate?: string;
    color?: string;
    type?: string;
  };
  availability?: 'online' | 'offline';
  rating?: number;
  totalRides?: number;
  earnings?: number;
}

export interface Ride {
  id: string;
  userId?: string;
  driverId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  fare?: number;
  paymentMethod?: 'cash' | 'card' | 'wallet';
  distance?: number;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  driver?: Driver;
}

export interface AuthState {
  user: User | Driver | null;
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'DRIVER';
  phone?: string;
}

export interface DriverRegisterCredentials {
  name: string;
  email: string;
  password: string;
  licenseNumber: string;
  phone?: string;
  vehicleDetails?: {
    model?: string;
    licensePlate?: string;
    color?: string;
    type?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}