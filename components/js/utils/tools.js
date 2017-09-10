// ajax函数的默认参数
var ajaxOptions = {
  url: '#',
  method: 'GET',
  async: true,
  timeout: 0,
  data: null,
  dataType: 'text',
  headers: {},
  onprogress: function () { },
  onuploadprogress: function () { },
  xhr: null
}
const tools = {

  ajax(optionsOverride) {
     // 将传入的参数与默认设置合并
     var options = {};
     for (var k in ajaxOptions) {
         options[k] = optionsOverride[k] || ajaxOptions[k];
     }
     options.async = options.async === false ? false : true;
     var xhr = options.xhr = options.xhr || new XMLHttpRequest();

     return new Promise(function (resolve, reject) {
         xhr.open(options.method, options.url, options.async);
         xhr.timeout = options.timeout;

         //设置请求头
         for (var k in options.headers) {
             xhr.setRequestHeader(k, options.headers[k]);
         }
        //  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
         // 注册xhr对象事件
         xhr.onprogress = options.onprogress;
         xhr.upload.onprogress = options.onuploadprogress;
         xhr.responseType = options.dataType;

         xhr.onabort = function () {
             reject(new Error({
                 errorType: 'abort_error',
                 xhr: xhr
             }));
         }
         xhr.ontimeout = function () {
             reject({
                 errorType: 'timeout_error',
                 xhr: xhr
             });
         }
         xhr.onerror = function () {
             reject({
                 errorType: 'onerror',
                 xhr: xhr
             })
         }
         xhr.onloadend = function () {
             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
                 resolve(xhr);
             else
                 reject({
                     errorType: 'status_error',
                     xhr: xhr
                 })
         }

         try {
             xhr.send(options.data);
         }
         catch (e) {
             reject({
                 errorType: 'send_error',
                 error: e
             });
         }
     })
 }
}

export default tools;
