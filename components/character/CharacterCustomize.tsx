'use client';

import { useState, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { X, Loader2, Image as ImageIcon, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface CharacterCustomizeProps {
  isOpen: boolean;
  onClose: () => void;
}

type SliderField = {
  key: string;
  label: string;
  min: number;
  max: number;
  unit: string;
};

const BODY_SLIDERS: SliderField[] = [
  { key: 'bust', label: 'Bust', min: 65, max: 120, unit: 'cm' },
  { key: 'waist', label: 'Waist', min: 50, max: 90, unit: 'cm' },
  { key: 'hips', label: 'Hips', min: 70, max: 120, unit: 'cm' },
  { key: 'height', label: 'Height', min: 145, max: 190, unit: 'cm' },
];

const ASS_SIZES = ['small', 'round', 'big', 'huge'];
const LEG_LENGTHS = ['short', 'average', 'long'];
const HAIR_LENGTHS = ['short', 'medium', 'long', 'very-long'];
const HAIR_COLORS = ['black', 'brown', 'blonde', 'red', 'pink', 'blue', 'purple', 'white', 'auburn', 'strawberry-blonde'];
const EYE_COLORS = ['brown', 'blue', 'green', 'hazel', 'grey', 'amber', 'violet'];
const EYE_SIZES = ['small', 'medium', 'large'];
const SKIN_TONES = ['fair', 'light', 'medium', 'tan', 'brown', 'dark'];
const BODY_TYPES = ['slim', 'athletic', 'curvy', 'thick', 'muscular'];
const ETHNICITIES = ['asian', 'korean', 'japanese', 'chinese', 'european', 'american', 'indian', 'latina', 'african', 'middle-eastern'];

export default function CharacterCustomize({ isOpen, onClose }: CharacterCustomizeProps) {
  const {
    bodySettings,
    updateAppearance,
    generateCharacterImage,
    isGeneratingImage,
    characterImageUrl,
  } = useChatStore();

  const [localSettings, setLocalSettings] = useState({
    bust: bodySettings?.bust || '80',
    waist: bodySettings?.waist || '62',
    hips: bodySettings?.hips || '88',
    height: bodySettings?.height || '165',
    bodyType: bodySettings?.bodyType || 'curvy',
    ass: bodySettings?.ass || 'round',
    legLength: bodySettings?.legLength || 'long',
    hairLength: bodySettings?.hairLength || 'long',
    hairColor: bodySettings?.hairColor || 'black',
    eyeColor: bodySettings?.eyeColor || 'brown',
    eyeSize: bodySettings?.eyeSize || 'large',
    skinTone: bodySettings?.skinTone || 'light',
    ethnicity: bodySettings?.ethnicity || 'asian',
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    body: true,
    face: false,
    hair: false,
  });

  const [imageFailed, setImageFailed] = useState(false);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = useCallback((key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = () => {
    updateAppearance(localSettings);
    onClose();
  };

  const handleGenerate = async () => {
    setImageFailed(false);
    updateAppearance(localSettings);
    await generateCharacterImage();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-hairline-strong bg-ink-2">
        {/* Header */}
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-hairline px-5">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-paper-3" strokeWidth={1.5} />
            <h2 id="customize-title" className="text-[15px] font-medium text-paper-1">
              Customize appearance
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-paper-3 transition-colors duration-150 hover:bg-ink-3 hover:text-paper-1"
          >
            <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Preview */}
          <div className="overflow-hidden rounded-xl border border-hairline bg-ink-1">
            <div className="mx-auto flex aspect-[3/4] max-h-52 items-center justify-center">
              {isGeneratingImage ? (
                <div className="text-center">
                  <Loader2
                    aria-hidden="true"
                    className="mx-auto mb-2 h-6 w-6 animate-spin text-paper-2"
                    strokeWidth={1.5}
                  />
                  <p className="text-[13px] text-paper-2">Generating portrait…</p>
                  <p className="mt-1 text-[11px] text-paper-3">Usually 15–30 seconds</p>
                </div>
              ) : characterImageUrl && !imageFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={characterImageUrl}
                  alt="Portrait of the companion"
                  className="h-full w-full object-contain"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="text-center">
                  <ImageIcon
                    aria-hidden="true"
                    className="mx-auto mb-2 h-8 w-8 text-paper-3"
                    strokeWidth={1.5}
                  />
                  <p className="max-w-[200px] text-[13px] text-paper-2">
                    {imageFailed
                      ? 'The portrait did not load. Generate it again.'
                      : 'Generate a portrait to preview it here'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Body type */}
          <Section title="Body type" isOpen={expandedSections.body} onToggle={() => toggleSection('body')}>
            <OptionChips options={BODY_TYPES} value={localSettings.bodyType} onChange={(v) => handleChange('bodyType', v)} />
          </Section>

          {/* Sliders */}
          {BODY_SLIDERS.map((slider) => (
            <div key={slider.key}>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor={`slider-${slider.key}`}
                  className="text-[13px] font-medium text-paper-2"
                >
                  {slider.label}
                </label>
                <span className="text-[12px] tabular-nums text-paper-3">
                  {localSettings[slider.key as keyof typeof localSettings]}
                  {slider.unit}
                </span>
              </div>
              <input
                id={`slider-${slider.key}`}
                type="range"
                min={slider.min}
                max={slider.max}
                value={localSettings[slider.key as keyof typeof localSettings]}
                onChange={(e) => handleChange(slider.key, e.target.value)}
                className="mt-1.5 h-6 w-full cursor-pointer appearance-none bg-transparent"
              />
            </div>
          ))}

          <div>
            <span className="text-[13px] font-medium text-paper-2">Ass size</span>
            <div className="mt-1.5">
              <OptionChips options={ASS_SIZES} value={localSettings.ass} onChange={(v) => handleChange('ass', v)} />
            </div>
          </div>

          <div>
            <span className="text-[13px] font-medium text-paper-2">Leg length</span>
            <div className="mt-1.5">
              <OptionChips options={LEG_LENGTHS} value={localSettings.legLength} onChange={(v) => handleChange('legLength', v)} />
            </div>
          </div>

          {/* Face & eyes */}
          <Section title="Face and eyes" isOpen={expandedSections.face} onToggle={() => toggleSection('face')}>
            <FieldLabel>Eye color</FieldLabel>
            <OptionChips options={EYE_COLORS} value={localSettings.eyeColor} onChange={(v) => handleChange('eyeColor', v)} className="mt-1.5" />
            <FieldLabel className="mt-4">Eye size</FieldLabel>
            <OptionChips options={EYE_SIZES} value={localSettings.eyeSize} onChange={(v) => handleChange('eyeSize', v)} className="mt-1.5" />
            <FieldLabel className="mt-4">Skin tone</FieldLabel>
            <OptionChips options={SKIN_TONES} value={localSettings.skinTone} onChange={(v) => handleChange('skinTone', v)} className="mt-1.5" />
            <FieldLabel className="mt-4">Ethnicity</FieldLabel>
            <OptionChips options={ETHNICITIES} value={localSettings.ethnicity} onChange={(v) => handleChange('ethnicity', v)} className="mt-1.5" />
          </Section>

          {/* Hair */}
          <Section title="Hair" isOpen={expandedSections.hair} onToggle={() => toggleSection('hair')}>
            <FieldLabel>Hair length</FieldLabel>
            <OptionChips options={HAIR_LENGTHS} value={localSettings.hairLength} onChange={(v) => handleChange('hairLength', v)} className="mt-1.5" />
            <FieldLabel className="mt-4">Hair color</FieldLabel>
            <OptionChips options={HAIR_COLORS} value={localSettings.hairColor} onChange={(v) => handleChange('hairColor', v)} className="mt-1.5" />
          </Section>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 space-y-2 border-t border-hairline p-4">
          <button
            onClick={handleGenerate}
            disabled={isGeneratingImage}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-paper-1 text-[13px] font-semibold text-ink-1 transition-[transform,opacity] duration-150 ease-out hover:bg-[#f4eee4] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isGeneratingImage ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                Generating…
              </>
            ) : (
              'Generate portrait'
            )}
          </button>
          <button
            onClick={handleSave}
            className="h-10 w-full rounded-[10px] border border-hairline bg-ink-3 text-[13px] font-medium text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`block text-[13px] font-medium text-paper-2 ${className}`}>
      {children}
    </span>
  );
}

function OptionChips({
  options,
  value,
  onChange,
  className = '',
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`h-8 rounded-md border px-3 text-[12px] capitalize leading-none transition-colors duration-150 ${
            value === option
              ? 'border-transparent bg-accent-soft text-accent'
              : 'border-hairline bg-ink-3 text-paper-2 hover:border-hairline-strong hover:text-paper-1'
          }`}
        >
          {option.replace('-', ' ')}
        </button>
      ))}
    </div>
  );
}

function Section({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-hairline pt-4">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex h-8 w-full items-center justify-between text-[13px] font-medium text-paper-2 transition-colors duration-150 hover:text-paper-1"
      >
        {title}
        {isOpen ? (
          <ChevronUp aria-hidden="true" className="h-4 w-4 text-paper-3" strokeWidth={1.5} />
        ) : (
          <ChevronDown aria-hidden="true" className="h-4 w-4 text-paper-3" strokeWidth={1.5} />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}
