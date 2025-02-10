'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/app/components/Layout'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from '@/app/contexts/UserContext'
import DomainSelection from '@/app/components/DomainSelection'
import StandardTermsForm from '@/app/components/StandardTermsForm'
import CustomClauseForm from '@/app/components/CustomClauseForm'
import TermsReview from '@/app/components/TermsReview'

export default function CreateTerms() {
  const [step, setStep] = useState(1)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [standardTerms, setStandardTerms] = useState<string>('')
  const [customClauses, setCustomClauses] = useState<string[]>([])
  const { user } = useUser()
  const router = useRouter()

  if (!user || user.userType !== 'COMPANY') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardContent>
              <br />
              <p>로그인이 필요합니다.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(domain)
    setStep(2)
  }

  const handleStandardTermsSubmit = (terms: string) => {
    setStandardTerms(terms)
    setStep(3)
  }

  const handleCustomClauseAdd = (clause: string) => {
    setCustomClauses([...customClauses, clause])
  }

  const handleCustomClauseFinish = () => {
    setStep(4)
  }

  const handleReviewRequest = () => {
    // Redirect to the AI review result page
    router.push(`/create-terms/review-result?domain=${encodeURIComponent(selectedDomain || '')}&terms=${encodeURIComponent(standardTerms)}&clauses=${encodeURIComponent(JSON.stringify(customClauses))}`)
  }

  const handleback = () => {
    setStep(1)
    setSelectedDomain(null)
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8 min-h-[calc(100vh-13rem)]">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">약관 생성</h1>
        {step === 1 && <DomainSelection onSelect={handleDomainSelect} />}
        {step === 2 && (
          <StandardTermsForm 
            domain={selectedDomain!} 
            onSubmit={handleStandardTermsSubmit} 
            onBack={handleback}
          />
        )}
        {step === 3 && (
          <CustomClauseForm 
            onAdd={handleCustomClauseAdd} 
            onFinish={handleCustomClauseFinish}
            onBack={() => setStep(2)}
            clauses={customClauses}
          />
        )}
        {step === 4 && (
          <TermsReview 
            standardTerms={standardTerms} 
            customClauses={customClauses} 
            onBack={() => setStep(3)}
            onReviewRequest={handleReviewRequest}
          />
        )}
      </div>
    </Layout>
  )
}

