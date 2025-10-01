import React, { useState, useRef, useEffect } from 'react';
import styles from './TagInput.module.scss';

interface TagInputProps {
  value?: string;
  onChange?: (newValue: string) => void;
  onRemove?: () => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = '',
  onChange,
  onRemove,
  placeholder = 'Novo item',
}) => {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onChange?.(e.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      const style = window.getComputedStyle(inputRef.current);
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = font;
        const width = context.measureText(text || placeholder).width + 10;
        inputRef.current.style.width = `${width}px`;
      }
    }
  }, [text, placeholder]);

  return (
    <div className={styles.tag}>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <button className={styles.remove} onClick={onRemove}>
        ✕
      </button>
    </div>
  );
};
