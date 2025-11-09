import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is RideNow?',
          answer:
            'RideNow is a ride-sharing platform that connects riders with verified drivers. We provide safe, reliable, and affordable transportation services across Bangladesh.',
        },
        {
          question: 'How does RideNow work?',
          answer:
            'Simply sign up, enter your pickup and destination locations, request a ride, and get matched with a nearby driver. You can track your ride in real-time and pay using your preferred payment method.',
        },
        {
          question: 'Is RideNow available 24/7?',
          answer:
            'Yes! RideNow operates 24 hours a day, 7 days a week. You can request a ride anytime you need one.',
        },
        {
          question: 'Which cities does RideNow operate in?',
          answer:
            'Currently, RideNow operates in major cities across Bangladesh including Dhaka, Chittagong, Sylhet, and Rajshahi. We are continuously expanding to new locations.',
        },
      ],
    },
    {
      category: 'For Riders',
      questions: [
        {
          question: 'How do I book a ride?',
          answer:
            'After logging in, go to the Request Ride page, enter your pickup and destination locations, select your payment method, and confirm your booking. A nearby driver will be assigned to you.',
        },
        {
          question: 'Can I cancel a ride?',
          answer:
            'Yes, you can cancel a ride before the driver arrives. However, cancellation fees may apply depending on the timing. Please check our cancellation policy for details.',
        },
        {
          question: 'How are fares calculated?',
          answer:
            'Fares are calculated based on distance, time, and current demand. You will see an estimated fare before confirming your ride. The final fare may vary slightly based on the actual route taken.',
        },
        {
          question: 'What payment methods are accepted?',
          answer:
            'We accept cash, debit/credit cards, and digital wallet payments. You can choose your preferred payment method before booking a ride.',
        },
        {
          question: 'How can I contact my driver?',
          answer:
            'Once your ride is confirmed, you can call or message your driver directly through the app using the contact options provided.',
        },
      ],
    },
    {
      category: 'For Drivers',
      questions: [
        {
          question: 'How do I become a RideNow driver?',
          answer:
            'Sign up on our platform, complete the driver registration form with your vehicle details, submit required documents for verification, and once approved, you can start accepting rides.',
        },
        {
          question: 'What documents do I need to register?',
          answer:
            'You need a valid driver license, vehicle registration papers, insurance documents, and a recent police clearance certificate. All documents must be current and valid.',
        },
        {
          question: 'How do I get paid?',
          answer:
            'Earnings are transferred to your registered bank account weekly. You can track your earnings in real-time through the driver dashboard.',
        },
        {
          question: 'Can I choose when to work?',
          answer:
            'Absolutely! As a driver, you have complete flexibility. You can go online or offline anytime and work according to your own schedule.',
        },
        {
          question: 'What if I have an issue during a ride?',
          answer:
            'You can contact our 24/7 driver support team through the app. We also have an SOS feature for emergency situations.',
        },
      ],
    },
    {
      category: 'Safety & Security',
      questions: [
        {
          question: 'How does RideNow ensure safety?',
          answer:
            'We verify all drivers with background checks, provide real-time ride tracking, offer SOS emergency features, and have a two-way rating system to maintain quality and safety standards.',
        },
        {
          question: 'What is the SOS feature?',
          answer:
            'The SOS button allows you to quickly alert emergency services and your emergency contacts. It automatically shares your live location and ride details.',
        },
        {
          question: 'Can I share my ride details with family?',
          answer:
            'Yes! You can share your live ride status, driver details, and location with trusted contacts through the app.',
        },
        {
          question: 'What if I leave something in the vehicle?',
          answer:
            'Contact our support team immediately with your ride details. We will help you connect with your driver to retrieve your lost item.',
        },
      ],
    },
    {
      category: 'Payment & Billing',
      questions: [
        {
          question: 'Are there any hidden charges?',
          answer:
            'No, we believe in complete transparency. The fare you see before booking is what you pay (except in cases of route changes or waiting time).',
        },
        {
          question: 'Can I get a receipt for my ride?',
          answer:
            'Yes, receipts are automatically generated and sent to your email after each ride. You can also download them from your ride history.',
        },
        {
          question: 'What if I was charged incorrectly?',
          answer:
            'If you believe there was an error in billing, please contact our support team within 48 hours with your ride details. We will investigate and resolve the issue promptly.',
        },
        {
          question: 'Do you offer promotional codes?',
          answer:
            'Yes! We regularly offer promotional codes and discounts. Follow us on social media and check your email for the latest offers.',
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-50 mb-8">
              Find answers to common questions about RideNow
            </p>
            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white text-slate-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {searchQuery && filteredFAQs.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-2xl font-semibold mb-2">No results found</h3>
                  <p className="text-slate-600">
                    Try adjusting your search terms or browse through our categories below
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {(searchQuery ? filteredFAQs : faqCategories).map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <div className="mb-6">
                      <Badge className="mb-2">{category.category}</Badge>
                      <h2 className="text-2xl font-bold">{category.category} Questions</h2>
                    </div>

                    <Card className="border-none shadow-lg">
                      <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                              <AccordionTrigger className="text-left hover:no-underline">
                                <span className="font-semibold">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto border-none shadow-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-xl text-slate-600 mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:support@ridenow.com">Email Us</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}