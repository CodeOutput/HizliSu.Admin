import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppConsts} from '../AppConsts';
import {Observable} from 'rxjs';
import {Product} from '../models/product.model';

@Injectable()
export class OrderService {
    private baseUrl = AppConsts.remoteServiceBaseUrl;

    constructor(private http: HttpClient) {

    }

    getList(co: any) {
        if (co.orderStatusId == null) {
            delete co.orderStatusId;
        }
        const coStr = JSON.stringify(co);
        const coJson = JSON.parse(coStr);

        const reqParams = {};
        Object.keys(coJson).map(k => {
            reqParams[k] = coJson[k];
        });
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Order/GetOrderPagingList`, {params: reqParams})
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

    getOrderStatusList() {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Order/GetOrderStatusList`)
            .pipe(map(resp => {
                return resp;
            }));
    }

}
