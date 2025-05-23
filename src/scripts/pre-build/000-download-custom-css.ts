/* eslint-disable no-console */
import { maybeCreateDir } from '@src/scripts/utils';
import * as fs from 'fs';
import path from 'path';

const createCssFile = (file: string, cssContent: string) => {
  const customCssPath = path.join(process.cwd(), 'src/styles/custom/', file);
  fs.writeFileSync(customCssPath, cssContent, {
    encoding: 'utf-8',
    flag: 'w',
  });
};

export default async function execute() {
  // we will have define what files we are going to pull from windpress data
  const customCssfiles = [
    'pop-up-search-result.css',
    'header-main-navigation.css',
    'footer.css',
    'product/gallery.css',
    'product/product.css',
    'page.css',
    'post.css',
    'category.css',
    'gravity-form.css',
  ];
  const wpSite = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;
  if (!wpSite) {
    console.error('WordPress site URL is not defined.');
    return;
  }
  await maybeCreateDir('src/styles/custom/');
  await maybeCreateDir('src/styles/custom/product/');
  for (const file of customCssfiles) {
    /**
     * NOTE: if the file wasn't deleted in uploads folder it will still exist and therefore will be created in the frontend
     */
    const url = `${wpSite}/wp-content/uploads/windpress/data/${file}`;
    try {
      const response = await fetch(url, { redirect: 'manual' });

      if (!response.ok) {
        console.error(`Failed to download ${file}:`, response.status, ' status ');
        // We still create the file so that the file exist but with empty content
        createCssFile(file, '');
        continue;
      }

      const cssText = await response.text();
      createCssFile(file, cssText);
      console.log(`${file} successfully created/updated.`);
    } catch (error) {
      console.error('Error downloading custom css :', file, error);
      // Since it has error we still have to create the css files since that is being imported in css
      createCssFile(file, '');
    }
  }
}
