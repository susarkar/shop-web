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

  openAddEditProduct() {
    throw new Error('Method not implemented.');
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
