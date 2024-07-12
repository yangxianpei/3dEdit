import React, { useContext, useMemo, useState } from 'react'
import { Select, Tooltip } from 'antd';
import style from './index.module.less'
import type { IEdit } from '@/App';
import { EditContext } from '@/App'
import IconFont from '3dEdit/src/components/iconfont';
export default function () {
    const [value, setValue] = useState()
    const { update, mythree, forceUpdate } = useContext<IEdit>(EditContext);
    const handleChange = (value: any) => {
        setValue(value)
        mythree?.setSenceViewAngle(value)

    };
    const openToolHandle = (type: number) => {

        if (type == 1) {
            mythree?.setObjectVisible("axesHelper")
        }

        if (type == 2) {
            mythree?.setObjectVisible("grid")
        }

        if (type == 3) {
            mythree?.setObjectVisible("auxiliaryline")
        }
        update({
            forceUpdate: {}
        })
    }

    const cameraArr = useMemo(() => {
        const cameras = mythree?.getActiveObject('cameras')
        const retarr = cameras?.map((item, idx) => {
            return {
                label: item.name || '默认',
                value: idx
            }
        })
        return retarr
    }, [forceUpdate])
    const switchCameraHandle = (idx: number) => {
        mythree?.switchCamera(idx)
    }
    return <div className={style.bottomTools}>

        <Tooltip placement="top" title={'视角切换'} >
            <Select
                className={style.chooseScene}
                value={value}
                defaultValue={"defaultview"}
                style={{ width: 100 }}
                onChange={handleChange}
                options={[
                    {
                        label: '默认视图',
                        value: 'defaultview',
                    },
                    {
                        label: '俯视图',
                        value: 'topview',
                    },
                    {
                        label: '右视图',
                        value: 'rightview',
                    },
                    {
                        label: '左视图',
                        value: 'leftview',
                    },
                    {
                        label: '前视图',
                        value: 'frontview',
                    },
                    {
                        label: '后视图',
                        value: 'backview',
                    },
                    {
                        label: '仰视图',
                        value: 'upview',
                    },
                ]}
            />
        </Tooltip>
        <div className={style.controls}>
            <div onClick={() => openToolHandle(1)}>
                <Tooltip placement="top" title={'坐标'} >
                    <IconFont className={`${style.icon} ${mythree?.tools.has('axesHelper') ? style.active : ''}`} type='icon-sanweizuobiao' />
                </Tooltip>
            </div>
            <div onClick={() => openToolHandle(2)}>
                <Tooltip placement="top" title={'网格'} >
                    <IconFont className={`${style.icon} ${mythree?.tools.has('grid') ? style.active : ''}`} type='icon-wangge' />
                </Tooltip>
            </div>
            <div onClick={() => openToolHandle(3)}>
                <Tooltip placement="top" title={'控件'} >
                    <IconFont className={`${style.icon} ${mythree?.tools.has('auxiliaryline') ? style.active : ''}`} type='icon-kongjian' />
                </Tooltip>
            </div>
        </div>
        <Tooltip placement="top" title={'相机视角'} >
            <Select
                className={style.switchCamera}
                defaultValue={0}
                style={{ width: 100 }}
                onChange={switchCameraHandle}
                options={cameraArr}
            />
        </Tooltip>



    </div>
}