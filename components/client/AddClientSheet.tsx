'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface AddClientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded?: () => void;
}

export function AddClientSheet({ open, onOpenChange, onClientAdded }: AddClientSheetProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
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

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        height: parseInt(formData.height),
        income: parseInt(formData.income),
        siblings: parseInt(formData.siblings),
        languagesKnown: formData.languagesKnown.split(',').map((l) => l.trim()),
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onOpenChange(false);
        onClientAdded?.(); // Call the callback first
        router.refresh(); // Then refresh to get new data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col gap-0 bg-white" showCloseButton={false}>
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Add New Client</h2>
            <p className="text-xs text-gray-600 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto bg-white">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5 pb-24">
            {/* Personal */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 mb-2.5 uppercase tracking-wider flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2"></span>
                Personal Information
              </h3>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">First Name *</label>
                    <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Last Name *</label>
                    <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Gender *</label>
                    <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} className="w-full h-8 px-2 border border-gray-300 rounded-md text-sm bg-white">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">DOB *</label>
                    <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Marital *</label>
                    <select value={formData.maritalStatus} onChange={(e) => updateField('maritalStatus', e.target.value)} className="w-full h-8 px-2 border border-gray-300 rounded-md text-sm bg-white">
                      <option value="NEVER_MARRIED">Never Married</option>
                      <option value="DIVORCED">Divorced</option>
                      <option value="WIDOWED">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Height (cm) *</label>
                    <Input type="number" value={formData.height} onChange={(e) => updateField('height', e.target.value)} placeholder="170" required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Mother Tongue *</label>
                  <Input value={formData.motherTongue} onChange={(e) => updateField('motherTongue', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Languages *</label>
                  <Input value={formData.languagesKnown} onChange={(e) => updateField('languagesKnown', e.target.value)} placeholder="Hindi, English" required className="h-8 text-sm bg-white border-gray-300" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 mb-2.5 uppercase tracking-wider flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2"></span>
                Location & Education
              </h3>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Country *</label>
                    <Input value={formData.country} onChange={(e) => updateField('country', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">City *</label>
                    <Input value={formData.city} onChange={(e) => updateField('city', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">College *</label>
                  <Input value={formData.undergradCollege} onChange={(e) => updateField('undergradCollege', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Degree *</label>
                  <Input value={formData.degree} onChange={(e) => updateField('degree', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                </div>
              </div>
            </div>

            {/* Professional */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 mb-2.5 uppercase tracking-wider flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2"></span>
                Professional & Family
              </h3>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Company *</label>
                  <Input value={formData.currentCompany} onChange={(e) => updateField('currentCompany', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Designation *</label>
                  <Input value={formData.designation} onChange={(e) => updateField('designation', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Income (₹) *</label>
                  <Input type="number" value={formData.income} onChange={(e) => updateField('income', e.target.value)} placeholder="1200000" required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Religion *</label>
                    <Input value={formData.religion} onChange={(e) => updateField('religion', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Caste *</label>
                    <Input value={formData.caste} onChange={(e) => updateField('caste', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 mb-2.5 uppercase tracking-wider flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2"></span>
                Lifestyle & Contact
              </h3>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Diet *</label>
                    <select value={formData.dietaryPreference} onChange={(e) => updateField('dietaryPreference', e.target.value)} className="w-full h-8 px-2 border border-gray-300 rounded-md text-sm bg-white">
                      <option value="VEG">Veg</option>
                      <option value="NON_VEG">Non Veg</option>
                      <option value="JAIN">Jain</option>
                      <option value="EGGETARIAN">Egg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Drinks *</label>
                    <select value={formData.drinking} onChange={(e) => updateField('drinking', e.target.value)} className="w-full h-8 px-2 border border-gray-300 rounded-md text-sm bg-white">
                      <option value="NO">No</option>
                      <option value="YES">Yes</option>
                      <option value="OCCASIONALLY">Occasionally</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Email *</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Phone *</label>
                  <Input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="9876543210" required className="h-8 text-sm bg-white border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">Bio</label>
                  <Textarea value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} rows={2} className="text-sm bg-white border-gray-300" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex gap-3 shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10 border-gray-300">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} className="flex-1 h-10 bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl text-white font-semibold">
            {isSubmitting ? 'Adding...' : 'Add Client'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
