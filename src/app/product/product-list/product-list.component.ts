import { ProductService } from './../product.service';
import { AfterViewInit, Component, effect, inject, OnInit, resource, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
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
import { ProductAddEditComponent } from '../product-add-edit/product-add-edit.component';

@Component({
  selector: 'app-product-list',
  imports: [MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements AfterViewInit {
  productService = inject(ProductService);
  products = this.productService.Products;

  displayedColumns: string[] = ['id', 'name', 'sku', 'purchasePrice', 'salePrice', 'stockQuantity', 'taxRate', 'barcode', 'categoryId', 'actions'];
  dataSource = new MatTableDataSource<Product>(this.products());
  totalItems: number = 0;
  readonly dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() {
    this.productService.getProducts();
    effect(() => {
      const products = this.products();
      this.dataSource.data = products;
      this.totalItems = products.length;
      console.log('Products:', products);
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openAddEditProduct(): void {
    const dialogRef = this.dialog.open(ProductAddEditComponent, {
      width: '800px',
      height: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        //this.animal.set(result);
        console.log('This data is coming from Dialog:');
      }
    });

  }
  addEditProduct(id: any) {
    throw new Error('Method not implemented.');
  }

  deleteProduct(_t33: any) {
    throw new Error('Method not implemented.');
  }
  editProduct(_t33: any) {
    throw new Error('Method not implemented.');
  }



}
