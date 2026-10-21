interface ICategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  iconUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateCategory {
  name: string;
  description: string;
  icon: string;
}

type IUpdateCategory = Partial<Pick<ICreateCategory>>;

export type { ICategory, ICreateCategory, IUpdateCategory };
