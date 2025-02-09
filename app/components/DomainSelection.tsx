import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DomainSelectionProps {
  onSelect: (domain: Domain) => void
}

export interface Domain {
  id: number;
  filename: string;
}

export default function DomainSelection({ onSelect }: DomainSelectionProps) {
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    async function fetchDomains() {
      try {
        const response = await fetch('http://kyj9447.ddns.net:8080/standard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('data ', data);

        setDomains(data);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    }

    fetchDomains();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">도메인 선택</h2>
      <p className="mb-4">귀하의 웹 서비스에 가장 적합한 도메인을 선택해주세요:</p>
      <ScrollArea className="h-[300px] border p-4 rounded">
        {domains.map((domain) => (
          <Button
            key={domain.id}
            onClick={() => onSelect(domain)}
            variant="outline"
            className="w-full mb-2"
          >
            {domain.filename}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}

