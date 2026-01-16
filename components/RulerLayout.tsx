'use client';

export default function RulerLayout({ children }: { children: React.ReactNode }) {
  const rulerTicks = Array.from({ length: 7 });

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed top-6 bottom-6 left-6 hidden lg:flex flex-col items-center justify-between z-40"
      >
        {/* <div
          className="absolute top-0 bottom-0 border-r border-neutral-900 dark:border-neutral-100"
        />
        {rulerTicks.map((_, i) => (
          <div
            key={i}
            className="w-3 border-t border-neutral-900 dark:border-neutral-100"
          />
        ))} */}
      </div>

      <div
        className="fixed top-6 bottom-6 right-6 hidden lg:flex flex-col items-center justify-between z-40"
      >
        {/* <div
          className="absolute top-0 bottom-0 border-r border-neutral-900 dark:border-neutral-100"
        /> */}
        {/* {rulerTicks.map((_, i) => (
          <div
            key={i}
            className="w-3 border-t border-neutral-900 dark:border-neutral-100"
          />
        ))} */}
      </div>

      <div className="px-4 sm:px-8 lg:px-16">
        <div
          className="max-w-[1400px] mx-auto lg:border-x border-solid border-neutral-900 dark:border-neutral-100 min-h-screen"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
