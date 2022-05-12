const timestamp = () => new Date().toISOString();

export default {
    log: (namespace: string, message: string, data?: any) => {
        if (data) console.log(`[${timestamp()}] [LOG] [${namespace}] ${message}`, data);
        else console.log(`[${timestamp()}] [LOG] [${namespace}] ${message}`);
    },
    info: (namespace: string, message: string, data?: any) => {
        if (data) console.info(`[${timestamp()}] [INFO] [${namespace}] ${message}`, data);
        else console.info(`[${timestamp()}] [INFO] [${namespace}] ${message}`);
    },
    warn: (namespace: string, message: string, data?: any) => {
        if (data) console.warn(`[${timestamp()}] [WARN] [${namespace}] ${message}`, data);
        else console.warn(`[${timestamp()}] [WARN] [${namespace}] ${message}`);
    },
    error: (namespace: string, message: string, data?: any) => {
        if (data) console.error(`[${timestamp()}] [ERROR] [${namespace}] ${message}`, data);
        else console.error(`[${timestamp()}] [ERROR] [${namespace}] ${message}`);
    },
    debug: (namespace: string, message: string, data?: any) => {
        if (data) console.error(`[${timestamp()}] [DEBUG] [${namespace}] ${message}`, data);
        else console.error(`[${timestamp()}] [DEBUG] [${namespace}] ${message}`);
    }
}