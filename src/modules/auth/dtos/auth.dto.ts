import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

import { ISignInResponse } from '../interfaces';

export class SignInResponse implements ISignInResponse {
  @ApiProperty({
    description: 'Access token to make request with.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJsZWtlX3Bpb2xhQGdtYWlsLmNvbSIsInN1YiI6IjY0M2Q5NTBmY2E4NDFkMTUxY2ZhNzc0OSIsImlhdCI6MTY4MTc1OTQzNX0.CRgFgE_yBvVaFPFoQK8XyF5PnS82mSE7LOUtKX1N8iQ',
    required: true,
  })
  @IsJWT()
  access_token: string;
}
