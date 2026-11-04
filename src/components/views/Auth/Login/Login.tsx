import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import { cn } from "@/utils/cn";
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import useLogin from "./useLogin";

const Login = () => {
  const {
    isVisible,
    toggleVisibility,
    control,
    handleSubmit,
    errors,
    handleLogin,
    isPendingLogin,
    setValue,
  } = useLogin();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 lg:flex-row lg:gap-20">
      <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-1/3">
        <Image
          src="/images/general/logo.svg"
          alt="Logo"
          width={180}
          height={180}
        />
        <Image
          src="/images/ilustrations/login.svg"
          alt="Logo"
          className="w-2/3 lg:w-full"
          width={1024}
          height={1024}
        />
      </div>
      <Card className="w-full max-w-md">
        <CardBody className="p-4 sm:p-8">
          <h2 className="text-danger-500 text-2xl font-bold">Login</h2>
          <p className="text-small mb-4 mt-2">
            Don{"'"}t have an account?{" "}
            <Link href="/auth/register" className="semi-bold text-danger-400">
              Register here
            </Link>
          </p>
          <InlineErrorAlert
            title="Unable to login"
            message={errors.root?.message}
            className="mb-2"
          />
          <form
            className={cn(
              "flex w-full flex-col",
              Object.keys(errors).length > 0 ? "gap-2" : "gap-4"
            )}
            onSubmit={handleSubmit(handleLogin)}
          >
            <Controller
              name="identifier"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Email / Username"
                  variant="bordered"
                  autoComplete="off"
                  isInvalid={errors.identifier !== undefined}
                  errorMessage={errors.identifier?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type={isVisible ? "text" : "password"}
                  label="Password"
                  variant="bordered"
                  autoComplete="off"
                  isInvalid={errors.password !== undefined}
                  errorMessage={errors.password?.message}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => toggleVisibility()}
                    >
                      {isVisible ? (
                        <FaEye className="text-default-400 pointer-events-none text-xl" />
                      ) : (
                        <FaEyeSlash className="text-default-400 pointer-events-none text-xl" />
                      )}
                    </button>
                  }
                />
              )}
            />
            <Button color="danger" size="lg" type="submit">
              {isPendingLogin ? <Spinner color="white" size="sm" /> : "Login"}
            </Button>
          </form>
          <div className="mt-6 border-t pt-4">
            <p className="mb-3 text-center text-sm font-semibold">
              Demo account
            </p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                className="w-full"
                variant="flat"
                color="danger"
                onPress={() => {
                  setValue("identifier", "member");
                  setValue("password", "Abc12345");
                }}
              >
                Use Member Demo Account
              </Button>
              <Button
                type="button"
                className="w-full"
                variant="bordered"
                color="danger"
                onPress={() => {
                  setValue("identifier", "admin");
                  setValue("password", "Abc12345");
                }}
              >
                Use Admin Demo Account
              </Button>
            </div>
            <p className="text-default-500 mt-3 text-center text-xs">
              Klik tombol di atas untuk mengisi kredensial demo secara otomatis.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
