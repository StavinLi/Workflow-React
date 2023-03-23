/*
 * @Date: 2023-03-15 17:56:12
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-23 10:29:54
 * @FilePath: /workflow-react/src/components/Drawer/PromoterDrawer/index.js
 */

import { useEffect, useState } from 'react'
import { Button, Drawer } from 'antd'
import SelectDialog from '@/components/Dialog/SelectDialog'
import { arrToStr } from '@/utils/index'
import './index.scss'

export default function PromoterDrawer(props) {
    let { promoterDrawer, flowPermission1, setPromoter, setFlowPermission } = props.store
    let [promoterVisible, setPromoterVisible] = useState(false)
    let [config, setConfig] = useState([])
    let [checkedList, setCheckedList] = useState([])
    useEffect(() => {
        setConfig(flowPermission1.value)
    }, [flowPermission1])

    const addPromoter = () => {
        setCheckedList(config)
        setPromoterVisible(true)
    }
    const surePromoter = (data) => {
        setConfig(data)
        setPromoterVisible(false)
    }
    const savePromoter = () => {
        setFlowPermission({
            value: config,
            flag: true,
            id: flowPermission1.id
        })
        closeDrawer()
    }
    const closeDrawer = () => {
        setPromoter(false)
    }
    return (<Drawer title="发起人" open={promoterDrawer} className="set_promoter" closable={false} width={550} onClose={savePromoter}>
        <div className="demo-drawer-content">
            <div className="promoter_content drawer_content">
                <p>{arrToStr(config) || '所有人'}</p>
                <Button type="primary" onClick={addPromoter}>添加/修改发起人</Button>
            </div>
            <div className="demo-drawer-footer clear">
                <Button type="primary" onClick={savePromoter}>确 定</Button>
                <Button onClick={closeDrawer}>取 消</Button>
            </div>
            <SelectDialog
                type="employees"
                isDepartment={true}
                visible={promoterVisible}
                setVisible={setPromoterVisible}
                data={checkedList}
                changeEvent={surePromoter}
            />
        </div>
    </Drawer>)
}