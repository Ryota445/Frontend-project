import React from 'react'

function ModalDetailCompany({isVisible,onClose, children}) {
    if(!isVisible) return null;
  return (
    <>
        

        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>

        <div className='bg-white rounded-lg p-6 w-96 relative'>
          <button onClick={onClose} className='text-xl absolute top-0 right-3 text-gray-400 hover:text-gray-600'>&times;</button>
          {children}

        </div>
        </div>


    </>
  )
}

export default ModalDetailCompany