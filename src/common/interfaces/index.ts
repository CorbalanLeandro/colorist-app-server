export interface ICreatedAt {
  createdAt: Date;
}
export interface IUpdatedAt {
  updatedAt: Date;
}
export interface ITimestamp extends ICreatedAt, IUpdatedAt {}

export interface IId {
  _id: string;
}

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
