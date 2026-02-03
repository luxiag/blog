
import * as fs from 'fs';
import * as path from 'path';

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
    const callerFile = getCallerFile();
    const errorFile = extractFileFromError(data);
    
    const logEntry: any = {
      timestamp,
      level,
      callerFile,
      message,
    };
    
    // 如果有错误文件信息，单独记录
    if (errorFile) {
      logEntry.errorFile = errorFile;
    }
    
    // 添加错误位置信息
    if (data?.line || data?.column) {
      logEntry.location = {
        line: data.line,
        column: data.column
      };
    }
    
    if (data) {
      logEntry.data = data;
    }

    fs.appendFileSync(logConfig.logFile, `${JSON.stringify(logEntry)}
`);
  } catch (error) {
    console.error('写入日志文件失败:', error);
  }
}

// 获取调用者文件名
function getCallerFile(): string {
  try {
    const err = new Error();
    const stack = err.stack || '';
    // 跳过 Error 构造函数和 logger 内部函数，找到实际调用者
    const lines = stack.split('\n');
    // 从第4行开始查找（跳过 Error、getCallerFile、log、logger.xxx）
    for (let i = 4; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/at\s+(?:.*?\s+)?\(?(.+?):\d+:\d+\)?$/);
      if (match) {
        const fullPath = match[1];
        // 提取文件名（不包含路径）
        const fileName = path.basename(fullPath);
        // 如果是 node_modules 或 logger.ts 本身，继续查找
        if (fileName.includes('node_modules') || fileName === 'logger.ts') {
          continue;
        }
        return fileName;
      }
    }
    return 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

// 从错误对象中提取文件信息
function extractFileFromError(data: any): string | null {
  if (!data) return null;
  
  // MDX 编译错误通常有 file/line/column 信息
  if (data.file && typeof data.file === 'string') {
    return data.file;
  }
  
  // 检查 message 中是否包含文件路径
  if (data.message && typeof data.message === 'string') {
    const fileMatch = data.message.match(/(?:in|at)\s+([\w\-./\\]+\.(?:mdx?|tsx?|jsx?|ts|js))/i);
    if (fileMatch) return fileMatch[1];
  }
  
  // 检查 stack trace
  if (data.stack && typeof data.stack === 'string') {
    const lines = data.stack.split('\n');
    for (const line of lines) {
      const match = line.match(/\s*at\s+.*\s*\(?(.+?):\d+:\d+\)?/);
      if (match) {
        const filePath = match[1];
        // 排除 node_modules 和内部文件
        if (!filePath.includes('node_modules') && !filePath.includes('logger.ts')) {
          return path.basename(filePath);
        }
      }
    }
  }
  
  return null;
}

// 格式化日志消息
function formatMessage(message: string, data?: any): string {
  const callerFile = getCallerFile();
  const errorFile = extractFileFromError(data);
  
  // 如果有错误相关的文件信息，优先显示
  const prefix = errorFile && errorFile !== callerFile 
    ? `[${callerFile}] [错误文件: ${errorFile}]`
    : `[${callerFile}]`;
    
  if (data) {
    try {
      // 对于 MDX 错误，添加行号信息
      if (data.line || data.column) {
        const location = `Line ${data.line || '?'}:${data.column || '?'}`;
        return `${prefix} ${message} (${location}) ${JSON.stringify(data, null, 2)}`;
      }
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    } catch (e) {
      return `${prefix} ${message} [无法序列化数据]`;
    }
  }
  return `${prefix} ${message}`;
}

// 日志记录函数
function log(level: LogLevel, levelName: string, message: string, data?: any) {
  if (level < logConfig.level) return;
  try {
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
  } catch (error) {
    console.error('日志记录失败:', error);
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
