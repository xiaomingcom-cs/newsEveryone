
import './App.css'
import 'antd/dist/reset.css';
import React, { useEffect } from 'react'
import IndexRouter from './router/IndexRouter'
// import Child from './Child'
// import axios from 'axios'

export default function App() {

// useEffect(()=>{
//   axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E9%9D%92%E5%B2%9B&ci=60&channelId=4").then(res => {
//     console.log(res.data)
//   })
// },[])

  return (
    
      <IndexRouter></IndexRouter>
   
  )
}
