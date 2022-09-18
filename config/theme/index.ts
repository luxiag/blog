import { defaultTheme } from '../theme-default/lib/node'

export default defaultTheme({
    navbar: [
        {
            text: '博客',
            link: '/'
        },
        {
            text: '时间线',
            link: '/timeline'
        },
        {
            text: "Category",
            link: "/category/",
        },
    ],
    sidebarDepth: 5,
    sidebar: "auto",
    lastUpdated: false,
    lastUpdatedText: '',
    contributors: false


})