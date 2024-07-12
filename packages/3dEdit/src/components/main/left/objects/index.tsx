import style from './index.module.less'
import { useContext, useMemo, useState } from 'react'
import type { IEdit } from '@/App';
import { EditContext } from '@/App'
import IconFont from '3dEdit/src/components/iconfont';
import { Object3D, Object3DEventMap } from 'three';
import DragTree from './dragTree'
export default function () {

    const [active, setActive] = useState(-1)
    const { update, mythree, forceUpdate } = useContext<IEdit>(EditContext);

    const sceneArr = useMemo(() => {
        const objects = mythree?.getActiveObject('objects')
        setActive(-1)
        return objects
    }, [mythree, forceUpdate])
    const clickHandle = (item: Object3D<Object3DEventMap>, idx: React.SetStateAction<number>) => {
        setActive(idx)
        mythree?.setSelectObject(item)
    }

    const delehandle = (item: Object3D<Object3DEventMap>) => {

        mythree?.removeObject3D(item)
        update({
            forceUpdate: {}
        })
    }

    return <div className={style.objects}>
        <div className={style.t}>
            <IconFont type="icon-shujiegou" className={style.icon} />
            <div className={style.name}>结构</div>
        </div>
        <div className={style.r}>
            <DragTree />
            {/* {
                sceneArr?.map((item, idx) => {
                    return <div className={`${style.item} ${active == idx ? style.active : ""}`} onClick={() => clickHandle(item, idx)} key={item.uuid}>{Object.keys(item.userData).length ? item.userData.name : item.name}

                        <div className={style.operbtn}>
                            <div className={style.icon}>
                                <IconFont type="icon-shifoukejian" />
                            </div>

                            <div className={style.icon} onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                delehandle(item)
                            }}>
                                <IconFont type="icon-shanchu" />
                            </div>
                        </div>
                    </div>
                })
            } */}
        </div>
    </div>
}