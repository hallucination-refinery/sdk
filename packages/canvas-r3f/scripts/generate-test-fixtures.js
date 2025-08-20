#!/usr/bin/env node

/**
 * Test Fixture Generator for Session 9
 * Generates 100 ConceptNodes with realistic data distribution
 */

// Categories with realistic distribution weights
const CATEGORIES = [
  { name: 'Technology', weight: 20, color: '#3498db' },
  { name: 'Science', weight: 15, color: '#2ecc71' },
  { name: 'Philosophy', weight: 12, color: '#9b59b6' },
  { name: 'Art', weight: 10, color: '#e74c3c' },
  { name: 'Business', weight: 18, color: '#f39c12' },
  { name: 'Health', weight: 8, color: '#1abc9c' },
  { name: 'Education', weight: 10, color: '#34495e' },
  { name: 'Social', weight: 7, color: '#e67e22' }
];

// Sample concept templates by category
const CONCEPT_TEMPLATES = {
  Technology: [
    'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'Cloud Computing',
    'Cybersecurity', 'Internet of Things', 'Virtual Reality', 'Quantum Computing',
    'Mobile Development', 'Data Science', 'DevOps', 'Software Architecture',
    'Neural Networks', 'Automation', 'Robotics'
  ],
  Science: [
    'Climate Change', 'Gene Therapy', 'Space Exploration', 'Renewable Energy',
    'Neuroscience', 'Particle Physics', 'Biotechnology', 'Materials Science',
    'Astrophysics', 'Molecular Biology', 'Chemistry', 'Environmental Science'
  ],
  Philosophy: [
    'Ethics', 'Consciousness', 'Free Will', 'Moral Philosophy', 'Existentialism',
    'Logic', 'Metaphysics', 'Epistemology', 'Political Philosophy', 'Aesthetics'
  ],
  Art: [
    'Digital Art', 'Contemporary Painting', 'Sculpture', 'Photography',
    'Performance Art', 'Installation Art', 'Video Art', 'Graphic Design'
  ],
  Business: [
    'Entrepreneurship', 'Marketing Strategy', 'Financial Planning', 'Leadership',
    'Innovation Management', 'Supply Chain', 'Customer Experience', 'Digital Transformation',
    'Venture Capital', 'Business Analytics', 'Product Management', 'Sales Strategy'
  ],
  Health: [
    'Mental Health', 'Nutrition', 'Exercise Physiology', 'Preventive Medicine',
    'Public Health', 'Medical Technology', 'Wellness', 'Healthcare Innovation'
  ],
  Education: [
    'Learning Theory', 'Curriculum Design', 'Educational Technology', 'Assessment Methods',
    'Online Learning', 'Inclusive Education', 'STEM Education', 'Adult Learning'
  ],
  Social: [
    'Community Building', 'Social Justice', 'Cultural Studies', 'Human Rights',
    'Social Psychology', 'Urban Planning', 'Sociology'
  ]
};

// Memory templates for realistic associations
const MEMORY_TEMPLATES = [
  'Learned about {concept} during a {context}',
  'Had an insight about {concept} while {activity}',
  'Discussed {concept} with {person}',
  'Read an article about {concept}',
  'Attended a workshop on {concept}',
  'Watched a documentary about {concept}',
  'Experimented with {concept} in practice',
  'Reflected on the implications of {concept}',
  'Connected {concept} to previous knowledge',
  'Applied {concept} to solve a problem'
];

const CONTEXTS = ['conference', 'meeting', 'course', 'seminar', 'conversation', 'research session'];
const ACTIVITIES = ['walking', 'reading', 'coding', 'writing', 'meditating', 'exercising'];
const PEOPLE = ['a colleague', 'a mentor', 'a friend', 'an expert', 'a team member', 'a professor'];

/**
 * Generate weighted random selection from categories
 */
function selectWeightedCategory() {
  const totalWeight = CATEGORIES.reduce((sum, cat) => sum + cat.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const category of CATEGORIES) {
    random -= category.weight;
    if (random <= 0) {
      return category;
    }
  }
  return CATEGORIES[0]; // fallback
}

/**
 * Generate random date within the last 2 years
 */
function generateRandomDate() {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - (2 * 365 * 24 * 60 * 60 * 1000));
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  return new Date(randomTime).toISOString();
}

/**
 * Generate a memory entry for a concept
 */
function generateMemory(conceptLabel) {
  const template = MEMORY_TEMPLATES[Math.floor(Math.random() * MEMORY_TEMPLATES.length)];
  const context = CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];
  const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
  const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
  
  return template
    .replace('{concept}', conceptLabel)
    .replace('{context}', context)
    .replace('{activity}', activity)
    .replace('{person}', person);
}

/**
 * Generate a single ConceptNode
 */
function generateConceptNode(id, category, conceptLabel) {
  const createdAt = generateRandomDate();
  const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
  
  // Generate 1-5 memories
  const memoryCount = Math.floor(Math.random() * 5) + 1;
  const memories = Array.from({ length: memoryCount }, () => generateMemory(conceptLabel));
  
  return {
    id: `concept_${String(id).padStart(3, '0')}`,
    label: conceptLabel,
    content: `Detailed thoughts and knowledge about ${conceptLabel}`,
    color: category.color,
    createdAt,
    updatedAt,
    metadata: {
      category: category.name,
      memories,
      tags: [category.name.toLowerCase(), 'generated', 'test-data'],
      importance: Math.floor(Math.random() * 10) + 1, // 1-10 scale
      lastAccessed: updatedAt
    }
  };
}

/**
 * Main generation function
 */
function generateTestFixtures() {
  console.log('Generating 100 ConceptNodes with realistic distribution...');
  
  const concepts = [];
  const categoryUsage = {};
  
  for (let i = 1; i <= 100; i++) {
    const category = selectWeightedCategory();
    categoryUsage[category.name] = (categoryUsage[category.name] || 0) + 1;
    
    // Select concept template or generate unique name
    const templates = CONCEPT_TEMPLATES[category.name];
    const conceptIndex = (categoryUsage[category.name] - 1) % templates.length;
    let conceptLabel = templates[conceptIndex];
    
    // Add variation for repeated concepts
    if (categoryUsage[category.name] > templates.length) {
      const variation = Math.floor((categoryUsage[category.name] - 1) / templates.length);
      conceptLabel += ` (${variation + 1})`;
    }
    
    const concept = generateConceptNode(i, category, conceptLabel);
    concepts.push(concept);
  }
  
  // Print distribution summary
  console.log('\nCategory Distribution:');
  Object.entries(categoryUsage).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} concepts`);
  });
  
  return concepts;
}

// Generate and save the data
const concepts = generateTestFixtures();
const fixtureData = {
  concepts,
  metadata: {
    generated: new Date().toISOString(),
    count: concepts.length,
    session: 'session_9',
    runId: '20250820_004036_ALL-ALL',
    categories: CATEGORIES.map(c => c.name),
    description: 'Test fixture with 100 ConceptNodes distributed across 8 categories over 2 years'
  }
};

// Write to file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '..', 'fixtures', 'concepts-100.json');
fs.writeFileSync(outputPath, JSON.stringify(fixtureData, null, 2));

console.log(`\n✅ Generated ${concepts.length} concepts saved to: ${outputPath}`);
console.log(`📊 Schema validation required: use Node schema from @refinery/schema`);
console.log(`🎯 Acceptance criteria: Schema validation, realistic distribution, proper file location`);