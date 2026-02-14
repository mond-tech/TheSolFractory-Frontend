import Footer from '@/src/components/global/Footer'
import Navbar from '@/src/components/global/Navbar'
import AboutPage from '@/src/views/AboutPage'

export default function page() {
  return (
    <div className=''>
      <Navbar />
      <main className=''>
       <AboutPage />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
