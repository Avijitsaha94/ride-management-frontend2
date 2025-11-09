import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Award, Heart, Globe, Shield } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority with verified drivers and secure rides.',
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'We put our customers at the heart of everything we do.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to providing the highest quality service consistently.',
    },
    {
      icon: Globe,
      title: 'Innovation',
      description: 'Continuously improving our platform with latest technology.',
    },
  ];

  const team = [
    {
      name: 'Ahmed Hassan',
      role: 'CEO & Founder',
      avatar: 'AH',
      description: 'Visionary leader with 15+ years in tech industry',
    },
    {
      name: 'Nadia Khan',
      role: 'CTO',
      avatar: 'NK',
      description: 'Tech expert passionate about building scalable solutions',
    },
    {
      name: 'Rahman Ali',
      role: 'Head of Operations',
      avatar: 'RA',
      description: 'Operations specialist ensuring smooth daily operations',
    },
    {
      name: 'Fatima Ahmed',
      role: 'Head of Customer Success',
      avatar: 'FA',
      description: 'Dedicated to delivering exceptional customer experiences',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About RideNow</h1>
            <p className="text-xl text-blue-50">
              Connecting riders and drivers to make transportation accessible, affordable,
              and reliable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 text-lg">
                <p>
                  Founded in 2020, RideNow began with a simple mission: to revolutionize
                  urban transportation in Bangladesh by connecting riders with reliable
                  drivers through an easy-to-use platform.
                </p>
                <p>
                  What started as a small team of passionate individuals has grown into a
                  thriving community of over 50,000 riders and 10,000 verified drivers
                  across the country.
                </p>
                <p>
                  Today, we're proud to have completed over 1 million rides, helping
                  people get where they need to go safely, affordably, and comfortably.
                  Our commitment to excellence and innovation drives us to continuously
                  improve our service.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-slate-600 text-lg">
                  To provide safe, reliable, and affordable transportation solutions that
                  empower people to move freely and connect communities. We strive to
                  create economic opportunities for drivers while delivering exceptional
                  experiences for riders.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-slate-600 text-lg">
                  To become the most trusted and preferred ride-sharing platform in South
                  Asia, setting new standards for safety, convenience, and customer
                  satisfaction while contributing to sustainable urban mobility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-none shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The team behind RideNow's success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-none shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-slate-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Happy Riders</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Verified Drivers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Rides Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.8</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}