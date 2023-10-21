import { createTransport } from 'nodemailer';
import { printDebug, printError, printInfo, printLine } from './logger.js';
import { DEBUG_CONFIG, EMAIL_CONFIG } from '../config.js';

const {
  SEND_EMAIL,
} = DEBUG_CONFIG;

const {
  FROM_EMAIL, FROM_NAME, TO_EMAIL, TO_NAME,
} = EMAIL_CONFIG;

let isReady = false;

let transporter = createTransport({
  auth: {
    type: 'LOGIN',
    user: EMAIL_CONFIG.AUTH_USER,
    pass: EMAIL_CONFIG.AUTH_PASS,
  },
  host: EMAIL_CONFIG.HOST,
  port: EMAIL_CONFIG.PORT,
  secure: EMAIL_CONFIG.SECURE,
}, {
  from: (FROM_NAME ? `${FROM_NAME} <${FROM_EMAIL}>` : FROM_EMAIL),
  to: (TO_NAME ? `${TO_NAME} <${TO_EMAIL}>` : TO_EMAIL),
});

/** 初始化，检测配置信息 */
export function initMailer() {
  if (SEND_EMAIL) {
    return transporter.verify().then((success) => {
      if (success) {
        printInfo('邮件配置正常');
        isReady = true;
        return true;
      } else {
        printError('邮件配置错误');
        return false;
      }
    }).catch((error) => {
      printError('邮件配置异常：');
      printError(error);
      return false;
    });
  } else {
    printDebug('当前已关闭邮件发送，跳过邮件配置检测');
    isReady = true;
    return Promise.resolve(true);
  }
}

/**
 * @description 发送邮件
 * @param {string} title   邮件标题
 * @param {string} content HTML 内容
 */
export function sendMail(title = '新的信息', content = '') {

  if (!isReady) {
    printError('邮件发送失败：未初始化');
    return Promise.resolve(false);
  }

  printLine();
  printInfo('发送邮件');
  printInfo('标题：' + title);
  printInfo('内容：' + content);
  printLine();

  if (SEND_EMAIL) {
    return transporter.sendMail({
      subject: title,
      html: content,
    }).then((result) => {
      printInfo('邮件已发送：');
      printInfo({
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
        envelope: result.envelope,
      });
      return true;
    }).catch((error) => {
      printError('邮件发送失败：');
      printError(error);
      return false;
    });
  } else {
    printDebug('当前已关闭邮件发送');
    return Promise.resolve(true);
  }

}

/** 发送测试邮件 */
export function sendTestEmail() {
  let content = '<p>这是一封测试邮件。</p>';
  return sendMail('测试邮件', content);
}
