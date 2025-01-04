import { getMarkdownFilesFolder } from '@/app/lib/utils';
console.log('instrumentation runtime', process.env.NEXT_RUNTIME);
export async function register() {
  console.log('registering... instrumentation runtime %s', process.env.NEXT_RUNTIME);

  if (process.env.WATCH_MARKDOWN === 'yes') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { startWatch } = await import('@/app/lib/watcher');
      const folder = getMarkdownFilesFolder();
      console.log('start watching markdown files in %s ...', folder);
      // DO NOT await startWatch, otherwise it blocks the nextjs booting
      startWatch(folder);
      //console.log('stop watching.');
    }
  }
}
