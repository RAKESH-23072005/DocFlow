import fs from 'fs';
import path from 'path';

// Build verification script
function verifyBuild() {
  console.log('🔍 Verifying build output...');
  
  const distPath = './dist';
  const requiredFiles = [
    'index.js',           // Backend server
    'index.html',         // Frontend entry point
    'assets/'             // Frontend assets directory
  ];
  
  let allChecksPassed = true;
  
  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return false;
  }
  
  // Check required files
  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      allChecksPassed = false;
    }
  }
  
  // Check if backend file is executable
  const backendFile = path.join(distPath, 'index.js');
  if (fs.existsSync(backendFile)) {
    try {
      const content = fs.readFileSync(backendFile, 'utf8');
      if (content.includes('express') && content.includes('listen')) {
        console.log('✅ Backend file appears to be valid Express server');
      } else {
        console.log('❌ Backend file may not be a valid Express server');
        allChecksPassed = false;
      }
    } catch (error) {
      console.log('❌ Could not read backend file:', error.message);
      allChecksPassed = false;
    }
  }
  
  // Check if frontend assets exist
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    const hasJsFiles = assets.some(file => file.endsWith('.js'));
    const hasCssFiles = assets.some(file => file.endsWith('.css'));
    
    if (hasJsFiles) console.log('✅ JavaScript assets found');
    else {
      console.log('❌ No JavaScript assets found');
      allChecksPassed = false;
    }
    
    if (hasCssFiles) console.log('✅ CSS assets found');
    else {
      console.log('❌ No CSS assets found');
      allChecksPassed = false;
    }
  }
  
  if (allChecksPassed) {
    console.log('🎉 Build verification passed!');
    return true;
  } else {
    console.log('💥 Build verification failed!');
    return false;
  }
}

// Run verification if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = verifyBuild();
  process.exit(success ? 0 : 1);
}

export { verifyBuild };
