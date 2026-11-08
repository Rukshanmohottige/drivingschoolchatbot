'use client';

import React, { useState } from 'react';
import { SRI_LANKAN_DRIVING_SCHOOLS, SriLankanDrivingSchool } from '@/data/sri-lankan-schools';
import { X, Search, MapPin, Phone, Star, ShieldCheck, CheckCircle2, Car, Award, Calendar } from 'lucide-react';
import { Language } from '@/types/chat';

interface SchoolsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectSchool?: (school: SriLankanDrivingSchool) => void;
  onOpenBooking?: () => void;
}

export const SchoolsDirectoryModal: React.FC<SchoolsDirectoryModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenBooking
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isSi = language === 'si';

  if (!isOpen) return null;

  const districts = ['All', 'Colombo', 'Gampaha', 'Kandy', 'Galle'];

  const filteredSchools = SRI_LANKAN_DRIVING_SCHOOLS.filter(school => {
    const matchesDistrict = selectedDistrict === 'All' || school.district === selectedDistrict;
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.nameSi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.mainBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.branches.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-500/20 rounded-xl text-brand-300">
              <Car className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                {isSi ? 'ශ්‍රී ලංකාවේ ප්‍රමුඛ රියදුරු පාසල්' : 'Top Sri Lankan Driving Schools Directory'}
                <span className="text-[10px] bg-brand-500/30 text-brand-200 border border-brand-400/20 px-2 py-0.5 rounded-full font-semibold">
                  Verified DMT Partners
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isSi
                  ? 'කොළඹ, ගම්පහ, නුවර, සහ ගාල්ල දිස්ත්‍රික්ක වල ප්‍රධාන රියදුරු ආයතන'
                  : 'Compare registered learners, branch networks, fees, and pass rates across Sri Lanka'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          {/* District Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {districts.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedDistrict === d
                    ? 'bg-brand-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {d === 'All' ? (isSi ? 'සියලුම දිස්ත්‍රික්ක' : 'All Districts') : d}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={isSi ? 'නම හෝ නගරය සොයන්න...' : 'Search by school or town...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Schools List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredSchools.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No driving schools found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchools.map(school => (
                <div
                  key={school.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-brand-300 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Title & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          {isSi ? school.nameSi : school.name}
                          {school.id === 'drivemate-academy' && (
                            <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded font-bold">
                              Official Partner
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-brand-600" />
                          <span>{school.mainBranch} ({school.district})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{school.rating}</span>
                        <span className="text-[10px] text-amber-600 font-normal">({school.reviewCount})</span>
                      </div>
                    </div>

                    {/* Experience Badge */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                        <Award className="w-3 h-3 text-slate-500" />
                        {school.experienceYears} Years Experience
                      </span>
                      {school.vehicleClasses.slice(0, 3).map((cls, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md font-medium">
                          {cls}
                        </span>
                      ))}
                    </div>

                    {/* Features list */}
                    <div className="text-[11px] text-slate-600 space-y-1 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {(isSi ? school.featuresSi : school.features).slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Popular packages */}
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isSi ? 'ප්‍රධාන පාඨමාලා ගාස්තු:' : 'Popular Course Packages:'}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {school.popularPackages.slice(0, 2).map((pkg, i) => (
                          <div key={i} className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 text-[11px]">
                            <span className="block font-medium text-slate-700 truncate">{pkg.name}</span>
                            <span className="font-bold text-brand-700">LKR {pkg.fee.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-1">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-600" />
                      <a href={`tel:${school.phone.split('/')[0].trim()}`} className="hover:text-brand-600">
                        {school.phone.split('/')[0].trim()}
                      </a>
                    </div>

                    {onOpenBooking && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-2xs transition flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{isSi ? 'වෙන්කරවා ගන්න' : 'Book with Us'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
