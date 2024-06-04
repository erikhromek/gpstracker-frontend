export interface Alert {
    id: number;
    datetime: Date;
    datetimeAttended?: Date;
    datetimeClosed?: Date;
    beneficiaryId: number;
    telephone: string;
    latitude: number;
    longitude: number;
    state: string;
    operatorId?: number;
    observations?: string;
    typeId?: number;
    messageSid: string;

  }
  