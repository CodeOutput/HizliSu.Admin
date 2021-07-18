import {BaseModel} from './base.model';

export class OrderStatus extends BaseModel {
    public name: string;
    public isActive: boolean;
}
