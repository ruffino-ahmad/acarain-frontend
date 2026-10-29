import { Skeleton } from "@heroui/react";
import HomeEventList from "./HomeEventList";
import HomeSlider from "./HomeSlider";
import useHome from "./usehome";
import Image from "next/image";
import HomeCategoryList from "./HomeCategoryList";

const Home = () => {
  const {
    dataBanners,
    isLoadingBanners,
    dataFeaturedEvents,
    isLoadingFeaturedEvents,
    dataLatestEvents,
    isLoadingLatestEvents,
    dataCategories,
    isLoadingCategories,
  } = useHome();

  const secondBanner = dataBanners && dataBanners?.data[1];

  return (
    <div>
      <HomeSlider
        banners={dataBanners ? dataBanners.data : []}
        isLoadingBanners={isLoadingBanners}
      />
      <HomeEventList
        title="Featured Events"
        events={dataFeaturedEvents ? dataFeaturedEvents.data : []}
        isLoading={isLoadingFeaturedEvents}
        urlMore="/events?isFeatured=true"
      />
      <Skeleton
        isLoaded={!isLoadingBanners}
        className="mb-16 h-[20vw] w-full rounded-2xl px-6 lg:px-0"
      >
        {secondBanner?.imageUrl && (
          <Image
            src={secondBanner.imageUrl}
            alt="Banner"
            className="h-[20vw] w-full rounded-2xl object-cover object-center"
            width={1920}
            height={800}
          />
        )}
      </Skeleton>
      <HomeEventList
        title="Latest Events"
        events={dataLatestEvents ? dataLatestEvents.data : []}
        isLoading={isLoadingLatestEvents}
        urlMore="/events"
      />
      <HomeCategoryList
        categories={dataCategories ? dataCategories.data : []}
        isLoading={isLoadingCategories}
      ></HomeCategoryList>
    </div>
  );
};

export default Home;
