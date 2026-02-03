/**
 * Soft UI Design System - Dark Theme Demo
 *
 * A complete dashboard example showcasing all components in dark mode.
 * Copy this file to see the Soft UI system in action.
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

// Example icons (replace with your icon library)
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export default function DarkThemeDemo() {
  // State for demo components
  const [activeTab, setActiveTab] = useState('general');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [sortBy, setSortBy] = useState('name');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [volume, setVolume] = useState(75);
  const [selectedTreeItem, setSelectedTreeItem] = useState('brand-1');
  const [expandedItems, setExpandedItems] = useState<string[]>(['brand-1']);

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name', description: 'Sort alphabetically' },
    { value: 'date', label: 'Date', description: 'Sort by creation date' },
    { value: 'size', label: 'Size', description: 'Sort by file size' },
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-soft-dark-500 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <SoftSearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search..."
              showShortcut
              className="w-64"
            />
            <PillButton variant="primary" icon={<SaveIcon />}>
              Save Changes
            </PillButton>
          </div>
        </div>

        {/* Tabs */}
        <PillTabs
          tabs={[
            { value: 'general', label: 'General' },
            { value: 'appearance', label: 'Appearance' },
            { value: 'notifications', label: 'Notifications' },
            { value: 'advanced', label: 'Advanced' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="col-span-2 space-y-6">
            {/* Basic Settings Card */}
            <SoftCard variant="elevated" padding="none">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">Basic Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your account preferences</p>
              </div>
              <div className="p-5 space-y-5">
                <SoftSelect
                  label="Country"
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countries}
                />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-200">Email Notifications</span>
                    <p className="text-xs text-slate-500 mt-0.5">Receive updates via email</p>
                  </div>
                  <SoftToggle
                    checked={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                  />
                </div>

                <SoftSlider
                  value={volume}
                  onChange={setVolume}
                  min={0}
                  max={100}
                  label="Volume"
                  showValue
                  valueFormatter={(v) => `${v}%`}
                />
              </div>
            </SoftCard>

            {/* Collapsible Sections */}
            <SoftCard variant="elevated" padding="lg">
              <SoftSection
                title="Display Options"
                icon={<SettingsIcon />}
                description="Customize how content appears"
                defaultOpen
              >
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Show thumbnails</span>
                    <SoftToggle checked={true} onChange={() => {}} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Compact mode</span>
                    <SoftToggle checked={false} onChange={() => {}} size="sm" />
                  </div>
                </div>
              </SoftSection>

              <div className="border-t border-white/[0.06] my-4" />

              <SoftSection
                title="Advanced Options"
                description="For power users"
                defaultOpen={false}
              >
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Developer mode</span>
                    <SoftToggle checked={false} onChange={() => {}} size="sm" />
                  </div>
                </div>
              </SoftSection>
            </SoftCard>

            {/* Button Variants */}
            <SoftCard variant="default" padding="lg">
              <h3 className="text-sm font-semibold text-white mb-4">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <PillButton variant="primary">Primary</PillButton>
                <PillButton variant="secondary">Secondary</PillButton>
                <PillButton variant="ghost">Ghost</PillButton>
                <PillButton variant="primary" active>Active</PillButton>
                <PillButton variant="secondary" disabled>Disabled</PillButton>
              </div>
            </SoftCard>
          </div>

          {/* Right Column - Tree View */}
          <div className="space-y-4">
            <SoftCard variant="elevated" padding="none">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-sm font-medium text-white">Navigation</span>
                <CompactDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                />
              </div>
              <div className="py-2">
                <SoftTreeItem
                  id="brand-1"
                  type="brand"
                  label="Acme Corporation"
                  count={12}
                  hasChildren
                  isExpanded={expandedItems.includes('brand-1')}
                  isSelected={selectedTreeItem === 'brand-1'}
                  onSelect={setSelectedTreeItem}
                  onToggle={toggleExpanded}
                >
                  <SoftTreeItem
                    id="product-1"
                    type="product"
                    label="Widget Pro"
                    count={5}
                    depth={1}
                    hasChildren
                    isExpanded={expandedItems.includes('product-1')}
                    isSelected={selectedTreeItem === 'product-1'}
                    onSelect={setSelectedTreeItem}
                    onToggle={toggleExpanded}
                  >
                    <SoftTreeItem
                      id="variant-1"
                      type="variant"
                      label="Blue Edition"
                      depth={2}
                      isSelected={selectedTreeItem === 'variant-1'}
                      onSelect={setSelectedTreeItem}
                    />
                    <SoftTreeItem
                      id="variant-2"
                      type="variant"
                      label="Red Edition"
                      depth={2}
                      isSelected={selectedTreeItem === 'variant-2'}
                      onSelect={setSelectedTreeItem}
                    />
                  </SoftTreeItem>
                  <SoftTreeItem
                    id="product-2"
                    type="product"
                    label="Gadget X"
                    count={3}
                    depth={1}
                    isSelected={selectedTreeItem === 'product-2'}
                    onSelect={setSelectedTreeItem}
                  />
                </SoftTreeItem>

                <SoftTreeItem
                  id="group-1"
                  type="group"
                  label="Archived Items"
                  count={8}
                  isSelected={selectedTreeItem === 'group-1'}
                  onSelect={setSelectedTreeItem}
                />
              </div>
            </SoftCard>

            {/* Glass Card Example */}
            <SoftCard variant="glass" padding="lg">
              <h3 className="text-sm font-semibold text-white mb-2">Glass Effect</h3>
              <p className="text-xs text-slate-400">
                This card uses the glass variant with backdrop blur for a frosted appearance.
              </p>
            </SoftCard>
          </div>
        </div>
      </div>
    </div>
  );
}
