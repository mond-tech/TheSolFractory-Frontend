import Footer from '@/src/components/global/Footer'
import Navbar from '@/src/components/global/Navbar'
import HomePage from '@/src/views/HomePage'

export default function page() {
  return (
    <div className=''>
      <Navbar />
      <main className=''>
        <HomePage />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
