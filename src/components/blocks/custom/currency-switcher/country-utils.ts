/**
 * Country utilities for the CurrencySwitcher component
 *
 * This file contains utilities for extracting country codes from formatted strings
 * and validating them against region.json.
 *
 * Format: "{countryCode} - {CountryName}"
 * Example: "HK - Hong Kong"
 */

import regionSettings from '@public/region.json';
import { getDefaultCountry } from '@src/lib/helpers/country';

// Create a mapping of country codes from region.json
const countryCodesFromRegion: string[] = regionSettings.map(region => region.baseCountry);

/**
 * Extracts a country code from a formatted string
 * Format: "{countryCode} - {CountryName}"
 * Example: "HK - Hong Kong"
 *
 * @param formattedString The formatted string containing country code and name
 * @returns The country code, or an empty string if not found or invalid
 */
export const lookupCountryCode = (formattedString: string): string => {
  // Handle empty strings
  if (!formattedString || formattedString.trim() === '') {
    const defaultCountry = getDefaultCountry();
    if (countryCodesFromRegion.includes(defaultCountry)) {
      return defaultCountry;
    }
    return '';
  }

  // Extract country code from the formatted string: "{countryCode} - {CountryName}"
  const parts = formattedString.split('-');
  if (parts.length >= 2) {
    const countryCode = parts[0].trim().toUpperCase();

    // Verify the code exists in region settings
    if (countryCodesFromRegion.includes(countryCode)) {
      return countryCode;
    }
  }

  return '';
};
