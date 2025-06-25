import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <Nav />
      <section id="home">
        <Hero />
      </section>
      <Features />
      <About />
      <section id="faq">
        <FAQ />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  )
}

export default App
