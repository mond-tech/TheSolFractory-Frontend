import React from 'react'
import HeroSection from '@/src/components/homepage/HeroSection'
import SolFactoryAdvantage from '@/src/components/homepage/SolFactoryAdvantage'
import MergedCards from '@/src/components/homepage/ConeShowCase'
import TrustConesSection from '@/src/components/homepage/TrustConesSection'
import Carousel from '@/src/components/homepage/Carousel'

export default function HomePage() {
  return (
    <div>
        {/* Hero Section */}
        <HeroSection />
        <Carousel />
        <SolFactoryAdvantage />
        <MergedCards />
        <TrustConesSection />
    </div>
  )
}
