import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { readExcelFile } from '../utils/excelParser';
import { OrderData } from '../types';

interface FileUploaderProps {
  onFileProcessed: (data: OrderData, fileName: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredColumns = [
    'Produto', 
    'Descrição', 
    'Ref.Fabricante', 
    'Prc Compra Totvs', 
    'Pedido', 
    'Total'
  ];

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);

    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      setError('Apenas arquivos .xlsx são aceitos');
      setLoading(false);
      return;
    }

    try {
      const data = await readExcelFile(file, requiredColumns);
      onFileProcessed(data, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
    } finally {
      setLoading(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative flex flex-col items-center justify-center w-full p-8
          border-2 border-dashed rounded-lg transition-all
          ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-600 hover:border-gray-500'}
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".xlsx"
          onChange={handleChange}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400">Processando arquivo...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-400 mb-2">Erro ao processar arquivo</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <FileSpreadsheet className="h-16 w-16 text-indigo-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Arraste e solte seu arquivo .xlsx
            </h3>
            <p className="text-gray-400 mb-6">ou</p>
            <button
              onClick={handleButtonClick}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              <Upload size={18} />
              Selecionar arquivo
            </button>
            
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md max-w-md">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/90 text-left">
                  O arquivo deve conter obrigatoriamente as colunas com os seguintes nomes exatos: 
                  <strong> Produto, Descrição, Ref.Fabricante, Prc Compra Totvs, Pedido, Total </strong> 
                  para funcionar corretamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;