
import React, { useState, useMemo } from 'react';
import { AppState, Expense } from '../types';

interface WalletPageProps {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ data, updateData }) => {
  const [calcInput, setCalcInput] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePhoto, setExpensePhoto] = useState<string | null>(null);

  const currentRate = data.settings.fxRates[data.settings.mainCurrency] || 1;

  const handleCalc = () => {
    try {
      const sanitized = calcInput.replace(/[^0-9+\-*/.()]/g, '');
      const result = new Function(`return ${sanitized}`)();
      setCalcInput(result.toString());
      setExpenseAmount(result.toString());
    } catch (e) {
      setCalcInput('Error');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setExpensePhoto(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!expenseName || isNaN(amount)) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: expenseName,
      amount,
      currency: data.settings.mainCurrency,
      hkdAmount: Number((amount * currentRate).toFixed(2)),
      category: 'General',
      date: new Date().toISOString().split('T')[0],
      photo: expensePhoto || undefined
    };

    updateData({ expenses: [newExpense, ...data.expenses] });
    setExpenseName('');
    setExpenseAmount('');
    setExpensePhoto(null);
  };

  const deleteExpense = (id: string) => {
    updateData({ expenses: data.expenses.filter(e => e.id !== id) });
  };

  const totalOriginal = useMemo(() => data.expenses.reduce((sum, e) => sum + e.amount, 0), [data.expenses]);
  const totalHKD = useMemo(() => data.expenses.reduce((sum, e) => sum + e.hkdAmount, 0), [data.expenses]);

  const exportCSV = () => {
    const headers = ['Date', 'Item', 'Amount', 'Currency', 'HKD Amount'];
    const rows = data.expenses.map(e => [e.date, e.name, e.amount, e.currency, e.hkdAmount]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trip_expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-3xl muji-shadow mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Summary</h3>
          <button onClick={exportCSV} className="text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">
            <i className="fa-solid fa-download mr-1"></i> CSV
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total {data.settings.mainCurrency}</p>
            <p className="text-xl font-medium text-gray-800">{totalOriginal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total HKD</p>
            <p className="text-xl font-bold text-black">$ {totalHKD.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl muji-shadow mb-8 border border-gray-100 space-y-4">
        <div className="relative">
          <input 
            value={calcInput}
            onChange={e => setCalcInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCalc()}
            placeholder="Expression (e.g. 500+250)"
            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm"
          />
          <button onClick={handleCalc} className="absolute right-3 top-2.5 text-gray-300"><i className="fa-solid fa-equals"></i></button>
        </div>

        <input 
          placeholder="Item name"
          value={expenseName}
          onChange={e => setExpenseName(e.target.value)}
          className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm"
        />
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-[10px] text-gray-400 font-bold">{data.settings.mainCurrency}</span>
            <input 
              type="number"
              placeholder="0.00"
              value={expenseAmount}
              onChange={e => setExpenseAmount(e.target.value)}
              className="w-full p-3 pl-12 bg-gray-50 border-none rounded-xl text-sm"
            />
          </div>
          <label className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl cursor-pointer text-gray-300 hover:text-black">
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
            <i className={`fa-solid ${expensePhoto ? 'fa-check text-black' : 'fa-camera'}`}></i>
          </label>
        </div>

        <button 
          onClick={addExpense}
          className="w-full py-4 muji-bg-black text-white rounded-2xl font-bold tracking-widest text-xs uppercase muji-shadow"
        >
          Add Expense
        </button>
      </div>

      <div className="space-y-3">
        {data.expenses.map((exp) => (
          <div key={exp.id} className="bg-white p-4 rounded-2xl muji-shadow border border-gray-50 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {exp.photo ? <img src={exp.photo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-receipt text-gray-200"></i>}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 truncate">{exp.name}</h4>
              <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{exp.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{exp.amount.toLocaleString()} <span className="text-[10px] text-gray-400">{exp.currency}</span></p>
              <p className="text-[10px] font-bold text-black tracking-tighter">≈ ${exp.hkdAmount.toLocaleString()} HKD</p>
            </div>
            <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-black">
              <i className="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletPage;
