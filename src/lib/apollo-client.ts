import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { getWooSession, setWooSession } from '@src/lib/helpers/session';
import { isEmpty } from 'lodash';

/**
 * Middleware operation
 * If we have a session token in localStorage or cookies, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  const isBrowser = typeof window !== 'undefined';
  /**
   * If session data exists in localStorage or cookies, set value as session header.
   */
  const session = isBrowser ? getWooSession() : null;

  let customHeaders = {};

  if (session) {
    customHeaders = {
      'woocommerce-session': `Session ${session}`,
    };
  }

  const yithSession = isBrowser ? localStorage.getItem('yith-wcwl-session') : null;

  if (yithSession) {
    customHeaders = {
      ...customHeaders,
      ...{
        'yith-wcwl-session': yithSession,
      },
    };
  }

  if (!isEmpty(customHeaders)) {
    operation.setContext(() => ({
      headers: customHeaders,
    }));
  }
  return forward(operation);
});

/**
 * Afterware operation.
 *
 * This catches the incoming session token and stores it in both localStorage and cookies,
 * for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) {
      return response;
    }

    /**
     * Check for session header and update session in local storage accordingly.
     */
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    const session = headers.get('woocommerce-session');
    if (session) {
      // Update session new data if changed.
      setWooSession(headers.get('woocommerce-session'), 30);
    }

    const yithSession = headers.get('yith-wcwl-session');
    if (yithSession) {
      // Remove session data if session destroyed.
      if (localStorage.getItem('yith-wcwl-session') !== yithSession && 'false' !== yithSession) {
        localStorage.setItem('yith-wcwl-session', headers.get('yith-wcwl-session'));
      }
    }
    return response;
  });
});

// Apollo GraphQL client.
export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined', // set to true for SSR
  link: middleware.concat(
    afterware.concat(
      createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
        credentials: 'include',
        fetch: fetch,
      })
    )
  ),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});
