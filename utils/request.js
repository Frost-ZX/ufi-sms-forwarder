import { mergeObject } from '@frost-utils/javascript';

import axios from 'axios';

export const request = axios.create({
  timeout: 10000,
});

// 处理请求
request.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 处理响应
request.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

/** @typedef { import('axios').AxiosResponse } AxiosRes */

/**
 * @description 处理响应数据（`res.data`）
 * @template TResData
 * @param   {AxiosRes} response
 * @param   {TResData} defaults
 * @returns {TResData}
 */
export function handleResponse(response, defaults = {}) {
  let data = (response ? response.data : null);
  let merged = mergeObject(defaults, data);
  return merged;
}
