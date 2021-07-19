import {BaseModel} from './base.model';
import {Order} from './order.model';
import {Product} from './product.model';

export class OrderItem extends BaseModel {
    public orderId: number;
    public order: Order = new Order();
    public productId: number;
    public product: Product = new Product();
    public quantity: number;
    public price: number;

    // others
    public imagePath: any;
}
