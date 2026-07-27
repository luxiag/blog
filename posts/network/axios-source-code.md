---
title: Axios 核心方法源码解析
category:
  - NetWork
tag:
  - Axios
date: 2025-02-07  
---

# Axios 封装使用

```ts
import axios, 
    { AxiosInstance,
      InternalAxiosRequestConfig, 
      AxiosRequestConfig, 
      AxiosError, 
      AxiosResponse,
    } from 'axios';

interface ResponseModel<T = any> {
    success: boolean;
    message: string | null;
    code: number | string;
    data: T;
}
class HttpRequest {
    service: AxiosInstance

    constructor() {
        this.service = axios.create({
            baseURL: import.meta.env.VITE_APP_BASE_URL,
            timeout: 5 * 1000
        });

        this.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                /**
                 * set your config
                 */
                if (import.meta.env.VITE_APP_TOKEN_KEY && getToken()) {
                    config.headers[import.meta.env.VITE_APP_TOKEN_KEY] = getToken()
                }
                return config
            },
            (error: AxiosError) => {
                console.log('requestError: ', error)
                return Promise.reject(error);
            },
            {
                synchronous: false
                runWhen: ((config: InternalAxiosRequestConfig) => {
                    // do something

                    // if return true, axios will execution interceptor method
                    return true
                })
            }
        );

        this.service.interceptors.response.use(
            (response: AxiosResponse<ResponseModel>): AxiosResponse['data'] => {
                const { data } = response
                const { code } = data
                if (code) {
                    if (code != HttpCodeConfig.success) {
                        switch (code) {
                            case HttpCodeConfig.notFound:
                                // the method to handle this code
                                break;
                            case HttpCodeConfig.noPermission:
                                // the method to handle this code
                                break;
                            default:
                                break;
                        }
                        return Promise.reject(data.message)
                    } else {
                        return data
                    }
                } else {
                    return Promise.reject('Error! code missing!')
                }
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
    }

    request<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
        /**
         * TODO: execute other methods according to config
         */
        return new Promise((resolve, reject) => {
            try {
                this.service.request<ResponseModel<T>>(config)
                    .then((res: AxiosResponse['data']) => {
                        resolve(res as ResponseModel<T>);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            } catch (err) {
                return Promise.reject(err)
            }
        })
    }

    get<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
        return this.request({ method: 'GET', ...config })
    }
    post<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
        return this.request({ method: 'POST', ...config })
    }
    put<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
        return this.request({ method: 'PUT', ...config })
    }
    delete<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
        return this.request({ method: 'DELETE', ...config })
    }
    upload<T = string>(fileItem: UploadFileItemModel, config?: UploadRequestConfig): Promise<ResponseModel<T>> | null {
        if (!import.meta.env.VITE_UPLOAD_URL) return null

        let fd = new FormData()
        fd.append(fileItem.name, fileItem.value)
        let configCopy: UploadRequestConfig
        if (!config) {
            configCopy = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        } else {
            config.headers!['Content-Type'] = 'multipart/form-data'
            configCopy = config
        }
        return this.request({ url: import.meta.env.VITE_UPLOAD_URL, data: fd, ...configCopy })
    }
}

const httpRequest = new HttpRequest()
export default httpRequest;

```

# Axios实例

`lib/axios.js`

```ts
import Axios from './core/Axios.js';
import defaults from './defaults/index.js';
function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults);
axios.Axios = Axios;
// ...
export default axios
```

`bind(Axios.prototype.request, context);`

```ts
const instance = function wrap(){
    return Axios.prototype.request.apply(Axios, arguments)
}
```

`extend(instance,Axios.prototype)`实现Axios更多实例调用

- `axios#request(config)`
- `axios#get(url[, config])`
- `axios#delete(url[, config])`
- `axios#head(url[, config])`
- `axios#options(url[, config])`
- `axios#post(url[, data[, config]])`
- `axios#put(url[, data[, config]])`
- `axios#patch(url[, data[, config]])`
- `axios#getUri([config])`

## Axios类

```ts
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      // ...
      throw err;
    }
  }

  _request(configOrUrl, config) {
    // ...
    return promise;
  }

  getUri(config) {

  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
});

export default Axios;
```

# InterceptorManager 拦截器

```ts
//  定义了请求和响应拦截器
this.interceptors = {
  request: new InterceptorManager(),
  response: new InterceptorManager()
};

this.interceptors.request.use(function onFulfilled(config) {
  // ...
  return config;
}, function onRejected(reason) {
  // ...
  return Promise.reject(reason)
})

this.interceptors.response.use(function onFulfilled(response) {
  // ...
  return response;
}, function onRejected(reason) {
  // ...
  return Promise.reject(reason)
})
```

定义一个`handlers[]`接受对应拦截器
通过forEach循环调用拦截器

```ts
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }


  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }


  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  // 循环调用所有拦截器
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

export default InterceptorManager;

```

拦截器有同步和异步执行，通过`synchronous`判断是否同步

定义`InterceptorChain`拦截器执行链，通过forEach循环加入
请求拦截器`unshift`加入，后定义的先执行
响应拦截器`push`加入，先定义先执行

**异步拦截器**

通过`promise = promise.then` => `promise.then.then`形成链调异步执行

```ts
// dispatchRequest 真正执行http请求
 const chain = [dispatchRequest.bind(this), undefined];
  chain.unshift.apply(chain, requestInterceptorChain);
  chain.push.apply(chain, responseInterceptorChain);
  len = chain.length
  promise = Promise.resolve(config)
  while (i < len) {
    // [fulfilled,reject]
    // 0  1
    // promise.then(requestfulfilled,requestrejected).then(dispatchRequest,undefined).then(responsefulfilled,responserejected)
    promise = promise.then(chain[i++], chain[i++]);
  }

```

**同步拦截器**

直接`white`遍历执行

```ts
 let newConfig = config
 i = 0
 while (i < len) {
   const onFulfilled = requestInterceptorChain[i++];
   const onRejected = requestInterceptorChain[i++];
   try {
     newConfig = onFulfilled(newConfig);
   } catch (error) {
     onRejected.call(this, error);
     break;
   }
 
 try {
   promise = dispatchRequest.call(this, newConfig);
 } catch (error) {
   return Promise.reject(error);
 
 i = 0;
 len = responseInterceptorChain.length
 while (i < len) {
   promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
 }
```

```ts
  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    // 异步
    if (!synchronousRequestInterceptors) {
      // dispatchRequest 真正执行http请求
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        // [fulfilled,reject]
        // 0  1
        // promise.then(requestfulfilled,requestrejected).then(dispatchRequest,undefined).then(responsefulfilled,responserejected)
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    // 同步
    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

```

# Http 调用

`dispatchRequest`真正执行http的方法
通过adapter获取要调用http请求的适配器,默认是xhrAdapter
适配器`[xhrAdapter,httpAdapter,fetchAdapter]`

```ts
export default function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

```

`defaults/index.js`

```ts
const defaults = {
   adapter: ['xhr', 'http', 'fetch']
}
```

## adapters

```ts
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
}
export default {
  getAdapter: (adapters) => {
    //  adapter: ['xhr', 'http', 'fetch']
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        // 获取对应的适配器
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {
      // ..
    }

    return adapter;
  },
  adapters: knownAdapters
}
```

# XHR

xhr原生使用

```ts
let xhr = new XMLHttpRequest();

xhr.open('GET', '/my/url');

xhr.send();

xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // 加载中
  }
  if (xhr.readyState == 4) {
    // 请求完成
  }
};

// 请求完成
xhr.onload = function() {
  if (xhr.status != 200) { // HTTP error?
    // 处理 error
    alert( 'Error: ' + xhr.status);
    return;
  }

  // 获取来自 xhr.response 的响应
};

xhr.onprogress = function(event) {
  // 报告进度
  alert(`Loaded ${event.loaded} of ${event.total}`);
};

xhr.onerror = function() {
  // 处理非 HTTP error（例如网络中断）
};
```

## Axios中XHR内部封装

```ts
const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

export default isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    // 创建xhr
    let request = new XMLHttpRequest();
    // 初始化
    request.open(_config.method.toUpperCase(), _config.url, true);

    // 设置超时时间
    // Set the request timeout in MS
    request.timeout = _config.timeout;
    // 请求完成
    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    // 兼容加载完成事件
    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }
    // 请求取消事件
    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };
    // 请求错误事件
    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };
    // 请求超时事件
    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }
    // 如果配置取消请求 则取消本次请求
    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }

    // 发送http请求
    // Send the request
    request.send(requestData || null);
  });
}


```

# Fetch

```ts
// Step 1：启动 fetch，并获得一个 reader
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100');

const reader = response.body.getReader();

// Step 2：获得总长度（length）
const contentLength = +response.headers.get('Content-Length');

// Step 3：读取数据
let receivedLength = 0; // 当前接收到了这么多字节
let chunks = []; // 接收到的二进制块的数组（包括 body）
while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`)
}

// Step 4：将块连接到单个 Uint8Array
let chunksAll = new Uint8Array(receivedLength); // (4.1)
let position = 0;
for(let chunk of chunks) {
  chunksAll.set(chunk, position); // (4.2)
  position += chunk.length;
}

// Step 5：解码成字符串
let result = new TextDecoder("utf-8").decode(chunksAll);

// 我们完成啦！
let commits = JSON.parse(result);
```

## Axios中Fetch封装

```ts
const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
export default isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    // 如果有监听下载事件
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      // 启动fetch，并获得一个 reader
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }
      // 添加下载进度事件处理
      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError.from(err, err && err.code, config, request);
  }
});

```

# 参考

- <https://github.com/liushi-cli/v3-ts-tailwind-template/blob/master/src/utils/axios/axios.ts>
- <https://juejin.cn/post/7224415869367943205#heading-5>
- 《现代 JavaScript 教程》
