---
# 文档：https://vitepress.vuejs.org/config/frontmatter-configs

layout: home

title: 牧涯前端面试题整合
titleTemplate: 收集整合前端面试题，前端面试题大全

hero:
  name: 前端面试题收集整合
  text: 后浪卷前浪
  tagline: "不进则退"
  # 首页右边Logo设置
  # image:
  #   src: /logo.png
  #   alt: logo
  actions:
    - theme: brand
      text: 查看笔记
      link: /order/markdown图标
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/muyaCode/FrontEndInterviewQuestion

features:
  - icon: 💡
    title: 计算机基础面试题
    details: 包括：
  - icon: 📦
    title: CSS和HTML面试题
    details: 包括：
  - icon: 🛠️
    title: JavaScript面试题
    details: 包括：
  - icon: 🎁
    title: JavaScript和浏览器原理面试题
    details: 包括：
  - icon: ☀️
    title: 主流框架相关面试题
    details: 包括：Vue、React、JQuery...
  - icon: 💝
    title: Node面试题
    details: 包括：基础Node API、Node后端、脚本、脚手架，等
  - icon: 💎
    title: 其他面试题
    details: 包括：前端工程化、前端构建工具

  - icon: 🌟
    title: 开源面试题收集
    details: 包括：
---

<!-- 文档：https://vitepress.vuejs.org/config/frontmatter-configs#layout -->
<!-- 表情：https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json -->

<style>
  /*首页标题 覆盖变量 自定义字体渐变样式*/
  :root {
    --vp-home-hero-name-color: transparent;
    --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
  }
</style>

<!-- 团队成员显示 -->
<!-- <script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/yyx990803.png',
    name: 'Evan You',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/yyx990803' },
      { icon: 'twitter', link: 'https://twitter.com/youyuxi' }
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      我们的团队
    </template>
    <template #lead>
      各个成员来着....
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="members" />
</VPTeamPage> -->
