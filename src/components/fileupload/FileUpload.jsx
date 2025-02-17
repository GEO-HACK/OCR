"use client"

import React ,{useState} from 'react'

const FileUpload = () => {

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ocrResult, setOcrResult] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }
  const handleUpload = async () => {
    if(!file) return alert('Please select a file')
      setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try{
      const res = await fetch('api/ocr', {
        method: 'POST',
        body: formData
      });

      const data = await res.json()
      setOcrResult(data.text || 'No text found');
      
    }catch(err){
      console.error(err)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4'>
      <input type='file' onChange={handleFileChange} className='border p-2'/>
      <button onClick={handleUpload} className='bg-blue-500 text-white p-2 rounded' disabled={loading}>
        {loading ? 'Processing...' : 'Upload'}
      </button>
    </div>
  )
}

export default FileUpload