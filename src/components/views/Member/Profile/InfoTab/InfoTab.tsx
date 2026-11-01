import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import type { IProfile } from "@/types/Auth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import { LuMail, LuShieldCheck, LuUserRound } from "react-icons/lu";

import useInfoTab from "./useInfoTab";

interface InfoTabProps {
  dataProfile: IProfile;
}

const InfoTab = (props: InfoTabProps) => {
  const { dataProfile } = props;

  const {
    control,
    handleSubmit,
    errors,
    isDirty,
    handleSaveInfo,
    isPendingUpdateProfile,
    errorMessage,
  } = useInfoTab({ dataProfile });

  const role = dataProfile.role
    ? dataProfile.role.charAt(0).toUpperCase() + dataProfile.role.slice(1)
    : "-";

  return (
    <Card className="w-full max-w-2xl p-4 sm:p-6">
      <CardHeader className="flex-col items-start gap-1 px-0 pt-0">
        <h2 className="text-xl font-bold">Profile Info</h2>
        <p className="text-default-400 text-small">
          Your username, email and role cannot be changed.
        </p>
      </CardHeader>
      <CardBody className="gap-4 px-0 pb-0">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSaveInfo)}
        >
          <InlineErrorAlert
            title="Unable to update profile"
            message={errorMessage}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Username"
              labelPlacement="outside"
              variant="bordered"
              value={dataProfile.username ?? "-"}
              startContent={
                <LuUserRound className="text-default-400 size-4 shrink-0" />
              }
              isReadOnly
            />
            <Input
              label="Email"
              labelPlacement="outside"
              variant="bordered"
              value={dataProfile.email ?? "-"}
              startContent={
                <LuMail className="text-default-400 size-4 shrink-0" />
              }
              isReadOnly
            />
            <Input
              label="Role"
              labelPlacement="outside"
              variant="bordered"
              value={role}
              startContent={
                <LuShieldCheck className="text-default-400 size-4 shrink-0" />
              }
              isReadOnly
            />
          </div>

          <div className="border-default-200 flex flex-col gap-4 border-t pt-4">
            <p className="text-sm font-semibold">Personal Information</p>
            <Controller
              name="fullname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Fullname"
                  labelPlacement="outside"
                  variant="bordered"
                  autoComplete="name"
                  startContent={
                    <LuUserRound className="text-default-400 size-4 shrink-0" />
                  }
                  isInvalid={errors.fullname !== undefined}
                  errorMessage={errors.fullname?.message}
                />
              )}
            />
          </div>

          <Button
            color="danger"
            className="disabled:bg-default-500 w-full sm:w-auto sm:self-end"
            type="submit"
            isDisabled={!isDirty || isPendingUpdateProfile}
          >
            {isPendingUpdateProfile ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default InfoTab;
