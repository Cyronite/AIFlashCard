import './App.css'
import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SignIn from './components/sighnin'
import SignUp from './components/sighnup'
import Homepage from './components/homepage'
function App() {
  const [page, setPage] = useState<'main' | 'signin' | 'signup'>('main')
  const [email, setEmail] = useState<string>('')
  
  const handleNavigate = (hash?: string) => {
    if (page !== 'main') {
      setPage('main')
      setTimeout(() => {
        if (hash) {
          window.location.hash = hash
          setTimeout(() => {
            const el = document.querySelector(hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }, 50)
    } else if (hash) {
      window.location.hash = hash
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    }
  }

  // Dashboard mode: if email is long enough (e.g. 5+ chars), show only Homepage
  if (email.length >= 5) {
    return (
      <div className="min-h-screen">
        <Homepage user={{ email }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <Nav onSignIn={() => setPage('signin')} onSignUp={() => setPage('signup')} onNavigate={(e?: React.MouseEvent<HTMLAnchorElement>) => handleNavigate(e?.currentTarget?.getAttribute('href') || undefined)} />
      {page === 'signin' ? (
        <SignIn onSignUp={() => setPage('signup')} onNavigate={handleNavigate} setEmail={setEmail}/>
      ) : page === 'signup' ? (
        <SignUp onSignIn={() => setPage('signin')} onNavigate={handleNavigate} setEmail={setEmail}/>
      ) : (
        <>
          <section id="home" className="scroll-mt-32">
            <Hero />
          </section>
          <section id="features" className="scroll-mt-32">
            <Features />
          </section>
          <section id="about" className="scroll-mt-32">
            <About />
          </section>
          <section id="faq" className="scroll-mt-32">
            <FAQ />
          </section>
          <section id="contact" className="scroll-mt-32">
            <Contact />
          </section>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
