#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Sample CSV template
const sampleCSV = `id,content,contact,date,topics,cluster,connections
mem_001,"Collaborative session on goals with Alex",Alex,2025-01-05,"goals",personal,"mem_005,mem_034"
mem_002,"Discussion with Alex about requirements",Alex,2025-05-04,"requirements",product,"mem_016,mem_004,mem_035"
mem_003,"Discussion with Sam about training and checklist and orientation",Sam,2025-04-02,"training,checklist,orientation",onboarding,"mem_022,mem_044,mem_018"
mem_004,"Discussion with Casey about features and requirements",Casey,2025-06-15,"features,requirements",product,""
mem_005,"Collaborative session on goals & development with Avery",Avery,2025-03-12,"goals,development",personal,"mem_001,mem_048,mem_039,mem_042"`;

// Function to parse CSV
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const memories = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    // Handle quoted values with commas
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    const memory = {
      id: values[0],
      content: values[1],
      position: generatePosition(i), // Generate 3D position
      cluster: values[5],
      connections: values[6] ? values[6].split(',').filter((c) => c) : [],
      metadata: {
        contact: values[2],
        date: values[3],
        topics: values[4] ? values[4].split(',') : [],
      },
    };

    memories.push(memory);
  }

  return { memories };
}

// Generate 3D positions (can be customized)
function generatePosition(index) {
  // Simple sphere distribution
  const phi = Math.acos(1 - 2 * (index / 100));
  const theta = Math.sqrt(100 * Math.PI) * phi;
  const radius = 30 + Math.random() * 20;

  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
CSV to JSON Converter for Cryptic Vault Demo

Usage:
  node csv-to-json.js <input.csv> [output.json]
  node csv-to-json.js --sample    # Generate sample CSV

The CSV should have these columns:
  id, content, contact, date, topics, cluster, connections

Clusters: personal, product, engineering, design, planning, research, meetings, onboarding
`);
    return;
  }

  if (args[0] === '--sample') {
    fs.writeFileSync('sample-memories.csv', sampleCSV);
    console.log('Created sample-memories.csv');
    return;
  }

  const inputFile = args[0];
  const outputFile = args[1] || path.join(__dirname, '../data/memories.json');

  try {
    const csvContent = fs.readFileSync(inputFile, 'utf-8');
    const jsonData = parseCSV(csvContent);

    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Converted ${jsonData.memories.length} memories`);
    console.log(`📄 Output saved to: ${outputFile}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
