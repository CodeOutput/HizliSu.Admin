import {BaseModel} from './base.model';
import {File as Image} from './file.model';

// üretici veya marka
export class Manufacturer extends BaseModel {
    public name: string;
    public description: string;
    public image: Image = new Image();
    public file: File;
    public imageId: number;
    public sortOrder: number;
}
