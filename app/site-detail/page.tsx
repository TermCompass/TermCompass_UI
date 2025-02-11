'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation";

interface Site {
  name: string;
  logo: string;
  grade: string;
  benefits: string[];
  drawbacks: string[];
  link: string;
}

function SiteEvaluation() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const link = searchParams.get("link");

  const [site, setSite] = useState<Site | null>(null)
  const hostname = process.env.NEXT_PUBLIC_HOSTNAME;

  useEffect(() => {
    const fetchSiteData = async () => {
      // console.log(`fetch http://${hostname}:8080/site/${link} \n`);

      try {
        const response = await fetch(`http://${hostname}:8080/site/${link}`)
        if (!response.ok) {
          throw new Error('Failed to fetch site data')
        }
        const data = await response.json()
        setSite({
          name: data.name,
          logo: data.logo,
          grade: data.grade,
          benefits: data.benefits,
          drawbacks: data.drawbacks,
          link: data.link
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchSiteData()
  }, [link])

  if (!site) {
    return <div></div>
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">{site.name} 약관 평가</h1>
          <Button
            onClick={() => router.push('/site-analysis')}
            variant="outline"
          >
            돌아가기
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <div className="w-[100px] h-[100px] border-2 border-gray-300 rounded-lg overflow-hidden mr-4 flex items-center justify-center p-3">
              <img
                src={`/site-logo/${site.logo}`}
                alt={`${site.name} 로고`}
                width={80}
                height={80}
                className="object-contain w-auto h-auto max-w-[70px] max-h-[70px]"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{site.name}</h2>
              <p className="text-blue-600">{site.link}</p>
              <p className="text-xl font-bold mt-2">등급: {site.grade}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-1 md:grid-rows-3 gap-6 mb-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">소비자에게 유리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.benefits.map((clause: string, index: number) => (
                <li key={index} className="mt-2">{clause}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">소비자에게 불리한 조항</h3>
            <ul className="list-disc list-inside">
              {site.drawbacks.map((clause: string, index: number) => (
                <li key={index} className="mt-2">{clause}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}


// Wrap the component with Suspense
export default function SiteEvaluationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SiteEvaluation />
    </Suspense>
  );
}

