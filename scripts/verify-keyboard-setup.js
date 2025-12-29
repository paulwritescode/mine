#!/usr/bin/env node

/**
 * Verification script for the new keyboard handling setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying modern keyboard handling setup...\n');

// Check if new files exist
const newFiles = [
  'src/hooks/useKeyboard.ts',
  'src/hooks/useKeyboardController.ts',
  'src/components/KeyboardAvoidingWrapper.tsx',
  'src/components/KeyboardAwareForm.tsx',
  'src/components/KeyboardAnimatedView.tsx',
  'src/keyboard/index.ts',
  'src/examples/KeyboardExamples.tsx',
  'docs/keyboard-handling-guide.md'
];

let allFilesExist = true;

console.log('📁 Checking new keyboard files:');
newFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if old files are removed
const oldFiles = [
  'src/hooks/useSimpleKeyboard.ts',
  'src/components/KeyboardManager.tsx',
  'src/components/KeyboardDebugPanel.tsx',
  'src/utils/debugKeyboard.ts',
  'src/utils/keyboardUtils.ts',
  'scripts/test-keyboard.js',
  'docs/keyboard-handling.md',
  'docs/android-keyboard-fix.md'
];

console.log('\n🗑️  Checking old files are removed:');
oldFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`✅ ${file} removed`);
  } else {
    console.log(`❌ ${file} still exists`);
    allFilesExist = false;
  }
});

// Check package.json for required dependencies
console.log('\n📦 Checking dependencies:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'react-native-keyboard-controller',
  'react-native-reanimated'
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} missing`);
    allFilesExist = false;
  }
});

// Check app.json configuration
console.log('\n⚙️  Checking app.json configuration:');
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
if (appJson.expo?.android?.softwareKeyboardLayoutMode === 'pan') {
  console.log('✅ Android softwareKeyboardLayoutMode: pan');
} else {
  console.log('❌ Android softwareKeyboardLayoutMode not set to "pan"');
  allFilesExist = false;
}

// Check _layout.tsx for KeyboardProvider
console.log('\n🏗️  Checking root layout:');
const layoutContent = fs.readFileSync('app/_layout.tsx', 'utf8');
if (layoutContent.includes('KeyboardProvider')) {
  console.log('✅ KeyboardProvider found in _layout.tsx');
} else {
  console.log('❌ KeyboardProvider not found in _layout.tsx');
  allFilesExist = false;
}

// Check updated screens
console.log('\n📱 Checking updated screens:');
const screensToCheck = [
  'app/post-capture.tsx',
  'app/create-project.tsx'
];

screensToCheck.forEach(screen => {
  if (fs.existsSync(screen)) {
    const content = fs.readFileSync(screen, 'utf8');
    const hasNewKeyboard = content.includes('useKeyboard') && content.includes('KeyboardAvoidingWrapper');
    const hasOldKeyboard = content.includes('useSimpleKeyboard') || content.includes('KeyboardManager');
    
    console.log(`${screen}:`);
    console.log(`  - Uses new keyboard system: ${hasNewKeyboard ? '✅' : '❌'}`);
    console.log(`  - Uses old keyboard system: ${hasOldKeyboard ? '❌' : '✅'}`);
    
    if (!hasNewKeyboard || hasOldKeyboard) {
      allFilesExist = false;
    }
  }
});

console.log('\n' + '='.repeat(60));

if (allFilesExist) {
  console.log('🎉 Modern keyboard handling setup complete!');
  console.log('\n✨ New Features:');
  console.log('• Clean, modern keyboard handling based on Expo guide');
  console.log('• Basic useKeyboard hook for simple cases');
  console.log('• Advanced useKeyboardController for smooth animations');
  console.log('• KeyboardAvoidingWrapper for simple screens');
  console.log('• KeyboardAwareForm for multi-input forms');
  console.log('• KeyboardAnimatedView for chat-like interfaces');
  console.log('• Comprehensive examples and documentation');
  
  console.log('\n🚀 Ready to use:');
  console.log('1. Import from src/keyboard/index.ts');
  console.log('2. Use KeyboardAvoidingWrapper for simple screens');
  console.log('3. Use KeyboardAwareForm for complex forms');
  console.log('4. Check docs/keyboard-handling-guide.md for examples');
  console.log('5. See src/examples/KeyboardExamples.tsx for usage patterns');
  
} else {
  console.log('❌ Setup incomplete. Please check the issues above.');
}

console.log('\n📖 Documentation: docs/keyboard-handling-guide.md');
console.log('🔧 Examples: src/examples/KeyboardExamples.tsx');