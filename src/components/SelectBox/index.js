/*
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-23 17:57:34
 * @FilePath: /workflow-react/src/components/SelectBox/index.js
 */
import iconRole from '@/assets/images/icon_role.png'
import iconFile from '@/assets/images/icon_file.png'
import iconPeople from '@/assets/images/icon_people.png'
import './index.scss'

export default function SelectBox(props){
  let { list } = props
  let getNodeByType = (elem)=> {
    if(elem.type === 'role'){
      return elem.data.map(item=> (<li key={item.roleId} className={`check_box ${elem.isActive && elem.isActive(item)? 'active': ''} ${elem.not? 'not': ''}`}
        onClick={()=>elem.change(item)}>
        <a title={item.description} className={elem.isActiveItem && elem.isActiveItem(item)? 'active': ''}>
          <img src={iconRole} alt=""/>{item.roleName}
        </a>
      </li>))
    }else if(elem.type === 'department'){
      return elem.data.map(item=> (<li key={item.id} className={`check_box ${!elem.isDepartment? 'not': ''}`}>
        {
          elem.isDepartment? (<a className={elem.isActive(item)? 'active': ''} onClick={()=>elem.change(item)}>
            <img src={iconFile} alt=""/>{item.departmentName}</a>):
            (<a><img src={iconFile} alt="" />{item.departmentName}</a>)
        }
        <i onClick={()=> elem.next(item)}>下级</i>
      </li>))
    }else if(elem.type === 'employee'){
      return elem.data.map(item=> ( <li key={item.id} className="check_box">
      <a className={elem.isActive(item)? 'active': ''} onClick={()=> {elem.change(item)}} title={item.departmentNames}>
        <img src={iconPeople} alt="" />{item.employeeName}
      </a>
  </li>))
    }
  }
  return (<ul className="select-box">
    {list.map(elem=> getNodeByType(elem))}
  </ul>)
}

