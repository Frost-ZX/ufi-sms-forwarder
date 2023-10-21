import { COMMON_CONFIG } from '../config.js';
import { printError, printInfo } from '../utils/logger.js';
import { sendMail } from '../utils/mailer.js';
import { handleResponse, request } from '../utils/request.js';

/**
 * @typedef  MessageItem
 * @property {string} content
 * @property {string} date
 * @property {string} draft_group_id
 * @property {string} id
 * @property {string} number
 * @property {string} tag
 */

/** 请求基础地址 */
let apiBase = `http://${COMMON_CONFIG.DEVICE_IP}`;

/** GET 请求接口地址 */
let apiGetUrl = `${apiBase}/goform/goform_get_cmd_process`;

/** 轮询定时器 */
let fetchTimer = null;

/** 接口请求头 */
let reqHeaders = {
  accept: 'application/json, text/javascript, */*; q=0.01',
  // cookie: 'JSESSIONID=<JSESSIONID>',
  Referer: `${apiBase}/index.html`,
};

/**
 * @desc 已处理的短信 ID 列表
 * @type {string[]}
 */
let usedMsgIds = [];

/** 获取短信列表 */
function getMessageList() {

  /** @type {MessageItem[]} */
  let messages = [];

  return request({
    baseURL: apiBase,
    method: 'get',
    headers: reqHeaders,
    params: {
      cmd: 'sms_data_total',
      data_per_page: 10,
      isTest: false,
      mem_store: 1,
      order_by: 'order by id desc',
      page: 0,
      tags: '1', // 1：未读，10：全部
    },
    url: apiGetUrl,
  }).then((res) => {

    let resData = handleResponse(res, { messages: [] });

    // 更新列表
    // 注：短信列表为空时，`messages` 可能为字符串
    if (Array.isArray(resData.messages)) {
      messages = resData.messages;
    }

    // 处理数据，解析时间和内容
    messages.forEach((item) => {
      let date = item.date.split(',');
      let dateStr = `${date[0]}-${date[1]}-${date[2]} ${date[3]}:${date[4]}:${date[5]} (${date[6]})`;
      let text = Buffer.from(item.content, 'base64').toString();
      item.content = text;
      item.date = dateStr;
    });

    return messages;

  }).catch((error) => {
    printError('请求短信列表接口失败：');
    printError(error);
    return messages;
  });
}

/**
 * @description 解析短信列表，发送邮件
 * @param {boolean} isInit 是否为初始化，仅记录 ID
 */
function parseMessageList(isInit = false) {
  return getMessageList().then((list) => {

    let newMsgIds = []
    let newMsgList = [];

    // 提取需要发送邮件的短信列表
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let id = item.id;
      if (!usedMsgIds.includes(id)) {
        newMsgIds.push(id);
        newMsgList.push(item);
      }
    }

    // 没有需要处理的短信
    if (newMsgIds.length === 0) {
      return Promise.resolve(true);
    }

    // 初始化，仅记录 ID
    if (isInit) {
      printInfo('跳过已有短信', newMsgIds);
      usedMsgIds.push.apply(usedMsgIds, newMsgIds);
      return Promise.resolve(true);
    }

    let emailTitle = 'ZTE F50 接收到新的短信';
    let emailText = '';
    let lines = [];

    // 生成邮件内容
    newMsgList.forEach((item) => {
      let line = `<h4>来自：${item.number}<br>时间：${item.date}</h4><p>${item.content}</p>`;
      lines.push(line);
    });

    emailText = lines.join('');

    return sendMail(emailTitle, emailText).then((success) => {
      if (success) {
        usedMsgIds.push.apply(usedMsgIds, newMsgIds);
      }
      return success;
    });

  });
}

export function initZteF50() {
  stopZteF50();
  parseMessageList(true);
  printInfo('开始轮询 ZTE F50 短信列表 | 当前已测试兼容系统版本：B14');
  fetchTimer = setInterval(() => {
    parseMessageList(false);
  }, COMMON_CONFIG.FETCH_INTERVAL);
}

export function stopZteF50() {
  if (fetchTimer) {
    printInfo('停止轮询 ZTE F50 短信列表');
    clearInterval(fetchTimer);
    fetchTimer = null;
  }
}
