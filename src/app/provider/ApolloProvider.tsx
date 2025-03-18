import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://olhodaguadocasado.stepzen.net/api/original-waterbuffalo/__graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "apikey olhodaguadocasado::stepzen.net+1000::bd43797e8e44670fca78a3470f5648d118cc6a496c27b27bece62fd3265bedc4",
  },
});

export default client;
