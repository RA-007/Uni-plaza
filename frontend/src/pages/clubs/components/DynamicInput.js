import React from 'react';
import styles from '../ClubDashboard.module.css';

const DynamicInput = ({ 
  label, 
  items, 
  onItemsChange, 
  placeholder = 'Enter item',
  required = false 
}) => {
  const addItem = () => {
    onItemsChange([...items, '']);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onItemsChange(newItems);
  };

  return (
    <div className={styles.dynamicInputGroup}>
      <div className={styles.dynamicInputHeader}>
        <label className={styles.label}>
          {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
        </label>
        <button
          type="button"
          onClick={addItem}
          className={styles.addItemButton}
        >
          + Add {label.slice(0, -1)}
        </button>
      </div>
      <div className={styles.dynamicInputs}>
        {items.map((item, index) => (
          <div key={index} className={styles.dynamicInputRow}>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className={styles.dynamicInput}
              required={required && index === 0}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className={styles.removeItemButton}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className={styles.dynamicInputRow}>
            <input
              type="text"
              value=""
              onChange={(e) => onItemsChange([e.target.value])}
              placeholder={placeholder}
              className={styles.dynamicInput}
              required={required}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicInput;
