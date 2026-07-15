import React from 'react'
import Hero from '../components/Hero/Hero'
import ProfileCompletionCard from '../components/ProfileCompletion/ProfileCompletionCard'

export default function Home(){
  return (
    <main>
      <Hero />
      <section className="container">
        <ProfileCompletionCard />
      </section>
    </main>
  )
}
