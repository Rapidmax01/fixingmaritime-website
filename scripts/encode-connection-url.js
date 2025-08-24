#!/usr/bin/env node

// Helper script to properly encode database connection URLs

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Database Connection URL Encoder');
console.log('');

rl.question('Enter your database password (from gcloud-sql-credentials.txt): ', (password) => {
  rl.question('Enter your database IP address: ', (ip) => {
    rl.question('Enter your database username (default: maritime_user): ', (username) => {
      rl.question('Enter your database name (default: maritime): ', (database) => {
        
        const user = username || 'maritime_user';
        const db = database || 'maritime';
        
        // URL encode the password
        const encodedPassword = encodeURIComponent(password);
        
        // Build the connection string
        const connectionString = `postgresql://${user}:${encodedPassword}@${ip}:5432/${db}?sslmode=require`;
        
        console.log('');
        console.log('✅ Encoded connection string:');
        console.log('');
        console.log(connectionString);
        console.log('');
        console.log('📋 Use this command to import:');
        console.log(`node scripts/import-to-gcloud-sql.js "${connectionString}"`);
        console.log('');
        
        rl.close();
      });
    });
  });
});