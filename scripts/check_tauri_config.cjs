const fs = require('fs');

async function check() {
  const res = await fetch('https://schema.tauri.app/config/2');
  const json = await res.json();
  const win = json.definitions.WindowConfig;
  console.log('Window properties:', Object.keys(win.properties));
  if (win.properties.dragDropEnabled) {
    console.log('dragDropEnabled:', win.properties.dragDropEnabled);
  }
}
check();
