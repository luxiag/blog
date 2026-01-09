
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white" style={{borderTop: '1px solid var(--border-color)'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{padding: '48px 24px'}}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{gap: '32px'}}>
          {/* About section */}
          <div>
            <h3 className="feature-card-title" style={{marginBottom: '16px'}}>关于博客</h3>
            <p style={{fontSize: '14px', color: 'var(--color-neutral-500)', lineHeight: '1.6'}}>
              这是我的个人博客，分享技术、生活与思考。希望我的文章能够给你带来启发和帮助。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="feature-card-title" style={{marginBottom: '16px'}}>快速链接</h3>
            <ul style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <li>
                <Link href="/" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)'}}>
                  首页
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)'}}>
                  博客文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)'}}>
                  关于我
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="feature-card-title" style={{marginBottom: '16px'}}>联系方式</h3>
            <ul style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <li>
                <a href="mailto:your.email@example.com" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)'}}>
                  your.email@example.com
                </a>
              </li>
              <li>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)'}}>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)'}}>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-color)'}}>
          <p style={{textAlign: 'center', fontSize: '13px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
            &copy; {currentYear} 我的博客. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
