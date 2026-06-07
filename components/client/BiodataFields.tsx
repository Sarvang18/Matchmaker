'use client';

import { Card } from '@/components/ui/card';
import { formatIncome, formatHeight, formatEnum } from '@/lib/client-utils';

interface BiodataFieldsProps {
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string; // ISO string
    gender: string;
    maritalStatus: string;
    height: number;
    country: string;
    city: string;
    motherTongue: string;
    languagesKnown: string[];
    nriStatus: boolean;
    undergradCollege: string;
    degree: string;
    currentCompany: string;
    designation: string;
    income: number;
    religion: string;
    caste: string;
    familyType: string;
    siblings: number;
    dietaryPreference: string;
    drinking: string;
    smoking: string;
    wantKids: string;
    openToRelocate: string;
    openToPets: string;
    horoscopeRequired: boolean;
    bio: string | null;
  };
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <p className="text-base text-gray-900 mt-1 font-medium">{value || '—'}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center" style={{ fontFamily: 'Georgia, serif' }}>
        <span className="w-1 h-5 bg-red-600 mr-3"></span>
        {title}
      </h3>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

export function BiodataFields({ client }: BiodataFieldsProps) {
  return (
    <Card className="p-6 shadow-lg border border-gray-100">
      {/* Personal Information */}
      <Section title="Personal Information">
        <Field label="Full Name" value={`${client.firstName} ${client.lastName}`} />
        <Field label="Gender" value={formatEnum(client.gender)} />
        <Field label="Date of Birth" value={new Date(client.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
        <Field label="Marital Status" value={formatEnum(client.maritalStatus)} />
        <Field label="Height" value={formatHeight(client.height)} />
        <Field label="Mother Tongue" value={client.motherTongue} />
        <Field label="Languages Known" value={client.languagesKnown.join(', ')} />
        <Field label="NRI Status" value={client.nriStatus ? 'Yes' : 'No'} />
      </Section>

      {/* Professional Information */}
      <Section title="Professional Information">
        <Field label="Education" value={client.degree} />
        <Field label="College" value={client.undergradCollege} />
        <Field label="Current Company" value={client.currentCompany} />
        <Field label="Designation" value={client.designation} />
        <Field label="Annual Income" value={formatIncome(client.income)} />
      </Section>

      {/* Location */}
      <Section title="Location">
        <Field label="Country" value={client.country} />
        <Field label="City" value={client.city} />
      </Section>

      {/* Family & Background */}
      <Section title="Family & Background">
        <Field label="Religion" value={client.religion} />
        <Field label="Caste" value={client.caste} />
        <Field label="Family Type" value={formatEnum(client.familyType)} />
        <Field label="Siblings" value={client.siblings} />
      </Section>

      {/* Lifestyle */}
      <Section title="Lifestyle">
        <Field label="Dietary Preference" value={formatEnum(client.dietaryPreference)} />
        <Field label="Drinking" value={formatEnum(client.drinking)} />
        <Field label="Smoking" value={formatEnum(client.smoking)} />
        <Field label="Want Kids" value={formatEnum(client.wantKids)} />
        <Field label="Open to Relocate" value={formatEnum(client.openToRelocate)} />
        <Field label="Open to Pets" value={formatEnum(client.openToPets)} />
        <Field label="Horoscope Required" value={client.horoscopeRequired ? 'Yes' : 'No'} />
      </Section>

      {/* Contact Information */}
      <Section title="Contact Information">
        <Field label="Email" value={client.email} />
        <Field label="Phone" value={client.phone} />
      </Section>

      {/* Bio Section */}
      {client.bio && (
        <Section title="Bio">
          <div className="py-3">
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {client.bio}
            </p>
          </div>
        </Section>
      )}
    </Card>
  );
}
