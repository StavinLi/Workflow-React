/*
 * @Date: 2022-08-29 14:39:11
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-23 15:01:11
 * @FilePath: /workflow-react/src/views/setting/index.js
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, message } from 'antd';
import { getWorkFlowData, setWorkFlowData } from '@/api/index'
import ErrorDialog from "@/components/Dialog/ErrorDialog";
import PromoterDrawer from "@/components/Drawer/PromoterDrawer";
import ApproverDrawer from "@/components/Drawer/ApproverDrawer";
import CopyerDrawer from "@/components/Drawer/CopyerDrawer";
import ConditionDrawer from "@/components/Drawer/ConditionDrawer";
import NodeWrap from "@/components/NodeWrap";
import './index.css'

function Setting(props) {
    let { setTableId, setIsTried } = props
    let [errInfos, setErrInfos] = useState([])
    let [visible, setVisible] = useState(false)
    let [curSize, setCurSize] = useState(100)
    let [processConfig, setProcessConfig] = useState({})
    let [nodeConfig, setNodeConfig] = useState({ nodeUserList: [] })
    let [workFlowDef, setWorkFlowDef] = useState({})
    let [flowPermission, setFlowPermission] = useState([])
    let [directorMaxLevel, setDirectorMaxLevel] = useState(0)
    const [search] = useSearchParams();;
    useEffect(() => initData, [])
    const initData = async () => {
        let { data } = await getWorkFlowData({ workFlowDefId: search.get('workFlowDefId') })
        setProcessConfig(data)
        let {
            nodeConfig: nodes,
            flowPermission: flows,
            directorMaxLevel: directors,
            workFlowDef: works,
            tableId,
        } = data;
        setNodeConfig(nodes)
        setFlowPermission(flows)
        setDirectorMaxLevel(directors)
        setWorkFlowDef(works)
        setTableId(tableId);
    }
    const toReturn = () => {
        //window.location.href = ""
    };
    const reErr = ({ childNode }, data = []) => {
        if (childNode) {
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
        } else {
            return data
        }
    };
    const saveSet = async () => {
        setIsTried(true);
        let data = []
        reErr(nodeConfig, data);
        if (data.length !== 0) {
            setErrInfos(data)
            setVisible(true)
            return;
        }
        setProcessConfig({ ...processConfig, flowPermission })
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(processConfig));
        let res = await setWorkFlowData(processConfig);
        if (res.code === 200) {
            message.success("设置成功")
            setTimeout(function () {
                window.location.href = "";
            }, 200);
        }
    };
    const zoomSize = (type) => {
        if (type === 1) {
            if (curSize === 50) {
                return;
            }
            setCurSize(curSize - 10);
        } else {
            if (curSize === 300) {
                return;
            }
            setCurSize(curSize + 10);
        }
    };
    return (
        <div>
            <div className="fd-nav">
                <div className="fd-nav-left">
                    <div className="fd-nav-back" onClick={toReturn}>
                        <i className="anticon anticon-left"></i>
                    </div>
                    <div className="fd-nav-title">{workFlowDef.name}</div>
                </div>
                <div className="fd-nav-right">
                    <Button className="button-publish" onClick={saveSet}>发 布</Button>
                </div>
            </div>
            <div className="fd-nav-content">
                <section className="dingflow-design">
                    <div className="zoom">
                        <div className={`zoom-out ${curSize === 50 ? 'disabled' : ''}`} onClick={() => zoomSize(1)}></div>
                        <span>{curSize}%</span>
                        <div className={`zoom-in ${curSize === 300 ? 'disabled' : ''}`} onClick={() => zoomSize(2)}></div>
                    </div>
                    <div className="box-scale" style={{ transform: `scale(${curSize / 100})` }}>
                        <NodeWrap nodeConfig={nodeConfig} flowPermission={flowPermission} store={props} changeEvent={setNodeConfig} updateEvent={setFlowPermission} />
                        <div className="end-node">
                            <div className="end-node-circle"></div>
                            <div className="end-node-text">流程结束</div>
                        </div>
                    </div>
                </section>
            </div>
            <ErrorDialog visible={visible} list={errInfos} store={props} setVisible={setVisible} />
            <ApproverDrawer directorMaxLevel={directorMaxLevel} store={props} />
            <PromoterDrawer store={props} />
            <CopyerDrawer store={props} />
            <ConditionDrawer store={props} />
        </div>
    );
}
export default Setting;
