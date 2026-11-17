const fs = require('fs');
const path = require('path');

const { HMPS_CLASSES, HMPS_SUBJECTS, HMPS_TEACHERS, HMPS_TIME_SLOTS } = require('../src/lib/hmpsData.ts');

function isPhysicalOrYogaSubject(sub) {
  const name = sub.name.toLowerCase();
  const code = sub.code.toLowerCase();
  const cat = sub.category.toLowerCase();
  return cat === 'sports' || /yoga|sport|dance|physical|pe|p\.e\.|gym|drill/i.test(name) || /yoga|sport|pe/i.test(code);
}

function isPlayfulActivitySubject(sub) {
  const cat = sub.category.toLowerCase();
  if (cat === 'activity' || cat === 'sports') return true;
  const name = sub.name.toLowerCase();
  return /art|craft|dance|music|yoga|sport|lib|club|supw|circle|skill/i.test(name);
}

console.log('Testing Block Periods, Post-Lunch Safety, and Playful Activity Spreading...');

// Find computer subject
const compSub = HMPS_SUBJECTS.find(s => s.code.startsWith('COMP-6'));
console.log('Computer subject:', compSub?.name, compSub?.id);

// Find lunch index in HMPS_TIME_SLOTS
const lunchSlot = HMPS_TIME_SLOTS.find(ts => ts.type === 'lunch' || /lunch/i.test(ts.label));
console.log('Lunch slot index:', lunchSlot?.index, lunchSlot?.label, lunchSlot?.startTime);

// Find physical subjects
const physicalSubs = HMPS_SUBJECTS.filter(isPhysicalOrYogaSubject);
console.log('Physical subjects count:', physicalSubs.length, physicalSubs.map(s => s.name).slice(0, 5));

// Find playful subjects
const playfulSubs = HMPS_SUBJECTS.filter(isPlayfulActivitySubject);
console.log('Playful subjects count:', playfulSubs.length, playfulSubs.map(s => s.name).slice(0, 8));
