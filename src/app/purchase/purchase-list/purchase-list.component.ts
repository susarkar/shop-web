import { FormBuilder } from '@angular/forms';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PurchaseService } from '../purchase.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PurchaseAddEditComponent } from '../purchase-add-edit/purchase-add-edit.component';
import { CommonModule } from '@angular/common';
import { PurchaseViewComponent } from '../purchase-view.component';
import { PurchaseDto } from '../purchase.model';

@Component({
  selector: 'app-purchase-list',
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule],

  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent {
  openViewPurchase(data: any) {
    // Logic to open the dialog for viewing a purchase
    const dialogRef = this.dialog.open(PurchaseViewComponent, {
      data: data // Pass the purchase data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Purchase viewed successfully', undefined, { duration: 3000 });
      }
    });

  }
  purchaseService = inject(PurchaseService);
  purchases = this.purchaseService.purchases;
  items: any[] = [];
  purchaseItems = this.purchaseService.purchaseItems;
  fb = inject(FormBuilder);
  displayedColumns: string[] = ['supplierName', 'date', 'totalAmount', 'taxAmount', 'status', 'actions'];
  dataSource = new MatTableDataSource<PurchaseDto>();
  totalRecords: number = 0;
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  constructor() {
    this.purchaseService.getPurchases();
    effect(() => {
      const purchases = this.purchases();
      this.dataSource.data = purchases;
      this.totalRecords = purchases.length;
      // Only set paginator/sort if they haven't been initialized yet
      if (!this.dataSource.paginator && this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (!this.dataSource.sort && this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }
  openAddEditPurchase(data?: PurchaseDto): void {
    // Logic to open the dialog for adding or editing a purchase
    const dialogRef = this.dialog.open(PurchaseAddEditComponent, {
      width: '1200px',
      maxHeight: '90vh',
      data: data || null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const message = data ? 'Purchase updated successfully' : 'Purchase added successfully';
        this.snackBar.open(message, undefined, { duration: 3000 });

      }
      this.purchaseService.getPurchases();
    });
  }
  deletePurchase(id: any) {
    if (confirm('Are you sure you want to delete this purchase?')) {
      this.purchaseService.deletePurchase(id);
      this.snackBar.open('Purchase deleted successfully', undefined, { duration: 3000 });
      this.purchaseService.getPurchases();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.dataSource.paginator = this.paginator;
  }
  onSortChange(event: Sort) {
    this.dataSource.sort = this.sort;
  }
  onPageSizeChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    //  this.dataSource.paginator.pageSize = this.pageSize;
  }

  trackByFn(index: number, item: PurchaseDto): any {
    return item.id || index;
  }
}
