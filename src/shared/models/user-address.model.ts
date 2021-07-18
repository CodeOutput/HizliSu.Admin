import {BaseModel} from './base.model';
import {UserDto} from '../service-proxies/service-proxies';
import {City} from './city.model';
import {District} from './district.model';
import {Neighborhood} from './neighborhood.model';

export class UserAddress extends BaseModel {
    public title: string;
    public userId: number;
    public user: UserDto = new UserDto();
    public cityId: number;
    public city: City = new City();
    public districtId: number;
    public district: District = new District();
    public neighborhoodId: number;
    public neighborhood: Neighborhood = new Neighborhood();
    public streetName: string;
    public no: string;
    public doorNumber: string;
    public addressDescription: string;
    public phoneNumber: string;
    public isActive: boolean;
}
