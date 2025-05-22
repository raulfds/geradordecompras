import React from 'react';
import { OrderData } from '../types';

interface OrderTableProps {
  data: OrderData;
}

const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  // Format currency values
  const formatCurrency = (value: string | number): string => {
    if (typeof value === 'string') {
      // Remove currency symbols and other non-numeric characters except for decimal point
      const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
      return isNaN(numericValue) ? 'R$ 0,00' : `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
    }
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            <th className="py-3 px-4 text-gray-400 font-medium">Produto</th>
            <th className="py-3 px-4 text-gray-400 font-medium">Descrição</th>
            <th className="py-3 px-4 text-gray-400 font-medium">Ref. Fabricante</th>
            <th className="py-3 px-4 text-gray-400 font-medium text-right">Preço Unit.</th>
            <th className="py-3 px-4 text-gray-400 font-medium text-right">Quantidade</th>
            <th className="py-3 px-4 text-gray-400 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr 
              key={index}
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-300">{item.Produto}</td>
              <td className="py-3 px-4 text-gray-300">{item.Descrição}</td>
              <td className="py-3 px-4 text-gray-300">{item['Ref.Fabricante']}</td>
              <td className="py-3 px-4 text-gray-300 text-right">{formatCurrency(item['Prc Compra Totvs'])}</td>
              <td className="py-3 px-4 text-gray-300 text-right">{item.Pedido}</td>
              <td className="py-3 px-4 text-gray-300 text-right">{formatCurrency(item.Total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-800/50">
            <td colSpan={5} className="py-3 px-4 text-gray-300 font-medium text-right">
              Total Geral:
            </td>
            <td className="py-3 px-4 text-indigo-300 font-bold text-right">
              {formatCurrency(data.total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderTable;