import Hero from '@/components/Hero'
import ServiceCarousel from '@/components/ServiceCarousel'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import CTA from '@/components/CTA'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceCarousel />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  )
}