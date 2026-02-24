import log, {type Logger} from "loglevel";

export type LoggerWrapper = {
	error: (fn: string, data?: Record<string, any>, msg?: string, err?: Error) => void;
	warn: (fn: string, data?: Record<string, any>, msg?: string) => void;
	info: (fn: string, data?: Record<string, any>, msg?: string) => void;
	debug: (fn: string, data?: Record<string, any>, msg?: string) => void;
	trace: (fn: string, data?: Record<string, any>, msg?: string) => void;
	devModuleLogger?: log.Logger | undefined;
};

export function createLogger(moduleName: string): LoggerWrapper {
	const devModuleLogger: log.Logger = log.getLogger(moduleName);
	devModuleLogger.setLevel("debug");
	return {
		devModuleLogger,
		error(fn: string, data?: Record<string, any>, msg?: string, err?: Error) {
			if (this.devModuleLogger) this.devModuleLogger.error(`[${new Date().toISOString()}] [${moduleName}] [${fn}] ${msg || err?.message || ""}`, data || {});
		},
		warn(fn: string, data?: Record<string, any>, msg?: string) {
			if (this.devModuleLogger) this.devModuleLogger.warn(`[${new Date().toISOString()}] [${moduleName}] [${fn}] ${msg || ""}`, data || {});
		},
		info(fn: string, data?: Record<string, any>, msg?: string) {
			if (this.devModuleLogger) this.devModuleLogger.info(`[${new Date().toISOString()}] [${moduleName}] [${fn}] ${msg || ""}`, data || {});
		},
		debug(fn: string, data?: Record<string, any>, msg?: string) {
			if (this.devModuleLogger) this.devModuleLogger.debug(`[${new Date().toISOString()}] [${moduleName}] [${fn}] ${msg || ""}`, data || {});
		},
		trace(fn: string, data?: Record<string, any>, msg?: string) {
			if (this.devModuleLogger) this.devModuleLogger.trace(`[${new Date().toISOString()}] [${moduleName}] [${fn}] ${msg || ""}`, undefined);
		},
	};
}
