"use client";

import { useState, ReactNode } from "react";

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

export default function Tabs({
  tabs,
  defaultTab,
  active: controlledActive,
  onChange,
}: {
  tabs: TabItem[];
  defaultTab?: string;
  active?: string;
  onChange?: (key: string) => void;
}) {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.key);
  const active = controlledActive ?? internalActive;

  function setActive(key: string) {
    if (onChange) onChange(key);
    else setInternalActive(key);
  }

  return (
    <div>
      <div className="flex gap-1 border-b overflow-x-auto mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.key} className={active === tab.key ? "block" : "hidden"}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
