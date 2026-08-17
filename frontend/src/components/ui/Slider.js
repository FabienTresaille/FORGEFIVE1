import styles from './Slider.module.css';

export default function Slider({ label, min = 1, max = 5, value, onChange, ...props }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {label && <label className={styles.label}>{label}</label>}
        <span className={styles.value}>{value}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={onChange}
        className={styles.slider}
        {...props}
      />
      <div className={styles.markers}>
        {Array.from({ length: max - min + 1 }).map((_, i) => (
          <span key={i} className={styles.markerTick}>|</span>
        ))}
      </div>
    </div>
  );
}
