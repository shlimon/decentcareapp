import { captcha } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://dc-central-api.onrender.com/api/v1";

const authBaseUrl = apiUrl.endsWith("/api/v1")
    ? apiUrl + "/auth"
    : apiUrl.replace(/\/api\/v1\/auth\/?$/, "") + "/api/v1/auth";

export const authClient = createAuthClient({
    baseURL: authBaseUrl,
    plugins: [
        captcha({
            siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        }),
    ],
    fetchOptions: {
        plugins: [
            {
                id: "standard-response-unwrapper",
                onResponse: async ({ response }) => {
                    if (!response.ok) return response;
                    const json = await response.clone().json();
                    if (json && Object.prototype.hasOwnProperty.call(json, 'data')) {
                        const unwrapped = json.data ?? {};
                        return new Response(JSON.stringify(unwrapped), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers,
                        });
                    }
                    return response;
                },
            }
        ]
    }
});

export const { useSession, signIn, signUp, signOut, useCaptcha } = authClient;