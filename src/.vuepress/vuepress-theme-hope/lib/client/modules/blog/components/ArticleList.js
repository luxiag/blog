import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  watch,
  onUnmounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import ArticleItem from "@theme-hope/modules/blog/components/ArticleItem.js";
import Pagination from "@theme-hope/modules/blog/components/Pagination.js";
import DropTransition from "@theme-hope/components/transitions/DropTransition.js";
import { EmptyIcon } from "@theme-hope/modules/blog/components/icons/index.js";
import { useBlogOptions } from "@theme-hope/modules/blog/composables/index.js";
import "../styles/article-list.scss";
export default defineComponent({
  name: "ArticleList",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    // 原理的更新
    const blogOptions = useBlogOptions();
    const currentPage = ref(1);
    const articlePerPage = computed(
      () => blogOptions.value.articlePerPage || 10
    );
    // const currentArticles = computed(() =>
    //   props.items.slice(
    //     (currentPage.value - 1) * articlePerPage.value,
    //     currentPage.value * articlePerPage.value
    //   )
    // );
    const currentArticles = computed(() =>
      props.items.slice(0, currentPage.value * articlePerPage.value)
    );
    const updatePage = (page) => {
      currentPage.value = page;
      const query = { ...route.query };
      if (query["page"] === page.toString() || (page === 1 && !query["page"]))
        return;
      if (page === 1) delete query["page"];
      else query["page"] = page.toString();
      void router.push({ path: route.path, query });
    };
    // watch(currentPage, () => {
    //   // list top border distance
    //   const distance =
    //     document.querySelector("#article-list").getBoundingClientRect().top +
    //     window.scrollY;
    //   setTimeout(() => {
    //     window.scrollTo(0, distance);
    //   }, 100);
    // });
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
        if (props.items.length > currentArticles.value.length) {
          currentPage.value++;
        }
      }
      // console.log('getDataToBottom',scrollTop+windowHeight,scrollHeight)
    };
    onMounted(() => {
    //   const { page } = route.query;
    //   updatePage(page ? Number(page) : 1);
        console.log(props,'props')
      window.addEventListener("scroll", debounce(getDataToBottom));
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", debounce(getDataToBottom));
    });
    return () =>
      h(
        "div",
        { id: "article-list", class: "article-wrapper" },
        currentArticles.value.length
          ? [
              ...currentArticles.value.map(({ info, path }, index) =>
                h(DropTransition, { appear: true, delay: index * 0.04 }, () =>
                  h(ArticleItem, { key: path, info, path })
                )
              ),
              // h(Pagination, {
              //     currentPage: currentPage.value,
              //     perPage: articlePerPage.value,
              //     total: props.items.length,
              //     onUpdateCurrentPage: updatePage,
              // }),
            ]
          : h(EmptyIcon)
      );
  },
});
//# sourceMappingURL=ArticleList.js.map
