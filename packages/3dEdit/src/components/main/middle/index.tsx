import style from './index.module.less'
import MThree from '../../three'
import { useEffect, useRef, useContext } from 'react'
import type { IEdit } from '@/App';
import { EditContext } from '@/App'
import OperationTools from './operationTools';
import BottomTools from './bottomTools';
export default function () {
    const { update } = useContext<IEdit>(EditContext);
    const mythree = useRef<MThree>()
    useEffect(() => {
        mythree.current = new MThree({
            id: 'edit'
        })
        const scene = mythree.current.createScene()
        mythree.current.createBoxGeometry(scene)
        mythree.current.createHelper(scene)
        mythree.current.render()
        update({
            mythree: mythree.current,
            forceUpdate: {}
        })
    }, [])
    return <div className={style.main}  >
        <OperationTools />
        <BottomTools />
        <div className={style.viewHelper} id='viewHelperaa'>
            <canvas id='helpCanvas'></canvas>
        </div>
        <canvas id='edit' className={style.c} />
    </div>
}