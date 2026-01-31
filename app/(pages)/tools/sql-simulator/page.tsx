"use client";

import React from 'react';
import PageTitle from '@/components/PageTitle';
import SqlSimulator from './components/SqlSimulator';
import Link from 'next/link';
import { Database, ChevronLeft, Info, HelpCircle } from 'lucide-react';

export default function SqlSimulatorPage() {
    return (
        <>
            <PageTitle title="SQL 在线模拟器" />
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="mb-8">
                        <Link
                            href="/tools"
                            className="group inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 font-mono text-sm transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                            返回工具箱
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                                    <Database className="w-8 h-8" />
                                </div>
                                SQL 模拟器
                            </h1>
                            <p className="text-neutral-500 font-mono text-sm max-w-2xl">
                                基于 SQL.js (SQLite WASM) 的轻量级数据库运行环境。
                                内置多种行业标准数据集，支持实时编写、调试与练习 SQL 语句。
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                                SQLite v3.45+
                            </div>
                            <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-green-600 border border-green-200 dark:border-green-900/30">
                                WASM Powered
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">

                        <SqlSimulator
                            dataset="commerce"
                            title="标准演练场"
                            description="在此处自由编写 SQL。数据保存在内存中，刷新页面即重置。"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
