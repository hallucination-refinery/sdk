#!/usr/bin/env node
/* eslint-env node */
import process from 'node:process';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const DOCS_ROOT_DEFAULT = 'docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs';

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [rawKey, rawValue] = arg.includes('=') ? arg.slice(2).split(/=(.*)/, 2) : [arg.slice(2), undefined];
    const key = rawKey.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    if (rawValue !== undefined) {
      options[key] = rawValue;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      options[key] = next;
      i += 1;
    } else {
      options[key] = true;
    }
  }
  return options;
}

function getDateTag() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toPassFail(value) {
  return value ? 'PASS' : 'FAIL';
}

function asRelative(targetPath, baseDir) {
  return path.relative(baseDir, targetPath).replace(/\\/g, '/') || path.basename(targetPath);
}

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function buildGateLines(gates) {
  if (!gates) return [];
  const entries = Object.entries(gates);
  return entries.map(([key, value]) => `- ${key}: ${toPassFail(Boolean(value))}`);
}

function buildImageLines(metrics) {
  if (!metrics) return [];
  const items = [
    ['nonBlackPercent', metrics.nonBlackPercent],
    ['averageLuminance', metrics.averageLuminance],
    ['luminanceStddev', metrics.luminanceStddev],
    ['maxLuminance', metrics.maxLuminance],
  ];
  return items
    .filter(([, value]) => typeof value === 'number' && Number.isFinite(value))
    .map(([label, value]) => `- ${label}: ${value.toFixed(4)}`);
}

async function appendSection(filePath, content) {
  const prefix = content.startsWith('\n') ? '' : '\n';
  await fs.appendFile(filePath, `${prefix}${content}`);
}

async function resolveGitValue(args) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd: process.cwd() });
    return stdout.trim();
  } catch {
    return null;
  }
}

function sanitizeAnchor(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildNotesSummary(dateTag, mode, gates, evidenceRel) {
  const gateSummary = Object.entries(gates || {})
    .map(([key, value]) => `${key}=${value ? 'PASS' : 'FAIL'}`)
    .join(', ');
  return `${dateTag} ${mode} — gates ${gateSummary || 'n/a'}; evidence ${evidenceRel}`;
}

async function updateTaskTracker(trackerPath, branch, sha, dateTag, mode, gates, evidenceRel) {
  const exists = await fileExists(trackerPath);
  if (!exists) {
    const header = '# Dreamdust Diagnostic Task Tracker\n\n| Task | Description | Branch / PR | Status | Notes |\n| --- | --- | --- | --- | --- |\n';
    await fs.writeFile(trackerPath, header, 'utf8');
  }
  const original = await fs.readFile(trackerPath, 'utf8');
  const lines = original.split('\n');
  const branchMatch = branch;
  const notes = buildNotesSummary(dateTag, mode, gates, evidenceRel);
  let updated = false;
  const newLines = lines.map((line) => {
    if (!line.includes('|')) return line;
    if (!line.includes(branchMatch)) return line;
    const trimmed = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (trimmed.length < 5) return line;
    if (!trimmed[3]) {
      trimmed[3] = 'In progress';
    }
    trimmed[4] = notes;
    updated = true;
    return `| ${trimmed.join(' | ')} |`;
  });

  if (!updated) {
    const row = `| ${mode} automation | ${notes} | ${branchMatch} | In progress | ${notes} |`;
    newLines.push(row);
  }

  await fs.writeFile(trackerPath, `${newLines.join('\n')}`.replace(/\n{3,}/g, '\n\n'), 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.summary) {
    process.stderr.write('Usage: node scripts/report.js --summary <summary.json> [--imageMetrics <metrics.json>] [--docsRoot <path>] [--next <text>] [--autoCommit]\n');
    process.exitCode = 1;
    return;
  }

  const cwd = process.cwd();
  const docsRoot = path.resolve(cwd, args.docsRoot ?? DOCS_ROOT_DEFAULT);
  const summaryPath = path.resolve(cwd, args.summary);
  const summary = await readJson(summaryPath);
  const imageMetrics = args.imageMetrics ? await readJson(path.resolve(cwd, args.imageMetrics)) : null;

  const dateTag = args.date ?? summary.dateTag ?? getDateTag();
  const mode = (args.mode ?? summary.mode ?? 'telemetry').toLowerCase();
  const branch = args.branch ?? (await resolveGitValue(['rev-parse', '--abbrev-ref', 'HEAD'])) ?? 'unknown-branch';
  const sha = args.sha ?? (await resolveGitValue(['rev-parse', '--short', 'HEAD'])) ?? 'HEAD';
  const runTimestamp = summary.timestamp ?? new Date().toISOString();
  const gates = summary.gates ?? {};
  const url = summary.url ?? summary.requestedUrl ?? 'n/a';
  const screenshotAbs = summary.outputs?.screenshot ? path.resolve(cwd, summary.outputs.screenshot) : null;
  const consoleAbs = summary.outputs?.consoleLog ? path.resolve(cwd, summary.outputs.consoleLog) : null;
  const vertexAbs = summary.outputs?.vertexLog ? path.resolve(cwd, summary.outputs.vertexLog) : null;
  const docsAssetsRelative = (absPath) => (absPath ? asRelative(absPath, docsRoot) : null);
  const screenshotRel = docsAssetsRelative(screenshotAbs);
  const consoleRel = docsAssetsRelative(consoleAbs);
  const vertexRel = docsAssetsRelative(vertexAbs);
  const evidencePath = path.join(docsRoot, `${dateTag}-evidence.md`);
  const vertexRawPath = path.join(docsRoot, `${dateTag}-vertex-log-raw.md`);
  const trackerPath = path.join(docsRoot, 'task-tracker.md');
  const sectionAnchor = sanitizeAnchor(`${dateTag}-${mode}-run`);
  const nextSteps = args.next ?? args.nextSteps ?? 'TBD';

  const vertexContent = vertexAbs && (await fileExists(vertexAbs))
    ? await fs.readFile(vertexAbs, 'utf8')
    : ''; 

  const vertexLines = vertexContent.trim().length > 0
    ? `### Console [vertex] lines\n\n\`\`\`text\n${vertexContent.trim()}\n\`\`\``
    : '### Console [vertex] lines\n\n_No `[vertex]` lines captured._';

  const gateLines = buildGateLines(gates);
  const imageLines = buildImageLines(imageMetrics);

  const assetsList = [
    screenshotRel ? `  - Screenshot: \`${screenshotRel}\`` : null,
    consoleRel ? `  - Console log: \`${consoleRel}\`` : null,
    vertexRel ? `  - Vertex log: \`${vertexRel}\`` : null,
  ].filter(Boolean);

  const vertexSection = [
    `## Run ${runTimestamp} — ${mode}`,
    '',
    `- Branch: ${branch}`,
    `- Commit: ${sha}`,
    `- URL: \`${url}\``,
    `- Mode: ${mode}`,
    assetsList.length > 0 ? '- Assets:\n' + assetsList.join('\n') : '- Assets: none recorded',
    '',
    '### Gate snapshot',
    gateLines.length > 0 ? gateLines.join('\n') : '_No gates captured._',
    '',
    vertexLines,
    '',
  ].join('\n');

  const evidenceSectionLines = [
    `### ${dateTag} ${mode} run`,
    '',
    `- Timestamp: ${runTimestamp}`,
    `- Branch: ${branch}`,
    `- Commit: ${sha}`,
    `- URL: \`${url}\``,
    screenshotRel ? `- Screenshot: ${screenshotRel}` : '- Screenshot: n/a',
    consoleRel ? `- Console: ${consoleRel}` : '- Console: n/a',
    vertexRel ? `- Vertex log: ${vertexRel}` : '- Vertex log: n/a',
    '- Gates:',
    gateLines.length > 0 ? gateLines.map((line) => `  ${line}`).join('\n') : '  - n/a',
  ];

  if (imageLines.length > 0) {
    evidenceSectionLines.push('- Image metrics:');
    evidenceSectionLines.push(...imageLines.map((line) => `  ${line}`));
  }

  evidenceSectionLines.push(`- Next: ${nextSteps}`);
  evidenceSectionLines.push('');

  const evidenceSection = evidenceSectionLines.join('\n');

  await fs.mkdir(path.dirname(evidencePath), { recursive: true });
  await fs.mkdir(path.dirname(vertexRawPath), { recursive: true });

  await appendSection(vertexRawPath, vertexSection);
  await appendSection(evidencePath, evidenceSection);

  const evidenceRel = asRelative(evidencePath, docsRoot);
  await updateTaskTracker(trackerPath, branch, sha, dateTag, mode, gates, evidenceRel);

  if (args.autoCommit || args.commit) {
    const pathsToAdd = [evidencePath, vertexRawPath, trackerPath];
    if (vertexAbs) pathsToAdd.push(vertexAbs);
    const commitMessage = args.commitMessage
      ?? `docs(run): ${dateTag} ${mode} ${Object.values(gates || {}).every(Boolean) ? 'pass' : 'review'}`;
    await execFileAsync('git', ['add', ...pathsToAdd], { cwd });
    await execFileAsync('git', ['commit', '-m', commitMessage], { cwd });
  }

  const report = {
    status: 'ok',
    dateTag,
    mode,
    branch,
    sha,
    evidence: asRelative(evidencePath, cwd),
    vertexLogRaw: asRelative(vertexRawPath, cwd),
    tracker: asRelative(trackerPath, cwd),
    anchor: sectionAnchor,
  };

  process.stdout.write(`${JSON.stringify(report)}\n`);
}

main().catch((error) => {
  const payload = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
  process.stdout.write(`${JSON.stringify({ status: 'error', error: payload })}\n`);
  process.exitCode = 1;
});
