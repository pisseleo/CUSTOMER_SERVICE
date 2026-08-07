import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthProviderProps } from "react-oidc-context";


const authority = import.meta.env.VITE_OIDC_AUTHORITY ?? "";
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID ?? "";
const redirectUri = import.meta.env.VITE_OIDC_REDIRECT_URI ?? "";
const postLogoutRedirectUri = import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI ?? "";
const scope = import.meta.env.VITE_OIDC_SCOPE ?? "openid profile email";
const audience = import.meta.env.VITE_OIDC_AUDIENCE as string | undefined;

export const oidcMisconfigured = !authority || !clientId;

export const oidcConfig: AuthProviderProps = {
    authority,
    client_id: clientId,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri,
    scope,
    response_type: "code",
    automaticSilentRenew: true,
    loadUserInfo: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    extraQueryParams: audience ? { audience } : undefined,
    onSigninCallback: () => {
        // Handle the callback after successful login
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
}