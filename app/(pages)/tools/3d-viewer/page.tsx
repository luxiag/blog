"use client";

import dynamic from 'next/dynamic';
import PageTitle from '@/components/PageTitle';

const ViewerComponent = dynamic(
    () => import('./ViewerComponent'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 animate-pulse">
                <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            </div>
        )
    }
);

export default function ThreeDViewerPage() {
    return (
        <>
            <PageTitle title="3D 模型预览" />
            <div className="h-screen text-neutral-900 dark:text-neutral-100">
                <ViewerComponent />
            </div>
        </>
    );
}
