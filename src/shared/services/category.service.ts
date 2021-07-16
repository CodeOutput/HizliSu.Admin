import {HttpClient} from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AppConsts} from '../AppConsts';
import {Category} from '../models/category.model';
import {Observable} from 'rxjs';

@Injectable()
export class CategoryService {
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
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Category/GetCategoryList`, {params: reqParams})
            .pipe(map(resp => {
                return resp;
            }));
    }

    getItemById(categoryId: number) {
        return this.http.get<any>(`${this.baseUrl}/api/services/app/Category/GetCategoryDetail?id=${categoryId}`)
            .pipe(map(resp => {
                return resp;
            }));
    }

    saveCategory(item: Category) {
        const formData = new FormData();
        formData.append('content', item.file);
        formData.append('name', item.name ?? '');
        formData.append('description', item.description ?? '');
        formData.append('sortOrder', item.sortOrder.toString());

        if (item.id == null) {
            return this.http.post<any>(this.baseUrl + '/api/services/app/Category/SaveCategory', formData)
                .pipe(map(resp => {
                    return resp;
                }));
        } else {
            return this.http.put<any>(this.baseUrl + `/api/services/app/Category/UpdateCategory?categoryId=${item.id}`, formData)
                .pipe(map(resp => {
                    return resp;
                }));
        }
    }

    public deleteRowCategory(id: number): Observable<any> {
        return this.http.delete(this.baseUrl + `/api/services/app/Category/DeleteCategory?categoryId=${id}`).pipe(
            map((result: any) => {
                return result;
            })
        );
    }
}
