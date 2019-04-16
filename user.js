import Event from "sx-event";

export default class user {
   constructor() {
      this.code = ''
      this.event = new Event()
      this._userInfo = null
      this._wxUserInfo = null
   }

   init() {
      return Promise.all([
         this.doWxLogin(),
         new Promise((resolve, fail) => {
            wx.getSetting({
               success: res => {
                  if (res.authSetting['scope.userInfo']) {
                     // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                     wx.getUserInfo({
                        success: res => {
                           console.log('已授权', res)
                           this.setWxUserInfo(res)
                           resolve(res)
                        },
                        fail
                     })
                  } else
                     resolve()
               },
               fail
            });
         })
      ])
   }

   doWxLogin() {
      return new Promise((resolve, fail) => {
         // 登录
         wx.login({
            success(res) {
               this.code = res.code
               resolve(res)
            }, fail
         })
      })
   }

   getUserInfo(sync = false) {
      return sync ? this._userInfo :
         new Promise((resolve) => {
            this._userInfo ?
               resolve(this._userInfo) :
               this.event.$on('setUserInfo', onInit)
            function onInit(userInfo) {
               event.$off('setUserInfo', onInit)
               onInit = null;
               resolve(userInfo);
            }
         })
   }

   setUserInfo(userInfo) {
      if(!userInfo || typeof userInfo !== 'object')
         return console.error(userInfo,'is not a object!')
      this._userInfo = Object.assign(this._userInfo || {},userInfo)
      this.event.$emit('setUserInfo',userInfo)
   }

   setWxUserInfo(wxUserInfo) {
      if(!wxUserInfo || typeof wxUserInfo !== 'object')
         return console.error(wxUserInfo,'is not a object!')
      this._wxUserInfo = Object.assign(this._wxUserInfo || {},wxUserInfo)
      this.event.$emit('setWxUserInfo',wxUserInfo)
   }

   getWxUserInfo(sync = false) {
      return sync ? this._wxUserInfo :
         new Promise((resolve) => {
            this._wxUserInfo ?
               resolve(this._wxUserInfo) :
               this.event.$on('setWxUserInfo', onInit)
            function onInit(userInfo) {
               event.$off('setWxUserInfo', onInit)
               onInit = null;
               resolve(userInfo);
            }
         })
   }
}
