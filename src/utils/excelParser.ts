import * as XLSX from 'xlsx';
import { OrderData, OrderItem } from '../types';

/**
 * Reads and parses an Excel file
 * @param file The Excel file to be parsed
 * @param requiredColumns Array of column names that must be present
 * @returns Parsed order data
 */
export const readExcelFile = async (
  file: File, 
  requiredColumns: string[]
): Promise<OrderData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('Falha ao ler o arquivo');
        }
        
        // Parse workbook
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error('Arquivo não contém dados');
        }
        
        // Validate required columns
        const sampleRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
        
        if (missingColumns.length > 0) {
          throw new Error(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`);
        }
        
        // Process data
        const items: OrderItem[] = jsonData.map(row => ({
          Produto: String(row['Produto'] || ''),
          Descrição: String(row['Descrição'] || ''),
          'Ref.Fabricante': String(row['Ref.Fabricante'] || ''),
          'Prc Compra Totvs': row['Prc Compra Totvs'],
          Pedido: typeof row['Pedido'] === 'number' ? row['Pedido'] : parseInt(row['Pedido']),
          Total: typeof row['Total'] === 'number' ? row['Total'] : parseFloat(String(row['Total']).replace(/[^\d.,]/g, '').replace(',', '.')),
          Loja: String(row['Loja'] || ''),
          Local: String(row['Local'] || ''),
        }));
        
        // Calculate total
        const total = items.reduce((sum, item) => sum + item.Total, 0);
        
        resolve({ items, total });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    // Read as binary string
    reader.readAsBinaryString(file);
  });
};