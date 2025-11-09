import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  DollarSign,
  Shield,
  Clock,
  Star,
  CreditCard,
  Bell,
  TrendingUp,
  Users,
  Car,
  BarChart3,
  CheckCircle2,
  Smartphone,
  Lock,
  Headphones,
  Zap,
} from 'lucide-react';

export default function Features() {
  const riderFeatures = [
    {
      icon: MapPin,
      title: 'Easy Ride Booking',
      description: 'Book rides in seconds with our intuitive interface. Just enter your pickup and destination.',
    },
    {
      icon: DollarSign,
      title: 'Fare Estimation',
      description: 'Get accurate fare estimates before booking. No surprises, complete transparency.',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Track your driver in real-time and get accurate ETAs for pickup and arrival.',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay with cash, card, or digital wallet. Choose what works best for you.',
    },
    {
      icon: Star,
      title: 'Ride History',
      description: 'Access your complete ride history with detailed information and receipts.',
    },
    {
      icon: Shield,
      title: 'Safety Features',
      description: 'SOS button, emergency contacts, and verified drivers for your safety.',
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Stay updated with ride status, driver arrival, and special offers.',
    },
    {
      icon: Smartphone,
      title: 'User-Friendly App',
      description: 'Clean, intuitive interface designed for seamless user experience.',
    },
  ];

  const driverFeatures = [
    {
      icon: Zap,
      title: 'Quick Registration',
      description: 'Sign up easily and start earning. Simple verification process.',
    },
    {
      icon: Users,
      title: 'Ride Requests',
      description: 'Receive ride requests from nearby riders and accept at your convenience.',
    },
    {
      icon: TrendingUp,
      title: 'Earnings Dashboard',
      description: 'Track your daily, weekly, and monthly earnings with detailed analytics.',
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work on your own schedule. Go online or offline anytime you want.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Monitor your ratings, completed rides, and performance metrics.',
    },
    {
      icon: DollarSign,
      title: 'Instant Payouts',
      description: 'Get your earnings quickly with our fast and reliable payout system.',
    },
    {
      icon: Star,
      title: 'Rating System',
      description: 'Build your reputation with our transparent rating and review system.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock driver support.',
    },
  ];

  const adminFeatures = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage riders and drivers with powerful search, filter, and action tools.',
    },
    {
      icon: Car,
      title: 'Ride Oversight',
      description: 'Monitor all rides in real-time with comprehensive filtering options.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights with advanced analytics and data visualizations.',
    },
    {
      icon: Shield,
      title: 'Safety Controls',
      description: 'Block or suspend users, approve drivers, and maintain platform safety.',
    },
    {
      icon: DollarSign,
      title: 'Revenue Tracking',
      description: 'Track platform revenue, driver earnings, and financial metrics.',
    },
    {
      icon: Bell,
      title: 'System Notifications',
      description: 'Send announcements and notifications to users across the platform.',
    },
  ];

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Driver Verification',
      description: 'All drivers undergo thorough background checks and document verification.',
    },
    {
      icon: Bell,
      title: 'SOS Emergency Button',
      description: 'Quick access to emergency services and automatic location sharing.',
    },
    {
      icon: Star,
      title: 'Rating & Reviews',
      description: 'Two-way rating system ensures accountability for both riders and drivers.',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'All transactions are encrypted and processed through secure channels.',
    },
    {
      icon: MapPin,
      title: 'Live Location Sharing',
      description: 'Share your live ride location with trusted contacts for added safety.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for any safety concerns or issues.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-none mb-4">
              Comprehensive Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for a Great Ride Experience
            </h1>
            <p className="text-xl text-blue-50">
              Discover powerful features designed for riders, drivers, and admins
            </p>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="rider" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="rider">Rider</TabsTrigger>
              <TabsTrigger value="driver">Driver</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {/* Rider Features */}
            <TabsContent value="rider">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Rider Features</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Everything you need for a smooth and comfortable ride experience
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {riderFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Driver Features */}
            <TabsContent value="driver">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Driver Features</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Powerful tools to help you earn more and work efficiently
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {driverFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Admin Features */}
            <TabsContent value="admin">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Admin Features</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Complete control and insights to manage the platform effectively
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Safety First</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Safety is Our Priority</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Multiple layers of safety features to ensure a secure ride experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 flex-shrink-0">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by cutting-edge technology for reliable performance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-6">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
                <p className="text-slate-600">
                  Live location tracking and instant notifications using WebSocket technology
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-6">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-slate-600">
                  End-to-end encryption and secure authentication for data protection
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-6">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Scalable Infrastructure</h3>
                <p className="text-slate-600">
                  Cloud-based architecture ensuring reliability and fast performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}