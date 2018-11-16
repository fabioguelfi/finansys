import { Injectable } from '@angular/core';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly apiPath: string = 'api/categories'

  constructor() { }

}
