import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  public ngOnInit(): void {
    this.categoryService.getAll()
      .subscribe(
        categories => this.categories = [...categories],
        error => console.log(error),
        () => { }
      )
  }

  public deleteCategory({ id }: Category): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) return
    this.categoryService.delete(id).subscribe(
      () => this.categories = this.categories.filter(i => i.id != id),
      () => alert(`error`)
    )
  }

}
