/*
 * @Date: 2022-08-29 14:39:11
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-17 15:36:01
 * @FilePath: /workflow-react/src/index.js
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, connect } from 'react-redux'
import store from './store'
import '@/css/override-element-ui.scss'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const mapState = ({ models: {tableId, isTried, promoterDrawer, flowPermission1, approverDrawer, approverConfig1, copyerDrawer, copyerConfig1, conditionDrawer, conditionsConfig1}}) => ({
  tableId, 
  isTried, 
  promoterDrawer, 
  flowPermission1, 
  approverDrawer, 
  approverConfig1, 
  copyerDrawer, 
  copyerConfig1, 
  conditionDrawer, 
  conditionsConfig1
})

const mapDispatch = ({models: {setTableId, setIsTried, setPromoter, setFlowPermission, setApprover, setApproverConfig, setCopyer, setCopyerConfig, setCondition, setConditionsConfig}}) => ({
  setTableId, 
  setIsTried, 
  setPromoter, 
  setFlowPermission, 
  setApprover, 
  setApproverConfig, 
  setCopyer, 
  setCopyerConfig, 
  setCondition, 
  setConditionsConfig
})

const AppContainer = connect(
  mapState,
  mapDispatch
)(App)
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <AppContainer/>
    </Provider>
  </React.StrictMode>
);
