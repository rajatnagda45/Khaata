const fs = require('fs');
const path = require('path');

const map = {
  '#FFFFFF': 'var(--white)',
  '#F9FAFB': 'var(--gray-50)',
  '#F3F4F6': 'var(--gray-100)',
  '#EBEBEF': 'var(--gray-150)',
  '#E5E7EB': 'var(--gray-200)',
  '#D1D5DB': 'var(--gray-300)',
  '#9CA3AF': 'var(--gray-400)',
  '#6B7280': 'var(--gray-500)',
  '#4B5563': 'var(--gray-600)',
  '#374151': 'var(--gray-700)',
  '#1F2937': 'var(--gray-800)',
  '#111827': 'var(--gray-900)',
  '#030712': 'var(--gray-950)',
  '#16A34A': 'var(--accent)',
  '#14532D': 'var(--accent-light)', // Wait, checking index.css for accents
  '#15803D': 'var(--accent-hover)',
  
  // Also semantic colors that were hardcoded
  '#FEF2F2': 'var(--status-overdue-bg)',
  '#FECACA': 'var(--status-overdue-border)',
  '#991B1B': 'var(--status-overdue-text)',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace hex codes
      for (const [hex, variable] of Object.entries(map)) {
        // Case insensitive global replace of the hex
        const regex = new RegExp(hex, 'gi');
        content = content.replace(regex, variable);
      }
      
      // Replace bg-white
      content = content.replace(/\bbg-white\b/g, 'bg-[var(--white)]');
      
      // Note: intentionally skipping text-white so buttons like "New Invoice" don't become text-[var(--white)] which is black in dark mode.
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

const targetDir = path.join(__dirname, '../src');
processDirectory(targetDir);
console.log('Colors replaced successfully!');
