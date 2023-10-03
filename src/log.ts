import chalk from 'chalk';


export const log = {
    info: (message: string) => console.log(`[${Date.now()}] ${chalk.yellow("BullMQ Benchmark:")} ${chalk.cyan(message)}`),
    error: (message: string) => console.error(`[${Date.now()}] ${chalk.yellow("BullMQ Benchmark:")} ${chalk.red(message)}`),
    warn: (message: string) => console.warn(`[${Date.now()}] ${chalk.yellow("BullMQ Benchmark:")} ${chalk.yellow(message)}`),
    debug: (message: string) => console.debug(`[${Date.now()}] ${chalk.yellow("BullMQ Benchmark:")} ${chalk.gray(message)}`),
    success: (message: string) => console.log(`[${Date.now()}] ${chalk.yellow("BullMQ Benchmark:")} ${chalk.green(message)}`),
    title: (message: string) => console.log(`[${Date.now()}] ${chalk.yellow("BullMQ Benchmark:")} ${chalk.bold(message)}`),
};
