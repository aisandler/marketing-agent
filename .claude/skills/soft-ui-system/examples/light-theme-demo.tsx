/**
 * Soft UI Design System - Light Theme Demo
 *
 * A settings panel example showcasing all components in light mode.
 * Copy this file to see the Soft UI system with theme="light".
 */

import React, { useState } from 'react';
import {
  SoftCard,
  PillButton,
  PillTabs,
  SoftSelect,
  SoftToggle,
  SoftSlider,
  SoftSection,
  CompactDropdown,
  SoftSearchInput,
  SoftTreeItem,
} from '../assets/components';

// Theme constant - change to 'dark' to see dark mode
const THEME = 'light' as const;

// Example icons
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function LightThemeDemo() {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('utc');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [soundVolume, setSoundVolume] = useState(50);
  const [brightness, setBrightness] = useState(80);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
  ];

  const timezones = [
    { value: 'utc', label: 'UTC', description: 'Coordinated Universal Time' },
    { value: 'est', label: 'EST', description: 'Eastern Standard Time' },
    { value: 'pst', label: 'PST', description: 'Pacific Standard Time' },
    { value: 'cet', label: 'CET', description: 'Central European Time' },
  ];

  return (
    <div className="min-h-screen bg-soft-light-200 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account preferences</p>
          </div>
          <SoftSearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search settings..."
            theme={THEME}
            className="w-64"
          />
        </div>

        {/* Navigation Tabs */}
        <PillTabs
          theme={THEME}
          tabs={[
            { value: 'profile', label: 'Profile', icon: <UserIcon /> },
            { value: 'notifications', label: 'Notifications', icon: <BellIcon /> },
            { value: 'security', label: 'Security', icon: <LockIcon /> },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <SoftCard theme={THEME} variant="elevated" padding="none">
              <div className="px-6 py-4 border-b border-slate-200/60">
                <h2 className="text-base font-semibold text-slate-800">Language & Region</h2>
              </div>
              <div className="p-6 space-y-5">
                <SoftSelect
                  theme={THEME}
                  label="Language"
                  value={language}
                  onChange={setLanguage}
                  options={languages}
                  placeholder="Select language"
                />

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Timezone</label>
                  <CompactDropdown
                    theme={THEME}
                    value={timezone}
                    onChange={setTimezone}
                    options={timezones}
                  />
                </div>
              </div>
            </SoftCard>

            <SoftCard theme={THEME} variant="elevated" padding="lg">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Display Preferences</h3>

              <SoftSlider
                theme={THEME}
                value={brightness}
                onChange={setBrightness}
                min={0}
                max={100}
                label="Brightness"
                showValue
                valueFormatter={(v) => `${v}%`}
              />
            </SoftCard>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <SoftCard theme={THEME} variant="elevated" padding="none">
            <div className="px-6 py-4 border-b border-slate-200/60">
              <h2 className="text-base font-semibold text-slate-800">Notification Preferences</h2>
            </div>
            <div className="p-6 space-y-6">
              <SoftSection
                theme={THEME}
                title="Email Notifications"
                description="Control which emails you receive"
                defaultOpen
              >
                <div className="space-y-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Marketing emails</span>
                      <p className="text-xs text-slate-500 mt-0.5">Product updates and announcements</p>
                    </div>
                    <SoftToggle
                      theme={THEME}
                      checked={emailNotifications}
                      onChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Weekly digest</span>
                      <p className="text-xs text-slate-500 mt-0.5">Summary of your activity</p>
                    </div>
                    <SoftToggle
                      theme={THEME}
                      checked={true}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </SoftSection>

              <div className="border-t border-slate-200/60" />

              <SoftSection
                theme={THEME}
                title="Push Notifications"
                description="Mobile and desktop alerts"
                defaultOpen={false}
              >
                <div className="space-y-4 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Enable push notifications</span>
                    <SoftToggle
                      theme={THEME}
                      checked={pushNotifications}
                      onChange={setPushNotifications}
                    />
                  </div>

                  {pushNotifications && (
                    <SoftSlider
                      theme={THEME}
                      value={soundVolume}
                      onChange={setSoundVolume}
                      min={0}
                      max={100}
                      label="Sound Volume"
                      showValue
                    />
                  )}
                </div>
              </SoftSection>
            </div>
          </SoftCard>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SoftCard theme={THEME} variant="elevated" padding="lg">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600 mb-4">
                Add an extra layer of security to your account by requiring both your password
                and a verification code from your phone.
              </p>
              <PillButton theme={THEME} variant="primary">
                Enable 2FA
              </PillButton>
            </SoftCard>

            <SoftCard theme={THEME} variant="elevated" padding="lg">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'San Francisco, CA', current: true },
                  { device: 'iPhone 15', location: 'San Francisco, CA', current: false },
                  { device: 'Chrome on Windows', location: 'New York, NY', current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-medium text-slate-700">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 text-xs text-soft-indigo-600">(Current)</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{session.location}</div>
                    </div>
                    {!session.current && (
                      <PillButton theme={THEME} variant="ghost" size="sm">
                        Revoke
                      </PillButton>
                    )}
                  </div>
                ))}
              </div>
            </SoftCard>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <PillButton theme={THEME} variant="ghost">
            Cancel
          </PillButton>
          <PillButton theme={THEME} variant="secondary">
            Reset to Defaults
          </PillButton>
          <PillButton theme={THEME} variant="primary">
            Save Changes
          </PillButton>
        </div>
      </div>
    </div>
  );
}
