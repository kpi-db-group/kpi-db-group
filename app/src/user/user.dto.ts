import { IsEmail } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class UserDto {
    @ApiModelProperty()
    readonly password?: string;

    @ApiModelProperty()
    @IsEmail()
    readonly email?: string;

    @ApiModelProperty()
    readonly roles?: Role[];

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    readonly wrongLoginAttemptsCycle?: Date[];

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    readonly restoringTokenCreateDate?: Date;

    @ApiModelPropertyOptional()
    readonly restoringToken?: string;

    @ApiModelPropertyOptional()
    readonly token?: string;

    @ApiModelPropertyOptional()
    limitedAccess?: boolean;

    @ApiModelProperty()
    identifier?: string;

    @ApiModelProperty()
    lang?: string;

    @ApiModelPropertyOptional()
    unsubscribeEmail?: boolean;

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    lastLoginDate?: Date;

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    firstLoginDate?: Date;

    @ApiModelProperty()
    enabled?: boolean;

    @ApiModelPropertyOptional()
    mark?: string;

    @ApiModelProperty({ type: String, format: 'data-time' })
    markCreateDate?: Date;
}

export enum Role {
    SPECIALIST,
    PATIENT,
    ADMIN,
    CLINIC,
    ALL,
    PATIENT_LID
}
