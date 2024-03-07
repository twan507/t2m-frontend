// export default function PageLicenses() {
//     return (
//       <>
//         <div> T2M Licenses </div>
//         <div> T2M Licenses </div>
//         <div> T2M Licenses </div>
//         <div> T2M Licenses </div>
//         <div> T2M Licenses </div>
//         <div> T2M Licenses </div>
//       </>

//     )
//   }

'use client'
import React, { useState } from 'react';
import { Switch } from 'antd';




const App: React.FC = () => {

  const [checked, setChecked] = useState(false)


  return < Switch defaultChecked={checked} onChange={() => checked ? setChecked(false) : setChecked(true)} />
}

export default App;