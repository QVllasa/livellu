import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_REST_API_URL}/auth/local`, {
                        identifier: credentials.email, // Make sure 'identifier' is used for Strapi
                        password: credentials.password,
                    });

                    const user = response.data;

                    if (response.status === 200 && user) {
                        return user;
                    }
                    return null;
                } catch (error) {
                    throw new Error('Login failed. Check your credentials.');
                }
            }
        })
    ],
    pages: {
        signIn: '/auth', // Points to your custom sign-in page
        error: '/auth/error', // Error page if login fails
    },
    session: {
        strategy: 'jwt', // Use JWT-based session strategy
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.jwt = user.jwt;
                token.id = user.user.id;
                token.email = user.user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.jwt = token.jwt;
            session.id = token.id;
            session.email = token.email;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
});
