import style from './index.module.less'
import Scenes from './scenes'
import Objects from './objects'
export default function () {
    return <div className={style.left}>
        <div className={style.scenes}>
            <Scenes />
        </div>
        <div className={style.objects}>
            <Objects />
        </div>
    </div>
}