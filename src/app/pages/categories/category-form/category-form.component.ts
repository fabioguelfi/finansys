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
  public category: Category = new Category();

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

  public submitForm(): void {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createCategory();
    } else if(this.currentAction === 'edit') {
      this.updateCategory();
    }
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


  private createCategory(): void {
    const { id, name, description } = this.categoryForm.value;
    const category: Category = new Category(name, description)
    this.categoryService.create(category)
    .subscribe((category: Category) => this.actionsForSuccess(category),
      error => this.actionsForError(error), noop);
  }

  private updateCategory(): void {
    this.categoryService.update({ ...this.categoryForm.value })
    .subscribe((category: Category) => this.actionsForSuccess(category),
    error => this.actionsForError(error), noop);
  }

  // Redirect/reload component 
  private actionsForSuccess(category: Category): void {
    toastr.success('Solicitacao processada com successo');
    this.router.navigateByUrl('categories', { skipLocationChange: true })
    .then(() => this.router.navigate(['categories', category.id, 'edit']))
  }

  private actionsForError(error): void {
    toastr.error("Ocorreu um erro ao processar sua solicitacao");
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicacao com o servidor']
    }
  }


}
