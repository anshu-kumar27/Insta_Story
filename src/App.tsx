
import { useEffect, useState } from 'react'
import './App.css'
import Stories from './componenets/Stories'
import ImageLoading from './loading/ImageLoading'

function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])
  return (
    <>
      {
        loading ?
          (
            <>
              <ImageLoading />
            </>
          )
          :
          (
            <>
              <h1 className='instagram-txt'>Instagram</h1>
              <Stories />
            </>
          )
      }

    </>
  )
}

export default App
