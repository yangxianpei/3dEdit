import IconFont from '../iconfont'
import style from './index.module.less'
import { Button, Tooltip } from 'antd'
import { useState } from 'react'
const toolsBtn = [
    { name: "x轴", icon: 'icon-xzhou' },
    { name: "y轴", icon: 'icon-yzhou' },
    { name: "z轴", icon: 'icon-zzhou' },
    { name: "平移", icon: 'icon-move' },
    { name: "缩放", icon: 'icon-suofangjibie' },
    { name: "旋转", icon: 'icon-a-3Dxuanzhuan' },
]

export default function () {
    const [actives, setActives] = useState<any[]>([])
    return <div className={style.header}>
        <div className={style.logo}>
            FD3D
        </div>
        <div className={style.tools}>
            <div className={`${style.tool}`}>
                {
                    toolsBtn.map((item, idx) => {
                        return <div key={idx} className={`${style.btns} ${actives.includes(idx) ? style.active : ''}`} onClick={() => {
                            if (actives.includes(idx)) {
                                const dele = actives.findIndex(item => item == idx)
                                actives.splice(dele, 1)
                            } else {
                                actives.push(idx)
                            }
                            setActives([...actives])
                        }}>
                            <Tooltip placement="bottom" title={item.name}  >
                                <IconFont type={item.icon} className={`${style.icon}`} />
                            </Tooltip>
                        </div>
                    })
                }
            </div>
        </div>

        <div className={style.btns}>
            <Button type="primary">构建</Button>
        </div>
    </div>
}