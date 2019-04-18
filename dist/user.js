import {User} from 'sx-user'

export default class wxUser extends User{
   constructor() {
      super();
      this.code = ''
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
            success:res=> {
               this.code = res.code
               resolve(res)
            }, fail
         })
      })
   }

   getWxUserInfo(sync = false) {
      return sync ? this._wxUserInfo :
         new Promise((resolve) => {
            let event = this.event;
            this._wxUserInfo ?
               resolve(this._wxUserInfo) :
               event.$on('setWxUserInfo', onInit)
            function onInit(userInfo) {
               event.$off('setWxUserInfo', onInit)
               onInit = null;
               resolve(userInfo);
            }
         })
   }

   setWxUserInfo(wxUserInfo) {
      if(!wxUserInfo || typeof wxUserInfo !== 'object')
         return console.error(wxUserInfo,'is not a object!')
      this._wxUserInfo = Object.assign(this._wxUserInfo || {},wxUserInfo)
      this.event.$emit('setWxUserInfo',wxUserInfo)
   }

}
