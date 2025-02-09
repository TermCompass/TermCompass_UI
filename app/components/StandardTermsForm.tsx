import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import DomainSelection, { Domain } from '@/app/components/DomainSelection'

interface StandardTermsFormProps {
  domain: Domain;
  terms: string;
  onSubmit: (terms: string) => void
  onBack: () => void
}

export default function StandardTermsForm({ domain, terms, onSubmit, onBack }: StandardTermsFormProps) {
  const [localTerms, setLocalTerms] = useState<string>(terms);
  const [htagscount, setHtagscount] = useState<number>(0)


  // useEffect all
  useEffect(() => {
    console.log("useEffect all");
    setLocalTerms(labelHtag(localTerms))
    addEventListeners();
    observeDomChanges();
  }, [])

  // useEffect terms
  useEffect(() => {
    console.log("useEffect terms");
    addEventListeners();
    observeDomChanges();
  }, [localTerms])

  // 하단 추가버튼 눌렀을때
  const handleAddLastSection = () => {
    console.log('handleAddLastSection');

    const parser = new DOMParser();
    const doc = parser.parseFromString(localTerms, 'text/html'); // getElement가 아닌 상태를 가져옴
    const editableContent = doc.body;

    if (editableContent) {

      // button
      const aButton = document.createElement('button')
      aButton.id = `button-${htagscount + 1}`
      aButton.className = 'addButton'
      aButton.textContent = '+조항 추가'
      aButton.contentEditable = 'false'

      // h4
      const newH4 = document.createElement('h4')
      newH4.id = `h4-${htagscount + 1}`
      newH4.textContent = '새 조항'
      setHtagscount(htagscount + 1)

      // p
      const newP = document.createElement('p')
      newP.textContent = '새 조항 상세 (사용하지 않으려면 내용을 지우세요.)'

      // ol
      const newOl = document.createElement('ol')
      newOl.innerHTML = '<li>새 항목 (사용하지 않으려면 내용을 지우세요.)</li>'

      // 새 섹션 추가
      editableContent.appendChild(aButton)
      editableContent.appendChild(newH4)
      editableContent.appendChild(newP)
      editableContent.appendChild(newOl)
      setLocalTerms(editableContent.innerHTML)
    }
  }

  // 중간 추가버튼 눌렀을때
  const handleAddTargetSection = function (thisButton: HTMLButtonElement) {
    console.log("handleAddTargetSection" + thisButton.id);

    const parser = new DOMParser();
    const doc = parser.parseFromString(localTerms, 'text/html');
    const editableContent = doc.body;
    const targetButton = editableContent.querySelector(`#${thisButton.id}`);

    if (targetButton && editableContent) {

      // button
      const addButton = document.createElement('button')
      addButton.id = `button-${htagscount + 1}`
      addButton.className = 'addButton'
      addButton.textContent = '+조항 추가'
      addButton.contentEditable = 'false'

      // h4
      const newH4 = document.createElement('h4')
      newH4.id = `h4-${htagscount + 1}`
      newH4.textContent = '새 조항'
      setHtagscount(htagscount + 1)

      // p
      const newP = document.createElement('p')
      newP.textContent = '새 조항 상세 (사용하지 않으려면 내용을 지우세요.)'

      // ol
      const newOl = document.createElement('ol')
      newOl.innerHTML = '<li>새 항목 (사용하지 않으려면 내용을 지우세요.)</li>'

      // 새 섹션 추가
      editableContent.insertBefore(addButton, targetButton.nextSibling);
      editableContent.insertBefore(newOl, targetButton.nextSibling);
      editableContent.insertBefore(newP, targetButton.nextSibling);
      editableContent.insertBefore(newH4, targetButton.nextSibling);
      setLocalTerms(editableContent.innerHTML)
    }
  }

  // h4 태그 id 전부 라벨링하는 함수
  const labelHtag = (terms: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(terms, 'text/html');
    const h4Tags = doc.getElementsByTagName('h4');
    for (let i = 0; i < h4Tags.length; i++) {
      // button
      const addButton = document.createElement('button')
      addButton.id = `button-${i + 1}`
      addButton.className = 'addButton'
      addButton.textContent = '+조항 추가'
      addButton.contentEditable = 'false'

      // h4 태그 이전에 버튼 추가
      h4Tags[i].parentNode?.insertBefore(addButton, h4Tags[i]);

      h4Tags[i].id = `h4-${i + 1}`;
    }
    setHtagscount(h4Tags.length);
    return doc.body.innerHTML;
  }

  // 이벤트 리스너 할당기
  const addEventListeners = () => {
    console.log("addEventListeners");

    const buttons = document.getElementsByClassName('addButton')
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as HTMLButtonElement
      button.addEventListener('click', function () {
        handleAddTargetSection(this);  // 클릭 시 실행할 함수
      })
    }
  }

  // h4 태그 삭제 감지기
  const observeDomChanges = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(localTerms, 'text/html');
    const editableContent = doc.body;

    if (editableContent) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.removedNodes.forEach((node) => {
              if (node.nodeName === 'H4') {
                const h4Id = (node as HTMLElement).id
                const buttonId = `button-${h4Id.split('-')[1]}`
                const button = editableContent.querySelector(`#${buttonId}`);
                if (button) {
                  button.remove()
                }
              }
            })
          }
        })
      })

      observer.observe(editableContent, { childList: true, subtree: true })
    }
  }

  return (
    <div>
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
      <div id="editableContent" className="mb-4 border p-2" contentEditable="true" dangerouslySetInnerHTML={{ __html: localTerms }}></div>
      <Button className="bg-black text-white hover:bg-blue-600 mt-4" onClick={handleAddLastSection}>마지막에 새 섹션 추가</Button>
      {/* <Button className="bg-black text-white hover:bg-blue-600 mt-4" onClick={() => onSubmit(localTerms)}>저장</Button>
      <Button className="bg-black text-white hover:bg-blue-600 mt-4" onClick={onBack}>뒤로</Button> */}
    </div>
  )
}
