<!--
 * @Date: 2022-08-29 14:39:11
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-28 14:03:15
 * @FilePath: /workflow-react/README.md
-->


### workflow钉钉审批流程设置-react版本

workflow钉钉审批流程设置，基于react开发。QQ交流群①:639251756  QQ交流群②:790780565
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191116144905578.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Mjg1MTkz,size_16,color_FFFFFF,t_70 )
-  [开源地址react版本 https://github.com/StavinLi/Workflow-React](https://github.com/StavinLi/Workflow-React) github点个星吧！
-  [开源地址vue2版本 https://github.com/StavinLi/Workflow](https://github.com/StavinLi/Workflow) github点个星吧！
-  [开源地址vue3版本 https://github.com/StavinLi/Workflow-Vue3](https://github.com/StavinLi/Workflow-Vue3) github点个星吧！
-  [预览地址 https://stavinli.github.io/Workflow-React/build/index.html#/](https://stavinli.github.io/Workflow-React/build/index.html#/) 
-------------------
 

#### 项目介绍
- UI钉钉风格
- 技术点
1. 组件自调用+递归处理，按树状结局处理审批流程问题
- 主要功能点
2. 界面缩放
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191116145339223.jpg)
```javascript
<div className="zoom">
    <div className={`zoom-out ${curSize === 50 ? 'disabled' : ''}`} onClick={() => zoomSize(1)}></div>
    <span>{curSize}%</span>
    <div className={`zoom-in ${curSize === 300 ? 'disabled' : ''}`} onClick={() => zoomSize(2)}></div>
</div>
```
3. 节点设置（包括审批人、发起人、抄送人、条件设置）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200304140232374.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Mjg1MTkz,size_16,color_FFFFFF,t_70#pic_center)
```javascript
<Drawer title="审批人设置" open={approverDrawer} className="set_promoter" closable={false} width={550} onClose={saveApprover}>
    <div className="demo-drawer-content">
        <div className="drawer_content">
            <div className="approver_content">
                <Radio.Group value={config.settype} className="clear" options={setTypes} onChange={changeType}></Radio.Group>
                ...
```
5. 节点新增
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191116145355289.png)
```javascript
<div className="add-node-popover-body">
    <a className="add-node-popover-item approver" onClick={() => addType(1)}>
        <div className="item-wrapper">
            <span className="iconfont"></span>
        </div>
        <p>审批人</p>
    </a>
    <a className="add-node-popover-item notifier" onClick={() => addType(2)}>
        <div className="item-wrapper">
            <span className="iconfont"></span>
        </div>
        <p>抄送人</p>
    </a>
    <a className="add-node-popover-item condition" onClick={() => addType(4)}>
        <div className="item-wrapper">
            <span className="iconfont"></span>
        </div>
        <p>条件分支</p>
    </a>
</div>
```
5.错误校验
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200304140011896.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3Mjg1MTkz,size_16,color_FFFFFF,t_70)
```javascript
let { type, error, nodeName, conditionNodes } = childNode;
if (type === 1 || type === 2) {
    if (error) {
        data.push({
            name: nodeName,
            type: ["", "审核人", "抄送人"][type],
        })
    }
    reErr(childNode, data);
} else if (type === 3) {
    reErr(childNode, data);
} else if (type === 4) {
    for (var i = 0; i < conditionNodes.length; i++) {
        if (conditionNodes[i].error) {
            data.push({ name: conditionNodes[i].nodeName, type: "条件" })
        }
        reErr(conditionNodes[i], data);
    }
    reErr(childNode, data);
}
```
6.模糊搜索匹配人员、职位、角色
```javascript
<Input style={{ textIndent: 10 }} placeholder="搜索成员" value={searchVal} onChange={getDebounceData} />
```
#### 项目安装

> git clone https://github.com/StavinLi/Workflow.git 点个赞吧！

#### 项目运行
> 1.环境依赖  `npm i`

> 2.本地运行 `npm run serve` 

> 3.打包运行 `npm run build` 
