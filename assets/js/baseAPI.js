// 注意：每次调用$.get()或 $.post()或 $.ajax() 的时候
// 会先调用ajaxPrefilter这个函数
// 这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // console.log(options.url);


    // 统一为有权限的接口，设置headers请求头
    /*   options.headers = {
          Authorization: localStorage.getItem('token') || ''
      } */

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载 complete回调函数
    options.complete = function(res) {
        // console.log('执行了complete函数');
        // console.log(res);
        // 在complete函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 01.强制清空 token
            localStorage.removeItem('token');
            //  02.强制跳转到登录页面
            location.href = '/login.html';
        }

    }
})