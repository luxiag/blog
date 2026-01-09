
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">关于我</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden">
              <Image
                src="/images/profile.jpg"  // 请替换为您的头像路径
                alt="个人头像"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="prose prose-lg max-w-none">
              <p>
                你好，我是一名热爱技术的开发者，专注于前端开发和用户体验设计。
                这个博客是我分享技术见解、学习心得和思考感悟的地方。
              </p>
              <p>
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

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">技能与专长</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">前端技术</h3>
              <ul className="space-y-2 text-gray-600">
                <li>HTML5 & CSS3</li>
                <li>JavaScript (ES6+)</li>
                <li>TypeScript</li>
                <li>React & Next.js</li>
                <li>Vue.js</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">工具与其他</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Git & GitHub</li>
                <li>Node.js & Express</li>
                <li>MongoDB & SQL</li>
                <li>UI/UX 设计</li>
                <li>响应式设计</li>
                <li>性能优化</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">联系我</h2>
          <div className="flex justify-center space-x-6">
            <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-blue-600 transition-colors">
              邮箱
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              Twitter
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
