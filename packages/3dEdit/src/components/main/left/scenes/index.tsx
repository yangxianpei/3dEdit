import style from './index.module.less'
import { PlusOutlined } from '@ant-design/icons';
import { useState, useContext, useMemo } from 'react'
import type { IEdit } from '@/App';
import { EditContext } from '@/App'
import { Scene, Camera } from 'three';
import IconFont from '@/components/iconfont';

export default function () {
    const [active, setActive] = useState(0)
    const { update, mythree, forceUpdate } = useContext<IEdit>(EditContext);
    const addScene = () => {
        const scene = mythree?.createScene()
        if (scene) {
            mythree?.createBoxGeometry(scene)
            mythree?.createHelper(scene)
        }
        update({
            forceUpdate: {}
        })
    }

    const sceneArr = useMemo(() => {
        const scenes = mythree?.scenes
        const scenesMap = []
        if (scenes) {
            for (const [key, value] of scenes!.entries()) {
                scenesMap.push({
                    name: key,
                    ...value
                })
            }
        }
        return scenesMap
    }, [mythree, forceUpdate])

    const clickScene = (item: { scene?: Scene; cameras?: Camera[] | undefined; name: any; }, idx: number) => {
        mythree?.setActiveId(item.name)
        mythree?.render()
        setActive(idx)
        update({
            forceUpdate: {}
        })
    }
    return <div className={style.scenes}>
        <div className={style.t}>
            <IconFont type="icon-gis_changjing" className={style.icon} />
            <div className={style.name}>场景</div>
            <PlusOutlined onClick={addScene} />
        </div>
        <div className={style.r}>
            {
                sceneArr.map((item, idx) => {
                    return <div className={`${style.item} ${active == idx ? style.active : ""}`} key={idx} onClick={() => clickScene(item, idx)}>
                        场景-{item.name}
                    </div>
                })
            }
        </div>
    </div>
}