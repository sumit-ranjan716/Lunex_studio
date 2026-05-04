#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();

function log(...args){ console.log('[hero-audit]', ...args) }

async function exists(p){ try{ await fs.access(p); return true }catch(e){ return false } }

async function findHeroImage(){
  const publicPath = path.join(root, 'public', 'assets');
  const srcPath = path.join(root, 'src', 'assets');
  const names = ['hero-bg', 'hero-bg-1', 'hero_background', 'hero'];
  const exts = ['.png','.jpg','.jpeg','.webp','.avif'];

  // search public/assets first
  if (await exists(publicPath)){
    const files = await fs.readdir(publicPath);
    for (const n of names){
      for (const e of exts){
        const candidate = `${n}${e}`;
        if (files.includes(candidate)) return {location:'public', path:`/assets/${candidate}`, fsPath:path.join(publicPath,candidate)};
      }
    }
  }

  // search src/assets
  if (await exists(srcPath)){
    const files = await fs.readdir(srcPath);
    for (const n of names){
      for (const e of exts){
        const candidate = `${n}${e}`;
        if (files.includes(candidate)) return {location:'src', path:`./src/assets/${candidate}`, fsPath:path.join(srcPath,candidate)};
      }
    }
  }

  return null;
}

async function audit(){
  log('Starting hero audit...');
  const htmlPath = path.join(root,'public','lunexstudio-portfolio.html');
  if (!await exists(htmlPath)){
    log('Could not find public/lunexstudio-portfolio.html — aborting');
    process.exitCode = 2; return;
  }

  const raw = await fs.readFile(htmlPath,'utf8');
  let content = raw;

  const foundImage = await findHeroImage();
  if (!foundImage){
    log('No hero image found in public/assets or src/assets');
  } else {
    log('Found hero image at', foundImage.fsPath, '-> use path', foundImage.path);

    // verify file size
    try{
      const stat = await fs.stat(foundImage.fsPath);
      if (stat.size === 0) log('Warning: image exists but file size is 0');
      else log('Image file size:', stat.size, 'bytes');
    }catch(e){ log('Failed to stat image:', e.message) }

    // Ensure #hero-canvas uses the correct path and standard background properties
    const heroCanvasRe = /#hero-canvas\s*\{[\s\S]*?\}/m;
    const standardCanvas = `#hero-canvas{\n  position:absolute;\n  inset:0;\n  z-index:0;\n  width:100%;\n  height:100%;\n  background-image: url('${foundImage.path}');\n  background-size: cover;\n  background-position: center right;\n  background-repeat: no-repeat;\n  pointer-events: none;\n}`;

    if (heroCanvasRe.test(content)){
      const before = content.match(heroCanvasRe)[0];
      if (!before.includes(foundImage.path) || !/background-size\s*:\s*cover/.test(before)){
        content = content.replace(heroCanvasRe, standardCanvas);
        log('Updated #hero-canvas block with standardized background-image and properties.');
      } else {
        log('#hero-canvas already references the image and looks ok.');
      }
    } else {
      // inject just after #hero selector if exists
      const insertAfter = '#hero{';
      const idx = content.indexOf(insertAfter);
      if (idx !== -1){
        // find closing brace for #hero block
        const start = idx;
        const closeIdx = content.indexOf('}', start);
        if (closeIdx !== -1){
          const insertPos = closeIdx + 1;
          content = content.slice(0, insertPos) + '\n' + standardCanvas + content.slice(insertPos);
          log('Inserted #hero-canvas block after #hero selector.');
        }
      }
    }

    // Ensure #hero has explicit height/min-height
    const heroRe = /#hero\s*\{([\s\S]*?)\}/m;
    if (heroRe.test(content)){
      const block = content.match(heroRe)[0];
      if (!/min-height\s*:\s*100vh|height\s*:\s*100vh|height\s*:\s*100vh;|min-height\s*:\s*100vh;/.test(block)){
        const updated = block.replace(/\}/, '  min-height:100vh;\n}');
        content = content.replace(block, updated);
        log('Added min-height:100vh to #hero.');
      } else log('#hero already has explicit height/min-height.');
    }

    // Inspect overlay and reduce extreme opacity if present (to reveal image)
    const overlayRe = /\.hero-overlay-left\s*\{([\s\S]*?)\}/m;
    if (overlayRe.test(content)){
      const block = content.match(overlayRe)[0];
      // simple heuristic: if there is rgba(3,3,3,.98) or similar, keep; if it's >= .98 -> reduce to .9 on stops nearer to center
      const reduced = block.replace(/rgba\(3,3,3,\s*0?\.9?8\)/g, 'rgba(3,3,3,0.90)');
      if (reduced !== block){
        content = content.replace(block, reduced);
        log('Reduced extreme left-overlay opacity to make image more visible.');
      } else log('Overlay left opacity looks reasonable.');
    }
  }

  // Check for background-image references elsewhere (inline styles in components)
  const bgRegex = /background-image\s*:\s*url\(([^)]+)\)/g;
  let match; let fixes = 0;
  while ((match = bgRegex.exec(content)) !== null){
    const url = match[1].replace(/["']+/g,'').trim();
    if (url.startsWith('assets/') || url.startsWith('./assets/') || url.startsWith('/assets/')){
      // normalize to leading slash for public assets
      if (!url.startsWith('/')){
        const newUrl = '/' + url.replace(/^\.\//,'');
        content = content.replace(match[0], `background-image: url('${newUrl}')`);
        fixes++;
      }
    }
  }
  if (fixes) log('Normalized', fixes, 'background-image URL(s) to root-relative paths.');

  // If content changed, write file
  if (content !== raw){
    await fs.writeFile(htmlPath, content, 'utf8');
    log('Wrote changes to', htmlPath);
  } else {
    log('No changes necessary to', htmlPath);
  }

  log('Audit complete. Please hard-refresh your dev server (Ctrl+F5) and check the hero visually.');
}

audit().catch(err=>{ console.error(err); process.exitCode=1; });
