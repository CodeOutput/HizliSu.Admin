import {BaseModel} from './base.model';
import {Facility} from './facility.model';

// tesis özellikleri
export class FacilityAttribute extends BaseModel {
    public facilityId: number;
    public facility: Facility = new Facility();
    public key: string;
    public value: string;
    public sortOrder: number;
}
