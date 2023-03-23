import { useState, useEffect } from "react"
import { Drawer, Radio, Button, Space, Select } from "antd"
import SelectDialog from '@/components/Dialog/SelectDialog'
import { removeEle, setApproverStr } from '@/utils/index'
import { setTypes, selectModes, selectRanges } from "@/utils/const"
import closeIcon from '@/assets/images/add-close1.png'
import './index.scss'

export default function ApproverDrawer(props) {
    let { directorMaxLevel, store } = props
    let { approverDrawer, approverConfig1, setApproverConfig, setApprover } = store
    let [config, setConfig] = useState({ settype: 1, nodeUserList: [] })
    let [approverVisible, setApproverVisible] = useState(false)
    let [checkedList, setCheckedList] = useState([])
    let [approverRoleVisible, setApproverRoleVisible] = useState(false)
    let [checkedRoleList, setCheckedRoleList] = useState([])

    useEffect(() => {
        if (!approverConfig1.value) return
        setConfig(approverConfig1.value)
    }, [approverConfig1])

    const addApprover = () => {
        setCheckedList(config.nodeUserList)
        setApproverVisible(true)
    }
    const addRoleApprover = () => {
        setCheckedRoleList(config.nodeUserList)
        setApproverRoleVisible(true)
    }
    const sureApprover = (nodeUserList) => {
        setConfig({ ...config, nodeUserList })
        setApproverVisible(false)
    }
    const sureRoleApprover = (nodeUserList) => {
        setConfig({ ...config, nodeUserList })
        setApproverRoleVisible(false)
    }
    const saveApprover = () => {
        config.error = !setApproverStr(config)
        setApproverConfig({
            value: config,
            flag: true,
            id: approverConfig1.id
        })
        closeDrawer()
    }
    const closeDrawer = () => {
        setApprover(false)
    }
    const changeType = ({ target: { value: settype } }) => {
        let data = {
            ...config,
            settype,
            nodeUserList: [],
            examineMode: 1,
            noHanderAction: 2
        }
        if (settype == 2) {
            data.directorLevel = 1;
        } else if (settype == 4) {
            data.selectMode = 1;
            data.selectRange = 1;
        } else if (settype == 7) {
            data.examineEndDirectorLevel = 1
        }
        setConfig(data)
    }
    let changeHandle = (e, key) => {
        let data = { ...config }
        data[key] = typeof e === 'object' ? e.target.value : e
        if (key === 'selectRange') {
            data.nodeUserList = []
        }
        setConfig(data)
    }

    let removeNodeUserList = (item) => {
        setConfig({
            ...config,
            nodeUserList: removeEle(config.nodeUserList, item, 'targetId')
        })
    }
    let clearNodeUserList = () => {
        setConfig({ ...config, nodeUserList: [] })
    }
    const getLevels = (flag = false)=> {
        let text = flag? '最高主管': '直接主管'
        return Array.from({ length: 4 }, (_, i) => {
            return {
                value: i + 1,
                label: i == 0 ? text : `第${i+1}${flag?'层':''}级主管`
            }
        })
    }
    return (<Drawer title="审批人设置" open={approverDrawer} className="set_promoter" closable={false} width={550} onClose={saveApprover}>
        <div className="demo-drawer-content">
            <div className="drawer_content">
                <div className="approver_content">
                    <Radio.Group value={config.settype} className="clear" options={setTypes} onChange={changeType}></Radio.Group>
                    {config.settype == 1 ? (
                        <><Button type="primary" onClick={addApprover}>添加/修改成员</Button>
                            <p className="selected_list">
                                {
                                    config.nodeUserList.map((item, index) => (<>
                                        <span key={index}>{item.name}
                                            <img src={closeIcon} onClick={() => removeNodeUserList(item)} alt=""/>
                                        </span>
                                    </>))
                                }
                                {
                                    config.nodeUserList.length != 0 ? <a onClick={clearNodeUserList}>清除</a> : ''
                                }
                            </p></>
                    ) : ''}
                </div>
                {
                    config.settype == 2 ? (<div className="approver_manager">
                        <p>
                            <span>发起人的：</span>
                            <Select className="select" value={config.directorLevel} options={getLevels()} onChange={e => changeHandle(e, 'directorLevel')}></Select>
                        </p>
                        <p className="tip">找不到主管时，由上级主管代审批</p>
                    </div>) : ''
                }
                {
                    config.settype == 5 ? (<div className="approver_self">
                        <p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
                    </div>) : ''
                }
                <div className="approver_self_select" style={{ display: config.settype == 4 ? 'block' : 'none' }}>
                    <Radio.Group value={config.selectMode} options={selectModes} onChange={e => changeHandle(e, 'selectMode')}></Radio.Group>
                    <h3>选择范围</h3>
                    <Radio.Group value={config.selectRange} options={selectRanges} onChange={e => changeHandle(e, 'selectRange')}></Radio.Group>
                    {config.selectRange == 2 ? <Button type="primary" onClick={addApprover}>添加/修改成员</Button> : ''}
                    {config.selectRange == 3 ? <Button type="primary" onClick={addRoleApprover}>添加/修改角色</Button> : ''}
                    {(config.selectRange == 2 || config.selectRange == 3) ? (<p className="selected_list">
                        {config.nodeUserList.map((item, index) => (<span key={index}>{item.name}
                            <img src={closeIcon} onClick={() => removeNodeUserList(item)} alt=""/>
                        </span>))}
                        {config.nodeUserList.length != 0 && config.selectRange != 1 ? <a onClick={clearNodeUserList}>清除</a> : ''}
                    </p>) : ''}
                </div>
                {config.settype == 7 ? (<div className="approver_manager">
                    <p>审批终点</p>
                    <p style={{ paddingBottom: 20 }}>
                        <span>发起人的：</span>
                        <Select className="select" value={config.examineEndDirectorLevel} options={getLevels(true)} onChange={e => changeHandle(e, 'examineEndDirectorLevel')}></Select>
                    </p>
                </div>) : ''}
                {(config.settype == 1 && config.nodeUserList.length > 1) || config.settype == 2 || (config.settype == 4 && config.selectMode == 2) ? (<div className="approver_some">
                    <p>多人审批时采用的审批方式</p>
                    <Radio.Group value={config.examineMode} onChange={e => changeHandle(e, 'examineMode')} className="clear">
                        <Space direction="vertical" size={0}>
                            <Radio value={1}>依次审批</Radio>
                            {config.settype != 2 ? <Radio value={2}>会签(须所有审批人同意)</Radio> : ''}
                        </Space>
                    </Radio.Group>
                </div>) : ''}
                {config.settype == 2 || config.settype == 7 ? (<div className="approver_some">
                    <p>审批人为空时</p>
                    <Radio.Group value={config.noHanderAction} onChange={e => changeHandle(e, 'noHanderAction')} className="clear">
                        <Space direction="vertical" size={0}>
                            <Radio value={1}>自动审批通过/不允许发起</Radio>
                            <Radio value={2}>转交给审核管理员</Radio>
                        </Space>
                    </Radio.Group>
                </div>) : ''}
            </div>
            <div className="demo-drawer-footer clear">
                <Button type="primary" onClick={saveApprover}>确 定</Button>
                <Button onClick={closeDrawer}>取 消</Button>
            </div>
            <SelectDialog
                type="employees"
                visible={approverVisible}
                setVisible={setApproverVisible}
                data={checkedList}
                setData={setCheckedList}
                changeEvent={sureApprover}
            />
            <SelectDialog
                type="role"
                visible={approverRoleVisible}
                setVisible={setApproverRoleVisible}
                data={checkedRoleList}
                setData={setCheckedRoleList}
                changeEvent={sureRoleApprover}
            />
        </div>
    </Drawer>)
}