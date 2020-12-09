import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";

export class PatientDto {
    @ApiModelProperty()
    firstName?: string;

    @ApiModelPropertyOptional()
    lastName?: string;

    @ApiModelPropertyOptional()
    secondaryName?: string;

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    dateOfBirth?: Date;

    @ApiModelPropertyOptional()
    gender?: string;

    @ApiModelProperty({ type: String, format: 'data-time' })
    dateOfRegistration?: Date;

    @ApiModelPropertyOptional({ type: String, format: 'data-time' })
    dateOfWritingOut?: Date;

    @ApiModelPropertyOptional()
    medicalHistory?: string;

    @ApiModelPropertyOptional()
    goalRehabilitation?: string;

    @ApiModelProperty()
    hospital?: string;

    @ApiModelProperty()
    user?: string;

    @ApiModelPropertyOptional()
    patientStatus?: string;

    @ApiModelPropertyOptional()
    height?: number;

    @ApiModelPropertyOptional()
    weight?: number;

    @ApiModelPropertyOptional()
    phoneNumber?: string;

    @ApiModelPropertyOptional()
    city?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelProperty()
    patientDiagnosis?: string;

    @ApiModelPropertyOptional()
    specialists?: string[];

    @ApiModelPropertyOptional()
    email?: string;

    @ApiModelProperty()
    firstLogin?: boolean;

    @ApiModelPropertyOptional()
    recommendation?: string;

    @ApiModelPropertyOptional()
    nickname?: string;

    @ApiModelProperty()
    firstTimeAddGame?: boolean;

    @ApiModelProperty()
    achievement?: string;

    @ApiModelPropertyOptional()
    lang?: string;

    @ApiModelPropertyOptional()
    password?: string;
}

export const PATIENT_STATUS = {
  ACTIVE:  `active`,
  ARCHIVE: `archive`,
  DISCHARGED: `discharged`,
  ACTIVE_WITHOUT_SPECIALIST: `activeWithoutSpecialist`,
};
