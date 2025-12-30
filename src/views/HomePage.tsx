import React from 'react'
import HeroSection from '@/src/components/homepage/HeroSection'
import SolFactoryAdvantage from '@/src/components/homepage/SolFactoryAdvantage'
import MergedCards from '@/src/components/homepage/ConeShowCase'
import TrustConesSection from '@/src/components/homepage/TrustConesSection'
import Carousel from '@/src/components/homepage/Carousel'
import BlenderAnimation from "@/components/BlenderAnimation"
// import dynamic from 'next/dynamic';
import SmokeSection from '../../src/SmokeSection'
import { MergeAnimationViewer } from '../components/build/ConeMergeAnimtaion'

export default function HomePage() {
  return (
    <div>
        {/* Hero Section */}
        <HeroSection />
        <MergeAnimationViewer
          isAnimating
          state={{
            paperType: "cone",
            paperColorHex: "#A8E6CF",
            filterType: "wooden",
            filterColorHex: "#CBD5F5",
          }}
        />


        <Carousel />
        {/* <BlenderAnimation /> */}
        <SolFactoryAdvantage />
        <MergedCards />
        <TrustConesSection />
        <SmokeSection />
    </div>
  )
}
