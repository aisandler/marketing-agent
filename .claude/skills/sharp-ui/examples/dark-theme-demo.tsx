/**
 * Sharp UI - Dark Theme Demo
 *
 * A complete admin dashboard example showcasing all 11 components
 * in the brutalist Sharp UI design system.
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

export function DarkThemeDemo() {
  // State for interactive components
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState('active');
  const [notifications, setNotifications] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState('config');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['root']);

  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'logs', label: 'LOGS' },
    { id: 'config', label: 'CONFIG' },
  ];

  const statusOptions = [
    { value: 'active', label: 'ACTIVE' },
    { value: 'inactive', label: 'INACTIVE' },
    { value: 'maintenance', label: 'MAINTENANCE' },
  ];

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-sharp-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sharp-text uppercase tracking-wider">
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <SharpSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="SEARCH..."
            />
            <SharpBadge variant="success">ONLINE</SharpBadge>
          </div>
        </header>

        {/* Navigation */}
        <SharpTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        <SharpDivider />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <SharpCard variant="bordered">
                <p className="text-sharp-text-muted text-xs uppercase tracking-wider">Requests</p>
                <p className="text-3xl font-bold text-sharp-accent">12,847</p>
              </SharpCard>
              <SharpCard variant="bordered">
                <p className="text-sharp-text-muted text-xs uppercase tracking-wider">Errors</p>
                <p className="text-3xl font-bold text-sharp-accent-alt">23</p>
              </SharpCard>
              <SharpCard variant="bordered">
                <p className="text-sharp-text-muted text-xs uppercase tracking-wider">Uptime</p>
                <p className="text-3xl font-bold text-sharp-accent">99.9%</p>
              </SharpCard>
            </div>

            {/* Form Card */}
            <SharpCard variant="default" padding="lg">
              <h2 className="text-lg font-bold text-sharp-text uppercase tracking-wider mb-4">
                Server Configuration
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <SharpSelect
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    label="STATUS"
                  />
                  <SharpInput
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    label="API KEY"
                    placeholder="Enter API key"
                  />
                </div>

                <SharpDivider variant="accent" />

                <div className="flex gap-3">
                  <SharpButton variant="primary">DEPLOY</SharpButton>
                  <SharpButton variant="secondary">RESTART</SharpButton>
                  <SharpButton variant="ghost">CANCEL</SharpButton>
                </div>
              </div>
            </SharpCard>

            {/* Logs Preview */}
            <SharpCard variant="default" padding="md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sharp-text uppercase tracking-wider">
                  Recent Logs
                </h3>
                <SharpBadge variant="warning">3 NEW</SharpBadge>
              </div>
              <div className="font-mono text-sm text-sharp-text-muted space-y-1">
                <p>[INFO] Server started on port 3000</p>
                <p>[INFO] Connected to database</p>
                <p className="text-sharp-accent">[SUCCESS] Health check passed</p>
                <p className="text-sharp-warning">[WARN] High memory usage detected</p>
              </div>
            </SharpCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings Card */}
            <SharpCard variant="default" padding="lg">
              <h2 className="font-bold text-sharp-text uppercase tracking-wider mb-4">
                Settings
              </h2>

              <SharpSection title="Notifications">
                <div className="space-y-3">
                  <SharpToggle
                    checked={notifications}
                    onChange={setNotifications}
                    label="Email Alerts"
                  />
                  <SharpToggle
                    checked={debugMode}
                    onChange={setDebugMode}
                    label="Debug Mode"
                  />
                </div>
              </SharpSection>

              <SharpSection title="Advanced" defaultOpen={false}>
                <p className="text-sharp-text-muted text-sm">
                  Advanced configuration options
                </p>
              </SharpSection>
            </SharpCard>

            {/* File Tree */}
            <SharpCard variant="default" padding="md">
              <h3 className="font-bold text-sharp-text uppercase tracking-wider mb-3">
                Files
              </h3>
              <div className="-mx-4">
                <SharpTreeItem
                  id="root"
                  label="CONFIG"
                  hasChildren
                  isExpanded={expandedFolders.includes('root')}
                  onToggle={() => toggleFolder('root')}
                />
                {expandedFolders.includes('root') && (
                  <>
                    <SharpTreeItem
                      id="config"
                      label="server.json"
                      depth={1}
                      isSelected={selectedFile === 'config'}
                      onClick={() => setSelectedFile('config')}
                    />
                    <SharpTreeItem
                      id="env"
                      label=".env"
                      depth={1}
                      isSelected={selectedFile === 'env'}
                      onClick={() => setSelectedFile('env')}
                    />
                    <SharpTreeItem
                      id="docker"
                      label="docker"
                      depth={1}
                      hasChildren
                      isExpanded={expandedFolders.includes('docker')}
                      onToggle={() => toggleFolder('docker')}
                    />
                    {expandedFolders.includes('docker') && (
                      <SharpTreeItem
                        id="compose"
                        label="compose.yml"
                        depth={2}
                        isSelected={selectedFile === 'compose'}
                        onClick={() => setSelectedFile('compose')}
                      />
                    )}
                  </>
                )}
              </div>
            </SharpCard>
          </div>
        </div>

        {/* Footer */}
        <SharpDivider />
        <div className="flex justify-between items-center text-sharp-text-muted text-sm">
          <span>SHARP UI v1.0.0</span>
          <span>SYSTEM STATUS: <span className="text-sharp-accent">OPERATIONAL</span></span>
        </div>
      </div>
    </div>
  );
}

export default DarkThemeDemo;
