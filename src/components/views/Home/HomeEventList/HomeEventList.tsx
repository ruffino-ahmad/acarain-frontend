import CardEvent from "@/components/ui/CardEvent";
import { IEvent } from "@/types/Event";
import Link from "next/link";

interface HomeEventListProps {
  title: string;
  events: IEvent[];
  isLoading: boolean;
}

const HomeEventList = (props: HomeEventListProps) => {
  const { title, events, isLoading } = props;
  return (
    <section className="mb-16">
      <div className="mb-2 flex items-center justify-between px-6 lg:px-0">
        <h2 className="text-danger text-2xl font-bold">{title}</h2>
        <Link href="/events" className="text-foreground-500 font-semibold">
          See More
        </Link>
      </div>
      <div className="grid auto-cols-[20rem] grid-flow-col gap-6 overflow-x-auto py-2 pb-4 lg:auto-cols-fr lg:grid-cols-5 lg:px-1">
        {!isLoading
          ? events.map(event => (
              <CardEvent
                event={event}
                key={`card-event-${event._id}`}
                className="first:ml-6 last:mr-6 lg:first:ml-0 lg:last:mr-0"
              />
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <CardEvent
                key={`card-event-loading-${index}`}
                isLoading={isLoading}
                className="first:ml-6 last:mr-6 lg:first:ml-0 lg:last:mr-0"
              />
            ))}
      </div>
    </section>
  );
};

export default HomeEventList;
