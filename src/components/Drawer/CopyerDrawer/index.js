/*
 * @Date: 2023-03-15 17:56:12
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-23 10:29:48
 * @FilePath: /workflow-react/src/components/Drawer/CopyerDrawer/index.js
 */
import { useEffect, useState } from 'react'
import { Drawer, Button, Checkbox } from 'antd'
import {removeEle, copyerStr} from '@/utils/index'
import SelectDialog from '@/components/Dialog/SelectDialog'
import closeIcon from '@/assets/images/add-close1.png'
import './index.scss'

export default function CopyerDrawer(props){
    let {copyerDrawer, copyerConfig1, setCopyerConfig, setCopyer } = props.store
    let [copyerVisible, setCopyerVisible] = useState(false)
    let [config, setConfig] = useState({nodeUserList: []})
    let [ccSelfSelectFlag, setCcSelfSelectFlag] = useState([])
    let [checkedList, setCheckedList] = useState([])
    useEffect(()=> {
        if(!copyerConfig1.value) return
        setConfig(copyerConfig1.value)
        setCcSelfSelectFlag(copyerConfig1.value.ccSelfSelectFlag == 0 ? [] : [copyerConfig1.value.ccSelfSelectFlag])
    }, [copyerConfig1])

    const addCopyer = () => {
        setCopyerVisible(true)
        setCheckedList(config.nodeUserList)
    }
    const sureCopyer = (data) => {
        setCopyerVisible(false)
        setConfig({...config, nodeUserList: data})
    }
    const saveCopyer = () => {
        let data = {
            ...config,
            ccSelfSelectFlag: ccSelfSelectFlag.length == 0 ? 0 : 1,
            error: copyerStr(config) 
        }
        setCopyerConfig({
            value: data,
            flag: true,
            id: copyerConfig1.id
        })
        closeDrawer();
    }
    const closeDrawer = () => {
        setCopyer(false)
    }    
    return (<Drawer title="抄送人设置" open={copyerDrawer} className="set_copyer" closable={false} width={550} onClose={saveCopyer}> 
        <div className="demo-drawer-content">
            <div className="copyer_content drawer_content">
                <Button type="primary" onClick={addCopyer}>添加成员</Button>
                <p className="selected_list">
                    {config.nodeUserList.map((item,index)=> (<span key={index}>{item.name}
                        <img src={closeIcon} onClick={()=>removeEle(config.nodeUserList,item,'targetId')}/>
                    </span>))}
                    {config.nodeUserList.length!=0? <a onClick={()=>config.nodeUserList=[]}>清除</a>:''}
                </p>
                <Checkbox.Group value={ccSelfSelectFlag} onChange={setCcSelfSelectFlag} className="clear">
                    <Checkbox value={1}>允许发起人自选抄送人</Checkbox>
                </Checkbox.Group>
            </div>
            <div className="demo-drawer-footer clear">
                <Button type="primary" onClick={saveCopyer}>确 定</Button>
                <Button onClick={closeDrawer}>取 消</Button>
            </div>
            <SelectDialog
                type="employeesRole"
                visible={copyerVisible} 
                setVisible={setCopyerVisible}
                data={checkedList}
                changeEvent={sureCopyer}
            />
        </div>
    </Drawer>)
}
