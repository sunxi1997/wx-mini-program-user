# User - 微信小程序版

[User](https://github.com/sunxi1997/sx-user) 的扩展版本，加入微信的用户授权数据及code登录

## 扩展属性

### code
wx.login 获取到的code

## 扩展方法

### init

执行一次doWxLogin
执行一次authSettingUserInfo

返回值：Promise


### doWxLogin

调用wx.login 初始化code

### authSettingUserInfo

获取微信小程序授权信息，如果授权了，会使用setWxUserInfo保存授权信息

### setWxUserInfo(wxUserInfo)

保存授权信息

wxUserInfo为小程序用户授权的结果，可通过wx.getUserInfo或button open-type='getuserInfo'

### getWxUserInfo(sync)

获取授权信息

````
 @param {Boolean} sync=false - 同步获取
````
若立即获取，返回值为当前授权数据（可能为空），否则返回值为Promise，当授权数据初始化后或已存在时resolve
