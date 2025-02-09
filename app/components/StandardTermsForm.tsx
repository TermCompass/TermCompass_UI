import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import DomainSelection, { Domain } from '@/app/components/DomainSelection'

interface StandardTermsFormProps {
  domain: Domain
  onSubmit: (terms: string) => void
  onBack: () => void
}

export default function StandardTermsForm({ domain, onSubmit, onBack }: StandardTermsFormProps) {
  const [terms, setTerms] = useState<string>('')

  useEffect(() => {
    async function fetchTerms() {
      const fetchedTerms = await getStandardTerms(domain)
      setTerms(fetchedTerms)
    }
    fetchTerms()
  }, [domain])

  useEffect(() => {
    const editableContent = document.getElementById('editableContent')
    if (editableContent) {
      const h4Tags = editableContent.getElementsByTagName('h4')
      for (let i = 0; i < h4Tags.length; i++) {
        h4Tags[i].id = `h4-${i + 1}`
      }
    }
  }, [terms])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const editableContent = document.getElementById('editableContent')
    if (editableContent) {
      onSubmit(editableContent.innerHTML)
    }
  }

  const handleAddSection = () => {
    const editableContent = document.getElementById('editableContent')
    if (editableContent) {
      const newH4 = document.createElement('h4')
      const newOl = document.createElement('ol')
      newH4.textContent = 'New Section'
      newOl.innerHTML = '<li>New Item</li>'
      editableContent.appendChild(newH4)
      editableContent.appendChild(newOl)
      const h4Tags = editableContent.getElementsByTagName('h4')
      for (let i = 0; i < h4Tags.length; i++) {
        h4Tags[i].id = `h4-${i + 1}`
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4">{domain.filename} </h2>
      <style jsx global>{`
        #editableContent * {
          border: 1px solid lightgrey;
          margin: 5px;
          padding: 5px;
          border-radius: 5px;
        }

        #editableContent > h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        #editableContent > h4 {
          font-size: 1.0em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }

        #editableContent th,
        #editableContent td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }

        #editableContent > ol {
          list-style: none;
          counter-reset: list-counter;
        }

        #editableContent > ol > li {
          counter-increment: list-counter;
        }

        #editableContent > ol > li:nth-child(1)::before { content: '① '; }
        #editableContent > ol > li:nth-child(2)::before { content: '② '; }
        #editableContent > ol > li:nth-child(3)::before { content: '③ '; }
        #editableContent > ol > li:nth-child(4)::before { content: '④ '; }
        #editableContent > ol > li:nth-child(5)::before { content: '⑤ '; }
        #editableContent > ol > li:nth-child(6)::before { content: '⑥ '; }
        #editableContent > ol > li:nth-child(7)::before { content: '⑦ '; }
        #editableContent > ol > li:nth-child(8)::before { content: '⑧ '; }
        #editableContent > ol > li:nth-child(9)::before { content: '⑨ '; }
        #editableContent > ol > li:nth-child(10)::before { content: '⑩ '; }
        #editableContent > ol > li:nth-child(11)::before { content: '⑪ '; }
        #editableContent > ol > li:nth-child(12)::before { content: '⑫ '; }
        #editableContent > ol > li:nth-child(13)::before { content: '⑬ '; }
        #editableContent > ol > li:nth-child(14)::before { content: '⑭ '; }
        #editableContent > ol > li:nth-child(15)::before { content: '⑮ '; }
      `}</style>
      <div id="editableContent" className="mb-4 border p-2" contentEditable="true" dangerouslySetInnerHTML={{ __html: terms }}></div>
      <div className="flex justify-between">
        <Button className="bg-black text-white hover:bg-blue-600 hover:text-white" variant="outline" onClick={onBack}>이전</Button>
        <Button type="submit" className="bg-black text-white hover:bg-blue-600">다음</Button>
      </div>
    </form>
  )
}

async function getStandardTerms(domain: Domain): Promise<string> {
  try {
    const response = await fetch(`http://kyj9447.ddns.net:8080/standard/${domain.id}`, {
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