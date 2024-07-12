
import { createContext, useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import MThree from './components/three';
import Edit from './components/edit'
import 'antd/dist/reset.css';
export interface IEdit {
  update: (newCtx: Partial<Omit<IEdit, 'update'>>) => any
  mythree?: MThree,
  forceUpdate?: object
}
const defaultObj: IEdit = {
  update() { },
};
export const EditContext = createContext<IEdit>(defaultObj);
function App() {
  const [ctx, setCtx] = useState({
    ...defaultObj,
    update(newCtx: any) {
      setCtx((prevCtx) => {
        return { ...prevCtx, ...newCtx };
      });
    }
  });
  useEffect(() => {
    console.log('www');
  }, [])
  return (
    <EditContext.Provider value={ctx}>
      <Edit />
    </EditContext.Provider>
  )
}

export default App
