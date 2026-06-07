import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Settings as SettingsIcon, Mail, Brain, Database, CheckCircle2, Sparkles } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-pink-50/30">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Settings</h1>
                <p className="text-sm text-gray-600">Manage your matchmaker account and preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Profile Information</h2>
                  <p className="text-sm text-gray-600">Your matchmaker account details</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Name
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">{session.user?.name || 'Not set'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    Email
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">{session.user?.email || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Configuration */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Email Configuration</h2>
                  <p className="text-sm text-gray-600">Gmail SMTP settings for sending match emails</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300 font-bold px-4 py-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Active
                </Badge>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-700">Email Service</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                    Gmail SMTP
                  </Badge>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm font-bold text-gray-700 mb-2">Sending Email</p>
                <p className="text-gray-900 font-semibold">{process.env.GMAIL_USER || 'Not configured'}</p>
              </div>
              <div className="text-sm text-green-900 bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="font-bold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">ℹ️</span>
                  Configuration
                </p>
                <p className="text-green-800">Email settings are configured in your .env file. Update GMAIL_USER and GMAIL_APP_PASSWORD to change email credentials.</p>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <Brain className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>AI Configuration</h2>
                  <p className="text-sm text-gray-600">Google Gemini AI for match insights</p>
                </div>
                <Badge className="bg-red-100 text-red-700 border-red-300 font-bold px-4 py-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Active
                </Badge>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">AI Service</p>
                    <p className="text-gray-600 text-sm">Google Gemini 1.5 Flash</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-red-900 bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="font-bold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">ℹ️</span>
                  Configuration
                </p>
                <p className="text-red-800">AI settings are configured in your .env file. Update GEMINI_API_KEY to change API credentials.</p>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <Database className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Database</h2>
                  <p className="text-sm text-gray-600">PostgreSQL database connection</p>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-300 font-bold px-4 py-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Connected
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">Database Type</p>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold">
                    PostgreSQL
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
