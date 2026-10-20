interface IRegion {
  id: number;
  name: string;
}

interface IProvinceDetail extends IRegion {
  regencies: IRegion[];
}

export type { IRegion, IProvinceDetail };
