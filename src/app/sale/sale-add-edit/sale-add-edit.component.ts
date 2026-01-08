import { SaleDto } from './../sale.model';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SaleService } from '../sale.service';
import { SaleItemDto } from '../sale.model';
import { ProductService } from '../../product/product.service';
import { CustomerService } from '../../customer/customer.service';
import { Customer } from '../../customer/customer.model';
import { Product } from '../../product/product.model';
import { CustomerAddEditComponent } from '../../customer/customer-add-edit/customer-add-edit.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-sale-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatAutocompleteModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './sale-add-edit.component.html',
  styleUrls: ['./sale-add-edit.component.scss']
})
export class SaleAddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private saleService = inject(SaleService);
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  readonly dialogRef = inject(MatDialogRef<SaleAddEditComponent>);
  private dialog = inject(MatDialog);
  readonly data = inject<SaleDto | null>(MAT_DIALOG_DATA);

  today = new Date();

  saleForm: FormGroup = this.fb.group({
    //  invoiceNo: [''],
    //   invoiceDate: [this.today],
    customer: [null as Customer | string | null, Validators.required],
    customerGstin: [''],
    totalAmount: [{ value: 0, disabled: true }, Validators.required],
    totalTaxable: [{ value: 0, disabled: true }],
    totalCgst: [{ value: 0, disabled: true }],
    totalSgst: [{ value: 0, disabled: true }],
    totalIgst: [{ value: 0, disabled: true }],
    totalInvoiceValue: [{ value: 0, disabled: true }],
    items: this.fb.array([], [Validators.required, Validators.minLength(1)])
  });

  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }

  products = this.productService.products;
  customers = this.customerService.customers;
  customerTerm = signal('');
  productTerm = signal('');

  constructor() {
    this.productService.getProducts();
    this.customerService.getCustomers();

    // When the service returns dedicated sale items, populate the form
    effect(() => {
      if (!this.data || !(this.data as any).id) return;
      const sitems = this.saleService.saleItems();
      if (!sitems || sitems.length === 0) return;
      // clear existing
      while (this.items.length) this.items.removeAt(0);
      sitems.forEach(it => this.addItem(it));
      this.recalculateTotalAmount();
    });

    // When customers load, resolve the full customer object for edit mode so the autocomplete shows the name
    effect(() => {
      if (!this.data) return;
      const custs = this.customers();
      if (!custs || custs.length === 0) return;
      const found = custs.find(c => String(c.id) === String((this.data as any).customerId) || c.name === (this.data as any).customerName);
      if (found) {
        this.saleForm.get('customer')?.setValue(found, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.saleForm.patchValue(this.data);
      if (this.data.invoiceDate) {
        this.saleForm.get('invoiceDate')?.setValue(new Date(this.data.invoiceDate));
      }

      if (this.data.items?.length) {
        this.data.items.forEach(it => this.addItem(it));
        this.recalculateTotalAmount();
      } else if (this.data.id) {
        try { this.saleService.getItems((this.data as any).id); } catch (e) { /* ignore */ }
      }
    }
  }

  displayCustomer(customer: Customer | string): string {
    if (!customer) return '';
    if (typeof customer === 'string') return customer;
    return customer.name || '';
  }

  displayProduct(product: Product | string): string {
    if (!product) return '';
    if (typeof product === 'string') return product;
    return (product as Product).productName || '';
  }

  customerFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customerTerm.set(val);
    if (!val || val.trim() === '') this.customerService.getCustomers();
    else this.customerService.searchCustomer(val);
  }

  productFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.productTerm.set(val);
    if (!val || val.trim() === '') this.productService.getProducts();
    else this.productService.searchProduct(val);
  }

  onProductSelected(prod: Product, index: number) {

    try {
      const fg = this.items.at(index);
      fg.get('product')!.setValue(prod, { emitEvent: false });
      // if product has price, set rate
      if (prod) {
        fg.get('rate')!.setValue(prod.sellingPrice ?? 0, { emitEvent: false });
        fg.get('cgst')!.setValue(prod.cgst ?? 0, { emitEvent: false });
        fg.get('sgst')!.setValue(prod.sgst ?? 0, { emitEvent: false });
        fg.get('igst')!.setValue(prod.igst ?? 0, { emitEvent: false });
        this.recalculateItemTotal(fg as FormGroup);
      }
    } catch (e) { }
  }

  onCustomerSelected(cust: Customer | string) {
    if (typeof cust === 'string') {
      // This is a new customer, open dialog
      this.openAddCustomerDialog(cust);
    } else {
      // This is an existing customer
      this.saleForm.get('customer')!.setValue(cust, { emitEvent: false });
      this.saleForm.get('customerGstin')?.setValue(cust.gstin || '');
    }
  }

  openAddCustomerDialog(customerName?: string): void {
    const dialogRef = this.dialog.open(CustomerAddEditComponent, {
      width: '500px',
      data: customerName ? { name: customerName } : null // Pass the typed name to pre-fill the form
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // A new customer was added. The service should update the customer list.
        // The new customer object is in `result`.
        this.saleForm.get('customer')?.setValue(result);
        this.saleForm.get('customerGstin')?.setValue(result.gstin || '');
      }
    });
  }

  addItem(item?: any) {
    let product: Product | null = null;
    if (item?.productId) {
      product = this.products().find(p => p.id === item.productId) ?? null;
    } else if (item?.product) {
      product = item.product;
    }

    const rate = product ? product.sellingPrice : (item?.rate ?? 0);
    const cgst = product ? product.cgst : (item?.cgst ?? 0);
    const sgst = product ? product.sgst : (item?.sgst ?? 0);
    const igst = product ? product.igst : (item?.igst ?? 0);

    const group = this.fb.group({
      product: [product, Validators.required],
      qty: [item?.qty ?? 1, [Validators.required, Validators.min(1)]],
      rate: [{ value: rate, disabled: true }, Validators.required],
      taxableValue: [{ value: item?.taxableValue ?? 0, disabled: true }],
      cgst: [{ value: cgst, disabled: true }, Validators.required],
      sgst: [{ value: sgst, disabled: true }, Validators.required],
      igst: [{ value: igst, disabled: true }, Validators.required],
      total: [{ value: item?.total ?? 0, disabled: true }, Validators.required]
    });

    // Specify the `disabled` property at control creation time:
    // wire up recalculation when editable
    group.get('qty')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));
    group.get('rate')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));
    group.get('cgst')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));
    group.get('sgst')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));
    group.get('igst')!.valueChanges.subscribe(() => this.recalculateItemTotal(group));

    this.items.push(group);
    this.recalculateTotalAmount();
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.recalculateTotalAmount();
  }

  recalculateItemTotal(group: FormGroup) {
    const qty = Number(group.get('qty')!.value) || 0;
    const rate = Number(group.get('rate')!.value) || 0;
    const cgstRate = Number(group.get('cgst')!.value) || 0;
    const sgstRate = Number(group.get('sgst')!.value) || 0;
    const igstRate = Number(group.get('igst')!.value) || 0;

    const taxableValue = parseFloat((qty * rate).toFixed(2));
    const cgstAmount = taxableValue * (cgstRate / 100);
    const sgstAmount = taxableValue * (sgstRate / 100);
    const igstAmount = taxableValue * (igstRate / 100);

    const total = parseFloat((taxableValue + cgstAmount + sgstAmount + igstAmount).toFixed(2));

    group.get('taxableValue')!.setValue(taxableValue, { emitEvent: false });
    group.get('total')!.setValue(total, { emitEvent: false });
    this.recalculateTotalAmount();
  }

  recalculateTotalAmount() {
    let totalAmount = 0;
    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    this.items.controls.forEach(item => {
      const taxable = item.get('taxableValue')!.value || 0;
      totalTaxable += taxable;
      totalCgst += taxable * ((item.get('cgst')?.value || 0) / 100);
      totalSgst += taxable * ((item.get('sgst')?.value || 0) / 100);
      totalIgst += taxable * ((item.get('igst')?.value || 0) / 100);
      totalAmount += item.get('total')!.value || 0;
    });

    this.saleForm.get('totalAmount')!.setValue(parseFloat(totalAmount.toFixed(2)), { emitEvent: false });
    this.saleForm.get('totalTaxable')!.setValue(parseFloat(totalTaxable.toFixed(2)), { emitEvent: false });
    this.saleForm.get('totalCgst')!.setValue(parseFloat(totalCgst.toFixed(2)), { emitEvent: false });
    this.saleForm.get('totalSgst')!.setValue(parseFloat(totalSgst.toFixed(2)), { emitEvent: false });
    this.saleForm.get('totalIgst')!.setValue(parseFloat(totalIgst.toFixed(2)), { emitEvent: false });
    this.saleForm.get('totalInvoiceValue')!.setValue(parseFloat(totalAmount.toFixed(2)), { emitEvent: false });
  }

  onSubmit() {
    if (this.saleForm.invalid) return;

    const formValue = this.saleForm.getRawValue();

    // Prepare the payload, starting with all raw form values
    const payload: SaleDto = { ...formValue };

    // Correctly map customer details
    let customerId: string | undefined;
    let customerName: string = '';
    if (typeof formValue.customer === 'object' && formValue.customer) {
      customerId = formValue.customer.id;
      customerName = formValue.customer.name;
    } else if (typeof formValue.customer === 'string') {
      customerName = formValue.customer;
    }
    payload.customerId = customerId;
    payload.customerName = customerName;

    // Format date to YYYY-MM-DD
    payload.invoiceDate = formValue.invoiceDate ? new Date(formValue.invoiceDate).toISOString().slice(0, 10) : '';

    // Correctly map product ID for each item
    payload.items = formValue.items.map((item: any) => ({
      ...item,
      productId: item.product?.id,
    }));

    // Assign the ID for updates
    payload.id = this.data?.id;
    console.log("payload=" + payload);
    if (payload.id) {
      this.saleService.updateSale(payload.id, payload);
    } else {
      this.saleService.addSale(payload);
    }

    this.dialogRef.close(true);
  }

}
