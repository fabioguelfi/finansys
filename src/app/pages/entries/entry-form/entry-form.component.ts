import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { noop } from 'rxjs';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public entryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = null;
  public submittingForm: boolean = false;
  public entry: Entry = new Entry();
  public imaskConfig = {
    mask: Number,
    scale: 2,
    trousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private readonly entryService: EntryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  public ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  public submitForm(): void {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createEntry();
    } else if(this.currentAction === 'edit') {
      this.updateEntry();
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

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    })
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.activatedRoute.paramMap
      .pipe(switchMap(params => this.entryService.getById(+params.get('id'))))
      .subscribe((entry) => {
        this.entry = entry
        this.entryForm.patchValue({...entry}) // binds loaded entry data to EntryForm
      }, (error) => alert(error), noop)
    } else if(this.currentAction === 'new') {

    }
  }

  private setPageTitle(): void {
    this.currentAction === 'edit' ? this.pageTitle = 'Cadastro de novo lancamentos' : this.pageTitle = 'Editando lancamentos'
  }


  private createEntry(): void {
    const { id, name, description } = this.entryForm.value;
    const entry: Entry = new Entry(id, name, description)
    this.entryService.create(entry)
    .subscribe((entry: Entry) => this.actionsForSuccess(entry),
      error => this.actionsForError(error), noop);
  }

  private updateEntry(): void {
    this.entryService.update({ ...this.entryForm.value })
    .subscribe((entry: Entry) => this.actionsForSuccess(entry),
    error => this.actionsForError(error), noop);
  }

  // Redirect/reload component 
  private actionsForSuccess(entry: Entry): void {
    toastr.success('Solicitacao processada com successo');
    this.router.navigateByUrl('categories', { skipLocationChange: true })
    .then(() => this.router.navigate(['categories', entry.id, 'edit']))
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
