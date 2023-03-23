/*
 * @Date: 2023-03-15 17:56:12
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-23 15:51:50
 * @FilePath: /workflow-react/src/components/Dialog/ErrorDialog/index.js
 */
import { Modal } from 'antd';
import './index.scss'

export default (props) => {
    let { visible, list, setVisible } = props
    let closeIcon = <span className="ant-icon-close"></span>
    let closeModal = () => setVisible(false)
    return (
        <Modal title="提示" closeIcon={closeIcon} open={visible} okText="前往修改" onOk={closeModal} cancelText="我知道了" onCancel={closeModal}>
            <div className="ant-confirm-body">
                <i className="anticon anticon-close-circle" style={{ color: '#f00' }}></i>
                <span className="ant-confirm-title">当前无法发布</span>
                <div className="ant-confirm-content">
                    <div>
                        <p className="error-modal-desc">以下内容不完善，需进行修改</p>
                        <div className="error-modal-list">
                            {
                                list.map((item, index) => {
                                    return (
                                        <div className="error-modal-item" key={index}>
                                            <div className="error-modal-item-label">流程设计</div>
                                            <div className="error-modal-item-content">{item.name} 未选择{item.type}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}