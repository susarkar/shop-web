import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './category-add-edit.component.html',
  styleUrl: './category-add-edit.component.scss'
})
export class CategoryAddEditComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryService = inject(CategoryService);
  dialogRef = inject(MatDialogRef<CategoryAddEditComponent>);
  data = inject<Category>(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.categoryForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value as Category;
      if (this.isEditMode && this.data?.id) {
        // include id when editing
        const payload = { ...category, id: this.data.id } as any;
        this.categoryService.editCategory(payload);
      } else {
        this.categoryService.addCategory(category);
      }
      this.dialogRef.close(category);
    }
  }

}
