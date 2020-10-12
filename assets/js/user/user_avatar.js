$(function () {
    //1.1获取裁剪区域的DOM元素
    var $image = $('#image')
    //1.2配置选项
    const options = {
        //纵横比
        aspectRatio: 1,
        //指定预览区域
        preview: '.img-preview'
    }
    //1.3创建裁剪区域
    $image.cropper(options)

    //2.选择文件
    $("#btn").on("click", function () {
        $("#file").click();
    })
    //3.修改裁剪图片
    var layer = layui.layer;
    $("#file").on("change", function (e) {
        //3.1 拿到用户选择的文件
        var file = e.target.files[0]
        // 前端非空校验
        if (file == undefined) {
            return layer.msg("请选择图片！")
        }
        //3.2根据选择的文件，创建一个对应的URL地址
        var newImageURL = URL.createObjectURL(file)
        //3.3 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域 
    })

    //4.上传头像
    $("#btnUpload").on("click", function () {
        //获取base6 类型的头像（字符串）
        var dataURL = $image
            .cropper('getCroppedCanvas', {//创建一个canvas
                width: 100,
                height: 100
            })
            .toDataURL('image/png')     //将Canvas画布上的裁剪区域上传
        console.log(dataURL);
        console.log(typeof dataURL);
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，更换头像成功！");
                window.parent.getUserInfo();
            }
        })
    })
})