import React from 'react'
import FileUpload from '../components/fileupload/FileUpload'

const page = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl font-bold'>OCR</h1>
      <FileUpload />
      </div>

  )
}

export default page