import { Product } from './../product.model';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../category/category.service';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../category/category.model';
import { CategoryAddEditComponent } from '../../category/category-add-edit/category-add-edit.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnitService } from '../../unit/unit.service';
import { Unit } from '../../unit/unit.model';
import { NgIf } from "../../../../node_modules/@angular/common/common_module.d-C8_X2MOZ";


@Component({
  selector: 'app-product-add-edit',
  imports: [MatSelectModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatDialogModule, MatDialogActions, MatDialogClose, ReactiveFormsModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss',



})
export class ProductAddEditComponent implements OnInit {
  productForm: FormGroup;

  categories: Category[] = [];

  isLoading = signal(false);
  isEditMode = false;

  categoryService = inject(CategoryService);
  categoryList = this.categoryService.categories;
  formBuilder: FormBuilder = inject(FormBuilder);
  productService: ProductService = inject(ProductService);
  dialog: MatDialog = inject(MatDialog);
  dialogRef: MatDialog = inject(MatDialog);
  snackBar: MatSnackBar = inject(MatSnackBar);
  data: Product | null = inject<Product | null>(MAT_DIALOG_DATA);

  unitService = inject(UnitService);
  unitList = this.unitService.units;
  units: Unit[] = [];

  constructor() {
    this.isLoading.set(true);
    this.categoryService.getCategories();
    this.unitService.getUnits();
    this.isLoading.set(false);
    effect(() => {
      const categories = this.categoryList();
      this.categories = categories;
      this.units = this.unitList();

    });

    this.productForm = this.formBuilder.group({
      productName: new FormControl('', [Validators.required]),
      sku: new FormControl('', [Validators.required]),
      hsnCode: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      mrp: new FormControl('', [Validators.required, Validators.min(0)]),
      purchasePrice: new FormControl('', [Validators.required, Validators.min(0)]),
      sellingPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      openingStock: new FormControl('', [Validators.required, Validators.min(0)])
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.productForm.patchValue(this.data);
    }
  }
  onSubmit() {
    if (this.productForm.valid) {

      this.productService.addProduct(this.productForm.value);
    }
  }
}
