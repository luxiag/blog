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
    } catch (err) {
      console.error('复制失败:', err);
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
        <div className="max-w-4xl mx-auto px-4" style={{ padding: '48px 24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/tools"
              className="inline-flex items-center transition-colors"
              style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回工具箱
            </Link>
          </div>

          <h1 style={{
            fontSize: '32px',
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

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{
              background: 'var(--color-neutral-100)',
              padding: '24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--foreground)',
                wordBreak: 'break-all'
              }}>
                {password || '......'}
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={generatePassword} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)' }} title="重新生成">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? 'var(--color-orange-800)' : 'var(--foreground)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { id: 'uppercase', label: '包含大写字母 (A-Z)' },
                  { id: 'lowercase', label: '包含小写字母 (a-z)' },
                  { id: 'numbers', label: '包含数字 (0-9)' },
                  { id: 'symbols', label: '包含特殊符号 (!@#)' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={options[opt.id as keyof typeof options]}
                      onChange={(e) => setOptions({ ...options, [opt.id]: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-orange-800)' }}
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
