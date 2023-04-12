/*
 * @Date: 2023-03-15 17:56:12
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-04-12 19:00:48
 * @FilePath: /workflow-react/src/components/NodeWrap/index.js
 */
import { useEffect, useId, useState } from "react";
import { cloneDeep } from 'lodash'
import { Input } from 'antd'
import { bgColors, placeholderList } from '@/utils/const'
import { arrToStr, setApproverStr, copyerStr, conditionStr } from "@/utils/index";
import AddNode from '@/components/AddNode'
import './index.scss'

let NodeWrap = (props) => {
    let { nodeConfig, flowPermission, changeEvent, updateEvent, store } = props
    let { isTried, flowPermission1, approverConfig1, copyerConfig1, conditionsConfig1, setPromoter, setApprover,
        setCopyer, setCondition, setFlowPermission, setApproverConfig, setCopyerConfig, setConditionsConfig } = store
    let _uid = useId();
    let [config, setConfig] = useState({ nodeUserList: [] })
    let [defaultText, setDefaultText] = useState('')
    let [showText, setShowText] = useState('')
    let [isInputList, setIsInputList] = useState([])
    let [isInput, setIsInput] = useState(false);
    useEffect(() => {
        setConfig(nodeConfig)
    }, [nodeConfig])
    useEffect(() => {
        setDefaultText(placeholderList[config.type])
        if (config.type == 1) {
            config.error = !setApproverStr(config)
        } else if (config.type == 2) {
            config.error = !copyerStr(config)
        } else if (config.type == 4) {
            resetConditionNodesErr()
        }
    }, [config])
    useEffect(() => {
        if (config.type == 0) {
            setShowText(arrToStr(flowPermission) || '所有人')
        } else if (config.type == 1) {
            setShowText(setApproverStr(config))
        } else if (config.type == 2) {
            setShowText(copyerStr(config))
        }
    }, [config, flowPermission])

    useEffect(() => {
        if (flowPermission1.flag && flowPermission1.id === _uid) {
            updateEvent(flowPermission1.value)
        }
    }, [flowPermission1])
    useEffect(() => {
        if (approverConfig1.flag && approverConfig1.id === _uid) {
            changeEvent(approverConfig1.value)
        }
    }, [approverConfig1])

    useEffect(() => {
        if (copyerConfig1.flag && copyerConfig1.id === _uid) {
            changeEvent(copyerConfig1.value)
        }
    }, [copyerConfig1])

    useEffect(() => {
        if (conditionsConfig1.flag && conditionsConfig1.id === _uid) {
            changeEvent(conditionsConfig1.value)
        }
    }, [conditionsConfig1])

    const resetConditionNodesErr = () => {
        for (var i = 0; i < config.conditionNodes.length; i++) {
            config.conditionNodes[i].error = conditionStr(config, i) == "请设置条件" && i != config.conditionNodes.length - 1;
        }
    }

    const clickEvent = (index) => {
        if (index || index === 0) {
            let data = [...isInputList]
            data[index] = true
            setIsInputList(data)
        } else {
            setIsInput(true)
        }
    };
    const InputEvent = (e, index) => {
        if (index || index === 0) {
            let { conditionNodes } = config
            conditionNodes[index].nodeName = e.target.value
            setConfig({ ...config, conditionNodes })
        } else {
            setConfig({ ...config, nodeName: e.target.value})
        }
    }
    const blurEvent = (index) => {
        if (index || index === 0) {
            let data = [...isInputList]
            data[index] = false
            setIsInputList(data)
            let conditionNodes = [...config.conditionNodes]
            conditionNodes[index].nodeName = conditionNodes[index].nodeName || "条件";
            changeEvent({ ...config, conditionNodes })
        } else {
            setIsInput(false)
            changeEvent({ ...config, nodeName: config.nodeName || defaultText })
        }
    };
    const delNode = () => {
        changeEvent(config.childNode ? {...config.childNode}: null)
    };
    const addTerm = () => {
        let len = config.conditionNodes.length + 1;
        config.conditionNodes.push({
            nodeName: "条件" + len,
            type: 3,
            priorityLevel: len,
            conditionList: [],
            nodeUserList: [],
            childNode: null,
        });
        resetConditionNodesErr()
        changeEvent(config)
    };
    const delTerm = (index) => {
        config.conditionNodes.splice(index, 1);
        config.conditionNodes.map((item, index) => {
            item.priorityLevel = index + 1;
            item.nodeName = `条件${index + 1}`;
        });
        resetConditionNodesErr()
        changeEvent({...config})
        if (config.conditionNodes.length == 1) {
            if (config.childNode) {
                if (config.conditionNodes[0].childNode) {
                    reData(config.conditionNodes[0].childNode, config.childNode);
                } else {
                    config.conditionNodes[0].childNode = config.childNode;
                }
            }
            changeEvent(config.conditionNodes[0].childNode)
        }
    };
    const reData = (data, addData) => {
        if (!data.childNode) {
            data.childNode = addData;
        } else {
            reData(data.childNode, addData);
        }
    };
    const setPerson = (priorityLevel) => {
        var { type } = config;
        if (type == 0) {
            setPromoter(true);
            setFlowPermission({
                value: flowPermission,
                flag: false,
                id: _uid,
            });
        } else if (type == 1) {
            setApprover(true);
            setApproverConfig({
                value: {
                    ...cloneDeep(config),
                    ...{ settype: config.settype ? config.settype : 1 },
                },
                flag: false,
                id: _uid,
            });
        } else if (type == 2) {
            setCopyer(true);
            setCopyerConfig({
                value: cloneDeep(config),
                flag: false,
                id: _uid,
            });
        } else {
            setCondition(true);
            setConditionsConfig({
                value: cloneDeep(config),
                priorityLevel,
                flag: false,
                id: _uid,
            });
        }
    };
    const arrTransfer = (index, type = 1) => {
        //向左-1,向右1
        config.conditionNodes[index] = config.conditionNodes.splice(
            index + type,
            1,
            config.conditionNodes[index]
        )[0];
        config.conditionNodes.map((item, index) => {
            item.priorityLevel = index + 1;
        });
        resetConditionNodesErr()
        changeEvent(config)
    };
    const changeConfig = (childNode, i) => {
        if(typeof i === 'number'){
            let { conditionNodes } = config
            conditionNodes[i].childNode = childNode
            changeEvent({ ...config, conditionNodes})
        }else{
            changeEvent({ ...config, childNode })
        }
    }
    const updateChildNode = (childNode, i)=> {
        let { conditionNodes } = config
        conditionNodes[i].childNode = childNode
        changeEvent({ ...config, conditionNodes})
    }
    
    return (<>
        {config.type < 3 ? (<div className="node-wrap">
            <div className={`node-wrap-box ${config.type == 0 ? 'start-node' : ''} ${isTried && config.error ? 'active error' : ''}`}>
                <div className="title" style={{ background: `rgb(${bgColors[config.type]})` }}>
                    {config.type == 0 ? <span>{config.nodeName}</span> : (<>
                        <span className="iconfont">{config.type == 1 ? '' : ''}</span>
                        {isInput ? (<Input className="editable-title-input" onBlur={ ()=> blurEvent()} onChange={(e)=> InputEvent(e)}
                            onFocus={(e) => e.currentTarget.select()} value={config.nodeName} placeholder={defaultText} />) 
                            : <span className="editable-title" onClick={()=>clickEvent()}>{config.nodeName}</span>}
                        <i className="anticon anticon-close close" onClick={delNode}></i></>)}
                </div>
                <div className="content" onClick={() => setPerson()}>
                    <div className="text">
                        {!showText ? <span className="placeholder">请选择{defaultText}</span> : showText}
                    </div>
                    <i className="anticon anticon-right arrow"></i>
                </div>
                {(isTried && config.error) ? <div className="error_tip">
                    <i className="anticon anticon-exclamation-circle"></i>
                </div> : ''}
            </div>
            <AddNode childNodeP={config.childNode} changeEvent={changeConfig}/>
        </div>) : ''}
        {config.type == 4 ? (<div className="branch-wrap">
            <div className="branch-box-wrap">
                <div className="branch-box">
                    <button className="add-branch" onClick={addTerm}>添加条件</button>
                    {config.conditionNodes.map((item, index) => {
                        return (<div className="col-box" key={index}>
                            <div className="condition-node">
                                <div className="condition-node-box">
                                    <div className={`auto-judge ${isTried && item.error ? 'error active' : ''}`}>
                                        {index != 0 ? <div className="sort-left" onClick={() => arrTransfer(index, -1)}>&lt;</div> : ''}
                                        <div className="title-wrapper">
                                            {isInputList[index] ? <Input
                                                className="editable-title-input"
                                                onBlur={() => blurEvent(index)}
                                                onFocus={(e) => e.currentTarget.select()}
                                                onChange={(e)=> InputEvent(e, index)}
                                                value={item.nodeName}
                                            /> : <span className="editable-title" onClick={() => clickEvent(index)}>{item.nodeName}</span>}
                                            <span className="priority-title" onClick={() => setPerson(item.priorityLevel)}>优先级{item.priorityLevel}</span>
                                            <i className="anticon anticon-close close" onClick={() => delTerm(index)}></i>
                                        </div>
                                        {index != config.conditionNodes.length - 1 ? <div className="sort-right" onClick={() => arrTransfer(index)}>&gt;</div> : ''}
                                        <div className="content" onClick={() => setPerson(item.priorityLevel)}>{conditionStr(config, index)}</div>
                                        {isTried && item.error ? <div className="error_tip" >
                                            <i className="anticon anticon-exclamation-circle"></i>
                                        </div> : ''}
                                    </div>
                                    <AddNode childNodeP={item.childNode} changeEvent={(e)=> updateChildNode(e, index)}/>
                                </div>
                            </div>
                            {item.childNode ? <NodeWrap nodeConfig={item.childNode} changeEvent={(e)=>changeConfig(e, index)} store={store} /> : ''}
                            {index == 0 ? <>
                                <div className="top-left-cover-line"></div>
                                <div className="bottom-left-cover-line"></div>
                            </> : ''}
                            {index == config.conditionNodes.length - 1 ? <>
                                <div className="top-right-cover-line"></div>
                                <div className="bottom-right-cover-line"></div>
                            </> : ''}
                        </div>)
                    })}
                </div>
                <AddNode childNodeP={config.childNode}  changeEvent={changeConfig}/>
            </div>
        </div>) : ''}
        {config.childNode ? (<NodeWrap nodeConfig={config.childNode} changeEvent={changeConfig} store={store} />) : ''}
    </>)
}

export default NodeWrap