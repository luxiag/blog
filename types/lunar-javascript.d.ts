declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }
  export class Lunar {
    getDayInChinese(): string;
    getMonthInChinese(): string;
    getFestivals(): string[];
    getJieQi(): string;
    getYearShengXiao(): string;
  }
}
