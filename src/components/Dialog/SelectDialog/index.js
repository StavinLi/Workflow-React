/*
 * @Date: 2023-03-15 17:56:12
 * @LastEditors: lichen39 lichen39@58.com
 * @LastEditTime: 2023-03-23 15:53:49
 * @FilePath: /workflow-react/src/components/Dialog/SelectDialog/index.js
 */
import { useEffect, useState } from 'react';
import { Modal, Tabs, Input } from 'antd'
import { getDepartments, getEmployees, getRoles } from '@/api/index'
import { toggleClass, toChecked, removeEle } from '@/utils/index'
import SelectBox from '../../SelectBox';
import SelectResult from '../../SelectResult';
import "./index.scss";

function SelectDialog(props) {
    let { type, visible, setVisible, changeEvent, data, isDepartment } = props
    let [departments, setDepartments] = useState({
        titleDepartments: [],
        childDepartments: [],
        employees: [],
    })
    let [roles, setRoles] = useState([])
    let [activeKey, setActiveKey] = useState('1')
    let [list, setList] = useState([])
    let [reList, setReList] = useState([])
    let [searchVal, setSearchVal] = useState('')
    let [checkedDepartmentList, setCheckedDepartmentList] = useState([])
    let [checkedEmployessList, setCheckedEmployessList] = useState([])
    let [checkedRoleList, setCheckedRoleList] = useState([])
    let items = [
        { key: '1', label: '组织架构' },
        { key: '2', label: '角色列表' },
    ]
    useEffect(() => {
        if (type !== 'employees') return;
        setList([{
            isDepartment: props.isDepartment,
            type: 'department',
            data: departments.childDepartments,
            isActive: (item) => toggleClass(checkedDepartmentList, item),
            change: (item) => setCheckedDepartmentList(toChecked(checkedDepartmentList, item)),
            next: (item) => getDepartmentList(item.id)
        }, {
            type: 'employee',
            data: departments.employees,
            isActive: (item) => toggleClass(checkedEmployessList, item),
            change: (item) => setCheckedEmployessList(toChecked(checkedEmployessList, item)),
        }])
    }, [isDepartment, departments, checkedDepartmentList, checkedEmployessList])

    useEffect(() => {
        if (type !== 'employees') return;
        let data = [{
            type: 'employee',
            data: checkedEmployessList,
            cancel: (item) => setCheckedEmployessList(removeEle(checkedEmployessList, item))
        }]
        if (props.isDepartment) {
            data.unshift({
                type: 'department',
                data: checkedDepartmentList,
                cancel: (item) => setCheckedDepartmentList(removeEle(checkedDepartmentList, item))
            })
        }
        setReList(data)
    }, [isDepartment, checkedEmployessList, checkedDepartmentList])

    useEffect(() => {
        if (type !== 'employeesRole') return;
        if (activeKey === '2') {
            setList([{
                type: 'role',
                not: false,
                data: roles,
                isActiveItem: (item) => toggleClass(checkedRoleList, item, 'roleId'),
                change: (item) => setCheckedRoleList(toChecked(checkedRoleList, item, 'roleId'))
            }])
        } else {
            setList([{
                isDepartment,
                type: 'department',
                data: departments.childDepartments,
                isActive: (item) => toggleClass(checkedDepartmentList, item),
                change: (item) => setCheckedDepartmentList(toChecked(checkedDepartmentList, item)),
                next: (item) => getDepartmentList(item.id)
            }, {
                type: 'employee',
                data: departments.employees,
                isActive: (item) => toggleClass(checkedEmployessList, item),
                change: (item) => setCheckedEmployessList(toChecked(checkedEmployessList, item)),
            }])
        }
    }, [activeKey, checkedRoleList, departments, isDepartment, roles, checkedDepartmentList, checkedEmployessList])

    useEffect(() => {
        if (type !== 'employeesRole') return;
        let data = [{
            type: 'role',
            data: checkedRoleList,
            cancel: (item) => setCheckedRoleList(removeEle(checkedRoleList, item, 'roleId'))
        }, {
            type: 'employee',
            data: checkedEmployessList,
            cancel: (item) => setCheckedEmployessList(removeEle(checkedEmployessList, item))
        }]
        if (props.isDepartment) {
            data.splice(1, 0, {
                type: 'department',
                data: checkedDepartmentList,
                cancel: (item) => setCheckedEmployessList(removeEle(checkedDepartmentList, item))
            })
        }
        setReList(data)
    }, [checkedRoleList, checkedEmployessList, checkedDepartmentList, isDepartment])

    useEffect(() => {
        if (type !== 'role') return;
        setList([{
            type: 'role',
            not: true,
            data: roles,
            isActive: (item) => toggleClass(checkedRoleList, item, 'roleId'),
            change: (item) => setCheckedRoleList([item])
        }])
    }, [roles, checkedRoleList])

    useEffect(() => {
        if (type !== 'role') return;
        setReList([{
            type: 'role',
            data: checkedRoleList,
            cancel: (item) => setCheckedRoleList(removeEle(checkedRoleList, item, 'roleId'))
        }])
    }, [checkedRoleList])

    useEffect(() => {
        if (visible) {
            setSearchVal('')
            if (type === 'employeesRole') setActiveKey('1')
            if (type === 'employees' || type === 'employeesRole') {
                getDepartmentList();
                setCheckedEmployessList(data.filter(item => item.type === 1).map(({ name, targetId }) => ({
                    employeeName: name,
                    id: targetId
                })))
                setCheckedDepartmentList(data.filter(item => item.type === 3).map(({ name, targetId }) => ({
                    departmentName: name,
                    id: targetId
                })))
            }
            if (type === 'role' || type === 'employeesRole') {
                if (type === 'role') getRoleList();
                setCheckedRoleList(data.map(({ name, targetId }) => ({
                    roleName: name,
                    roleId: targetId
                })))
            }
        }
    }, [visible])

    let getDepartmentList = async (parentId = 0) => {
        let { data } = await getDepartments({ parentId })
        setDepartments(data)
    }
    let getRoleList = async (data = {}) => {
        let { data: { list } } = await getRoles(data)
        setRoles(list)
    }
    let getDebounceData = async ({ target: { value: searchName } }) => {
        setSearchVal(searchName)
        if (searchName) {
            let data = {
                searchName,
                pageNum: 1,
                pageSize: 30
            }
            if (activeKey === '2' || type === 'role') {
                await getRoleList();
            } else {
                let res = await getEmployees(data)
                departments.employees = res.data.list
                setDepartments({
                    ...departments,
                    childDepartments: [],
                    employees: res.data.list
                })
            }
        } else {
            if (activeKey === '2' || type === 'role') {
                await getRoleList();
            } else {
                await getDepartmentList()
            }
        }
    }

    const handleClick = (e) => {
        setActiveKey(e)
        setSearchVal('')
        if (e === '1') {
            getDepartmentList();
        } else {
            getRoleList();
        }
    }

    const delList = () => {
        if (type === 'employees' || type === 'employeesRole') {
            setCheckedDepartmentList([])
            setCheckedEmployessList([])
        }
        if (type === 'role' || type === 'employeesRole') {
            setCheckedRoleList([])
        }
    }
    let saveDialog = () => {
        if (type === 'employees') {
            let checkedList = [
                ...checkedDepartmentList,
                ...checkedEmployessList
            ].map(item => ({
                type: item.employeeName ? 1 : 3,
                targetId: item.id,
                name: item.employeeName || item.departmentName
            }))
            changeEvent(checkedList)
        }
        if (type === 'role') {
            let checkedList = checkedRoleList.map(item => ({
                type: 2,
                targetId: item.roleId,
                name: item.roleName
            }))
            changeEvent(checkedList)
        }
        if (type === 'employeesRole') {
            let checkedList = [
                ...checkedRoleList,
                ...checkedEmployessList,
                ...checkedDepartmentList
            ].map(item => ({
                type: item.employeeName ? 1 : (item.roleName ? 2 : 3),
                targetId: item.id || item.roleId,
                name: item.employeeName || item.roleName || item.departmentName
            }))
            changeEvent(checkedList)
        }
    }
    let closeIcon = <span className="ant-icon-close"></span>

    const title = type !== 'role' ? '选择成员' : '选择角色'
    const showCompanyName = !searchVal && activeKey === '1' && type !== 'role'
    return (<Modal title={title} okText='确 定' closeIcon={closeIcon} onOk={saveDialog} cancelText='取 消' onCancel={() => setVisible(false)} open={visible} width={600} className="promoter_person">
        <div className="person_body clear">
            <div className="person_tree l">
                <Input style={{ textIndent: 10 }} placeholder="搜索成员" value={searchVal} onChange={getDebounceData} />
                {type === 'employeesRole' ? <Tabs activeKey={activeKey} onChange={handleClick} items={items}></Tabs> : ''}
                {showCompanyName ? <p className="ellipsis tree_nav">
                    <span onClick={() => getDepartmentList(0)} className="ellipsis">天下</span>
                    {
                        departments.titleDepartments.map((item, index) => {
                            return (<span className="ellipsis" key={index + 'a'} onClick={() => getDepartmentList(item.id)}>{item.departmentName}</span>)
                        })
                    }
                </p> : ''}
                <SelectBox list={list} />
            </div>
            <SelectResult del={delList} list={reList} />
        </div>
    </Modal>)
}
export default SelectDialog