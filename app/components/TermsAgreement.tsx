import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TermsAgreementProps {
  onAgree: () => void
  onCancel: () => void
}

export default function TermsAgreement({ onAgree, onCancel }: TermsAgreementProps) {
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)

  const handleAgree = () => {
    if (termsAgreed && privacyAgreed) {
      onAgree()
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>이용 약관 동의</CardTitle>
        <CardDescription>서비스 이용을 위해 약관에 동의해 주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">이용 약관</h3>
          <ScrollArea className="h-[100px] border p-2 rounded">
            <div>
                <h2>약관나침반 이용약관</h2>

                <h3>제1조 (목적)</h3>
                <p>본 약관은 약관나침반(이하 "서비스")을 이용함에 있어, 회원과 서비스 제공자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>

                <h3>제2조 (정의)</h3>
                <ul>
                    <li><strong>"회원"</strong>이라 함은 본 약관에 동의하고 서비스를 이용하는 개인 또는 법인을 의미합니다.</li>
                    <li><strong>"서비스"</strong>라 함은 약관 검토, 생성 및 챗봇 기능을 포함한 약관나침반의 제공 기능을 의미합니다.</li>
                </ul>

                <h3>제3조 (약관의 효력 및 변경)</h3>
                <ul>
                    <li>본 약관은 회원이 가입 시 동의함으로써 효력이 발생합니다.</li>
                    <li>서비스는 관련 법령을 준수하는 범위 내에서 약관을 개정할 수 있으며, 변경된 약관은 공지 후 적용됩니다.</li>
                </ul>

                <h3>제4조 (회원가입 및 관리)</h3>
                <ul>
                    <li>회원가입은 실명 및 정확한 정보를 제공해야 합니다.</li>
                    <li>회원이 허위 정보를 제공하거나 부정한 방법으로 가입한 경우, 서비스 이용이 제한될 수 있습니다.</li>
                </ul>

                <h3>제5조 (서비스 이용 및 제한)</h3>
                <ul>
                    <li>회원은 서비스를 이용하여 법령을 위반하거나 타인의 권리를 침해해서는 안 됩니다.</li>
                    <li>서비스는 운영상 필요에 따라 일부 기능을 제한하거나 중단할 수 있습니다.</li>
                </ul>

                <h3>제6조 (개인정보 보호)</h3>
                <p>회원의 개인정보는 관련 법령에 따라 보호되며, 서비스의 개인정보처리방침에 따라 관리됩니다.</p>

                <h3>제7조 (면책 조항)</h3>
                <ul>
                    <li>서비스는 회원이 작성하거나 검토한 약관의 법적 효력을 보장하지 않으며, 최종적인 법률 검토는 전문가의 조언을 따르는 것을 권장합니다.</li>
                    <li>시스템 장애, 천재지변 등의 사유로 인해 서비스가 중단될 경우, 이에 대한 책임을 부담하지 않습니다.</li>
                </ul>

                <h3>제8조 (분쟁 해결 및 준거법)</h3>
                <ul>
                    <li>서비스 이용과 관련하여 분쟁이 발생할 경우, 원만한 해결을 위해 최선을 다합니다.</li>
                    <li>본 약관과 관련된 모든 분쟁은 대한민국 법을 따릅니다.</li>
                </ul>

                <p><strong>본 약관에 동의하시면, 회원가입을 진행할 수 있습니다.</strong></p>
            </div>

          </ScrollArea>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="terms" checked={termsAgreed} onCheckedChange={(checked) => setTermsAgreed(checked as boolean)} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              이용 약관에 동의합니다
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">개인정보 수집 및 제공 약관</h3>
          <ScrollArea className="h-[100px] border p-2 rounded">
            <div>
                <h2>개인정보 수집 및 이용 약관</h2>

                <h3>제1조 (목적)</h3>
                <p>본 약관은 약관나침반(이하 "서비스")이 회원의 개인정보를 수집·이용·보관 및 제공하는 기준과 절차를 규정함을 목적으로 합니다.</p>

                <h3>제2조 (수집하는 개인정보 항목 및 수집 방법)</h3>
                <p>1. 서비스는 회원가입 및 원활한 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.</p>
                <ul>
                    <li><strong>필수항목:</strong> 이름, 이메일 주소, 비밀번호</li>
                    <li><strong>선택항목:</strong> 법인명, 사업자 등록 번호(법인 회원의 경우)</li>
                </ul>
                <p>2. 개인정보는 다음과 같은 방법으로 수집됩니다.</p>
                <ul>
                    <li>회원가입 시 입력</li>
                    <li>서비스 이용 과정에서 자동으로 생성 및 수집</li>
                </ul>

                <h3>제3조 (개인정보의 수집 및 이용 목적)</h3>
                <p>서비스는 다음의 목적을 위해 수집된 개인정보를 이용합니다.</p>
                <ul>
                    <li>회원 가입 및 관리 (본인 확인, 계정 관리, 고객 지원)</li>
                    <li>약관 검토 및 생성 등 서비스 제공</li>
                    <li>서비스 이용 통계 분석 및 개선</li>
                    <li>법령 및 약관 위반 회원에 대한 이용 제한 조치</li>
                </ul>

                <h3>제4조 (개인정보의 보유 및 이용 기간)</h3>
                <p>1. 회원의 개인정보는 서비스 이용 기간 동안 보관되며, 회원 탈퇴 시 즉시 삭제됩니다.</p>
                <p>2. 단, 관련 법령에 따라 일정 기간 보관해야 하는 경우, 해당 법령에서 정한 기간 동안 보관됩니다.</p>
                <ul>
                    <li>전자상거래법에 따른 계약 또는 청약철회 기록: 5년</li>
                    <li>소비자 불만 및 분쟁 처리 기록: 3년</li>
                </ul>

                <h3>제5조 (개인정보의 제공 및 위탁)</h3>
                <p>1. 서비스는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.</p>
                <p>2. 단, 법령에 따라 요청이 있거나, 회원이 사전에 동의한 경우에 한하여 제공될 수 있습니다.</p>
                <p>3. 원활한 서비스 제공을 위해 필요한 경우, 개인정보 처리를 외부 업체에 위탁할 수 있으며, 위탁 시 관련 내용을 회원에게 공지합니다.</p>

                <h3>제6조 (회원의 권리 및 행사 방법)</h3>
                <p>1. 회원은 언제든지 본인의 개인정보를 조회하거나 수정할 수 있습니다.</p>
                <p>2. 회원은 서비스에 개인정보 삭제 및 처리 정지를 요청할 수 있으며, 요청 시 관련 법령에 따라 조치됩니다.</p>
                <p>3. 개인정보 보호 관련 문의는 서비스 고객센터를 통해 접수할 수 있습니다.</p>

                <h3>제7조 (개인정보 보호 조치)</h3>
                <p>서비스는 회원의 개인정보 보호를 위해 다음과 같은 조치를 시행합니다.</p>
                <ul>
                    <li>개인정보의 암호화 저장 및 전송</li>
                    <li>개인정보 접근 제한 및 권한 관리</li>
                    <li>해킹 및 보안사고 방지를 위한 기술적 조치</li>
                </ul>

                <h3>제8조 (개인정보 처리방침의 변경)</h3>
                <p>본 약관은 법령 및 서비스 정책 변경에 따라 개정될 수 있으며, 변경 시 공지사항을 통해 안내합니다.</p>

                <p><strong>본 약관에 동의하시면, 회원가입을 진행할 수 있습니다.</strong></p>
            </div>
          </ScrollArea>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="privacy" checked={privacyAgreed} onCheckedChange={(checked) => setPrivacyAgreed(checked as boolean)} />
            <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              개인정보 수집 및 제공 약관에 동의합니다
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>취소</Button>
        <Button className="bg-black text-white hover:bg-blue-600" onClick={handleAgree} disabled={!termsAgreed || !privacyAgreed}>동의</Button>
      </CardFooter>
    </Card>
  )
}

