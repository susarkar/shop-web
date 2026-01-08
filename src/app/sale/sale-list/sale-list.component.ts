import { Component, effect, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { SaleService } from '../sale.service';
import { SaleDto } from '../sale.model';
import { MatIcon } from '@angular/material/icon';
import { MatTable } from '@angular/material/table';
import { SaleAddEditComponent } from '../sale-add-edit/sale-add-edit.component';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.scss'
})
export class SaleListComponent {
  saleService = inject(SaleService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  sales: SaleDto[] = this.saleService.sales();
  displayedColumns: string[] = ['invoiceNo', 'invoiceDate', 'customerName', 'totalInvoiceValue', 'actions'];
  dataSource = new MatTableDataSource<SaleDto>(this.sales);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.saleService.getSales();
    effect(() => {
      const s = this.saleService.sales();
      this.dataSource.data = s;
      // assign once view children are present
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openAddEditSale(data?: SaleDto) {
    const ref = this.dialog.open(SaleAddEditComponent, {
      width: '90vw',
      maxWidth: '1200px',
      data: data || null
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const message = data ? 'Sale updated' : 'Sale added';
        this.snackBar.open(message, undefined, { duration: 3000 });
        this.saleService.getSales();
      }
    });
  }

  deleteSale(id: any) {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    this.saleService.deleteSale(id);
    this.snackBar.open('Sale deleted', undefined, { duration: 3000 });
  }
}
