// 入口函数
$(function() {

    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    // 获取文章的分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                // 调用template函数
                // template('tpl-table', res);
                var htmStr = template('tpl-table', res);
                $('tbody').html(htmStr);
            }
        })
    }

    //为添加按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 因为form表单是动态添加的，只有点击添加按钮才可以获取到
    // 所以这里想要获取到表单，只能通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                console.log(res);
                // 获取成功，重新获取文章分类列表
                initArtCateList();
                layer.msg('新增分类成功');

                // 根据索引,关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式给btn-edit按钮绑定点击事件
    var indexEdit = null;
    $("tbody").on("click", "#btn-edit", function() {
        // 弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }

        })
    })

    // 通过代理的形式给修改分类表单绑定submit事件
    $("body").on('submit', '#form-edit', function(e) {
        // console.log('haole');
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据获取失败');
                }

                layer.msg('更新分类数据获取成功');
                layer.close(indexEdit);
                initArtCateList();

            }
        })
    })

    // 通过代理的形式给删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function() {

        // console.log('delete');

        var id = $(this).attr('data-id');
        // console.log(id);

        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }

                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }

            })


        });


    })
})