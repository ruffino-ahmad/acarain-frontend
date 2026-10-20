import { Tab, Tabs } from "@heroui/react";

import CoverTab from "./CoverTab";
import InfoTab from "./InfoTab";
import LocationTab from "./LocationTab";
import useDetailEvent from "./useDetailEvent";
import TicketTab from "./TicketTab";

const DetailEvent = () => {
  const { dataEvent, isLoadingEvent, id } = useDetailEvent();

  if (!dataEvent || !id) {
    return null;
  }

  return (
    <Tabs aria-label="Event detail">
      <Tab key="cover" title="Cover">
        <CoverTab
          id={id}
          currentBannerUrl={dataEvent.bannerUrl}
          isLoading={isLoadingEvent}
        />
      </Tab>
      <Tab key="info" title="Info">
        <InfoTab id={id} dataEvent={dataEvent} />
      </Tab>
      <Tab key="location" title="Location">
        <LocationTab id={id} dataEvent={dataEvent} />
      </Tab>
      <Tab key="ticket" title="Ticket">
        <TicketTab />
      </Tab>
    </Tabs>
  );
};

export default DetailEvent;
