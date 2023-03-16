import authService from "@/service/authService";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import authService from "../../../services/auth_service";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        signIn(params) {
            console.log("params : ", params);

            authService.saveUserToFirebase(params);
            return true;
        },

        async session({
            session,
            token,
            user,
        }: {
            session: any;
            token: any;
            user: any;
        }) {
            return session;
        },
    },
    pages: {
        signIn: "/auth",
    },
});

