import React from 'react'
import { Button } from "@/components/ui/button"

interface SectionNavigationProps {
  activeSection: number
  onNavigate: (index: number) => void
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ activeSection, onNavigate }) => {
  return (
    <div className="fixed bottom-4 z-40 left-8 bg-gray-800 bg-opacity-50 p-2 rounded-lg">
      <div className="flex flex-col space-y-2">
        <Button
          variant={activeSection === 0 ? "sectionActive" : "sectionInactive"}
          onClick={() => onNavigate(0)}
          className="w-8 h-8 p-0"
        >
          1
        </Button>
        <Button
          variant={activeSection === 1 ? "sectionActive" : "sectionInactive"}
          onClick={() => onNavigate(1)}
          className="w-8 h-8 p-0"
        >
          2
        </Button>
        <Button
          variant={activeSection === 2 ? "sectionActive" : "sectionInactive"}
          onClick={() => onNavigate(2)}
          className="w-8 h-8 p-0"
        >
          3
        </Button>
      </div>
    </div>
  )
}

export default SectionNavigation
