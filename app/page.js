"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCollection } from './api';
import toast, { Toaster } from 'react-hot-toast';
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle, 
  Clock,
  CreditCard,
  Building2,
  TrendingUp,
  Bell,
  Target,
  Gift,
  Heart,
  Briefcase,
  PartyPopper,
  DollarSign,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const stats = [
    { number: '14 Million+', label: 'Collections Created' },
    { number: '₦5.2B+', label: 'Money Collected' },
    { number: '150+', label: 'Countries Supported' },
    { number: '99.9%', label: 'Uptime Guaranteed' }
  ];

  const useCases = [
    {
      icon: <PartyPopper className="w-6 h-6" />,
      title: 'Birthday Parties',
      description: 'Collect contributions for birthday celebrations and gifts'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Weddings & Events',
      description: 'Gather funds for wedding expenses and event planning'
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Group Gifts',
      description: 'Pool money together for that perfect group gift'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Office Collections',
      description: 'Organize workplace contributions and team activities'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Projects',
      description: 'Raise funds for community initiatives and causes'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Ajo & Esusu',
      description: 'Manage traditional savings groups digitally'
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Setup',
      description: 'Create a collection in under 2 minutes. No signup required.'
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Multiple Payment Options',
      description: 'Accept payments via card, bank transfer, USSD, or manual transfers'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-Time Tracking',
      description: 'Monitor contributions as they come in with live dashboard'
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Auto Reminders',
      description: 'Send payment reminders to pending contributors automatically'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Reliable',
      description: 'Bank-level security powered by Paystack for automatic payments'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goal Tracking',
      description: 'Set targets and watch your collection progress grow'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Collection',
      description: 'Set up your collection with a title, target amount, and payment method in minutes'
    },
    {
      step: '02',
      title: 'Share the Link',
      description: 'Send your unique collection link to your group via WhatsApp, email, or social media'
    },
    {
      step: '03',
      title: 'Track & Collect',
      description: 'Watch contributions come in real-time and manage everything from your dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Kontribute
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors">Use Cases</a>
            </div>
            <Link href={"/collection"} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted by thousands of Nigerians</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Collect Money from Groups,{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Effortlessly
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create a collection, share the link, and track contributions in real-time. 
                Perfect for birthdays, weddings, group gifts, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href={"/collection"}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-lg"
                >
                  <span>Create Collection</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center justify-center space-x-2 text-lg"
                >
                  <span>See How It Works</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span>Secure payments</span>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Collection</h3>
                  <span className="flex items-center space-x-1 text-emerald-600 text-sm">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                    <span>Active</span>
                  </span>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Total Collected</span>
                    <span className="text-sm font-medium text-emerald-600">85% Complete</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">₦425,000</p>
                      <p className="text-sm text-gray-500">of ₦500,000 goal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">17</p>
                      <p className="text-sm text-gray-500">Contributors</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Chioma A.', amount: '₦25,000', time: '2 mins ago', status: 'paid' },
                    { name: 'Tunde B.', amount: '₦25,000', time: '15 mins ago', status: 'paid' },
                    { name: 'Ngozi C.', amount: '₦25,000', time: '1 hour ago', status: 'pending' }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {contributor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contributor.name}</p>
                          <p className="text-xs text-gray-500">{contributor.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{contributor.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          contributor.status === 'paid' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {contributor.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Instant Payment</p>
                    <p className="text-xs text-gray-500">Powered by Paystack</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">100% Secure</p>
                    <p className="text-xs text-gray-500">Bank-level encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create and manage your collection in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Payment Method
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible options to suit your collection needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Automatic Payment */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 hover:border-emerald-400 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Automatic Payment</h3>
              <p className="text-gray-600 mb-6">
                Contributors pay instantly with cards, bank transfers, or USSD. Payments are automatically confirmed.
              </p>
              <ul className="space-y-3">
                {[
                  'Instant payment confirmation',
                  'Multiple payment channels',
                  'Automatic tracking',
                  'Powered by Paystack'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Manual Payment */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 hover:border-amber-400 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Manual Payment</h3>
              <p className="text-gray-600 mb-6">
                Contributors transfer directly to your bank account. You confirm payments manually from your dashboard.
              </p>
              <ul className="space-y-3">
                {[
                  'Direct bank transfers',
                  'No transaction fees',
                  'Manual confirmation',
                  'Full control'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage group collections effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfect For Every Occasion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whatever you're collecting for, Kontribute makes it easy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                  {useCase.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Collecting?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Join thousands of Nigerians making group collections effortless
          </p>
          <Link href={"/collection"}
            className="bg-white text-emerald-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl inline-flex items-center space-x-2"
          >
            <span>Create Your First Collection</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-emerald-50 mt-6 text-sm">No signup required • Free to start</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Kontribute</span>
              </div>
              <p className="text-sm text-gray-400">
                Making group collections simple, secure, and stress-free.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Kontribute. All rights reserved. Powered by Paystack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}