import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Mail, Phone } from 'lucide-react';

export default function AccountBlocked() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Account {user?.status === 'blocked' ? 'Blocked' : 'Suspended'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-slate-600">
            <p className="mb-4">
              Your account has been {user?.status === 'blocked' ? 'blocked' : 'suspended'} due to
              violation of our terms of service or community guidelines.
            </p>
            <p>
              If you believe this is a mistake or would like to appeal this decision, please
              contact our support team.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>support@ridenow.com</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>+880 1234-567890</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:support@ridenow.com">Email Support</a>
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleLogout} asChild>
              <Link to="/">Logout</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}