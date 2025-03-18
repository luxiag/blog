```vue
<template>
  <div ref="boxRef"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createEditor,IDomEditor } from '@wangeditor/editor'

const boxRef = ref(null)
const editorRef = shallowRef<null | IDomEditor>(null)

const initEditor = () => {
  if(!boxRef.value) return
  createEditor({
    selector: boxRef.value,
    content: '',
    html: '',
    config: {
      onCreated(editor){
        editorRef.value = editor
      },
      onChange(editor){
        const editorHtml = editor.getHtml()
      },
      onDestroyed(editor){
        
      },
      onMaxLength(editor){

      },
      onFocus(editor){

      },
      onBlur(editor){

      },
      customAlert(info, type){
        alert(`${info}`)
      },
      customPaste(event, editor, htmlText, plainText){
        // 自定义粘贴处理
      }
    }
  })
}

</script>
```

`createEditor`
```ts
export function createEditor(option: Partial<ICreateEditorOption> = {}): IDomEditor {
  const { selector = '', content = [], html, config = {}, mode = 'default' } = option

  let globalConfig = mode === 'simple' ? Boot.simpleEditorConfig : Boot.editorConfig

  // 单独处理 hoverbarKeys
  const newHoverbarKeys = {
    ...(globalConfig.hoverbarKeys || {}),
    ...(config.hoverbarKeys || {}),
  }

  const editor = coreCreateEditor({
    selector,
    config: {
      ...globalConfig, // 全局配置
      ...config,
      // 配置编辑器的 hoverbar 菜单。
      hoverbarKeys: newHoverbarKeys,
    },
    content,
    html,
    plugins: Boot.plugins,
  })

  return editor
}
```
