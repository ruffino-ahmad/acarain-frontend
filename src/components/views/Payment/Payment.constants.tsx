interface IPaymentStatusDisplay {
  label: string;
  illustration: string;
  description: string;
}

/**
 * Pemetaan status order dari backend ke tampilan halaman pembayaran.
 * Status order ditentukan oleh notifikasi (webhook) Midtrans, bukan oleh
 * query string pada URL redirect.
 */
const PAYMENT_STATUS_DISPLAY: Record<string, IPaymentStatusDisplay> = {
  completed: {
    label: "Success",
    illustration: "/images/ilustrations/success.svg",
    description: "Pembayaran berhasil. E-voucher Anda sudah dibuat.",
  },
  pending: {
    label: "Progress",
    illustration: "/images/ilustrations/pending.svg",
    description:
      "Pembayaran sedang diproses. Halaman ini akan diperbarui otomatis.",
  },
  cancelled: {
    label: "Failed",
    illustration: "/images/ilustrations/no-data.svg",
    description: "Pembayaran gagal atau kedaluwarsa.",
  },
};

const defaultPaymentDisplay: IPaymentStatusDisplay = PAYMENT_STATUS_DISPLAY.pending;

export { PAYMENT_STATUS_DISPLAY, defaultPaymentDisplay };
export type { IPaymentStatusDisplay };
