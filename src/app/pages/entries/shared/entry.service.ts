import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { Category } from '../../categories/shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private readonly apiPath: string = 'api/entries'

  constructor(private httpClient: HttpClient, private categoryService: CategoryService) { }

  public getAll(): Observable<Entry[]> {
    return this.httpClient.get(`${this.apiPath}`)
      .pipe(
        catchError(this.handlerError),
        map(this.jsonDataToEntries)
      )
  }

  public getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`
    return this.httpClient.get(`${url}`)
      .pipe(
        catchError(this.handlerError),
        map(this.jsonDataToEntry)
      )
  }

  public create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.id)
    .pipe(flatMap(category => { 
      entry.category = category 
      return this.httpClient.post(`${this.apiPath}`, { ...entry })
      .pipe(
        catchError(this.handlerError),
        map(this.jsonDataToEntry)
      )
    }));
  }

  public update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.id)
    .pipe(flatMap(category => {
      entry.category = category
      const url = `${this.apiPath}/${entry.id}`
      return this.httpClient.put(url, { ...entry })
        .pipe(
          catchError(this.handlerError),
          map(() => entry)
        )
    }))
  }

  public delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`
    return this.httpClient.delete(url)
    .pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    return jsonData.reduce((acc, curr) => (acc = [...acc, Object.assign(new Entry(), curr)]), [])
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry
  }

  private handlerError(error: any): Observable<any> {
    console.log(`error`, error)
    return throwError(error)
  }
}
