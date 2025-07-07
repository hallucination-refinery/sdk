#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to escape CSV values
function escapeCSV(value) {
  if (
    typeof value === 'string' &&
    (value.includes(',') || value.includes('"') || value.includes('\n'))
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Convert JSON to CSV
function jsonToCSV(jsonData) {
  const headers = [
    'id',
    'content',
    'contact',
    'date',
    'topics',
    'cluster',
    'connections',
  ];
  const rows = [headers.join(',')];

  jsonData.memories.forEach((memory) => {
    const row = [
      memory.id,
      escapeCSV(memory.content),
      memory.metadata.contact,
      memory.metadata.date,
      memory.metadata.topics.join(','),
      memory.cluster,
      memory.connections.join(','),
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
JSON to CSV Exporter for Cryptic Vault Demo

Usage:
  node json-to-csv.js [input.json] [output.csv]

Defaults:
  input.json: ../data/memories.json
  output.csv: memories-export.csv
`);
    return;
  }

  const inputFile = args[0] || path.join(__dirname, '../data/memories.json');
  const outputFile = args[1] || 'memories-export.csv';

  try {
    const jsonContent = fs.readFileSync(inputFile, 'utf-8');
    const jsonData = JSON.parse(jsonContent);
    const csvContent = jsonToCSV(jsonData);

    fs.writeFileSync(outputFile, csvContent);
    console.log(`✅ Exported ${jsonData.memories.length} memories to CSV`);
    console.log(`📄 Output saved to: ${outputFile}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
