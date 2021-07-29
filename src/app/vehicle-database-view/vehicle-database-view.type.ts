import { Vehicle, VehicleCode } from "../shared/interface";

export enum VehicleTableColumnName {
    Vehicle = 'Транспортний засіб',
    Organization = 'Організація',
    Department = 'Департамент',
    Contragent = 'Контрагент',
    Code = 'Код',
    Aggregate = 'Причіп',
    Drivers = 'Водії',  
}

export const vehicleTableDisplayedColumns: string[] = [
    VehicleTableColumnName.Vehicle,
    VehicleTableColumnName.Organization,
    VehicleTableColumnName.Department,
    VehicleTableColumnName.Contragent,
    VehicleTableColumnName.Code,
    VehicleTableColumnName.Aggregate,
    VehicleTableColumnName.Drivers,
];

export const vehicleTableColumnNameMap: Record<VehicleTableColumnName, keyof VehicleCode | keyof Vehicle> = {
    [VehicleTableColumnName.Vehicle]: "Vehicle",
    [VehicleTableColumnName.Organization]: "Organization",
    [VehicleTableColumnName.Department]: "Department",
    [VehicleTableColumnName.Contragent]: "Contragent",
    [VehicleTableColumnName.Code]: "code1c",
    [VehicleTableColumnName.Aggregate]: "Aggregate",
    [VehicleTableColumnName.Drivers]: "Drivers",  
};

export interface VehicleTableLists {
    organization: string[];
    department: string[];
    contragent: string[];
}

export interface VehicleTableFilter {
    global: string;
    organization: string;
    department: string;
    contragent: string;
}
