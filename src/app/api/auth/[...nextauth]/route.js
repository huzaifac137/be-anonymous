import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import googleProvider from "next-auth/providers/google";
import connectToDB from "../../../../../utlis/connectMongo";
import userModal from "../../../../../utlis/model/user";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const dynamic = "force-dynamic";
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    googleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
    Credentials({
      name: "this app",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const { email, password } = credentials;

        if (credentials) {
          await connectToDB();

          let userr;

          try {
            userr = await userModal.findOne({ email: email });
          } catch (err) {
            console.log(err);

            const error = new Error("No user is registered with this email!");
            error.code = 500;
            throw error;
          }

          let compare;
          try {
            compare = await bcrypt.compare(password, userr.password);
          } catch (err) {
            const error = new Error("Something went wrong!");
            error.code = 500;
            throw error;
          }

          if (compare !== true) {
            const error = new Error("Password is wrong!");
            error.code = 403;
            throw error;
          }

          if (userr) {
            const user = {
              id: userr.id,
              name: userr.username,
              email: userr.email,
            };

            return user;
          } else {
            return null;
          }
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      if (!account) {
        token.jwt = JWT.sign(
          { name: token.name, email: token.email, sub: token.sub },
          process.env.NEXTAUTH_SECRET,
          {},
        );
      }

      return token;
    },

    async session({ session, user, token }) {
      if (!session.sub) {
        session.sub = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
