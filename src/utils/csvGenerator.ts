import { CSVGenerationParams } from '../types';

/**
 * Generates and downloads a CSV file from order data
 */
export const generateCSV = ({
  orderData,
  supplier,
  paymentCondition,
  purchaseClass,
  fileName
}: CSVGenerationParams) => {
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Generate CSV content
  const rows: string[] = [];
  
  // Add header row
  rows.push('Fornecedor,Loja,CondPag,Produto,Quantidade,Valor,DataEntrega,Local,ClasCompra');
  
  // Add data rows
  orderData.items.forEach(item => {
    // Convert price to numeric value (removing currency symbols)
    let price = item['Prc Compra Totvs'];
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'));
    }
    
    // Create CSV row
    const row = [
      supplier.Codigo,
      "'01", // With apostrophe as requested
      paymentCondition,
      item.Produto,
      item.Pedido,
      price.toString(),
      today,
      "'01", // With apostrophe as requested
      purchaseClass
    ].join(',');
    
    rows.push(row);
  });
  
  // Join rows with newlines
  const csvContent = rows.join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download link
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};