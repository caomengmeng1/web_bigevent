$(function() {
    // 点击“去注册账号”的链接
    $("#link_reg").on("click", function() {
        // 将登录的div隐藏，注册的div显示
        $(".login-box").hide();
        $(".reg-box").show();
    })

    // 点击“去登录”的链接
    $("#link_login").on("click", function() {
        // 将注册的div隐藏，登录的div显示
        $(".reg-box").hide();
        $(".login-box").show();
    })

    // 从layui中获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，return一个提示消息即可
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    // 3.从layui中获取layer对象
    var layer = layui.layer;
    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起ajax的post请求
        // $.post('http://www.liulongbin.top:3007/api/reguser', { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() }, function(res) {
        var data = { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                // return alert(res.message);
                // 3.1 失败提示消息
                return layer.msg(res.message);
            }
            // alert('注册成功！');
            // 3.2 成功提示消息
            layer.msg('注册成功! 请登录');

            // 4.注册完模拟人的点击行为
            $("#link_login").click();
        })
    })

    // 监听登录表单的提交事件
    // $("#form_login").submit(function(e) {
    //     // 阻止默认的提交行为
    //     e.preventDefaul();
    //     // 发起ajax的post请求
    //     $.ajax({
    //         url: 'http://www.liulongbin.top:3007/api/login',
    //         method: 'POST',
    //         // 快速获取表单中所有的数据
    //         data: $(this).serialize(),
    //         success: function(res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('登录失败！');
    //             }
    //             layer.msg('登录成功！')
    //                 // alert('登录成功！')
    //                 // console.log(res.token);
    //             location.href = '/index.html';
    //         }
    //     })
    // })

    $("#form_login").on("submit", function(e) {
        // alert('ok');
        // 阻止默认的提交行为
        e.preventDefault();
        // 发起ajax的post请求
        // $.post('http://www.liulongbin.top:3007/api/login', { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() }, function(res) {
        var data = { username: $("#form_login [name=username]").val(), password: $("#form_login [name=password]").val() };
        $.post('/api/login', data, function(res) {
            if (res.status !== 0) {
                // return alert(res.message);
                // 失败提示消息
                return layer.msg(res.message);
            }
            // 成功提示消息
            layer.msg('登录成功!');

            console.log(res.token);
            // 将登录成功的到的 token 字符串，保存到localStorage中
            localStorage.setItem('token', res.token);

            // 跳转到后台主页
            location.href = '/index.html';

        })
    })

})