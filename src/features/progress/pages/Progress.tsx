import { useState } from 'react'
import { ExerciseProgressSection } from "../components/ExerciseProgressSection";
import { BodyWeightSection } from "../components/BodyWeightSection";
import { HistoryPage } from '../../history/pages/History';

type Tab = 'grafice' | 'istoric'

export function ProgressPage() {
  const [activeTab, setActiveTab] = useState<Tab>('grafice')

  return (
    <div className="pt-2">
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 mb-5">
        {(['grafice', 'istoric'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'grafice' ? 'Grafice' : 'Istoric'}
          </button>
        ))}
      </div>

      {activeTab === 'grafice' ? (
        <div className="space-y-6">
          <ExerciseProgressSection />
          <BodyWeightSection />
        </div>
      ) : (
        <HistoryPage />
      )}
    </div>
  )
}
