import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiPath: string = 'api/categories'

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<Category[]> {
    return this.httpClient.get(`${this.apiPath}`)
      .pipe(
        catchError(this.handlerError),
        map(this.jsonDataToCategories)
      )
  }

  public getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`
    return this.httpClient.get(`${url}`)
      .pipe(
        catchError(this.handlerError),
        map(this.jsonDataToCategory)
      )
  }

  public create(category: Category): Observable<Category> {
    return this.httpClient.post(`${this.apiPath}`, { ...category })
      .pipe(
        catchError(this.handlerError),
        map(this.jsonDataToCategory)
      )
  }

  public update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`
    return this.httpClient.put(url, { ...category })
      .pipe(
        catchError(this.handlerError),
        map(() => category)
      )
  }

  public delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`
    return this.httpClient.delete(url)
    .pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private jsonDataToCategories(jsonData: any[]): Category[] {
    return jsonData.reduce((acc, curr) => (acc = [...acc, curr]), [])
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category
  }

  private handlerError(error: any): Observable<any> {
    console.log(`error`, error)
    return throwError(error)
  }
}
