import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class SpecialistDto {
    @ApiModelProperty()
    firstName?: string;

    @ApiModelPropertyOptional()
    lastName?: string;

    @ApiModelPropertyOptional()
    secondaryName?: string;

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    dateOfBirth?: Date;

    @ApiModelProperty({ type: String, format: 'data-time' })
    dateOfHiring?: Date;

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    dateOfFiring?: Date;

    @ApiModelPropertyOptional()
    experience?: string;

    @ApiModelPropertyOptional()
    email?: string;

    @ApiModelPropertyOptional()
    about?: string;

    @ApiModelPropertyOptional()
    gender?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelPropertyOptional()
    phoneNumber?: string;

    @ApiModelPropertyOptional()
    city?: string;

    @ApiModelPropertyOptional()//@ApiModelProperty()
    specialistSpecialization?: string;

    @ApiModelPropertyOptional()
    specialistStatus?: string;

    @ApiModelPropertyOptional()
    patients?: string[];

    @ApiModelProperty()
    hospital?: string;

    @ApiModelProperty()
    user?: string;

    @ApiModelPropertyOptional()
    lang?: string;

    @ApiModelPropertyOptional()
    password?: string;
    firstLogin?: boolean;
}

export const SPECIALIST_STATUS = {
  NOT_START:  `notStart`,
  WORKS: `works`,
  FIRED: `fired`,
};
