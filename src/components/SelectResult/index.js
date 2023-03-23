import iconRole from '@/assets/images/icon_role.png'
import iconFile from '@/assets/images/icon_file.png'
import iconPeople from '@/assets/images/icon_people.png'
import iconCancel from '@/assets/images/cancel.png'
import './index.scss'

export default function SelectResult(props){
    let {list, del} = props
    const getNodeByType = ({type, data, cancel})=> {
        if(type === 'role') {
            return data.map(item=> (
                <li key={item.roleId}>
                    <img src={iconRole}/>
                    <span>{item.roleName}</span>
                    <img src={iconCancel} onClick={()=>cancel(item)}/>
                </li>
            ))
        }else if(type === 'department'){
            return data.map(item=> (
                <li key={item.id}>
                    <img src={iconFile}/>
                    <span>{item.departmentName}</span>
                    <img src={iconCancel} onClick={()=>cancel(item)}/>
                </li>
            ))
        }else if(type === 'employee'){
            return data.map(item=> (
                <li key={item.id}>
                    <img src={iconPeople} />
                    <span>{item.employeeName}</span>
                    <img src={iconCancel} onClick={()=>cancel(item)}/>
                </li>
            ))
        }
    }
    let total = list.reduce((a,b)=> a+b.data.length, 0)
    return (<div className="select-result l">
        <p className="clear">已选（{total}）
            <a onClick={del}>清空</a>
        </p>
        <ul>
            {list.map((item)=> getNodeByType(item))}
        </ul>
    </div>)
}

