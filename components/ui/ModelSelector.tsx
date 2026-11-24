'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { getAllModels, ModelInfo } from '@/lib/llm/provider';

export default function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { selectedProvider, setSelectedProvider, selectedModel, setSelectedModel } =
    useChatStore();
  const allModels = getAllModels();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [isOpen]);

  const handleSelect = (model: ModelInfo) => {
    setSelectedProvider(model.provider);
    setSelectedModel(model.id);
    setIsOpen(false);
  };

  const currentModel = allModels.find((m) => m.id === selectedModel);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex h-10 items-center gap-2 rounded-[10px] border border-hairline bg-ink-2 px-3 text-[12px] font-medium text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1 sm:h-9"
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" />
        <span className="max-w-[140px] truncate">
          {currentModel?.name || 'Select model'}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 text-paper-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="AI model"
          className="absolute right-0 top-full z-50 mt-2 w-80 animate-fade-rise overflow-hidden rounded-2xl border border-hairline-strong bg-ink-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          <div className="border-b border-hairline px-4 py-3">
            <h3 className="text-[13px] font-medium text-paper-1">Select model</h3>
          </div>

          <div className="max-h-80 overflow-y-auto py-1">
            {allModels.map((model) => {
              const selected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(model)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                    selected ? 'bg-ink-3' : 'hover:bg-ink-3/60'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium text-paper-1">
                        {model.name}
                      </span>
                      {selected && (
                        <Check
                          aria-hidden="true"
                          className="h-3.5 w-3.5 flex-shrink-0 text-accent"
                          strokeWidth={2}
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-paper-3">
                      {model.description}
                    </span>
                  </span>
                  <span className="flex flex-shrink-0 flex-col items-end gap-1">
                    {model.free && (
                      <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10px] font-medium leading-none text-paper-3">
                        Free
                      </span>
                    )}
                    {model.uncensored && (
                      <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10px] font-medium leading-none text-paper-3">
                        18+
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-hairline px-4 py-2.5">
            <span className="text-[11px] tabular-nums text-paper-3">
              {allModels.length} models
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
