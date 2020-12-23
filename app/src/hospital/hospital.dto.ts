import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class HospitalDto {
    @ApiModelProperty()
    name?: string;

    @ApiModelProperty()
    city?: string;

    @ApiModelProperty()
    mainEmail?: string;

    @ApiModelProperty()
    additionalEmail?: string;

    @ApiModelPropertyOptional()
    hospitalStatus?: string;

    @ApiModelProperty()
    country?: string;

    @ApiModelProperty()
    user?: string;

    @ApiModelProperty()
    lang?: string;

    @ApiModelProperty()
    password?: string;

    @ApiModelProperty()
    newsAndUpdates?: boolean;
}

export const HOSPITAL_STATUS = {
  ACTIVE: `active`,
  ARREARS: `arrears`,
  CLOSED: `closed`,
};
