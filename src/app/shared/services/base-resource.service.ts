import { HttpClient } from '@angular/common/http';
import { BaseResourceModel } from '../models/base.resource.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> {
    protected httpClient: HttpClient;

    constructor(
        protected apiPath: string,
        protected injector: Injector) { 
            this.httpClient = injector.get(HttpClient)
        }

    public getAll(): Observable<T[]> {
        return this.httpClient.get(`${this.apiPath}`)
            .pipe(catchError(this.handlerError), map(this.jsonDataToResources));
    }

    public getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`
        return this.httpClient.get(`${url}`)
            .pipe(catchError(this.handlerError), map(this.jsonDataToResource));
    }

    public create(resource: T): Observable<T> {
        return this.httpClient.post(`${this.apiPath}`, resource)
            .pipe(catchError(this.handlerError),map(this.jsonDataToResource))
    }

    public update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`
        return this.httpClient.put(url, resource)
            .pipe(catchError(this.handlerError),map(() => resource))
    }

    public delete(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`
        return this.httpClient.delete(url)
            .pipe(catchError(this.handlerError),map(() => null))
    }

    // Protected Methods

    protected jsonDataToResources(jsonData: any[]): T[] {
        return jsonData.reduce((acc, curr) => (acc = [...acc, curr]), [])
    }

    protected jsonDataToResource(jsonData: any): T {
        return jsonData as T
    }

    protected handlerError(error: any): Observable<any> {
        return throwError(error)
    }
}