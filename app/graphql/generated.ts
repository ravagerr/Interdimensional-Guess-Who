// this would normally be auto-generated but added manually for functionality

export interface Character {
  id: string;
  name: string;
  status?: string | null;
  species?: string | null;
  type?: string | null;
  gender?: string | null;
  origin?: {
    name?: string | null;
  } | null;
  location?: {
    name?: string | null;
  } | null;
  image?: string | null;
  episode?: {
    id: string;
  }[];
}

export interface CharactersQuery {
  characters: {
    info: {
      count: number;
      pages: number;
      next?: number | null;
      prev?: number | null;
    };
    results: Character[];
  };
}

export interface Episode {
  id: string;
  name: string;
  episode: string;
  air_date: string;
}
