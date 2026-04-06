const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Huu Tin/.gemini/antigravity/brain/75d1a395-1f7d-426b-9455-227eb0548c04/.system_generated/steps/297/content.md').toString().split('\n').slice(4).join('\n'));
fs.writeFileSync('C:/Users/Huu Tin/.gemini/antigravity/brain/75d1a395-1f7d-426b-9455-227eb0548c04/paths.json', JSON.stringify(Object.keys(data.paths), null, 2));
