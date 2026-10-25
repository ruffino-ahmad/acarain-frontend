import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Skeleton,
  Switch,
} from "@heroui/react";
import { Controller } from "react-hook-form";

import useInfoTab from "./useInfoTab";
import { IBanner } from "@/types/Banner";

interface InfoTabProps {
  dataBanner: IBanner;
  isLoading: boolean;
  id: string;
}

const InfoTab = (props: InfoTabProps) => {
  const { dataBanner, isLoading, id } = props;

  const {
    control,
    handleSubmit,
    errors,
    isDirty,
    handleSaveInfo,
    isPendingUpdateBanner,
    errorMessage,
  } = useInfoTab({ dataBanner, id });

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Category Info</h1>
        <p className="text-default-400 text-small w-full">
          Manage information for the category
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSaveInfo)}
        >
          <InlineErrorAlert
            title="Unable to update category"
            message={errorMessage}
          />
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className="mt-2"
                  label="Name"
                  labelPlacement="outside"
                  variant="bordered"
                  isInvalid={errors.title !== undefined}
                  errorMessage={errors.title?.message}
                />
              )}
            />
          </Skeleton>
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <Controller
              name="isShow"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  size="sm"
                >
                  Published
                </Switch>
              )}
            />
          </Skeleton>
          <Button
            color="danger"
            className="disabled:bg-default-500 mt-2"
            type="submit"
            isDisabled={!isDirty || isPendingUpdateBanner}
          >
            {isPendingUpdateBanner ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default InfoTab;
