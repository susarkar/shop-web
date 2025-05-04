import { Product } from './../product.model';
import { Component, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../category/category.service';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../category/category.model';
import { CategoryAddEditComponent } from '../../category/category-add-edit/category-add-edit.component';


@Component({
  selector: 'app-product-add-edit',
  imports: [MatSelectModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatDialogModule,
    MatDialogActions, MatDialogClose, ReactiveFormsModule, MatInputModule],

  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss'
})
export class ProductAddEditComponent {
  updateErrorMessage() {
    if (this.productForm.get('name')?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('');
    }

  }
  productForm: FormGroup;
  categoryService = inject(CategoryService);
  categories: Category[] = [];
  errorMessage = signal('');
  isLoading = signal(false);
  isEditMode = signal(false);
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  private formBuilder: FormBuilder = inject(FormBuilder);
  private productService: ProductService = inject(ProductService);
  private dialog: MatDialog = inject(MatDialog);

  constructor() {
    this.categoryService.getCategories();
    effect(() => {
      this.categories = this.categoryService.Categories();

    });
    this.productForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      sku: new FormControl('', [Validators.required]),
      purchasePrice: new FormControl('0.00', [Validators.required, Validators.min(0)]),
      salePrice: new FormControl('0.00', [Validators.required, Validators.min(0)]),
      imageUrl: new FormControl('', [Validators.required]),
      productUrl: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      dimensions: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      size: new FormControl('', [Validators.required]),
      material: new FormControl('', [Validators.required]),
      warranty: new FormControl('', [Validators.required]),
      stockStatus: new FormControl('', [Validators.required,]),
      stockQuantity: new FormControl('', [Validators.required, Validators.min(0)]),
      taxRate: new FormControl('', [Validators.required, Validators.min(0)]),
      barcode: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),

    });
  }

  saveProduct(): void {
    // const product = this.form.value as Product;
    // this.productService.addProduct(product).subscribe(() => {
    //   this.dialog.closeAll();
    // });
  }

}
