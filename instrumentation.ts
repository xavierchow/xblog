//import { startWatch } from '@/app/lib/watcher';
import { getMarkdownFilesFolder } from '@/app/lib/utils';
console.log('instrumentation runtime', process.env.NEXT_RUNTIME);
export async function register() {
  console.log('registering ...');
  console.log('inside register instrumentation runtime', process.env.NEXT_RUNTIME);

  if (process.env.WATCH_MARKDOWN === 'yes') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { startWatch } = await import('@/app/lib/watcher');
      const folder = getMarkdownFilesFolder();
      console.log('start watching ...');
      startWatch(folder);
      //console.log('stop watching.');
    }
  }
}
