import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export default NextAuth({
    providers: [
        // Credentials Provider
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    // Authenticate user with Strapi credentials
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_STRAPI_REST_API_URL}/auth/local`,
                        {
                            identifier: credentials.email,
                            password: credentials.password,
                        }
                    );

                    const user = response.data;
                    if (user) {
                        return user; // Return user if authentication is successful
                    } else {
                        return null;
                    }
                } catch (error) {
                    throw new Error('Login failed. Please check your credentials.');
                }
            },
        }),

        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub, // Use 'sub' as 'id'
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (account?.provider === 'google' && user) {
                console.log('Google user:', user);
                // // The 'user' object contains the Google profile information
                // const googleEmail = user.email; // Get email from Google profile
                //
                // // Check if the user exists in Strapi by email

                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_STRAPI_REST_API_URL}/users`,
                        {
                            email: user.email,
                            username: user.name || user.email.split('@')[0],
                            confirmed: true,
                            password: 'google-oauth', // Placeholder password since Google doesn't provide passwords
                        }
                    );
                } catch (error) {
                    console.error('Failed to create user:', error?.response.data.error ?? error);
                }
            }

            // For credentials provider, attach the user to the token
            if (user) {
                token.user = user;
            }

            return token;
        },

        async session({ session, token }) {
            // Attach user info and access token to the session
            session.user = token.user;
            session.accessToken = token.accessToken;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    // debug: process.env.NODE_ENV === 'development',
});
