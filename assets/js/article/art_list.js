$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        const y = dt.getFullYear();
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());

        const hh = padZero(dt.getHours());
        const mm = padZero(dt.getMinutes());
        const ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义一个补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据，默认每页显示2条
        cate_id: '', //文章分类的 Id
        state: '' //	文章的发布状态
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 使用模版引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败');
                }

                // 调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr);
                // 通知layui重新渲染表单区域的ui结构
                form.render();

            }
        })
    }

    // 为筛选表单绑定 submit事件
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;

        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);

        // 调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的ID，注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示多少条数据
            curr: q.pagenum, //设置默认被选中的分页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页展示的功能项默认为['prev', 'page', 'next']
            limits: [2, 3, 5, 10], //自定义每页显示的条目数选项

            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候
            // 2.只要调用了laypage.render()方法就会触发
            jump: function(obj, first) {
                // 可以通过first值，来判断是通过哪种方式，触发的jump回调
                // 如果first 的值为true，证明是方式2触发的，否则就是方式1触发的
                // console.log(first); //打印结果为true/false

                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值，赋值到q这个查询参数pagenum对象中
                q.pagenum = obj.curr;

                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的条目数，赋值到q这个查询参数pagesize对象中
                q.pagesize = obj.limit;

                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {

        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // console.log(len);

        // 获取文章的id
        var id = $(this).attr('data-id');

        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');

                    //当数据删除成功，需要判断当前这一页中是否还有剩余的数据 
                    // 如果没有剩余的数据，让页码值➖1，之后重新调用initTable()方法
                    if (len === 1) {
                        // 如果len的值等于1 ，证明删除完毕之后，页面上就没有任何数据了
                        // 注意：页码值最小必须是1，进行判断后，执行是否-1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    initTable();
                }
            })
            layer.close(index);
        });

    })



})