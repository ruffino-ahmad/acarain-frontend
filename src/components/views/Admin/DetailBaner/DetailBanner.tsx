import { Tab, Tabs } from "@heroui/react";
import InfoTab from "./InfoTab";
import useDetailBanner from "./useDetailBanner";
import ImageTab from "./ImageTab";

const DetailBanner = () => {
  const { dataBanner, isLoadingBanner, id } = useDetailBanner();

  if (!dataBanner || !id) {
    return null;
  }

  return (
    <Tabs aria-label="Options">
      <Tab key="image" title="Image">
        <ImageTab
          currentImageUrl={dataBanner.imageUrl}
          isLoading={isLoadingBanner}
        />
      </Tab>
      <Tab key="info" title="Info">
        <InfoTab dataBanner={dataBanner} isLoading={isLoadingBanner} />
      </Tab>
    </Tabs>
  );
};

export default DetailBanner;