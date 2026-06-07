'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Mail, Lock, AlertCircle, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      const from = searchParams.get('from') || '/dashboard';
      router.push(from);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-500 to-rose-400"></div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Content */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl shadow-2xl ring-2 ring-white/30">
              <Heart className="w-10 h-10 text-white drop-shadow-lg" fill="white" strokeWidth={0} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>BYvowed</h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <p className="text-white/90 text-sm font-semibold">Premium Matchmaking Platform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div>
            <h2 className="text-5xl font-black text-white leading-tight drop-shadow-lg mb-4">
              Connecting Hearts,<br />
              Creating Futures ✨
            </h2>
            <p className="text-white/95 text-xl font-medium">
              Your AI-powered dashboard for managing client relationships and creating meaningful connections.
            </p>
          </div>
          
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-dark rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-3xl font-black text-white">500+</div>
              </div>
              <div className="text-white/80 text-sm font-semibold">Success Stories</div>
            </div>
            <div className="glass-dark rounded-2xl p-5 hover-lift">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div className="text-3xl font-black text-white">95%</div>
              </div>
              <div className="text-white/80 text-sm font-semibold">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/70 text-sm font-medium animate-fade-in" style={{ animationDelay: '400ms' }}>
          © 2024 The Date Crew. All rights reserved.
        </div>
      </div>

      {/* Right Side - Premium Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center gradient-primary p-4 rounded-3xl mb-4 shadow-xl">
              <Heart className="w-8 h-8 text-white" fill="white" strokeWidth={0} />
            </div>
            <h1 className="text-3xl font-black text-gradient" style={{ fontFamily: 'Georgia, serif' }}>BYvowed</h1>
            <p className="text-gray-600 text-sm font-semibold mt-1">Matchmaker Portal</p>
          </div>

          {/* Premium Form Card */}
          <div className="glass-card rounded-3xl p-10 shadow-2xl border-2 border-white/40">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gradient mb-3" style={{ fontFamily: 'Georgia, serif' }}>Welcome back</h2>
              <p className="text-gray-600 text-base font-medium">Sign in to access your premium dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Premium Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-red-100 rounded-lg">
                    <Mail className="w-4 h-4 text-red-600" />
                  </div>
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tdc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 px-5 bg-white/60 backdrop-blur-sm border-2 border-white/60 focus:border-red-400 focus:ring-4 focus:ring-red-100 rounded-xl text-base font-medium shadow-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Premium Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-pink-100 rounded-lg">
                    <Lock className="w-4 h-4 text-pink-600" />
                  </div>
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 px-5 bg-white/60 backdrop-blur-sm border-2 border-white/60 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 rounded-xl text-base font-medium shadow-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Premium Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-5 bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl animate-scale-in">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-900">{error}</p>
                    <p className="text-xs text-red-700 mt-1 font-medium">Please check your credentials and try again.</p>
                  </div>
                </div>
              )}

              {/* Premium Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 gradient-primary hover:scale-105 text-white font-bold text-base shadow-2xl rounded-2xl transition-all duration-300 border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign In</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-white/40">
              <p className="text-center text-xs text-gray-600 font-semibold">
                🔒 Internal use only • Secure access required
              </p>
            </div>
          </div>

          {/* Premium Demo Credentials */}
          <div className="mt-6 glass-card rounded-2xl p-5 border border-white/40">
            <p className="text-xs font-black text-red-900 mb-3 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Sparkles className="w-4 h-4" />
              Demo Credentials
            </p>
            <div className="text-xs text-gray-700 space-y-2 font-semibold">
              <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                <span>Email:</span>
                <code className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-mono">admin@tdc.com</code>
              </div>
              <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                <span>Password:</span>
                <code className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-mono">tdc@2025</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
