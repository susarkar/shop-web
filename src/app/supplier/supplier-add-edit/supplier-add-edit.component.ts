import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-supplier-add-edit',
  imports: [MatSelectModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatDialogModule, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './supplier-add-edit.component.html',
  styleUrl: './supplier-add-edit.component.scss'
})
export class SupplierAddEditComponent implements OnInit {
  supplierForm: FormGroup; // Initialize the form group
  formBuilder: FormBuilder = inject(FormBuilder);
  supplierService = inject(SupplierService); // Adjust the path as needed
  readonly dialogRef = inject(MatDialogRef<SupplierAddEditComponent>);
  readonly data = inject<Supplier>(MAT_DIALOG_DATA);
  constructor() {
    this.data = inject<Supplier>(MAT_DIALOG_DATA);
    this.supplierForm = this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.supplierForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      if (this.data) {
        this.supplierService.updateSupplier(this.data.id, this.supplierForm.value);
      } else {
        this.supplierService.addSupplier(this.supplierForm.value);
      }
      this.dialogRef.close(this.supplierForm.value);

    }
  }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}
