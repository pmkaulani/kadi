'use client';

import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Settings,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Images,
  Video,
  MapPin,
  Clock,
  UserCheck,
  Smartphone,
  Calendar,
  Quote as QuoteIcon,
  Minus,
  ExternalLink,
  HelpCircle,
  Music,
  Heart,
  Radio,
  X,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import type { InvitationBlockConfig, InvitationBlockType, CommonBlockSettings } from '@/lib/blocks/types';
import {
  BLOCK_DEFINITIONS,
  createBlock,
  duplicateBlock,
  reorderBlocks,
  sanitizeVideoUrl,
  sanitizeUrl,
} from '@/lib/blocks/registry';

interface ContentBlockBuilderProps {
  blocks: InvitationBlockConfig[];
  onChange: (blocks: InvitationBlockConfig[]) => void;
  category?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  FileText,
  Image: ImageIcon,
  Images,
  Video,
  MapPin,
  Clock,
  UserCheck,
  Smartphone,
  Calendar,
  Quote: QuoteIcon,
  Minus,
  ExternalLink,
  HelpCircle,
  Music,
  Heart,
  Radio,
};

export function ContentBlockBuilder({ blocks, onChange, category }: ContentBlockBuilderProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [undoDelete, setUndoDelete] = useState<{ block: InvitationBlockConfig; index: number } | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Operations
  const handleAddBlock = (type: InvitationBlockType) => {
    const newBlock = createBlock(type);
    onChange([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setShowAddModal(false);
  };

  const handleRemoveBlock = (id: string) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const removed = blocks[index];
    setUndoDelete({ block: removed, index });
    onChange(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleRestoreBlock = () => {
    if (!undoDelete) return;
    const newBlocks = [...blocks];
    newBlocks.splice(undoDelete.index, 0, undoDelete.block);
    onChange(newBlocks);
    setSelectedBlockId(undoDelete.block.id);
    setUndoDelete(null);
  };

  const handleDuplicateBlock = (block: InvitationBlockConfig) => {
    const duplicated = duplicateBlock(block);
    const index = blocks.findIndex((b) => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicated);
    onChange(newBlocks);
    setSelectedBlockId(duplicated.id);
  };

  const handleToggleBlock = (id: string, enabled: boolean) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, enabled } : b))
    );
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    onChange(reorderBlocks(blocks, index, targetIndex));
  };

  const handleUpdateBlockContent = (id: string, contentPatch: any) => {
    onChange(
      blocks.map((b) =>
        b.id === id
          ? {
              ...b,
              content: {
                ...b.content,
                ...contentPatch,
              },
            }
          : b
      )
    );
  };

  const handleUpdateBlockSettings = (id: string, settingsPatch: Partial<CommonBlockSettings>) => {
    onChange(
      blocks.map((b) =>
        b.id === id
          ? {
              ...b,
              settings: {
                ...b.settings,
                ...settingsPatch,
              },
            }
          : b
      )
    );
  };

  // Filtered block library
  const availableTypes = (Object.keys(BLOCK_DEFINITIONS) as InvitationBlockType[]).filter((type) => {
    const def = BLOCK_DEFINITIONS[type];
    if (category === 'funeral' && type === 'contribution') return false; // Dignity rule
    if (libraryFilter === 'all') return true;
    return def.category === libraryFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6558] block">
            Content Blocks ({blocks.length})
          </span>
          <span className="text-[10px] text-[#8C8375]">
            Drag to reorder or edit type-specific content
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#934638] text-white text-xs font-medium shadow-xs hover:bg-[#7A3529] transition-colors"
        >
          <Plus size={13} />
          <span>Add Block</span>
        </button>
      </div>

      {/* Undo Delete Notice */}
      {undoDelete && (
        <div className="p-2.5 rounded-md bg-[#FAF4EB] border border-[#934638]/20 flex items-center justify-between text-xs text-[#794a32]">
          <span>Block removed.</span>
          <button
            type="button"
            onClick={handleRestoreBlock}
            className="font-bold underline flex items-center gap-1 hover:text-[#934638]"
          >
            <RotateCcw size={11} /> Undo
          </button>
        </div>
      )}

      {/* Drag & Drop Reorderable List */}
      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={onChange}
        className="space-y-1.5 divide-y divide-[rgba(39,38,32,0.04)]"
      >
        {blocks.map((block, index) => {
          const def = BLOCK_DEFINITIONS[block.type] || {
            label: block.type,
            icon: 'Sparkles',
          };
          const Icon = ICON_MAP[def.icon] || Sparkles;
          const isSelected = block.id === selectedBlockId;

          return (
            <Reorder.Item
              key={block.id}
              value={block}
              className={`rounded-lg border transition-all select-none overflow-hidden ${
                isSelected
                  ? 'border-[#934638] shadow-xs bg-white'
                  : 'border-[rgba(39,38,32,0.1)] bg-white hover:border-[rgba(39,38,32,0.2)]'
              }`}
            >
              <div className="flex items-center justify-between p-2.5 text-xs">
                {/* Drag Handle & Label */}
                <div
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                >
                  <div className="text-[#8C8375] hover:text-[#272620] cursor-grab active:cursor-grabbing p-0.5">
                    <GripVertical size={14} />
                  </div>
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                      block.enabled
                        ? 'bg-[#FAF4EB] text-[#934638]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon size={12} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`font-medium block truncate ${
                        block.enabled ? 'text-[#272620]' : 'text-gray-400 line-through'
                      }`}
                    >
                      {def.label}
                    </span>
                    <span className="text-[10px] text-[#8C8375] block truncate">
                      {block.settings.maxWidth} · {block.settings.padding}
                    </span>
                  </div>
                </div>

                {/* Block Item Action Icons */}
                <div className="flex items-center gap-0.5 shrink-0 ml-2">
                  {/* Enable / Disable */}
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(block.id, !block.enabled)}
                    className="p-1 rounded text-[#756F64] hover:text-[#272620] hover:bg-black/[0.04]"
                    title={block.enabled ? 'Disable block' : 'Enable block'}
                  >
                    {block.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicateBlock(block)}
                    className="p-1 rounded text-[#756F64] hover:text-[#272620] hover:bg-black/[0.04]"
                    title="Duplicate block"
                  >
                    <Copy size={13} />
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveBlock(index, -1)}
                    className="p-1 rounded text-[#756F64] hover:text-[#272620] hover:bg-black/[0.04] disabled:opacity-20"
                    title="Move up"
                  >
                    <ChevronUp size={13} />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === blocks.length - 1}
                    onClick={() => handleMoveBlock(index, 1)}
                    className="p-1 rounded text-[#756F64] hover:text-[#272620] hover:bg-black/[0.04] disabled:opacity-20"
                    title="Move down"
                  >
                    <ChevronDown size={13} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="p-1 rounded text-[#756F64] hover:text-red-600 hover:bg-red-50"
                    title="Delete block"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Expand / Edit toggle */}
                  <button
                    type="button"
                    onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                    className={`p-1 rounded ml-1 transition-transform ${
                      isSelected
                        ? 'text-[#934638] bg-[#FAF4EB] rotate-180'
                        : 'text-[#756F64] hover:bg-black/[0.04]'
                    }`}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Inline Block Editor Pane */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[rgba(39,38,32,0.08)] bg-[#FAF8F5] p-3 space-y-3"
                  >
                    {/* Tabs: Content vs Settings */}
                    <div className="flex items-center gap-2 border-b border-[rgba(39,38,32,0.1)] pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          activeTab === 'content'
                            ? 'bg-white text-[#934638] shadow-2xs'
                            : 'text-[#6D6558] hover:text-[#272620]'
                        }`}
                      >
                        Content
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          activeTab === 'settings'
                            ? 'bg-white text-[#934638] shadow-2xs'
                            : 'text-[#6D6558] hover:text-[#272620]'
                        }`}
                      >
                        Layout & Motion Settings
                      </button>
                    </div>

                    {activeTab === 'content' ? (
                      <BlockContentEditor
                        block={block}
                        onChange={(patch) => handleUpdateBlockContent(block.id, patch)}
                      />
                    ) : (
                      <BlockSettingsEditor
                        settings={block.settings}
                        onChange={(patch) => handleUpdateBlockSettings(block.id, patch)}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Add Block Modal / Sheet */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[rgba(39,38,32,0.12)] overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-[rgba(39,38,32,0.08)] flex items-center justify-between bg-[#FAF8F5]">
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#272620]">
                    Add Content Block
                  </h3>
                  <p className="text-xs text-[#756F64]">
                    Choose from 17 curated blocks to enrich your guest invitation
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded text-[#756F64] hover:text-[#272620]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 p-2 bg-[#FAF8F5] border-b border-[rgba(39,38,32,0.06)] overflow-x-auto text-[11px]">
                {['all', 'content', 'media', 'logistics', 'social', 'styling'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibraryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full capitalize whitespace-nowrap font-medium transition-all ${
                      libraryFilter === cat
                        ? 'bg-[#934638] text-white shadow-2xs'
                        : 'text-[#6D6558] hover:bg-black/[0.04]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Blocks Grid */}
              <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableTypes.map((type) => {
                  const def = BLOCK_DEFINITIONS[type];
                  const Icon = ICON_MAP[def.icon] || Sparkles;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleAddBlock(type)}
                      className="flex items-start gap-3 p-3 rounded-lg border border-[rgba(39,38,32,0.1)] hover:border-[#934638] hover:bg-[#FAF8F5] transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-md bg-[#FAF4EB] text-[#934638] group-hover:bg-[#934638] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-serif font-medium text-xs text-[#272620] block">
                          {def.label}
                        </span>
                        <span className="text-[10px] text-[#756F64] leading-tight block line-clamp-2 mt-0.5">
                          {def.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Editor for Common Block Settings (Padding, MaxWidth, TextAlign, Motion, Corners, Borders)
 */
function BlockSettingsEditor({
  settings,
  onChange,
}: {
  settings: CommonBlockSettings;
  onChange: (patch: Partial<CommonBlockSettings>) => void;
}) {
  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-2 gap-2">
        {/* Padding */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
            Section Padding
          </label>
          <select
            value={settings.padding}
            onChange={(e) => onChange({ padding: e.target.value as any })}
            className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
          >
            <option value="compact">Compact (Tight)</option>
            <option value="comfortable">Comfortable (Standard)</option>
            <option value="spacious">Spacious (Editorial)</option>
          </select>
        </div>

        {/* Max Width */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
            Max Width
          </label>
          <select
            value={settings.maxWidth}
            onChange={(e) => onChange({ maxWidth: e.target.value as any })}
            className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
          >
            <option value="narrow">Narrow (Centered Proze)</option>
            <option value="standard">Standard (Readable)</option>
            <option value="wide">Wide (Visual/Media)</option>
            <option value="full">Full Bleed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Text Align */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
            Text Alignment
          </label>
          <select
            value={settings.textAlign}
            onChange={(e) => onChange({ textAlign: e.target.value as any })}
            className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
          >
            <option value="center">Center</option>
            <option value="left">Left Aligned</option>
            <option value="right">Right Aligned</option>
          </select>
        </div>

        {/* Scroll Motion */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
            Scroll Motion
          </label>
          <select
            value={settings.scrollMotion}
            onChange={(e) => onChange({ scrollMotion: e.target.value as any })}
            className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
          >
            <option value="fade-up">Fade Up</option>
            <option value="scale-in">Scale In</option>
            <option value="slide-in">Slide In</option>
            <option value="none">No Motion (Static)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Corners */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
            Corners
          </label>
          <select
            value={settings.cornerStyle}
            onChange={(e) => onChange({ cornerStyle: e.target.value as any })}
            className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
          >
            <option value="soft">Soft (Rounded)</option>
            <option value="square">Square</option>
            <option value="round">Round (Pill-like)</option>
          </select>
        </div>

        {/* Border */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
            Border Frame
          </label>
          <select
            value={settings.borderStyle}
            onChange={(e) => onChange({ borderStyle: e.target.value as any })}
            className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
          >
            <option value="none">None</option>
            <option value="thin">Thin Ruled</option>
            <option value="thick">Thick Border</option>
            <option value="dotted">Dotted Rule</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/**
 * Type-specific form fields for all 17 block types
 */
function BlockContentEditor({
  block,
  onChange,
}: {
  block: InvitationBlockConfig;
  onChange: (patch: any) => void;
}) {
  const { type, content } = block;

  switch (type) {
    case 'hero':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Tagline / Header</label>
            <input
              type="text"
              value={content.tagline || ''}
              onChange={(e) => onChange({ tagline: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              placeholder="e.g. Together with their families"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Event Title</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Honourees / Celebrants</label>
            <input
              type="text"
              value={content.celebrants || ''}
              onChange={(e) => onChange({ celebrants: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
        </div>
      );

    case 'rich-text':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Subheading</label>
            <input
              type="text"
              value={content.subheading || ''}
              onChange={(e) => onChange({ subheading: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Headline</label>
            <input
              type="text"
              value={content.headline || ''}
              onChange={(e) => onChange({ headline: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Body Narrative</label>
            <textarea
              rows={4}
              value={content.body || ''}
              onChange={(e) => onChange({ body: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              placeholder="Write your story, note to guests, or welcome remarks here…"
            />
          </div>
        </div>
      );

    case 'photo':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Image URL</label>
            <input
              type="text"
              value={content.imageUrl || ''}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Aspect Ratio</label>
              <select
                value={content.aspectRatio || '16:9'}
                onChange={(e) => onChange({ aspectRatio: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              >
                <option value="16:9">16:9 Widescreen</option>
                <option value="4:3">4:3 Standard</option>
                <option value="1:1">1:1 Square</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Caption</label>
              <input
                type="text"
                value={content.caption || ''}
                onChange={(e) => onChange({ caption: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
          </div>
        </div>
      );

    case 'gallery': {
      const images = content.images || [];
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Gallery Title</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Columns</label>
            <select
              value={content.columns || 2}
              onChange={(e) => onChange({ columns: parseInt(e.target.value, 10) })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#6D6558]">Photos ({images.length})</label>
            {images.map((img: any, i: number) => (
              <div key={i} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = { ...next[i], url: e.target.value };
                    onChange({ images: next });
                  }}
                  className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => onChange({ images: images.filter((_: any, idx: number) => idx !== i) })}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  images: [
                    ...images,
                    {
                      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
                      caption: 'New Photo',
                    },
                  ],
                })
              }
              className="text-[11px] text-[#934638] font-semibold hover:underline flex items-center gap-1 mt-1"
            >
              <Plus size={11} /> Add Photo URL
            </button>
          </div>
        </div>
      );
    }

    case 'video': {
      const sanitized = sanitizeVideoUrl(content.videoId);
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">
              YouTube or Vimeo URL / ID
            </label>
            <input
              type="text"
              value={content.videoId || ''}
              onChange={(e) => onChange({ videoId: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
            />
          </div>
          {sanitized ? (
            <p className="text-[10px] text-emerald-700 flex items-center gap-1">
              ✓ Verified {sanitized.provider === 'youtube' ? 'YouTube' : 'Vimeo'} video embed
            </p>
          ) : (
            <p className="text-[10px] text-amber-700 flex items-center gap-1">
              <AlertCircle size={10} /> Enter a valid YouTube or Vimeo URL
            </p>
          )}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Video Title</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
        </div>
      );
    }

    case 'venue-map':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Venue Name</label>
            <input
              type="text"
              value={content.venueName || ''}
              onChange={(e) => onChange({ venueName: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Address</label>
              <input
                type="text"
                value={content.address || ''}
                onChange={(e) => onChange({ address: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">City / Area</label>
              <input
                type="text"
                value={content.city || ''}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Directions Note</label>
            <input
              type="text"
              value={content.directionsNote || ''}
              onChange={(e) => onChange({ directionsNote: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Google Maps Link</label>
            <input
              type="text"
              value={content.googleMapsUrl || ''}
              onChange={(e) => onChange({ googleMapsUrl: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
        </div>
      );

    case 'countdown':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Countdown Label</label>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => onChange({ label: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Target Date</label>
              <input
                type="text"
                value={content.targetDate || ''}
                onChange={(e) => onChange({ targetDate: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Target Time</label>
              <input
                type="text"
                value={content.targetTime || ''}
                onChange={(e) => onChange({ targetTime: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
          </div>
        </div>
      );

    case 'contribution':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">M-Pesa Type</label>
            <select
              value={content.type || 'till'}
              onChange={(e) => onChange({ type: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            >
              <option value="till">Buy Goods Till Number</option>
              <option value="paybill">Paybill</option>
              <option value="send_money">Send Money (Phone)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Number</label>
              <input
                type="text"
                value={content.number || ''}
                onChange={(e) => onChange({ number: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Recipient Name</label>
              <input
                type="text"
                value={content.recipientName || ''}
                onChange={(e) => onChange({ recipientName: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Instructions</label>
            <textarea
              rows={2}
              value={content.instructions || ''}
              onChange={(e) => onChange({ instructions: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
        </div>
      );

    case 'timeline': {
      const items = content.items || [];
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Timeline Title</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-[#6D6558]">Schedule Items ({items.length})</label>
            {items.map((it: any, i: number) => (
              <div key={i} className="p-2 rounded bg-white border border-[rgba(39,38,32,0.1)] space-y-1">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={it.time}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], time: e.target.value };
                      onChange({ items: next });
                    }}
                    className="w-20 text-xs p-1 rounded border border-[rgba(39,38,32,0.15)] font-mono"
                    placeholder="2:00 PM"
                  />
                  <input
                    type="text"
                    value={it.title}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], title: e.target.value };
                      onChange({ items: next });
                    }}
                    className="flex-1 text-xs p-1 rounded border border-[rgba(39,38,32,0.15)] font-medium"
                    placeholder="Event title"
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ items: items.filter((_: any, idx: number) => idx !== i) })}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  items: [
                    ...items,
                    { time: '4:00 PM', title: 'New Schedule Item', location: 'Main Hall' },
                  ],
                })
              }
              className="text-[11px] text-[#934638] font-semibold hover:underline flex items-center gap-1 mt-1"
            >
              <Plus size={11} /> Add Schedule Event
            </button>
          </div>
        </div>
      );
    }

    case 'quote':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Quote / Verse</label>
            <textarea
              rows={3}
              value={content.quote || ''}
              onChange={(e) => onChange({ quote: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Attribution / Author</label>
              <input
                type="text"
                value={content.attribution || ''}
                onChange={(e) => onChange({ attribution: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Context</label>
              <input
                type="text"
                value={content.context || ''}
                onChange={(e) => onChange({ context: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              />
            </div>
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Button Label</label>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => onChange({ label: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Target URL</label>
            <input
              type="text"
              value={content.url || ''}
              onChange={(e) => onChange({ url: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6D6558] mb-0.5">Style</label>
              <select
                value={content.variant || 'primary'}
                onChange={(e) => onChange({ variant: e.target.value })}
                className="w-full text-xs p-1.5 rounded border border-[rgba(39,38,32,0.18)] bg-white"
              >
                <option value="primary">Solid Accent</option>
                <option value="secondary">Dark Coffee</option>
                <option value="outline">Framed Outline</option>
              </select>
            </div>
            <div className="flex items-center pt-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={content.openInNewTab !== false}
                  onChange={(e) => onChange({ openInNewTab: e.target.checked })}
                  className="rounded border-[rgba(39,38,32,0.2)] text-[#934638]"
                />
                <span className="text-[11px] font-medium text-[#272620]">Open in new tab</span>
              </label>
            </div>
          </div>
        </div>
      );

    case 'faq': {
      const items = content.items || [];
      return (
        <div className="space-y-2 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-[#6D6558]">FAQ Items ({items.length})</label>
            {items.map((it: any, i: number) => (
              <div key={i} className="p-2 rounded bg-white border border-[rgba(39,38,32,0.1)] space-y-1">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={it.question}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], question: e.target.value };
                      onChange({ items: next });
                    }}
                    className="flex-1 text-xs p-1 rounded border border-[rgba(39,38,32,0.15)] font-medium"
                    placeholder="Question"
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ items: items.filter((_: any, idx: number) => idx !== i) })}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X size={12} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={it.answer}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], answer: e.target.value };
                    onChange({ items: next });
                  }}
                  className="w-full text-xs p-1 rounded border border-[rgba(39,38,32,0.15)]"
                  placeholder="Answer"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  items: [
                    ...items,
                    { question: 'What is the schedule?', answer: 'Details provided upon arrival.' },
                  ],
                })
              }
              className="text-[11px] text-[#934638] font-semibold hover:underline flex items-center gap-1 mt-1"
            >
              <Plus size={11} /> Add FAQ Item
            </button>
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="text-xs text-[#756F64] italic">
          Block options can be customized in the live preview.
        </div>
      );
  }
}
