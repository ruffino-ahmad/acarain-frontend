interface IEventRegionItem {
  id: string;
  name: string;
}

interface IEventLocation {
  venueName?: string;
  address?: string;
  province?: IEventRegionItem;
  regency?: IEventRegionItem;
  district?: IEventRegionItem;
  village?: IEventRegionItem;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface IEventCategory {
  _id: string;
  name: string;
  slug: string;
}

interface IEventCreatedBy {
  _id: string;
  fullname: string;
  username: string;
  email: string;
}

interface IEvent {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  banner: string;
  bannerUrl: string | null;
  category: IEventCategory | string;
  slug: string;
  createdBy: IEventCreatedBy | string;
  isFeatured: boolean;
  isOnline: boolean;
  isPublished: boolean;
  location?: IEventLocation;
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateEvent {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  banner: string;
  category: string;
  isFeatured?: boolean;
  isOnline?: boolean;
  isPublished?: boolean;
  location: IEventLocation;
}

type IUpdateEvent = Partial<Omit<ICreateEvent, "location">> & {
  location?: IEventLocation;
};

export type {
  IEvent,
  IEventCategory,
  IEventCreatedBy,
  IEventLocation,
  IEventRegionItem,
  ICreateEvent,
  IUpdateEvent,
};