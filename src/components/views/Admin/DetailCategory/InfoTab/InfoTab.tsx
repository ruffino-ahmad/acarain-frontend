import { yupResolver } from "@hookform/resolvers/yup";
import { ICategory } from "@/types/Category";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import useUpdateCategory from "../useUpdateCategory";

const schema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .required("Please enter name"),
  description: yup
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(500, "Description cannot exceed 500 characters")
    .required("Please enter description"),
});

type FormDataInfo = yup.InferType<typeof schema>;

interface InfoTabProps {
  dataCategory: ICategory;
  isLoading: boolean;
  id: string;
}

const InfoTab = (props: InfoTabProps) => {
  const { dataCategory, isLoading, id } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormDataInfo>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: dataCategory.name ?? "",
      description: dataCategory.description ?? "",
    },
  });

  const { mutateUpdateCategory, isPendingUpdateCategory } =
    useUpdateCategory(id);

  useEffect(() => {
    reset({
      name: dataCategory.name ?? "",
      description: dataCategory.description ?? "",
    });
  }, [dataCategory, reset]);

  const handleSaveInfo = (data: FormDataInfo) => {
    mutateUpdateCategory(
      { name: data.name, description: data.description },
      {
        onSuccess() {
          reset(data);
        },
      }
    );
  };

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
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className="mt-2"
                  label="Name"
                  labelPlacement="outside"
                  variant="bordered"
                  isInvalid={errors.name !== undefined}
                  errorMessage={errors.name?.message}
                />
              )}
            />
          </Skeleton>
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="mt-2"
                  label="Description"
                  labelPlacement="outside"
                  variant="bordered"
                  isInvalid={errors.description !== undefined}
                  errorMessage={errors.description?.message}
                />
              )}
            />
          </Skeleton>
          <Button
            color="danger"
            className="disabled:bg-default-500 mt-2"
            type="submit"
            isDisabled={!isDirty || isPendingUpdateCategory}
          >
            {isPendingUpdateCategory ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default InfoTab;