import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {AppConsts} from '../AppConsts';
import {Observable} from 'rxjs';
import {District} from '../models/district.model';

@Injectable()
export class DistrictService {
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
        return this.http.get<any>(`${this.baseUrl}/api/services/app/District/GetDistrictList`, {params: reqParams})
            .pipe(map(resp => {
                return resp;
            }));
    }

    getItemById(id: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/District/GetDistrict?id=${id}`)
            .pipe(map(resp => {
                return resp;
            }));
    }

    saveRow(item: District) {
        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/District/SaveDistrict', item)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/District/UpdateDistrict?cityId=${item.id}`, item)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRow(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/District/DeleteDistrict?districtId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }
}
