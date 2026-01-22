#!/usr/bin/env node

/**
 * A/B Test Manager
 * Manages A/B test lifecycle, tracking, and results analysis
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ABTestManager {
    constructor() {
        this.testingDir = path.join(__dirname);
        this.testsFile = path.join(this.testingDir, 'ab-tests.json');
        this.resultsFile = path.join(this.testingDir, 'test-results.json');
        this.trackingFile = path.join(this.testingDir, 'test-tracking.json');
        this.logFile = path.join(this.testingDir, 'ab-test-manager.log');

        this.initializeDataFiles();
    }

    /**
     * Initialize data files if they don't exist
     */
    initializeDataFiles() {
        if (!fs.existsSync(this.testsFile)) {
            fs.writeFileSync(this.testsFile, JSON.stringify({
                tests: [],
                last_updated: new Date().toISOString()
            }, null, 2));
        }

        if (!fs.existsSync(this.resultsFile)) {
            fs.writeFileSync(this.resultsFile, JSON.stringify({
                results: [],
                summary: {
                    total_tests: 0,
                    completed_tests: 0,
                    significant_results: 0,
                    average_improvement: 0
                },
                last_updated: new Date().toISOString()
            }, null, 2));
        }

        if (!fs.existsSync(this.trackingFile)) {
            fs.writeFileSync(this.trackingFile, JSON.stringify({
                tracking_events: [],
                active_sessions: {},
                last_updated: new Date().toISOString()
            }, null, 2));
        }
    }

    /**
     * Start an A/B test
     */
    startTest(testId) {
        const tests = this.loadTests();
        const test = tests.tests.find(t => t.id === testId);

        if (!test) {
            throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'draft') {
            throw new Error(`Test ${testId} is not in draft status (current: ${test.status})`);
        }

        // Validate test configuration
        this.validateTestConfiguration(test);

        // Update test status
        test.status = 'running';
        test.start_date = new Date().toISOString();
        test.end_date = new Date(Date.now() + test.configuration.duration_days * 24 * 60 * 60 * 1000).toISOString();

        // Initialize tracking data
        test.tracking = {
            total_impressions: 0,
            total_clicks: 0,
            total_conversions: 0,
            variant_performance: test.variants.map(variant => ({
                variant_id: variant.id,
                impressions: 0,
                clicks: 0,
                conversions: 0,
                conversion_rate: 0,
                confidence_interval: null
            }))
        };

        this.saveTests(tests);
        this.log('INFO', `Started A/B test: ${test.name} (${testId})`);

        return test;
    }

    /**
     * Stop an A/B test
     */
    stopTest(testId, reason = 'Manual stop') {
        const tests = this.loadTests();
        const test = tests.tests.find(t => t.id === testId);

        if (!test) {
            throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'running') {
            throw new Error(`Test ${testId} is not running (current: ${test.status})`);
        }

        test.status = 'stopped';
        test.actual_end_date = new Date().toISOString();
        test.stop_reason = reason;

        // Analyze results
        const results = this.analyzeTestResults(test);
        test.results = results;

        // Save to results file
        this.saveTestResults(test, results);

        this.saveTests(tests);
        this.log('INFO', `Stopped A/B test: ${test.name} (${testId}) - Reason: ${reason}`);

        return test;
    }

    /**
     * Pause an A/B test
     */
    pauseTest(testId, reason = 'Manual pause') {
        const tests = this.loadTests();
        const test = tests.tests.find(t => t.id === testId);

        if (!test) {
            throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'running') {
            throw new Error(`Test ${testId} is not running (current: ${test.status})`);
        }

        test.status = 'paused';
        test.pause_date = new Date().toISOString();
        test.pause_reason = reason;

        this.saveTests(tests);
        this.log('INFO', `Paused A/B test: ${test.name} (${testId}) - Reason: ${reason}`);

        return test;
    }

    /**
     * Resume a paused A/B test
     */
    resumeTest(testId) {
        const tests = this.loadTests();
        const test = tests.tests.find(t => t.id === testId);

        if (!test) {
            throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'paused') {
            throw new Error(`Test ${testId} is not paused (current: ${test.status})`);
        }

        test.status = 'running';
        test.resume_date = new Date().toISOString();

        // Extend end date by the pause duration
        if (test.pause_date && test.end_date) {
            const pauseDuration = new Date(test.resume_date) - new Date(test.pause_date);
            const newEndDate = new Date(new Date(test.end_date).getTime() + pauseDuration);
            test.end_date = newEndDate.toISOString();
        }

        this.saveTests(tests);
        this.log('INFO', `Resumed A/B test: ${test.name} (${testId})`);

        return test;
    }

    /**
     * Record a tracking event for an A/B test
     */
    recordEvent(testId, variantId, eventType, eventData = {}) {
        const tests = this.loadTests();
        const test = tests.tests.find(t => t.id === testId);

        if (!test) {
            throw new Error(`Test ${testId} not found`);
        }

        if (test.status !== 'running') {
            // Silently ignore events for non-running tests
            return false;
        }

        const variant = test.variants.find(v => v.id === variantId);
        if (!variant) {
            throw new Error(`Variant ${variantId} not found in test ${testId}`);
        }

        // Update tracking data
        if (!test.tracking) {
            test.tracking = {
                total_impressions: 0,
                total_clicks: 0,
                total_conversions: 0,
                variant_performance: test.variants.map(v => ({
                    variant_id: v.id,
                    impressions: 0,
                    clicks: 0,
                    conversions: 0,
                    conversion_rate: 0,
                    confidence_interval: null
                }))
            };
        }

        const variantPerformance = test.tracking.variant_performance.find(vp => vp.variant_id === variantId);

        switch (eventType) {
            case 'impression':
                test.tracking.total_impressions++;
                variantPerformance.impressions++;
                break;
            case 'click':
                test.tracking.total_clicks++;
                variantPerformance.clicks++;
                break;
            case 'conversion':
                test.tracking.total_conversions++;
                variantPerformance.conversions++;
                break;
        }

        // Update conversion rate
        if (variantPerformance.impressions > 0) {
            variantPerformance.conversion_rate = (variantPerformance.conversions / variantPerformance.impressions * 100);
        }

        // Record detailed tracking event
        const trackingData = this.loadTracking();
        trackingData.tracking_events.push({
            event_id: this.generateEventId(),
            test_id: testId,
            variant_id: variantId,
            event_type: eventType,
            timestamp: new Date().toISOString(),
            data: eventData,
            session_id: eventData.session_id || null,
            user_agent: eventData.user_agent || null,
            ip_hash: eventData.ip ? this.hashIP(eventData.ip) : null
        });

        // Keep only last 10000 events to prevent file bloat
        if (trackingData.tracking_events.length > 10000) {
            trackingData.tracking_events = trackingData.tracking_events.slice(-10000);
        }

        trackingData.last_updated = new Date().toISOString();

        this.saveTests(tests);
        this.saveTracking(trackingData);

        // Check if test should auto-stop
        this.checkAutoStop(test);

        return true;
    }

    /**
     * Analyze test results
     */
    analyzeTestResults(test) {
        if (!test.tracking || !test.tracking.variant_performance) {
            return {
                status: 'insufficient_data',
                message: 'No tracking data available',
                winner: null,
                statistical_significance: false,
                confidence_level: 0
            };
        }

        const variants = test.tracking.variant_performance;
        const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);

        if (totalImpressions < test.configuration.sample_size) {
            return {
                status: 'insufficient_sample_size',
                message: `Need ${test.configuration.sample_size} impressions, got ${totalImpressions}`,
                winner: null,
                statistical_significance: false,
                confidence_level: 0,
                progress: (totalImpressions / test.configuration.sample_size * 100).toFixed(1)
            };
        }

        // Perform statistical analysis
        const statisticalResults = this.performStatisticalAnalysis(variants, test.configuration.confidence_level);

        // Determine winner
        let winner = null;
        let bestPerformance = 0;

        variants.forEach((variant, index) => {
            if (variant.conversion_rate > bestPerformance) {
                bestPerformance = variant.conversion_rate;
                winner = {
                    variant_id: variant.variant_id,
                    variant_name: test.variants[index].name,
                    conversion_rate: variant.conversion_rate,
                    improvement: index === 0 ? 0 : ((variant.conversion_rate - variants[0].conversion_rate) / variants[0].conversion_rate * 100)
                };
            }
        });

        return {
            status: 'complete',
            winner: winner,
            statistical_significance: statisticalResults.significant,
            confidence_level: statisticalResults.confidence_level,
            p_value: statisticalResults.p_value,
            lift_percentage: winner ? winner.improvement : 0,
            total_impressions: totalImpressions,
            total_conversions: variants.reduce((sum, v) => sum + v.conversions, 0),
            variant_results: variants.map((variant, index) => ({
                ...variant,
                variant_name: test.variants[index].name,
                confidence_interval: statisticalResults.confidence_intervals[index],
                sample_size_adequate: variant.impressions >= (test.configuration.sample_size / variants.length)
            })),
            insights: this.generateInsights(test, statisticalResults, winner),
            recommendations: this.generateRecommendations(test, statisticalResults, winner)
        };
    }

    /**
     * Perform statistical analysis
     */
    performStatisticalAnalysis(variants, confidenceLevel) {
        // Simplified statistical analysis
        // In production, you might want to use a proper statistics library

        if (variants.length < 2) {
            return {
                significant: false,
                confidence_level: 0,
                p_value: 1,
                confidence_intervals: variants.map(() => null)
            };
        }

        // Calculate z-scores and confidence intervals
        const controlVariant = variants[0];
        const testVariants = variants.slice(1);

        let maxZScore = 0;
        let minPValue = 1;

        const confidenceIntervals = variants.map(variant => {
            if (variant.impressions === 0) return null;

            const rate = variant.conversions / variant.impressions;
            const standardError = Math.sqrt((rate * (1 - rate)) / variant.impressions);
            const zScore = 1.96; // 95% confidence

            return {
                lower: Math.max(0, rate - zScore * standardError),
                upper: Math.min(1, rate + zScore * standardError),
                margin_of_error: zScore * standardError
            };
        });

        // Compare each test variant to control
        testVariants.forEach(variant => {
            if (variant.impressions > 0 && controlVariant.impressions > 0) {
                const p1 = controlVariant.conversions / controlVariant.impressions;
                const p2 = variant.conversions / variant.impressions;
                const n1 = controlVariant.impressions;
                const n2 = variant.impressions;

                const pooledP = (controlVariant.conversions + variant.conversions) / (n1 + n2);
                const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));

                if (standardError > 0) {
                    const zScore = Math.abs(p2 - p1) / standardError;
                    const pValue = 2 * (1 - this.normalCDF(zScore));

                    maxZScore = Math.max(maxZScore, zScore);
                    minPValue = Math.min(minPValue, pValue);
                }
            }
        });

        const alphaLevel = (100 - confidenceLevel) / 100;
        const significant = minPValue < alphaLevel;

        return {
            significant: significant,
            confidence_level: confidenceLevel,
            p_value: minPValue,
            z_score: maxZScore,
            confidence_intervals: confidenceIntervals
        };
    }

    /**
     * Normal cumulative distribution function approximation
     */
    normalCDF(x) {
        // Approximation of the normal CDF
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    /**
     * Error function approximation
     */
    erf(x) {
        // Abramowitz and Stegun approximation
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    /**
     * Generate insights from test results
     */
    generateInsights(test, statisticalResults, winner) {
        const insights = [];

        if (winner && winner.improvement > 0) {
            insights.push(`The winning variant improved conversion rate by ${winner.improvement.toFixed(2)}%`);
        }

        if (statisticalResults.significant) {
            insights.push(`Results are statistically significant at ${statisticalResults.confidence_level}% confidence level`);
        } else {
            insights.push('Results are not statistically significant - more data may be needed');
        }

        if (test.tracking.total_impressions < test.configuration.sample_size) {
            insights.push('Sample size was below the target - consider running longer tests');
        }

        return insights;
    }

    /**
     * Generate recommendations from test results
     */
    generateRecommendations(test, statisticalResults, winner) {
        const recommendations = [];

        if (statisticalResults.significant && winner && winner.improvement > 5) {
            recommendations.push({
                type: 'implement_winner',
                priority: 'high',
                action: `Implement the winning variant: ${winner.variant_name}`,
                expected_impact: `${winner.improvement.toFixed(2)}% improvement in conversion rate`
            });
        } else if (!statisticalResults.significant) {
            recommendations.push({
                type: 'inconclusive_results',
                priority: 'medium',
                action: 'Consider running the test longer or with larger traffic allocation',
                expected_impact: 'Better statistical power for future tests'
            });
        }

        if (test.tracking.total_impressions < test.configuration.sample_size) {
            recommendations.push({
                type: 'sample_size',
                priority: 'medium',
                action: 'Increase traffic allocation or test duration for future tests',
                expected_impact: 'More reliable statistical results'
            });
        }

        recommendations.push({
            type: 'follow_up',
            priority: 'low',
            action: `Test additional variations of ${test.type}`,
            expected_impact: 'Continuous optimization and learning'
        });

        return recommendations;
    }

    /**
     * Check if test should auto-stop
     */
    checkAutoStop(test) {
        // Check if test duration has been reached
        if (test.end_date && new Date() > new Date(test.end_date)) {
            this.stopTest(test.id, 'Duration reached');
            return;
        }

        // Check if minimum sample size is reached and results are significant
        if (test.tracking.total_impressions >= test.configuration.sample_size) {
            const results = this.analyzeTestResults(test);
            if (results.statistical_significance) {
                this.stopTest(test.id, 'Statistical significance reached');
                return;
            }
        }
    }

    /**
     * Get test summary
     */
    getTestSummary() {
        const tests = this.loadTests();
        const results = this.loadResults();

        const summary = {
            total_tests: tests.tests.length,
            active_tests: tests.tests.filter(t => t.status === 'running').length,
            completed_tests: tests.tests.filter(t => t.status === 'stopped').length,
            draft_tests: tests.tests.filter(t => t.status === 'draft').length,
            significant_results: results.results.filter(r => r.statistical_significance).length,
            average_improvement: 0,
            last_updated: new Date().toISOString()
        };

        // Calculate average improvement for significant tests
        const significantResults = results.results.filter(r => r.statistical_significance && r.lift_percentage > 0);
        if (significantResults.length > 0) {
            summary.average_improvement = significantResults.reduce((sum, r) => sum + r.lift_percentage, 0) / significantResults.length;
        }

        return summary;
    }

    /**
     * Validate test configuration
     */
    validateTestConfiguration(test) {
        if (!test.variants || test.variants.length < 2) {
            throw new Error('Test must have at least 2 variants');
        }

        if (!test.configuration.sample_size || test.configuration.sample_size < 100) {
            throw new Error('Sample size must be at least 100');
        }

        if (!test.configuration.duration_days || test.configuration.duration_days < 1) {
            throw new Error('Duration must be at least 1 day');
        }
    }

    /**
     * Save test results
     */
    saveTestResults(test, results) {
        const resultsData = this.loadResults();

        resultsData.results.push({
            test_id: test.id,
            test_name: test.name,
            test_type: test.type,
            completed_at: new Date().toISOString(),
            duration_days: Math.ceil((new Date() - new Date(test.start_date)) / (1000 * 60 * 60 * 24)),
            ...results
        });

        // Update summary
        resultsData.summary = this.getTestSummary();
        resultsData.last_updated = new Date().toISOString();

        this.saveResults(resultsData);
    }

    // File operations
    loadTests() {
        return JSON.parse(fs.readFileSync(this.testsFile, 'utf8'));
    }

    saveTests(data) {
        data.last_updated = new Date().toISOString();
        fs.writeFileSync(this.testsFile, JSON.stringify(data, null, 2));
    }

    loadResults() {
        return JSON.parse(fs.readFileSync(this.resultsFile, 'utf8'));
    }

    saveResults(data) {
        fs.writeFileSync(this.resultsFile, JSON.stringify(data, null, 2));
    }

    loadTracking() {
        return JSON.parse(fs.readFileSync(this.trackingFile, 'utf8'));
    }

    saveTracking(data) {
        fs.writeFileSync(this.trackingFile, JSON.stringify(data, null, 2));
    }

    generateEventId() {
        return 'evt_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashIP(ip) {
        return crypto.createHash('sha256').update(ip + 'salt').digest('hex').substr(0, 16);
    }

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
        const manager = new ABTestManager();
        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'start':
                const testId = args[1];
                if (!testId) {
                    console.error('Usage: start <test_id>');
                    process.exit(1);
                }
                try {
                    const test = manager.startTest(testId);
                    console.log(`Test started: ${test.name}`);
                } catch (error) {
                    console.error(`Error starting test: ${error.message}`);
                }
                break;

            case 'stop':
                const stopTestId = args[1];
                const reason = args[2] || 'Manual stop';
                if (!stopTestId) {
                    console.error('Usage: stop <test_id> [reason]');
                    process.exit(1);
                }
                try {
                    const test = manager.stopTest(stopTestId, reason);
                    console.log(`Test stopped: ${test.name}`);
                    if (test.results) {
                        console.log(JSON.stringify(test.results, null, 2));
                    }
                } catch (error) {
                    console.error(`Error stopping test: ${error.message}`);
                }
                break;

            case 'record':
                const recordTestId = args[1];
                const variantId = args[2];
                const eventType = args[3];
                const eventDataJson = args[4];

                if (!recordTestId || !variantId || !eventType) {
                    console.error('Usage: record <test_id> <variant_id> <event_type> [event_data_json]');
                    process.exit(1);
                }

                try {
                    const eventData = eventDataJson ? JSON.parse(eventDataJson) : {};
                    const success = manager.recordEvent(recordTestId, variantId, eventType, eventData);
                    console.log(success ? 'Event recorded' : 'Event ignored (test not active)');
                } catch (error) {
                    console.error(`Error recording event: ${error.message}`);
                }
                break;

            case 'analyze':
                const analyzeTestId = args[1];
                if (!analyzeTestId) {
                    console.error('Usage: analyze <test_id>');
                    process.exit(1);
                }
                try {
                    const tests = manager.loadTests();
                    const test = tests.tests.find(t => t.id === analyzeTestId);
                    if (!test) {
                        console.error('Test not found');
                        process.exit(1);
                    }
                    const results = manager.analyzeTestResults(test);
                    console.log(JSON.stringify(results, null, 2));
                } catch (error) {
                    console.error(`Error analyzing test: ${error.message}`);
                }
                break;

            case 'list':
                const tests = manager.loadTests();
                console.log('A/B Tests:');
                tests.tests.forEach(test => {
                    console.log(`  ${test.id}: ${test.name} (${test.status})`);
                });
                break;

            case 'summary':
                const summary = manager.getTestSummary();
                console.log(JSON.stringify(summary, null, 2));
                break;

            default:
                console.log(`
A/B Test Manager

Usage:
  node ab-test-manager.js start <test_id>
  node ab-test-manager.js stop <test_id> [reason]
  node ab-test-manager.js record <test_id> <variant_id> <event_type> [event_data]
  node ab-test-manager.js analyze <test_id>
  node ab-test-manager.js list
  node ab-test-manager.js summary

Event Types: impression, click, conversion
                `);
        }
    }
}

// Run CLI if called directly
if (require.main === module) {
    ABTestManager.cli();
}

module.exports = ABTestManager;