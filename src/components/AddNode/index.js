/*
 * @Date: 2023-03-15 17:56:12
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-23 10:25:02
 * @FilePath: /workflow-react/src/components/addNode/index.js
 */
import { useState } from 'react';
import { Popover } from 'antd'
import './index.scss'

export default (props) => {
    let { childNodeP, changeEvent } = props
    let [visible, setVisible] = useState(false)
    const addType = (type) => {
        setVisible(false)
        if (type != 4) {
            var data;
            if (type == 1) {
                data = {
                    "nodeName": "审核人",
                    "error": true,
                    "type": 1,
                    "settype": 1,
                    "selectMode": 0,
                    "selectRange": 0,
                    "directorLevel": 1,
                    "examineMode": 1,
                    "noHanderAction": 1,
                    "examineEndDirectorLevel": 0,
                    "childNode": childNodeP,
                    "nodeUserList": []
                }
            } else if (type == 2) {
                data = {
                    "nodeName": "抄送人",
                    "type": 2,
                    "ccSelfSelectFlag": 1,
                    "childNode": childNodeP,
                    "nodeUserList": []
                }
            }
            changeEvent(data)
        } else {
            changeEvent({
                "nodeName": "路由",
                "type": 4,
                "childNode": null,
                "conditionNodes": [{
                    "nodeName": "条件1",
                    "error": true,
                    "type": 3,
                    "priorityLevel": 1,
                    "conditionList": [],
                    "nodeUserList": [],
                    "childNode": childNodeP,
                }, {
                    "nodeName": "条件2",
                    "type": 3,
                    "priorityLevel": 2,
                    "conditionList": [],
                    "nodeUserList": [],
                    "childNode": null
                }]
            })
        }
    }
    let content = (<><div className="add-node-popover-body">
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
    </>)
    const handleOpenChange = (newOpen) => {
        setVisible(newOpen);
    };
    return (<div className="add-node-btn-box">
        <div className="add-node-btn">
            <Popover placement="rightTop" trigger="click" open={visible} onOpenChange={handleOpenChange} content={content}>
                <button className="btn" type="button">
                    <span className="iconfont"></span>
                </button>
            </Popover>
        </div>
    </div>)
}