/** 常规配置 */
export const COMMON_CONFIG = {

  /** 设备 IP 地址 */
  DEVICE_IP: '192.168.1.1',

  /** 轮询间隔毫秒数 */
  FETCH_INTERVAL: 30000,

};

/** 调试配置 */
export const DEBUG_CONFIG = {

  /** 是否发送邮件 */
  SEND_EMAIL: true,

};

/** 邮箱 SMTP 配置 */
export const EMAIL_CONFIG = {

  /** SMTP 主机名 */
  HOST: 'smtp.126.com',

  /** SMTP 端口 */
  PORT: 465,

  /** 是否启用 SSL / TLS */
  SECURE: true,

  /** SMTP 账号 */
  AUTH_USER: '',

  /** SMTP 密码 */
  AUTH_PASS: '',

  /** 发件人名称 */
  FROM_NAME: 'SMS Forwarder',

  /** 发件人邮箱 */
  FROM_EMAIL: '',

  /** 收件人名称 */
  TO_NAME: '',

  /** 收件人邮箱 */
  TO_EMAIL: '',

};
