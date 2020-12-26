export interface Exercise {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly link: string;
  readonly pictureLink: string;
  readonly gifLink: string;
  readonly lang: string;
  readonly forGames: string[];
  readonly classifierId: string;
  readonly exerciseType: string;
  readonly commandRight: string;
  readonly commandLeft: string;
  readonly bodyPart: string;
  readonly displayForPatient: boolean;
  readonly displayForSpecialist: boolean;
  readonly translation?: string;
  readonly specialist?: string;
  readonly phonePlacement?: string;
}
