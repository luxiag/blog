"use client";

// 日志级别
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// 从环境变量获取日志级别
function getLogLevel(): LogLevel {
  if (typeof window === "undefined") return LogLevel.DEBUG; // 服务器端默认调试级别
  
  const level = process.env.NEXT_PUBLIC_LOG_LEVEL?.toLowerCase();
  switch (level) {
    case 'debug': return LogLevel.DEBUG;
    case 'info': return LogLevel.INFO;
    case 'warn': return LogLevel.WARN;
    case 'error': return LogLevel.ERROR;
    default: return process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }
}

// 日志配置
const logConfig = {
  level: getLogLevel(),
  enableConsole: process.env.NEXT_PUBLIC_LOG_CONSOLE !== 'false',
};

// 格式化日志消息
function formatMessage(message: string, data?: any): string {
  if (data) {
    try {
      return `${message} ${JSON.stringify(data, null, 2)}`;
    } catch (e) {
      return `${message} [无法序列化数据]`;
    }
  }
  return message;
}

// 日志记录函数
function log(level: LogLevel, levelName: string, message: string, data?: any) {
  if (level < logConfig.level) return;

  const formattedMessage = formatMessage(message, data);
  const timestamp = new Date().toISOString();
  const prefixedMessage = `[${timestamp}] [${levelName}] ${formattedMessage}`;

  // 控制台输出
  if (logConfig.enableConsole) {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefixedMessage);
        break;
      case LogLevel.INFO:
        console.info(prefixedMessage);
        break;
      case LogLevel.WARN:
        console.warn(prefixedMessage);
        break;
      case LogLevel.ERROR:
        console.error(prefixedMessage);
        break;
    }
  }
}

// 导出日志函数
export const clientLogger = {
  debug: (message: string, data?: any) => log(LogLevel.DEBUG, 'DEBUG', message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, 'INFO', message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, 'WARN', message, data),
  error: (message: string, data?: any) => log(LogLevel.ERROR, 'ERROR', message, data),
};

// 默认导出
export default clientLogger;
