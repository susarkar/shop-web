export interface Product {
    id: string;
    productName: string;
    sku: string;
    hsnCode: string;
    unit: string;
    mrp: number;
    purchasePrice: number;
    sellingPrice: number;
    openingStock: number;
    cgst: number;
    sgst: number;
    igst: number;
}