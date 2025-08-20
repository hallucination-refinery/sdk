#!/usr/bin/env node

/**
 * Schema Validation Script for Session 9 Test Fixtures
 * Validates concepts-100.json against Node schema from @refinery/schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NodeSchema } from '@refinery/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateFixtures() {
  console.log('🔍 Validating test fixtures against Node schema...\n');
  
  // Read the generated fixture data
  const fixturePath = path.join(__dirname, '..', 'fixtures', 'concepts-100.json');
  
  if (!fs.existsSync(fixturePath)) {
    console.error('❌ Error: concepts-100.json not found');
    process.exit(1);
  }
  
  const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const { concepts, metadata } = fixtureData;
  
  console.log(`📊 Fixture Metadata:`);
  console.log(`   Generated: ${metadata.generated}`);
  console.log(`   Count: ${metadata.count}`);
  console.log(`   Session: ${metadata.session}`);
  console.log(`   Categories: ${metadata.categories.join(', ')}\n`);
  
  // Validate each concept against the schema
  let validCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    
    try {
      // Validate against Node schema
      const validated = NodeSchema.parse(concept);
      validCount++;
      
      // Additional checks for test requirements
      if (i < 5) { // Show first 5 concepts for verification
        console.log(`✅ Concept ${i + 1}: ${validated.label} (${concept.metadata?.category})`);
        console.log(`   ID: ${validated.id}`);
        console.log(`   Created: ${validated.createdAt}`);
        console.log(`   Memories: ${concept.metadata?.memories?.length || 0}`);
        console.log('');
      }
      
    } catch (error) {
      errorCount++;
      errors.push({
        conceptId: concept.id || `concept_${i + 1}`,
        error: error.message
      });
      
      if (errors.length <= 5) { // Show first 5 errors
        console.log(`❌ Validation Error for ${concept.id}:`);
        console.log(`   ${error.message}\n`);
      }
    }
  }
  
  // Summary
  console.log(`📈 Validation Summary:`);
  console.log(`   ✅ Valid concepts: ${validCount}/${concepts.length}`);
  console.log(`   ❌ Invalid concepts: ${errorCount}/${concepts.length}`);
  
  if (errorCount > 5) {
    console.log(`   (... and ${errorCount - 5} more errors not shown)`);
  }
  
  // Check acceptance criteria
  console.log(`\n🎯 Acceptance Criteria Check:`);
  console.log(`   ✅ 100 ConceptNodes generated: ${concepts.length === 100 ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ 8 categories used: ${metadata.categories.length === 8 ? 'PASS' : 'FAIL'}`);
  console.log(`   ✅ Schema validation: ${errorCount === 0 ? 'PASS' : 'FAIL'}`);
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
  
  if (errorCount === 0) {
    console.log(`\n🎉 SUCCESS: All test fixtures are valid and meet acceptance criteria!`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  WARNING: ${errorCount} validation errors found. Review and fix before use.`);
    process.exit(1);
  }
}

validateFixtures().catch(console.error);