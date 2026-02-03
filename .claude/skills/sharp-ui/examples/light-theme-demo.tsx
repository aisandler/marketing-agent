/**
 * Sharp UI - Light Theme Demo
 *
 * Demonstrates Sharp UI components on a light background.
 * Note: Light theme requires passing theme="light" to components
 * that support it, plus appropriate background colors.
 */

import React, { useState } from 'react';
import {
  SharpCard,
  SharpButton,
  SharpTabs,
  SharpSelect,
  SharpToggle,
  SharpInput,
  SharpBadge,
  SharpDivider,
  SharpSection,
  SharpSearchInput,
  SharpTreeItem,
} from '../assets/components';

export function LightThemeDemo() {
  const [activeTab, setActiveTab] = useState('projects');
  const [priority, setPriority] = useState('high');
  const [darkMode, setDarkMode] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'projects', label: 'PROJECTS' },
    { id: 'tasks', label: 'TASKS' },
    { id: 'team', label: 'TEAM' },
  ];

  const priorities = [
    { value: 'high', label: 'HIGH' },
    { value: 'medium', label: 'MEDIUM' },
    { value: 'low', label: 'LOW' },
  ];

  // Light theme background and text colors
  const lightBg = 'bg-slate-100';
  const cardBg = 'bg-white border-gray-400';
  const textPrimary = 'text-gray-900';
  const textMuted = 'text-gray-500';

  return (
    <div className={`min-h-screen ${lightBg} p-6`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${textPrimary} uppercase tracking-wider`}>
            Project Manager
          </h1>
          <SharpSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="SEARCH PROJECTS..."
            theme="light"
          />
        </header>

        {/* Note about light theme */}
        <div className={`${cardBg} border-2 rounded-sharp p-4`}>
          <p className={`text-sm ${textMuted}`}>
            <strong className={textPrimary}>Note:</strong> Sharp UI is designed primarily for
            dark interfaces. Light theme support is available by passing{' '}
            <code className="bg-gray-200 px-1">theme="light"</code> to components
            that support it (SharpSection, SharpSearchInput, SharpTreeItem).
          </p>
        </div>

        {/* Tabs - using custom styling for light bg */}
        <div className={`${cardBg} border-2 rounded-sharp p-1 inline-flex`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-bold uppercase tracking-wider
                transition-colors duration-150
                ${activeTab === tab.id
                  ? 'bg-sharp-accent text-white'
                  : `${textMuted} hover:${textPrimary}`
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Active', value: '12', color: 'text-sharp-accent' },
                { label: 'Pending', value: '5', color: 'text-sharp-warning' },
                { label: 'Done', value: '47', color: 'text-sharp-accent' },
              ].map((stat) => (
                <div key={stat.label} className={`${cardBg} border-2 rounded-sharp p-4`}>
                  <p className={`text-xs uppercase tracking-wider ${textMuted}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className={`${cardBg} border-2 rounded-sharp p-5`}>
              <h2 className={`text-lg font-bold ${textPrimary} uppercase tracking-wider mb-4`}>
                New Project
              </h2>

              <div className="space-y-4">
                {/* Using standard SharpInput/SharpSelect - they work on light bg */}
                <SharpInput
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  label="PROJECT NAME"
                  placeholder="Enter project name"
                />

                <SharpSelect
                  options={priorities}
                  value={priority}
                  onChange={setPriority}
                  label="PRIORITY"
                />

                <div className="flex gap-3 pt-2">
                  <SharpButton variant="primary">CREATE</SharpButton>
                  <SharpButton variant="secondary">SAVE DRAFT</SharpButton>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className={`${cardBg} border-2 rounded-sharp p-5`}>
              <h3 className={`font-bold ${textPrimary} uppercase tracking-wider mb-4`}>
                Preferences
              </h3>

              <SharpSection title="Display" theme="light">
                <div className="space-y-3">
                  <SharpToggle
                    checked={darkMode}
                    onChange={setDarkMode}
                    label="Dark Mode"
                  />
                </div>
              </SharpSection>

              <SharpSection title="Integrations" defaultOpen={false} theme="light">
                <p className={`text-sm ${textMuted}`}>
                  Connect external services
                </p>
              </SharpSection>
            </div>

            {/* File Tree */}
            <div className={`${cardBg} border-2 rounded-sharp p-4`}>
              <h3 className={`font-bold ${textPrimary} uppercase tracking-wider mb-3`}>
                Resources
              </h3>
              <div className="-mx-4">
                <SharpTreeItem
                  id="docs"
                  label="DOCUMENTATION"
                  hasChildren
                  isExpanded
                  theme="light"
                />
                <SharpTreeItem
                  id="guide"
                  label="Getting Started"
                  depth={1}
                  isSelected
                  theme="light"
                />
                <SharpTreeItem
                  id="api"
                  label="API Reference"
                  depth={1}
                  theme="light"
                />
              </div>
            </div>

            {/* Badges demo */}
            <div className={`${cardBg} border-2 rounded-sharp p-4`}>
              <h3 className={`font-bold ${textPrimary} uppercase tracking-wider mb-3`}>
                Status Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                <SharpBadge variant="default">DEFAULT</SharpBadge>
                <SharpBadge variant="success">SUCCESS</SharpBadge>
                <SharpBadge variant="warning">WARNING</SharpBadge>
                <SharpBadge variant="danger">DANGER</SharpBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t-2 border-gray-300 pt-4 flex justify-between ${textMuted} text-sm`}>
          <span>SHARP UI - LIGHT THEME DEMO</span>
          <span>All components work on light backgrounds</span>
        </div>
      </div>
    </div>
  );
}

export default LightThemeDemo;
