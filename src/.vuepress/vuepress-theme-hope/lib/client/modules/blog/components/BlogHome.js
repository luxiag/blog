import { defineComponent, h, ref, onUnmounted, onMounted, computed } from "vue";
import ArticleList from "@theme-hope/modules/blog/components/ArticleList.js";
import BlogHero from "@theme-hope/modules/blog/components/BlogHero.js";
import InfoPanel from "@theme-hope/modules/blog/components/InfoPanel.js";
import ProjectPanel from "@theme-hope/modules/blog/components/ProjectPanel.js";
import DropTransition from "@theme-hope/components/transitions/DropTransition.js";
import MarkdownContent from "@theme-hope/components/MarkdownContent.js";
import { useArticles } from "@theme-hope/modules/blog/composables/index.js";
import { useBlogOptions } from "@theme-hope/modules/blog/composables/index.js";

import "../styles/home.scss";
export default defineComponent({
  name: "BlogHome",
  setup() {
    const articles = useArticles();
    const screens = articles.value.items;
    const screensRef = ref();
    // 滚动加载
    const blogOptions = useBlogOptions();
    const currentPage = ref(1);
    const articlePerPage = computed(
      () => blogOptions.value.articlePerPage || 20
    );
    const currentArticles = computed(() =>
      articles.value.items.slice(0, currentPage.value * articlePerPage.value)
    );
    const getDataToBottom = () => {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //windowHeight是可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //scrollHeight是滚动条的总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      //滚动条到底部的条件
      if (scrollTop + windowHeight + 150 >= scrollHeight) {
        //到了这个就可以进行业务逻辑加载后台数据了
        // console.log("到了底部");
        // window.onscroll = '' 用于解除绑定
        if (articles.value.items.length > currentArticles.value.length) {
          currentPage.value++;
        }
      }
      // console.log('getDataToBottom',scrollTop+windowHeight,scrollHeight)
    };
    const debounce = (func, delay = 200, immediate = false) => {
      let timer = null;
      return function () {
        if (timer) {
          clearTimeout(timer);
        }
        if (immediate && !timer) {
          func.apply(this, arguments);
        }
        timer = setTimeout(() => {
          func.apply(this, arguments);
        }, delay);
      };
    };

    onMounted(() => {
      //   const { page } = route.query;
      //   updatePage(page ? Number(page) : 1);

      window.addEventListener("scroll", debounce(getDataToBottom));
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", debounce(getDataToBottom));
    });

    return () =>
      h("div", { class: "page blog" }, [
        h("div", { class: "home-bg" }, [
          h(
            "div",
            { class: "home-bg-blank-screens", ref: screensRef },
            currentArticles.value.map((ite, index) =>
              h(DropTransition, { appear: true, delay: index * 0.04 }, () =>
                h("div", {
                  class: "home-bg-blank-screen",
                  appear: true,
                  delay: index * 0.04,
                  style:
                    index > 6
                      ? [
                          `top: ${(index - 6) * 14.44 + 50}%;`,
                          index % 2 === 1
                            ? `left:${Math.random() * 30 + 10}%`
                            : `right:${Math.random() * 30 + 10}%`,
                        ]
                      : "",
                })
              )
            )
          ),
        ]),
        h(BlogHero),
        h("div", { class: "blog-page-wrapper" }, [
          h("main", { class: "blog-home", id: "main-content" }, [
            h(DropTransition, { appear: true, delay: 0.16 }, () =>
              h(ProjectPanel)
            ),
            h(DropTransition, { appear: true, delay: 0.24 }, () =>
              h(ArticleList, {
                items: currentArticles.value,
                screensRef: screensRef.value,
              })
            ),
          ]),
          h(DropTransition, { appear: true, delay: 0.16 }, () => h(InfoPanel)),
        ]),
        h(DropTransition, { appear: true, delay: 0.28 }, () =>
          h(MarkdownContent)
        ),
      ]);
  },
});
//# sourceMappingURL=BlogHome.js.map
