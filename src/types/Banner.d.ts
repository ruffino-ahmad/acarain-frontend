interface IBanner {
  _id: string;
  title: string;
  image: string;
  imageUrl: string | null;
  isShow: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateBanner {
  title: string;
  image: string;
  isShow: boolean;
}

type IUpdateBanner = Partial<Pick<ICreateBanner>>;

export type { IBanner, ICreateBanner, IUpdateBanner };
