import { Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";

interface ActivationProps {
  status: "success" | "failed";
}

const Activation = (props: ActivationProps) => {
  const router = useRouter();
  const { status } = props;
  return (
    <div className="flex w-screen flex-col items-center justify-center gap-10 p-4">
      <div className="flex flex-col items-center justify-center gap-10">
        <Image
          src="/images/general/logo.svg"
          alt="Logo"
          width={180}
          height={180}
        />
        <Image
          src={
            status === "success"
              ? "/images/ilustrations/success.svg"
              : "/images/ilustrations/pending.svg"
          }
          alt="Email Send"
          width={300}
          height={300}
        />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-danger-500 text-3xl font-bold">
          {status === "success"
            ? "Activation Account Success"
            : "Activation Account Failed"}
        </h1>
        <p className="text-default-500 text-xl font-bold">
          {status === "success"
            ? "Your account has been activated successfully."
            : "There was an issue activating your account. Please try again."}
        </p>
        <Button
          className="mt-4 w-fit"
          variant="bordered"
          color="danger"
          onPress={() => router.push("/")}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default Activation;
