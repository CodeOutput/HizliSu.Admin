import {BaseModel} from './base.model';
import {Manufacturer} from './manufacturer.model';
import {FacilityAttribute} from './facility-attribute.model';

// tesis
export class Facility extends BaseModel {
    public manufacturerId: number;
    public manufacturer: Manufacturer = new Manufacturer();
    public name: string;
    public description: string;
    public address: string;
    public facilityAttributes: FacilityAttribute[] = [];
}

