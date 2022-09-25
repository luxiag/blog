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
    logo: '/images/logo.png',
    sidebarDepth: 5,
    sidebar: "auto",
    lastUpdated: false,
    lastUpdatedText: '',
    contributors: false,
    colorModeSwitch:false,
    repo:'https://github.com/luxiag/luxiag.github.io',
    
    


})