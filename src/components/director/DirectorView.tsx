import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Building2,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  CreditCard,
  PlusCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { FinancialMovement, ActiveLoan, BankAccount } from '../../types/greenhouse';

export const DirectorView: React.FC = () => {
  const {
    activeView,
    bankAccounts,
    movements,
    loans,
    orders,
    modules,
    harvest,
    auditLogs,
    addFinancialMovement,
    addLoan,
  } = useGreenhouse();

  // Movement Form Modal state
  const [showAddMovModal, setShowAddMovModal] = useState(false);
  const [movType, setMovType] = useState<'ingreso' | 'egreso' | 'transferencia'>('egreso');
  const [movScope, setMovScope] = useState<'empresarial' | 'personal'>('empresarial');
  const [movCategory, setMovCategory] = useState('Insumos Agrícolas');
  const [movAmount, setMovAmount] = useState('');
  const [movDesc, setMovDesc] = useState('');
  const [movAccount, setMovAccount] = useState(bankAccounts[0]?.id || 'bco-1');

  // Filter for movements
  const [filterScope, setFilterScope] = useState<'todos' | 'empresarial' | 'personal'>('todos');

  // Metrics
  const totalBankBalance = bankAccounts.reduce((acc, b) => acc + b.balance, 0);
  const totalBusinessIncome = movements
    .filter((m) => m.type === 'ingreso' && m.scope === 'empresarial')
    .reduce((acc, m) => acc + m.amount, 0);
  const totalBusinessExpense = movements
    .filter((m) => m.type === 'egreso' && m.scope === 'empresarial')
    .reduce((acc, m) => acc + m.amount, 0);
  const totalPersonalDraws = movements
    .filter((m) => m.scope === 'personal')
    .reduce((acc, m) => acc + m.amount, 0);
  const totalDebt = loans.reduce((acc, l) => acc + l.outstandingBalance, 0);

  const totalStemsSold = orders.reduce((acc, o) => acc + o.totalStems, 0);
  const totalHarvestedStems = harvest.reduce((acc, h) => acc + h.stemsCut, 0);
  const totalArea = modules.reduce((acc, m) => acc + m.areaM2, 0);

  // Cost estimates:
  const costPerStem = 3.85; // $3.85 MXN per stem
  const costPerPackage = costPerStem * 25; // $96.25 MXN per 25 stem bunch
  const avgSalePricePerStem = totalStemsSold > 0 ? (orders.reduce((acc, o) => acc + o.totalAmount, 0) / totalStemsSold) : 8.5;
  const grossMarginPercent = (((avgSalePricePerStem - costPerStem) / avgSalePricePerStem) * 100).toFixed(1);

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movAmount || isNaN(Number(movAmount))) return;
    const newMovement: FinancialMovement = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: movType,
      scope: movScope,
      category: movCategory,
      amount: parseFloat(movAmount),
      description: movDesc || 'Registro de tesorería',
      bankAccountId: movAccount,
      reconciled: true,
    };
    addFinancialMovement(newMovement);
    setShowAddMovModal(false);
    setMovAmount('');
    setMovDesc('');
  };

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Ámbito', 'Categoría', 'Monto MXN', 'Descripción', 'Conciliado'];
    const rows = movements.map((m) => [
      m.date,
      m.type,
      m.scope,
      `"${m.category}"`,
      m.amount,
      `"${m.description}"`,
      m.reconciled ? 'SI' : 'NO',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_financiero_aroma_flowers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMovements = movements.filter((m) => {
    if (filterScope === 'todos') return true;
    return m.scope === filterScope;
  });

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Alta Dirección & Gerencia Propietaria
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Supervisión Financiera y Rentabilidad Global
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Decisiones estratégicas, control de flujo, préstamos y costos por tallo
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddMovModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Movimiento</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition border border-slate-200"
            title="Exportar a Excel (CSV)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition border border-slate-200"
            title="Imprimir reporte PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Bank Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Saldo en Tesorería</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-slate-900">
            ${totalBankBalance.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {bankAccounts.length} cuentas conciliadas
          </p>
        </div>

        {/* Business Operating Margin */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Margen Bruto de Flor</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-emerald-800">
            {grossMarginPercent}%
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            Precio prom: ${avgSalePricePerStem.toFixed(2)} / tallo
          </p>
        </div>

        {/* Cost per stem and package */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Costo por Tallo / Bonche</span>
            <PieChart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-slate-900">
            ${costPerStem.toFixed(2)} <span className="text-xs font-semibold text-slate-500">/ tallo</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-700 font-medium">
            ${costPerPackage.toFixed(2)} por paquete de 25
          </p>
        </div>

        {/* Total Debt & Loans */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pasivo / Créditos Activos</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-black text-amber-800">
            ${totalDebt.toLocaleString()} <span className="text-xs font-normal text-slate-500">MXN</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            {loans.length} líneas refaccionarias FIRA
          </p>
        </div>
      </div>

      {/* Main Analysis Sections: Accounts, Costs & Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Movements & Personal vs Business Separation */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Flujo de Efectivo y Tesorería</h2>
              <p className="text-xs text-slate-500">
                Separación estricta de gastos personales del propietario y empresariales
              </p>
            </div>

            {/* Scope Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterScope('todos')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filterScope === 'todos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({movements.length})
              </button>
              <button
                onClick={() => setFilterScope('empresarial')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filterScope === 'empresarial' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Empresariales
              </button>
              <button
                onClick={() => setFilterScope('personal')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filterScope === 'personal' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gastos Personales
              </button>
            </div>
          </div>

          {/* Movements Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-2 font-bold">Fecha</th>
                  <th className="pb-2 font-bold">Concepto / Categoría</th>
                  <th className="pb-2 font-bold">Ámbito</th>
                  <th className="pb-2 font-bold text-right">Monto</th>
                  <th className="pb-2 font-bold text-center">Conciliado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No hay movimientos registrados en este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 text-slate-600 whitespace-nowrap">{m.date}</td>
                      <td className="py-3 pr-2">
                        <span className="font-bold text-slate-900 block">{m.description}</span>
                        <span className="text-[10px] text-slate-500">{m.category}</span>
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.scope === 'personal'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {m.scope === 'personal' ? 'Personal' : 'Empresarial'}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-right font-bold whitespace-nowrap ${
                          m.type === 'ingreso' ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        {m.type === 'ingreso' ? '+' : '-'}${m.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center text-emerald-600 font-bold text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> OK
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Cuentas Bancarias y Préstamos */}
        <div className="space-y-6">
          {/* Cuentas Bancarias */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Cuentas Bancarias y Efectivo
            </h3>
            <div className="space-y-3">
              {bankAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3 rounded-xl border border-slate-200/70 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{acc.bankName}</h4>
                    <span className="text-[10px] text-slate-500">{acc.accountNumber}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm font-black ${
                        acc.balance >= 0 ? 'text-slate-900' : 'text-rose-600'
                      }`}
                    >
                      ${acc.balance.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{acc.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Préstamos y Financiamiento */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Líneas de Crédito & Garantías
            </h3>
            {loans.map((loan) => (
              <div key={loan.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{loan.institution}</span>
                  <span className="text-amber-800">${loan.outstandingBalance.toLocaleString()} MXN</span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Tasa Anual: {loan.interestRateAnnual}%</span>
                  <span>Pago Mensual: ${loan.monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200/50">
                  Garantía: {loan.collateral} (Vence: {loan.nextDueDate})
                </div>
              </div>
            ))}
          </div>

          {/* Auditoría reciente */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              Bitácora de Auditoría
            </h3>
            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="pb-2 border-b border-slate-100 last:border-none">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-emerald-800 uppercase">{log.userRole}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <span className="font-medium text-slate-800 block text-xs mt-0.5">{log.action}</span>
                  <span className="text-[11px] text-slate-500">{log.details}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Agregar Movimiento Financiero */}
      {showAddMovModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Registrar Movimiento de Tesorería
            </h3>
            <form onSubmit={handleCreateMovement} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Movimiento</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['egreso', 'ingreso', 'transferencia'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMovType(t)}
                      className={`py-1.5 rounded-lg font-bold capitalize text-center border ${
                        movType === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Separación de Ámbito (Obligatorio)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovScope('empresarial')}
                    className={`py-1.5 rounded-lg font-bold text-center border ${
                      movScope === 'empresarial' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Gasto Empresarial
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovScope('personal')}
                    className={`py-1.5 rounded-lg font-bold text-center border ${
                      movScope === 'personal' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Retiro / Gasto Personal
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monto en Pesos ($ MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="ej. 15000"
                  value={movAmount}
                  onChange={(e) => setMovAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Concepto / Categoría</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Compra fertilizante, Nómina, Retiro de utilidades"
                  value={movCategory}
                  onChange={(e) => setMovCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción detallada</label>
                <textarea
                  rows={2}
                  placeholder="Detalle o justificación del movimiento..."
                  value={movDesc}
                  onChange={(e) => setMovDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cuenta Bancaria de Origen</label>
                <select
                  value={movAccount}
                  onChange={(e) => setMovAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {bankAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountNumber} (${acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMovModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
