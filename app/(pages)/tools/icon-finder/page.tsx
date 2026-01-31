'use client';

import { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

// 只选择一部分常用图标，避免导入过多
const commonIconNames = [
    'Activity', 'Airplay', 'AlertCircle', 'AlertOctagon', 'AlertTriangle', 'AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight',
    'Anchor', 'Aperture', 'Archive', 'ArrowDown', 'ArrowDownCircle', 'ArrowDownLeft', 'ArrowDownRight', 'ArrowLeft', 'ArrowLeftCircle',
    'ArrowRight', 'ArrowRightCircle', 'ArrowUp', 'ArrowUpCircle', 'ArrowUpLeft', 'ArrowUpRight', 'AtSign', 'Award', 'BarChart', 'BarChart2',
    'Battery', 'BatteryCharging', 'Bell', 'BellOff', 'Bluetooth', 'Bold', 'Book', 'Bookmark', 'BookOpen', 'Box', 'Briefcase', 'Calendar',
    'Camera', 'CameraOff', 'Cast', 'Check', 'CheckCircle', 'CheckSquare', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp',
    'ChevronsDown', 'ChevronsLeft', 'ChevronsRight', 'ChevronsUp', 'Chrome', 'Circle', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle',
    'CloudLightning', 'CloudOff', 'CloudRain', 'CloudSnow', 'Code', 'Codepen', 'Codesandbox', 'Coffee', 'Columns', 'Command', 'Compass',
    'Copy', 'CornerDownLeft', 'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp', 'CornerRightDown', 'CornerRightUp', 'CornerUpLeft',
    'CornerUpRight', 'Cpu', 'CreditCard', 'Crop', 'Crosshair', 'Database', 'Delete', 'Disc', 'Divide', 'DivideCircle', 'DivideSquare',
    'DollarSign', 'Download', 'DownloadCloud', 'Dribbble', 'Droplet', 'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye', 'EyeOff', 'Facebook',
    'FastForward', 'Feather', 'Figma', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Film', 'Filter', 'Flag', 'Folder', 'FolderMinus',
    'FolderPlus', 'Frown', 'Gift', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'Github', 'Gitlab', 'Globe', 'Grid', 'HardDrive',
    'Hash', 'Headphones', 'Heart', 'HelpCircle', 'Hexagon', 'Home', 'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key', 'Layers',
    'Layout', 'LifeBuoy', 'Link', 'Link2', 'Linkedin', 'List', 'Loader', 'Lock', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin', 'Maximize',
    'Maximize2', 'Meh', 'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 'MicOff', 'Minimize', 'Minimize2', 'Minus', 'MinusCircle',
    'MinusSquare', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical', 'MousePointer', 'Move', 'Music', 'Navigation', 'Navigation2',
    'Octagon', 'Package', 'Paperclip', 'Pause', 'PauseCircle', 'PenTool', 'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded', 'PhoneIncoming',
    'PhoneMissed', 'PhoneOff', 'PhoneOutgoing', 'PieChart', 'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket', 'Power',
    'Printer', 'Radio', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Rss', 'Save', 'Scissors', 'Search',
    'Send', 'Server', 'Settings', 'Share', 'Share2', 'Shield', 'ShieldOff', 'ShoppingBag', 'ShoppingCart', 'Shuffle', 'Sidebar', 'SkipBack',
    'SkipForward', 'Slack', 'Slash', 'Sliders', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'StopCircle', 'Sun', 'Sunrise', 'Sunset',
    'Tablet', 'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown', 'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Tool', 'Trash', 'Trash2',
    'Trello', 'TrendingDown', 'TrendingUp', 'Triangle', 'Truck', 'Tv', 'Twitch', 'Twitter', 'Type', 'Umbrella', 'Underline', 'Unlock',
    'Upload', 'UploadCloud', 'User', 'UserCheck', 'UserMinus', 'UserPlus', 'Users', 'Video', 'VideoOff', 'Voicemail', 'Volume', 'Volume1',
    'Volume2', 'VolumeX', 'Watch', 'Wifi', 'WifiOff', 'Wind', 'X', 'XCircle', 'XOctagon', 'XSquare', 'Youtube', 'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut'
];

export default function IconFinderPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = commonIconNames.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyIconName = (name: string) => {
        navigator.clipboard.writeText(name);
        // Optional: add a toast notification
    };

    return (
        <>
            <PageTitle title="图标查找器" />
            <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
                <div className="max-w-6xl mx-auto px-4" style={{ padding: '48px 24px' }}>
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
                        图标查找器
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-neutral-500)',
                        marginBottom: '32px'
                    }}>
                        快速搜索和检索 Lucide 图标名称
                    </p>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="搜索图标名称 (例如: user, home, arrow...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px 16px 48px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '16px',
                                    outline: 'none',
                                    background: 'white',
                                    boxShadow: 'var(--shadow-subtle)'
                                }}
                            />
                            <svg
                                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }}
                                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                            展示了 {filteredIcons.length} 个常用图标。点击图标可复制组件名称。
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '16px'
                    }}>
                        {filteredIcons.map((name) => {
                            const IconComponent = (LucideIcons as any)[name];
                            if (!IconComponent) return null;

                            return (
                                <div
                                    key={name}
                                    onClick={() => copyIconName(name)}
                                    style={{
                                        background: 'white',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '24px 12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-orange-800)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ color: 'var(--foreground)' }}>
                                        <IconComponent size={32} strokeWidth={1.5} />
                                    </div>
                                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', textAlign: 'center', wordBreak: 'break-all', opacity: 0.7 }}>
                                        {name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
