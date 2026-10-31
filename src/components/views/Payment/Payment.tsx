import { Button, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import usePayment from "./usePayment";
import {
  PAYMENT_STATUS_DISPLAY,
  defaultPaymentDisplay,
} from "./Payment.constants";

const Payment = () => {
  const router = useRouter();
  const { orderId, isReady, order, isLoading, isError } = usePayment();
  const transactionStatus = router.query.transaction_status as
    | string
    | undefined;

  const display = order
    ? (PAYMENT_STATUS_DISPLAY[order.status] ?? defaultPaymentDisplay)
    : defaultPaymentDisplay;

  // Midtrans sudah menyatakan settlement, tapi notifikasi ke backend belum selesai diproses.
  const isWaitingConfirmation =
    order?.status === "pending" && transactionStatus === "settlement";

  if (isReady && !orderId) {
    return (
      <div className="flex w-screen flex-col items-center justify-center gap-10 p-4">
        <Image
          src="/images/ilustrations/no-data.svg"
          alt="Transaction Not Found"
          width={300}
          height={300}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-danger-500 text-3xl font-bold">
            Transaction Not Found
          </h1>
          <p className="text-foreground-500">
            Kode order tidak ditemukan pada URL.
          </p>
          <Button
            className="mt-4 w-fit"
            variant="bordered"
            color="danger"
            as={Link}
            href="/events"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-screen flex-col items-center justify-center gap-10 p-4">
        <Image
          src="/images/ilustrations/no-data.svg"
          alt="Transaction Not Found"
          width={300}
          height={300}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-danger-500 text-3xl font-bold">
            Unable to Load Transaction
          </h1>
          <p className="text-foreground-500">
            Sesi Anda mungkin sudah berakhir. Silakan login kembali untuk
            melihat status transaksi.
          </p>
          <Button
            className="mt-4 w-fit"
            variant="bordered"
            color="danger"
            as={Link}
            href={`/auth/login?callbackUrl=/payment/success?order_id=${orderId}`}
          >
            Login to check transaction
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-screen flex-col items-center justify-center gap-10 p-4">
      <div className="flex flex-col items-center justify-center gap-10">
        <Image
          src="/images/general/logo.svg"
          alt="Logo"
          width={180}
          height={180}
        />
        {isLoading ? (
          <div className="flex h-[300px] w-[300px] items-center justify-center">
            <Spinner size="lg" color="danger" />
          </div>
        ) : (
          <Image
            src={display.illustration}
            alt="Payment Status"
            width={300}
            height={300}
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-danger-500 text-3xl font-bold capitalize">
          {isLoading ? "Loading Transaction" : `Transaction ${display.label}`}
        </h1>
        {!isLoading && (
          <p className="text-foreground-500">
            {isWaitingConfirmation
              ? "Pembayaran diterima, sedang dikonfirmasi oleh sistem. Mohon tunggu sebentar."
              : display.description}
          </p>
        )}
        <Button
          className="mt-4 w-fit"
          variant="bordered"
          color="danger"
          onPress={() => router.push("/member/dashboard")}
        >
          Check your transaction here
        </Button>
      </div>
    </div>
  );
};

export default Payment;
