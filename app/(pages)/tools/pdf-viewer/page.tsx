'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { pdfDB } from './db';
import { 
  ChevronLeft, 
  FileText, 
  Plus, 
  List, 
  Folder, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight, 
  AlertCircle, 
  Trash2,
  Loader2,
  LayoutGrid
} from 'lucide-react';

interface UserPdf {
  id: string;
  name: string;
  addedAt: number;
}

interface PdfPageMemory {
  [pdfId: string]: number;
}

interface PdfOutlineItem {
  title: string;
  dest: any;
  items: PdfOutlineItem[];
}

interface PageInfo {
  page: number;
  width: number;
  height: number;
  rendered: boolean;
}

// Simple virtual list hook
function useVirtualList<T>(
  items: T[],
  containerRef: React.RefObject<HTMLElement>,
  itemHeight: number,
  overscan: number = 3
) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      
      const startIndex = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      
      const start = Math.max(0, startIndex - overscan);
      const end = Math.min(items.length, startIndex + visibleCount + overscan);
      
      setVisibleRange({ start, end });
      setScrollTop(scrollTop);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, itemHeight, overscan, containerRef]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  return { visibleItems, visibleRange, totalHeight, scrollTop };
}

export default function PdfViewerPage() {
  const [activeTab, setActiveTab] = useState<'outline' | 'library' | 'thumbnails'>('library');
  const [userPdfs, setUserPdfs] = useState<UserPdf[]>([]);
  const [currentPdf, setCurrentPdf] = useState<{ id: string; name: string; url: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [outline, setOutline] = useState<PdfOutlineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDBReady, setIsDBReady] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState<string | null>(null);
  const [showMemoryPrompt, setShowMemoryPrompt] = useState(false);
  const [savedPage, setSavedPage] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [thumbnails, setThumbnails] = useState<{ page: number; url: string }[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [pagesInfo, setPagesInfo] = useState<PageInfo[]>([]);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const pageCanvasesRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const renderTasksRef = useRef<Map<number, any>>(new Map());

  // Initialize DB and load user PDFs
  useEffect(() => {
    const init = async () => {
      try {
        await pdfDB.init();
        setIsDBReady(true);
        await loadUserPdfs();
      } catch (err) {
        console.error('Failed to initialize IndexedDB:', err);
        setError('Failed to initialize database. Please check browser compatibility.');
      }
    };
    init();
  }, []);

  // Load user PDFs from IndexedDB
  const loadUserPdfs = async () => {
    try {
      const pdfs = await pdfDB.getAllPdfs();
      setUserPdfs(pdfs.map(p => ({ 
        id: p.id, 
        name: p.name, 
        addedAt: p.addedAt 
      })));
    } catch (err) {
      console.error('Failed to load PDFs:', err);
    }
  };

  // Save current page to memory
  useEffect(() => {
    if (currentPdf && currentPage > 0) {
      const memory = localStorage.getItem('pdfViewer_pageMemory');
      const parsed: PdfPageMemory = memory ? JSON.parse(memory) : {};
      parsed[currentPdf.id] = currentPage;
      localStorage.setItem('pdfViewer_pageMemory', JSON.stringify(parsed));
    }
  }, [currentPdf, currentPage]);

  // Countdown timer for memory prompt
  useEffect(() => {
    if (showMemoryPrompt && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showMemoryPrompt && countdown === 0) {
      if (savedPage) {
        scrollToPage(savedPage);
      }
      setShowMemoryPrompt(false);
    }
  }, [showMemoryPrompt, countdown, savedPage]);

  // Initialize PDF.js
  const initPdfJs = async () => {
    if (typeof window === 'undefined') return null;
    
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/js/pdf.worker.min.mjs`;
    return pdfjsLib;
  };

  // Get saved page from memory
  const getSavedPage = useCallback((pdfId: string): number => {
    const memory = localStorage.getItem('pdfViewer_pageMemory');
    if (memory) {
      const parsed: PdfPageMemory = JSON.parse(memory);
      const saved = parsed[pdfId];
      if (saved && saved > 1) {
        return saved;
      }
    }
    return 1;
  }, []);

  // Scroll to specific page
  const scrollToPage = (pageNum: number) => {
    if (!scrollContainerRef.current || pagesInfo.length === 0) return;
    
    let offset = 0;
    for (let i = 0; i < pageNum - 1 && i < pagesInfo.length; i++) {
      offset += pagesInfo[i].height * scale + 20; // 20px gap
    }
    
    scrollContainerRef.current.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
    setCurrentPage(pageNum);
  };

  // Get page dimensions
  const getPageDimensions = async (pdf: any, pageNum: number): Promise<{ width: number; height: number }> => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      return { width: viewport.width, height: viewport.height };
    } catch {
      return { width: 600, height: 800 };
    }
  };

  // Render a single page
  const renderPage = async (pageNum: number) => {
    if (!pdfDocRef.current || renderedPages.has(pageNum)) return;
    
    const canvas = pageCanvasesRef.current.get(pageNum);
    if (!canvas) return;
    
    // Cancel any existing render task for this page
    if (renderTasksRef.current.has(pageNum)) {
      const existingTask = renderTasksRef.current.get(pageNum);
      if (existingTask && existingTask.cancel) {
        existingTask.cancel();
      }
      renderTasksRef.current.delete(pageNum);
    }

    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const context = canvas.getContext('2d');
      if (!context) return;

      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: scale * dpr });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;
      
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create render task
      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport,
        intent: 'display'
      });
      
      // Store the task so we can cancel it if needed
      renderTasksRef.current.set(pageNum, renderTask);
      
      await renderTask.promise;
      
      // Mark as rendered
      renderTasksRef.current.delete(pageNum);
      setRenderedPages(prev => new Set([...prev, pageNum]));
    } catch (err) {
      // Don't log error if it was cancelled
      if (err && typeof err === 'object' && 'name' in err && err.name === 'RenderingCancelledException') {
        return;
      }
      console.error(`Failed to render page ${pageNum}:`, err);
    }
  };

  // Load PDF from IndexedDB
  const loadPdfFromDB = async (pdfId: string, name: string) => {
    setLoading(true);
    setError('');
    setShowMemoryPrompt(false);
    setSavedPage(null);
    setRenderedPages(new Set());
    setPagesInfo([]);
    
    // Cancel all pending render tasks
    renderTasksRef.current.forEach((task) => {
      if (task && task.cancel) {
        task.cancel();
      }
    });
    renderTasksRef.current.clear();
    pageCanvasesRef.current.clear();
    
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    try {
      const pdfRecord = await pdfDB.getPdf(pdfId);
      if (!pdfRecord) {
        setError('PDF not found in database');
        setLoading(false);
        return;
      }

      const blob = new Blob([pdfRecord.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const pdfjsLib = await initPdfJs();
      if (!pdfjsLib) throw new Error('PDF.js not loaded');
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      
      setCurrentPdf({ id: pdfId, name, url });
      setTotalPages(pdf.numPages);
      setOutline([]);
      setThumbnails([]);
      
      // Get all page dimensions
      const pageInfos: PageInfo[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const dims = await getPageDimensions(pdf, i);
        pageInfos.push({
          page: i,
          width: dims.width,
          height: dims.height,
          rendered: false
        });
      }
      setPagesInfo(pageInfos);
      
      // Try to get outline
      try {
        const outlineData = await pdf.getOutline();
        if (outlineData && outlineData.length > 0) {
          setOutline(outlineData);
          setActiveTab('outline');
        } else {
          setOutline([]);
          setActiveTab('library');
        }
      } catch {
        setOutline([]);
        setActiveTab('library');
      }
      
      setLoading(false);
      
      // Scroll to saved page after a delay
      const saved = getSavedPage(pdfId);
      if (saved > 1 && pdf.numPages > 1) {
        setSavedPage(saved);
        setCountdown(5);
        setShowMemoryPrompt(true);
      }
      
      // Initial render of first few pages
      setTimeout(() => {
        for (let i = 1; i <= Math.min(3, pdf.numPages); i++) {
          renderPage(i);
        }
      }, 100);
    } catch (err) {
      console.error('PDF load error:', err);
      setError('Failed to load PDF. Please check if the file is valid.');
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      if (!confirm('This PDF is larger than 50MB. It may take a while to process. Continue?')) {
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await pdfDB.addPdf(id, file.name, arrayBuffer);
      await loadUserPdfs();
      await loadPdfFromDB(id, file.name);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload PDF. The file may be too large or corrupted.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove user PDF
  const removeUserPdf = async (id: string) => {
    try {
      await pdfDB.deletePdf(id);
      setUserPdfs(prev => prev.filter(p => p.id !== id));
      
      if (currentPdf?.id === id) {
        // Cancel all pending render tasks
        renderTasksRef.current.forEach((task) => {
          if (task && task.cancel) {
            task.cancel();
          }
        });
        renderTasksRef.current.clear();
        
        setCurrentPdf(null);
        setCurrentPage(1);
        setTotalPages(0);
        pdfDocRef.current = null;
        setOutline([]);
        setPagesInfo([]);
        setRenderedPages(new Set());
        pageCanvasesRef.current.clear();
        URL.revokeObjectURL(currentPdf.url);
      }
      
      const memory = localStorage.getItem('pdfViewer_pageMemory');
      if (memory) {
        const parsed: PdfPageMemory = JSON.parse(memory);
        delete parsed[id];
        localStorage.setItem('pdfViewer_pageMemory', JSON.stringify(parsed));
      }
      
      setPdfToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete PDF');
    }
  };

  // Handle memory prompt actions
  const handleStayOnFirstPage = () => {
    setShowMemoryPrompt(false);
    setSavedPage(null);
  };

  const handleJumpToSavedPage = () => {
    if (savedPage) {
      scrollToPage(savedPage);
    }
    setShowMemoryPrompt(false);
    setSavedPage(null);
  };

  // Handle outline item click
  const handleOutlineClick = async (item: PdfOutlineItem) => {
    if (!pdfDocRef.current || !item.dest) return;
    
    try {
      let pageNumber: number | null = null;
      
      if (typeof item.dest === 'string') {
        try {
          const destination = await pdfDocRef.current.getDestination(item.dest);
          if (destination && Array.isArray(destination) && destination[0]) {
            pageNumber = await pdfDocRef.current.getPageIndex(destination[0]) + 1;
          }
        } catch {
          const parsed = parseInt(item.dest, 10);
          if (!isNaN(parsed) && parsed > 0) {
            pageNumber = parsed;
          }
        }
      } else if (Array.isArray(item.dest)) {
        const firstElement = item.dest[0];
        if (typeof firstElement === 'number') {
          pageNumber = firstElement + 1;
        } else if (firstElement && typeof firstElement === 'object') {
          try {
            pageNumber = await pdfDocRef.current.getPageIndex(firstElement) + 1;
          } catch {}
        }
      } else if (typeof item.dest === 'number') {
        pageNumber = item.dest + 1;
      }
      
      if (pageNumber && pageNumber > 0 && pageNumber <= totalPages) {
        scrollToPage(pageNumber);
      }
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  // Render outline recursively
  const renderOutline = (items: PdfOutlineItem[], depth = 0) => {
    return items.map((item, index) => (
      <div key={`${depth}-${index}`} style={{ marginLeft: `${depth * 12}px` }}>
        <button
          onClick={() => handleOutlineClick(item)}
          className="w-full text-left px-3 py-2 text-xs font-mono hover:bg-orange-50 hover:text-orange-600 transition-colors rounded"
        >
          {item.title}
        </button>
        {item.items && item.items.length > 0 && renderOutline(item.items, depth + 1)}
      </div>
    ));
  };

  // Generate thumbnail for a specific page
  const generateThumbnail = async (pageNum: number): Promise<string> => {
    if (!pdfDocRef.current) return '';
    
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return '';
      
      const thumbScale = 0.2;
      const viewport = page.getViewport({ scale: thumbScale });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return canvas.toDataURL('image/jpeg', 0.7);
    } catch (err) {
      console.error('Failed to generate thumbnail:', err);
      return '';
    }
  };

  // Load thumbnails when showing thumbnail panel
  useEffect(() => {
    if (activeTab === 'thumbnails' && pdfDocRef.current && totalPages > 0) {
      const loadThumbnails = async () => {
        setThumbnailsLoading(true);
        const thumbList: { page: number; url: string }[] = [];
        const maxThumbs = Math.min(totalPages, 50);
        
        for (let i = 1; i <= maxThumbs; i++) {
          const url = await generateThumbnail(i);
          if (url) {
            thumbList.push({ page: i, url });
          }
        }
        
        setThumbnails(thumbList);
        setThumbnailsLoading(false);
      };
      
      loadThumbnails();
    }
  }, [activeTab, totalPages]);

  // Handle page input submission
  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        scrollToPage(page);
        setPageInput('');
      }
    }
  };

  // Handle scroll to update current page
  const handleScroll = () => {
    if (!scrollContainerRef.current || pagesInfo.length === 0) return;
    
    const scrollTop = scrollContainerRef.current.scrollTop;
    let accumulatedHeight = 0;
    
    for (let i = 0; i < pagesInfo.length; i++) {
      const pageHeight = pagesInfo[i].height * scale + 20;
      if (scrollTop < accumulatedHeight + pageHeight / 2) {
        setCurrentPage(i + 1);
        break;
      }
      accumulatedHeight += pageHeight;
    }
  };

  // Calculate total scroll height
  const totalScrollHeight = useMemo(() => {
    return pagesInfo.reduce((acc, page) => acc + page.height * scale + 20, 0);
  }, [pagesInfo, scale]);

  // Render visible pages
  useEffect(() => {
    if (!scrollContainerRef.current || pagesInfo.length === 0) return;
    
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    let accumulatedHeight = 0;
    const visiblePages: number[] = [];
    
    for (let i = 0; i < pagesInfo.length; i++) {
      const pageHeight = pagesInfo[i].height * scale + 20;
      const pageTop = accumulatedHeight;
      const pageBottom = pageTop + pageHeight;
      
      // Check if page is visible (with some buffer)
      if (pageBottom > scrollTop - 200 && pageTop < scrollTop + containerHeight + 200) {
        visiblePages.push(i + 1);
      }
      
      accumulatedHeight += pageHeight;
    }
    
    // Render visible pages
    visiblePages.forEach(pageNum => {
      if (!renderedPages.has(pageNum)) {
        renderPage(pageNum);
      }
    });
  }, [pagesInfo, scale, renderedPages]);

  // Navigation functions
  const prevPage = () => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      scrollToPage(currentPage + 1);
    }
  };

  if (!isDBReady) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#ea580c]" />
          <span className="font-mono text-sm">Initializing database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[oklch(0.145_0_0)]">
      <PageTitle title="PDF 预览" />

      {/* Memory Prompt Modal */}
      {showMemoryPrompt && savedPage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white border border-[oklch(0.145_0_0)] rounded-xl p-6 max-w-md mx-4 shadow-[8px_8px_0px_oklch(0.145_0_0)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
                  <path d="M3 3v9h9"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg">Continue Reading?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              You previously read this PDF up to page <strong>{savedPage}</strong> of {totalPages}.
            </p>
            <p className="text-xs text-gray-500 mb-6 font-mono">
              Auto-jumping in {countdown}s...
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStayOnFirstPage}
                className="flex-1 px-4 py-2 border border-[oklch(0.145_0_0)] rounded-lg font-mono text-xs font-bold uppercase hover:bg-gray-50 transition-colors"
              >
                Stay on page 1
              </button>
              <button
                onClick={handleJumpToSavedPage}
                className="flex-1 px-4 py-2 bg-[#ea580c] text-white rounded-lg font-mono text-xs font-bold uppercase hover:bg-orange-700 transition-colors"
              >
                Go to page {savedPage}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pdfToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white border border-[oklch(0.145_0_0)] rounded-xl p-6 max-w-md mx-4 shadow-[8px_8px_0px_oklch(0.145_0_0)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-lg">Delete PDF?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>{userPdfs.find(p => p.id === pdfToDelete)?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPdfToDelete(null)}
                className="flex-1 px-4 py-2 border border-[oklch(0.145_0_0)] rounded-lg font-mono text-xs font-bold uppercase hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removeUserPdf(pdfToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-mono text-xs font-bold uppercase hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-[oklch(0.145_0_0)] flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-[oklch(0.145_0_0)]">
            <Link
              href="/tools"
              className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#ea580c] mb-3 hover:underline"
            >
              <ChevronLeft className="w-3 h-3 mr-1" />
              Back
            </Link>
            <h1 className="text-xl font-black tracking-tight">PDF Viewer</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[oklch(0.145_0_0)]">
            <button
              onClick={() => setActiveTab('outline')}
              className={`flex-1 px-3 py-3 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'outline' 
                  ? 'bg-[oklch(0.145_0_0)] text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <List className="w-3 h-3" />
              Outline
            </button>
            <button
              onClick={() => setActiveTab('thumbnails')}
              disabled={!currentPdf}
              className={`flex-1 px-3 py-3 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'thumbnails' 
                  ? 'bg-[oklch(0.145_0_0)] text-white' 
                  : 'hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              Pages
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 px-3 py-3 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'library' 
                  ? 'bg-[oklch(0.145_0_0)] text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Folder className="w-3 h-3" />
              Library
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'outline' && (
              <div className="p-3">
                {outline.length > 0 ? (
                  <div className="space-y-1">
                    {renderOutline(outline)}
                  </div>
                ) : (
                  <div className="text-center py-8 opacity-40">
                    <List className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-mono">No outline available</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'thumbnails' && currentPdf && (
              <div className="p-3">
                {thumbnailsLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs font-mono">Generating thumbnails...</span>
                  </div>
                ) : thumbnails.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {thumbnails.map((thumb) => (
                      <button
                        key={thumb.page}
                        onClick={() => {
                          scrollToPage(thumb.page);
                        }}
                        className={`border-2 rounded-lg overflow-hidden transition-all ${
                          currentPage === thumb.page
                            ? 'border-[#ea580c] shadow-md'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={thumb.url}
                          alt={`Page ${thumb.page}`}
                          className="w-full h-auto block"
                        />
                        <div className={`text-center text-[10px] font-mono py-1 ${
                          currentPage === thumb.page ? 'bg-[#ea580c] text-white' : 'bg-gray-100'
                        }`}>
                          {thumb.page}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 opacity-40">
                    <LayoutGrid className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-mono">No thumbnails available</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'library' && (
              <div className="p-3 space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-dashed border-[oklch(0.145_0_0)] rounded-lg flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-[#ea580c] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full border border-[oklch(0.145_0_0)] flex items-center justify-center group-hover:border-[#ea580c] group-hover:bg-orange-100 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold">Add PDF</span>
                    </>
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                />

                {userPdfs.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
                      Your PDFs ({userPdfs.length})
                    </h3>
                    <div className="space-y-1">
                      {userPdfs.map((pdf) => (
                        <div
                          key={pdf.id}
                          className={`w-full px-3 py-2 flex items-center gap-2 rounded-lg text-left text-xs transition-all group ${
                            currentPdf?.id === pdf.id
                              ? 'bg-[oklch(0.145_0_0)] text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <button
                            onClick={() => loadPdfFromDB(pdf.id, pdf.name)}
                            className="flex items-center gap-2 flex-1 min-w-0"
                          >
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate font-mono text-left">{pdf.name}</span>
                          </button>
                          <button
                            onClick={() => setPdfToDelete(pdf.id)}
                            className={`p-1 rounded transition-colors ${
                              currentPdf?.id === pdf.id
                                ? 'hover:bg-white/20'
                                : 'hover:bg-red-100 hover:text-red-500'
                            }`}
                            title="Delete PDF"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userPdfs.length === 0 && (
                  <div className="px-3 py-8 text-center opacity-40">
                    <Folder className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-[10px] font-mono">No PDFs yet</p>
                    <p className="text-[9px] font-mono mt-1">Click "Add PDF" to upload</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#f5f5f5]">
          {/* Toolbar */}
          {currentPdf && (
            <div className="h-14 bg-white border-b border-[oklch(0.145_0_0)] flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono font-bold truncate max-w-md">
                  {currentPdf.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className="p-2 border border-[oklch(0.145_0_0)] rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={handlePageInputSubmit}
                    onBlur={() => setPageInput('')}
                    placeholder={currentPage.toString()}
                    className="w-12 px-2 py-1 border border-[oklch(0.145_0_0)] rounded text-xs font-mono text-center focus:outline-none focus:border-[#ea580c]"
                  />
                  <span className="text-xs font-mono text-gray-500">/ {totalPages}</span>
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 border border-[oklch(0.145_0_0)] rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="px-2 py-1 border border-[oklch(0.145_0_0)] rounded text-xs font-mono bg-white"
                >
                  <option value={0.5}>50%</option>
                  <option value={0.75}>75%</option>
                  <option value={1}>100%</option>
                  <option value={1.2}>120%</option>
                  <option value={1.5}>150%</option>
                  <option value={2}>200%</option>
                </select>
              </div>
            </div>
          )}

          {/* PDF Viewer Area - All Pages with Virtual Scrolling */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto"
            onScroll={handleScroll}
          >
            {currentPdf ? (
              <div className="p-8">
                {/* Spacer for total height */}
                <div style={{ height: totalScrollHeight, position: 'relative' }}>
                  {pagesInfo.map((pageInfo, index) => {
                    const pageNum = index + 1;
                    let offset = 0;
                    for (let i = 0; i < index; i++) {
                      offset += pagesInfo[i].height * scale + 20;
                    }
                    
                    return (
                      <div
                        key={pageNum}
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{
                          top: offset,
                          marginBottom: '20px',
                        }}
                      >
                        <div className="relative shadow-lg bg-white">
                          <canvas
                            ref={(el) => {
                              if (el) {
                                pageCanvasesRef.current.set(pageNum, el);
                                // Trigger render if not already rendered
                                if (!renderedPages.has(pageNum)) {
                                  setTimeout(() => renderPage(pageNum), 0);
                                }
                              }
                            }}
                            className="block"
                            style={{
                              width: `${pageInfo.width * scale}px`,
                              height: `${pageInfo.height * scale}px`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Loading overlay */}
                {loading && (
                  <div className="fixed inset-0 flex items-center justify-center bg-[#f5f5f5]/80 z-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[oklch(0.145_0_0)] border-t-[#ea580c] rounded-full animate-spin" />
                      <span className="font-mono text-xs">Loading PDF...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <div className="w-24 h-24 rounded-full border border-dashed border-[oklch(0.145_0_0)] flex items-center justify-center mb-6">
                  <div className="w-[75%] h-[75%] rounded-full border border-[oklch(0.145_0_0)] flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                </div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest">
                  Select a PDF to start reading
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
