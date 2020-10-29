import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import {ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';
import {ThemeProvider} from 'styled-components';
import {createApolloClient} from 'utils/apollo-client';
import {StoreProvider} from 'store';
import {Helmet} from "react-helmet";
import ReactGA from 'react-ga';
import 'normalize.css';
import theme from 'theme';
import App from 'components/App/App';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

// GraphQL HTTP URL
const API_URL = process.env.REACT_APP_API_URL;

// GraphQL WebSocket (subscriptions) URL.
// If its url is not set in .env then it has same url, host and pathname
const WEBSOCKET_API_URL = process.env.REACT_APP_WEBSOCKET_API_URL;
const websocketApiUrl = WEBSOCKET_API_URL;

// Create a Apollo client
const apolloClient = createApolloClient(API_URL, websocketApiUrl);

render(
    <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>LangExchangeLK</title>
            <link rel="canonical" href="www.langexchange.lk" />
            <meta name="description" content="A language exchange platform for sri lankans who want to learn a second language with a language partner"/>
	        <meta name="keywords" content="language, exchange, sri lanka, language partner, tamil, english, sinhala"/>
        </Helmet>
        <ApolloProvider client={apolloClient}>
            <ApolloHooksProvider client={apolloClient}>
                <ThemeProvider theme={theme}>
                    <StoreProvider>
                        <App/>
                    </StoreProvider>
                </ThemeProvider>
            </ApolloHooksProvider>
        </ApolloProvider>
    </div>,
    document.getElementById('root')
);
