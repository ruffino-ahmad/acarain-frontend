const PROTECTED_PREFIXES = ["/admin", "/member"];

const isProtectedPath = (pathname: string) =>
  PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

// Halaman publik: tetap di halaman saat ini setelah logout.
// Halaman terproteksi: kembalikan ke beranda karena sesi sudah berakhir.
const getLogoutRedirect = (pathname: string, currentPath: string) =>
  isProtectedPath(pathname) ? "/" : currentPath;

// Token expired: arahkan ke login dengan callback agar bisa kembali
// ke halaman semula setelah login ulang.
const getSessionExpiredRedirect = (currentPath: string) =>
  `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;

export { isProtectedPath, getLogoutRedirect, getSessionExpiredRedirect };
