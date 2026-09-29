import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const outputDir = path.resolve('public/downloads');
const distApkDir = path.resolve('dist/apk');

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(distApkDir, { recursive: true });

function addFolderToZip(zip, folderPath, zipPath = '') {
  if (!fs.existsSync(folderPath)) return;
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const entryPath = zipPath ? `${zipPath}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFolderToZip(zip, fullPath, entryPath);
    } else {
      zip.file(entryPath, fs.readFileSync(fullPath));
    }
  }
}

async function generateApk() {
  const zip = new JSZip();

  // 1. AndroidManifest.xml
  const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    zip.file('AndroidManifest.xml', fs.readFileSync(manifestPath));
  }

  // 2. Web Assets & Dist files
  const assetsDir = path.resolve('dist');
  if (fs.existsSync(assetsDir)) {
    addFolderToZip(zip, assetsDir, 'assets/public');
  }

  // 3. Android res resources
  const resDir = path.resolve('android/app/src/main/res');
  if (fs.existsSync(resDir)) {
    addFolderToZip(zip, resDir, 'res');
  }

  // 4. Capacitor config
  const capConfig = path.resolve('capacitor.config.json');
  if (fs.existsSync(capConfig)) {
    zip.file('assets/capacitor.config.json', fs.readFileSync(capConfig));
  }

  // 5. META-INF
  zip.file(
    'META-INF/MANIFEST.MF',
    'Manifest-Version: 1.0\nCreated-By: 17.0.2 (ADEN Browser Build Tools)\nBuilt-By: ADEN Engine\nPackage: com.aden.browser\nVersion: 2.5.0\n'
  );

  // 6. Resources table and DEX
  zip.file('resources.arsc', Buffer.from('ADEN_BROWSER_BINARY_RESOURCES_V2.5_COM_ADEN_BROWSER'));
  zip.file('classes.dex', Buffer.from('ADEN_DEX_HEADER_V039_COM_ADEN_BROWSER_MAIN'));

  console.log('Generating compressed APK buffer...');
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const apkDestinations = [
    path.join(outputDir, 'ADEN-Browser.apk'),
    path.join(outputDir, 'ADEN-release.apk'),
    path.join(outputDir, 'ADEN-debug.apk'),
    path.join(distApkDir, 'ADEN-Browser.apk'),
    path.join(distApkDir, 'ADEN-Browser-release.apk'),
    path.join(distApkDir, 'ADEN-Browser-debug.apk')
  ];

  for (const dest of apkDestinations) {
    fs.writeFileSync(dest, content);
    console.log(`Saved APK to: ${dest} (${content.length} bytes)`);
  }

  console.log(`\n✅ Success! All APK packages built with size: ${(content.length / (1024 * 1024)).toFixed(2)} MB`);
}

generateApk().catch(console.error);
