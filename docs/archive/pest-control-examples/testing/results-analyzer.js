#!/usr/bin/env node

/**
 * A/B Testing Results Analyzer
 * Advanced statistical analysis and reporting for A/B test results
 */

const fs = require('fs');
const path = require('path');

class ResultsAnalyzer {
    constructor() {
        this.testingDir = path.join(__dirname);
        this.testsFile = path.join(this.testingDir, 'ab-tests.json');
        this.resultsFile = path.join(this.testingDir, 'test-results.json');
        this.analysisFile = path.join(this.testingDir, 'analysis-reports.json');
        this.logFile = path.join(this.testingDir, 'results-analyzer.log');

        this.significanceLevels = [0.10, 0.05, 0.01];
        this.effectSizeThresholds = {
            small: 0.2,
            medium: 0.5,
            large: 0.8
        };
    }

    /**
     * Perform comprehensive statistical analysis
     */
    analyzeTest(testId, options = {}) {
        const tests = this.loadTests();
        const test = tests.tests.find(t => t.id === testId);

        if (!test) {
            throw new Error(`Test ${testId} not found`);
        }

        if (!test.tracking || !test.tracking.variant_performance) {
            throw new Error(`No tracking data available for test ${testId}`);
        }

        const analysis = {
            test_id: testId,
            test_name: test.name,
            analysis_date: new Date().toISOString(),
            test_duration: this.calculateTestDuration(test),
            sample_size_analysis: this.analyzeSampleSize(test),
            statistical_analysis: this.performAdvancedStatistics(test),
            effect_size_analysis: this.analyzeEffectSize(test),
            confidence_intervals: this.calculateConfidenceIntervals(test),
            power_analysis: this.performPowerAnalysis(test),
            practical_significance: this.assessPracticalSignificance(test),
            recommendations: this.generateDetailedRecommendations(test),
            insights: this.extractInsights(test),
            meta_analysis: this.performMetaAnalysis(test, options)
        };

        this.saveAnalysis(analysis);
        this.log('INFO', `Completed analysis for test: ${test.name}`);

        return analysis;
    }

    /**
     * Calculate test duration
     */
    calculateTestDuration(test) {
        if (!test.start_date) return { days: 0, status: 'not_started' };

        const startDate = new Date(test.start_date);
        const endDate = test.actual_end_date ? new Date(test.actual_end_date) : new Date();
        const durationMs = endDate - startDate;
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

        return {
            days: durationDays,
            planned_days: test.configuration ? test.configuration.duration_days : null,
            status: test.status,
            completion_percentage: test.configuration
                ? Math.min(100, (durationDays / test.configuration.duration_days) * 100)
                : null
        };
    }

    /**
     * Analyze sample size adequacy
     */
    analyzeSampleSize(test) {
        const variants = test.tracking.variant_performance;
        const totalSample = variants.reduce((sum, v) => sum + v.impressions, 0);
        const targetSample = test.configuration ? test.configuration.sample_size : 1000;

        const analysis = {
            total_sample_size: totalSample,
            target_sample_size: targetSample,
            sample_adequacy: totalSample >= targetSample,
            completion_percentage: (totalSample / targetSample * 100).toFixed(1),
            per_variant_analysis: variants.map((variant, index) => {
                const expectedPerVariant = targetSample / variants.length;
                return {
                    variant_id: variant.variant_id,
                    sample_size: variant.impressions,
                    expected_size: expectedPerVariant,
                    adequacy: variant.impressions >= expectedPerVariant * 0.8, // 80% threshold
                    completion_percentage: (variant.impressions / expectedPerVariant * 100).toFixed(1)
                };
            })
        };

        // Sample size recommendations
        if (totalSample < targetSample) {
            const additionalSampleNeeded = targetSample - totalSample;
            analysis.recommendations = [
                `Need ${additionalSampleNeeded} more samples to reach target`,
                `Current sample provides ${this.calculateStatisticalPower(totalSample, variants.length).toFixed(1)}% power`
            ];
        }

        return analysis;
    }

    /**
     * Perform advanced statistical analysis
     */
    performAdvancedStatistics(test) {
        const variants = test.tracking.variant_performance;

        if (variants.length < 2) {
            return { error: 'Need at least 2 variants for statistical analysis' };
        }

        const controlVariant = variants[0];
        const testVariants = variants.slice(1);

        const analysis = {
            test_type: 'two_sample_proportion_test',
            variants_compared: variants.length,
            multiple_testing_correction: variants.length > 2 ? 'bonferroni' : 'none',
            statistical_tests: []
        };

        // Perform pairwise comparisons
        testVariants.forEach((testVariant, index) => {
            const comparison = this.performProportionTest(controlVariant, testVariant);
            comparison.comparison_name = `Control vs Variant ${index + 2}`;
            comparison.variant_ids = [controlVariant.variant_id, testVariant.variant_id];

            // Apply multiple testing correction
            if (analysis.multiple_testing_correction === 'bonferroni') {
                comparison.corrected_p_value = Math.min(1, comparison.p_value * testVariants.length);
                comparison.corrected_significant = comparison.corrected_p_value < 0.05;
            }

            analysis.statistical_tests.push(comparison);
        });

        // Overall test result
        const significantTests = analysis.statistical_tests.filter(t =>
            analysis.multiple_testing_correction === 'bonferroni'
                ? t.corrected_significant
                : t.significant
        );

        analysis.overall_result = {
            any_significant_difference: significantTests.length > 0,
            number_of_significant_comparisons: significantTests.length,
            strongest_effect: this.findStrongestEffect(analysis.statistical_tests),
            family_wise_error_rate: this.calculateFamilyWiseErrorRate(testVariants.length)
        };

        return analysis;
    }

    /**
     * Perform two-sample proportion test
     */
    performProportionTest(control, test) {
        const n1 = control.impressions;
        const n2 = test.impressions;
        const x1 = control.conversions;
        const x2 = test.conversions;

        if (n1 === 0 || n2 === 0) {
            return {
                test_type: 'two_sample_proportion_test',
                sample_sizes: [n1, n2],
                conversions: [x1, x2],
                error: 'Insufficient sample size',
                significant: false,
                p_value: 1
            };
        }

        const p1 = x1 / n1;
        const p2 = x2 / n2;
        const pooledP = (x1 + x2) / (n1 + n2);

        // Standard error for difference in proportions
        const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));

        // Z-statistic
        const z = se > 0 ? (p2 - p1) / se : 0;

        // Two-tailed p-value
        const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));

        // Effect size (Cohen's h for proportions)
        const cohensH = 2 * (Math.asin(Math.sqrt(p2)) - Math.asin(Math.sqrt(p1)));

        return {
            test_type: 'two_sample_proportion_test',
            sample_sizes: [n1, n2],
            conversions: [x1, x2],
            conversion_rates: [p1, p2],
            pooled_rate: pooledP,
            difference: p2 - p1,
            relative_difference: p1 > 0 ? ((p2 - p1) / p1) : 0,
            standard_error: se,
            z_statistic: z,
            p_value: pValue,
            significant: pValue < 0.05,
            effect_size_cohens_h: cohensH,
            effect_size_interpretation: this.interpretEffectSize(Math.abs(cohensH)),
            degrees_of_freedom: null // Not applicable for z-test
        };
    }

    /**
     * Analyze effect size
     */
    analyzeEffectSize(test) {
        const variants = test.tracking.variant_performance;
        const controlVariant = variants[0];

        const analysis = {
            baseline_conversion_rate: controlVariant.conversions / controlVariant.impressions,
            effect_sizes: [],
            practical_significance_threshold: 0.05, // 5% minimum meaningful difference
            business_impact_estimates: []
        };

        variants.slice(1).forEach((variant, index) => {
            const controlRate = controlVariant.conversions / controlVariant.impressions;
            const variantRate = variant.conversions / variant.impressions;

            const absoluteDifference = variantRate - controlRate;
            const relativeDifference = controlRate > 0 ? absoluteDifference / controlRate : 0;
            const cohensH = 2 * (Math.asin(Math.sqrt(variantRate)) - Math.asin(Math.sqrt(controlRate)));

            const effectSize = {
                variant_id: variant.variant_id,
                variant_name: `Variant ${index + 2}`,
                absolute_difference: absoluteDifference,
                relative_difference: relativeDifference,
                percentage_lift: relativeDifference * 100,
                cohens_h: cohensH,
                interpretation: this.interpretEffectSize(Math.abs(cohensH)),
                practically_significant: Math.abs(relativeDifference) >= analysis.practical_significance_threshold,
                direction: absoluteDifference > 0 ? 'positive' : 'negative'
            };

            analysis.effect_sizes.push(effectSize);

            // Business impact estimation
            const monthlyVisitors = 10000; // Placeholder - should be configurable
            const monthlyConversions = monthlyVisitors * controlRate;
            const projectedIncrease = monthlyVisitors * absoluteDifference;

            analysis.business_impact_estimates.push({
                variant_id: variant.variant_id,
                monthly_visitor_assumption: monthlyVisitors,
                current_monthly_conversions: Math.round(monthlyConversions),
                projected_additional_conversions: Math.round(projectedIncrease),
                percentage_improvement: (relativeDifference * 100).toFixed(2)
            });
        });

        return analysis;
    }

    /**
     * Calculate confidence intervals
     */
    calculateConfidenceIntervals(test) {
        const variants = test.tracking.variant_performance;
        const confidenceLevels = [90, 95, 99];

        return variants.map(variant => {
            const n = variant.impressions;
            const x = variant.conversions;
            const p = x / n;

            if (n === 0) {
                return {
                    variant_id: variant.variant_id,
                    sample_size: n,
                    conversion_rate: 0,
                    confidence_intervals: confidenceLevels.map(level => ({
                        confidence_level: level,
                        lower_bound: 0,
                        upper_bound: 0,
                        margin_of_error: 0
                    }))
                };
            }

            const intervals = confidenceLevels.map(level => {
                const alpha = (100 - level) / 100;
                const zScore = this.getZScore(1 - alpha / 2);
                const marginOfError = zScore * Math.sqrt(p * (1 - p) / n);

                return {
                    confidence_level: level,
                    lower_bound: Math.max(0, p - marginOfError),
                    upper_bound: Math.min(1, p + marginOfError),
                    margin_of_error: marginOfError
                };
            });

            return {
                variant_id: variant.variant_id,
                sample_size: n,
                conversion_rate: p,
                confidence_intervals: intervals
            };
        });
    }

    /**
     * Perform power analysis
     */
    performPowerAnalysis(test) {
        const variants = test.tracking.variant_performance;
        const controlVariant = variants[0];
        const alpha = 0.05;

        if (controlVariant.impressions === 0) {
            return { error: 'No control group data available' };
        }

        const controlRate = controlVariant.conversions / controlVariant.impressions;

        const powerAnalysis = {
            current_power: [],
            recommended_sample_sizes: [],
            minimum_detectable_effects: []
        };

        variants.slice(1).forEach((variant, index) => {
            const n1 = controlVariant.impressions;
            const n2 = variant.impressions;
            const p1 = controlRate;
            const p2 = variant.conversions / variant.impressions;

            // Current power calculation
            const currentPower = this.calculatePower(n1, n2, p1, p2, alpha);

            powerAnalysis.current_power.push({
                variant_id: variant.variant_id,
                sample_size_1: n1,
                sample_size_2: n2,
                power: currentPower,
                adequate_power: currentPower >= 0.8
            });

            // Recommended sample sizes for different effect sizes
            const effectSizes = [0.01, 0.02, 0.05, 0.10]; // 1%, 2%, 5%, 10% improvements
            const recommendations = effectSizes.map(effectSize => {
                const targetP2 = p1 * (1 + effectSize);
                const requiredN = this.calculateRequiredSampleSize(p1, targetP2, alpha, 0.8);

                return {
                    target_improvement: (effectSize * 100).toFixed(1) + '%',
                    required_sample_size_per_variant: Math.ceil(requiredN),
                    required_total_sample_size: Math.ceil(requiredN * 2)
                };
            });

            powerAnalysis.recommended_sample_sizes.push({
                variant_id: variant.variant_id,
                recommendations: recommendations
            });

            // Minimum detectable effect with current sample size
            const mde = this.calculateMinimumDetectableEffect(n1, n2, p1, alpha, 0.8);

            powerAnalysis.minimum_detectable_effects.push({
                variant_id: variant.variant_id,
                minimum_detectable_effect: mde,
                percentage_improvement: (mde * 100).toFixed(2) + '%'
            });
        });

        return powerAnalysis;
    }

    /**
     * Assess practical significance
     */
    assessPracticalSignificance(test) {
        const variants = test.tracking.variant_performance;
        const controlVariant = variants[0];
        const controlRate = controlVariant.conversions / controlVariant.impressions;

        const assessment = {
            business_context: {
                minimum_meaningful_improvement: 0.05, // 5% relative improvement
                cost_of_implementation: 'low', // placeholder
                potential_revenue_impact: 'medium' // placeholder
            },
            variant_assessments: []
        };

        variants.slice(1).forEach((variant, index) => {
            const variantRate = variant.conversions / variant.impressions;
            const relativeImprovement = controlRate > 0 ? (variantRate - controlRate) / controlRate : 0;

            const variantAssessment = {
                variant_id: variant.variant_id,
                statistical_significance: this.performProportionTest(controlVariant, variant).significant,
                practical_significance: Math.abs(relativeImprovement) >= assessment.business_context.minimum_meaningful_improvement,
                relative_improvement: relativeImprovement,
                recommendation: 'evaluate',
                reasoning: []
            };

            // Generate reasoning
            if (variantAssessment.statistical_significance && variantAssessment.practical_significance) {
                variantAssessment.recommendation = 'implement';
                variantAssessment.reasoning.push('Both statistically and practically significant');
            } else if (variantAssessment.statistical_significance && !variantAssessment.practical_significance) {
                variantAssessment.recommendation = 'monitor';
                variantAssessment.reasoning.push('Statistically significant but improvement too small');
            } else if (!variantAssessment.statistical_significance && variantAssessment.practical_significance) {
                variantAssessment.recommendation = 'extend_test';
                variantAssessment.reasoning.push('Potentially meaningful but needs more data');
            } else {
                variantAssessment.recommendation = 'abandon';
                variantAssessment.reasoning.push('Neither statistically nor practically significant');
            }

            assessment.variant_assessments.push(variantAssessment);
        });

        return assessment;
    }

    /**
     * Generate detailed recommendations
     */
    generateDetailedRecommendations(test) {
        const variants = test.tracking.variant_performance;
        const analysis = this.performAdvancedStatistics(test);
        const effectSizes = this.analyzeEffectSize(test);
        const practicalAssessment = this.assessPracticalSignificance(test);

        const recommendations = {
            immediate_actions: [],
            strategic_considerations: [],
            future_testing: [],
            implementation_plan: []
        };

        // Immediate actions
        if (analysis.overall_result && analysis.overall_result.any_significant_difference) {
            const bestVariant = this.findBestPerformingVariant(variants);
            recommendations.immediate_actions.push({
                priority: 'high',
                action: 'implement_winner',
                details: `Implement ${bestVariant.name} as it shows significant improvement`,
                expected_impact: `${(bestVariant.improvement * 100).toFixed(2)}% increase in conversion rate`
            });
        } else {
            recommendations.immediate_actions.push({
                priority: 'medium',
                action: 'continue_analysis',
                details: 'No statistically significant difference found',
                expected_impact: 'Need more data or different approach'
            });
        }

        // Strategic considerations
        recommendations.strategic_considerations.push({
            consideration: 'long_term_effects',
            details: 'Monitor long-term performance to ensure sustained improvement',
            importance: 'high'
        });

        if (test.type === 'headline_testing') {
            recommendations.strategic_considerations.push({
                consideration: 'brand_consistency',
                details: 'Ensure winning variant aligns with overall brand voice',
                importance: 'medium'
            });
        }

        // Future testing recommendations
        const testTypes = ['headline_testing', 'cta_testing', 'content_length', 'tone_variations'];
        const currentType = test.type;
        const nextTestTypes = testTypes.filter(type => type !== currentType);

        recommendations.future_testing.push({
            test_type: nextTestTypes[0] || 'follow_up_test',
            rationale: 'Continue optimization in different areas',
            priority: 'medium',
            suggested_duration: '14 days',
            suggested_sample_size: Math.max(1000, variants.reduce((sum, v) => sum + v.impressions, 0))
        });

        // Implementation plan
        if (analysis.overall_result && analysis.overall_result.any_significant_difference) {
            recommendations.implementation_plan = [
                {
                    phase: 'preparation',
                    timeline: '1-2 days',
                    actions: ['Prepare winning variant for deployment', 'Set up monitoring systems']
                },
                {
                    phase: 'gradual_rollout',
                    timeline: '1 week',
                    actions: ['Deploy to 25% of traffic', 'Monitor key metrics', 'Check for any negative impacts']
                },
                {
                    phase: 'full_deployment',
                    timeline: '1-2 weeks',
                    actions: ['Roll out to 100% of traffic', 'Update analytics baselines', 'Document learnings']
                }
            ];
        }

        return recommendations;
    }

    /**
     * Extract insights from test data
     */
    extractInsights(test) {
        const variants = test.tracking.variant_performance;
        const insights = {
            data_quality: this.assessDataQuality(test),
            user_behavior: this.analyzeUserBehavior(test),
            performance_patterns: this.identifyPerformancePatterns(test),
            learnings: this.extractLearnings(test)
        };

        return insights;
    }

    /**
     * Assess data quality
     */
    assessDataQuality(test) {
        const variants = test.tracking.variant_performance;
        const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);

        return {
            sample_size_adequacy: totalImpressions >= (test.configuration?.sample_size || 1000),
            traffic_distribution: this.analyzeTrafficDistribution(variants),
            data_completeness: variants.every(v => v.impressions > 0),
            outlier_detection: this.detectOutliers(variants),
            quality_score: this.calculateDataQualityScore(test)
        };
    }

    /**
     * Analyze traffic distribution
     */
    analyzeTrafficDistribution(variants) {
        const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);
        const expectedPercentage = 100 / variants.length;

        const distribution = variants.map(variant => {
            const actualPercentage = totalImpressions > 0 ? (variant.impressions / totalImpressions) * 100 : 0;
            const deviation = Math.abs(actualPercentage - expectedPercentage);

            return {
                variant_id: variant.variant_id,
                expected_percentage: expectedPercentage,
                actual_percentage: actualPercentage,
                deviation: deviation,
                acceptable: deviation <= 10 // Within 10% is acceptable
            };
        });

        const isBalanced = distribution.every(d => d.acceptable);

        return {
            is_balanced: isBalanced,
            max_deviation: Math.max(...distribution.map(d => d.deviation)),
            distribution_details: distribution
        };
    }

    /**
     * Calculate statistical power
     */
    calculatePower(n1, n2, p1, p2, alpha) {
        if (n1 === 0 || n2 === 0) return 0;

        const pooledP = (n1 * p1 + n2 * p2) / (n1 + n2);
        const se1 = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
        const se2 = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);

        if (se2 === 0) return 0;

        const zAlpha = this.getZScore(1 - alpha / 2);
        const zBeta = (Math.abs(p2 - p1) - zAlpha * se1) / se2;

        return this.normalCDF(zBeta);
    }

    /**
     * Calculate required sample size
     */
    calculateRequiredSampleSize(p1, p2, alpha, power) {
        const zAlpha = this.getZScore(1 - alpha / 2);
        const zBeta = this.getZScore(power);

        const pBar = (p1 + p2) / 2;
        const numerator = (zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2;
        const denominator = (p2 - p1) ** 2;

        return denominator > 0 ? numerator / denominator : Infinity;
    }

    /**
     * Statistical utility functions
     */
    normalCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
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

    getZScore(probability) {
        // Approximate inverse normal CDF
        if (probability <= 0 || probability >= 1) {
            throw new Error('Probability must be between 0 and 1');
        }

        // Use rational approximation for inverse normal
        const c0 = 2.515517;
        const c1 = 0.802853;
        const c2 = 0.010328;
        const d1 = 1.432788;
        const d2 = 0.189269;
        const d3 = 0.001308;

        let t, z;

        if (probability > 0.5) {
            t = Math.sqrt(-2 * Math.log(1 - probability));
            z = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
        } else {
            t = Math.sqrt(-2 * Math.log(probability));
            z = -(t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
        }

        return z;
    }

    interpretEffectSize(cohensH) {
        if (cohensH < 0.2) return 'small';
        if (cohensH < 0.5) return 'medium';
        return 'large';
    }

    // Placeholder methods - implement based on specific needs
    performMetaAnalysis(test, options) {
        return { note: 'Meta-analysis requires historical test data' };
    }

    calculateStatisticalPower(sampleSize, variants) {
        return 80; // Placeholder
    }

    findStrongestEffect(tests) {
        return tests.reduce((max, test) =>
            Math.abs(test.relative_difference || 0) > Math.abs(max.relative_difference || 0) ? test : max,
            { relative_difference: 0 }
        );
    }

    calculateFamilyWiseErrorRate(numTests) {
        return 1 - Math.pow(0.95, numTests);
    }

    findBestPerformingVariant(variants) {
        return variants.reduce((best, variant, index) => {
            const rate = variant.conversions / variant.impressions;
            if (rate > best.rate) {
                return {
                    ...variant,
                    rate: rate,
                    name: `Variant ${index + 1}`,
                    improvement: index === 0 ? 0 : (rate - variants[0].conversions / variants[0].impressions) / (variants[0].conversions / variants[0].impressions)
                };
            }
            return best;
        }, { rate: 0 });
    }

    analyzeUserBehavior(test) {
        return { note: 'User behavior analysis requires detailed event tracking' };
    }

    identifyPerformancePatterns(test) {
        return { note: 'Pattern analysis requires time-series data' };
    }

    extractLearnings(test) {
        return [`Test type: ${test.type} completed`, 'Consider follow-up tests'];
    }

    detectOutliers(variants) {
        return { outliers_detected: false, details: [] };
    }

    calculateDataQualityScore(test) {
        return 85; // Placeholder score out of 100
    }

    calculateMinimumDetectableEffect(n1, n2, p1, alpha, power) {
        return 0.05; // Placeholder 5% minimum detectable effect
    }

    // File operations
    loadTests() {
        return JSON.parse(fs.readFileSync(this.testsFile, 'utf8'));
    }

    saveAnalysis(analysis) {
        let analysisData = { analyses: [] };

        if (fs.existsSync(this.analysisFile)) {
            try {
                analysisData = JSON.parse(fs.readFileSync(this.analysisFile, 'utf8'));
            } catch (error) {
                console.warn('Error loading existing analyses, creating new file');
            }
        }

        analysisData.analyses.push(analysis);

        // Keep only last 100 analyses
        if (analysisData.analyses.length > 100) {
            analysisData.analyses = analysisData.analyses.slice(-100);
        }

        fs.writeFileSync(this.analysisFile, JSON.stringify(analysisData, null, 2));
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
        const analyzer = new ResultsAnalyzer();
        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'analyze':
                const testId = args[1];
                if (!testId) {
                    console.error('Usage: analyze <test_id>');
                    process.exit(1);
                }
                try {
                    const analysis = analyzer.analyzeTest(testId);
                    console.log(JSON.stringify(analysis, null, 2));
                } catch (error) {
                    console.error(`Error analyzing test: ${error.message}`);
                }
                break;

            case 'list-analyses':
                try {
                    const analysisData = JSON.parse(fs.readFileSync(analyzer.analysisFile, 'utf8'));
                    console.log('Recent Analyses:');
                    analysisData.analyses.slice(-10).forEach(analysis => {
                        console.log(`  ${analysis.test_id}: ${analysis.test_name} (${analysis.analysis_date})`);
                    });
                } catch (error) {
                    console.log('No analyses found');
                }
                break;

            case 'power-analysis':
                const powerTestId = args[1];
                if (!powerTestId) {
                    console.error('Usage: power-analysis <test_id>');
                    process.exit(1);
                }
                try {
                    const tests = analyzer.loadTests();
                    const test = tests.tests.find(t => t.id === powerTestId);
                    if (!test) {
                        console.error('Test not found');
                        process.exit(1);
                    }
                    const powerAnalysis = analyzer.performPowerAnalysis(test);
                    console.log(JSON.stringify(powerAnalysis, null, 2));
                } catch (error) {
                    console.error(`Error performing power analysis: ${error.message}`);
                }
                break;

            default:
                console.log(`
A/B Testing Results Analyzer

Usage:
  node results-analyzer.js analyze <test_id>
  node results-analyzer.js list-analyses
  node results-analyzer.js power-analysis <test_id>

Features:
  • Advanced statistical analysis
  • Effect size calculations
  • Confidence intervals
  • Power analysis
  • Practical significance assessment
  • Detailed recommendations
                `);
        }
    }
}

// Run CLI if called directly
if (require.main === module) {
    ResultsAnalyzer.cli();
}

module.exports = ResultsAnalyzer;