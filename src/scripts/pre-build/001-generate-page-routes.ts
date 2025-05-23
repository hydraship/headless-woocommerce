/* eslint-disable no-console */
import * as fs from 'fs';
import path from 'path';

import { maybeCreateDir } from '@src/scripts/utils';
import { getPageRoutes } from '@src/lib/typesense/page';

export default async function execute() {
  console.log('generating page/post routes');
  try {
    await maybeCreateDir('public/routes');
    const permalinks = await getPageRoutes();
    const pageFilePath = path.join(process.cwd(), 'public/routes', 'page.json');
    fs.writeFileSync(pageFilePath, JSON.stringify(permalinks), {
      encoding: 'utf-8',
    });

    console.log(`Generated page routes: ${pageFilePath}`);
  } catch (error) {
    console.error('Error generating page routes:', error);
  }
}
