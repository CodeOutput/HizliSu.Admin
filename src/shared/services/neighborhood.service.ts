import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {AppConsts} from '../AppConsts';
import {Observable} from 'rxjs';
import {Neighborhood} from '../models/neighborhood.model';

@Injectable()
export class NeighborhoodService {
    private baseUrl = AppConsts.remoteServiceBaseUrl;

    constructor(private http: HttpClient) {

    }

    getList(co: Neighborhood) {
        const coStr = JSON.stringify(co);
        const coJson = JSON.parse(coStr);

        const reqParams = {};
        Object.keys(coJson).map(k => {
            reqParams[k] = coJson[k];
        });
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Neighborhood/GetNeighborhoodList`, {params: reqParams})
            .pipe(map(resp => {
                return resp;
            }));
    }

    getItemById(id: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Neighborhood/GetNeighborhood?id=${id}`)
            .pipe(map(resp => {
                return resp;
            }));
    }

    saveRow(item: Neighborhood) {
        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/Neighborhood/SaveNeighborhood', item)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/Neighborhood/UpdateNeighborhood?neighborhoodId=${item.id}`, item)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRow(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/Neighborhood/DeleteNeighborhood?neighborhoodId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }
}
