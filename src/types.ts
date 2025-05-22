export interface OrderItem {
  Produto: string;
  Descrição: string;
  'Ref.Fabricante': string;
  'Prc Compra Totvs': string | number;
  Pedido: number;
  Total: number;
}

export interface OrderData {
  items: OrderItem[];
  total: number;
}

export interface SupplierData {
  Codigo: string;
  Loja?: string;
  'Razao Social'?: string;
  Razao?: string;
  'Cond. Pagto'?: string;
  condPagto?: string;
}

export interface CSVGenerationParams {
  orderData: OrderData;
  supplier: SupplierData;
  paymentCondition: string;
  purchaseClass: string;
  fileName: string;
}