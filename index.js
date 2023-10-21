import process from 'process';

import { initZteF50, stopZteF50 } from './devices/zte-f50.js';
import { printClear, printInfo, printWarn } from './utils/logger.js';
import { initMailer, sendTestEmail } from './utils/mailer.js';

/** 退出程序 */
function exit() {
  stopZteF50();
  process.stdin.destroy();
  process.exit();
}

const handlers = {
  'exit': exit,
  'send-test': sendTestEmail,
};

process.stdin.on('data', function (data) {

  /** 输入内容：`命令,参数 1,参数 2,...` */
  let inputs = String(data).replace(/(\n|\r)/g, '').split(',');

  /** @type {keyof handlers} */
  let command = inputs[0];
  let params = inputs.slice(1);

  printInfo('输入信息', { command, params });

  let handler = handlers[command];

  if (handler) {
    handler.apply(null, params);
  } else {
    printWarn('命令不存在，可用的命令：');
    printWarn(Object.keys(handlers).join(', '));
  }

});

// 清屏
printClear();

// 显示命令列表
printInfo('服务已启动，可用的命令：');
printInfo(Object.keys(handlers).join(', '));

// 初始化
initMailer();
initZteF50();
