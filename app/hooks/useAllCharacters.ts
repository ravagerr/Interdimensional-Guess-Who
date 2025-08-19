import { useState, useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/client';
import { CHARACTERS } from '../graphql/queries';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: { id: string }[];
}

interface UseAllCharactersResult {
  characters: Character[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
}

// global cache to prevent multiple fetches
let globalCharactersCache: Character[] | null = null;
let globalTotalCount = 0;
let globalFetchPromise: Promise<Character[]> | null = null;

export function useAllCharacters(): UseAllCharactersResult {
  const [characters, setCharacters] = useState<Character[]>(globalCharactersCache || []);
  const [loading, setLoading] = useState(!globalCharactersCache);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(globalTotalCount);
  const client = useApolloClient();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // use cached data if available
    if (globalCharactersCache) {
      setCharacters(globalCharactersCache);
      setTotalCount(globalTotalCount);
      setLoading(false);
      return;
    }

    // wait for fetch in progress
    if (globalFetchPromise) {
      globalFetchPromise.then((cachedCharacters) => {
        if (isMountedRef.current) {
          setCharacters(cachedCharacters);
          setTotalCount(globalTotalCount);
          setLoading(false);
        }
      }).catch((err) => {
        if (isMountedRef.current) {
          setError(err);
          setLoading(false);
        }
      });
      return;
    }

    const fetchAllCharacters = async (): Promise<Character[]> => {
      try {
        console.log('Starting to fetch all characters...');
        
        // get the first page to know how many pages there are
        const firstPageResult = await client.query({
          query: CHARACTERS,
          variables: { page: 1 },
          fetchPolicy: 'network-only'
        });

        const totalPages = firstPageResult.data.characters.info.pages;
        const totalCharacters = firstPageResult.data.characters.info.count;
        globalTotalCount = totalCharacters;
        
        console.log(`Total pages: ${totalPages}, Total characters: ${totalCharacters}`);
        
        // collect all characters in a single array
        const allCharacters: Character[] = [];
        
        // add first page results
        allCharacters.push(...firstPageResult.data.characters.results);

        // fetch all remaining pages in parallel
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            client.query({
              query: CHARACTERS,
              variables: { page },
              fetchPolicy: 'network-only'
            })
          );
        }

        const remainingPages = await Promise.all(pagePromises);
        
        // add all remaining page results
        remainingPages.forEach(pageResult => {
          allCharacters.push(...pageResult.data.characters.results);
        });

        // deduplicate by ID to ensure uniqueness
        const uniqueCharacters = allCharacters.reduce((acc: Character[], character: Character) => {
          if (!acc.find(c => c.id === character.id)) {
            acc.push(character);
          }
          return acc;
        }, []);

        console.log(`Total fetched: ${allCharacters.length}, Unique: ${uniqueCharacters.length}`);
        
        // cache the results globally
        globalCharactersCache = uniqueCharacters;
        globalFetchPromise = null;
        
        return uniqueCharacters;
      } catch (err) {
        console.error('Error fetching characters:', err);
        globalFetchPromise = null;
        throw err;
      }
    };

    // start the fetch and cache the promise
    globalFetchPromise = fetchAllCharacters();
    
    globalFetchPromise.then((fetchedCharacters) => {
      if (isMountedRef.current) {
        setCharacters(fetchedCharacters);
        setTotalCount(globalTotalCount);
        setLoading(false);
      }
    }).catch((err) => {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
    });

  }, [client]);

  return { characters, loading, error, totalCount };
}
