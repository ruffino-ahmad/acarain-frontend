import CardEvent from "@/components/ui/CardEvent";
import useEvent from "./useEvent";
import type { IEvent } from "@/types/Event";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useChangeUrl from "@/hooks/useChangeUrl";
import EventFooter from "./EventFooter";
import EventFilter from "./EventFilter";
import Image from "next/image";

const Event = () => {
  const router = useRouter();
  const { dataEvents, isLoadingEvents, isRefetchingEvents } = useEvent();
  const { setUrlExplore } = useChangeUrl();
  const events = dataEvents?.data ?? [];

  useEffect(() => {
    if (router.isReady) {
      setUrlExplore();
    }
  }, [router.isReady]);

  return (
    <div className="flex w-full flex-col gap-6 px-4 lg:flex-row lg:items-start lg:px-6">
      <EventFilter />
      <div className="min-h-[70vh] w-full min-w-0 flex-1">
        <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!isLoadingEvents && !isRefetchingEvents
            ? events.map((event: IEvent) => (
                <CardEvent event={event} key={`card-event-${event._id}`} />
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <CardEvent
                  key={`card-event-loading-${index}`}
                  isLoading={true}
                />
              ))}
        </div>

        {!isLoadingEvents && events.length > 0 && (
          <EventFooter totalPages={dataEvents?.meta?.totalPages} />
        )}

        {events.length < 1 && !isLoadingEvents && !isRefetchingEvents && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Image
              src="/images/ilustrations/no-data.svg"
              alt="No data found"
              width={200}
              height={200}
              className="rounded-none"
            />
            <h2 className="text-danger text-center text-2xl font-bold">
              Event is empty
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
