import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppConsts} from '../AppConsts';
import {Category} from '../models/category.model';
import {Observable} from 'rxjs';
import {City} from '../models/city.model';

@Injectable()
export class CityService {
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
        return this.http.get<any>(`${this.baseUrl}/api/services/app/City/GetCityList`, {params: reqParams})
            .pipe(map(resp => {
                return resp;
            }));
    }

    getItemById(id: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/City/GetCity?id=${id}`)
            .pipe(map(resp => {
                return resp;
            }));
    }

    saveRow(item: City) {
        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/City/SaveCity', item)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/City/UpdateCity?cityId=${item.id}`, item)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRow(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/City/DeleteCity?cityId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }
}
