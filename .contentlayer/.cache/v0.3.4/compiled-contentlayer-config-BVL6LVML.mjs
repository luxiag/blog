// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import readingTime from "reading-time";
var BlogPost = defineDocumentType(
  (r) => r.name("BlogPost").filePathPattern("**/*.md").fields({
    title: {
      type: "string",
      required: true
    },
    date: {
      type: "date",
      required: true
    },
    excerpt: {
      type: "string"
    },
    coverImage: {
      type: "string"
    },
    author: {
      type: "object",
      fields: {
        name: { type: "string" },
        picture: { type: "string" }
      }
    },
    tags: {
      type: "list",
      of: { type: "string" }
    }
  }).computedFields({
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.md$/, "")
    },
    readingTime: {
      type: "string",
      resolve: (doc) => {
        const stats = readingTime(doc.body.raw);
        return stats.text;
      }
    }
  })
);
var contentlayer_config_default = makeSource({
  contentDirPath: "content/posts",
  documentTypes: [BlogPost],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeHighlight, { ignoreMissing: true }]
    ]
  }
});
export {
  BlogPost,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-BVL6LVML.mjs.map
