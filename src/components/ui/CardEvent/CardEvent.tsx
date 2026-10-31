import { IEvent } from "@/types/Event";
import { cn } from "@/utils/cn";
import { convertTime } from "@/utils/date";
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface CardEventProps {
  event?: IEvent;
  className?: string;
  key?: string;
  isLoading?: boolean;
}

const CardEvent = (props: CardEventProps) => {
  const { event, className, key, isLoading } = props;
  return (
    <Card
      shadow="sm"
      isPressable
      as={Link}
      href={`/events/${event?.slug}`}
      key={key}
      className={cn(className, "cursor-pointer")}
    >
      {!isLoading ? (
        <Fragment>
          <CardBody>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={`${event?.bannerUrl}`}
                alt="cover"
                fill
                sizes="(max-width: 1024px) 20rem, 20vw"
                className="object-cover"
              />
            </div>
          </CardBody>
          <CardFooter className="flex-col items-start pt-0 text-left">
            <h2 className="text-danger line-clamp-1 text-lg font-bold">
              {event?.name}
            </h2>
            <p className="text-foreground-500 mb-2 line-clamp-2 text-sm">
              {event?.description}
            </p>
            <p className="text-foreground-500">
              {convertTime(event?.startDate)}
            </p>
          </CardFooter>
        </Fragment>
      ) : (
        <Fragment>
          <CardBody>
            <Skeleton className="bg-default-300 aspect-video w-full rounded-lg" />
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2">
            <Skeleton className="bg-default-200 h-4 w-3/5 rounded-lg" />
            <Skeleton className="bg-default-200 h-4 w-4/5 rounded-lg" />
            <Skeleton className="bg-default-200 h-4 w-2/5 rounded-lg" />
          </CardFooter>
        </Fragment>
      )}
    </Card>
  );
};

export default CardEvent;
