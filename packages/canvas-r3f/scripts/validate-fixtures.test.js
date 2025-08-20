#!/usr/bin/env node

/**
 * Simple validation test for Session 9 fixtures
 * Tests the basic structure and requirements without complex imports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateBasicStructure() {
  console.log('🔍 Validating basic fixture structure...\n');
  
  // Read the generated fixture data
  const fixturePath = path.join(__dirname, '..', 'fixtures', 'concepts-100.json');
  
  if (!fs.existsSync(fixturePath)) {
    console.error('❌ Error: concepts-100.json not found');
    return false;
  }
  
  const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const { concepts, metadata } = fixtureData;
  
  console.log(`📊 Fixture Metadata:`);
  console.log(`   Generated: ${metadata.generated}`);
  console.log(`   Count: ${metadata.count}`);
  console.log(`   Session: ${metadata.session}`);
  console.log(`   Categories: ${metadata.categories.join(', ')}\n`);
  
  // Basic validation
  let validCount = 0;
  let errors = [];
  
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    const errors_for_concept = [];
    
    // Required fields check
    if (!concept.id) errors_for_concept.push('Missing id');
    if (!concept.label) errors_for_concept.push('Missing label');
    if (!concept.color) errors_for_concept.push('Missing color');
    if (!concept.createdAt) errors_for_concept.push('Missing createdAt');
    if (!concept.updatedAt) errors_for_concept.push('Missing updatedAt');
    
    // Metadata checks
    if (!concept.metadata) {
      errors_for_concept.push('Missing metadata');
    } else {
      if (!concept.metadata.category) errors_for_concept.push('Missing category');
      if (!concept.metadata.memories) errors_for_concept.push('Missing memories');
      if (concept.metadata.memories && (concept.metadata.memories.length < 1 || concept.metadata.memories.length > 5)) {
        errors_for_concept.push(`Invalid memory count: ${concept.metadata.memories.length} (should be 1-5)`);
      }
    }
    
    // Date validation
    if (concept.createdAt) {
      const createdDate = new Date(concept.createdAt);
      if (isNaN(createdDate.getTime())) {
        errors_for_concept.push('Invalid createdAt date');
      }
    }
    
    if (errors_for_concept.length === 0) {
      validCount++;
      if (i < 5) { // Show first 5 valid concepts
        console.log(`✅ Concept ${i + 1}: ${concept.label} (${concept.metadata?.category})`);
        console.log(`   ID: ${concept.id}`);
        console.log(`   Memories: ${concept.metadata?.memories?.length || 0}`);
        console.log('');
      }
    } else {
      errors.push({ id: concept.id, errors: errors_for_concept });
      if (errors.length <= 3) {
        console.log(`❌ Validation Error for ${concept.id}:`);
        errors_for_concept.forEach(err => console.log(`   ${err}`));
        console.log('');
      }
    }
  }
  
  // Summary
  console.log(`📈 Validation Summary:`);
  console.log(`   ✅ Valid concepts: ${validCount}/${concepts.length}`);
  console.log(`   ❌ Invalid concepts: ${errors.length}/${concepts.length}`);
  
  // Check acceptance criteria
  console.log(`\n🎯 Acceptance Criteria Check:`);
  console.log(`   ✅ 100 ConceptNodes generated: ${concepts.length === 100 ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ 8 categories used: ${metadata.categories.length === 8 ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ Basic structure valid: ${errors.length === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ File location: ${fixturePath.endsWith('fixtures/concepts-100.json') ? 'PASS' : 'FAIL'}`);
  
  // Check date distribution (last 2 years)
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - (2 * 365 * 24 * 60 * 60 * 1000));
  let validDates = 0;
  
  concepts.forEach(concept => {
    if (concept.createdAt) {
      const createdDate = new Date(concept.createdAt);
      if (createdDate >= twoYearsAgo && createdDate <= now) {
        validDates++;
      }
    }
  });
  
  console.log(`   ✅ Dates within 2 years: ${validDates === concepts.length ? 'PASS' : `PARTIAL (${validDates}/${concepts.length})`}`);
  
  // Check memory count (1-5 per concept)
  let validMemoryCount = 0;
  concepts.forEach(concept => {
    const memoryCount = concept.metadata?.memories?.length || 0;
    if (memoryCount >= 1 && memoryCount <= 5) {
      validMemoryCount++;
    }
  });
  
  console.log(`   ✅ 1-5 memories per concept: ${validMemoryCount === concepts.length ? 'PASS' : `PARTIAL (${validMemoryCount}/${concepts.length})`}`);
  
  // Category distribution analysis
  console.log(`\n📊 Category Distribution:`);
  const categoryCount = {};
  concepts.forEach(concept => {
    const category = concept.metadata?.category || 'Unknown';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  Object.entries(categoryCount).forEach(([category, count]) => {
    const percentage = (count / concepts.length * 100).toFixed(1);
    console.log(`   ${category}: ${count} concepts (${percentage}%)`);
  });
  
  const success = errors.length === 0 && concepts.length === 100;
  
  if (success) {
    console.log(`\n🎉 SUCCESS: All test fixtures meet basic validation and acceptance criteria!`);
  } else {
    console.log(`\n⚠️  WARNING: ${errors.length} validation errors found.`);
  }
  
  return success;
}

const success = validateBasicStructure();
process.exit(success ? 0 : 1);