import { Skeleton, Tab, Tabs } from "@heroui/react";

import InfoTab from "./InfoTab";
import PictureTab from "./PictureTab";
import SecurityTab from "./SecurityTab";
import useProfile from "./useProfile";

const Profile = () => {
  const { dataProfile, isLoadingProfile } = useProfile();

  if (isLoadingProfile) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <Skeleton className="h-9 w-56 rounded-lg" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!dataProfile) {
    return null;
  }

  return (
    <Tabs
      aria-label="Profile"
      color="danger"
      variant="underlined"
      className="w-full"
      classNames={{
        tabList: "max-w-full overflow-x-auto",
        panel: "px-0 pt-4",
      }}
    >
      <Tab key="picture" title="Picture">
        <PictureTab dataProfile={dataProfile} />
      </Tab>
      <Tab key="info" title="Info">
        <InfoTab dataProfile={dataProfile} />
      </Tab>
      <Tab key="security" title="Security">
        <SecurityTab />
      </Tab>
    </Tabs>
  );
};

export default Profile;
