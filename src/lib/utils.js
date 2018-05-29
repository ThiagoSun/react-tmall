import 'whatwg-fetch';
import composeMiddleWare from './composeMiddleWare';
import apiConfig from './apiConfig';

const env = process.env.NODE_ENV || 'development';
console.log(apiConfig)

export const preApi = apiConfig[env];

let cacheError;

const fetchUrl = []

const filterErrorCodeArray = [-700];

/**
 * 请求发出之前要先经过中间件处理
 * args包括url和options
 * composeMiddleWare 加载遍历中间件
 */
export const fetchAPI = (...args) => composeMiddleWare(fetchAction, preApi, ...args);

function fetchAction({ filter, url, options }) {
  /**
   * 暂无服务端时，使用Get方式请求json假数据
   * @type {string}
   */
  options.method = 'GET';

  let tempUrl = '';
  if (options.method !== 'GET') {
    tempUrl = options.method + url.split('?')[0];
    if (fetchUrl.indexOf(tempUrl) !== -1) {
      return;
    }
    fetchUrl.push(tempUrl);
  }
  cacheError = '';
  if (options.method === 'GET') delete options.body;
  url += `&Timezone=${new Date().getTimezoneOffset()}`;
  return fetch(`${filter}${url}.json`, options)
    .then((response) => {
      if (options.method !== 'GET') {
        const i = fetchUrl.indexOf(tempUrl);
        if (i !== -1) fetchUrl.splice(i, 1)
      }
      return response;
    })
    .then(checkStatus)
    .then(checkFileType)
    .then(checkCode)
}

export const apiMiddleWare = store => next => (action) => {
  if (cacheError) {
    if (cacheError.code === -700) {
      next({
        type: 'TOKEN_INVALID'
      });
    } else {
      next({
        type: 'ERROR',
        error: cacheError
      });
    }
  } else {
    next({
      type: 'GLOBAL_LOADING',
      response: '2'
    });
  }
  next(action)
};

function checkCode(response) {
  if (response.Code !== 0) {
    return handleError(response.Code, response);
  }
  return response;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.json().then(json => handleError(response.status, json));
}

function checkFileType(response) {
  const contentType = response.headers.get('content-type');
  if (contentType === 'text/csv' || contentType.indexOf('application/octet-stream') !== -1) {
    response.blob().then((blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      const fileNameStr = response.headers.get('content-disposition');
      const filename = fileNameStr.replace(/attachment;\s*filename=/, ''); // based on response HEADER
      a.href = url;
      a.download = decodeURIComponent(filename);
      a.click();
      window.URL.revokeObjectURL(url);
    });
    return { Code: 0 };
  }

  // otherwise it's a json response
  return response.json();
}

function handleError(code, response = '') {
  const error = new Error();
  error.code = code;
  error.response = response;
  if (filterErrorCodeArray.indexOf(code) !== -1) {
    cacheError = error;
  }
  throw error;
}

export function parseBody(body) {
  const type = Object.prototype.toString.call(body);
  if (type === '[object Null]' || type === '[object Undefined]' || type === '[object FormData]') {
    body = '';
  }
  if (type === '[object Object]' || type === '[object Array]') {
    body = JSON.stringify(body);
  }
  return body;
}

export async function handleAPI(fn, action, dispatch) {
  try {
    dispatch({
      type: 'GLOBAL_LOADING',
      response: '1'
    });
    return await fn.call(null, action).then(response => {
      dispatch({
        type: 'GLOBAL_LOADING',
        response: '2'
      });
      return response;
    });
  } catch (error) {
    if (error.code === -700) {
      dispatch({
        type: 'TOKEN_INVALID'
      });
    } else {
      dispatch({
        type: 'ERROR',
        error: cacheError
      });
    }
    dispatch({
      type: 'GLOBAL_LOADING',
      response: '1'
    });
    dispatch({
      type: 'ERROR',
      error,
    });
  }
}

