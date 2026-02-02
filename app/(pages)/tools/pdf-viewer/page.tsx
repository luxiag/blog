'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { pdfDB, PdfRecord } from './db';
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
  Loader2
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

export default function PdfViewerPage() {
  const [activeTab, setActiveTab] = useState<'outline' | 'library'>('library');
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Save current page to memory (still use localStorage for lightweight data)
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
      // Auto-jump when countdown reaches 0
      if (savedPage) {
        setCurrentPage(savedPage);
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
    return 1; // Default to first page
  }, []);

  // Load PDF from IndexedDB
  const loadPdfFromDB = async (pdfId: string, name: string) => {
    setLoading(true);
    setError('');
    setShowMemoryPrompt(false);
    setSavedPage(null);
    
    // Clear any pending render timeout
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

      // Create blob URL from ArrayBuffer
      const blob = new Blob([pdfRecord.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Load PDF document first
      const pdfjsLib = await initPdfJs();
      if (!pdfjsLib) throw new Error('PDF.js not loaded');
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      
      // Set state
      setCurrentPdf({ id: pdfId, name, url });
      setTotalPages(pdf.numPages);
      setOutline([]);
      
      // Try to get outline (handle gracefully if no outline)
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
      
      // Set current page to 1
      setCurrentPage(1);
      
      // Render page after React has updated the DOM
      // Use multiple checks to ensure canvas is ready
      const attemptRender = async (attempts = 0) => {
        if (!canvasRef.current) {
          if (attempts < 50) { // Try for up to 5 seconds
            renderTimeoutRef.current = setTimeout(() => attemptRender(attempts + 1), 100);
            return;
          }
          console.error('Canvas not ready after 50 attempts');
          setLoading(false);
          return;
        }
        
        try {
          await renderPage(1);
          setLoading(false);
          
          // Check memory after successful render
          const saved = getSavedPage(pdfId);
          if (saved > 1 && pdf.numPages > 1) {
            setSavedPage(saved);
            setCountdown(5);
            setShowMemoryPrompt(true);
          }
        } catch (renderErr) {
          console.error('Failed to render page:', renderErr);
          setError('Failed to render PDF page');
          setLoading(false);
        }
      };
      
      // Start rendering after React has flushed updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          attemptRender();
        });
      });
    } catch (err) {
      console.error('PDF load error:', err);
      setError('Failed to load PDF. Please check if the file is valid.');
      setLoading(false);
    }
  };

  // Render specific page with HiDPI support and text layer
  const renderPage = async (pageNum: number) => {
    if (!pdfDocRef.current) {
      console.log('renderPage: pdfDocRef not ready');
      return;
    }
    
    if (!canvasRef.current) {
      console.log('renderPage: canvasRef not ready');
      return;
    }
    
    try {
      console.log('renderPage: rendering page', pageNum);
      const page = await pdfDocRef.current.getPage(pageNum);
      const canvas = canvasRef.current;
      const textLayer = textLayerRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.log('renderPage: canvas context not available');
        return;
      }
      
      // Get device pixel ratio for crisp rendering on HiDPI/Retina displays
      const dpr = window.devicePixelRatio || 1;
      
      // Calculate viewport at the desired scale (without DPR for logical viewport)
      const viewport = page.getViewport({ scale });
      const renderViewport = page.getViewport({ scale: scale * dpr });
      
      // Set canvas backing store size (actual pixel dimensions with DPR)
      canvas.width = renderViewport.width;
      canvas.height = renderViewport.height;
      
      // Set CSS display size (logical dimensions without DPR)
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      
      // Reset transform and scale to account for DPR
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render canvas
      await page.render({
        canvasContext: context,
        viewport: renderViewport,
        intent: 'display'
      }).promise;
      
      console.log('renderPage: page rendered successfully');
      
      // Render text layer for copy/paste support
      if (textLayer) {
        // Clear previous text layer
        textLayer.innerHTML = '';
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.height = `${viewport.height}px`;
        
        try {
          const textContent = await page.getTextContent();
          
          textContent.items.forEach((item: any) => {
            const tx = item.transform;
            // PDF transform matrix: [a, b, c, d, e, f]
            // tx[0], tx[1], tx[2], tx[3] form the linear transformation
            // tx[4] is the x translation, tx[5] is the y translation
            
            // Apply the viewport scale to the PDF coordinates
            const x = tx[4] * scale;
            const y = viewport.height - (tx[5] * scale);
            
            // Calculate font size from the transform matrix
            // The scale factor is the magnitude of the linear part
            const fontSize = Math.abs(tx[3]) * scale;
            
            const span = document.createElement('span');
            span.textContent = item.str;
            span.style.position = 'absolute';
            span.style.left = `${x}px`;
            span.style.top = `${y - fontSize}px`; // Adjust for baseline (y is bottom of text)
            span.style.fontSize = `${fontSize}px`;
            span.style.fontFamily = item.fontName || 'sans-serif';
            span.style.whiteSpace = 'pre';
            span.style.transformOrigin = 'left bottom';
            span.style.lineHeight = '1';
            
            // Handle text rotation if needed
            if (tx[1] !== 0 || tx[2] !== 0) {
              // Calculate rotation angle from transform matrix
              const angle = Math.atan2(tx[1], tx[0]) * (180 / Math.PI);
              span.style.transform = `rotate(${angle}deg)`;
            }
            
            // Semi-transparent text for debugging, then switch to transparent
            span.style.color = 'transparent';
            span.style.userSelect = 'text';
            span.style.cursor = 'text';
            span.style.backgroundColor = 'transparent';
            
            textLayer.appendChild(span);
          });
        } catch (textErr) {
          console.warn('Failed to render text layer:', textErr);
        }
      }
    } catch (err) {
      console.error('Page render error:', err);
    }
  };

  // Handle page change and initial render
  useEffect(() => {
    if (pdfDocRef.current && currentPage > 0 && !loading) {
      // Only render if not in loading state (loading state handles its own rendering)
      renderPage(currentPage);
    }
  }, [currentPage, scale]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }
    
    // Check file size (warn if > 50MB)
    if (file.size > 50 * 1024 * 1024) {
      if (!confirm('This PDF is larger than 50MB. It may take a while to process. Continue?')) {
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Generate unique ID
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to IndexedDB
      await pdfDB.addPdf(id, file.name, arrayBuffer);
      
      // Reload user PDFs list
      await loadUserPdfs();
      
      // Load the newly uploaded PDF
      await loadPdfFromDB(id, file.name);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload PDF. The file may be too large or corrupted.');
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove user PDF
  const removeUserPdf = async (id: string) => {
    try {
      // Delete from IndexedDB
      await pdfDB.deletePdf(id);
      
      // Update UI
      setUserPdfs(prev => prev.filter(p => p.id !== id));
      
      // If currently viewing this PDF, close it
      if (currentPdf?.id === id) {
        setCurrentPdf(null);
        setCurrentPage(1);
        setTotalPages(0);
        pdfDocRef.current = null;
        setOutline([]);
        
        // Revoke the blob URL
        URL.revokeObjectURL(currentPdf.url);
      }
      
      // Clear page memory for this PDF
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

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  // Handle memory prompt actions
  const handleStayOnFirstPage = () => {
    setShowMemoryPrompt(false);
    setSavedPage(null);
  };

  const handleJumpToSavedPage = () => {
    if (savedPage) {
      setCurrentPage(savedPage);
    }
    setShowMemoryPrompt(false);
    setSavedPage(null);
  };

  // Handle outline item click
  const handleOutlineClick = async (item: PdfOutlineItem) => {
    if (!pdfDocRef.current || !item.dest) return;
    
    try {
      let pageNumber: number | null = null;
      
      // dest can be in different formats:
      // 1. A string reference - need to look up
      // 2. An array with page reference directly
      // 3. An array with page number directly
      
      if (typeof item.dest === 'string') {
        // It's a named destination, look it up
        try {
          const destination = await pdfDocRef.current.getDestination(item.dest);
          if (destination && Array.isArray(destination) && destination[0]) {
            // destination[0] is the page reference
            pageNumber = await pdfDocRef.current.getPageIndex(destination[0]) + 1;
          }
        } catch {
          // Named destination lookup failed, try to use it as page number
          const parsed = parseInt(item.dest, 10);
          if (!isNaN(parsed) && parsed > 0) {
            pageNumber = parsed;
          }
        }
      } else if (Array.isArray(item.dest)) {
        // It's an explicit destination array
        // First element is usually the page reference or page number
        const firstElement = item.dest[0];
        
        if (typeof firstElement === 'number') {
          // Direct page number (0-indexed)
          pageNumber = firstElement + 1;
        } else if (firstElement && typeof firstElement === 'object') {
          // Page reference object, need to look up
          try {
            pageNumber = await pdfDocRef.current.getPageIndex(firstElement) + 1;
          } catch {
            // Failed to resolve page reference
          }
        }
      } else if (typeof item.dest === 'number') {
        // Direct page number
        pageNumber = item.dest + 1;
      }
      
      if (pageNumber && pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      } else {
        console.warn('Could not resolve page number for outline item:', item);
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

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
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
            {activeTab === 'outline' ? (
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
            ) : (
              <div className="p-3 space-y-3">
                {/* Add PDF Button */}
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

                {/* User PDFs */}
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

                {/* Empty State */}
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
            <div className="h-14 bg-white border-b border-[oklch(0.145_0_0)] flex items-center justify-between px-4">
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
                
                <span className="text-xs font-mono px-3 py-1 bg-gray-100 rounded">
                  {currentPage} / {totalPages}
                </span>
                
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

          {/* PDF Viewer Area */}
          <div className="flex-1 overflow-auto p-8">
            {currentPdf ? (
              <div className="flex justify-center min-h-full relative">
                {/* Canvas is always rendered, even during loading */}
                <div className="relative shadow-lg" style={{ visibility: loading || error ? 'hidden' : 'visible' }}>
                  <canvas
                    ref={canvasRef}
                    className="bg-white block"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  {/* Text layer for copy/paste */}
                  <div
                    ref={textLayerRef}
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      top: 0,
                      left: 0,
                      pointerEvents: 'auto',
                    }}
                  />
                </div>
                
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]/80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[oklch(0.145_0_0)] border-t-[#ea580c] rounded-full animate-spin" />
                      <span className="font-mono text-xs">Loading PDF...</span>
                    </div>
                  </div>
                )}
                
                {/* Error overlay */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]/80">
                    <div className="flex flex-col items-center text-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                      <p className="text-sm font-mono text-red-600">{error}</p>
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
