import type { IEvent } from "@/types/Event";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { Controller } from "react-hook-form";

import useInfoTab from "./useInfoTab";

interface InfoTabProps {
  dataEvent: IEvent;
  id: string;
}

const InfoTab = (props: InfoTabProps) => {
  const { dataEvent, id } = props;

  const {
    control,
    handleSubmit,
    errors,
    isDirty,
    handleSaveInfo,
    isPendingUpdateEvent,
    categoryList,
    currentSlug,
    slugPreview,
  } = useInfoTab({ dataEvent, id });

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Event Info</h1>
        <p className="text-default-400 text-small w-full">
          Manage information for the event
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSaveInfo)}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Name"
                labelPlacement="outside"
                variant="bordered"
                isInvalid={errors.name !== undefined}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Input
            label="Current Slug"
            labelPlacement="outside"
            variant="bordered"
            value={currentSlug}
            description="Stored slug. It will be regenerated automatically when the name changes."
            isReadOnly
          />
          {slugPreview && (
            <Input
              label="New Slug Preview"
              labelPlacement="outside"
              variant="bordered"
              value={slugPreview}
              description="Preview only. The final slug may include a unique suffix."
              isReadOnly
            />
          )}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                label="Category"
                labelPlacement="outside"
                variant="bordered"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={keys =>
                  field.onChange(String(Array.from(keys)[0] ?? ""))
                }
                isInvalid={errors.category !== undefined}
                errorMessage={errors.category?.message}
              >
                {(categoryList ?? []).map(category => (
                  <SelectItem key={category._id} textValue={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Start Date"
                labelPlacement="outside"
                variant="bordered"
                type="datetime-local"
                placeholder=" "
                isInvalid={errors.startDate !== undefined}
                errorMessage={errors.startDate?.message}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="End Date"
                labelPlacement="outside"
                variant="bordered"
                type="datetime-local"
                placeholder=" "
                isInvalid={errors.endDate !== undefined}
                errorMessage={errors.endDate?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Description"
                labelPlacement="outside"
                variant="bordered"
                isInvalid={errors.description !== undefined}
                errorMessage={errors.description?.message}
              />
            )}
          />
          <p className="text-sm font-bold">Status</p>
          <div className="flex flex-col gap-3">
            <Controller
              name="isPublish"
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
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  size="sm"
                >
                  Featured
                </Switch>
              )}
            />
          </div>
          <Button
            color="danger"
            className="disabled:bg-default-500 mt-2"
            type="submit"
            isDisabled={!isDirty || isPendingUpdateEvent}
          >
            {isPendingUpdateEvent ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default InfoTab;
