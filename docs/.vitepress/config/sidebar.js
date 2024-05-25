// 左边侧栏导航
export default {
  "/": [
    { text: "markdown图标", link: "/order/markdown图标" },
    {
      text: "😇前端面试相关",
      collapsible: true, // 可折叠
      collapsed: true, // 初始不折叠
      items: [
        {
          text: "【面试准备和如何面试】",
          collapsible: true, // 可折叠
          collapsed: true, // 初始不折叠
          items: [
            {
              text: "职业规划和面试技巧",
              link: "/Document/前端面试相关/【面试准备和如何面试】/职业规划和面试技巧"
            },
            {
              text: "面试准备和技巧",
              link: "/Document/前端面试相关/【面试准备和如何面试】/面试准备和技巧"
            },
            {
              text: "前端工程师简历怎么写",
              link: "/Document/前端面试相关/【面试准备和如何面试】/前端工程师简历怎么写"
            },
            {
              text: "面试流程和面试经验",
              link: "/Document/前端面试相关/【面试准备和如何面试】/面试流程和面试经验",
            },
            {
              text: "面试刷题网站",
              link: "/Document/前端面试相关/【面试准备和如何面试】/面试刷题网站"
            },
            {
              text: "模拟面试",
              link: "/Document/前端面试相关/【面试准备和如何面试】/模拟面试"
            },
            {
              text: "别人的面试总结",
              link: "/Document/前端面试相关/【面试准备和如何面试】/别人的面试总结"
            },
          ]
        },

        {
          text: "【前端面试题】",
          collapsible: true, // 可折叠
          collapsed: true, // 初始不折叠
          items: [
            {
              text: "掘金面试相关题或文章",
              link: "/Document/前端面试相关/【前端面试题】/掘金面试相关题或文章"
            },
            {
              text: "开源面试题",
              link: "/Document/前端面试相关/【前端面试题】/开源面试题"
            },
            {
              text: "计算机基础面试题",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "编译原理面试题",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/编译原理面试题"
                },
                {
                  text: "操作系统面试题",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/操作系统面试题"
                },
                {
                  text: "计算机组成原理",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/计算机组成原理"
                },
                {
                  text: "计算机网络面试题",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/计算机网络面试题"
                },
                {
                  text: "网络安全面试题",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/网络安全面试题"
                },
                {
                  text: "JS设计模式面试题",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/JS设计模式面试题"
                },
                {
                  text: "JS数据结构和算法",
                  link: "/Document/前端面试相关/【前端面试题】/计算机基础面试题/JS数据结构和算法"
                },
              ]
            },
            {
              text: "【其他面试题】",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "前端工程能力面试题",
                  link: "/Document/前端面试相关/【前端面试题】/【其他面试题】/前端工程能力面试题"
                },
                {
                  text: "前端实际项目业务的实现问题",
                  link: "/Document/前端面试相关/【前端面试题】/【其他面试题】/前端实际项目业务的实现问题"
                },
                {
                  text: "前端性能优化面试题",
                  link: "/Document/前端面试相关/【前端面试题】/【其他面试题】/前端性能优化面试题"
                },
                {
                  text: "项目设计和开发工作流的面试题",
                  link: "/Document/前端面试相关/【前端面试题】/【其他面试题】/项目设计和开发工作流的面试题"
                },
                {
                  text: "SEO相关面试题",
                  link: "/Document/前端面试相关/【前端面试题】/【其他面试题】/SEO相关面试题"
                },
              ]
            },
            {
              text: "JS和浏览器原理面试题",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "浏览器工作原理和面试题",
                  link: "/Document/前端面试相关/【前端面试题】/JS和浏览器原理面试题/浏览器工作原理和面试题",
                },
                {
                  text: "JavaScript引擎运行原理",
                  link: "/Document/前端面试相关/【前端面试题】/JS和浏览器原理面试题/JavaScript引擎运行原理",
                },
              ],
            },
            {
              text: "CSS和HTML面试题",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "HTML面试题",
                  link: "/Document/前端面试相关/【前端面试题】/CSS和HTML面试题/HTML面试题",
                },
                {
                  text: "CSS面试题",
                  link: "/Document/前端面试相关/【前端面试题】/CSS和HTML面试题/CSS面试题",
                },
                {
                  text: "Web开发面试题",
                  link: "/Document/前端面试相关/【前端面试题】/CSS和HTML面试题/Web开发面试题",
                },
                {
                  text: "移动Web开发",
                  link: "/Document/前端面试相关/【前端面试题】/CSS和HTML面试题/移动Web开发",
                },
              ],
            },
            {
              text: "JavaScript面试题",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "JavaScript面试题",
                  link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript面试题",
                },
                {
                  text: "JavaScript基础面试题",
                  link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript基础面试题",
                },
                {
                  text: "JavaScript高级面试题",
                  link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript高级面试题",
                },
                {
                  text: "JavaScript手写题",
                  collapsible: true,
                  collapsed: true,
                  items: [
                    {
                      text: "手写实现JS常用方法",
                      link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写实现JS常用方法",
                    },
                    {
                      text: "手写实现JS底层方法",
                      link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写实现JS底层方法",
                    },
                    {
                      text: "手写Promise",
                      link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写Promise",
                    },
                    {
                      text: "手写CSS预处理器",
                      link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写CSS预处理器",
                    },
                    {
                      text: "手写实现工具",
                      link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/JavaScript手写题/手写实现工具",
                    },
                  ]
                },
                {
                  text: "Typescript面试题",
                  link: "/Document/前端面试相关/【前端面试题】/JavaScript面试题/Typescript面试题"
                },
              ],
            },
            
            {
              text: "框架相关面试题",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "Vue面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/Vue面试题",
                },
                {
                  text: "Vue原理面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/Vue原理面试题",
                },
                {
                  text: "微信小程序开发面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/微信小程序开发面试题"
                },
                {
                  text: "React面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/React面试题",
                },
                
                {
                  text: "Angular面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/Angular面试题",
                },
                {
                  text: "JQuery面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/JQuery面试题",
                },
                {
                  text: "桌面端跨平台框架面试题",
                  link: "/Document/前端面试相关/【前端面试题】/框架相关面试题/桌面端跨平台框架面试题"
                },
              ],
            },
            {
              text: "NodeJS面试题",
              collapsible: true,
              collapsed: true,
              items: [
                {
                  text: "NodeJS面试题",
                  link: "/Document/前端面试相关/【前端面试题】/NodeJS面试题/NodeJS面试题",
                },
                {
                  text: "Node项目工程化面试题",
                  link: "/Document/前端面试相关/【前端面试题】/NodeJS面试题/Node项目工程化面试题",
                },
                {
                  text: "服务端编程面试题",
                  link: "/Document/前端面试相关/【前端面试题】/NodeJS面试题/服务端编程面试题",
                },
                {
                  text: "Node原理面试题",
                  link: "/Document/前端面试相关/【前端面试题】/NodeJS面试题/Node原理面试题",
                },
              ],
            },
          ]
        },
      ]
    }
  ]
}
