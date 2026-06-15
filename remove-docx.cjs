const fs = require('fs');
let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

// Remove DOCX from sticky export bar
content = content.replace(/<Button\s+size="sm"\s+variant="outline"\s+onClick=\{\(\) => \{[\s\S]*?<FileType className="mr-1\.5 h-4 w-4" \/> DOCX\s+<\/Button>/m, '');

// Remove DOCX from sidebar export block
content = content.replace(/<Button\s+variant="outline"\s+onClick=\{\(\) => \{[\s\S]*?<FileType className="mr-2 h-4 w-4" \/> DOCX\s+<\/Button>/m, '');

// If the user meant they want ONE unified button block, maybe remove the sidebar export block altogether? 
// The sidebar has: <div className="grid grid-cols-2 gap-3 pt-4 border-t"> ... </div>
// Wait, removing DOCX alone makes it 2 buttons: PDF and Print. "one pdf link to donwload opstoin and print opstion"
// Let's just remove the entire sidebar export block so there is ONLY the sticky bar! That perfectly matches "make it one...".
content = content.replace(/{hasOutput && \([\s\S]*?<div className="grid grid-cols-2 gap-3 pt-4 border-t">[\s\S]*?<Printer className="mr-2 h-4 w-4" \/> Print\s*<\/Button>\s*<\/div>\s*\)}\s*<\/Card>/m, '</Card>');

fs.writeFileSync('src/routes/index.tsx', content);
console.log('Successfully simplified export options to only one PDF and Print location!');
