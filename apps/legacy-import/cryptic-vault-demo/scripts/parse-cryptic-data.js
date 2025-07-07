#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to parse Cryptic CSV format
function parseCrypticCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const memories = [];
  const tagMap = new Map(); // Track which memories have which tags
  const dateMap = new Map(); // Track memories by date for temporal connections
  
  // First pass: parse all memories
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 6) continue;
    
    const [category, context, tags, dateAdded, isSecret, signature] = values;
    const parsedTags = tags ? tags.split(',').map(t => t.trim()) : [];
    const date = new Date(dateAdded);
    const dateKey = date.toISOString().split('T')[0]; // Group by day
    
    const memory = {
      id: `mem_${i.toString().padStart(3, '0')}`,
      content: context,
      position: generatePosition(i, category),
      cluster: mapCategoryToCluster(category),
      connections: [], // Will be filled in second pass
      metadata: {
        contact: extractContact(context), // Extract from context if mentioned
        date: dateKey,
        topics: parsedTags,
        isSecret: isSecret === 'Yes',
        signature: signature,
        originalCategory: category
      }
    };
    
    memories.push(memory);
    
    // Track tags for connection building
    parsedTags.forEach(tag => {
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag).push(memory.id);
    });
    
    // Track by date for temporal connections
    if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);
    dateMap.get(dateKey).push(memory.id);
  }
  
  // Second pass: build connections
  memories.forEach(memory => {
    const connections = new Set();
    
    // 1. Tag-based connections (primary)
    memory.metadata.topics.forEach(tag => {
      const relatedMemories = tagMap.get(tag) || [];
      relatedMemories.forEach(relatedId => {
        if (relatedId !== memory.id) {
          // Check how many tags they share
          const otherMemory = memories.find(m => m.id === relatedId);
          if (otherMemory) {
            const sharedTags = memory.metadata.topics.filter(t => 
              otherMemory.metadata.topics.includes(t)
            );
            // Only connect if they share 2+ tags or both are secret
            if (sharedTags.length >= 2 || 
                (memory.metadata.isSecret && otherMemory.metadata.isSecret)) {
              connections.add(relatedId);
            }
          }
        }
      });
    });
    
    // 2. Temporal connections (same day)
    const sameDayMemories = dateMap.get(memory.metadata.date) || [];
    sameDayMemories.forEach(relatedId => {
      if (relatedId !== memory.id) {
        // Only connect if they're in the same category or share tags
        const otherMemory = memories.find(m => m.id === relatedId);
        if (otherMemory && 
            (otherMemory.cluster === memory.cluster || 
             memory.metadata.topics.some(t => otherMemory.metadata.topics.includes(t)))) {
          connections.add(relatedId);
        }
      }
    });
    
    // Limit connections to prevent overcrowding
    memory.connections = Array.from(connections).slice(0, 5);
  });
  
  return { memories };
}

// Parse CSV line handling quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

// Map Cryptic categories to visualization clusters
function mapCategoryToCluster(category) {
  const mapping = {
    'Relationships': 'relationships',
    'About Me': 'personal',
    'Career': 'career',
    'Personal Health': 'health',
    'Faith': 'spiritual'
  };
  return mapping[category] || 'general';
}

// Extract contact name from context if mentioned
function extractContact(context) {
  // Simple heuristic: if "This user" appears, it's self-reflective
  if (context.includes('This user')) {
    return 'Self';
  }
  // Look for common patterns like "with [Name]" or "[Name] shared"
  const withMatch = context.match(/with (\w+)/);
  if (withMatch) return withMatch[1];
  
  const sharedMatch = context.match(/(\w+) shared/);
  if (sharedMatch) return sharedMatch[1];
  
  return 'Self';
}

// Generate 3D positions based on category and index
function generatePosition(index, category) {
  // Create category-based regions in 3D space
  const categoryOffsets = {
    'Relationships': { x: -20, y: 0, z: 20 },
    'About Me': { x: 0, y: 10, z: 0 },
    'Career': { x: 20, y: 0, z: -20 },
    'Personal Health': { x: -20, y: -10, z: -20 },
    'Faith': { x: 20, y: 10, z: 20 }
  };
  
  const offset = categoryOffsets[category] || { x: 0, y: 0, z: 0 };
  
  // Add some randomness within the category region
  const angle = (index * 137.5) * Math.PI / 180; // Golden angle
  const radius = 10 + (index % 10) * 2;
  
  return [
    offset.x + radius * Math.cos(angle),
    offset.y + (Math.random() - 0.5) * 10,
    offset.z + radius * Math.sin(angle)
  ];
}

// Main function
function main() {
  const inputFile = 'full-synthetic-data.csv';
  const outputFile = path.join(__dirname, '../data/memories.json');
  
  try {
    const csvContent = fs.readFileSync(inputFile, 'utf-8');
    const jsonData = parseCrypticCSV(csvContent);
    
    // Add summary statistics
    const stats = {
      totalMemories: jsonData.memories.length,
      secretMemories: jsonData.memories.filter(m => m.metadata.isSecret).length,
      clusters: [...new Set(jsonData.memories.map(m => m.cluster))],
      dateRange: {
        start: Math.min(...jsonData.memories.map(m => new Date(m.metadata.date))),
        end: Math.max(...jsonData.memories.map(m => new Date(m.metadata.date)))
      }
    };
    
    console.log('📊 Parsed Cryptic Data:');
    console.log(`   Total memories: ${stats.totalMemories}`);
    console.log(`   Secret memories: ${stats.secretMemories}`);
    console.log(`   Clusters: ${stats.clusters.join(', ')}`);
    console.log(`   Date range: ${new Date(stats.dateRange.start).toLocaleDateString()} - ${new Date(stats.dateRange.end).toLocaleDateString()}`);
    
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`\n✅ Output saved to: ${outputFile}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main(); 