/* eslint-disable react/button-has-type */
// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import allRoutes from '@demo/router';
import { formatItem } from '@demo/utils/fnTools/base/filterRoutes';
import styles from '@demo/renderer/App.less';

// function Hello() {
//   const [test, setTest] = useState(0);
//   return (
//     <div className={style.test}>
//       方法11这是发发发1111测试{test}
//       <button
//         onClick={() => {
//           setTest((pre) => pre + 1);
//         }}
//       >
//         点击
//       </button>
//     </div>
//   );
// }

export default function App() {
  const result = formatItem(allRoutes);
  console.log('result>>', result);

  return <div className={styles.appWrapper}>{useRoutes(allRoutes)}</div>;
}
