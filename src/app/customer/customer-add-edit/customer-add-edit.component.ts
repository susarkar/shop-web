import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './customer-add-edit.component.html',
  styleUrl: './customer-add-edit.component.scss'
})
export class CustomerAddEditComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerService = inject(CustomerService);
  dialogRef = inject(MatDialogRef<CustomerAddEditComponent>);
  data = inject<Customer>(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  constructor() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gstin: ['', Validators.required],
    });


  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.customerForm.patchValue(this.data);
    }
  }
  onSubmit() {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      if (this.isEditMode && this.data?.id) {
        this.customerService.updateCustomer(this.data.id, customer);
      } else {
        this.customerService.addCustomer(customer);
      }
      this.dialogRef.close(customer);
    }
  }
}