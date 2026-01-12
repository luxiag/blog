
import fs from 'fs';
import path from 'path';

// 日志级别
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// 从环境变量获取日志级别
function getLogLevel(): LogLevel {
  const level = process.env.LOG_LEVEL?.toLowerCase();
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
  enableConsole: process.env.LOG_CONSOLE !== 'false',
  enableFile: process.env.LOG_FILE !== 'false',
  logFile: process.env.LOG_FILE_PATH 
    ? path.join(process.cwd(), process.env.LOG_FILE_PATH)
    : path.join(process.cwd(), 'logs', 'app.log'),
  maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || '5242880'), // 默认5MB
  maxFiles: parseInt(process.env.LOG_MAX_FILES || '3'), // 默认保留3个日志文件
};

// 确保日志目录存在
function ensureLogDirectory() {
  const logDir = path.dirname(logConfig.logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// 日志轮转
function rotateLog() {
  try {
    if (fs.existsSync(logConfig.logFile)) {
      const stats = fs.statSync(logConfig.logFile);
      if (stats.size > logConfig.maxFileSize) {
        // 轮转日志文件
        for (let i = logConfig.maxFiles - 1; i > 0; i--) {
          const oldFile = `${logConfig.logFile}.${i}`;
          const newFile = `${logConfig.logFile}.${i + 1}`;
          if (fs.existsSync(oldFile)) {
            if (i === logConfig.maxFiles - 1) {
              fs.unlinkSync(oldFile);
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        fs.renameSync(logConfig.logFile, `${logConfig.logFile}.1`);
      }
    }
  } catch (error) {
    console.error('日志轮转失败:', error);
  }
}

// 写入日志到文件
function writeToFile(level: string, message: string, data?: any) {
  try {
    ensureLogDirectory();
    rotateLog();

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };

    fs.appendFileSync(logConfig.logFile, `${JSON.stringify(logEntry)}
`);
  } catch (error) {
    console.error('写入日志文件失败:', error);
  }
}

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

  // 控制台输出
  if (logConfig.enableConsole) {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  // 文件输出
  if (logConfig.enableFile) {
    writeToFile(levelName, message, data);
  }
}

// 导出日志函数
export const logger = {
  debug: (message: string, data?: any) => log(LogLevel.DEBUG, 'DEBUG', message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, 'INFO', message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, 'WARN', message, data),
  error: (message: string, data?: any) => log(LogLevel.ERROR, 'ERROR', message, data),
};

// 默认导出
export default logger;
