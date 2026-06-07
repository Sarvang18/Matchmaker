import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { Heart, Users, Award, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-30"></div>
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" fill="white" strokeWidth={0} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  BYvowed
                </h1>
                <p className="text-xs text-gray-500">Premium Matchmaking</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">About</a>
              <a href="#services" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Services</a>
              <a href="#success" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Success Stories</a>
              <Link 
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
                FIND YOUR SOULMATE
              </span>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Best Match<br />
              For You
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We option to select one of our two formats. If you need help in deciding, 
              who will be would be happy to help you.
            </p>
            
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="group px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-gray-200 rounded-full font-semibold text-gray-700 hover:border-red-300 hover:bg-red-50 transition-all">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                  2M
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  2 Million<br />active users
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                  19
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Registered<br />Countries
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
                  6
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Years<br />of experience
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            {/* Main Hero Card with Shadow */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="aspect-[4/5] bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" fill="white" strokeWidth={0} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Find Your Perfect Match
                  </h3>
                  <p className="text-gray-600">
                    Join thousands of happy couples
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Profile Cards */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500"></div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-500"></div>
            </div>

            {/* Decorative Hearts */}
            <div className="absolute top-10 left-10 text-red-400 opacity-20">
              <Heart className="w-12 h-12" fill="currentColor" />
            </div>
            <div className="absolute bottom-20 right-10 text-pink-400 opacity-20">
              <Heart className="w-8 h-8" fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            The BYvowed Method
          </h2>
          <p className="text-lg text-gray-600">An introduction to 1-2-3</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Georgia, serif' }}>01</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Tell us about you
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Answer a few questions about yourself, your preferences, and what you're looking for in a partner. 
              We use this information to find your perfect match.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-white">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8" fill="white" strokeWidth={0} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Join Us Today
            </h3>
            <p className="text-white/90 leading-relaxed mb-6">
              Start your journey to find true love. Our AI-powered matching algorithm 
              connects you with compatible partners.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-white text-red-600 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Find Your Match
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Browse through carefully curated profiles, connect with interesting people, 
              and start meaningful conversations that could lead to something special.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10">
              <Heart className="w-32 h-32 text-white" fill="currentColor" />
            </div>
            <div className="absolute bottom-10 right-10">
              <Heart className="w-24 h-24 text-white" fill="currentColor" />
            </div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of happy couples who found love through BYvowed. 
              Your soulmate is waiting for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all"
              >
                Start Your Journey
              </Link>
              <button className="px-10 py-4 border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>100% Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" strokeWidth={0} />
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>BYvowed</h3>
            </div>
            <p className="text-gray-600 mb-6">Creating meaningful connections since 2024</p>
            <p className="text-sm text-gray-500">
              © 2024 BYvowed. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
