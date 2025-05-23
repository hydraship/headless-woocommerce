/* eslint-disable no-console */
import fs from 'fs';
import path, { resolve } from 'path';

import dotenv from 'dotenv';

function loadEnvFile() {
  let envFilePath = '.env.local'; // Default to .env.local for development

  // Check if the environment is production
  if (process.env.NODE_ENV === 'production') {
    envFilePath = '.env.production.local'; // Use .env.production.local for production
  }

  // Load environment variables from the determined file path
  dotenv.config({ path: resolve(__dirname, '..', '..', envFilePath) });
}

// Call the function to load the environment file
loadEnvFile();

export const scriptRunner = async (script: string | undefined) => {
  if (script) {
    const { default: defaultFunc } = await import(`./pre-build/${script}`);
    try {
      console.log(`Running pre-build script '${script}'`);
      await defaultFunc({ env: process.env });
    } catch (e) {
      console.error(`SCRIPT RUNNER: failed to execute pre-build script '${script}'`);
      console.error(e);
    }
  }
};

export const runAsync = async () => {
  const processArgs = process.argv.slice(2);
  const files = fs
    .readdirSync(path.join(__dirname, 'pre-build'))
    .filter((file) => file.endsWith('.ts'))
    .sort();

  if (processArgs.includes('custom-css')) {
    const blocksScript = files.find((file) => file.includes('download-custom-css.ts'));
    await scriptRunner(blocksScript);
    // return early so that other scripts will not be executed
    return;
  }

  if (processArgs.includes('blocks')) {
    const blocksScript = files.find((file) => file.includes('generate-blocks-data.ts'));
    await scriptRunner(blocksScript);
    // return early so that other scripts will not be executed
    return;
  }

  for (const file of files) {
    await scriptRunner(file);
  }
};

// Self-invocation async function
(async () => {
  await runAsync();
})().catch((err) => {
  console.error(err);
  throw err;
});
