import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfileView = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  // Profile update form
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    await updateProfile({
      full_name: fullName,
      phone: phone || null,
    });
    setUpdatingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters long.');
      return;
    }

    setUpdatingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setUpdatingPassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-coffee-200 pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
          Personal Information
        </span>
        <h1 className="font-serif text-3xl font-bold text-coffee-950">
          Account Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Profile Summary Card */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-coffee-200 shadow-sm text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-coffee-800 text-amber-200 font-serif font-bold text-3xl flex items-center justify-center shadow-lg shadow-coffee-900/10">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div>
              <h3 className="font-bold text-lg text-coffee-950">{user?.full_name}</h3>
              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>

            <div className="pt-3 border-t border-coffee-100 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-coffee-100 text-coffee-800">
                {user?.role === 'admin' ? '👑 Administrator' : '☕ Coffee Connoisseur'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Update Profile & Change Password Forms */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Edit Profile Details */}
          <form onSubmit={handleProfileSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-200 shadow-sm space-y-5">
            <h3 className="font-serif text-xl font-bold text-coffee-950 flex items-center gap-2">
              <User className="w-5 h-5 text-coffee-700" />
              General Profile
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-sm p-3 rounded-xl border border-coffee-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Email address is linked to your account orders.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingProfile}
                className="px-6 py-2.5 rounded-xl bg-coffee-800 hover:bg-coffee-900 text-amber-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
              >
                {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handlePasswordSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-200 shadow-sm space-y-5">
            <h3 className="font-serif text-xl font-bold text-coffee-950 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-coffee-700" />
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-amber-200 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
