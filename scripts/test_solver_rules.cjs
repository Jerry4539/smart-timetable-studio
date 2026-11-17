const fs = require('fs');
const path = require('path');

// Read files from school_csv
const dir = path.join(__dirname, '..', 'data', 'school_csv');
const { parseCSV } = require('./test_csv_detection.cjs');

// Let's import the data from hmpsData.ts or school_csv
const { HMPS_CLASSES, HMPS_SUBJECTS, HMPS_TEACHERS, HMPS_TIME_SLOTS } = require('../src/lib/hmpsData.ts') || {};

console.log('Testing solver rules on HMPS dataset...');
