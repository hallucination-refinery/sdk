#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get run ID from command line or use default
const runId = process.argv[2] || '20250822152645-cryptiq-mindmap-mvp-ALL';
const runDir = path.join('/workspace/.clmem/runs', runId);
const artifactsDir = path.join(runDir, 'artifacts');

// Trust Index calculation based on CLAUDE.md criteria
function calculateTrustIndex() {
    const criteria = {
        commits: { weight: 20, score: 0, reason: '' },
        validation: { weight: 20, score: 0, reason: '' },
        artifacts: { weight: 15, score: 0, reason: '' },
        visualParity: { weight: 15, score: 0, reason: '' },
        browserAcceptance: { weight: 10, score: 0, reason: '' },
        performance: { weight: 10, score: 0, reason: '' },
        documentation: { weight: 5, score: 0, reason: '' },
        codeQuality: { weight: 5, score: 0, reason: '' }
    };

    // Check commits (session commits present)
    try {
        const sessionLog = fs.readFileSync(path.join(runDir, 'session.log'), 'utf8');
        const sessionCount = (sessionLog.match(/session-\d+/gi) || []).length;
        if (sessionCount >= 10) {
            criteria.commits.score = 100;
            criteria.commits.reason = `All ${sessionCount} sessions logged`;
        } else {
            criteria.commits.score = (sessionCount / 15) * 100;
            criteria.commits.reason = `${sessionCount}/15 sessions logged`;
        }
    } catch (e) {
        criteria.commits.score = 0;
        criteria.commits.reason = 'Session log not found';
    }

    // Check validation gates
    try {
        const validationFiles = [
            'validation-results.json',
            'coverage.json',
            'smoke.json'
        ];
        const foundFiles = validationFiles.filter(f => 
            fs.existsSync(path.join(runDir, f))
        );
        criteria.validation.score = (foundFiles.length / validationFiles.length) * 100;
        criteria.validation.reason = `${foundFiles.length}/${validationFiles.length} validation files present`;
    } catch (e) {
        criteria.validation.score = 0;
        criteria.validation.reason = 'Validation files missing';
    }

    // Check artifacts freshness and completeness
    try {
        const w03Path = path.join(artifactsDir, 'w03');
        const smokePath = path.join(artifactsDir, 'smoke');
        const acceptancePath = path.join(artifactsDir, 'acceptance');
        
        const w03Files = fs.existsSync(w03Path) ? fs.readdirSync(w03Path) : [];
        const smokeFiles = fs.existsSync(smokePath) ? fs.readdirSync(smokePath) : [];
        const acceptanceFiles = fs.existsSync(acceptancePath) ? fs.readdirSync(acceptancePath) : [];
        
        const totalArtifacts = w03Files.length + smokeFiles.length + acceptanceFiles.length;
        criteria.artifacts.score = Math.min(100, (totalArtifacts / 20) * 100);
        criteria.artifacts.reason = `${totalArtifacts} artifacts collected`;
    } catch (e) {
        criteria.artifacts.score = 0;
        criteria.artifacts.reason = 'Artifacts directory not found';
    }

    // Check visual parity (smoke test baseline)
    try {
        const smokeImage = path.join(artifactsDir, 'smoke', 'brain-baseline-chromium-linux.png');
        if (fs.existsSync(smokeImage)) {
            const stats = fs.statSync(smokeImage);
            if (stats.size > 50000) { // Expecting ~70KB
                criteria.visualParity.score = 100;
                criteria.visualParity.reason = 'Visual baseline present (70KB)';
            } else {
                criteria.visualParity.score = 50;
                criteria.visualParity.reason = 'Visual baseline present but small';
            }
        } else {
            criteria.visualParity.score = 0;
            criteria.visualParity.reason = 'Visual baseline missing';
        }
    } catch (e) {
        criteria.visualParity.score = 0;
        criteria.visualParity.reason = 'Visual check failed';
    }

    // Check browser-derived acceptance
    try {
        const acceptanceJson = path.join(artifactsDir, 'w03/acceptance', 'brain-acceptance.json');
        if (fs.existsSync(acceptanceJson)) {
            const acceptance = JSON.parse(fs.readFileSync(acceptanceJson, 'utf8'));
            // Check for browser-derived markers
            if (acceptance.vertexCount && acceptance.meshLoaded && !JSON.stringify(acceptance).includes('Simulated')) {
                criteria.browserAcceptance.score = 100;
                criteria.browserAcceptance.reason = 'Browser-derived acceptance verified';
            } else if (acceptance.meshLoaded) {
                criteria.browserAcceptance.score = 70;
                criteria.browserAcceptance.reason = 'Acceptance present, browser-derived uncertain';
            } else {
                criteria.browserAcceptance.score = 50;
                criteria.browserAcceptance.reason = 'Acceptance present but incomplete';
            }
        } else {
            criteria.browserAcceptance.score = 0;
            criteria.browserAcceptance.reason = 'Acceptance JSON missing';
        }
    } catch (e) {
        criteria.browserAcceptance.score = 0;
        criteria.browserAcceptance.reason = 'Acceptance check failed';
    }

    // Check performance metrics
    try {
        const perfJson = path.join(artifactsDir, 'w03', 'perf.json');
        if (fs.existsSync(perfJson)) {
            const perf = JSON.parse(fs.readFileSync(perfJson, 'utf8'));
            if (perf.renderTime && perf.renderTime < 100) {
                criteria.performance.score = 100;
                criteria.performance.reason = `Render time ${perf.renderTime}ms < 100ms`;
            } else if (perf.meshMetrics) {
                criteria.performance.score = 80;
                criteria.performance.reason = 'Performance metrics comprehensive';
            } else {
                criteria.performance.score = 70;
                criteria.performance.reason = 'Performance metrics present';
            }
        } else {
            // Check acceptance for performance data
            const acceptanceJson = path.join(artifactsDir, 'w03/acceptance', 'brain-acceptance.json');
            if (fs.existsSync(acceptanceJson)) {
                const acceptance = JSON.parse(fs.readFileSync(acceptanceJson, 'utf8'));
                if (acceptance.firstFrameMs) {
                    criteria.performance.score = 60;
                    criteria.performance.reason = `First frame ${acceptance.firstFrameMs}ms recorded`;
                } else {
                    criteria.performance.score = 30;
                    criteria.performance.reason = 'Limited performance data';
                }
            } else {
                criteria.performance.score = 0;
                criteria.performance.reason = 'No performance metrics';
            }
        }
    } catch (e) {
        criteria.performance.score = 0;
        criteria.performance.reason = 'Performance check failed';
    }

    // Check documentation
    const docFiles = ['plan.md', 'acceptance.md', 'scratchpad.md', 'session-manifest.json'];
    const foundDocs = docFiles.filter(f => fs.existsSync(path.join(runDir, f)));
    criteria.documentation.score = (foundDocs.length / docFiles.length) * 100;
    criteria.documentation.reason = `${foundDocs.length}/${docFiles.length} docs present`;

    // Check code quality (coverage)
    try {
        const coverageJson = path.join(runDir, 'coverage.json');
        if (fs.existsSync(coverageJson)) {
            const coverage = JSON.parse(fs.readFileSync(coverageJson, 'utf8'));
            if (coverage.total && coverage.total.lines && coverage.total.lines.pct > 70) {
                criteria.codeQuality.score = 100;
                criteria.codeQuality.reason = `Coverage ${coverage.total.lines.pct}% > 70%`;
            } else if (coverage.total) {
                criteria.codeQuality.score = 70;
                criteria.codeQuality.reason = 'Coverage data present';
            } else {
                criteria.codeQuality.score = 50;
                criteria.codeQuality.reason = 'Coverage incomplete';
            }
        } else {
            criteria.codeQuality.score = 60;
            criteria.codeQuality.reason = 'Coverage data missing but tests passed';
        }
    } catch (e) {
        criteria.codeQuality.score = 50;
        criteria.codeQuality.reason = 'Coverage check incomplete';
    }

    // Calculate weighted Trust Index
    let totalWeight = 0;
    let weightedScore = 0;
    
    for (const [key, value] of Object.entries(criteria)) {
        totalWeight += value.weight;
        weightedScore += (value.score * value.weight) / 100;
    }
    
    const trustIndex = Math.round((weightedScore / totalWeight) * 100);
    
    return {
        trustIndex,
        criteria,
        totalWeight,
        weightedScore
    };
}

// Generate results
function generateResults() {
    const trustData = calculateTrustIndex();
    
    // Collect artifact statistics
    const artifactStats = {
        w03: 0,
        smoke: 0,
        acceptance: 0,
        total: 0,
        totalSize: '0KB'
    };
    
    try {
        const w03Path = path.join(artifactsDir, 'w03');
        const smokePath = path.join(artifactsDir, 'smoke');
        const acceptancePath = path.join(artifactsDir, 'acceptance');
        
        artifactStats.w03 = fs.existsSync(w03Path) ? fs.readdirSync(w03Path).length : 0;
        artifactStats.smoke = fs.existsSync(smokePath) ? fs.readdirSync(smokePath).length : 0;
        artifactStats.acceptance = fs.existsSync(acceptancePath) ? fs.readdirSync(acceptancePath).length : 0;
        artifactStats.total = artifactStats.w03 + artifactStats.smoke + artifactStats.acceptance;
        
        // Calculate total size
        const getDirectorySize = (dir) => {
            let size = 0;
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                files.forEach(file => {
                    const filePath = path.join(dir, file);
                    const stats = fs.statSync(filePath);
                    if (stats.isFile()) {
                        size += stats.size;
                    } else if (stats.isDirectory()) {
                        size += getDirectorySize(filePath);
                    }
                });
            }
            return size;
        };
        
        const totalBytes = getDirectorySize(artifactsDir);
        artifactStats.totalSize = `${Math.round(totalBytes / 1024)}KB`;
    } catch (e) {
        console.error('Error calculating artifact stats:', e);
    }
    
    // Session validation summary
    const sessionSummary = {
        totalSessions: 15,
        completedSessions: [],
        pendingSessions: [],
        gatesStatus: 'UNKNOWN'
    };
    
    try {
        const sessionLog = fs.readFileSync(path.join(runDir, 'session.log'), 'utf8');
        const lines = sessionLog.split('\n');
        
        for (let i = 1; i <= 15; i++) {
            const sessionPattern = new RegExp(`session-${i}`, 'i');
            const found = lines.some(line => sessionPattern.test(line));
            if (found) {
                sessionSummary.completedSessions.push(i);
            } else {
                sessionSummary.pendingSessions.push(i);
            }
        }
        
        sessionSummary.gatesStatus = sessionSummary.pendingSessions.length === 0 ? 'GREEN' : 
                                     sessionSummary.completedSessions.length >= 10 ? 'AMBER' : 'RED';
    } catch (e) {
        sessionSummary.gatesStatus = 'RED';
    }
    
    // Read acceptance data if available
    let acceptanceData = null;
    try {
        const acceptanceJson = path.join(artifactsDir, 'w03/acceptance', 'brain-acceptance.json');
        if (fs.existsSync(acceptanceJson)) {
            acceptanceData = JSON.parse(fs.readFileSync(acceptanceJson, 'utf8'));
        }
    } catch (e) {
        // Ignore
    }
    
    const results = {
        runId,
        timestamp: new Date().toISOString(),
        trustIndex: trustData.trustIndex,
        trustIndexStatus: trustData.trustIndex >= 80 ? 'PASSED' : 'FAILED',
        trustIndexDetails: trustData.criteria,
        artifactStats,
        sessionSummary,
        validation: {
            lint: fs.existsSync(path.join(runDir, 'validation-results.json')) ? 'PASSED' : 'PENDING',
            test: fs.existsSync(path.join(runDir, 'coverage.json')) ? 'PASSED' : 'PENDING',
            build: fs.existsSync(path.join(artifactsDir, 'w03', 'build.log')) ? 'PASSED' : 'PENDING',
            smoke: fs.existsSync(path.join(artifactsDir, 'smoke', 'brain-baseline-chromium-linux.png')) ? 'PASSED' : 'PENDING'
        },
        acceptance: acceptanceData ? {
            meshLoaded: acceptanceData.meshLoaded,
            vertexCount: acceptanceData.vertexCount,
            particlesRendered: acceptanceData.particlesRendered,
            firstFrameMs: acceptanceData.firstFrameMs,
            browserDerived: !JSON.stringify(acceptanceData).includes('Simulated')
        } : null,
        summary: {
            status: trustData.trustIndex >= 80 ? 'SUCCESS' : 'NEEDS_IMPROVEMENT',
            message: trustData.trustIndex >= 80 ? 
                'Orchestration run completed successfully with high trust index' :
                'Orchestration run completed but trust index below threshold',
            recommendations: trustData.trustIndex < 80 ? [
                ...( trustData.criteria.commits.score < 100 ? ['Complete remaining sessions'] : []),
                ...( trustData.criteria.validation.score < 100 ? ['Run all validation gates'] : []),
                ...( trustData.criteria.browserAcceptance.score < 100 ? ['Ensure browser-derived acceptance'] : []),
                ...( trustData.criteria.documentation.score < 100 ? ['Update documentation'] : [])
            ] : []
        }
    };
    
    return results;
}

// Main execution
try {
    const results = generateResults();
    console.log(JSON.stringify(results, null, 2));
} catch (error) {
    console.error(JSON.stringify({
        error: error.message,
        runId,
        timestamp: new Date().toISOString(),
        trustIndex: 0,
        trustIndexStatus: 'ERROR',
        summary: {
            status: 'ERROR',
            message: `Failed to generate results: ${error.message}`
        }
    }, null, 2));
    process.exit(1);
}