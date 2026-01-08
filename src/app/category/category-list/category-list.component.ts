import { Component, effect, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';
import { CategoryAddEditComponent } from '../category-add-edit/category-add-edit.component';

@Component({
  selector: 'app-category-list',
  imports: [MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule],

  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  onPageChange($event: PageEvent) {
    this.pageSize = $event.pageSize;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageIndex = $event.pageIndex;
    this.dataSource.paginator.pageSize = $event.pageSize;
    this.dataSource.paginator.length = this.totalRecords;
  }
  deleteCategory(id: any) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id);
      this.snackBar.open('Category deleted successfully', undefined, { duration: 3000 });
    }
  }

  openAddEditCategory(data?: any) {
    const dialogRef = this.dialog.open(CategoryAddEditComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: data || null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const message = data ? 'Category updated successfully' : 'Category added successfully';
        this.snackBar.open(message, undefined, { duration: 3000 });
        this.categoryService.getCategories();
      }
    });
  }
  categoryService = inject(CategoryService);
  categoryList = this.categoryService.categories;
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  totalRecords: number = 0;
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  constructor() {
    this.categoryService.getCategories();
    effect(() => {
      const categories = this.categoryList();
      this.dataSource.data = categories;
      this.totalRecords = categories.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


}
