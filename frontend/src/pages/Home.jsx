import React from 'react'
import '../pageStyles/Home.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
    <Navbar/>
    <div className='home-container'>
      <h2 className='home-heading'>Welcome to our E-commerce Store</h2>
    </div>
      <Footer/>
    </>
  )
}

export default Home