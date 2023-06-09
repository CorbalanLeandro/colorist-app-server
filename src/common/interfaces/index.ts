export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IId {
  _id: string;
}

export interface IVersion {
  __v: number;
}

export interface IColoristId {
  /**
   * will not be used as reference to the colorist schema, only for validation
   */
  coloristId: string;
}

export interface IBasicDocument extends IId, ITimestamps, IVersion {}

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

export interface ICustomMongoApiProperty
  extends Omit<ICustomApiProperty, 'example' | 'description'> {
  referenceName: string;
}

export interface IApiResult {
  result: true;
}

export interface IBasicQueryDto {
  limit?: number;
  skip?: number;
}
