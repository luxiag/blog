
import Image from 'next/image';
import PageTitle from '@/components/PageTitle';

export default function AboutPage() {
  return (
    <>
      <PageTitle title="关于我" />
      <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12">
        <h1 className="text-3xl sm:text-5xl" style={{fontWeight: 900, marginBottom: '48px', fontFamily: 'var(--font-sans)', color: 'var(--foreground)'}}>关于我</h1>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{gap: '32px', marginBottom: '48px'}}>
          <div className="md:col-span-1">
            <div className="relative h-48 w-48 sm:h-64 sm:w-64 mx-auto rounded-full overflow-hidden" style={{border: '1px solid var(--border-color)'}}>
              <Image
                src="/images/profile.jpg"  // 请替换为您的头像路径
                alt="个人头像"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div style={{fontSize: '16px', lineHeight: '1.7', color: 'var(--foreground)'}}>
              <p style={{marginBottom: '16px'}}>
                你好，我是一名热爱技术的开发者，专注于前端开发和用户体验设计。
                这个博客是我分享技术见解、学习心得和思考感悟的地方。
              </p>
              <p style={{marginBottom: '16px'}}>
                我的主要技术栈包括 JavaScript、TypeScript、React、Next.js、Node.js 等。
                我对新技术充满热情，喜欢探索和学习新的编程语言和框架。
              </p>
              <p>
                在这个博客中，你会找到关于前端开发、软件工程、设计思维以及个人成长的文章。
                我希望通过分享我的经验和见解，能够帮助到更多的开发者。
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{padding: '32px'}}>
          <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--foreground)'}}>技能与专长</h2>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{gap: '24px'}}>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--foreground)'}}>前端技术</h3>
              <ul style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>HTML5 & CSS3</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>JavaScript (ES6+)</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>TypeScript</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>React & Next.js</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>Vue.js</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>Tailwind CSS</li>
              </ul>
            </div>

            <div>
              <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--foreground)'}}>工具与其他</h3>
              <ul style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>Git & GitHub</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>Node.js & Express</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>MongoDB & SQL</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>UI/UX 设计</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>响应式设计</li>
                <li style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>性能优化</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{marginTop: '48px', textAlign: 'center'}}>
          <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--foreground)'}}>联系我</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="mailto:your.email@example.com" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
              邮箱
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
              GitHub
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
              Twitter
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{fontSize: '14px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
