'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/app/components/Layout'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from '@/app/contexts/UserContext'
import DomainSelection, { Domain } from '@/app/components/DomainSelection'
import StandardTermsForm from '@/app/components/StandardTermsForm'
import CustomClauseForm from '@/app/components/CustomClauseForm'
import TermsReview from '@/app/components/TermsReview'

const CreateTermsContent = () => {
  const [step, setStep] = useState(1)
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [terms, setTerms] = useState<string>('');
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

  const handleDomainSelect = async (domain: Domain) => {
    const fetchedTerms = await getStandardTerms(domain);
    setTerms(fetchedTerms);
    setSelectedDomain(domain);
    setStep(2)
  }

  const handleStandardTermsSubmit = (terms: string) => {
    // setStandardTerms(terms)
    // setStep(3)
  }

  const handleCustomClauseAdd = (clause: string) => {
    // setCustomClauses([...customClauses, clause])
  }

  const handleCustomClauseFinish = () => {
    // setStep(4)
  }

  // const handleReviewRequest = () => {
  //   // Redirect to the AI review result page
  //   router.push(`/create-terms/review-result?domain=${encodeURIComponent(selectedDomain || '')}&terms=${encodeURIComponent(standardTerms)}&clauses=${encodeURIComponent(JSON.stringify(customClauses))}`)
  // }

  const handleback = () => {
    setStep(1)
    setSelectedDomain(null)
  }
  
  async function getStandardTerms(domain: Domain): Promise<string> {
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME;

    try {
      const response = await fetch(`/standard/${domain.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('data.refined_text ', data.refined_text);
      return data.refined_text;
    } catch (error) {
      console.error('Error fetching standard terms:', error);
      return '해당 표준약관 로드중 에러가 발생했습니다.';
    }
  }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8 min-h-[calc(100vh-13rem)]">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">약관 생성</h1>
        {step === 1 && <DomainSelection onSelect={handleDomainSelect} />}
        {step === 2 && (
          <StandardTermsForm 
            domain={selectedDomain!}
            terms={terms}
            onSubmit={handleStandardTermsSubmit} 
            onBack={handleback}
          />
        )}
      </div>
    </Layout>
  )
}

export default function CreateTerms() {
  return <CreateTermsContent />
}

