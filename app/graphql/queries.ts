import { gql } from "@apollo/client";

export const CHARACTERS = gql`
  query Characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info { count pages next prev }
      results {
        id name status species type gender image
        origin { name } location { name }
        episode { id }
      }
    }
  }
`;

export const CHARACTER = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id name image status species type gender
      origin { id name type dimension }
      location { id name type dimension residents { id } }
      episode { id name episode air_date }
    }
  }
`;

// export const CHARACTERS_COUNT = gql`
//   query CharactersCount($filter: FilterCharacter) {
//     characters(page: 1, filter: $filter) {
//       info { count }
//     }
//   }
// `;

export const EPISODES = gql`
  query Episodes($page: Int, $filter: FilterEpisode) {
    episodes(page: $page, filter: $filter) {
      info { next }
      results { id name episode air_date }
    }
  }
`;
