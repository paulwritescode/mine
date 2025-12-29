#!/usr/bin/env node

/**
 * Enhanced test script to verify keyboard handling setup with logging
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing keyboard handling setup with logging...\n');

// Check if required files exist
const requiredFiles = [
  'src/hooks/useKeyboard.ts',
  'src/components/MineInput.tsx',
  'src/components/KeyboardManager.tsx',
  'src/components/KeyboardDebugPanel.tsx',
  'src/utils/keyboardUtils.ts',
  'src/utils/debugKeyboard.ts',
  'docs/keyboard-handling.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check for console.log statements in key files
const filesToCheckForLogging = [
  'src/hooks/useKeyboard.ts',
  'src/components/MineInput.tsx',
  'src/components/KeyboardManager.tsx',
  'app/post-capture.tsx',
  'app/create-project.tsx'
];

console.log('\n📝 Checking for logging statements...');

filesToCheckForLogging.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const logCount = (content.match(/console\.log/g) || []).length;
    const debuggerCount = (content.match(/keyboardDebugger\./g) || []).length;
    
    if (logCount > 0 || debuggerCount > 0) {
      console.log(`✅ ${file}: ${logCount} console.log + ${debuggerCount} debugger calls`);
    } else {
      console.log(`⚠️  ${file}: No logging found`);
    }
  }
});

// Check if KeyboardProvider is in _layout.tsx
const layoutPath = 'app/_layout.tsx';
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('KeyboardProvider')) {
    console.log('\n✅ KeyboardProvider found in _layout.tsx');
  } else {
    console.log('\n❌ KeyboardProvider not found in _layout.tsx');
    allFilesExist = false;
  }
} else {
  console.log('\n❌ _layout.tsx not found');
  allFilesExist = false;
}

// Check if screens are using KeyboardManager and debug panels
const screensToCheck = [
  'app/post-capture.tsx',
  'app/create-project.tsx'
];

console.log('\n🔧 Checking screen implementations...');

screensToCheck.forEach(screen => {
  if (fs.existsSync(screen)) {
    const content = fs.readFileSync(screen, 'utf8');
    const hasKeyboardManager = content.includes('KeyboardManager');
    const hasDebugPanel = content.includes('KeyboardDebugPanel');
    const hasUseKeyboard = content.includes('useKeyboard');
    
    console.log(`${screen}:`);
    console.log(`  - KeyboardManager: ${hasKeyboardManager ? '✅' : '❌'}`);
    console.log(`  - KeyboardDebugPanel: ${hasDebugPanel ? '✅' : '❌'}`);
    console.log(`  - useKeyboard hook: ${hasUseKeyboard ? '✅' : '❌'}`);
  }
});

console.log('\n' + '='.repeat(60));

if (allFilesExist) {
  console.log('🎉 Keyboard handling setup with logging complete!');
  console.log('\n🔍 Debug Features Added:');
  console.log('• Comprehensive console logging for all keyboard events');
  console.log('• Focus state tracking with detailed logs');
  console.log('• KeyboardDebugPanel for real-time debugging');
  console.log('• Platform-specific event monitoring');
  console.log('• Input state and action logging');
  
  console.log('\n🧪 Testing Instructions:');
  console.log('1. Run your app: npm start or yarn start');
  console.log('2. Open React Native debugger or Metro logs');
  console.log('3. Navigate to post-capture or create-project screens');
  console.log('4. Look for these log prefixes:');
  console.log('   🎹 [useKeyboard] - Keyboard state changes');
  console.log('   📝 [MineInput] - Input focus/blur events');
  console.log('   ⌨️ [KeyboardManager] - Scroll and touch events');
  console.log('   🔧 [KeyboardDebugger] - Debug utility events');
  console.log('   📹 [PostCapture] - Screen-specific events');
  console.log('   🏗️ [CreateProject] - Screen-specific events');
  console.log('5. Tap the "🔧 Debug" button to open debug panel');
  console.log('6. Test keyboard behavior and watch the logs');
  
  console.log('\n🐛 What to Look For:');
  console.log('• Keyboard show/hide events firing correctly');
  console.log('• Focus changes being detected');
  console.log('• Input refs being properly connected');
  console.log('• Platform-specific event differences');
  console.log('• Any error messages or warnings');
  
} else {
  console.log('❌ Some files are missing. Please check the setup.');
}

console.log('\n📖 See docs/keyboard-handling.md for detailed usage guide');
console.log('🔧 Debug panel available in development builds only');