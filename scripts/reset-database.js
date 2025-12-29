#!/usr/bin/env node

/**
 * Database Reset Utility
 * 
 * This script helps reset the database during development when there are
 * foreign key constraint issues or other database problems.
 */

const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '..', 'SQLite', 'mine.db');

async function resetDatabase() {
  try {
    console.log('🗄️  Resetting database...');
    
    // Check if database file exists
    if (fs.existsSync(DATABASE_PATH)) {
      // Remove the database file
      fs.unlinkSync(DATABASE_PATH);
      console.log('✅ Database file removed successfully');
    } else {
      console.log('ℹ️  Database file does not exist, nothing to remove');
    }
    
    console.log('🚀 Database reset complete. The app will recreate the database on next launch.');
    
  } catch (error) {
    console.error('❌ Failed to reset database:', error.message);
    process.exit(1);
  }
}

// Run the reset
resetDatabase();