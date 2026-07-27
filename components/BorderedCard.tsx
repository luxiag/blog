'use client';

interface BorderedCardProps {
  children: React.ReactNode;
  className?: string;
  showCorners?: boolean;
}

export default function BorderedCard({ children, className = '', showCorners = true }: BorderedCardProps) {
  return (
    <div className={`relative ${className}`}>
      {showCorners && (
        <>
          <div
            className="absolute hidden lg:block"
            style={{
              width: '17px',
              height: '17px',
              top: 0,
              left: 0,
            }}
          >
            <svg width="100%" height="100%" aria-hidden="true">
              <line x1="0" y1="0" x2="17" y2="17" stroke="currentColor" strokeWidth="1" className="text-neutral-900 dark:text-neutral-100" />
            </svg>
          </div>
          <div
            className="absolute hidden lg:block"
            style={{
              width: '17px',
              height: '17px',
              top: 0,
              right: 0,
            }}
          >
            <svg width="100%" height="100%" aria-hidden="true">
              <line x1="0" y1="17" x2="17" y2="0" stroke="currentColor" strokeWidth="1" className="text-neutral-900 dark:text-neutral-100" />
            </svg>
          </div>
          <div
            className="absolute hidden lg:block"
            style={{
              width: '17px',
              height: '17px',
              bottom: 0,
              left: 0,
            }}
          >
            <svg width="100%" height="100%" aria-hidden="true">
              <line x1="0" y1="17" x2="17" y2="0" stroke="currentColor" strokeWidth="1" className="text-neutral-900 dark:text-neutral-100" />
            </svg>
          </div>
          <div
            className="absolute hidden lg:block"
            style={{
              width: '17px',
              height: '17px',
              bottom: 0,
              right: 0,
            }}
          >
            <svg width="100%" height="100%" aria-hidden="true">
              <line x1="0" y1="0" x2="17" y2="17" stroke="currentColor" strokeWidth="1" className="text-neutral-900 dark:text-neutral-100" />
            </svg>
          </div>
        </>
      )}
      <div
        className="bg-white dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-100"
        style={{
          margin: showCorners ? '8px' : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
