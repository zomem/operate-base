## 知晓云运营后台脚手架  

## 说明  
用到的技术：`react ant-design react-router lodash`  
按照ant-design的介绍文档，使用create-react-app方式创建  


## 使用步骤  
1. 在知晓云后台创建一个默认运营后台再使用  
2. 将`public/index.html`里的`<ClientID>`替换成你的ClientID  
3. `npm run start`开始开发  
4. `npm run build`构建，`cd build`, 打包并上传至知晓云后台  
  
  
## 介绍  
- 主题配置在`config-overrides.js`里  
  
- 开发表、正式表的权限对比。 开发字段、正式字段的权限、默认值、类型等对比。  
![对比图片](./temp/pic.png)  
开发表我是以`dev_`或`_dev`命名，如`test_dev/dev_test`，如果大家用的其他命名区分，  
请修改下源码`src/component/setting/table/table.js`  
