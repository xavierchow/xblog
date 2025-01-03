import { watch, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

const ac = new AbortController();
const { signal } = ac;
//setTimeout(() => ac.abort(), 30000);

export async function startWatch(folder: string) {
  try {
    const watcher = watch(folder, { signal });
    for await (const event of watcher) {
      // TODO debounce the same file
      console.log(event);
      if (!event.filename?.endsWith('md')) {
        continue;
      }
      await changeTriggerSourceFile(event.filename);
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return;
    }
    throw err;
  }
}

async function changeTriggerSourceFile(changedFile: string) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const triggerPath = resolve(__dirname, './fresh-trigger.ts');
  const contents = await readFile(triggerPath, { encoding: 'utf8' });
  const newSeed = `${dayjs().unix()}_${changedFile}`;

  console.log('old contents %s', contents);
  const newContents = contents.replace(/return .*/, `return '${newSeed}'; `);
  console.log('new contents %s', newContents);
  // TODO caveat, it is unsafe to write to the same file multiple times before promsie settled
  // but here it is a tiny file, should be fast enough
  await writeFile(triggerPath, newContents);
}
