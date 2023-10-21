import chalk from 'chalk';

const COLORS = {
  DEBUG: chalk.whiteBright.bgGray,
  ERROR: chalk.whiteBright.bgRed,
  INFO: chalk.whiteBright.bgCyan,
  WARN: chalk.whiteBright.bgYellow,
};

export function getTime() {
  let date = new Date();
  let h = date.getHours().toString().padStart(2, '0');
  let m = date.getMinutes().toString().padStart(2, '0');
  let s = date.getSeconds().toString().padStart(2, '0');
  return `[${h}:${m}:${s}]`;
}

export function printClear() {
  console.clear();
}

export function printLine(chars = 10) {
  console.info('-'.repeat(chars));
}

export function printDebug() {
  console.debug(COLORS.DEBUG('[D]'), COLORS.DEBUG(getTime()), ...arguments);
}

export function printError() {
  console.error(COLORS.ERROR('[E]'), COLORS.ERROR(getTime()), ...arguments);
}

export function printInfo() {
  console.info(COLORS.INFO('[I]'), COLORS.INFO(getTime()), ...arguments);
}

export function printWarn() {
  console.warn(COLORS.WARN('[W]'), COLORS.WARN(getTime()), ...arguments);
}
