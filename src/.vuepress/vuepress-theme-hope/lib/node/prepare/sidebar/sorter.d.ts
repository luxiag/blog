import type { HopeThemeSidebarInfo, HopeThemeSidebarSorter, HopeThemeSidebarSorterFunction } from "../../../shared/index.js";
export declare const readmeSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const orderSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const dateSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const dateDescSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const filenameSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const fileNumberSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const fileNumberDescSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const titleSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const titleNumberSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const titleNumberDescSorter: (infoA: HopeThemeSidebarInfo, infoB: HopeThemeSidebarInfo) => number;
export declare const getSorter: (sorter?: HopeThemeSidebarSorter) => HopeThemeSidebarSorterFunction[];
