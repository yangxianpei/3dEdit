import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import style from './index.module.less'
import type { IEdit } from '@/App';
import { EditContext } from '@/App'
import IconFont from '3dEdit/src/components/iconfont';
import { Object3D, Object3DEventMap } from 'three';






const App: React.FC = () => {
    const oldTreeData = useRef([])
    const { update, mythree, forceUpdate } = useContext<IEdit>(EditContext);
    const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);

    const delehandle = (item: Object3D<Object3DEventMap>) => {

        mythree?.removeObject3D(item)
        update({
            forceUpdate: {}
        })
    }
    const clickHandle = (item: Object3D<Object3DEventMap>) => {
        // setActive(idx)
        mythree?.setSelectObject(item)
    }
    const generateData = (level: string, object: any, ret: any[]) => {
        const flag = object.name.indexOf('auxiliaryline') > -1
        let obj = {
            title: <div className={style.treeTitle} onClick={() => clickHandle(object)}>{object?.name ?? 'NotName'}
                <div className={style.operbtn}>
                    <div className={style.icon}>
                        <IconFont type="icon-shifoukejian" />
                    </div>

                    <div className={style.icon} onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        delehandle(object)
                    }}>
                        <IconFont type="icon-shanchu" />
                    </div>
                </div>
            </div>,
            key: level,
            uuid: object.uuid,
            children: []
        }

        if (object.children?.length && !flag) {
            object.children.forEach((item: any, idx: any) => {
                generateData(`${level}-${idx}`, item, obj.children)
            });
        }
        ret.push(obj)
    };


    const sceneArr = useMemo(() => {
        const objects = mythree?.getActiveSenceCanOprObject()
        oldTreeData.current = objects as any
        const ret: any[] = []

        objects?.forEach((item, idx) => {
            generateData(`${idx}`, item, ret)
        })

        return ret ?? []
    }, [mythree, forceUpdate])



    const onDrop = (info: any) => {
        const toTarget = info.node
        const dragTarget = info.dragNode
        const dropPosition = info.dropPosition


        const findOneHandle = (sceneArr: any[], uuid: string) => {
            for (let i = 0; i < sceneArr.length; i++) {
                const t = sceneArr[i]
                if (t.uuid == uuid) {

                    return t
                }

                if (t.children?.length) {
                    const ret: any = findOneHandle(t.children, uuid)
                    if (ret) {

                        return ret
                    }

                }
            }
            return null
        }

        const toRealobj = findOneHandle(oldTreeData.current, toTarget.uuid)
        const dragRealobj = findOneHandle(oldTreeData.current, dragTarget.uuid)

        if (!info.dropToGap) {
            toRealobj.add(dragRealobj)
        } else {
            if (dropPosition === -1) {
                toRealobj.parent.add(dragRealobj)
            } else {
                toRealobj.parent.add(dragRealobj)
            }
        }
        dragRealobj.userData?.updateActiveBox?.()
        update({
            forceUpdate: {}
        })
    };

    return (
        <Tree
            showIcon={false}
            className={style.draggableTree}
            // defaultExpandedKeys={expandedKeys}
            draggable
            blockNode

            onDrop={onDrop}
            treeData={sceneArr}
        />
    );
};

export default App;