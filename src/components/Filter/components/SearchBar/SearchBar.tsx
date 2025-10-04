import styles from './SearchBar.module.scss';
import { IoIosSearch } from 'react-icons/io';

export interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({ placeholder, value, onChange }: SearchBarProps) => {
  return (
    <div className={styles.searchBarWrapper}>
      <IoIosSearch className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
