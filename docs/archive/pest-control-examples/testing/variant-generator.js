#!/usr/bin/env node

/**
 * A/B Testing Variant Generator
 * Automatically creates content variations for testing
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class VariantGenerator {
    constructor() {
        this.testingDir = path.join(__dirname);
        this.frameworkFile = path.join(this.testingDir, 'ab-test-framework.json');
        this.templatesFile = path.join(this.testingDir, 'testing-variants.json');
        this.logFile = path.join(this.testingDir, 'variant-generator.log');

        this.framework = this.loadFramework();
        this.templates = this.loadTemplates();
    }

    /**
     * Load A/B testing framework configuration
     */
    loadFramework() {
        try {
            return JSON.parse(fs.readFileSync(this.frameworkFile, 'utf8'));
        } catch (error) {
            console.error(`Failed to load framework: ${error.message}`);
            return null;
        }
    }

    /**
     * Load or create testing templates
     */
    loadTemplates() {
        if (fs.existsSync(this.templatesFile)) {
            try {
                return JSON.parse(fs.readFileSync(this.templatesFile, 'utf8'));
            } catch (error) {
                console.warn(`Failed to load templates: ${error.message}`);
            }
        }

        // Create default templates
        const defaultTemplates = this.createDefaultTemplates();
        this.saveTemplates(defaultTemplates);
        return defaultTemplates;
    }

    /**
     * Create default testing templates
     */
    createDefaultTemplates() {
        return {
            "version": "1.0",
            "templates": {
                "headline_testing": {
                    "emotional": {
                        "patterns": [
                            "Transform Your {subject} in Just {timeframe}",
                            "The {subject} Solution That Changed Everything",
                            "Why {target_audience} Are Choosing {solution}",
                            "The Secret to {desired_outcome} Finally Revealed"
                        ],
                        "emotional_triggers": ["transform", "secret", "finally", "amazing", "incredible"]
                    },
                    "rational": {
                        "patterns": [
                            "Complete {subject} Guide: {number} Proven Steps",
                            "How to {action} {subject} - Expert Analysis",
                            "{number} Evidence-Based {subject} Strategies",
                            "Professional {subject} Services: What You Need to Know"
                        ],
                        "rational_triggers": ["proven", "evidence-based", "expert", "complete", "professional"]
                    },
                    "urgency": {
                        "patterns": [
                            "Last Chance: {offer} Ends {deadline}",
                            "Limited Time: {benefit} Available Now",
                            "Act Fast: Only {number} {items} Remaining",
                            "Don't Wait: {consequence} This {timeframe}"
                        ],
                        "urgency_triggers": ["last chance", "limited time", "act fast", "don't wait", "expires"]
                    },
                    "curiosity": {
                        "patterns": [
                            "What {target_audience} Don't Want You to Know About {subject}",
                            "The {subject} Mistake That's Costing You {loss}",
                            "Why {action} Isn't Working (And What to Do Instead)",
                            "The Surprising Truth About {subject}"
                        ],
                        "curiosity_triggers": ["what", "why", "surprising", "truth", "secret", "mistake"]
                    }
                },
                "cta_testing": {
                    "action_words": {
                        "patterns": [
                            "{action} Your {benefit} Today",
                            "{action} Now and {benefit}",
                            "Start {action}ing {timeframe}",
                            "{action} {solution} Instantly"
                        ],
                        "action_verbs": ["Get", "Start", "Download", "Claim", "Discover", "Unlock", "Access", "Join"]
                    },
                    "urgency": {
                        "patterns": [
                            "{action} Before It's Too Late",
                            "Limited Time: {action} Now",
                            "Last Chance to {action}",
                            "{action} While {condition}"
                        ],
                        "urgency_modifiers": ["now", "today", "immediately", "before it's too late", "limited time"]
                    },
                    "value_proposition": {
                        "patterns": [
                            "{action} Your Free {offer}",
                            "{action} {benefit} at No Cost",
                            "{action} {outcome} in {timeframe}",
                            "{action} and Save {amount}"
                        ],
                        "value_indicators": ["free", "no cost", "save", "bonus", "exclusive", "guaranteed"]
                    },
                    "risk_reduction": {
                        "patterns": [
                            "Try {solution} Risk-Free",
                            "{action} with {guarantee}",
                            "No {risk} - {action} Today",
                            "{action} - {assurance} Included"
                        ],
                        "risk_reducers": ["risk-free", "money-back guarantee", "no commitment", "cancel anytime"]
                    }
                },
                "content_length": {
                    "short": {
                        "word_range": [150, 300],
                        "structure": ["hook", "main_point", "cta"],
                        "tone": "punchy and direct"
                    },
                    "medium": {
                        "word_range": [300, 600],
                        "structure": ["introduction", "main_points", "supporting_details", "cta"],
                        "tone": "informative and engaging"
                    },
                    "long": {
                        "word_range": [600, 1200],
                        "structure": ["introduction", "problem", "solution", "benefits", "proof", "cta"],
                        "tone": "comprehensive and authoritative"
                    },
                    "comprehensive": {
                        "word_range": [1200, 2000],
                        "structure": ["introduction", "background", "detailed_analysis", "case_studies", "implementation", "conclusion", "cta"],
                        "tone": "expert and thorough"
                    }
                },
                "tone_variations": {
                    "professional": {
                        "characteristics": ["formal language", "industry terminology", "third person", "objective tone"],
                        "avoid": ["slang", "casual expressions", "personal anecdotes", "humor"]
                    },
                    "friendly": {
                        "characteristics": ["conversational tone", "personal pronouns", "warm language", "approachable"],
                        "avoid": ["overly formal", "jargon", "cold language", "distant tone"]
                    },
                    "authoritative": {
                        "characteristics": ["confident statements", "expert positioning", "data-driven", "decisive"],
                        "avoid": ["uncertain language", "hedging", "questions", "weak modifiers"]
                    },
                    "conversational": {
                        "characteristics": ["casual tone", "questions", "you/I language", "storytelling"],
                        "avoid": ["formal structure", "complex sentences", "academic language", "passive voice"]
                    }
                }
            },
            "placeholders": {
                "business_types": ["HVAC", "plumbing", "electrical", "landscaping", "cleaning", "pest control"],
                "services": ["installation", "repair", "maintenance", "inspection", "consultation"],
                "benefits": ["energy savings", "comfort", "reliability", "peace of mind", "convenience"],
                "timeframes": ["24 hours", "same day", "this week", "30 days", "this season"],
                "guarantees": ["100% satisfaction guarantee", "money-back guarantee", "lifetime warranty"],
                "target_audiences": ["homeowners", "business owners", "property managers", "contractors"]
            }
        };
    }

    /**
     * Generate variants for a specific test type
     */
    generateVariants(testType, baseContent, options = {}) {
        if (!this.framework || !this.framework.test_types[testType]) {
            throw new Error(`Unknown test type: ${testType}`);
        }

        const testConfig = this.framework.test_types[testType];
        const variants = [];

        for (const variationType of testConfig.variations) {
            const variant = this.createVariant(testType, variationType, baseContent, options);
            if (variant) {
                variants.push(variant);
            }
        }

        return variants;
    }

    /**
     * Create a single variant
     */
    createVariant(testType, variationType, baseContent, options) {
        const template = this.templates.templates[testType];
        if (!template || !template[variationType]) {
            console.warn(`No template found for ${testType}.${variationType}`);
            return null;
        }

        const variantTemplate = template[variationType];
        let content = baseContent;

        switch (testType) {
            case 'headline_testing':
                content = this.generateHeadlineVariant(variationType, variantTemplate, options);
                break;
            case 'cta_testing':
                content = this.generateCTAVariant(variationType, variantTemplate, options);
                break;
            case 'content_length':
                content = this.generateLengthVariant(variationType, variantTemplate, baseContent, options);
                break;
            case 'tone_variations':
                content = this.generateToneVariant(variationType, variantTemplate, baseContent, options);
                break;
            default:
                content = this.generateGenericVariant(variationType, variantTemplate, baseContent, options);
        }

        return {
            id: this.generateVariantId(),
            name: `${testType}_${variationType}`,
            type: variationType,
            content: content,
            template_used: variantTemplate,
            created_at: new Date().toISOString(),
            metadata: {
                test_type: testType,
                variation_type: variationType,
                base_content_hash: this.hashContent(baseContent),
                options: options
            }
        };
    }

    /**
     * Generate headline variant
     */
    generateHeadlineVariant(variationType, template, options) {
        const patterns = template.patterns;
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

        // Replace placeholders with actual content
        return this.replacePlaceholders(selectedPattern, {
            subject: options.subject || 'HVAC services',
            timeframe: options.timeframe || '24 hours',
            target_audience: options.target_audience || 'homeowners',
            solution: options.solution || 'professional service',
            desired_outcome: options.desired_outcome || 'perfect comfort',
            action: options.action || 'improve',
            number: options.number || '5',
            offer: options.offer || 'special discount',
            deadline: options.deadline || 'this month',
            benefit: options.benefit || 'amazing results',
            items: options.items || 'spots',
            consequence: options.consequence || 'miss out',
            loss: options.loss || 'money'
        });
    }

    /**
     * Generate CTA variant
     */
    generateCTAVariant(variationType, template, options) {
        const patterns = template.patterns;
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

        let actionVerb = 'Get';
        if (template.action_verbs) {
            actionVerb = template.action_verbs[Math.floor(Math.random() * template.action_verbs.length)];
        }

        return this.replacePlaceholders(selectedPattern, {
            action: actionVerb,
            benefit: options.benefit || 'better results',
            timeframe: options.timeframe || 'today',
            solution: options.solution || 'our service',
            condition: options.condition || 'supplies last',
            offer: options.offer || 'consultation',
            outcome: options.outcome || 'improved efficiency',
            amount: options.amount || '20%',
            guarantee: options.guarantee || 'money-back guarantee',
            risk: options.risk || 'obligation',
            assurance: options.assurance || 'satisfaction guarantee'
        });
    }

    /**
     * Generate content length variant
     */
    generateLengthVariant(variationType, template, baseContent, options) {
        const targetWordCount = Math.floor(
            (template.word_range[0] + template.word_range[1]) / 2
        );

        const currentWordCount = baseContent.split(/\s+/).length;

        if (currentWordCount < template.word_range[0]) {
            // Need to expand content
            return this.expandContent(baseContent, targetWordCount, template);
        } else if (currentWordCount > template.word_range[1]) {
            // Need to condense content
            return this.condenseContent(baseContent, targetWordCount, template);
        } else {
            // Content is already in range
            return baseContent;
        }
    }

    /**
     * Generate tone variant
     */
    generateToneVariant(variationType, template, baseContent, options) {
        // This would integrate with the brand validator to adjust tone
        // For now, return modified content based on tone characteristics

        let modifiedContent = baseContent;

        switch (variationType) {
            case 'professional':
                modifiedContent = this.makeProfessional(baseContent);
                break;
            case 'friendly':
                modifiedContent = this.makeFriendly(baseContent);
                break;
            case 'authoritative':
                modifiedContent = this.makeAuthoritative(baseContent);
                break;
            case 'conversational':
                modifiedContent = this.makeConversational(baseContent);
                break;
        }

        return modifiedContent;
    }

    /**
     * Generate generic variant
     */
    generateGenericVariant(variationType, template, baseContent, options) {
        // Fallback for custom test types
        return baseContent + ` [${variationType} variant]`;
    }

    /**
     * Replace placeholders in content
     */
    replacePlaceholders(content, replacements) {
        let result = content;

        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`{${key}}`, 'g');
            result = result.replace(regex, value);
        }

        return result;
    }

    /**
     * Expand content to target word count
     */
    expandContent(content, targetWordCount, template) {
        const currentWords = content.split(/\s+/);
        const wordsNeeded = targetWordCount - currentWords.length;

        if (wordsNeeded <= 0) return content;

        // Add expansion based on structure
        const structure = template.structure || [];
        let expanded = content;

        if (structure.includes('supporting_details')) {
            expanded += ' This approach provides numerous benefits including improved efficiency, cost savings, and long-term reliability.';
        }

        if (structure.includes('proof')) {
            expanded += ' Our clients consistently report satisfaction rates above 95% with measurable improvements in their systems.';
        }

        if (structure.includes('case_studies')) {
            expanded += ' For example, a recent client saw a 30% reduction in energy costs within the first month of implementation.';
        }

        return expanded;
    }

    /**
     * Condense content to target word count
     */
    condenseContent(content, targetWordCount, template) {
        const words = content.split(/\s+/);

        if (words.length <= targetWordCount) return content;

        // Remove less essential words while maintaining meaning
        const condensed = words.slice(0, targetWordCount);

        // Ensure it ends sensibly
        let result = condensed.join(' ');
        if (!result.match(/[.!?]$/)) {
            result += '.';
        }

        return result;
    }

    /**
     * Make content more professional
     */
    makeProfessional(content) {
        return content
            .replace(/\byou\b/gi, 'your organization')
            .replace(/\bwe\b/gi, 'our team')
            .replace(/\bget\b/gi, 'obtain')
            .replace(/\bbig\b/gi, 'significant');
    }

    /**
     * Make content more friendly
     */
    makeFriendly(content) {
        return content
            .replace(/\bobtain\b/gi, 'get')
            .replace(/\butilize\b/gi, 'use')
            .replace(/\bassist\b/gi, 'help')
            .replace(/(\. )([A-Z])/g, '$1We think $2');
    }

    /**
     * Make content more authoritative
     */
    makeAuthoritative(content) {
        return content
            .replace(/\bmight\b/gi, 'will')
            .replace(/\bcould\b/gi, 'can')
            .replace(/\bI think\b/gi, 'Research shows')
            .replace(/\bprobably\b/gi, 'definitely');
    }

    /**
     * Make content more conversational
     */
    makeConversational(content) {
        return content
            .replace(/\. /g, '. You know what? ')
            .replace(/(\w+)\./g, '$1, right?')
            .slice(0, -8) + '.'; // Remove the last "right?"
    }

    /**
     * Create A/B test
     */
    createABTest(testName, testType, baseContent, options = {}) {
        const testId = this.generateTestId();
        const variants = this.generateVariants(testType, baseContent, options);

        if (variants.length === 0) {
            throw new Error('No variants could be generated');
        }

        const test = {
            id: testId,
            name: testName,
            type: testType,
            hypothesis: options.hypothesis || `Testing ${testType} variations will improve engagement`,
            status: 'draft',
            created_at: new Date().toISOString(),
            creator: options.creator || 'system',
            base_content: baseContent,
            variants: variants,
            configuration: {
                traffic_split: this.calculateTrafficSplit(variants.length),
                duration_days: options.duration || this.framework.test_types[testType].test_duration_days,
                success_metrics: options.metrics || this.framework.test_types[testType].metrics,
                sample_size: options.sample_size || this.framework.test_types[testType].min_sample_size,
                confidence_level: options.confidence_level || this.framework.test_types[testType].confidence_level
            },
            results: null
        };

        this.saveTest(test);
        this.log('INFO', `Created A/B test: ${testName} (${testId})`);

        return test;
    }

    /**
     * Calculate traffic split for variants
     */
    calculateTrafficSplit(variantCount) {
        const percentage = Math.floor(100 / variantCount);
        const remainder = 100 - (percentage * variantCount);

        const splits = new Array(variantCount).fill(percentage);
        for (let i = 0; i < remainder; i++) {
            splits[i]++;
        }

        return splits;
    }

    /**
     * Save A/B test
     */
    saveTest(test) {
        const testsFile = path.join(this.testingDir, 'ab-tests.json');
        let tests = { tests: [] };

        if (fs.existsSync(testsFile)) {
            try {
                tests = JSON.parse(fs.readFileSync(testsFile, 'utf8'));
            } catch (error) {
                console.warn('Error loading existing tests, creating new file');
            }
        }

        tests.tests.push(test);
        fs.writeFileSync(testsFile, JSON.stringify(tests, null, 2));
    }

    /**
     * Save templates
     */
    saveTemplates(templates) {
        fs.writeFileSync(this.templatesFile, JSON.stringify(templates, null, 2));
    }

    /**
     * Generate unique test ID
     */
    generateTestId() {
        return 'test_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique variant ID
     */
    generateVariantId() {
        return 'var_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Hash content for comparison
     */
    hashContent(content) {
        return crypto.createHash('md5').update(content).digest('hex');
    }

    /**
     * Log events
     */
    log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level}: ${message}\n`;
        fs.appendFileSync(this.logFile, logEntry);
        console.log(logEntry.trim());
    }

    /**
     * CLI interface
     */
    static cli() {
        const generator = new VariantGenerator();
        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'generate':
                const testType = args[1];
                const content = args[2];
                const optionsJson = args[3];

                if (!testType || !content) {
                    console.error('Usage: generate <test_type> <content> [options_json]');
                    process.exit(1);
                }

                try {
                    const options = optionsJson ? JSON.parse(optionsJson) : {};
                    const variants = generator.generateVariants(testType, content, options);
                    console.log(JSON.stringify(variants, null, 2));
                } catch (error) {
                    console.error(`Error generating variants: ${error.message}`);
                }
                break;

            case 'create-test':
                const testName = args[1];
                const testType2 = args[2];
                const baseContent = args[3];
                const testOptionsJson = args[4];

                if (!testName || !testType2 || !baseContent) {
                    console.error('Usage: create-test <name> <type> <content> [options_json]');
                    process.exit(1);
                }

                try {
                    const testOptions = testOptionsJson ? JSON.parse(testOptionsJson) : {};
                    const test = generator.createABTest(testName, testType2, baseContent, testOptions);
                    console.log(JSON.stringify(test, null, 2));
                } catch (error) {
                    console.error(`Error creating test: ${error.message}`);
                }
                break;

            case 'list-types':
                if (generator.framework) {
                    console.log('Available test types:');
                    Object.keys(generator.framework.test_types).forEach(type => {
                        console.log(`  - ${type}: ${generator.framework.test_types[type].description}`);
                    });
                }
                break;

            default:
                console.log(`
A/B Testing Variant Generator

Usage:
  node variant-generator.js generate <test_type> <content> [options_json]
  node variant-generator.js create-test <name> <type> <content> [options_json]
  node variant-generator.js list-types

Examples:
  node variant-generator.js generate headline_testing "Professional HVAC Services"
  node variant-generator.js create-test "Header Test" headline_testing "Get Expert HVAC Service" '{"subject":"HVAC","target_audience":"homeowners"}'
  node variant-generator.js list-types
                `);
        }
    }
}

// Run CLI if called directly
if (require.main === module) {
    VariantGenerator.cli();
}

module.exports = VariantGenerator;