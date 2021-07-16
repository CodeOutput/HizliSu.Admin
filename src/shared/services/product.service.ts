import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppConsts} from '../AppConsts';
import {Observable} from 'rxjs';
import {Product} from '../models/product.model';

@Injectable()
export class ProductService {
    private baseUrl = AppConsts.remoteServiceBaseUrl;

    constructor(private http: HttpClient) {

    }

    getList(co: any) {
        const coStr = JSON.stringify(co);
        const coJson = JSON.parse(coStr);

        const reqParams = {};
        Object.keys(coJson).map(k => {
            reqParams[k] = coJson[k];
        });
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Product/GetProductList`, {params: reqParams})
            .pipe(map(resp => {
                return resp;
            }));
    }

    getItemById(productId: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Product/GetProductDetail?id=${productId}`)
            .pipe(map(resp => {
                return resp;
            }));
    }

    saveProduct(item: Product) {
        const formData = new FormData();
        formData.append('content', item.file);
        formData.append('name', item.name ?? '');
        formData.append('description', item.description ?? '');
        formData.append('barcode', item.barcode ?? '');
        formData.append('published', item.published ? 'true' : 'false');
        formData.append('sellerCode', item.sellerCode ?? '');
        formData.append('stockQuantity', item.stockQuantity?.toString(10) ?? '0');
        formData.append('unitQuantity', item.unitQuantity?.toString() ?? '0');
        formData.append('price', item.price != null ? item.price.toString().replace('.', ',') : '0');
        formData.append('unitPrice', item.unitPrice != null ? item.unitPrice.toString().replace('.', ',') : '0');
        formData.append('categoryId', item.categoryId != null ? item.categoryId.toString() : '0');
        formData.append('facilityId', item.facilityId != null ? item.facilityId.toString() : '');
        formData.append('manufacturerId', item.manufacturerId != null ? item.manufacturerId.toString() : '0');

        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/Product/SaveProduct', formData)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/Product/UpdateProduct?productId=${item.id}`, formData)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRowProduct(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/Product/DeleteProduct?productId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }
}
