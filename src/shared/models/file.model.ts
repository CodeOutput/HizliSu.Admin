import {BaseModel} from './base.model';

export class File extends BaseModel {
    public userFileName: string;
    public fileName: string;
    public contentType: string;
    public length: number;
    public content: string;
}
