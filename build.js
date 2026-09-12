// Simple build script for Study Hub
// Ensure all essential dependencies are available

const fs = require('fs');
const path = require('path');

function checkDependencies() {
  const requiredFiles = [
    'index.html',
    'app.js',
    'styles.css',
    'cloud-core.js',
    'question-bank.js',
    'studymap-data.js',
    'subject-labs.js'
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

function checkInlineSafety() {
  console.log('\n🔒 Checking inline-bundle safety ($& corruption guard)...');

  // Guard against a known bundling bug: using a STRING as the replacement in
  // String.prototype.replace expands $& / $1 / $` / $' patterns found inside
  // the JS being inlined (e.g. the '$&' in renderMarkdown), which can inject
  // a literal </script> and truncate the bundle. Always use function
  // replacements when inlining scripts.
  const filesToCheck = ['index.html'];
  try {
    if (fs.existsSync('.qa/index.html')) filesToCheck.push('.qa/index.html');
  } catch (e) { /* ignore */ }

  const problems = [];
  for (const file of filesToCheck) {
    const html = fs.readFileSync(file, 'utf8');
    // Known corruption signature from the $&-expansion bug
    if (html.includes('<ul><script src="app.js"></script></ul>')) {
      problems.push(file + ': corrupted $&-expanded string detected');
    }
    // Any inline <script> whose body contains a literal </script> terminates
    // early and would truncate the script.
    const inlineRe = /<script>([\s\S]*?)<\/script>/g;
    let m;
    while ((m = inlineRe.exec(html)) !== null) {
      const body = m[1];
      const truncated = body.match(/<\/script>/);
      if (truncated) {
        problems.push(file + ': inline script contains literal </script> (truncation risk)');
      }
    }
  }

  if (problems.length > 0) {
    console.error('❌ Inline-safety check failed:');
    problems.forEach(p => console.error('   - ' + p));
    return false;
  }
  console.log('✅ No corruption or truncation patterns found');
  return true;
}

function validateBuild() {
  console.log('\n🏗️ Building Study Hub...');

  const steps = [
    { name: 'Checking dependencies', fn: checkDependencies },
    { name: 'Validating file integrity', fn: checkFileIntegrity },
    { name: 'Checking inline-bundle safety', fn: checkInlineSafety },
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
