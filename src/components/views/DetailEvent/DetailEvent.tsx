import {
  BreadcrumbItem,
  Breadcrumbs,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import useDetailEvent from "./useDetailEvent";
import { FaClock, FaLocationDot } from "react-icons/fa6";
import { convertTime } from "@/utils/date";
import Image from "next/image";
import DetailEventTicket from "./DetailEventTicket";
import { ITicket } from "@/types/Ticket";
import DetailEventCart from "./DetailEventCart";
import Script from "next/script";
import environment from "@/config/environment";

const DetailEvent = () => {
  const {
    dataDetailEvent,
    dataTicket,
    dataTicketInCart,
    cart,
    handleAddToCart,
    handleChangeQuantity,
    mutateCreateOrder,
    isPendingCreateOrder,
  } = useDetailEvent();
  return (
    <div className="px-8 md:px-0">
      <Script
        src={environment.MIDTRANS_SNAP_URL}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <Skeleton
        isLoaded={!!dataDetailEvent?.name}
        className="min-h-6 rounded-lg"
      >
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/events">Events</BreadcrumbItem>
          <BreadcrumbItem>{dataDetailEvent?.name || "Event"}</BreadcrumbItem>
        </Breadcrumbs>
      </Skeleton>

      <section className="mt-4 flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="w-full lg:w-4/6">
          <Skeleton
            isLoaded={!!dataDetailEvent}
            className="mb-2 min-h-8 rounded-lg"
          >
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              {dataDetailEvent?.name}
            </h1>
          </Skeleton>
          <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton
              isLoaded={
                !!dataDetailEvent?.startDate || !!dataDetailEvent?.endDate
              }
              className="min-h-6 rounded-lg"
            >
              <div className="flex items-center gap-2 text-foreground-600">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-default-100">
                  <FaClock width={16} />
                </span>
                <p>
                  {convertTime(dataDetailEvent?.startDate)} -{" "}
                  {convertTime(dataDetailEvent?.endDate)}
                </p>
              </div>
            </Skeleton>
            <Skeleton
              isLoaded={
                !!dataDetailEvent?.isOnline ||
                !!dataDetailEvent?.location?.address
              }
              className="min-h-6 rounded-lg"
            >
              <div className="flex items-center gap-2 text-foreground-600">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-default-100">
                  <FaLocationDot width={16} />
                </span>
                <p>
                  {dataDetailEvent?.isOnline ? "Online" : "Offline"}{" "}
                  {dataDetailEvent?.isOnline
                    ? ""
                    : ` - ${dataDetailEvent?.location?.address}`}
                </p>
              </div>
            </Skeleton>
          </div>
          <Skeleton
            className="mb-4 aspect-video w-full"
            isLoaded={!!dataDetailEvent?.bannerUrl}
          >
            {dataDetailEvent?.bannerUrl ? (
              <Image
                src={dataDetailEvent?.bannerUrl && dataDetailEvent.bannerUrl}
                alt="Event Banner"
                width={1920}
                height={1080}
                className="aspect-video w-full rounded-xl object-cover shadow-sm ring-1 ring-default-200"
              ></Image>
            ) : (
              <div className="bg-default-100 aspect-video w-full rounded-xl"></div>
            )}
          </Skeleton>
          <Tabs aria-label="Tab Detail Event" fullWidth>
            <Tab key="description" title="Description">
              <h2 className="text-foreground-700 text-xl font-semibold">
                About Event
              </h2>
              <Skeleton
                isLoaded={!!dataDetailEvent?.description}
                className="mt-2 h-32 w-full rounded-lg"
              >
                <p className="text-foreground-500">
                  {dataDetailEvent?.description}
                </p>
              </Skeleton>
            </Tab>
            <Tab key="ticket" title="Ticket">
              <h2 className="text-foreground-700 text-xl font-semibold">
                Ticket
              </h2>

              <div className="mt-2 flex flex-col gap-8">
                {dataTicket?.map((ticket: ITicket) => (
                  <DetailEventTicket
                    key={`ticket-${ticket._id}`}
                    ticket={ticket}
                    cart={cart}
                    handleAddToCart={() => handleAddToCart(`${ticket._id}`)}
                  />
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="w-full lg:w-2/6">
          <DetailEventCart
            cart={cart}
            dataTicketInCart={dataTicketInCart}
            onChangeQuantity={handleChangeQuantity}
            onCreateOrder={mutateCreateOrder}
            isLoading={isPendingCreateOrder}
          />
        </div>
      </section>
    </div>
  );
};

export default DetailEvent;
