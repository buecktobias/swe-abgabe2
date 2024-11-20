import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('project.zip');
const archive = archiver('zip', {
  zlib: { level: 5 },
});

output.on('close', () => {
  console.log(`Archive created: ${archive.pointer()} total bytes`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

archive.directory('src/', false);

archive.finalize();
