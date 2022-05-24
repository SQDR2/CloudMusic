// pages/login/login.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        password:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    handlerinput(event){
        // console.log(event);
        let type = event.currentTarget.id
        this.setData({
            [type]:event.detail.value
        })
    },
    async login(){
        let {phone,password} = this.data
        //前端验证
        if(!phone){
            wx.showToast({
              title: '手机号不能为空',
              icon:'error'
            })
            return;
        }
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/ 
        if(!phoneReg.test(phone)){
            wx.showToast({
              title: '手机号格式错误',
              icon:'error'
            })
            return;
        }
        if(!password){
            wx.showToast({
              title: '密码不能为空',
              icon:'error'
            })
            return;
        }
        //后端验证
        let result = await request('/login/cellphone',{phone,password,isLogin:true})
        // console.log(result);
        if(result.code==200){
            wx.showToast({
              title: '登录成功',
              icon:'success'
            })
            // console.log(result);
            // 这里用wx.relaunch,不用navigateto
            wx.reLaunch({
              url: '/pages/personal/personal'
            })
            wx.setStorageSync('userInfo', result.profile)
        }else if(result.code==502){
            wx.showToast({
              title: '密码错误',
              icon:'error'
            })
        }else if(result.code==400){
            wx.showToast({
              title: '手机号码错误',
              icon:"error"
            })
        }else{
            wx.showToast({
              title: '登陆失败',
              icon:'error'
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})