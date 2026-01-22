#!/usr/bin/env node

/**
 * Marketing Engine CLI - BMAD-Inspired Orchestration Tool
 * Provides centralized management of marketing workflows, agent coordination, and system validation
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const program = new Command();

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CLIENT_CONTEXT = path.join(PROJECT_ROOT, 'client-context');
const HANDOFFS_DIR = path.join(CLIENT_CONTEXT, 'handoffs');
const VALIDATION_DIR = path.join(CLIENT_CONTEXT, 'validation');

program
  .name('marketing-cli')
  .description('Marketing Engine Orchestration CLI - BMAD-Inspired Agent Coordination')
  .version('1.0.0');

/**
 * Check marketing engine overall status and readiness
 */
program
  .command('status')
  .description('Check marketing engine readiness and configuration status')
  .action(async () => {
    console.log('🚀 Marketing Engine Status Check');
    console.log('=' .repeat(50));

    const status = await checkEngineStatus();
    displayStatus(status);
  });

/**
 * Validate marketing configuration completeness
 */
program
  .command('validate')
  .description('Validate marketing configuration completeness')
  .option('--verbose', 'Show detailed validation results')
  .action(async (options) => {
    console.log('🔍 Marketing Configuration Validation');
    console.log('=' .repeat(50));

    const results = await validateConfiguration();
    displayValidationResults(results, options.verbose);
  });

/**
 * Manage agent context handoffs
 */
program
  .command('handoff <source> <target>')
  .description('Manage agent context handoff')
  .option('--create', 'Create new handoff context')
  .option('--validate', 'Validate handoff completeness')
  .action(async (source, target, options) => {
    console.log(`🔄 Agent Handoff: ${source} → ${target}`);
    console.log('=' .repeat(50));

    await manageHandoff(source, target, options);
  });

/**
 * Manage workflow session state
 */
program
  .command('session')
  .description('Manage workflow session state')
  .option('--start <workflow>', 'Start new workflow session')
  .option('--status', 'Check current session status')
  .option('--end', 'End current session')
  .action(async (options) => {
    console.log('📊 Session Management');
    console.log('=' .repeat(50));

    await manageSession(options);
  });

/**
 * Install or manage industry expansions
 */
program
  .command('expansion <action>')
  .description('Manage industry expansion packs')
  .option('--industry <name>', 'Specify industry name')
  .option('--list', 'List available expansions')
  .action(async (action, options) => {
    console.log('📦 Expansion Pack Management');
    console.log('=' .repeat(50));

    await manageExpansions(action, options);
  });

// Core Functions

async function checkEngineStatus() {
  const status = {
    overall: 'unknown',
    components: {},
    recommendations: []
  };

  try {
    // Check directory structure
    status.components.directories = checkDirectoryStructure();

    // Check CLAUDE.md configuration
    status.components.configuration = checkConfiguration();

    // Check agent readiness
    status.components.agents = checkAgentReadiness();

    // Check brand architecture completeness
    status.components.brandArchitecture = checkBrandArchitecture();

    // Determine overall status
    const componentStatuses = Object.values(status.components);
    if (componentStatuses.every(c => c.status === 'ready')) {
      status.overall = 'ready';
    } else if (componentStatuses.some(c => c.status === 'error')) {
      status.overall = 'error';
    } else {
      status.overall = 'partial';
    }

  } catch (error) {
    status.overall = 'error';
    status.error = error.message;
  }

  return status;
}

function checkDirectoryStructure() {
  const requiredDirs = [
    'client-context/business',
    'client-context/brand',
    'client-context/competitors',
    'client-context/keywords',
    'client-context/handoffs',
    'client-context/validation',
    'client-brand/current'
  ];

  const missing = [];
  const existing = [];

  requiredDirs.forEach(dir => {
    const fullPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(fullPath)) {
      existing.push(dir);
    } else {
      missing.push(dir);
    }
  });

  return {
    status: missing.length === 0 ? 'ready' : 'partial',
    existing: existing.length,
    missing: missing.length,
    missingDirs: missing
  };
}

function checkConfiguration() {
  const claudeFile = path.join(PROJECT_ROOT, 'CLAUDE.md');

  if (!fs.existsSync(claudeFile)) {
    return { status: 'error', message: 'CLAUDE.md not found' };
  }

  try {
    const content = fs.readFileSync(claudeFile, 'utf8');

    // Check for placeholder patterns
    const placeholders = content.match(/{{.*?}}/g) || [];

    // Check for required sections
    const requiredSections = [
      'Business Configuration',
      'Content Requirements',
      'Marketing Focus'
    ];

    const missingSections = requiredSections.filter(section =>
      !content.includes(section)
    );

    return {
      status: placeholders.length === 0 && missingSections.length === 0 ? 'ready' : 'partial',
      placeholders: placeholders.length,
      missingSections: missingSections.length,
      details: { placeholders, missingSections }
    };

  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function checkAgentReadiness() {
  const agentFiles = [
    '.claude/commands/cmo.md',
    '.claude/commands/onboard.md',
    '.claude/commands/analyst.md'
  ];

  const status = { ready: 0, missing: 0, agents: {} };

  agentFiles.forEach(file => {
    const fullPath = path.join(PROJECT_ROOT, file);
    const agentName = path.basename(file, '.md');

    if (fs.existsSync(fullPath)) {
      status.ready++;
      status.agents[agentName] = 'ready';
    } else {
      status.missing++;
      status.agents[agentName] = 'missing';
    }
  });

  return {
    status: status.missing === 0 ? 'ready' : 'partial',
    ...status
  };
}

function checkBrandArchitecture() {
  const requiredFiles = [
    'client-context/business',
    'client-context/brand',
    'client-brand/current'
  ];

  let hasContent = 0;
  let totalChecked = 0;

  requiredFiles.forEach(dir => {
    const fullPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      totalChecked++;
      if (files.length > 0) {
        hasContent++;
      }
    }
  });

  return {
    status: hasContent === requiredFiles.length ? 'ready' :
            hasContent > 0 ? 'partial' : 'empty',
    contentDirs: hasContent,
    totalDirs: requiredFiles.length
  };
}

async function validateConfiguration() {
  const results = {
    overall: 'unknown',
    checks: [],
    score: 0,
    maxScore: 0
  };

  // Business Foundation Check
  results.checks.push(await validateBusinessFoundation());

  // Brand Strategy Check
  results.checks.push(await validateBrandStrategy());

  // Content Strategy Check
  results.checks.push(await validateContentStrategy());

  // Agent Configuration Check
  results.checks.push(await validateAgentConfiguration());

  // Calculate score
  results.maxScore = results.checks.length * 10;
  results.score = results.checks.reduce((sum, check) => sum + check.score, 0);

  // Determine overall status
  const percentage = (results.score / results.maxScore) * 100;
  if (percentage >= 90) results.overall = 'excellent';
  else if (percentage >= 70) results.overall = 'good';
  else if (percentage >= 50) results.overall = 'partial';
  else results.overall = 'incomplete';

  return results;
}

async function validateBusinessFoundation() {
  const check = { name: 'Business Foundation', score: 0, maxScore: 10, details: [] };

  const businessDir = path.join(CLIENT_CONTEXT, 'business');
  if (fs.existsSync(businessDir) && fs.readdirSync(businessDir).length > 0) {
    check.score += 10;
    check.details.push('✅ Business information documented');
  } else {
    check.details.push('❌ Business information missing');
  }

  return check;
}

async function validateBrandStrategy() {
  const check = { name: 'Brand Strategy', score: 0, maxScore: 10, details: [] };

  const brandDir = path.join(CLIENT_CONTEXT, 'brand');
  if (fs.existsSync(brandDir) && fs.readdirSync(brandDir).length > 0) {
    check.score += 10;
    check.details.push('✅ Brand strategy documented');
  } else {
    check.details.push('❌ Brand strategy missing');
  }

  return check;
}

async function validateContentStrategy() {
  const check = { name: 'Content Strategy', score: 0, maxScore: 10, details: [] };

  const keywordsDir = path.join(CLIENT_CONTEXT, 'keywords');
  if (fs.existsSync(keywordsDir) && fs.readdirSync(keywordsDir).length > 0) {
    check.score += 10;
    check.details.push('✅ Content strategy documented');
  } else {
    check.details.push('❌ Content strategy missing');
  }

  return check;
}

async function validateAgentConfiguration() {
  const check = { name: 'Agent Configuration', score: 0, maxScore: 10, details: [] };

  const claudeFile = path.join(PROJECT_ROOT, 'CLAUDE.md');
  if (fs.existsSync(claudeFile)) {
    const content = fs.readFileSync(claudeFile, 'utf8');
    const placeholders = content.match(/{{.*?}}/g) || [];

    if (placeholders.length === 0) {
      check.score += 10;
      check.details.push('✅ Marketing engine configured');
    } else {
      check.score += 5;
      check.details.push(`⚠️ ${placeholders.length} placeholders remaining`);
    }
  } else {
    check.details.push('❌ CLAUDE.md configuration missing');
  }

  return check;
}

async function manageHandoff(source, target, options) {
  const handoffKey = `${source}-to-${target}`;
  const handoffDir = path.join(HANDOFFS_DIR, handoffKey);

  if (options.create) {
    await createHandoff(handoffKey, handoffDir);
  } else if (options.validate) {
    await validateHandoff(handoffKey, handoffDir);
  } else {
    await showHandoffStatus(handoffKey, handoffDir);
  }
}

async function createHandoff(handoffKey, handoffDir) {
  if (!fs.existsSync(handoffDir)) {
    console.log(`❌ Handoff template not found: ${handoffKey}`);
    console.log('Available handoffs:');
    const handoffs = fs.readdirSync(HANDOFFS_DIR);
    handoffs.forEach(h => console.log(`  - ${h}`));
    return;
  }

  const templateFile = path.join(handoffDir, 'handoff-template.json');
  const activeFile = path.join(handoffDir, 'active-handoff.json');

  if (fs.existsSync(templateFile)) {
    const template = JSON.parse(fs.readFileSync(templateFile, 'utf8'));
    template.timestamp = new Date().toISOString();
    template.created_by = process.env.USER || 'system';
    template.expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    fs.writeFileSync(activeFile, JSON.stringify(template, null, 2));
    console.log(`✅ Created active handoff: ${handoffKey}`);
    console.log(`📁 Location: ${activeFile}`);
  } else {
    console.log(`❌ Template not found: ${templateFile}`);
  }
}

async function validateHandoff(handoffKey, handoffDir) {
  const activeFile = path.join(handoffDir, 'active-handoff.json');

  if (!fs.existsSync(activeFile)) {
    console.log(`❌ No active handoff found: ${handoffKey}`);
    return;
  }

  try {
    const handoff = JSON.parse(fs.readFileSync(activeFile, 'utf8'));
    console.log(`✅ Handoff exists: ${handoffKey}`);
    console.log(`📅 Created: ${handoff.timestamp}`);
    console.log(`⏰ Expires: ${handoff.expires_at}`);
    console.log(`📊 Status: ${handoff.validation_status}`);
  } catch (error) {
    console.log(`❌ Invalid handoff format: ${error.message}`);
  }
}

async function showHandoffStatus(handoffKey, handoffDir) {
  console.log(`Handoff Status: ${handoffKey}`);

  const templateFile = path.join(handoffDir, 'handoff-template.json');
  const activeFile = path.join(handoffDir, 'active-handoff.json');

  console.log(`Template: ${fs.existsSync(templateFile) ? '✅' : '❌'}`);
  console.log(`Active: ${fs.existsSync(activeFile) ? '✅' : '❌'}`);

  if (fs.existsSync(activeFile)) {
    const handoff = JSON.parse(fs.readFileSync(activeFile, 'utf8'));
    console.log(`Status: ${handoff.validation_status}`);
    console.log(`Created: ${handoff.timestamp}`);
  }
}

async function manageSession(options) {
  const sessionFile = path.join(HANDOFFS_DIR, 'session-state', 'current-session.json');

  if (options.start) {
    const session = {
      workflow: options.start,
      started_at: new Date().toISOString(),
      status: 'active',
      steps_completed: [],
      current_step: '',
      context: {}
    };

    fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));
    console.log(`✅ Started ${options.start} session`);

  } else if (options.status) {
    if (fs.existsSync(sessionFile)) {
      const session = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      console.log(`Current Workflow: ${session.workflow}`);
      console.log(`Status: ${session.status}`);
      console.log(`Started: ${session.started_at}`);
      console.log(`Steps Completed: ${session.steps_completed.length}`);
    } else {
      console.log('No active session');
    }

  } else if (options.end) {
    if (fs.existsSync(sessionFile)) {
      fs.unlinkSync(sessionFile);
      console.log('✅ Session ended');
    } else {
      console.log('No active session to end');
    }
  }
}

async function manageExpansions(action, options) {
  console.log(`Expansion management: ${action}`);
  console.log('🚧 Expansion pack system coming in Phase 3');
}

// Display Functions

function displayStatus(status) {
  console.log(`\n🎯 Overall Status: ${getStatusEmoji(status.overall)} ${status.overall.toUpperCase()}\n`);

  Object.entries(status.components).forEach(([component, data]) => {
    console.log(`${component.toUpperCase()}:`);
    console.log(`  Status: ${getStatusEmoji(data.status)} ${data.status}`);

    if (data.missing && data.missing > 0) {
      console.log(`  Missing: ${data.missing} items`);
    }
    if (data.missingDirs) {
      data.missingDirs.forEach(dir => console.log(`    - ${dir}`));
    }
    if (data.details) {
      if (data.details.placeholders && data.details.placeholders.length > 0) {
        console.log(`  Placeholders: ${data.details.placeholders.length}`);
      }
    }
    console.log('');
  });

  if (status.overall !== 'ready') {
    console.log('📋 RECOMMENDATIONS:');
    if (status.components.brandArchitecture?.status === 'empty') {
      console.log('  1. Run /onboard to set up brand architecture');
    }
    if (status.components.configuration?.placeholders > 0) {
      console.log('  2. Complete CLAUDE.md configuration');
    }
    if (status.components.directories?.missing > 0) {
      console.log('  3. Create missing directory structure');
    }
  } else {
    console.log('🎉 Marketing engine is ready for operations!');
    console.log('   → Use /cmo for strategic planning');
    console.log('   → Use /analyst for performance insights');
  }
}

function displayValidationResults(results, verbose) {
  console.log(`\n🎯 Overall Score: ${results.score}/${results.maxScore} (${Math.round((results.score/results.maxScore)*100)}%)`);
  console.log(`📊 Status: ${getStatusEmoji(results.overall)} ${results.overall.toUpperCase()}\n`);

  results.checks.forEach(check => {
    console.log(`${check.name}: ${check.score}/${check.maxScore}`);
    if (verbose || check.score < check.maxScore) {
      check.details.forEach(detail => console.log(`  ${detail}`));
    }
    console.log('');
  });
}

function getStatusEmoji(status) {
  const emojis = {
    ready: '✅',
    partial: '⚠️',
    error: '❌',
    empty: '📭',
    excellent: '🏆',
    good: '✅',
    incomplete: '❌',
    unknown: '❓'
  };
  return emojis[status] || '❓';
}

// Handle unhandled commands
program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}