/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logToConsole = true;
  private logToService = process.env.NODE_ENV === 'production';
  
  private formatMessage(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };
  }
  
  private sendToService(entry: LogEntry): void {
    // In production, send logs to a service like Sentry, Datadog, etc.
    if (this.logToService) {
      // TODO: Implement log service integration
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      }).catch(error => {
        console.error('Failed to send log to service:', error);
      });
    }
  }
  
  private log(level: LogLevel, message: string, context?: any): void {
    const entry = this.formatMessage(level, message, context);
    
    // Console logging
    if (this.logToConsole) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
      const reset = '\x1b[0m';
      
      console[consoleMethod](
        `${color}[${entry.timestamp}] [${level.toUpperCase()}]${reset} ${message}`,
        context || ''
      );
    }
    
    // Service logging
    this.sendToService(entry);
  }
  
  debug(message: string, context?: any): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }
  
  info(message: string, context?: any): void {
    this.log('info', message, context);
  }
  
  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }
  
  error(message: string, error?: Error | any, context?: any): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    };
    
    this.log('error', message, errorContext);
  }
  
  // Performance logging
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }
  
  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }
  
  // Group logging
  group(label: string): void {
    if (this.isDevelopment && this.logToConsole) {
      console.group(label);
    }
  }
  
  groupEnd(): void {
    if (this.isDevelopment && this.logToConsole) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// React hook for component logging
export const useLogger = (componentName: string) => {
  return {
    debug: (message: string, context?: any) => 
      logger.debug(`[${componentName}] ${message}`, context),
    info: (message: string, context?: any) => 
      logger.info(`[${componentName}] ${message}`, context),
    warn: (message: string, context?: any) => 
      logger.warn(`[${componentName}] ${message}`, context),
    error: (message: string, error?: Error | any, context?: any) => 
      logger.error(`[${componentName}] ${message}`, error, context)
  };
};