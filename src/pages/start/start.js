import React from 'react'
import { Link } from 'react-router-dom'

import './start.css'
import '../../App.css'

function Start(){
  return(
    <div className='start frcc'>
      <Link className='s-link' to={`/home`} >欢迎使用</Link>
    </div>
  )
}

export default Start