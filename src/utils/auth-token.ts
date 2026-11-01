import authServices from "@/services/auth.service";
import { JWTExtended } from "@/types/Auth";

// Refresh sedikit sebelum access token benar-benar habis.
const REFRESH_MARGIN_MS = 30 * 1000;

// Waktu kedaluwarsa (ms) dibaca dari klaim `exp` access token,
// jadi umur token cukup diatur di backend.
const getAccessTokenExpires = (accessToken: string) => {
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1] ?? "", "base64url").toString()
    );
    return Number(payload.exp) * 1000 || 0;
  } catch {
    return 0;
  }
};

const shouldRefreshAccessToken = (token: JWTExtended) =>
  Date.now() >= (token.accessTokenExpires ?? 0) - REFRESH_MARGIN_MS;

// Refresh token sekali pakai (rotation): dua token lama diganti dua token baru.
const refreshAccessToken = async (token: JWTExtended): Promise<JWTExtended> => {
  try {
    const result = await authServices.refresh({
      refreshToken: token.refreshToken as string,
    });
    const { accessToken, refreshToken } = result.data?.data;

    return {
      ...token,
      accessToken,
      refreshToken,
      accessTokenExpires: getAccessTokenExpires(accessToken),
    };
  } catch {
    // Refresh gagal (refresh token mati / backend 503): token lama dibiarkan.
    // Request berikutnya 401 "Token has expired" dan responseHandler
    // melakukan signOut.
    return token;
  }
};

export { getAccessTokenExpires, shouldRefreshAccessToken, refreshAccessToken };
