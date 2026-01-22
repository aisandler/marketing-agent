// Simple client configuration loader for dynamic, client-specific settings
// Allows per-client adaptation without code changes.

const fs = require('fs');
const path = require('path');

function loadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`[config] Failed to read ${filePath}: ${e.message}`);
  }
  return {};
}

// Generic defaults that work with any client - override via client.config.json
const DEFAULTS = {
  client: {
    name: '{{CLIENT_NAME}}',
    industry: '{{INDUSTRY}}',
    businessType: 'local_service_business'
  },
  airtable: {
    webhookUrl: process.env.N8N_WEBHOOK_URL || null,
    baseId: process.env.AIRTABLE_BASE_ID || null,
    tableId: process.env.AIRTABLE_TABLE_ID || null,
    apiUrl: 'https://api.airtable.com/v0',
    apiKey: process.env.AIRTABLE_API_KEY || null
  },
  brand: {
    // Pointers to brand materials. Relative paths are allowed.
    guidelines: [
      'docs/brand-guidelines/brand-guide.md',
      'docs/brand-guidelines/core-messaging-template.md'
    ],
    voiceGuide: 'docs/brand-guidelines/brand-guide.md',
    personas: null,
    styleGuide: null,
    assetsDir: 'content/client-documents/brand-guides',
    knowledge: [] // Additional qualitative materials (PDFs, docs, decks)
  },
  templates: {
    blogOutline: null,
    blogDraft: null,
    socialPost: null,
    locationPage: null
  },
  // Map logical field keys → Airtable field names
  fields: {
    contentId: 'Content ID',
    description: 'Description',
    contentType: 'Content Type',
    priority: 'Priority',
    targetLocation: 'Target Location',
    serviceCategory: 'Service Category',
    contentFormat: 'Content Format',
    seasonalRelevance: 'Seasonal Relevance',
    primaryKeyword: 'Primary Keyword',
    searchVolume: 'Search Volume',
    keywordDifficulty: 'Keyword Difficulty',
    notes: 'Notes',
    text: 'Text',
    status: 'Status',
    title: 'Title',
    publishDate: 'Publish Date',
    targetPublishDate: 'Target Publish Date'
  },
  labels: {
    // Used for non-Airtable display (e.g., Markdown summary)
    entitySubtypeLabel: 'Service Category'
  },
  drive: {
    folders: {
      blog: process.env.DRIVE_BLOG_FOLDER_ID || null,
      social: process.env.DRIVE_SOCIAL_FOLDER_ID || null,
      location: process.env.DRIVE_LOCATION_FOLDER_ID || null,
      email: process.env.DRIVE_EMAIL_FOLDER_ID || null,
      library: process.env.DRIVE_LIBRARY_FOLDER_ID || null
    }
  }
};

function deepMerge(target, source) {
  const out = { ...target };
  for (const [k, v] of Object.entries(source || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = deepMerge(target[k] || {}, v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

function loadConfig() {
  const defaultPath = path.join(__dirname, '..', 'config', 'client.config.json');
  const cfgPath = process.env.CLIENT_CONFIG_PATH || defaultPath;
  const fileCfg = loadJson(cfgPath);

  // Env overrides for core Airtable values
  const envCfg = {
    airtable: {
      webhookUrl: process.env.N8N_WEBHOOK_URL,
      baseId: process.env.AIRTABLE_BASE_ID,
      tableId: process.env.AIRTABLE_TABLE_ID,
      apiKey: process.env.AIRTABLE_API_KEY,
      apiUrl: process.env.AIRTABLE_API_URL
    }
  };

  const merged = deepMerge(DEFAULTS, fileCfg);
  return deepMerge(merged, envCfg);
}

const config = loadConfig();

module.exports = {
  ...config,
  getField(key) {
    return (config.fields && config.fields[key]) || key;
  }
};
