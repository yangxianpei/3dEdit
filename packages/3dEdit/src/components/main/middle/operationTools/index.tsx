
import style from "./index.module.less"
import IconFont from "3dEdit/src/components/iconfont"
import { Tooltip } from "antd"
import { useState } from 'react'
import ObjectsTools from "./objectsTools"
const tools = [
    { name: "几何物体", icon: 'icon-cube-fill' },
    { name: "灯光", icon: 'icon-icon-dengguang' },
    { name: "功能物体", icon: 'icon-a-IUNOUAU-energy-studio-32' },
    { name: "模型", icon: 'icon-moxing' },
    { name: "材质", icon: 'icon-caizhi' },
    { name: "贴图", icon: 'icon-tietu' },
    { name: "模板", icon: 'icon-moban' }
]
export default function () {
    const [active, setActive] = useState(-1)
    return <div className={style.operationsTools}>
        <div className={style.toolsname}>
            {
                tools.map((item, idx) => {
                    return <div key={idx} className={`${style.item} ${active == idx ? style.active : ''}`}>
                        <Tooltip placement="bottom" title={item.name} >
                            <IconFont type={item.icon} className={`${style.icon}`} onClick={() => {
                                setActive(active == idx ? -1 : idx)
                            }} />
                        </Tooltip>

                    </div>
                })
            }
        </div>
        {

            active != -1 && <div className={style.toolsparams}>
                <ObjectsTools type={active} />
            </div>
        }
    </div>
}