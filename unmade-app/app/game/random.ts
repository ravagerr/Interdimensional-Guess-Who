import { ApolloClient } from "@apollo/client";
import { CHARACTERS, CHARACTER } from "../graphql/queries";

export async function pickRandomCharacter(client: ApolloClient<object>) {
  const first = await client.query({ query: CHARACTERS, variables: { page: 1 } });
  const totalCount = first.data.characters.info.count as number;
  
  // a random character id from the total count of characters (826 for now)
  const randomId = Math.floor(Math.random() * totalCount) + 1;
  
  try {
    // fetch the randomId directly
    const result = await client.query({ 
      query: CHARACTER, 
      variables: { id: randomId.toString() } 
    });
    return result.data.character;
  } catch (error) {
    // incase id is missing or fails for some reason, get random page and a random character from that page
    console.warn(`Character ID ${randomId} not found, falling back to page method`);
    
    const randomPage = Math.floor(Math.random() * Math.ceil(totalCount / 20)) + 1;
    const pageData = await client.query({ query: CHARACTERS, variables: { page: randomPage } });
    const charactersOnPage = pageData.data.characters.results;
    const randomIndex = Math.floor(Math.random() * charactersOnPage.length);
    
    return charactersOnPage[randomIndex];
  }
}
