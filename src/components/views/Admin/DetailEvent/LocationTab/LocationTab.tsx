import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import type { IEvent } from "@/types/Event";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
} from "@heroui/react";
import { Controller } from "react-hook-form";

import useLocationTab from "./useLocationTab";

interface LocationTabProps {
  dataEvent: IEvent;
}

const LocationTab = (props: LocationTabProps) => {
  const { dataEvent } = props;

  const {
    control,
    handleSubmit,
    errors,
    isDirty,
    isOnline,
    selectedProvinceId,
    filteredProvinces,
    filteredRegencies,
    isPendingProvinces,
    isPendingRegencies,
    isPendingUpdateEvent,
    errorMessage,
    handleSaveLocation,
    handleToggleOnline,
    handleProvinceChange,
    handleProvinceSearch,
    handleRegencySearch,
    handleProvinceOpen,
    handleRegencyOpen,
  } = useLocationTab({ dataEvent });

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Event Location</h1>
        <p className="text-default-400 text-small w-full">
          Manage location for the event
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSaveLocation)}
        >
          <InlineErrorAlert
            title="Unable to update event"
            message={errorMessage}
          />
          <Controller
            name="isOnline"
            control={control}
            render={({ field }) => (
              <Switch
                isSelected={field.value}
                onValueChange={handleToggleOnline}
                size="sm"
              >
                Online Event
              </Switch>
            )}
          />
          {!isOnline && (
            <>
              <Controller
                name="venueName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Venue Name"
                    labelPlacement="outside"
                    variant="bordered"
                    isInvalid={errors.venueName !== undefined}
                    errorMessage={errors.venueName?.message}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Address"
                    labelPlacement="outside"
                    variant="bordered"
                    isInvalid={errors.address !== undefined}
                    errorMessage={errors.address?.message}
                  />
                )}
              />
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="Province"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Search province"
                    selectedKey={field.value || null}
                    onSelectionChange={key =>
                      handleProvinceChange(String(key ?? ""))
                    }
                    onInputChange={handleProvinceSearch}
                    onOpenChange={handleProvinceOpen}
                    onClear={() => handleProvinceChange("")}
                    defaultFilter={() => true}
                    isClearable
                    isInvalid={errors.province !== undefined}
                    errorMessage={errors.province?.message}
                    items={filteredProvinces}
                    isLoading={isPendingProvinces}
                  >
                    {province => (
                      <AutocompleteItem key={String(province.id)}>
                        {province.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
              <Controller
                name="regency"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    key={selectedProvinceId || "regency"}
                    label="City/Regency"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Search city/regency"
                    selectedKey={field.value || null}
                    onSelectionChange={key =>
                      field.onChange(String(key ?? ""))
                    }
                    onInputChange={handleRegencySearch}
                    onOpenChange={handleRegencyOpen}
                    onClear={() => field.onChange("")}
                    defaultFilter={() => true}
                    isClearable
                    isDisabled={!selectedProvinceId}
                    isInvalid={errors.regency !== undefined}
                    errorMessage={errors.regency?.message}
                    items={filteredRegencies}
                    isLoading={isPendingRegencies}
                  >
                    {regency => (
                      <AutocompleteItem key={String(regency.id)}>
                        {regency.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
            </>
          )}
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

export default LocationTab;
