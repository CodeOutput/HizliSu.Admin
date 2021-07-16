import {BaseModel} from './base.model';
import {District} from './district.model';

// mahalle
export class Neighborhood extends BaseModel {
    public name: string;
    public isActive = true;
    public districtId: number;
    public district: District = new District();
}
