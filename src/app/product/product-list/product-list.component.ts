import { ProductService } from './../product.service';
import { AfterViewInit, Component, effect, inject, OnInit, resource, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../product.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductAddEditComponent } from '../product-add-edit/product-add-edit.component';


@Component({
  selector: 'app-product-list',
  imports: [MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  productService = inject(ProductService);

  products: Product[] = this.productService.products();

  displayedColumns: string[] = ['productName', 'sku', 'hsnCode', 'unit', 'mrp', 'purchasePrice', 'sellingPrice', 'openingStock', 'actions'];
  dataSource = new MatTableDataSource<Product>(this.products);
  totalRecords: number = 0;
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {

    this.productService.getProducts();
    effect(() => {
      const products = this.productService.products();
      this.dataSource.data = products;

      this.totalRecords = products.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
  }

  openAddEditProduct(data?: Product): void {
    const dialogRef = this.dialog.open(ProductAddEditComponent, {
      width: '800px',
      height: '500px',
      data: data || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const message = data ? 'Product updated successfully' : 'Product added successfully';
        this.snackBar.open(message, undefined, { duration: 3000 });
        this.productService.getProducts();
      }
    });
  }

  deleteProduct(id: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
      this.snackBar.open('Product deleted successfully', undefined, { duration: 3000 });
    }
  }
}
