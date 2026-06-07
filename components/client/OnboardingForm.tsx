'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

type FormData = {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | '';
  dateOfBirth: string;
  maritalStatus: string;
  motherTongue: string;
  height: string;
  nriStatus: boolean;
  languagesKnown: string;
  
  // Step 2: Location & Education
  country: string;
  city: string;
  undergradCollege: string;
  degree: string;
  
  // Step 3: Professional & Family
  currentCompany: string;
  designation: string;
  income: string;
  religion: string;
  caste: string;
  familyType: string;
  siblings: string;
  
  // Step 4: Lifestyle & Contact
  dietaryPreference: string;
  drinking: string;
  smoking: string;
  wantKids: string;
  openToRelocate: string;
  openToPets: string;
  horoscopeRequired: boolean;
  email: string;
  phone: string;
  bio: string;
};

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: 'NEVER_MARRIED',
    motherTongue: '',
    height: '',
    nriStatus: false,
    languagesKnown: '',
    country: 'India',
    city: '',
    undergradCollege: '',
    degree: '',
    currentCompany: '',
    designation: '',
    income: '',
    religion: '',
    caste: '',
    familyType: 'NUCLEAR',
    siblings: '0',
    dietaryPreference: 'VEG',
    drinking: 'NO',
    smoking: 'NO',
    wantKids: 'MAYBE',
    openToRelocate: 'MAYBE',
    openToPets: 'MAYBE',
    horoscopeRequired: false,
    email: '',
    phone: '',
    bio: '',
  });

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        height: parseInt(formData.height),
        income: parseInt(formData.income),
        siblings: parseInt(formData.siblings),
        languagesKnown: formData.languagesKnown.split(',').map(l => l.trim()),
      };

      const response = await fetch('/api/clients/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-lg border border-gray-100">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Welcome to BYvowed!</h2>
          <p className="text-gray-600 mb-6">
            Your profile has been submitted successfully. Our matchmaker will review it and get in touch with you soon.
          </p>
          <p className="text-sm text-gray-500">
            You will receive a confirmation email at {formData.email}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Join BYvowed</h1>
          <p className="text-gray-600">Let's find your perfect match</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                  s <= step ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 4</p>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-lg border border-gray-100">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marital Status *</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => updateField('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="NEVER_MARRIED">Never Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm) *</label>
                <Input type="number" value={formData.height} onChange={(e) => updateField('height', e.target.value)} placeholder="e.g., 170" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mother Tongue *</label>
                <Input value={formData.motherTongue} onChange={(e) => updateField('motherTongue', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Languages Known * (comma separated)</label>
                <Input value={formData.languagesKnown} onChange={(e) => updateField('languagesKnown', e.target.value)} placeholder="Hindi, English, Tamil" />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.nriStatus}
                  onChange={(e) => updateField('nriStatus', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm">I am an NRI</label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Location & Education</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <Input value={formData.country} onChange={(e) => updateField('country', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <Input value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Undergraduate College *</label>
                <Input value={formData.undergradCollege} onChange={(e) => updateField('undergradCollege', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Degree *</label>
                <Input value={formData.degree} onChange={(e) => updateField('degree', e.target.value)} placeholder="e.g., B.Tech Computer Science" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Professional & Family</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Current Company *</label>
                <Input value={formData.currentCompany} onChange={(e) => updateField('currentCompany', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Designation *</label>
                <Input value={formData.designation} onChange={(e) => updateField('designation', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Annual Income (₹) *</label>
                <Input type="number" value={formData.income} onChange={(e) => updateField('income', e.target.value)} placeholder="e.g., 1200000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Religion *</label>
                <Input value={formData.religion} onChange={(e) => updateField('religion', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Caste *</label>
                <Input value={formData.caste} onChange={(e) => updateField('caste', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Family Type *</label>
                <select
                  value={formData.familyType}
                  onChange={(e) => updateField('familyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="NUCLEAR">Nuclear</option>
                  <option value="JOINT">Joint</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Siblings</label>
                <Input type="number" value={formData.siblings} onChange={(e) => updateField('siblings', e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Lifestyle & Contact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Dietary Preference *</label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) => updateField('dietaryPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="VEG">Vegetarian</option>
                    <option value="NON_VEG">Non Vegetarian</option>
                    <option value="JAIN">Jain</option>
                    <option value="EGGETARIAN">Eggetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drinking *</label>
                  <select
                    value={formData.drinking}
                    onChange={(e) => updateField('drinking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                    <option value="OCCASIONALLY">Occasionally</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Smoking *</label>
                  <select
                    value={formData.smoking}
                    onChange={(e) => updateField('smoking', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                    <option value="OCCASIONALLY">Occasionally</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Want Kids *</label>
                  <select
                    value={formData.wantKids}
                    onChange={(e) => updateField('wantKids', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="MAYBE">Maybe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Open to Relocate *</label>
                  <select
                    value={formData.openToRelocate}
                    onChange={(e) => updateField('openToRelocate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="MAYBE">Maybe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Open to Pets *</label>
                  <select
                    value={formData.openToPets}
                    onChange={(e) => updateField('openToPets', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="MAYBE">Maybe</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.horoscopeRequired}
                  onChange={(e) => updateField('horoscopeRequired', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm">Horoscope matching required</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone * (10 digits)</label>
                <Input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio (optional)</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
