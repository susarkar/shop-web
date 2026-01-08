import { PurchaseService } from './purchase.service';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { DateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-purchase-view',
  imports: [CommonModule, MatDialogModule, DialogModule, MatTableModule],
  template: `
    <h2 mat-dialog-title>Purchase Order #{{ data.id }}</h2>
    <mat-dialog-content>
      <p><strong>Supplier:</strong> {{ data.supplierName || data.supplierId }}</p>
      <p><strong>Date:</strong> {{ data.date | date:'mediumDate' }}</p>
      <p><strong>Status:</strong> {{ data.status }}</p>
      <p><strong>Total Amount:</strong> {{ data.totalAmount }}</p>
      <p><strong>Tax Amount:</strong> {{ data.taxAmount }}</p>
      <h3>Items</h3>
      <table mat-table [dataSource]="items()" class="mat-elevation-z8">
        <ng-container matColumnDef="productName">
          <th mat-header-cell *matHeaderCellDef>Product</th>
          <td mat-cell *matCellDef="let item">{{ item.productName }}</td>
        </ng-container>
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Quantity</th>
          <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let item">{{ item.price }}</td>
        </ng-container>
        <ng-container matColumnDef="itemTotal">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let item">{{ item.itemTotal }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['productName', 'quantity', 'price', 'itemTotal']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['productName', 'quantity', 'price', 'itemTotal'];"></tr>
      </table>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class PurchaseViewComponent {
  purchaseService = inject(PurchaseService);
  data = inject(MAT_DIALOG_DATA);
  items = this.purchaseService.purchaseItems;
  dataSource = new MatTableModule();
  constructor() {
    this.purchaseService.getPurchaseItems(this.data.id);

  }

  // Fetch items from the service

}