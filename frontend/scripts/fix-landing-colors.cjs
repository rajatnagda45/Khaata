const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, '../../landing.html'),
  path.join(__dirname, '../public/landing.html')
];

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');

  // Add nav variables
  content = content.replace(
    '--border-md:  rgba(0,0,0,0.12);\n    }',
    '--border-md:  rgba(0,0,0,0.12);\n      --nav-bg:     rgba(255,255,255,0.85);\n      --nav-scrolled: rgba(255,255,255,0.96);\n    }'
  );
  content = content.replace(
    '--border-md:  rgba(255,255,255,0.12);\n    }',
    '--border-md:  rgba(255,255,255,0.12);\n      --nav-bg:     rgba(0,0,0,0.85);\n      --nav-scrolled: rgba(0,0,0,0.96);\n    }'
  );

  // Replace hardcoded colors
  content = content.replace(/background: rgba\(255,255,255,0\.85\);/g, 'background: var(--nav-bg);');
  content = content.replace(/background: rgba\(255,255,255,0\.96\);/g, 'background: var(--nav-scrolled);');
  
  content = content.replace(/background: linear-gradient\(180deg, #FAFAFA 0%, #FFFFFF 100%\);/g, 'background: linear-gradient(180deg, var(--surface) 0%, var(--white) 100%);');
  content = content.replace(/background: white;/g, 'background: var(--white);');
  content = content.replace(/background: #F5F5F5;/g, 'background: var(--surface);');
  content = content.replace(/background: #FFFCFC;/g, 'background: var(--surface);'); // Muted red card
  content = content.replace(/background: #F0F0F0;/g, 'background: var(--surface);');
  
  // Text colors
  content = content.replace(/color: #0A0A0A;/g, 'color: var(--ink);');
  content = content.replace(/color: #6B6B6B;/g, 'color: var(--ink-40);');
  content = content.replace(/color: #9E9E9E;/g, 'color: var(--ink-20);');

  // Other borders
  content = content.replace(/border-bottom:1px solid #F0F0F0;/g, 'border-bottom:1px solid var(--border);');
  content = content.replace(/border-bottom:1px solid #F9F9F9;/g, 'border-bottom:1px solid var(--border);');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Landing page colors updated');
