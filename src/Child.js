import React from 'react'
import  style from './Child.module.scss'
export default function Child() {
  console.log(style)
  return (
    <div>
      <ul>
        <li className={style.item}>child-11111</li>
        <li className={style.item}>child-22222</li>
      </ul>
    </div>
  )
}
