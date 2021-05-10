import { HttpLink } from '@apollo/client';

// Note: We don't think Apollo is ever used server-side, but if we
// find some spot where it is, we should authenticate
const getHasuraEndpoint = () => {
  return new URL('graphql', process.env.NEXT_PUBLIC_HASURA_URL);
};

const getHasuraHttpUrl = (endpoint: URL): string => endpoint.href;

const hasuraLink = new HttpLink({
  uri: getHasuraHttpUrl(getHasuraEndpoint()),
});

export default hasuraLink;
