import React from 'react';
import { useEffect, useState } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import useSnackbar from "./../component/snackbar/useSnackbar";

const onRedirectCallback = (appState) => {
    const url = appState && appState.returnTo ? appState.returnTo : window.location.pathname;

    window.history.replaceState(window.history.state, null, removeUrlParams(url));
}

const removeUrlParams = (url) => url.split('?')[0];

const providerConfig = {
    domain: null,
    clientId: null,
    useRefreshTokens: true,
    onRedirectCallback,
    authorizationParams: {
        audience: null,
        redirect_uri: window.location.origin,
        scope: 'openid profile read:current_user read:users read:user_idp_tokens read:clients read:client_keys read:client_summary email'
    },
};

function Auth0ConfigProvider({children}) {
    const [state, setState] = useState({loading: true, auth0ClientId: null, auth0Audience: null, auth0Domain: null});
    const showSnackbar = useSnackbar();

    useEffect(() => {
        setState({
            loading: false,
            auth0ClientId: process.env.REACT_APP_AUTH0_SPA_CLIENT_ID,
            auth0Audience: process.env.REACT_APP_AUTH0_AUDIENCE,    
            auth0Domain: process.env.REACT_APP_AUTH0_DOMAIN,
        });
    }, []);

    const updateProviderConfig = {
        ...providerConfig,
        domain: state.auth0Domain,
        clientId: state.auth0ClientId,
        authorizationParams: {
            ...providerConfig.authorizationParams,
            audience: state.auth0Audience,
        },
    };

    const handleAuth0Error = (error) => {
        console.error('Auth0 Error:', error);
        showSnackbar(`Auth0 Error: ${error.message}`, 'error'); // Show error message in Snackbar
    };

    if(state.loading) {
        return <div>Loading......</div>;
    }

    return (
        <Auth0Provider {...updateProviderConfig} onRedirectCallback={onRedirectCallback} onError={handleAuth0Error}> 
            {children}
        </Auth0Provider>
    )
}

export default Auth0ConfigProvider;