/* eslint-disable no-console */
import * as fs from 'fs';
import path from 'path';

import { getTypesenseClient } from '@src/lib/typesense';
import { env } from '@src/lib/env';
import { maybeCreateDir } from '@src/scripts/utils';

interface NavigationDocument {
  objectId: string;
  name: string;
  content: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  [key: string]: any;
}

/**
 * Normalizes the navigation data from Typesense
 * @param documents - The navigation documents from Typesense
 * @returns Normalized navigation data
 */
const normalizeNavigationData = (documents: NavigationDocument[]) => {
  return documents.map((doc) => {
    // Process any fields as needed
    return {
      id: doc.objectId,
      name: doc.name,
      content: doc.content,
      status: doc.status,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,
    };
  });
};

/**
 * Fetches navigation data from Typesense and saves it to a JSON file
 * If no data is found or an error occurs, creates a file with an empty array
 */
export default async function execute() {
  console.log('Generating navigation JSON file');

  // Default to empty array for navigation data
  let normalizedData: ReturnType<typeof normalizeNavigationData> = [];

  try {
    const { NEXT_PUBLIC_STORE_ID } = env();

    if (!NEXT_PUBLIC_STORE_ID) {
      console.error('Store ID is not defined in environment variables');
      // Continue with empty array
    } else {
      // Get Typesense client
      const client = getTypesenseClient();

      try {
        // Query the navigation collection
        const searchResponse = await client
          .collections<NavigationDocument>(`navigation-${NEXT_PUBLIC_STORE_ID}`)
          .documents()
          .search({
            q: '*',
            query_by: 'name',
            per_page: 250,
          });

        // Extract documents from search results
        const navigationDocuments = searchResponse.hits?.map((hit) => hit.document) || [];

        // Process the navigation data
        normalizedData = normalizeNavigationData(navigationDocuments);

        console.log(`Found ${navigationDocuments.length} navigation items`);
      } catch (typesenseError) {
        console.error('Error fetching from Typesense:', typesenseError);
        console.log('Continuing with empty navigation array');
        // Continue with empty array
      }
    }
  } catch (error) {
    console.error('Error in navigation generation process:', error);
    // Continue with empty array
  } finally {
    try {
      // Ensure the public directory exists
      await maybeCreateDir('public');

      // Write the data to a JSON file (empty array if no data was found)
      const filePath = path.join(process.cwd(), 'public', 'navigation.json');
      fs.writeFileSync(filePath, JSON.stringify(normalizedData), {
        encoding: 'utf-8',
      });

      console.log(
        `Navigation JSON file created at ${filePath} with ${normalizedData.length} items`
      );
    } catch (fileError) {
      console.error('Error writing navigation JSON file:', fileError);
    }
  }
}
