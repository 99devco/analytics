import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function generateSRI(filePath) {
  const fileContent = readFileSync(filePath);
  
  const sha256 = createHash('sha256').update(fileContent).digest('base64');
  const sha384 = createHash('sha384').update(fileContent).digest('base64');
  const sha512 = createHash('sha512').update(fileContent).digest('base64');
  
  return {
    256: `sha256-${sha256}`,
    384: `sha384-${sha384}`,
    512: `sha512-${sha512}`
  };
}

function main() {
  const analyticsJsPath = resolve(process.cwd(), 'dist/analytics.js');
  const analyticsEsJsPath = resolve(process.cwd(), 'dist/analytics.es.js');
  
  try {
    const analyticsJsHashes = generateSRI(analyticsJsPath);
    const analyticsEsJsHashes = generateSRI(analyticsEsJsPath);
    
    const shasJson = {
      'analytics.js': analyticsJsHashes,
      'analytics.es.js': analyticsEsJsHashes
    };
    
    const outputPath = resolve(process.cwd(), 'shas.json');
    writeFileSync(outputPath, JSON.stringify(shasJson, null, 2));
    
    console.log('✅ SRI hashes generated successfully:');
    console.log('\n📦 analytics.js (IIFE - for <script> tags):');
    console.log(`   SHA-256: ${analyticsJsHashes[256]}`);
    console.log(`   SHA-384: ${analyticsJsHashes[384]}`);
    console.log(`   SHA-512: ${analyticsJsHashes[512]}`);
    
    console.log('\n📦 analytics.es.js (ES Module - for <script type="module">):');
    console.log(`   SHA-256: ${analyticsEsJsHashes[256]}`);
    console.log(`   SHA-384: ${analyticsEsJsHashes[384]}`);
    console.log(`   SHA-512: ${analyticsEsJsHashes[512]}`);
    
    console.log(`\n📄 Written to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating SRI hashes:', error.message);
    process.exit(1);
  }
}

main(); 