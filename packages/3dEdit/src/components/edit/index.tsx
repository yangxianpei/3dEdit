
import style from './index.module.less'
import Footer from '../footer'
import Main from '../main'
import Header from '../header'
export default function () {
    return <div className={style.container}>
        <div className={style.header}>
            <Header />
        </div>
        <div className={style.main}>
            <Main />
        </div>
        <Footer />
    </div>
}