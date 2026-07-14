// Simple build script for Study Hub
// Ensure all essential dependencies are available

const fs = require('fs');
const path = require('path');

function checkDependencies() {
  const requiredFiles = [
    'index.html',
    'app.js',
    'styles.css',
    'cloud-core.js'
  ];

  console.log('🔍 Checking required files...');
  const missing = [];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      missing.push(file);
    } else {
      const stats = fs.statSync(file);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${file} (${size} KB)`);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing files:', missing.join(', '));
    return false;
  }

  return true;
}

function checkFileIntegrity() {
  console.log('\n📋 Checking file content integrity...');

  try {
    // Check for essential functions
    const appContent = fs.readFileSync('app.js', 'utf8');
    const essentialFunctions = [
      'function init()',
      'function saveState()',
      'function uid(',
      'function showTab('
    ];

    const missingFunctions = [];
    for (const func of essentialFunctions) {
      if (!appContent.includes(func)) {
        missingFunctions.push(func);
      }
    }

    if (missingFunctions.length > 0) {
      console.error('❌ app.js missing essential functions:', missingFunctions.join(', '));
      return false;
    }

    console.log('✅ app.js contains all essential functions');
    return true;
  } catch (error) {
    console.error('❌ Error checking file integrity:', error.message);
    return false;
  }
}

function validateBuild() {
  console.log('\n🏗️ Building Study Hub...');

  const steps = [
    { name: 'Checking dependencies', fn: checkDependencies },
    { name: 'Validating file integrity', fn: checkFileIntegrity },
  ];

  let stepIndex = 0;

  function runNextStep() {
    if (stepIndex >= steps.length) {
      console.log('\n✅ Build completed successfully!');
      console.log('\n🚀 Next steps:');
      console.log('   1. Open index.html in a modern browser (Chrome, Firefox, Safari)');
      console.log('   2. The app will automatically initialize with cloud sync enabled');
      console.log('   3. Explore the dashboard and main features');
      console.log('   4. Check browser console for any errors (F12)');
      return;
    }

    const step = steps[stepIndex];
    console.log(`\n📝 Step ${stepIndex + 1}/${steps.length}: ${step.name}`);

    try {
      if (step.fn()) {
        stepIndex++;
        setTimeout(runNextStep, 1000); // Add small delay between steps
      } else {
        console.error(`\n❌ ${step.name} failed. Build aborted.`);
      }
    } catch (error) {
      console.error(`\n❌ Error in ${step.name}:`, error.message);
    }
  }

  runNextStep();
}

// Run validation
validateBuild();
