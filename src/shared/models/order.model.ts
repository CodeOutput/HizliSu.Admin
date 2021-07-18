import {BaseModel} from './base.model';
import {UserDto} from '../service-proxies/service-proxies';
import {UserAddress} from './user-address.model';
import {OrderStatus} from './order-status.model';


export class Order extends BaseModel {
    public userId: number;
    public user: UserDto = new UserDto();
    public userAddressId: number;
    public userAddress: UserAddress = new UserAddress();
    public orderStatusId: number;
    public orderStatus: OrderStatus = new OrderStatus();
    public orderNote: string;
    public totalPrice: number;

    // others
    public resultCount: number;
    public pageNo: number;

    public name: string;
    public surname: string;
    public districtName: string;
    public neighborhoodName: string;
}
