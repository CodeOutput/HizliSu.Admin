import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppConsts} from '../AppConsts';
import {Observable} from 'rxjs';
import {Manufacturer} from '../models/manufacturer.model';
import {Facility} from '../models/facility.model';
import {FacilityAttribute} from '../models/facility-attribute.model';

@Injectable()
export class ManufacturerService {
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
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Manufacturer/GetManufacturerList`, {params: reqParams})
            .pipe(map(resp => {
                return resp;
            }));
    }

    getItemById(categoryId: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Manufacturer/GetManufacturerDetail?id=${categoryId}`)
            .pipe(map(resp => {
                return resp;
            }));
    }

    saveManufacturer(item: Manufacturer) {
        const formData = new FormData();
        formData.append('content', item.file);
        formData.append('name', item.name ?? '');
        formData.append('description', item.description ?? '');
        formData.append('sortOrder', item.sortOrder.toString());

        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/Manufacturer/SaveManufacturer', formData)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/Manufacturer/UpdateManufacturer?manufacturerId=${item.id}`, formData)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRowManufacturer(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/Manufacturer/DeleteManufacturer?manufacturerId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    getListByManufacturerId(manufacturerId: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Manufacturer/GetFacilityList?manufacturerId=${manufacturerId}`,)
            .pipe(map(resp => {
                return resp;
            }));
    }


    saveFacility(item: Facility) {
        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/Manufacturer/SaveFacility', item)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/Manufacturer/UpdateFacility?facilityId=${item.id}`, item)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRowFacility(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/Manufacturer/DeleteFacility?facilityId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    saveFacilityAttribute(item: FacilityAttribute) {
        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/Manufacturer/SaveFacilityAttribute', item)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/Manufacturer/UpdateFacilityAttribute?facilityAttributeId=${item.id}`, item)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRowFacilityAttribute(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/Manufacturer/DeleteFacilityAttribute?facilityAttributeId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }
}
