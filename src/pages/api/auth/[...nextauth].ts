import environment from "@/config/environment";
import authServices from "@/services/auth.service";
import { JWTExtended, SessionExtended, UserExtended } from "@/types/Auth";
import {
  getAccessTokenExpires,
  refreshAccessToken,
  shouldRefreshAccessToken,
} from "@/utils/auth-token";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days, samakan dengan REFRESH_TOKEN_TTL_SECONDS backend
  },
  secret: environment.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: {
          label: "identifier",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<UserExtended | null> {
        const { identifier, password } = credentials as {
          identifier: string;
          password: string;
        };

        const resultToken = await authServices.login({
          identifier,
          password,
        });

        const { accessToken, refreshToken } = resultToken.data?.data ?? {};
        const me = await authServices.getProfileWithToken(accessToken);
        const user = me.data?.data;

        if (
          accessToken &&
          refreshToken &&
          resultToken.status === 200 &&
          user._id &&
          me.status === 200
        ) {
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWTExtended;
      user: UserExtended | null;
    }) {
      // Login: token dipindah ke level atas JWT, token.user hanya berisi profil.
      if (user) {
        const { accessToken, refreshToken, ...profile } = user;
        return {
          ...token,
          user: profile,
          accessToken,
          refreshToken,
          accessTokenExpires: getAccessTokenExpires(accessToken as string),
        };
      }

      if (!token.accessToken || !token.refreshToken) {
        return token;
      }

      if (shouldRefreshAccessToken(token)) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: SessionExtended;
      token: JWTExtended;
    }) {
      // refreshToken sengaja tidak diekspos ke client.
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  events: {
    // Berjalan di server: refresh token dicabut di backend. Error diabaikan
    // supaya signOut lokal selalu berhasil.
    async signOut({ token }: { token: JWTExtended }) {
      if (!token?.refreshToken) {
        return;
      }

      try {
        await authServices.logout({ refreshToken: token.refreshToken });
      } catch {
        // abaikan
      }
    },
  },
});
