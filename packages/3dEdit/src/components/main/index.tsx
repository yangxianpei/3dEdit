import style from './index.module.less'
import Left from './left/index'
import Middle from './middle'
import Right from './right'

export default function () {
    return <div className={style.main}>
        <div className={style.left}>
            <Left />
        </div>
        <div className={style.middle}>
            <Middle />
        </div>
        <div className={style.right}>
            <Right />
        </div>
    </div>
}