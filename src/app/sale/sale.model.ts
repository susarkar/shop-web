
export interface SaleItemDto {
    id: string;
    productId: string;
    qty: number;
    rate: number;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
}

export interface SaleDto {
    id: string | undefined;
    invoiceNo: string;
    invoiceDate: string;
    customerName: string;
    customerId?: string;
    customerGstin: string;
    totalAmount: number;
    totalTaxable: number;
    totalCgst: number;
    totalSgst: number;
    totalIgst: number;
    totalInvoiceValue: number;
    items: SaleItemDto[];
}
