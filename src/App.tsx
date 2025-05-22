import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import FileUploader from './components/FileUploader';
import OrderTable from './components/OrderTable';
import OrderForm from './components/OrderForm';
import { OrderData, SupplierData } from './types';
import { generateCSV } from './utils/csvGenerator';

function App() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [paymentCondition, setPaymentCondition] = useState<string>('');
  const [purchaseClass, setPurchaseClass] = useState<string>('ESTOQUE');

  const handleFileProcessed = (data: OrderData, name: string) => {
    setOrderData(data);
    setFileName(name);
  };

  const handleSupplierChange = (selected: SupplierData | null) => {
    setSupplier(selected);
    if (selected && selected.condPagto) {
      setPaymentCondition(selected.condPagto);
    } else {
      setPaymentCondition('');
    }
  };

  const handlePaymentConditionChange = (value: string) => {
    setPaymentCondition(value);
  };

  const handlePurchaseClassChange = (value: string) => {
    setPurchaseClass(value);
  };

  const handleGenerateCSV = () => {
    if (!orderData || !supplier) return;
    
    const outputFileName = fileName.replace(/\.xlsx$/i, '.csv');
    
    generateCSV({
      orderData,
      supplier,
      paymentCondition,
      purchaseClass,
      fileName: outputFileName
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-indigo-400 mb-2">
            Gerador de Pedidos
          </h1>
          <p className="text-center text-gray-400">
            Importe seu arquivo XLSX e gere pedidos em formato CSV
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {!orderData ? (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transition-all hover:border-indigo-500/30">
              <FileUploader onFileProcessed={handleFileProcessed} />
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-indigo-300">
                    Dados do Arquivo
                  </h2>
                  <button 
                    onClick={() => setOrderData(null)}
                    className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Trocar arquivo
                  </button>
                </div>
                <OrderTable data={orderData} />
              </div>

              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-indigo-300 mb-4">
                  Dados Complementares
                </h2>
                <OrderForm 
                  supplier={supplier}
                  onSupplierChange={handleSupplierChange}
                  paymentCondition={paymentCondition}
                  onPaymentConditionChange={handlePaymentConditionChange}
                  purchaseClass={purchaseClass}
                  onPurchaseClassChange={handlePurchaseClassChange}
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleGenerateCSV}
                  disabled={!supplier || !paymentCondition}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white
                    ${supplier && paymentCondition 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-600 cursor-not-allowed'}
                    transition-colors shadow-lg
                  `}
                >
                  <Upload size={18} />
                  Gerar CSV
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;