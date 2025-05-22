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
  // Get current date in DD/MM/YYYY format
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  
  // Generate CSV content
  const rows: string[] = [];
  
  // Add header row
  rows.push('Fornecedor;Loja;CondPag;Produto;Quantidade;Valor;DataEntrega;Local;ClasCompra');
  
  // Add data rows
  orderData.items.forEach(item => {
    // Create CSV row
    const row = [
      supplier.Codigo,
      "'01", // Revertendo para valor fixo com aspas simples
      "'" + paymentCondition, // Adicionando aspa simples antes da condição de pagamento
      item.Produto,
      item.Pedido,
      // Usando Prc Compra Totvs para Valor unitário, formatando com 2 casas decimais e vírgula
      typeof item['Prc Compra Totvs'] === 'number' 
        ? item['Prc Compra Totvs'].toFixed(2).replace('.', ',')
        : parseFloat(String(item['Prc Compra Totvs']).replace(/[^\d.,]/g, '').replace(',', '.')).toFixed(2).replace('.', ','),
      formattedDate, // Using formatted date
      "'01", // Revertendo para valor fixo com aspas simples
      purchaseClass
    ].join(';'); // Alterado para ponto e vírgula
    
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