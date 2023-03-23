/*
 * @Date: 2023-03-15 16:42:35
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-17 15:03:13
 * @FilePath: /workflow-react/src/store/models.js
 */
export const models = {
  state: {
    tableId: '',
    isTried: false,
    promoterDrawer: false,
    flowPermission1: [],
    approverDrawer: false,
    approverConfig1: {},
    copyerDrawer: false,
    copyerConfig1: {},
    conditionDrawer: false,
    conditionsConfig1: {
      conditionNodes: [],
    },
  }, // 初始化状态
  reducers: {
    setTableId(status, payload) {
      return {...status, tableId: payload}
    },
    setIsTried(status, payload) {
      return {...status, isTried: payload}
    },
    setPromoter(status, payload) {
      return {...status, promoterDrawer: payload}
    },
    setFlowPermission(status, payload) {
      return {...status, flowPermission1: payload}
    },
    setApprover(status, payload) {
      return {...status, approverDrawer: payload}
    },
    setApproverConfig(status, payload) {
      return {...status, approverConfig1: payload}
    },
    setCopyer(status, payload) {
      return {...status, copyerDrawer: payload}
    },
    setCopyerConfig(status, payload) {
      return {...status, copyerConfig1: payload}
    },
    setCondition(status, payload) {
      return {...status, conditionDrawer: payload}
    },
    setConditionsConfig(status, payload) {
      return {...status, conditionsConfig1: payload}
    },
  },
}