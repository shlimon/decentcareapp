import { createAuthClient } from "better-auth/react";
import { captcha } from "better-auth/plugins";

const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://dc-central-api.onrender.com/api/app-data";

// Ensure the URL points to Better Auth's nested mount path
const authBaseUrl = apiUrl.endsWith("/api/app-data")
    ? apiUrl + "/auth"
    : apiUrl.replace(/\/api\/app-data\/auth\/?$/, "") + "/api/app-data/auth";

export const authClient = createAuthClient({
    baseURL: authBaseUrl,
    plugins: [
        captcha({
            siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        }),
    ],
    fetchOptions: {
        // This plugin ensures the client understands our { success, data } wrapper
        plugins: [
            {
                id: "standard-response-unwrapper",
                onResponse: async ({ response }) => {
                    if (!response.ok) return response;
                    const json = await response.clone().json();
                    if (json && Object.prototype.hasOwnProperty.call(json, 'data')) {
                        // Return the internal 'data' object so Better Auth sees { user, session }
                        // or null if no session exists.
                        return new Response(JSON.stringify(json.data), response);
                    }
                    return response;
                },
            }
        ]
    }
});

export const { useSession, signIn, signUp, signOut, useCaptcha } = authClient;
