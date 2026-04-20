import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, ChevronDown } from 'lucide-react';

interface LocationItem {
  code: number;
  name: string;
}

interface AutocompleteProps {
  label: string;
  value: string;
  placeholder: string;
  items: LocationItem[];
  isLoading: boolean;
  onSelect: (item: LocationItem) => void;
  disabled?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteProps> = ({ 
  label, value, placeholder, items, isLoading, onSelect, disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(value);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="space-y-1.5 relative" ref={wrapperRef}>
      <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 pl-11 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm disabled:opacity-50"
          placeholder={placeholder}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors">
          <Search size={16} />
        </div>
        {isLoading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
            <Loader2 size={16} className="animate-spin" />
          </div>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300">
             <ChevronDown size={16} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (searchTerm.length > 0 || items.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 max-h-60 overflow-y-auto custom-scrollbar overflow-hidden"
          >
            {filteredItems.length > 0 ? (
              <div className="p-2">
                {filteredItems.map(item => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setSearchTerm(item.name);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all text-sm font-medium flex items-center justify-between group"
                  >
                    <span>{item.name}</span>
                    <Search size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-text-muted text-xs italic">
                {isLoading ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả phù hợp'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
