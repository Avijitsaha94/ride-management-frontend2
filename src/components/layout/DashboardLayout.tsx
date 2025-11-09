import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Car,
  LayoutDashboard,
  MapPin,
  History,
  User,
  LogOut,
  Menu,
  X,
  Users,
  BarChart3,
  DollarSign,
  Bell,
  Settings,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [driverOnline, setDriverOnline] = useState(
    user?.role === 'DRIVER' && 'availability' in user ? user.availability === 'online' : false
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleDriverToggle = async (checked: boolean) => {
    setDriverOnline(checked);
    // TODO: Call API to update driver availability
    // await updateDriverAvailability({ availability: checked ? 'online' : 'offline' });
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (user?.role === 'USER') {
      return [
        { to: '/rider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/rider/request-ride', icon: MapPin, label: 'Request Ride' },
        { to: '/rider/rides', icon: History, label: 'Ride History' },
        { to: '/rider/profile', icon: User, label: 'Profile' },
      ];
    }

    if (user?.role === 'DRIVER') {
      return [
        { to: '/driver/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/driver/requests', icon: Bell, label: 'Ride Requests' },
        { to: '/driver/rides', icon: History, label: 'Ride History' },
        { to: '/driver/earnings', icon: DollarSign, label: 'Earnings' },
        { to: '/driver/profile', icon: User, label: 'Profile' },
      ];
    }

    if (user?.role === 'ADMIN') {
      return [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/rides', icon: Car, label: 'Rides' },
        { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/admin/profile', icon: User, label: 'Profile' },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X /> : <Menu />}
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold hidden sm:inline">RideNow</span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Driver Online/Offline Toggle */}
              {user?.role === 'DRIVER' && (
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {driverOnline ? 'Online' : 'Offline'}
                  </span>
                  <Switch checked={driverOnline} onCheckedChange={handleDriverToggle} />
                </div>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="w-fit capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/${user?.role === 'USER' ? 'rider' : user?.role.toLowerCase()}/profile`)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full flex flex-col pt-20 lg:pt-5">
            {/* Driver Status (Mobile) */}
            {user?.role === 'DRIVER' && (
              <div className="px-4 py-4 border-b sm:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Driver Status</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">
                      {driverOnline ? 'Online' : 'Offline'}
                    </span>
                    <Switch checked={driverOnline} onCheckedChange={handleDriverToggle} />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="px-4 py-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}