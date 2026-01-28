'use client';

import { DocSearch } from '@docsearch/react';
import '@docsearch/css';
import '@/styles/algolia-search.css';

export default function AlgoliaSearch() {
  return (
    <div className="w-full max-w-xs">
      <DocSearch
        appId="E61AH5LVMY"
        indexName="luxiagio"
        apiKey="7ee7c421ead583565a0f595847080f06"
        placeholder="搜索文章..."
        translations={{
          button: {
            buttonText: '搜索文章...',
            buttonAriaLabel: '搜索文章',
          },
          modal: {
            searchBox: {
              searchInputLabel: '搜索文章...',
            },
            startScreen: {
              recentSearchesTitle: '最近搜索',
              noRecentSearchesText: '没有最近的搜索',
              saveRecentSearchButtonTitle: '保存搜索',
              removeRecentSearchButtonTitle: '删除搜索',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中删除',
            },
            errorScreen: {
              titleText: '无法获取搜索结果',
              helpText: '请检查网络连接',
            },
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: 'Enter',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '向上箭头',
              navigateDownKeyAriaLabel: '向下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Escape',
              searchByText: '搜索来源',
            },
            noResultsScreen: {
              noResultsText: '未找到结果',
              suggestedQueryText: '请尝试其他关键词',
            },
          },
        }}
      />
    </div>
  );
}
