import { Drawer, Button, Modal, Select, InputNumber } from 'antd'
import { useEffect, useState } from 'react'
import SelectDialog from '@/components/Dialog/SelectDialog'
import { toggleClass, toggleStrClass, conditionStr, toChecked, removeEle } from '@/utils/index'
import { optTypes, opt1s } from '@/utils/const'
import { getConditions } from '@/api/index'
import closeIcon from '@/assets/images/add-close1.png'
import './index.scss'

export default function ConditionDrawer(props) {
    let { tableId, conditionsConfig1, conditionDrawer, setCondition, setConditionsConfig } = props.store
    let [conditionVisible, setConditionVisible] = useState(false)
    let [configs, setConfigs] = useState({
        conditionNodes: [],
    })
    let [config, setConfig] = useState({ conditionList: [] })
    let [conditions, setConditions] = useState([])
    let [conditionList, setConditionList] = useState([])
    let [checkedList, setCheckedList] = useState([])
    let [priorityLevel, setPriorityLevel] = useState('')
    let [conditionRoleVisible, setConditionRoleVisible] = useState(false)

    useEffect(() => {
        if (!conditionsConfig1.value) return
        let { value, priorityLevel } = conditionsConfig1
        let { conditionNodes} = value
        setConfigs(value)
        setPriorityLevel(priorityLevel)
        setConfig(priorityLevel ? conditionNodes[priorityLevel - 1] : { nodeUserList: [], conditionList: [] })
    }, [conditionsConfig1])

    const changeOptType = (e, item, i, key) => {
        item[key] = typeof e === 'object' ? e.target.value: e
        if(key === 'optType'){
            if (item.optType == 1) {
                item.zdy1 = 2;
            } else {
                item.zdy1 = 1;
                item.zdy2 = 2;
            }
        }
        config.conditionList.splice(i, 1, item)
        setConfig({...config, conditionList: config.conditionList})
    }

    const toStrChecked = (item, key) => {
        let a = item.zdy1 ? item.zdy1.split(",") : []
        var isIncludes = toggleStrClass(item, key);
        if (!isIncludes) {
            a.push(key)
            item.zdy1 = a.toString()
            return item
        } else {
            return removeStrEle(item, key);
        }
    }
    const removeStrEle = (item, key) => {
        let a = item.zdy1 ? item.zdy1.split(",") : []
        var includesIndex;
        a.map((item, index) => {
            if (item == key) {
                includesIndex = index
            }
        });
        a.splice(includesIndex, 1);
        item.zdy1 = a.toString()
        return item
    }
    const checkEvent = (item, key, i)=> {
        let data = toStrChecked(item, key)
        config.conditionList.splice(i, 1, data)
        setConfig({...config, conditionList: config.conditionList})
    }
    const addCondition = async () => {
        let res = []
        setConditionVisible(true)
        let { data } = await getConditions({ tableId })
        setConditions(data)
        let { conditionList } = config
        if (conditionList) {
            for (var i = 0; i < conditionList.length; i++) {
                var { columnId } = conditionList[i]
                if (columnId == 0) {
                    res.push({ columnId: 0 })
                } else {
                    res.push(conditions.filter(item => item.columnId == columnId)[0])
                }
            }
        }
        setConditionList(res)
    }
    const sureCondition = () => {
        let data = {...config}
        //1.弹窗有，外面无+
        //2.弹窗有，外面有不变
        for (var i = 0; i < conditionList.length; i++) {
            var { columnId, showName, columnName, showType, columnType, fixedDownBoxValue } = conditionList[i];
            if (toggleClass(data.conditionList, conditionList[i], "columnId")) {
                continue;
            }
            if (columnId == 0) {
                data.nodeUserList = [];
                data.conditionList.push({
                    type: 1,
                    columnId,
                    showName: '发起人'
                });
            } else {
                if (columnType == "Double") {
                    data.conditionList.push({
                        showType,
                        columnId,
                        type: 2,
                        showName,
                        optType: "1",
                        zdy1: "2",
                        opt1: "<",
                        zdy2: "",
                        opt2: "<",
                        columnDbname: columnName,
                        columnType,
                    })
                } else if (columnType == "String" && showType == "3") {
                    data.conditionList.push({
                        showType,
                        columnId,
                        type: 2,
                        showName,
                        zdy1: "",
                        columnDbname: columnName,
                        columnType,
                        fixedDownBoxValue
                    })
                }
            }
        }
        //3.弹窗无，外面有-
        for (let i = data.conditionList.length - 1; i >= 0; i--) {
            if (!toggleClass(conditionList, data.conditionList[i], "columnId")) {
                data.conditionList.splice(i, 1);
            }
        }
        data.conditionList.sort(function (a, b) { return a.columnId - b.columnId; });
        setConfig(data)
        setConditionVisible(false)
    }
    const changePriortyLevel = (priorityLevel)=> {
        setConfig({...config, priorityLevel})
    }
    const saveCondition = () => {
        closeDrawer()
        let { conditionNodes } = configs
        var a = conditionNodes.splice(config.priorityLevel - 1, 1)//截取旧下标
        conditionNodes.splice(priorityLevel - 1, 0, a[0])//填充新下标
        conditionNodes.map((item, index) => {
            item.priorityLevel = index + 1
        });
        for (var i = 0; i < conditionNodes.length; i++) {
            conditionNodes[i].error = conditionStr({conditionNodes}, i) == "请设置条件" && i != conditionNodes.length - 1
        }
        setConditionsConfig({
            value: {...configs, conditionNodes},
            flag: true,
            id: conditionsConfig1.id
        })
    }
    const addConditionRole = (e) => {
        if(e.target.nodeName === "DIV" || e.target.nodeName === "P" ){
            setConditionRoleVisible(true)
            setCheckedList(config.nodeUserList)
        }
    }
    const sureConditionRole = (nodeUserList) => {
        setConditionRoleVisible(false)
        setConfig({
            ...config,
            nodeUserList
        })
    }
    const closeDrawer = () => {
        setCondition(false)
    }

    const checkedHandle = (data = {columnId: 0}) => {
        setConditionList(toChecked(conditionList, data, 'columnId'))
    }

    const delItem = (item) => {
        let data = {...config}
        if(item.type === 1){
            data.nodeUserList = []; 
        }
        data.conditionList = removeEle(data.conditionList, item, 'columnId')
        setConfig(data)
    }
    const delUser = (item) => {
        setConfig({
            ...config,
            nodeUserList: removeEle(config.nodeUserList, item, 'targetId')
        })
    }
    function getColumn(item, i) {
        let { nodeUserList } = config
        let { type, showType, showName, columnType, fixedDownBoxValue, optType, zdy1, zdy2, opt1, opt2} = item
        if (type === 1) {
            return (<div>
                <div className={nodeUserList.length > 0 ? 'selected_list line' : 'line'} onClick={addConditionRole} style={{ cursor: 'text' }}>
                    {
                        nodeUserList.length == 0 
                        ? <p class="like_input" onClick={addConditionRole}>{nodeUserList.length === 0?'请选择具体人员/角色/部门':''}</p> 
                        : nodeUserList.map((item1, index1) => <span key={index1}>{item1.name}<img src={closeIcon} onClick={() => delUser(item1)} alt="" /></span>)
                    }
                </div>
            </div>)
        } else if (columnType == 'String' && showType == 3) {
            let list = Object.values(JSON.parse(fixedDownBoxValue))
            return (<div>
                <div className="check_box line">
                    {list.map(({key, value}) => (<a className={ toggleStrClass(item, key)?'active':'' } key={key}
                        onClick={() => checkEvent(item, key, i)}>{value}</a>))}
                </div>
            </div>)
        } else {
            return (<div>
                <div className='line'>
                    <Select className="select" value={optType} options={optTypes}
                        style={{ width: optType == 6 ? 370 : 100 }} onChange={(e) => changeOptType(e, item, i, "optType")}></Select>
                    {
                        optType != 6 ? <InputNumber placeholder={`请输入${showName}`} value={zdy1} controls={false} bordered={false} onChange={(e) => changeOptType(e, item, i, "zdy1")} /> : ''
                    }
                </div>
                {
                    optType == 6 ? (<div className='line between'>
                        <InputNumber className="mr_10" value={zdy1} controls={false} bordered={false} onChange={(e) => changeOptType(e, item, i, "zdy1")} />
                        <Select className="select" value={opt1} options={opt1s} onChange={(e) => changeOptType(e, item, i, "opt1")}></Select>
                        <span className="ellipsis">{showName}</span>
                        <Select className="select ml_10" value={opt2} options={opt1s} onChange={(e) => changeOptType(e, item, i, "opt2")}></Select>
                        <InputNumber value={zdy2} controls={false} bordered={false} onChange={(e) => changeOptType(e, item, i, "zdy2")} />
                    </div>) : ''
                }
            </div>)
        }
    }
    
    let icon = <span className="ant-icon-close"></span>
    let extra = () => {
        let list = Array.from({length: configs.conditionNodes.length},(_,i)=>({value: i+1, label: `优先级${i+1}`}))
        return (<Select style={{marginRight: 20}} value={config.priorityLevel} options={list} onChange={(e)=> changePriortyLevel(e)}></Select>)
    }
    return (<Drawer title="条件设置" extra={extra()} open={conditionDrawer} className="condition_copyer" closable={false} width={550} onClose={saveCondition}>
        <div className="demo-drawer-content">
            <div className="condition_content drawer_content">
                <p className="tip">当审批单同时满足以下条件时进入此流程</p>
                <ul>
                    {
                        config.conditionList.map((item, index) => <li key={index}>
                            <span className="ellipsis">{item.type == 1 ? '发起人' : item.showName}：</span>
                            {getColumn(item, index)}
                            <a onClick={() => delItem(item)}>删除</a> 
                        </li>)
                    }
                </ul>
                <Button type="primary" onClick={addCondition}>添加条件</Button>
                <Modal title="选择条件" open={conditionVisible} width={480} okText='确 定' closeIcon={icon} onOk={sureCondition} cancelText='取 消' onCancel={()=> setConditionVisible(false)} className="condition_list">
                    <p>请选择用来区分审批流程的条件字段</p>
                    <p className="check_box">
                        <a className={ toggleClass(conditionList, { columnId: 0 }, 'columnId')? 'active': ''} onClick={() => checkedHandle()}>发起人</a>
                        {conditions.map((item, index) => <a key={index} 
                            className={ toggleClass(conditionList, item, 'columnId')?'active':''} 
                            onClick={() => checkedHandle(item)}>{item.showName}</a>
                        )}
                    </p>
                </Modal>
            </div>
            <SelectDialog
                type="employeesRole"
                visible={conditionRoleVisible}
                setVisible={setConditionRoleVisible}
                data={checkedList}
                changeEvent={sureConditionRole}
                isDepartment={true}
            />
            <div className="demo-drawer-footer clear">
                <Button type="primary" onClick={saveCondition}>确 定</Button>
                <Button onClick={closeDrawer}>取 消</Button>
            </div>
        </div>
    </Drawer>)
}