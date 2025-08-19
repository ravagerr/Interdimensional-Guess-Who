import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "https://rickandmortyapi.com/graphql" }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          characters: {
            keyArgs: ["filter"],
            merge(existing, incoming, { args }) {
              // if this is the first page or no existing data, return incoming data
              if (!existing || !args?.page || args.page === 1) {
                return incoming;
              }
              
              // handle fetchMore pagination
              return {
                ...incoming,
                results: [...(existing.results ?? []), ...(incoming.results ?? [])],
              };
            },
          },
        },
      },
    },
  }),
});
