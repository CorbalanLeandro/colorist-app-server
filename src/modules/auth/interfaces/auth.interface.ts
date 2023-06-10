export interface IJWTPayload {
  exp: number;
  iat: number;
  /**
   * colorist._id | ObjectId
   */
  sub: string;
}

export interface ISignInResponse {
  access_token: string;
}
