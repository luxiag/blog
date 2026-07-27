'use client';

import { useState, useCallback, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (!characters) {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(array[i] % characters.length);
    }
    setPassword(result);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // handled
    }
  };

  const getStrength = () => {
    if (!password) return { label: '无', color: 'var(--color-neutral-300)', width: '0%' };
    let score = 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: '弱', color: '#ef4444', width: '33.3%' };
    if (score <= 4) return { label: '中', color: '#f59e0b', width: '66.6%' };
    return { label: '强', color: '#22c55e', width: '100%' };
  };

  const strength = getStrength();

  return (
    <>
      <PageTitle title="密码生成器" />
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
            密码生成器
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            生成高强度的安全随机密码
          </p>

          <div className="p-4 sm:p-8" style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg mb-8" style={{
              background: 'var(--color-neutral-100)',
              border: '1px solid var(--border-color)'
            }}>
              <span className="break-all font-mono text-lg sm:text-xl font-semibold" style={{
                color: 'var(--foreground)',
              }}>
                {password || '......'}
              </span>
              <div className="flex gap-3">
                <button onClick={generatePassword} className="p-2 rounded-md transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)' }} title="重新生成">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-md font-semibold text-sm transition-all"
                  style={{
                    background: copied ? 'var(--color-orange-800)' : 'var(--foreground)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>密码强度: {strength.label}</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'var(--color-neutral-100)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: strength.width, height: '100%', background: strength.color, transition: 'all 0.3s' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600 }}>密码长度: {length}</label>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                    accentColor: 'var(--color-orange-800)'
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'uppercase', label: '包含大写字母 (A-Z)' },
                  { id: 'lowercase', label: '包含小写字母 (a-z)' },
                  { id: 'numbers', label: '包含数字 (0-9)' },
                  { id: 'symbols', label: '包含特殊符号 (!@#)' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[opt.id as keyof typeof options]}
                      onChange={(e) => setOptions({ ...options, [opt.id]: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
