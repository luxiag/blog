'use client';

import { useState, useCallback } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

type TabId = 'basic' | 'mortgage' | 'loan' | 'salary' | 'social-security' | 'scientific' | 'research';

const tabIcons: Record<TabId, React.ReactElement> = {
  basic: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10.01" /><line x1="12" y1="10" x2="12" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" /><line x1="8" y1="14" x2="8" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="8" y1="18" x2="8" y2="18.01" /><line x1="12" y1="18" x2="16" y2="18" /></svg>,
  mortgage: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12l9-8 9 8" /><path d="M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" /></svg>,
  loan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 6v12M9 9.5c0-1.38 1.34-2.5 3-2.5s3 1.12 3 2.5-1.34 2.5-3 2.5-3 1.12-3 2.5 1.34 2.5 3 2.5 3-1.12 3-2.5" /></svg>,
  salary: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /></svg>,
  'social-security': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  scientific: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3v7.2c0 .3-.1.6-.3.8L4 17v2h16v-2l-4.7-6c-.2-.2-.3-.5-.3-.8V3" /><line x1="9" y1="3" x2="15" y2="3" /></svg>,
  research: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>,
};

const tabs: { id: TabId; name: string }[] = [
  { id: 'basic', name: '基础计算' },
  { id: 'mortgage', name: '房贷计算' },
  { id: 'loan', name: '贷款计算' },
  { id: 'salary', name: '工资计算' },
  { id: 'social-security', name: '社保计算' },
  { id: 'scientific', name: '科学计算' },
  { id: 'research', name: '科研计算' },
];

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: 'white',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--foreground)',
  marginBottom: '6px',
  display: 'block',
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '24px',
};

const resultCardStyle: React.CSSProperties = {
  background: 'var(--color-neutral-50)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '16px 20px',
};

const highlightCardStyle: React.CSSProperties = {
  background: 'var(--color-orange-50, #fff7ed)',
  border: '1px solid var(--color-orange-200, #fed7aa)',
  borderRadius: '8px',
  padding: '16px 20px',
};

const btnStyle: React.CSSProperties = {
  padding: '10px 24px',
  background: 'var(--foreground)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--color-orange-800)',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

function formatMoney(n: number | undefined | null): string {
  if (n == null || isNaN(n)) return '--';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ProgressBar({ value, max, color, height }: { value: number; max: number; color: string; height?: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ width: '100%', background: 'var(--color-neutral-100)', borderRadius: '4px', height: height || 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' }} />
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={resultCardStyle}>
      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>{sub}</div>}
    </div>
  );
}

function HighlightStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={highlightCardStyle}>
      <div style={{ fontSize: '12px', color: 'var(--color-orange-600)' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-orange-800)' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--color-orange-400)' }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactElement; children: React.ReactNode }) {
  return (
    <div style={sectionTitleStyle}>
      {icon}
      {children}
    </div>
  );
}

function PrincipalInterestBar({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  if (total <= 0) return null;
  const pPct = (principal / total * 100).toFixed(1);
  const iPct = (interest / total * 100).toFixed(1);
  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ color: '#16a34a', fontWeight: 600 }}>本金 {pPct}%</span>
        <span style={{ color: '#ef4444', fontWeight: 600 }}>利息 {iPct}%</span>
      </div>
      <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'var(--color-neutral-100)' }}>
        <div style={{ width: `${pPct}%`, background: '#16a34a', transition: 'width 0.3s' }} />
        <div style={{ width: `${iPct}%`, background: '#ef4444', transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function RepaymentSchedule({ schedule }: { schedule: { period: number; payment: number; principal: number; interest: number; remaining: number }[] }) {
  const [expanded, setExpanded] = useState(false);
  const showRows = expanded ? schedule : schedule.slice(0, 12);
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>
        还款明细
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 600 }}>期数</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>月供</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>本金</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>利息</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>剩余本金</th>
            </tr>
          </thead>
          <tbody>
            {showRows.map((row) => (
              <tr key={row.period} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '6px', color: 'var(--color-neutral-500)' }}>{row.period}</td>
                <td style={{ padding: '6px', textAlign: 'right' }}>{formatMoney(row.payment)}</td>
                <td style={{ padding: '6px', textAlign: 'right', color: '#16a34a' }}>{formatMoney(row.principal)}</td>
                <td style={{ padding: '6px', textAlign: 'right', color: '#ef4444' }}>{formatMoney(row.interest)}</td>
                <td style={{ padding: '6px', textAlign: 'right' }}>{formatMoney(row.remaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {schedule.length > 12 && (
        <button onClick={() => setExpanded(!expanded)} style={{
          marginTop: '8px', padding: '6px 16px', border: '1px solid var(--border-color)',
          borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px',
          color: 'var(--color-orange-800)', fontFamily: 'var(--font-mono)',
        }}>
          {expanded ? '收起' : `展开全部 ${schedule.length} 期`}
        </button>
      )}
    </div>
  );
}

function generateMortgageSchedule(loanAmount: number, monthlyRate: number, months: number, method: string) {
  const schedule: { period: number; payment: number; principal: number; interest: number; remaining: number }[] = [];
  let remaining = loanAmount;
  const monthlyPrincipal = loanAmount / months;
  for (let i = 1; i <= months; i++) {
    const interest = remaining * monthlyRate;
    let principal: number;
    let payment: number;
    if (method === 'equal') {
      payment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      principal = payment - interest;
    } else {
      principal = monthlyPrincipal;
      payment = principal + interest;
    }
    remaining = Math.max(0, remaining - principal);
    schedule.push({ period: i, payment, principal, interest, remaining });
  }
  return schedule;
}

function generateLoanSchedule(loanAmount: number, monthlyRate: number, months: number, method: string) {
  const schedule: { period: number; payment: number; principal: number; interest: number; remaining: number }[] = [];
  let remaining = loanAmount;
  const monthlyPrincipal = loanAmount / months;
  for (let i = 1; i <= months; i++) {
    const interest = remaining * monthlyRate;
    let principal: number;
    let payment: number;
    if (method === 'equal-installment') {
      payment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      principal = payment - interest;
    } else if (method === 'equal-principal') {
      principal = monthlyPrincipal;
      payment = principal + interest;
    } else {
      principal = i === months ? loanAmount : 0;
      payment = interest + principal;
    }
    remaining = Math.max(0, remaining - principal);
    schedule.push({ period: i, payment, principal, interest, remaining });
  }
  return schedule;
}

function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);

  const inputDigit = useCallback((d: string) => {
    if (newNumber) {
      setDisplay(d === '.' ? '0.' : d);
      setNewNumber(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display + d);
    }
  }, [display, newNumber]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setNewNumber(true);
  }, []);

  const performOp = useCallback((nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !newNumber) {
      let result = prev;
      switch (op) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = current !== 0 ? prev / current : 0; break;
      }
      const exprStr = `${prev} ${op} ${current}`;
      const resultStr = String(result);
      setHistory(h => [{ expr: exprStr, result: resultStr }, ...h].slice(0, 20));
      setDisplay(resultStr);
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setNewNumber(true);
  }, [display, prev, op, newNumber]);

  const calculateResult = useCallback(() => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    let result = prev;
    switch (op) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current !== 0 ? prev / current : 0; break;
    }
    const exprStr = `${prev} ${op} ${current}`;
    const resultStr = String(result);
    setHistory(h => [{ expr: exprStr, result: resultStr }, ...h].slice(0, 20));
    setDisplay(resultStr);
    setPrev(null);
    setOp(null);
    setNewNumber(true);
  }, [display, prev, op]);

  const numBtnStyle: React.CSSProperties = {
    padding: '14px 4px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--foreground)',
    textAlign: 'center' as const,
  };

  const opBtnStyle: React.CSSProperties = {
    ...numBtnStyle,
    background: 'var(--color-neutral-100)',
    color: 'var(--color-orange-800)',
  };

  const funcBtnStyle: React.CSSProperties = {
    ...numBtnStyle,
    background: 'var(--color-neutral-50)',
    fontSize: '13px',
    fontWeight: 500,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
        <button onClick={() => { setMemory(memory + parseFloat(display)); }} style={{ ...funcBtnStyle, padding: '6px 10px', fontSize: '11px' }}>M+</button>
        <button onClick={() => { setMemory(memory - parseFloat(display)); }} style={{ ...funcBtnStyle, padding: '6px 10px', fontSize: '11px' }}>M-</button>
        <button onClick={() => { setDisplay(String(memory)); setNewNumber(true); }} style={{ ...funcBtnStyle, padding: '6px 10px', fontSize: '11px' }}>MR</button>
        <button onClick={() => setMemory(0)} style={{ ...funcBtnStyle, padding: '6px 10px', fontSize: '11px' }}>MC</button>
      </div>

      <div style={{ background: 'var(--color-neutral-100)', padding: '20px', borderRadius: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', minHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {prev !== null && op ? `${prev} ${op}` : ''}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{display}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        <button onClick={clear} style={funcBtnStyle}>AC</button>
        <button onClick={() => { setDisplay(display.length > 1 ? display.slice(0, -1) : '0'); }} style={funcBtnStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" /><line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" /></svg>
        </button>
        <button onClick={() => { setDisplay(String(parseFloat(display) / 100)); setNewNumber(true); }} style={funcBtnStyle}>%</button>
        <button onClick={() => performOp('/')} style={opBtnStyle}>&#xF7;</button>

        <button onClick={() => inputDigit('7')} style={numBtnStyle}>7</button>
        <button onClick={() => inputDigit('8')} style={numBtnStyle}>8</button>
        <button onClick={() => inputDigit('9')} style={numBtnStyle}>9</button>
        <button onClick={() => performOp('*')} style={opBtnStyle}>&#xD7;</button>

        <button onClick={() => inputDigit('4')} style={numBtnStyle}>4</button>
        <button onClick={() => inputDigit('5')} style={numBtnStyle}>5</button>
        <button onClick={() => inputDigit('6')} style={numBtnStyle}>6</button>
        <button onClick={() => performOp('-')} style={opBtnStyle}>&#x2212;</button>

        <button onClick={() => inputDigit('1')} style={numBtnStyle}>1</button>
        <button onClick={() => inputDigit('2')} style={numBtnStyle}>2</button>
        <button onClick={() => inputDigit('3')} style={numBtnStyle}>3</button>
        <button onClick={() => performOp('+')} style={opBtnStyle}>+</button>

        <button onClick={() => { setDisplay(String(-parseFloat(display))); setNewNumber(true); }} style={funcBtnStyle}>&#x00B1;</button>
        <button onClick={() => inputDigit('0')} style={numBtnStyle}>0</button>
        <button onClick={() => inputDigit('.')} style={numBtnStyle}>.</button>
        <button onClick={calculateResult} style={{ ...opBtnStyle, background: 'var(--color-orange-800)', color: 'white' }}>=</button>
      </div>

      {history.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            历史记录
          </div>
          <div style={{ maxHeight: '180px', overflowY: 'auto', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => { setDisplay(h.result); setPrev(null); setOp(null); setNewNumber(true); }}
                style={{
                  padding: '6px 8px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-neutral-50)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ color: 'var(--color-neutral-500)' }}>{h.expr}</span>
                <span style={{ color: 'var(--color-orange-800)', fontWeight: 600 }}> = {h.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MortgageCalculator() {
  const [totalPrice, setTotalPrice] = useState('200');
  const [downPaymentPercent, setDownPaymentPercent] = useState('30');
  const [loanYears, setLoanYears] = useState('30');
  const [rate, setRate] = useState('3.1');
  const [method, setMethod] = useState<'equal' | 'decreasing'>('equal');
  const [area, setArea] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [useAreaCalc, setUseAreaCalc] = useState(false);
  const [result, setResult] = useState<{
    downPayment: number;
    loanAmount: number;
    loanRatio: string;
    monthlyPayment: number;
    firstMonthPayment?: number;
    lastMonthPayment?: number;
    monthlyDecrease?: number;
    totalPayment: number;
    totalInterest: number;
    interestRatio: string;
    schedule: { period: number; payment: number; principal: number; interest: number; remaining: number }[];
  } | null>(null);

  const effectiveTotalPrice = useAreaCalc && area && unitPrice
    ? (parseFloat(area) * parseFloat(unitPrice) / 10000).toFixed(2)
    : totalPrice;

  const calculate = useCallback(() => {
    const price = parseFloat(effectiveTotalPrice) * 10000;
    const downPercent = parseFloat(downPaymentPercent) / 100;
    const years = parseInt(loanYears);
    const annualRate = parseFloat(rate) / 100;

    if (!price || !downPercent || !years || !annualRate) return;

    const downPayment = price * downPercent;
    const loanAmount = price * (1 - downPercent);
    const loanRatio = ((1 - downPercent) * 100).toFixed(0);
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    let monthlyPayment = 0;
    let firstMonthPayment: number | undefined;
    let lastMonthPayment: number | undefined;
    let monthlyDecrease: number | undefined;
    let totalPayment: number;
    let totalInterest: number;

    if (method === 'equal') {
      monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - loanAmount;
    } else {
      firstMonthPayment = loanAmount / months + loanAmount * monthlyRate;
      lastMonthPayment = loanAmount / months + (loanAmount / months) * monthlyRate;
      monthlyDecrease = loanAmount / months * monthlyRate;
      totalPayment = months * (loanAmount / months + loanAmount * monthlyRate) - monthlyRate * loanAmount / months * (months * (months - 1) / 2);
      totalInterest = totalPayment - loanAmount;
    }

    const interestRatio = (totalInterest / totalPayment * 100).toFixed(1);
    const schedule = generateMortgageSchedule(loanAmount, monthlyRate, months, method);

    setResult({
      downPayment, loanAmount, loanRatio, monthlyPayment,
      firstMonthPayment, lastMonthPayment, monthlyDecrease,
      totalPayment, totalInterest, interestRatio, schedule,
    });
  }, [effectiveTotalPrice, downPaymentPercent, loanYears, rate, method]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--color-neutral-500)' }}>
          <input type="checkbox" checked={useAreaCalc} onChange={e => setUseAreaCalc(e.target.checked)} style={{ accentColor: 'var(--color-orange-800)' }} />
          按面积单价计算
        </label>
      </div>

      {useAreaCalc && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>面积 (m2)</label>
            <input style={inputStyle} type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="100" />
          </div>
          <div>
            <label style={labelStyle}>单价 (元/m2)</label>
            <input style={inputStyle} type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="20000" />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>房屋总价 (万元)</label>
          <input style={inputStyle} type="number" value={effectiveTotalPrice} onChange={e => { if (!useAreaCalc) setTotalPrice(e.target.value); }} readOnly={useAreaCalc} />
          {useAreaCalc && <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '4px' }}>由面积x单价自动计算</div>}
        </div>
        <div>
          <label style={labelStyle}>首付比例 (%)</label>
          <input style={inputStyle} type="number" value={downPaymentPercent} onChange={e => setDownPaymentPercent(e.target.value)} />
          <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '4px' }}>首付金额: {formatMoney(parseFloat(effectiveTotalPrice) * 10000 * parseFloat(downPaymentPercent) / 100)} 元</div>
        </div>
        <div>
          <label style={labelStyle}>贷款年限 (年)</label>
          <select style={selectStyle} value={loanYears} onChange={e => setLoanYears(e.target.value)}>
            {[5, 10, 15, 20, 25, 30].map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>年利率 (%)</label>
          <input style={inputStyle} type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} />
          <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '4px' }}>LPR: 商贷 3.1% | 公积金 2.85%</div>
        </div>
      </div>

      <div>
        <label style={labelStyle}>还款方式</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMethod('equal')} style={{
            ...btnStyle, width: 'auto',
            background: method === 'equal' ? 'var(--foreground)' : 'var(--color-neutral-100)',
            color: method === 'equal' ? 'white' : 'var(--foreground)',
          }}>等额本息</button>
          <button onClick={() => setMethod('decreasing')} style={{
            ...btnStyle, width: 'auto',
            background: method === 'decreasing' ? 'var(--foreground)' : 'var(--color-neutral-100)',
            color: method === 'decreasing' ? 'white' : 'var(--foreground)',
          }}>等额本金</button>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)', marginTop: '6px' }}>
          {method === 'equal'
            ? '等额本息: 每月还款金额相同，前期利息占比较高'
            : '等额本金: 每月本金相同，月供逐月递减，总利息更少'}
        </div>
      </div>

      <button onClick={calculate} style={btnStyle}>计算</button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>}>计算结果</SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <MiniStat label="首付金额" value={`${formatMoney(result.downPayment)} 元`} sub={`占比 ${downPaymentPercent}%`} />
            <HighlightStat label="贷款金额" value={`${formatMoney(result.loanAmount)} 元`} sub={`占比 ${result.loanRatio}%`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {method === 'equal' ? (
              <HighlightStat label="每月还款 (等额本息)" value={`${formatMoney(result.monthlyPayment)} 元`} />
            ) : (
              <>
                <HighlightStat label="首月还款" value={`${formatMoney(result.firstMonthPayment!)} 元`} />
                <MiniStat label="末月还款" value={`${formatMoney(result.lastMonthPayment!)} 元`} />
                <MiniStat label="每月递减" value={`${formatMoney(result.monthlyDecrease!)} 元`} />
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <MiniStat label="还款总额" value={`${formatMoney(result.totalPayment)} 元`} />
            <MiniStat label="利息总额" value={`${formatMoney(result.totalInterest)} 元`} />
            <MiniStat label="利息占比" value={`${result.interestRatio}%`} sub={`${formatMoney(result.totalInterest)} / ${formatMoney(result.totalPayment)}`} />
          </div>

          <PrincipalInterestBar principal={result.loanAmount} interest={result.totalInterest} />

          <RepaymentSchedule schedule={result.schedule} />
        </div>
      )}
    </div>
  );
}

function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [loanYears, setLoanYears] = useState('3');
  const [rate, setRate] = useState('4.35');
  const [method, setMethod] = useState<'equal-principal' | 'equal-installment' | 'interest-first'>('equal-installment');
  const [result, setResult] = useState<{
    principal: number;
    months: number;
    monthlyPayment: number;
    firstMonth?: number;
    lastMonth?: number;
    monthlyDecrease?: number;
    maturityPayment?: number;
    totalPayment: number;
    totalInterest: number;
    interestRatio: string;
    schedule: { period: number; payment: number; principal: number; interest: number; remaining: number }[];
  } | null>(null);

  const methodDesc: Record<string, string> = {
    'equal-installment': '等额本息: 每月还款金额相同，适合收入稳定者',
    'equal-principal': '等额本金: 每月本金相同，月供逐月递减，总利息更少',
    'interest-first': '先息后本: 每月只还利息，到期一次还本，适合短期周转',
  };

  const calculate = useCallback(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanYears);
    const annualRate = parseFloat(rate) / 100;
    if (!principal || !years || !annualRate) return;

    const monthlyRate = annualRate / 12;
    const months = years * 12;
    let monthlyPayment = 0;
    let firstMonth: number | undefined;
    let lastMonth: number | undefined;
    let monthlyDecrease: number | undefined;
    let maturityPayment: number | undefined;
    let totalPayment: number;
    let totalInterest: number;

    if (method === 'equal-installment') {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;
    } else if (method === 'equal-principal') {
      firstMonth = principal / months + principal * monthlyRate;
      lastMonth = principal / months + (principal / months) * monthlyRate;
      monthlyDecrease = principal / months * monthlyRate;
      totalPayment = months * firstMonth - monthlyRate * principal * (months - 1) / 2;
      totalInterest = totalPayment - principal;
    } else {
      monthlyPayment = principal * monthlyRate;
      maturityPayment = principal;
      totalInterest = principal * annualRate * years;
      totalPayment = principal + totalInterest;
    }

    const interestRatio = (totalInterest / totalPayment * 100).toFixed(1);
    const schedule = generateLoanSchedule(principal, monthlyRate, months, method);

    setResult({
      principal, months, monthlyPayment,
      firstMonth, lastMonth, monthlyDecrease, maturityPayment,
      totalPayment, totalInterest, interestRatio, schedule,
    });
  }, [loanAmount, loanYears, rate, method]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>贷款金额 (元)</label>
          <input style={inputStyle} type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>贷款期限 (年)</label>
          <select style={selectStyle} value={loanYears} onChange={e => setLoanYears(e.target.value)}>
            {[1, 2, 3, 5, 10, 15, 20].map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>年利率 (%)</label>
          <input style={inputStyle} type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} />
          <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '4px' }}>参考: 消费贷 4.35% | 经营贷 3.65% | 车贷 4.75%</div>
        </div>
      </div>

      <div>
        <label style={labelStyle}>还款方式</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'equal-installment' as const, label: '等额本息' },
            { id: 'equal-principal' as const, label: '等额本金' },
            { id: 'interest-first' as const, label: '先息后本' },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              ...btnStyle, width: 'auto',
              background: method === m.id ? 'var(--foreground)' : 'var(--color-neutral-100)',
              color: method === m.id ? 'white' : 'var(--foreground)',
            }}>{m.label}</button>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)', marginTop: '6px' }}>
          {methodDesc[method]}
        </div>
      </div>

      <button onClick={calculate} style={btnStyle}>计算</button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>}>计算结果</SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <MiniStat label="贷款本金" value={`${formatMoney(result.principal)} 元`} sub={`还款 ${result.months} 个月`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {method === 'equal-installment' && (
              <HighlightStat label="每月还款 (等额本息)" value={`${formatMoney(result.monthlyPayment)} 元`} />
            )}
            {method === 'equal-principal' && (
              <>
                <HighlightStat label="首月还款" value={`${formatMoney(result.firstMonth!)} 元`} />
                <MiniStat label="末月还款" value={`${formatMoney(result.lastMonth!)} 元`} />
                <MiniStat label="每月递减" value={`${formatMoney(result.monthlyDecrease!)} 元`} />
              </>
            )}
            {method === 'interest-first' && (
              <>
                <HighlightStat label="每月利息" value={`${formatMoney(result.monthlyPayment)} 元`} />
                <MiniStat label="到期还本" value={`${formatMoney(result.maturityPayment!)} 元`} />
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <MiniStat label="还款总额" value={`${formatMoney(result.totalPayment)} 元`} />
            <MiniStat label="利息总额" value={`${formatMoney(result.totalInterest)} 元`} />
            <MiniStat label="利息占比" value={`${result.interestRatio}%`} sub={`${formatMoney(result.totalInterest)} / ${formatMoney(result.totalPayment)}`} />
          </div>

          <PrincipalInterestBar principal={result.principal} interest={result.totalInterest} />

          <RepaymentSchedule schedule={result.schedule} />
        </div>
      )}
    </div>
  );
}

function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState('15000');
  const [socialBase, setSocialBase] = useState('15000');
  const [fundBase, setFundBase] = useState('15000');
  const [fundRate, setFundRate] = useState('12');
  const [specialDeduction, setSpecialDeduction] = useState('0');
  const [annualBonus, setAnnualBonus] = useState('0');
  const [city, setCity] = useState<'beijing' | 'shanghai' | 'guangzhou' | 'shenzhen' | 'hangzhou' | 'chengdu'>('beijing');
  const [useCustomRates, setUseCustomRates] = useState(false);
  const [customPension, setCustomPension] = useState('8');
  const [customMedical, setCustomMedical] = useState('2');
  const [customUnemployment, setCustomUnemployment] = useState('0.2');
  const [taxThreshold, setTaxThreshold] = useState('5000');
  const [result, setResult] = useState<{
    pension: number; medical: number; unemployment: number; fund: number;
    specialDeduction: number; totalDeduct: number; taxableIncome: number;
    taxRate: number; tax: number; netSalary: number; takeHomeRatio: string;
    bracketIndex: number;
    bonusTax: number; netBonus: number;
    annualGross: number; annualDeduct: number; annualTax: number; annualNet: number;
  } | null>(null);

  const cityRates: Record<string, { pension: number; medical: number; unemployment: number }> = {
    beijing: { pension: 8, medical: 2, unemployment: 0.2 },
    shanghai: { pension: 8, medical: 2, unemployment: 0.5 },
    guangzhou: { pension: 8, medical: 2, unemployment: 0.2 },
    shenzhen: { pension: 8, medical: 2, unemployment: 0.3 },
    hangzhou: { pension: 8, medical: 2, unemployment: 0.5 },
    chengdu: { pension: 8, medical: 2, unemployment: 0.4 },
  };

  const cityNames: Record<string, string> = {
    beijing: '北京', shanghai: '上海', guangzhou: '广州',
    shenzhen: '深圳', hangzhou: '杭州', chengdu: '成都',
  };

  const taxBrackets = [
    { limit: 36000, rate: 0.03, deduct: 0, label: '3%', range: '0 ~ 36,000' },
    { limit: 144000, rate: 0.1, deduct: 2520, label: '10%', range: '36,000 ~ 144,000' },
    { limit: 300000, rate: 0.2, deduct: 16920, label: '20%', range: '144,000 ~ 300,000' },
    { limit: 420000, rate: 0.25, deduct: 31920, label: '25%', range: '300,000 ~ 420,000' },
    { limit: 660000, rate: 0.3, deduct: 52920, label: '30%', range: '420,000 ~ 660,000' },
    { limit: 960000, rate: 0.35, deduct: 85920, label: '35%', range: '660,000 ~ 960,000' },
    { limit: Infinity, rate: 0.45, deduct: 181920, label: '45%', range: '> 960,000' },
  ];

  const bonusTaxBrackets = [
    { limit: 36000, rate: 0.03, deduct: 0 },
    { limit: 144000, rate: 0.1, deduct: 210 },
    { limit: 300000, rate: 0.2, deduct: 1410 },
    { limit: 420000, rate: 0.25, deduct: 2660 },
    { limit: 660000, rate: 0.3, deduct: 4410 },
    { limit: 960000, rate: 0.35, deduct: 7160 },
    { limit: Infinity, rate: 0.45, deduct: 15160 },
  ];

  const calculate = useCallback(() => {
    const gross = parseFloat(grossSalary);
    const sBase = parseFloat(socialBase);
    const fBase = parseFloat(fundBase);
    const fRate = parseFloat(fundRate) / 100;
    const specDeduct = parseFloat(specialDeduction) || 0;
    const bonus = parseFloat(annualBonus) || 0;
    const threshold = parseFloat(taxThreshold) || 5000;
    const rates = useCustomRates
      ? { pension: parseFloat(customPension) || 8, medical: parseFloat(customMedical) || 2, unemployment: parseFloat(customUnemployment) || 0.2 }
      : cityRates[city];
    if (!gross || !sBase || !fBase || !fRate) return;

    const pension = sBase * rates.pension / 100;
    const medical = sBase * rates.medical / 100;
    const unemployment = sBase * rates.unemployment / 100;
    const fund = fBase * fRate;
    const totalDeduct = pension + medical + unemployment + fund;

    const taxableIncome = Math.max(0, gross - totalDeduct - specDeduct - threshold);
    let tax = 0;
    let taxRate = 0;
    let bracketIndex = 0;
    for (let i = 0; i < taxBrackets.length; i++) {
      if (taxableIncome <= taxBrackets[i].limit) {
        tax = taxableIncome * taxBrackets[i].rate - taxBrackets[i].deduct;
        taxRate = taxBrackets[i].rate;
        bracketIndex = i;
        break;
      }
    }
    tax = Math.max(0, tax);
    const netSalary = gross - totalDeduct - tax;
    const takeHomeRatio = gross > 0 ? ((netSalary / gross) * 100).toFixed(1) : '0';

    let bonusTax = 0;
    let netBonus = 0;
    if (bonus > 0) {
      const monthlyBonus = bonus / 12;
      for (const b of bonusTaxBrackets) {
        if (monthlyBonus <= b.limit) {
          bonusTax = bonus * b.rate - b.deduct;
          break;
        }
      }
      bonusTax = Math.max(0, bonusTax);
      netBonus = bonus - bonusTax;
    }

    const annualGross = gross * 12 + bonus;
    const annualDeduct = totalDeduct * 12;
    const annualTaxableIncome = taxableIncome * 12;
    let annualTax = 0;
    for (const b of taxBrackets) {
      if (annualTaxableIncome <= b.limit) {
        annualTax = annualTaxableIncome * b.rate - b.deduct;
        break;
      }
    }
    annualTax = Math.max(0, annualTax) + bonusTax;
    const annualNet = annualGross - annualDeduct - annualTax;

    setResult({
      pension, medical, unemployment, fund, specialDeduction: specDeduct,
      totalDeduct, taxableIncome, taxRate, tax, netSalary, takeHomeRatio,
      bracketIndex, bonusTax, netBonus,
      annualGross, annualDeduct, annualTax, annualNet,
    });
  }, [grossSalary, socialBase, fundBase, fundRate, specialDeduction, annualBonus, city, useCustomRates, customPension, customMedical, customUnemployment, taxThreshold]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>税前月薪 (元)</label>
          <input style={inputStyle} type="number" value={grossSalary} onChange={e => setGrossSalary(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>社保基数 (元)</label>
          <input style={inputStyle} type="number" value={socialBase} onChange={e => setSocialBase(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>公积金基数 (元)</label>
          <input style={inputStyle} type="number" value={fundBase} onChange={e => setFundBase(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>公积金比例 (%)</label>
          <select style={selectStyle} value={fundRate} onChange={e => setFundRate(e.target.value)}>
            {['5', '6', '7', '8', '9', '10', '11', '12'].map(r => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>专项附加扣除 (元/月)</label>
          <input style={inputStyle} type="number" value={specialDeduction} onChange={e => setSpecialDeduction(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label style={labelStyle}>年终奖 (元)</label>
          <input style={inputStyle} type="number" value={annualBonus} onChange={e => setAnnualBonus(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label style={labelStyle}>所在城市</label>
          <select style={selectStyle} value={city} onChange={e => setCity(e.target.value as typeof city)} disabled={useCustomRates}>
            {Object.entries(cityNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: 'var(--color-neutral-50)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
          <input type="checkbox" checked={useCustomRates} onChange={e => setUseCustomRates(e.target.checked)} style={{ accentColor: 'var(--color-orange-800)' }} />
          自定义社保费率
        </label>
        {useCustomRates && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <div>
              <label style={labelStyle}>养老个人 (%)</label>
              <input style={inputStyle} type="number" step="0.1" value={customPension} onChange={e => setCustomPension(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>医疗个人 (%)</label>
              <input style={inputStyle} type="number" step="0.1" value={customMedical} onChange={e => setCustomMedical(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>失业个人 (%)</label>
              <input style={inputStyle} type="number" step="0.1" value={customUnemployment} onChange={e => setCustomUnemployment(e.target.value)} />
            </div>
          </div>
        )}
        <div style={{ marginTop: '12px' }}>
          <label style={labelStyle}>个税起征点 (元/月)</label>
          <input style={{ ...inputStyle, maxWidth: '200px' }} type="number" value={taxThreshold} onChange={e => setTaxThreshold(e.target.value)} />
          <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '4px' }}>默认 5000 元/月，部分城市有补充扣除</div>
        </div>
      </div>

      <button onClick={calculate} style={btnStyle}>计算</button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>}>月度工资明细</SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            <MiniStat label="税前月薪" value={`${formatMoney(parseFloat(grossSalary))} 元`} />
            <MiniStat label="五险一金合计" value={`-${formatMoney(result.totalDeduct)} 元`} sub={`养老 ${formatMoney(result.pension)} | 医疗 ${formatMoney(result.medical)} | 失业 ${formatMoney(result.unemployment)} | 公积金 ${formatMoney(result.fund)}`} />
            <MiniStat label="应纳税所得额" value={`${formatMoney(result.taxableIncome)} 元`} sub={`起征点 5000 + 专项 ${formatMoney(result.specialDeduction)}`} />
            <MiniStat label={`适用税率 (${(result.taxRate * 100).toFixed(0)}%)`} value={`${(result.taxRate * 100).toFixed(0)}%`} sub={taxBrackets[result.bracketIndex].range} />
            <MiniStat label="个人所得税" value={`-${formatMoney(result.tax)} 元`} />
            <HighlightStat label="税后月薪" value={`${formatMoney(result.netSalary)} 元`} sub={`到手占比 ${result.takeHomeRatio}%`} />
          </div>

          <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 17V10M12 17V7M17 17V13" /></svg>}>扣除项明细</SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: '养老保险', value: result.pension, color: '#3b82f6' },
              { label: '医疗保险', value: result.medical, color: '#10b981' },
              { label: '失业保险', value: result.unemployment, color: '#f59e0b' },
              { label: '住房公积金', value: result.fund, color: '#8b5cf6' },
              { label: '专项附加扣除', value: result.specialDeduction, color: '#06b6d4' },
              { label: '个人所得税', value: result.tax, color: '#ef4444' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '100px', fontSize: '12px', color: 'var(--color-neutral-500)', flexShrink: 0 }}>{item.label}</div>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={item.value} max={parseFloat(grossSalary)} color={item.color} height={10} />
                </div>
                <div style={{ width: '90px', textAlign: 'right', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, flexShrink: 0 }}>
                  -{formatMoney(item.value)}
                </div>
              </div>
            ))}
          </div>
          {parseFloat(annualBonus) > 0 && (
            <>
              <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}>年终奖 (单独计税)</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                <MiniStat label="年终奖总额" value={`${formatMoney(parseFloat(annualBonus))} 元`} />
                <MiniStat label="年终奖个税" value={`-${formatMoney(result.bonusTax)} 元`} sub="除以12找税率后计算" />
                <HighlightStat label="税后年终奖" value={`${formatMoney(result.netBonus)} 元`} />
              </div>
            </>
          )}

          <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}>年度汇总</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            <MiniStat label="年度税前总收入" value={`${formatMoney(result.annualGross)} 元`} sub="月薪x12 + 年终奖" />
            <MiniStat label="年度五险一金" value={`-${formatMoney(result.annualDeduct)} 元`} />
            <MiniStat label="年度个税" value={`-${formatMoney(result.annualTax)} 元`} sub="含年终奖个税" />
            <HighlightStat label="年度税后收入" value={`${formatMoney(result.annualNet)} 元`} />
          </div>

          <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 6-10" /></svg>}>个税税率表</SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 600 }}>级数</th>
                  <th style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 600 }}>应纳税所得额</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>税率</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>速算扣除数</th>
                </tr>
              </thead>
              <tbody>
                {taxBrackets.map((b, i) => {
                  const isCurrent = result.bracketIndex === i;
                  return (
                    <tr key={i} style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: isCurrent ? 'var(--color-orange-50, #fff7ed)' : 'transparent',
                      fontWeight: isCurrent ? 700 : 400,
                    }}>
                      <td style={{ padding: '6px', color: isCurrent ? 'var(--color-orange-800)' : 'var(--color-neutral-500)' }}>{i + 1}</td>
                      <td style={{ padding: '6px', color: isCurrent ? 'var(--color-orange-800)' : 'var(--foreground)' }}>{b.range}</td>
                      <td style={{ padding: '6px', textAlign: 'right', color: isCurrent ? 'var(--color-orange-800)' : 'var(--foreground)' }}>{b.label}</td>
                      <td style={{ padding: '6px', textAlign: 'right', color: isCurrent ? 'var(--color-orange-800)' : 'var(--foreground)' }}>{b.deduct > 0 ? formatMoney(b.deduct) : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SocialSecurityCalculator() {
  const [base, setBase] = useState('10000');
  const [fundRate, setFundRate] = useState('12');
  const [city, setCity] = useState<'beijing' | 'shanghai' | 'guangzhou' | 'shenzhen' | 'hangzhou' | 'chengdu'>('beijing');
  const [useCustomRates, setUseCustomRates] = useState(false);
  const [customPersonalPension, setCustomPersonalPension] = useState('8');
  const [customPersonalMedical, setCustomPersonalMedical] = useState('2');
  const [customPersonalUnemployment, setCustomPersonalUnemployment] = useState('0.2');
  const [customCompanyPension, setCustomCompanyPension] = useState('16');
  const [customCompanyMedical, setCustomCompanyMedical] = useState('9.8');
  const [customCompanyUnemployment, setCustomCompanyUnemployment] = useState('0.5');
  const [customCompanyInjury, setCustomCompanyInjury] = useState('0.4');
  const [customCompanyMaternity, setCustomCompanyMaternity] = useState('0.8');
  const [months, setMonths] = useState('12');
  const [result, setResult] = useState<{
    personalPension: number; personalMedical: number; personalUnemployment: number; personalFund: number; personalTotal: number;
    companyPension: number; companyMedical: number; companyUnemployment: number; companyInjury: number; companyMaternity: number; companyFund: number; companyTotal: number;
    personalAnnual: number; companyAnnual: number;
    totalEmploymentCost: number;
    medicalAccount: number; fundDouble: number;
    pensionEstimate: number;
  } | null>(null);

  const cityConfig: Record<string, {
    personal: { pension: number; medical: number; unemployment: number };
    company: { pension: number; medical: number; unemployment: number; injury: number; maternity: number };
  }> = {
    beijing: { personal: { pension: 8, medical: 2, unemployment: 0.2 }, company: { pension: 16, medical: 9.8, unemployment: 0.5, injury: 0.4, maternity: 0.8 } },
    shanghai: { personal: { pension: 8, medical: 2, unemployment: 0.5 }, company: { pension: 16, medical: 9.5, unemployment: 0.5, injury: 0.16, maternity: 1 } },
    guangzhou: { personal: { pension: 8, medical: 2, unemployment: 0.2 }, company: { pension: 16, medical: 5.5, unemployment: 0.32, injury: 0.2, maternity: 0.85 } },
    shenzhen: { personal: { pension: 8, medical: 2, unemployment: 0.3 }, company: { pension: 16, medical: 5.2, unemployment: 0.7, injury: 0.14, maternity: 0.45 } },
    hangzhou: { personal: { pension: 8, medical: 2, unemployment: 0.5 }, company: { pension: 14, medical: 9.5, unemployment: 0.5, injury: 0.2, maternity: 1.2 } },
    chengdu: { personal: { pension: 8, medical: 2, unemployment: 0.4 }, company: { pension: 16, medical: 6.7, unemployment: 0.6, injury: 0.2, maternity: 0.8 } },
  };

  const cityNames: Record<string, string> = {
    beijing: '北京', shanghai: '上海', guangzhou: '广州',
    shenzhen: '深圳', hangzhou: '杭州', chengdu: '成都',
  };

  const calculate = useCallback(() => {
    const b = parseFloat(base);
    const fRate = parseFloat(fundRate) / 100;
    const m = parseInt(months) || 12;
    if (!b || !fRate) return;
    const config = cityConfig[city];
    const p = useCustomRates
      ? { pension: parseFloat(customPersonalPension) || 8, medical: parseFloat(customPersonalMedical) || 2, unemployment: parseFloat(customPersonalUnemployment) || 0.2 }
      : config.personal;
    const c = useCustomRates
      ? { pension: parseFloat(customCompanyPension) || 16, medical: parseFloat(customCompanyMedical) || 9.8, unemployment: parseFloat(customCompanyUnemployment) || 0.5, injury: parseFloat(customCompanyInjury) || 0.4, maternity: parseFloat(customCompanyMaternity) || 0.8 }
      : config.company;

    const personalPension = b * p.pension / 100;
    const personalMedical = b * p.medical / 100;
    const personalUnemployment = b * p.unemployment / 100;
    const personalFund = b * fRate;
    const personalTotal = personalPension + personalMedical + personalUnemployment + personalFund;

    const companyPension = b * c.pension / 100;
    const companyMedical = b * c.medical / 100;
    const companyUnemployment = b * c.unemployment / 100;
    const companyInjury = b * c.injury / 100;
    const companyMaternity = b * c.maternity / 100;
    const companyFund = b * fRate;
    const companyTotal = companyPension + companyMedical + companyUnemployment + companyInjury + companyMaternity + companyFund;

    const personalAnnual = personalTotal * m;
    const companyAnnual = companyTotal * m;
    const totalEmploymentCost = b + companyTotal;

    const medicalAccount = personalMedical + b * 0.8 / 100;
    const fundDouble = personalFund + companyFund;
    const basicPensionFactor = (1 + 1) / 2 * 15 / 139;
    const personalAccountMonthly = personalPension * 12 * 15 / 139;
    const pensionEstimate = basicPensionFactor * b + personalAccountMonthly;

    setResult({
      personalPension, personalMedical, personalUnemployment, personalFund, personalTotal,
      companyPension, companyMedical, companyUnemployment, companyInjury, companyMaternity, companyFund, companyTotal,
      personalAnnual, companyAnnual, totalEmploymentCost,
      medicalAccount, fundDouble, pensionEstimate,
    });
  }, [base, fundRate, city, useCustomRates, customPersonalPension, customPersonalMedical, customPersonalUnemployment, customCompanyPension, customCompanyMedical, customCompanyUnemployment, customCompanyInjury, customCompanyMaternity, months]);

  const activePersonal = useCustomRates
    ? { pension: parseFloat(customPersonalPension) || 8, medical: parseFloat(customPersonalMedical) || 2, unemployment: parseFloat(customPersonalUnemployment) || 0.2 }
    : cityConfig[city].personal;
  const activeCompany = useCustomRates
    ? { pension: parseFloat(customCompanyPension) || 16, medical: parseFloat(customCompanyMedical) || 9.8, unemployment: parseFloat(customCompanyUnemployment) || 0.5, injury: parseFloat(customCompanyInjury) || 0.4, maternity: parseFloat(customCompanyMaternity) || 0.8 }
    : cityConfig[city].company;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label style={labelStyle}>社保基数 (元)</label>
          <input style={inputStyle} type="number" value={base} onChange={e => setBase(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>公积金比例 (%)</label>
          <select style={selectStyle} value={fundRate} onChange={e => setFundRate(e.target.value)}>
            {['5', '6', '7', '8', '9', '10', '11', '12'].map(r => <option key={r} value={r}>{r}%</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>所在城市</label>
          <select style={selectStyle} value={city} onChange={e => setCity(e.target.value as typeof city)} disabled={useCustomRates}>
            {Object.entries(cityNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>计算月数</label>
          <select style={selectStyle} value={months} onChange={e => setMonths(e.target.value)}>
            {['1', '3', '6', '12'].map(m => <option key={m} value={m}>{m}个月</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: 'var(--color-neutral-50)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
          <input type="checkbox" checked={useCustomRates} onChange={e => setUseCustomRates(e.target.checked)} style={{ accentColor: 'var(--color-orange-800)' }} />
          自定义费率
        </label>
        {useCustomRates && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)' }}>个人缴纳比例 (%)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              <div><label style={labelStyle}>养老</label><input style={inputStyle} type="number" step="0.1" value={customPersonalPension} onChange={e => setCustomPersonalPension(e.target.value)} /></div>
              <div><label style={labelStyle}>医疗</label><input style={inputStyle} type="number" step="0.1" value={customPersonalMedical} onChange={e => setCustomPersonalMedical(e.target.value)} /></div>
              <div><label style={labelStyle}>失业</label><input style={inputStyle} type="number" step="0.1" value={customPersonalUnemployment} onChange={e => setCustomPersonalUnemployment(e.target.value)} /></div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)' }}>单位缴纳比例 (%)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              <div><label style={labelStyle}>养老</label><input style={inputStyle} type="number" step="0.1" value={customCompanyPension} onChange={e => setCustomCompanyPension(e.target.value)} /></div>
              <div><label style={labelStyle}>医疗</label><input style={inputStyle} type="number" step="0.1" value={customCompanyMedical} onChange={e => setCustomCompanyMedical(e.target.value)} /></div>
              <div><label style={labelStyle}>失业</label><input style={inputStyle} type="number" step="0.1" value={customCompanyUnemployment} onChange={e => setCustomCompanyUnemployment(e.target.value)} /></div>
              <div><label style={labelStyle}>工伤</label><input style={inputStyle} type="number" step="0.1" value={customCompanyInjury} onChange={e => setCustomCompanyInjury(e.target.value)} /></div>
              <div><label style={labelStyle}>生育</label><input style={inputStyle} type="number" step="0.1" value={customCompanyMaternity} onChange={e => setCustomCompanyMaternity(e.target.value)} /></div>
            </div>
          </div>
        )}
      </div>

      <button onClick={calculate} style={btnStyle}>计算</button>

      {result && (() => {
        const p = activePersonal;
        const c = activeCompany;
        const m = parseInt(months) || 12;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}>个人缴纳</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              <MiniStat label={`养老 (${p.pension}%)`} value={`${formatMoney(result.personalPension)} 元`} />
              <MiniStat label={`医疗 (${p.medical}%)`} value={`${formatMoney(result.personalMedical)} 元`} />
              <MiniStat label={`失业 (${p.unemployment}%)`} value={`${formatMoney(result.personalUnemployment)} 元`} />
              <MiniStat label={`公积金 (${fundRate}%)`} value={`${formatMoney(result.personalFund)} 元`} />
              <HighlightStat label="个人月合计" value={`${formatMoney(result.personalTotal)} 元`} sub={m < 12 ? `${m}个月合计 ${formatMoney(result.personalAnnual)}` : `年合计 ${formatMoney(result.personalAnnual)}`} />
            </div>

            <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" /><path d="M12 3a4 4 0 110 8 4 4 0 010-8z" /></svg>}>单位缴纳</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              <MiniStat label={`养老 (${c.pension}%)`} value={`${formatMoney(result.companyPension)} 元`} />
              <MiniStat label={`医疗 (${c.medical}%)`} value={`${formatMoney(result.companyMedical)} 元`} />
              <MiniStat label={`失业 (${c.unemployment}%)`} value={`${formatMoney(result.companyUnemployment)} 元`} />
              <MiniStat label={`工伤 (${c.injury}%)`} value={`${formatMoney(result.companyInjury)} 元`} />
              <MiniStat label={`生育 (${c.maternity}%)`} value={`${formatMoney(result.companyMaternity)} 元`} />
              <MiniStat label={`公积金 (${fundRate}%)`} value={`${formatMoney(result.companyFund)} 元`} />
              <HighlightStat label="单位月合计" value={`${formatMoney(result.companyTotal)} 元`} sub={m < 12 ? `${m}个月合计 ${formatMoney(result.companyAnnual)}` : `年合计 ${formatMoney(result.companyAnnual)}`} />
            </div>

            <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" /></svg>}>用工成本</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              <MiniStat label="工资" value={`${formatMoney(parseFloat(base))} 元/月`} />
              <MiniStat label="单位社保" value={`${formatMoney(result.companyTotal)} 元/月`} />
              <HighlightStat label="用工总成本" value={`${formatMoney(result.totalEmploymentCost)} 元/月`} sub="工资 + 单位社保" />
            </div>

            <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}>福利估算</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              <MiniStat label="医保个人账户/月" value={`${formatMoney(result.medicalAccount)} 元`} sub="个人2% + 单位划入约0.8%" />
              <MiniStat label="公积金双缴/月" value={`${formatMoney(result.fundDouble)} 元`} sub="个人+单位，全额归个人" />
              <HighlightStat label="退休养老金估算/月" value={`${formatMoney(result.pensionEstimate)} 元`} sub="按15年缴费,60岁退休" />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', background: 'var(--color-neutral-50)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '4px', verticalAlign: 'middle' }}><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              养老金估算为简化模型，实际养老金受当地平均工资、缴费年限、退休年龄等多种因素影响，仅供参考
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);
  const [isRadian, setIsRadian] = useState(true);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [openParens, setOpenParens] = useState(0);

  const inputDigit = useCallback((d: string) => {
    if (newNumber) {
      setDisplay(d === '.' ? '0.' : d);
      setNewNumber(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display + d);
    }
  }, [display, newNumber]);

  const clear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setPrev(null);
    setOp(null);
    setNewNumber(true);
    setOpenParens(0);
  }, []);

  const openParen = useCallback(() => {
    setOpenParens(p => p + 1);
    setExpression(e => e + '(');
    setPrev(null);
    setOp(null);
    setNewNumber(true);
  }, []);

  const closeParen = useCallback(() => {
    if (openParens <= 0) return;
    setOpenParens(p => p - 1);
    setExpression(e => e + display + ')');
    setNewNumber(true);
  }, [openParens, display]);

  const performOp = useCallback((nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !newNumber) {
      let result = prev;
      switch (op) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = current !== 0 ? prev / current : 0; break;
        case 'pow': result = Math.pow(prev, current); break;
        case 'nroot': result = Math.pow(prev, 1 / current); break;
      }
      const exprStr = `${prev} ${op} ${current}`;
      const resultStr = String(result);
      setHistory(h => [{ expr: exprStr, result: resultStr }, ...h].slice(0, 20));
      setDisplay(resultStr);
      setPrev(result);
      setExpression(exprStr + ` ${nextOp} `);
    } else {
      setPrev(current);
      setExpression(String(current) + ` ${nextOp} `);
    }
    setOp(nextOp);
    setNewNumber(true);
  }, [display, prev, op, newNumber]);

  const calculateResult = useCallback(() => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    let result = prev;
    switch (op) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current !== 0 ? prev / current : 0; break;
      case 'pow': result = Math.pow(prev, current); break;
      case 'nroot': result = Math.pow(prev, 1 / current); break;
    }
    const exprStr = `${prev} ${op} ${current}`;
    const resultStr = String(result);
    setHistory(h => [{ expr: exprStr, result: resultStr }, ...h].slice(0, 20));
    setDisplay(resultStr);
    setExpression(exprStr + ' =');
    setPrev(null);
    setOp(null);
    setNewNumber(true);
  }, [display, prev, op]);

  const scientificFunc = useCallback((fn: string) => {
    const val = parseFloat(display);
    const angle = isRadian ? val : val * Math.PI / 180;
    let result = val;
    switch (fn) {
      case 'sin': result = Math.sin(angle); break;
      case 'cos': result = Math.cos(angle); break;
      case 'tan': result = Math.tan(angle); break;
      case 'asin': result = isRadian ? Math.asin(val) : Math.asin(val) * 180 / Math.PI; break;
      case 'acos': result = isRadian ? Math.acos(val) : Math.acos(val) * 180 / Math.PI; break;
      case 'atan': result = isRadian ? Math.atan(val) : Math.atan(val) * 180 / Math.PI; break;
      case 'ln': result = Math.log(val); break;
      case 'log': result = Math.log10(val); break;
      case 'log2': result = Math.log2(val); break;
      case 'sqrt': result = Math.sqrt(val); break;
      case 'cbrt': result = Math.cbrt(val); break;
      case 'abs': result = Math.abs(val); break;
      case 'fact': {
        if (val < 0 || val > 170 || val !== Math.floor(val)) { result = NaN; break; }
        let f = 1; for (let i = 2; i <= val; i++) f *= i; result = f; break;
      }
      case 'exp': result = Math.exp(val); break;
      case 'inv': result = val !== 0 ? 1 / val : NaN; break;
      case 'neg': result = -val; break;
      case 'square': result = val * val; break;
      case 'cube': result = val * val * val; break;
      case '2pow': result = Math.pow(2, val); break;
      case '10pow': result = Math.pow(10, val); break;
    }
    const exprStr = `${fn}(${val})`;
    const resultStr = String(result);
    setHistory(h => [{ expr: exprStr, result: resultStr }, ...h].slice(0, 20));
    setDisplay(resultStr);
    setExpression(exprStr + ' =');
    setNewNumber(true);
  }, [display, isRadian]);

  const sciBtnStyle: React.CSSProperties = {
    padding: '8px 4px',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    background: 'var(--color-neutral-50)',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--foreground)',
    textAlign: 'center' as const,
    minWidth: 0,
  };

  const numBtnStyle: React.CSSProperties = {
    padding: '12px 4px',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--foreground)',
    textAlign: 'center' as const,
  };

  const opBtnStyle: React.CSSProperties = {
    ...numBtnStyle,
    background: 'var(--color-neutral-100)',
    color: 'var(--color-orange-800)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setIsRadian(!isRadian)} style={{
          padding: '4px 12px', border: '1px solid var(--border-color)', borderRadius: '4px',
          background: isRadian ? 'var(--foreground)' : 'white', color: isRadian ? 'white' : 'var(--foreground)',
          fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
        }}>{isRadian ? 'RAD' : 'DEG'}</button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => { setMemory(memory + parseFloat(display)); }} style={sciBtnStyle}>M+</button>
          <button onClick={() => { setMemory(memory - parseFloat(display)); }} style={sciBtnStyle}>M-</button>
          <button onClick={() => { setDisplay(String(memory)); setNewNumber(true); }} style={sciBtnStyle}>MR</button>
          <button onClick={() => setMemory(0)} style={sciBtnStyle}>MC</button>
        </div>
      </div>

      <div style={{ background: 'var(--color-neutral-100)', padding: '16px', borderRadius: '8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', minHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {expression || (prev !== null && op ? `${prev} ${op}` : '')}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{display}</div>
        {openParens > 0 && (
          <div style={{ fontSize: '11px', color: 'var(--color-orange-600)', marginTop: '2px' }}>
            {openParens} 个未闭合括号
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
        {[
          { label: 'sin', fn: 'sin' }, { label: 'cos', fn: 'cos' }, { label: 'tan', fn: 'tan' },
          { label: 'sin\u207B\u00B9', fn: 'asin' }, { label: 'cos\u207B\u00B9', fn: 'acos' }, { label: 'tan\u207B\u00B9', fn: 'atan' },
          { label: 'ln', fn: 'ln' }, { label: 'log\u2081\u2080', fn: 'log' }, { label: 'log\u2082', fn: 'log2' },
          { label: '\u221A', fn: 'sqrt' }, { label: '\u221B', fn: 'cbrt' }, { label: '|x|', fn: 'abs' },
          { label: 'n!', fn: 'fact' }, { label: 'e\u02E3', fn: 'exp' }, { label: '1/x', fn: 'inv' },
          { label: 'x\u00B2', fn: 'square' }, { label: 'x\u00B3', fn: 'cube' }, { label: '2\u02E3', fn: '2pow' },
          { label: '10\u02E3', fn: '10pow' }, { label: 'x\u02B8', fn: 'pow' }, { label: '\u207F\u221Ax', fn: 'nroot' },
          { label: '\u03C0', fn: 'pi' }, { label: 'e', fn: 'euler' }, { label: '\u00B1', fn: 'neg' },
        ].map(b => (
          <button key={b.fn + b.label} onClick={() => {
            if (b.fn === 'pi') { setDisplay(String(Math.PI)); setNewNumber(true); }
            else if (b.fn === 'euler') { setDisplay(String(Math.E)); setNewNumber(true); }
            else if (b.fn === 'pow' || b.fn === 'nroot') performOp(b.fn);
            else scientificFunc(b.fn);
          }} style={sciBtnStyle}>{b.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
        <button onClick={clear} style={opBtnStyle}>C</button>
        <button onClick={() => { setDisplay(display.length > 1 ? display.slice(0, -1) : '0'); }} style={opBtnStyle}>&#x232B;</button>
        <button onClick={openParen} style={{ ...opBtnStyle, position: 'relative' }}>
          (
          {openParens > 0 && <span style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '9px', color: 'var(--color-orange-600)', fontWeight: 700 }}>{openParens}</span>}
        </button>
        <button onClick={() => performOp('/')} style={opBtnStyle}>&#xF7;</button>

        {['7','8','9'].map(d => <button key={d} onClick={() => inputDigit(d)} style={numBtnStyle}>{d}</button>)}
        <button onClick={() => performOp('*')} style={opBtnStyle}>&#xD7;</button>

        {['4','5','6'].map(d => <button key={d} onClick={() => inputDigit(d)} style={numBtnStyle}>{d}</button>)}
        <button onClick={() => performOp('-')} style={opBtnStyle}>&#x2212;</button>

        {['1','2','3'].map(d => <button key={d} onClick={() => inputDigit(d)} style={numBtnStyle}>{d}</button>)}
        <button onClick={() => performOp('+')} style={opBtnStyle}>+</button>

        <button onClick={() => inputDigit('0')} style={{ ...numBtnStyle, gridColumn: 'span 2' }}>0</button>
        <button onClick={() => inputDigit('.')} style={numBtnStyle}>.</button>
        <button onClick={() => { closeParen(); calculateResult(); }} style={{ ...opBtnStyle, background: 'var(--color-orange-800)', color: 'white' }}>=</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px' }}>
        <button onClick={() => performOp('%')} style={opBtnStyle}>%</button>
        <button onClick={closeParen} style={{ ...opBtnStyle, position: 'relative' }}>
          )
          {openParens > 0 && <span style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '9px', color: 'var(--color-orange-600)', fontWeight: 700 }}>{openParens}</span>}
        </button>
        <button onClick={openParen} style={opBtnStyle}>(</button>
        <button onClick={() => { setDisplay(String(parseFloat(display) / 100)); setNewNumber(true); }} style={opBtnStyle}>%val</button>
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            历史记录
          </div>
          <div style={{ maxHeight: '180px', overflowY: 'auto', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => { setDisplay(h.result); setExpression(''); setNewNumber(true); }}
                style={{
                  padding: '6px 8px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-neutral-50)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ color: 'var(--color-neutral-500)' }}>{h.expr}</span>
                <span style={{ color: 'var(--color-orange-800)', fontWeight: 600 }}> = {h.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchCalculator() {
  const [sampleSize, setSampleSize] = useState('');
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [confidence, setConfidence] = useState('0.95');
  const [result, setResult] = useState<{ lower: number; upper: number; se: number; margin: number; zValue: number } | null>(null);

  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [effectResult, setEffectResult] = useState<{
    cohenD: number; interpretation: string;
    n1: number; mean1: number; sd1: number;
    n2: number; mean2: number; sd2: number;
    ciLower: number; ciUpper: number;
  } | null>(null);

  const [pVal, setPVal] = useState('');
  const [alphaVal, setAlphaVal] = useState('0.05');
  const [pResult, setPResult] = useState<{ significance: string; stars: string; alpha: number } | null>(null);

  const [group1, setGroup1] = useState('');
  const [group2, setGroup2] = useState('');
  const [tTestResult, setTTestResult] = useState<{
    t: number; df: number; interpretation: string;
    n1: number; mean1: number; sd1: number;
    n2: number; mean2: number; sd2: number;
    approxP: string;
  } | null>(null);

  const [powerEffectSize, setPowerEffectSize] = useState('0.5');
  const [powerAlpha, setPowerAlpha] = useState('0.05');
  const [powerTarget, setPowerTarget] = useState('0.8');
  const [powerResult, setPowerResult] = useState<{ perGroup: number; totalN: number } | null>(null);

  const zValues: Record<string, number> = { '0.90': 1.645, '0.95': 1.96, '0.99': 2.576 };

  const normP = (z: number): number => {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const pp = 0.3275911;
    const sign = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.SQRT2;
    const t = 1.0 / (1.0 + pp * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * y);
  };

  const calcCI = useCallback(() => {
    const n = parseFloat(sampleSize);
    const m = parseFloat(mean);
    const sd = parseFloat(stdDev);
    const conf = confidence;
    if (!n || !m || !sd || !zValues[conf]) return;
    const se = sd / Math.sqrt(n);
    const z = zValues[conf];
    const margin = z * se;
    setResult({ lower: m - margin, upper: m + margin, se, margin, zValue: z });
  }, [sampleSize, mean, stdDev, confidence]);

  const calcEffect = useCallback(() => {
    const arr1 = a.split(',').map(Number).filter(v => !isNaN(v));
    const arr2 = b.split(',').map(Number).filter(v => !isNaN(v));
    if (arr1.length < 2 || arr2.length < 2) return;
    const mean1 = arr1.reduce((s, v) => s + v, 0) / arr1.length;
    const mean2 = arr2.reduce((s, v) => s + v, 0) / arr2.length;
    const var1 = arr1.reduce((s, v) => s + (v - mean1) ** 2, 0) / (arr1.length - 1);
    const var2 = arr2.reduce((s, v) => s + (v - mean2) ** 2, 0) / (arr2.length - 1);
    const sd1 = Math.sqrt(var1);
    const sd2 = Math.sqrt(var2);
    const pooled = Math.sqrt((var1 + var2) / 2);
    if (pooled === 0) return;
    const d = (mean1 - mean2) / pooled;
    const interpretation = Math.abs(d) < 0.2 ? '极小' : Math.abs(d) < 0.5 ? '小' : Math.abs(d) < 0.8 ? '中等' : '大';
    const seD = Math.sqrt((arr1.length + arr2.length) / (arr1.length * arr2.length) + d * d / (2 * (arr1.length + arr2.length)));
    const z95 = 1.96;
    const ciLower = d - z95 * seD;
    const ciUpper = d + z95 * seD;
    setEffectResult({ cohenD: d, interpretation, n1: arr1.length, mean1, sd1, n2: arr2.length, mean2, sd2, ciLower, ciUpper });
  }, [a, b]);

  const calcP = useCallback(() => {
    const p = parseFloat(pVal);
    const alpha = parseFloat(alphaVal);
    if (isNaN(p) || isNaN(alpha)) return;
    const significance = p < 0.001 ? '极显著' : p < 0.01 ? '非常显著' : p < 0.05 ? '显著' : '不显著';
    const stars = p < 0.001 ? '***' : p < 0.01 ? '**' : p < 0.05 ? '*' : 'n.s.';
    setPResult({ significance, stars, alpha });
  }, [pVal, alphaVal]);

  const calcTTest = useCallback(() => {
    const arr1 = group1.split(',').map(Number).filter(v => !isNaN(v));
    const arr2 = group2.split(',').map(Number).filter(v => !isNaN(v));
    if (arr1.length < 2 || arr2.length < 2) return;
    const m1 = arr1.reduce((s, v) => s + v, 0) / arr1.length;
    const m2 = arr2.reduce((s, v) => s + v, 0) / arr2.length;
    const v1 = arr1.reduce((s, v) => s + (v - m1) ** 2, 0) / (arr1.length - 1);
    const v2 = arr2.reduce((s, v) => s + (v - m2) ** 2, 0) / (arr2.length - 1);
    const sd1 = Math.sqrt(v1);
    const sd2 = Math.sqrt(v2);
    const se = Math.sqrt(v1 / arr1.length + v2 / arr2.length);
    if (se === 0) return;
    const t = (m1 - m2) / se;
    const df = Math.min(arr1.length, arr2.length) - 1;
    const z = Math.abs(t);
    const pValNorm = 2 * (1 - normP(z));
    const approxP = pValNorm < 0.001 ? '< 0.001' : pValNorm.toFixed(3);
    const interpretation = pValNorm < 0.05 ? '差异可能显著' : '差异不显著';
    setTTestResult({ t, df, interpretation, n1: arr1.length, mean1: m1, sd1, n2: arr2.length, mean2: m2, sd2, approxP });
  }, [group1, group2]);

  const calcPower = useCallback(() => {
    const d = parseFloat(powerEffectSize);
    const alpha = parseFloat(powerAlpha);
    const power = parseFloat(powerTarget);
    if (!d || isNaN(alpha) || isNaN(power) || d <= 0) return;
    const zAlphaHalf = alpha === 0.05 ? 1.96 : alpha === 0.01 ? 2.576 : alpha === 0.1 ? 1.645 : 1.96;
    const zBeta = power === 0.8 ? 0.842 : power === 0.9 ? 1.282 : power === 0.95 ? 1.645 : power === 0.7 ? 0.524 : 0.842;
    const n = Math.ceil(2 * Math.pow((zAlphaHalf + zBeta) / d, 2));
    setPowerResult({ perGroup: n, totalN: n * 2 });
  }, [powerEffectSize, powerAlpha, powerTarget]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={cardStyle}>
        <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 6-10" /></svg>}>置信区间计算</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>样本量 n</label><input style={inputStyle} type="number" value={sampleSize} onChange={e => setSampleSize(e.target.value)} /></div>
          <div><label style={labelStyle}>均值 x&#x0304;</label><input style={inputStyle} type="number" step="0.01" value={mean} onChange={e => setMean(e.target.value)} /></div>
          <div><label style={labelStyle}>标准差 s</label><input style={inputStyle} type="number" step="0.01" value={stdDev} onChange={e => setStdDev(e.target.value)} /></div>
          <div><label style={labelStyle}>置信水平</label><select style={selectStyle} value={confidence} onChange={e => setConfidence(e.target.value)}>
            <option value="0.90">90%</option><option value="0.95">95%</option><option value="0.99">99%</option>
          </select></div>
        </div>
        <button onClick={calcCI} style={{ ...btnStyle, width: 'auto', display: 'inline-block' }}>计算置信区间</button>
        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <MiniStat label="标准误" value={result.se.toFixed(4)} />
            <MiniStat label="误差范围" value={result.margin.toFixed(4)} />
            <MiniStat label="z 值" value={result.zValue.toFixed(3)} sub={`z = ${(confidence === '0.90' ? '1.645' : confidence === '0.95' ? '1.960' : '2.576')}`} />
            <HighlightStat label="下限" value={result.lower.toFixed(4)} />
            <HighlightStat label="上限" value={result.upper.toFixed(4)} />
          </div>
        )}
        <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '8px' }}>公式: CI = x&#x0304; &#xB1; z * (s / &#x221A;n)</div>
      </div>

      <div style={cardStyle}>
        <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>}>Cohen&apos;s d 效应量</SectionTitle>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginBottom: '12px' }}>输入两组数据（逗号分隔），如: 1.2,3.4,5.6</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>组 A</label><input style={inputStyle} value={a} onChange={e => setA(e.target.value)} placeholder="1,2,3,4,5" /></div>
          <div><label style={labelStyle}>组 B</label><input style={inputStyle} value={b} onChange={e => setB(e.target.value)} placeholder="3,4,5,6,7" /></div>
        </div>
        <button onClick={calcEffect} style={{ ...btnStyle, width: 'auto', display: 'inline-block' }}>计算效应量</button>
        {effectResult && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <MiniStat label="组 A: n / mean / SD" value={`${effectResult.n1} / ${effectResult.mean1.toFixed(2)} / ${effectResult.sd1.toFixed(2)}`} />
              <MiniStat label="组 B: n / mean / SD" value={`${effectResult.n2} / ${effectResult.mean2.toFixed(2)} / ${effectResult.sd2.toFixed(2)}`} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              <HighlightStat label="Cohen's d" value={effectResult.cohenD.toFixed(4)} />
              <MiniStat label="效应大小" value={effectResult.interpretation} />
              <MiniStat label="95% CI 下限" value={effectResult.ciLower.toFixed(4)} />
              <MiniStat label="95% CI 上限" value={effectResult.ciUpper.toFixed(4)} />
            </div>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>}>p 值判定</SectionTitle>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>p 值</label><input style={inputStyle} type="number" step="0.001" value={pVal} onChange={e => setPVal(e.target.value)} placeholder="0.03" /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>&#x03B1; 水平</label><select style={selectStyle} value={alphaVal} onChange={e => setAlphaVal(e.target.value)}>
            <option value="0.01">0.01</option><option value="0.05">0.05</option><option value="0.1">0.1</option>
          </select></div>
          <button onClick={calcP} style={{ ...btnStyle, width: 'auto' }}>判定</button>
        </div>
        {pResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <HighlightStat label="显著性" value={pResult.significance} sub={`&#x03B1; = ${pResult.alpha}`} />
              <MiniStat label="标记" value={pResult.stars} />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '6px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 600 }}>p 值范围</th>
                    <th style={{ padding: '6px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 600 }}>判定</th>
                    <th style={{ padding: '6px', textAlign: 'right', color: 'var(--color-neutral-500)', fontWeight: 600 }}>标记</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: 'p < 0.001', label: '极显著', mark: '***' },
                    { range: 'p < 0.01', label: '非常显著', mark: '**' },
                    { range: 'p < 0.05', label: '显著', mark: '*' },
                    { range: 'p >= 0.05', label: '不显著', mark: 'n.s.' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '6px' }}>{row.range}</td>
                      <td style={{ padding: '6px' }}>{row.label}</td>
                      <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600, color: row.mark === 'n.s.' ? 'var(--color-neutral-400)' : 'var(--color-orange-800)' }}>{row.mark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>}>独立样本 t 检验</SectionTitle>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginBottom: '12px' }}>输入两组数据（逗号分隔）</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>组 1</label><input style={inputStyle} value={group1} onChange={e => setGroup1(e.target.value)} placeholder="1,2,3,4,5" /></div>
          <div><label style={labelStyle}>组 2</label><input style={inputStyle} value={group2} onChange={e => setGroup2(e.target.value)} placeholder="3,4,5,6,7" /></div>
        </div>
        <button onClick={calcTTest} style={{ ...btnStyle, width: 'auto', display: 'inline-block' }}>计算 t 值</button>
        {tTestResult && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <MiniStat label="组 1: n / mean / SD" value={`${tTestResult.n1} / ${tTestResult.mean1.toFixed(2)} / ${tTestResult.sd1.toFixed(2)}`} />
              <MiniStat label="组 2: n / mean / SD" value={`${tTestResult.n2} / ${tTestResult.mean2.toFixed(2)} / ${tTestResult.sd2.toFixed(2)}`} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              <HighlightStat label="t 值" value={tTestResult.t.toFixed(4)} />
              <MiniStat label="自由度" value={String(tTestResult.df)} />
              <MiniStat label="近似 p 值" value={tTestResult.approxP} />
              <MiniStat label="结论" value={tTestResult.interpretation} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', background: 'var(--color-neutral-50)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: '4px', verticalAlign: 'middle' }}><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              p 值基于正态分布近似，非精确 t 分布。推荐使用 Welch t 检验（不假设等方差）
            </div>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <SectionTitle icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}>统计功效分析</SectionTitle>
        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginBottom: '12px' }}>给定效应量、显著性水平和目标功效，估算所需样本量</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          <div><label style={labelStyle}>效应量 d</label><input style={inputStyle} type="number" step="0.1" value={powerEffectSize} onChange={e => setPowerEffectSize(e.target.value)} /></div>
          <div><label style={labelStyle}>&#x03B1; 水平</label><select style={selectStyle} value={powerAlpha} onChange={e => setPowerAlpha(e.target.value)}>
            <option value="0.01">0.01</option><option value="0.05">0.05</option><option value="0.1">0.1</option>
          </select></div>
          <div><label style={labelStyle}>目标功效</label><select style={selectStyle} value={powerTarget} onChange={e => setPowerTarget(e.target.value)}>
            <option value="0.7">0.70</option><option value="0.8">0.80</option><option value="0.9">0.90</option><option value="0.95">0.95</option>
          </select></div>
        </div>
        <button onClick={calcPower} style={{ ...btnStyle, width: 'auto', display: 'inline-block' }}>估算样本量</button>
        {powerResult && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <HighlightStat label="每组样本量" value={String(powerResult.perGroup)} />
            <HighlightStat label="总样本量 N" value={String(powerResult.totalN)} />
          </div>
        )}
        <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '8px' }}>公式: n = 2 * ((z_&#x03B1;/2 + z_&#x03B2;) / d)&#x00B2;，适用于两独立组比较</div>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabId>('basic');

  return (
    <>
      <PageTitle title="多功能计算器" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/tools"
              className="inline-flex items-center transition-colors"
              style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK_TO_LIBRARY
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl" style={{
            fontWeight: 700,
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)'
          }}>
            多功能计算器
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            基础 / 房贷 / 贷款 / 工资 / 社保 / 科学 / 科研 — 七大模块一站式计算
          </p>

          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '24px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '4px',
            background: 'white',
            overflowX: 'auto',
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: activeTab === tab.id ? 'var(--foreground)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--foreground)',
                  fontSize: '12px',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{tabIcons[tab.id]}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div style={cardStyle}>
            {activeTab === 'basic' && <BasicCalculator />}
            {activeTab === 'mortgage' && <MortgageCalculator />}
            {activeTab === 'loan' && <LoanCalculator />}
            {activeTab === 'salary' && <SalaryCalculator />}
            {activeTab === 'social-security' && <SocialSecurityCalculator />}
            {activeTab === 'scientific' && <ScientificCalculator />}
            {activeTab === 'research' && <ResearchCalculator />}
          </div>
        </div>
      </div>
    </>
  );
}
