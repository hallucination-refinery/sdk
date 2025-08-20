#!/usr/bin/env node

/**
 * 15K Concept Generator for Session 6 Overflow Shell Testing
 * Generates 15,000 ConceptNodes to test overflow shell system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Base concept templates by category (expanded for 15k)
const CONCEPT_TEMPLATES = {
  Technology: [
    'AI', 'ML', 'Blockchain', 'Cloud', 'Cybersecurity', 'IoT', 'VR', 'AR', 'Quantum',
    'Mobile Dev', 'Data Science', 'DevOps', 'Architecture', 'Neural Nets', 'Automation',
    'Robotics', 'API Design', 'Microservices', 'Containers', 'Kubernetes', 'Docker',
    'React', 'Node.js', 'Python', 'Rust', 'Go', 'TypeScript', 'GraphQL', 'REST'
  ],
  Science: [
    'Climate', 'Genetics', 'Space', 'Energy', 'Neuroscience', 'Physics', 'Biotech',
    'Materials', 'Astrophysics', 'Biology', 'Chemistry', 'Environment', 'Medicine',
    'Research', 'Discovery', 'Innovation', 'Theory', 'Experiment', 'Analysis'
  ],
  Philosophy: [
    'Ethics', 'Consciousness', 'Free Will', 'Morality', 'Existentialism', 'Logic',
    'Metaphysics', 'Epistemology', 'Politics', 'Aesthetics', 'Truth', 'Knowledge',
    'Being', 'Reality', 'Mind', 'Identity', 'Justice', 'Freedom', 'Meaning'
  ],
  Art: [
    'Digital Art', 'Painting', 'Sculpture', 'Photography', 'Performance', 'Installation',
    'Video Art', 'Design', 'Animation', 'Illustration', 'Music', 'Film', 'Literature',
    'Dance', 'Theater', 'Creative', 'Expression', 'Beauty', 'Culture'
  ],
  Business: [
    'Entrepreneurship', 'Marketing', 'Finance', 'Leadership', 'Innovation', 'Strategy',
    'Management', 'Sales', 'Operations', 'Analytics', 'Customer', 'Product', 'Growth',
    'Investment', 'Planning', 'Development', 'Excellence', 'Performance', 'Value'
  ],
  Health: [
    'Mental Health', 'Nutrition', 'Exercise', 'Medicine', 'Public Health', 'Technology',
    'Wellness', 'Innovation', 'Prevention', 'Treatment', 'Therapy', 'Diagnosis',
    'Research', 'Care', 'Recovery', 'Fitness', 'Balance', 'Healing'
  ],
  Education: [
    'Learning', 'Teaching', 'Curriculum', 'Assessment', 'Technology', 'Research',
    'Development', 'Innovation', 'Methods', 'Psychology', 'Theory', 'Practice',
    'Skills', 'Knowledge', 'Training', 'Growth', 'Achievement', 'Excellence'
  ],
  Social: [
    'Community', 'Culture', 'Society', 'Relationships', 'Communication', 'Media',
    'Networks', 'Collaboration', 'Connection', 'Engagement', 'Impact', 'Change',
    'Movement', 'Progress', 'Development', 'Unity', 'Diversity', 'Inclusion'
  ]
};

// Memory templates for realistic context
const MEMORY_TEMPLATES = [
  'Had a breakthrough while {activity} about {topic}',
  'Discussed {topic} with {person} during {context}',
  'Read about {topic} in {context} - very insightful',
  'Learned {topic} through {activity} with {person}',
  'Applied {topic} concepts during {context}',
  'Discovered {topic} connection while {activity}',
  'Reflected on {topic} during {activity}',
  'Shared {topic} insights in {context}',
  'Explored {topic} through {activity}',
  'Connected {topic} to previous knowledge during {context}'
];

const ACTIVITIES = ['walking', 'reading', 'coding', 'writing', 'meditating', 'exercising', 'thinking', 'researching', 'discussing', 'exploring'];
const CONTEXTS = ['conference', 'meeting', 'course', 'seminar', 'conversation', 'workshop', 'project', 'study', 'presentation', 'collaboration'];
const PEOPLE = ['colleague', 'mentor', 'friend', 'expert', 'team member', 'professor', 'researcher', 'leader', 'specialist', 'advisor'];

// Utility functions
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

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

function generateMemory(conceptLabel, category) {
  const template = MEMORY_TEMPLATES[Math.floor(Math.random() * MEMORY_TEMPLATES.length)];
  const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
  const context = CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];
  const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
  
  return template
    .replace('{topic}', conceptLabel)
    .replace('{activity}', activity)
    .replace('{context}', context)
    .replace('{person}', person);
}

function generateConcept(index) {
  const category = selectWeightedCategory();
  const baseTemplates = CONCEPT_TEMPLATES[category.name];
  const baseTemplate = baseTemplates[Math.floor(Math.random() * baseTemplates.length)];
  
  // Add variation to avoid duplicates in 15k concepts
  const variation = Math.floor(index / 100) + 1;
  const label = variation > 1 ? `${baseTemplate} ${variation}` : baseTemplate;
  
  const id = generateId();
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  
  const createdAt = getRandomDate(twoYearsAgo, now);
  const updatedAt = getRandomDate(createdAt, now);
  const lastAccessed = getRandomDate(updatedAt, now);
  
  // Generate 1-5 memories per concept
  const memoryCount = Math.floor(Math.random() * 5) + 1;
  const memories = [];
  
  for (let i = 0; i < memoryCount; i++) {
    memories.push({
      id: generateId(),
      content: generateMemory(label, category.name),
      createdAt: getRandomDate(createdAt, updatedAt).toISOString()
    });
  }
  
  return {
    id,
    label,
    color: category.color,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    content: `${label} - A comprehensive exploration of ${label.toLowerCase()} concepts and applications.`,
    metadata: {
      category: category.name,
      memories,
      tags: [category.name.toLowerCase(), baseTemplate.toLowerCase().replace(/\s+/g, '-')],
      importance: Math.floor(Math.random() * 10) + 1,
      lastAccessed: lastAccessed.toISOString()
    }
  };
}

function generateConcepts(count) {
  console.log(`Generating ${count} concepts...`);
  const concepts = [];
  
  for (let i = 0; i < count; i++) {
    concepts.push(generateConcept(i));
    
    // Progress indicator
    if ((i + 1) % 1000 === 0) {
      console.log(`Generated ${i + 1}/${count} concepts`);
    }
  }
  
  return concepts;
}

function main() {
  const TARGET_COUNT = 15000;
  const concepts = generateConcepts(TARGET_COUNT);
  
  // Calculate statistics
  const categoryStats = {};
  let totalMemories = 0;
  
  concepts.forEach(concept => {
    const category = concept.metadata.category;
    categoryStats[category] = (categoryStats[category] || 0) + 1;
    totalMemories += concept.metadata.memories.length;
  });
  
  const fixture = {
    concepts,
    metadata: {
      generated: new Date().toISOString(),
      count: TARGET_COUNT,
      session: 'session_6',
      runId: '20250820_004036_ALL-ALL',
      categories: Object.keys(categoryStats),
      categoryDistribution: categoryStats,
      totalMemories,
      averageMemoriesPerConcept: (totalMemories / TARGET_COUNT).toFixed(2),
      description: `Test fixture with ${TARGET_COUNT} ConceptNodes for overflow shell system testing. Each concept has 1-5 realistic memory entries and belongs to one of 8 categories with weighted distribution.`
    }
  };
  
  // Ensure fixtures directory exists
  const fixturesDir = path.join(__dirname, '..', 'fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  // Write to file
  const outputPath = path.join(fixturesDir, 'concepts-15k.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixture, null, 2));
  
  console.log('\n=== 15K Concept Generation Complete ===');
  console.log(`Output: ${outputPath}`);
  console.log(`Total Concepts: ${TARGET_COUNT}`);
  console.log(`Total Memories: ${totalMemories}`);
  console.log(`Average Memories per Concept: ${(totalMemories / TARGET_COUNT).toFixed(2)}`);
  console.log('\nCategory Distribution:');
  
  Object.entries(categoryStats).forEach(([category, count]) => {
    const percentage = ((count / TARGET_COUNT) * 100).toFixed(1);
    console.log(`  ${category}: ${count} concepts (${percentage}%)`);
  });
  
  console.log(`\nFile size: ${(fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2)} MB`);
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateConcepts };