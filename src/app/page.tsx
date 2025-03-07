import React from 'react'
import Page from "./product/page"
import Hero from "../components/Hero/page"
import AuthButton from "./auth/AuthButton"
import AuthModal from "./auth/AuthModal"


function page() {
  return (
    <div className=''>
      <Hero/>

      <Page/>
      
    </div>
  )
}

export default page
