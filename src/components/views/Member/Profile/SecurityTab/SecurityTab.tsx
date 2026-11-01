import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Controller } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuLock } from "react-icons/lu";

import useSecurityTab from "./useSecurityTab";

const SecurityTab = () => {
  const {
    control,
    handleSubmit,
    errors,
    isDirty,
    visible,
    isPendingUpdatePassword,
    errorMessage,
    handleToggleVisible,
    handleSavePassword,
  } = useSecurityTab();

  return (
    <Card className="w-full max-w-2xl p-4 sm:p-6">
      <CardHeader className="flex-col items-start gap-1 px-0 pt-0">
        <h2 className="text-xl font-bold">Security</h2>
        <p className="text-default-400 text-small">
          Change your password. Use at least 6 characters.
        </p>
      </CardHeader>
      <CardBody className="gap-4 px-0 pb-0">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSavePassword)}
        >
          <InlineErrorAlert
            title="Unable to update password"
            message={errorMessage}
          />

          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={visible.currentPassword ? "text" : "password"}
                label="Old Password"
                labelPlacement="outside"
                variant="bordered"
                autoComplete="current-password"
                startContent={
                  <LuLock className="text-default-400 size-4 shrink-0" />
                }
                isInvalid={errors.currentPassword !== undefined}
                errorMessage={errors.currentPassword?.message}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    aria-label={
                      visible.currentPassword
                        ? "Hide old password"
                        : "Show old password"
                    }
                    onClick={() => handleToggleVisible("currentPassword")}
                  >
                    {visible.currentPassword ? (
                      <FaEye className="text-default-400 pointer-events-none text-xl" />
                    ) : (
                      <FaEyeSlash className="text-default-400 pointer-events-none text-xl" />
                    )}
                  </button>
                }
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={visible.newPassword ? "text" : "password"}
                label="New Password"
                labelPlacement="outside"
                variant="bordered"
                autoComplete="new-password"
                startContent={
                  <LuLock className="text-default-400 size-4 shrink-0" />
                }
                isInvalid={errors.newPassword !== undefined}
                errorMessage={errors.newPassword?.message}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    aria-label={
                      visible.newPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    onClick={() => handleToggleVisible("newPassword")}
                  >
                    {visible.newPassword ? (
                      <FaEye className="text-default-400 pointer-events-none text-xl" />
                    ) : (
                      <FaEyeSlash className="text-default-400 pointer-events-none text-xl" />
                    )}
                  </button>
                }
              />
            )}
          />
          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={visible.confirmNewPassword ? "text" : "password"}
                label="Confirm New Password"
                labelPlacement="outside"
                variant="bordered"
                autoComplete="new-password"
                startContent={
                  <LuLock className="text-default-400 size-4 shrink-0" />
                }
                isInvalid={errors.confirmNewPassword !== undefined}
                errorMessage={errors.confirmNewPassword?.message}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    aria-label={
                      visible.confirmNewPassword
                        ? "Hide confirm new password"
                        : "Show confirm new password"
                    }
                    onClick={() => handleToggleVisible("confirmNewPassword")}
                  >
                    {visible.confirmNewPassword ? (
                      <FaEye className="text-default-400 pointer-events-none text-xl" />
                    ) : (
                      <FaEyeSlash className="text-default-400 pointer-events-none text-xl" />
                    )}
                  </button>
                }
              />
            )}
          />

          <Button
            color="danger"
            className="disabled:bg-default-500 w-full sm:w-auto sm:self-end"
            type="submit"
            isDisabled={!isDirty || isPendingUpdatePassword}
          >
            {isPendingUpdatePassword ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default SecurityTab;
