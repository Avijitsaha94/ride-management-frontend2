import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Car,
  Shield,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Users,
  TrendingUp,

  ArrowRight,
  Smartphone
  

} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified drivers and secure payment options for peace of mind.',
    },
    {
      icon: DollarSign,
      title: 'Affordable Prices',
      description: 'Competitive rates with transparent pricing and no hidden fees.',
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Get a ride anytime, anywhere with our round-the-clock service.',
    },
    {
      icon: Star,
      title: 'Top Rated Drivers',
      description: 'Highly rated professional drivers committed to excellent service.',
    },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Car, value: '10K+', label: 'Verified Drivers' },
    { icon: MapPin, value: '1M+', label: 'Rides Completed' },
    { icon: TrendingUp, value: '4.8', label: 'Average Rating' },
  ];

  const testimonials = [
    {
      name: 'Sarah Ahmed',
      role: 'Regular Rider',
      content:
        'RideNow has made my daily commute so much easier. The drivers are professional and the app is super easy to use!',
      rating: 5,
      avatar: 'SA',
    },
    {
      name: 'Mohammad Khan',
      role: 'Driver Partner',
      content:
        'Being a driver with RideNow has been a great experience. Good earnings and flexible working hours!',
      rating: 5,
      avatar: 'MK',
    },
    {
      name: 'Fatima Rahman',
      role: 'Business User',
      content:
        'I use RideNow for all my business travel. Reliable, professional, and always on time. Highly recommended!',
      rating: 5,
      avatar: 'FR',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Account',
      description: 'Sign up in seconds with your email or phone number',
      icon: Smartphone,
    },
    {
      step: '2',
      title: 'Request Ride',
      description: 'Enter your pickup and destination locations',
      icon: MapPin,
    },
    {
      step: '3',
      title: 'Get Matched',
      description: 'Connect with a nearby verified driver instantly',
      icon: Users,
    },
    {
      step: '4',
      title: 'Enjoy Ride',
      description: 'Sit back, relax, and enjoy your comfortable journey',
      icon: Car,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-blue-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-none">
                Trusted by 50,000+ riders
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Ride, Your Way, Anytime
              </h1>
              <p className="text-xl text-blue-50">
                Experience safe, reliable, and affordable rides at your fingertips. Join
                thousands of satisfied riders and drivers today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" asChild className="text-lg">
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=600&fit=crop"
                  alt="Ride booking"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose RideNow?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We provide the best ride-sharing experience with top-notch features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Getting a ride is simple and takes just a few taps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
                  )}
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4 relative">
                    <Icon className="h-12 w-12 text-primary" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            Join thousands of riders and drivers who trust RideNow for their daily
            transportation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg">
              <Link to="/register">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              asChild
            >
              <Link to="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}