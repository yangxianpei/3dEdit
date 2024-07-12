import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import style from './index.module.less'
import IconFont from '3dEdit/src/components/iconfont';
import { useContext, useMemo } from 'react';
import type { IEdit } from '@/App';
import { EditContext } from '@/App'
const objects = [
    {
        name: '立方体',
        icon: 'icon-lifangxing',
        id: 1
    },
    {
        name: '球形',
        icon: 'icon-qiuxing',
        id: 2
    },
    {
        name: '圆锥',
        icon: 'icon-yuanzhuiti',
        id: 3
    }
]
const lights = [

    {
        name: '点光',
        icon: 'icon-dianguang',
        id: 1
    },
    {
        name: '环境光',
        icon: 'icon-huanjingguang2',
        id: 2
    },
]


const functionalObjects = [
    {
        name: '透视相机',
        icon: 'icon-toushixiangji',
        id: 1
    },
    {
        name: '正交相机',
        icon: 'icon-zhengjiaoxiangji',
        id: 2
    },
]
export default function ({ type }: { type: number }) {

    const { update, mythree, forceUpdate } = useContext<IEdit>(EditContext);
    const items: CollapseProps['items'] = useMemo(() => {
        if (type == 0) {
            return [
                {
                    key: '1',
                    label: '参数物体',
                    children: <div className={style.objects}>
                        {
                            objects.map((item, idx) => {
                                return <div key={idx} className={style.object} onClick={() => addObject(item)}>
                                    <IconFont type={item.icon} className={`${style.icon}`} />
                                    <div className={style.font}>{item.name}</div>
                                </div>
                            })
                        }
                    </div>
                },
            ]
        }

        if (type == 1) {
            return [
                {
                    key: '1',
                    label: '灯光',
                    children: <div className={style.objects}>
                        {
                            lights.map((item, idx) => {
                                return <div key={idx} className={style.object} onClick={() => addLight(idx)}>
                                    <IconFont type={item.icon} className={`${style.icon}`} />
                                    <div className={style.font}>{item.name}</div>
                                </div>
                            })
                        }
                    </div>
                },
            ]
        }

        if (type == 2) {
            return [
                {
                    key: '1',
                    label: '相机',
                    children: <div className={style.objects}>
                        {
                            functionalObjects.map((item, idx) => {
                                return <div key={idx} className={style.object} onClick={() => addCramer()}>
                                    <IconFont type={item.icon} className={`${style.icon}`} />
                                    <div className={style.font}>{item.name}</div>
                                </div>
                            })
                        }
                    </div>
                },
            ]
        }
    }, [type])

    const addCramer = () => {
        mythree?.addCamera()
        update({
            forceUpdate: {}
        })
    }
    const addObject = (item: any) => {
        if (item.id == 1) {
            const sence = mythree?.getActiveScene()
            if (sence) {
                mythree?.createBoxGeometry(sence)
            }
            update({
                forceUpdate: {}
            })
        }
    }
    const addLight = (idx: number) => {
        mythree?.addLights(idx)
        update({
            forceUpdate: {}
        })
    }
    return <Collapse items={items} defaultActiveKey={['1']} className={style.collapse} />;
}

