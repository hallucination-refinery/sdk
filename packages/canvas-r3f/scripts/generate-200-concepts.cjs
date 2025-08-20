#!/usr/bin/env node

/**
 * Test Fixture Generator for Session 5
 * Generates 200 ConceptNodes for higher scale collision testing
 */

const fs = require('fs');
const path = require('path');

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

// Extended concept templates by category (more concepts for 200 total)
const CONCEPT_TEMPLATES = {
  Technology: [
    'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'Cloud Computing',
    'Cybersecurity', 'Internet of Things', 'Virtual Reality', 'Quantum Computing',
    'Mobile Development', 'Data Science', 'DevOps', 'Software Architecture',
    'Neural Networks', 'Automation', 'Robotics', 'Edge Computing', 'Augmented Reality',
    'Distributed Systems', 'API Design', 'Microservices', 'Container Orchestration',
    'Serverless Computing', 'Progressive Web Apps', 'Computer Vision', 'Natural Language Processing',
    'Deep Learning', 'Reinforcement Learning', 'Federated Learning', 'Graph Databases',
    'Time Series Analysis', 'Real-time Systems', 'Embedded Systems', 'Quantum Algorithms',
    'Bioinformatics', 'Computational Biology', 'Digital Twins', 'Smart Contracts',
    'Cryptocurrency', 'Decentralized Finance', 'Web3', 'Metaverse'
  ],
  Science: [
    'Climate Change', 'Gene Therapy', 'Space Exploration', 'Renewable Energy',
    'Neuroscience', 'Particle Physics', 'Biotechnology', 'Materials Science',
    'Astrophysics', 'Molecular Biology', 'Chemistry', 'Environmental Science',
    'Oceanography', 'Geology', 'Meteorology', 'Ecology', 'Genetics', 'Immunology',
    'Microbiology', 'Biochemistry', 'Pharmacology', 'Toxicology', 'Epidemiology',
    'Virology', 'Cell Biology', 'Developmental Biology', 'Evolutionary Biology',
    'Marine Biology', 'Conservation Biology', 'Synthetic Biology', 'Systems Biology'
  ],
  Philosophy: [
    'Ethics', 'Consciousness', 'Free Will', 'Moral Philosophy', 'Existentialism',
    'Logic', 'Metaphysics', 'Epistemology', 'Political Philosophy', 'Aesthetics',
    'Philosophy of Mind', 'Philosophy of Science', 'Philosophy of Language',
    'Philosophy of Religion', 'Phenomenology', 'Pragmatism', 'Stoicism',
    'Utilitarianism', 'Deontology', 'Virtue Ethics', 'Applied Ethics', 'Bioethics'
  ],
  Art: [
    'Digital Art', 'Contemporary Painting', 'Sculpture', 'Photography',
    'Performance Art', 'Installation Art', 'Video Art', 'Graphic Design',
    'Animation', 'Conceptual Art', 'Street Art', 'Abstract Art', 'Surrealism',
    'Impressionism', 'Expressionism', 'Minimalism', 'Pop Art', 'Art History'
  ],
  Business: [
    'Entrepreneurship', 'Marketing Strategy', 'Financial Planning', 'Leadership',
    'Innovation Management', 'Supply Chain', 'Customer Experience', 'Digital Transformation',
    'Venture Capital', 'Business Analytics', 'Product Management', 'Sales Strategy',
    'Strategic Planning', 'Change Management', 'Organizational Behavior', 'Human Resources',
    'Brand Management', 'Market Research', 'Business Intelligence', 'Risk Management',
    'Project Management', 'Operations Management', 'Quality Management', 'Lean Manufacturing',
    'Six Sigma', 'Agile Methodology', 'Scrum', 'Business Process Optimization',
    'Corporate Strategy', 'Mergers & Acquisitions', 'International Business', 'E-commerce',
    'Social Media Marketing', 'Content Marketing', 'SEO', 'Digital Marketing',
    'Customer Relationship Management', 'Business Development', 'Partnerships', 'Negotiations'
  ],
  Health: [
    'Mental Health', 'Nutrition', 'Exercise Physiology', 'Preventive Medicine',
    'Public Health', 'Medical Technology', 'Wellness', 'Healthcare Innovation',
    'Telemedicine', 'Personalized Medicine', 'Health Informatics', 'Medical Devices',
    'Health Policy', 'Healthcare Management', 'Clinical Research', 'Medical Ethics'
  ],
  Education: [
    'Learning Theory', 'Educational Technology', 'Curriculum Design', 'Assessment Methods',
    'Online Learning', 'Adult Education', 'Special Education', 'Educational Psychology',
    'Instructional Design', 'Pedagogical Approaches', 'Educational Research', 'Student Engagement',
    'Digital Literacy', 'STEAM Education', 'Language Learning', 'Critical Thinking',
    'Problem-Based Learning', 'Collaborative Learning', 'Adaptive Learning', 'Educational Policy'
  ],
  Social: [
    'Social Justice', 'Community Development', 'Cultural Anthropology', 'Sociology',
    'Social Psychology', 'Human Rights', 'Diversity & Inclusion', 'Social Innovation',
    'Urban Planning', 'Social Work', 'Public Policy', 'Social Media Impact',
    'Digital Divide', 'Social Entrepreneurship', 'Community Organizing', 'Social Research'
  ]
};

// Memory templates for realistic memory generation
const MEMORY_TEMPLATES = [
  'Read an article about {topic}',
  'Attended a conference on {topic}',
  'Had a discussion about {topic} with a colleague',
  'Watched a documentary about {topic}',
  'Researched {topic} for a project',
  'Reflected on the implications of {topic}',
  'Wrote notes about {topic}',
  'Participated in a workshop on {topic}',
  'Gave a presentation about {topic}',
  'Collaborated on a {topic} initiative'
];

const CONTEXTS = [
  'during a walk in the park',
  'while reading at home',
  'during a team meeting',
  'in a quiet coffee shop',
  'while coding late at night',
  'during morning meditation',
  'while exercising',
  'in the library',
  'during lunch break',
  'while commuting'
];

const PEOPLE = [
  'a colleague', 'a mentor', 'a friend', 'an expert', 'a team member',
  'a professor', 'a researcher', 'a consultant', 'a peer', 'a specialist'
];

// Generate weighted category distribution for 200 concepts
function generateCategoryDistribution() {
  const totalWeight = CATEGORIES.reduce((sum, cat) => sum + cat.weight, 0);
  const distribution = {};
  
  CATEGORIES.forEach(category => {
    const count = Math.round((category.weight / totalWeight) * 200);
    distribution[category.name] = count;
  });
  
  // Adjust for exactly 200 concepts
  const totalAssigned = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const diff = 200 - totalAssigned;
  
  if (diff !== 0) {
    // Add/remove from the largest category
    const largestCategory = Object.keys(distribution).reduce((a, b) => 
      distribution[a] > distribution[b] ? a : b
    );
    distribution[largestCategory] += diff;
  }
  
  return distribution;
}

function generateMemories(conceptLabel) {
  const memoryCount = Math.floor(Math.random() * 5) + 1; // 1-5 memories
  const memories = [];
  
  for (let i = 0; i < memoryCount; i++) {
    const template = MEMORY_TEMPLATES[Math.floor(Math.random() * MEMORY_TEMPLATES.length)];
    const context = CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];
    const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
    
    let memory = template.replace('{topic}', conceptLabel);
    
    // Add context for some memories
    if (Math.random() > 0.6) {
      memory += ` ${context}`;
    }
    
    // Add person for discussion-type memories
    if (template.includes('discussion') || template.includes('Collaborated')) {
      memory = memory.replace('a colleague', person);
    }
    
    memories.push(memory);
  }
  
  return memories;
}

function generateRandomDate(startYear = 2023, endYear = 2025) {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

function generateConcepts() {
  const concepts = [];
  const distribution = generateCategoryDistribution();
  let conceptId = 1;
  
  console.log('Generating 200 concepts with distribution:', distribution);
  
  for (const [categoryName, count] of Object.entries(distribution)) {
    const category = CATEGORIES.find(c => c.name === categoryName);
    const templates = CONCEPT_TEMPLATES[categoryName];
    
    for (let i = 0; i < count; i++) {
      // Cycle through templates if we need more concepts than templates
      const templateIndex = i % templates.length;
      let label = templates[templateIndex];
      
      // Add variation for repeated templates
      if (i >= templates.length) {
        const variation = Math.floor(i / templates.length) + 1;
        label = `${label} ${variation}`;
      }
      
      const createdAt = generateRandomDate(2023, 2024);
      const updatedAt = new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime()));
      
      const concept = {
        id: `concept_${conceptId.toString().padStart(3, '0')}`,
        label,
        content: `Detailed thoughts and knowledge about ${label}`,
        color: category.color,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        metadata: {
          category: categoryName,
          memories: generateMemories(label),
          tags: [categoryName.toLowerCase(), 'generated', 'test-data'],
          importance: Math.floor(Math.random() * 10) + 1, // 1-10
          lastAccessed: updatedAt.toISOString()
        }
      };
      
      concepts.push(concept);
      conceptId++;
    }
  }
  
  return concepts;
}

function main() {
  console.log('Generating 200 ConceptNodes for Session 5 collision testing...');
  
  const concepts = generateConcepts();
  
  // Verify we have exactly 200 concepts
  if (concepts.length !== 200) {
    console.error(`Expected 200 concepts, got ${concepts.length}`);
    process.exit(1);
  }
  
  // Calculate category distribution
  const categoryStats = {};
  concepts.forEach(concept => {
    const category = concept.metadata.category;
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  const fixture = {
    concepts,
    metadata: {
      generated: new Date().toISOString(),
      count: concepts.length,
      session: 'session_5',
      runId: '20250820_004036_ALL-ALL',
      categories: Object.keys(categoryStats),
      categoryDistribution: categoryStats,
      description: 'Test fixture with 200 ConceptNodes for Session 5 collision resolution testing',
      generator: 'generate-200-concepts.js',
      totalMemories: concepts.reduce((sum, c) => sum + c.metadata.memories.length, 0)
    }
  };
  
  // Ensure the fixtures directory exists
  const fixturesDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  // Write the fixture file
  const outputPath = path.join(fixturesDir, 'concepts-200.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixture, null, 2));
  
  console.log('\n=== Generation Complete ===');
  console.log(`✅ Generated ${concepts.length} concepts`);
  console.log(`✅ File written to: ${outputPath}`);
  console.log(`✅ Total memories: ${fixture.metadata.totalMemories}`);
  console.log('\n--- Category Distribution ---');
  Object.entries(categoryStats).forEach(([category, count]) => {
    const percentage = (count / concepts.length * 100).toFixed(1);
    console.log(`${category}: ${count} concepts (${percentage}%)`);
  });
  
  // Validate basic structure
  console.log('\n--- Validation ---');
  const hasRequiredFields = concepts.every(c => 
    c.id && c.label && c.color && c.createdAt && c.updatedAt && c.metadata
  );
  console.log(`✅ Schema validation: ${hasRequiredFields ? 'PASS' : 'FAIL'}`);
  
  const dateRange = {
    min: Math.min(...concepts.map(c => new Date(c.createdAt).getTime())),
    max: Math.max(...concepts.map(c => new Date(c.createdAt).getTime()))
  };
  console.log(`✅ Date range: ${new Date(dateRange.min).getFullYear()} - ${new Date(dateRange.max).getFullYear()}`);
  
  const memoryRange = {
    min: Math.min(...concepts.map(c => c.metadata.memories.length)),
    max: Math.max(...concepts.map(c => c.metadata.memories.length))
  };
  console.log(`✅ Memory count range: ${memoryRange.min} - ${memoryRange.max} per concept`);
  
  console.log('\n🎯 Ready for Session 5 collision resolution testing!');
}

if (require.main === module) {
  main();
}

module.exports = { generateConcepts, CATEGORIES, CONCEPT_TEMPLATES };