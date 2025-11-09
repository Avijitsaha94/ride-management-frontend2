import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Power, AlertCircle } from 'lucide-react';

export default function DriverOffline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-4">
            <Power className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">You're Currently Offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-slate-600">
            <p className="mb-4">
              You need to go online to access ride requests and accept new rides.
            </p>
            <p>
              Toggle your availability to "Online" from the dashboard to start receiving
              ride requests from riders.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                You can still access your earnings, ride history, and profile settings while
                offline.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link to="/driver/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/driver/profile">View Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}