import {BaseModel} from './base.model';
import {City} from './city.model';
import {Neighborhood} from './neighborhood.model';

// ilçe
export class District extends BaseModel {
    public name: string;
    public isActive = true;
    public cityId: number;
    public city: City = new City();
    public neighborhoods: Neighborhood[] = [];
}
