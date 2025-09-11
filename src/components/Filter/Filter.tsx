import { Select } from '../Select';
import { SearchBar } from './components/SearchBar';
import styles from './Filter.module.scss';

export interface Option {
  value: string;
  label: string;
}

export interface FilterProps {
  title: string;
  selectOptions: Option[];
  selectPlaceholder: string;
  selectProps?: React.ComponentProps<typeof Select>;
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const Filter = ({
  title,
  selectOptions,
  selectPlaceholder,
  selectProps,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: FilterProps) => {
  return (
    <div className={styles.filterContainer}>
      <h2 className={styles.filterTitle}>{title}</h2>
      <div className={styles.filterContent}>
        <SearchBar
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
        <Select
          placeholder={selectPlaceholder}
          options={selectOptions}
          {...selectProps}
        />
      </div>
    </div>
  );
};
