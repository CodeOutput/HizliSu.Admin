import {BaseModel} from './base.model';
import {File as Image} from './file.model';
import {Category} from './category.model';
import {Manufacturer} from './manufacturer.model';
import {Facility} from './facility.model';

export class Product extends BaseModel {
    public categoryId: number;
    public category: Category = new Category();
    public manufacturerId: number;
    public manufacturer: Manufacturer = new Manufacturer();
    public facilityId?: number;
    public facility: Facility = new Facility();
    public name: string;
    public description: string;
    public sellerCode: string;
    public barcode: string;
    public stockQuantity: number;
    public unitQuantity: number;
    public unitPrice: number;
    public unitPriceStr: string;
    public price: number;
    public published: boolean;
    public imageId: number;
    public image: Image = new Image();
    public file: File;
}
