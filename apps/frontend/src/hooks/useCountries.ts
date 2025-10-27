import { useQuery } from '@tanstack/react-query';

interface CountryData {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
}

/**
 * Fetch all country names from REST Countries API
 * Returns a sorted array of common country names
 */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
      const data: CountryData[] = await response.json();

      // Extract common names and sort alphabetically
      return data
        .map((country) => country.name.common)
        .sort((a, b) => a.localeCompare(b));
    },
    staleTime: Infinity, // Countries don't change, cache forever
  });
}

/**
 * Geocode a country name to get its coordinates
 * Uses Nominatim forward geocoding (search)
 */
export async function geocodeCountry(countryName: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(countryName)}&format=json&limit=1&accept-language=en`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
}
