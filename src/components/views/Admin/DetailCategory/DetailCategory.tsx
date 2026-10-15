import { Tab, Tabs } from "@heroui/react";
import IconTab from "./IconTab";
import InfoTab from "./InfoTab";
import useDetailCategory from "./useDetailCategory";

const DetailCategory = () => {
  const { dataCategory, isLoadingCategory, id } = useDetailCategory();

  if (!dataCategory || !id) {
    return null;
  }

  return (
    <Tabs aria-label="Options">
      <Tab key="icon" title="Icon">
        <IconTab
          id={id}
          currentIconUrl={dataCategory.iconUrl}
          isLoading={isLoadingCategory}
        />
      </Tab>
      <Tab key="info" title="Info">
        <InfoTab
          id={id}
          dataCategory={dataCategory}
          isLoading={isLoadingCategory}
        />
      </Tab>
    </Tabs>
  );
};

export default DetailCategory;