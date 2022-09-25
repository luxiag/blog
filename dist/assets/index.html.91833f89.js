import{_ as e,o as t,c as n,a as i}from"./app.a393d442.js";const o={};function r(s,l){return t(),n("div",null,[i(` <div v-for="ite in list">{{ite}}</div>
<script setup lang="ts">
import {onMounted,ref} from 'vue';
import { useBlogType } from "vuepress-plugin-blog2/client";
const articles = useBlogType("article");
const list = ref([])
onMounted(()=>{
  list.value = article.value.items.filter(ite => ite.page)
})
<\/script> `)])}const a=e(o,[["render",r],["__file","index.html.vue"]]);export{a as default};
