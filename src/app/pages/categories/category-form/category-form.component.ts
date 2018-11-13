import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { noop } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public categoryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = null;
  public submittingForm: boolean = false;
  public category: Category = new Category(null, null, null);

  constructor(
    private readonly categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  public ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.activatedRoute.snapshot.url[0].path === 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
    console.log(this.currentAction)
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.activatedRoute.paramMap
      .pipe(switchMap(params => this.categoryService.getById(+params.get('id'))))
      .subscribe((category) => {
        this.category = { ...category }
        this.categoryForm.patchValue({...category}) // binds loaded category data to CategoryForm
      }, (error) => alert(error), noop)
    } else if(this.currentAction === 'new') {

    }
  }

  private setPageTitle(): void {
    this.currentAction === 'edit' ? this.pageTitle = 'Cadastro de nova categoria' : this.pageTitle = 'Editando categoria'
  }

}
