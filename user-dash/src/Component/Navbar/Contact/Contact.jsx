import React from 'react'
import ContactPricing from './ContactPricing'
import BranchOffices from './BranchOffices'
import FaqWithMap from './FaqMapComponent'

function Contact() {
  return (
    <div className=''>
      <div className=" bg-[#F3F6FB] w-full ">
        <ContactPricing />
      </div>
      <BranchOffices />
      <FaqWithMap/>


      
    </div>
  )
}

export default Contact
