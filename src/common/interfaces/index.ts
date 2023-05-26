export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimestampsDto {
  createdAt: string;
  updatedAt: string;
}

export interface IId {
  _id: string;
}

export interface IBacicDocument extends IId, ITimestamps {}
export interface IBacicDocumentDto extends IId, ITimestampsDto {}

export interface ICustomApiPropertyRequired {
  required?: boolean;
}

export type IClass = new (...args: any[]) => any;

export interface IRequired {
  required?: boolean;
}

export interface ICustomApiProperty extends IRequired {
  description?: string;
  example?: any;
  isArray?: boolean;
}

export interface ICustomApiPropertyDto
  extends Omit<ICustomApiProperty, 'example' | 'description'> {
  dto: IClass;
}

export interface IApiResult {
  result: true;
}
