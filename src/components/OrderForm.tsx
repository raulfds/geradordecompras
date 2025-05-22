import React, { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { SupplierData } from '../types';

interface OrderFormProps {
  supplier: SupplierData | null;
  onSupplierChange: (supplier: SupplierData | null) => void;
  paymentCondition: string;
  onPaymentConditionChange: (value: string) => void;
  purchaseClass: string;
  onPurchaseClassChange: (value: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  supplier,
  onSupplierChange,
  paymentCondition,
  onPaymentConditionChange,
  purchaseClass,
  onPurchaseClassChange
}) => {
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await fetch('/fornecedor.json');
        const data = await response.json();
        setSuppliers(data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar fornecedores');
        setLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSupplierName = (supplier: SupplierData): string => {
    return supplier['Razao Social'] || '';
  };

  const getSupplierPaymentCondition = (supplier: SupplierData): string => {
    return supplier['Cond. Pagto'] || '';
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm) return false;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const supplierName = getSupplierName(supplier).toLowerCase();
    const supplierCode = supplier.Codigo.toLowerCase();
    
    return supplierName.includes(searchLower) || supplierCode.includes(searchLower);
  });

  const handleSupplierSelect = (supplier: SupplierData) => {
    const paymentCondition = getSupplierPaymentCondition(supplier);
    onSupplierChange({
      ...supplier,
      condPagto: paymentCondition
    });
    setSearchTerm(getSupplierName(supplier));
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);
    
    if (supplier && value !== getSupplierName(supplier)) {
      onSupplierChange(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Fornecedor
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Buscar por nome ou código..."
            className="bg-gray-700 border border-gray-600 text-white w-full pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {supplier && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        
        {showResults && (
          <div 
            ref={resultsRef}
            className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-400">Carregando...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-400">{error}</div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="p-4 text-center text-gray-400">Nenhum fornecedor encontrado</div>
            ) : (
              <ul>
                {filteredSuppliers.map((supplier) => (
                  <li 
                    key={supplier.Codigo}
                    onClick={() => handleSupplierSelect(supplier)}
                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <div className="font-medium">{getSupplierName(supplier)}</div>
                    <div className="text-xs text-gray-400">Código: {supplier.Codigo}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Condição de Pagamento
        </label>
        <input
          type="text"
          value={paymentCondition}
          onChange={(e) => onPaymentConditionChange(e.target.value)}
          placeholder="Ex: 30/60/90"
          disabled={!supplier}
          className={`
            bg-gray-700 border border-gray-600 text-white w-full px-4 py-2 rounded-md 
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
            ${!supplier ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        />
        {supplier && !getSupplierPaymentCondition(supplier) && (
          <p className="mt-1 text-xs text-amber-400">
            Este fornecedor não possui uma condição de pagamento padrão. Por favor, preencha manualmente.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Classificação de Compra
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['ESTOQUE', 'FULL', 'ENCOMENDA'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPurchaseClassChange(option)}
              disabled={!supplier}
              className={`
                px-4 py-2 rounded-md text-center transition-all
                ${purchaseClass === option 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                ${!supplier ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;