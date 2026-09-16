import styles from "./SchemaAutomatisation.module.css";

/** Schéma statique des trois étapes d’une automatisation. */
export function SchemaAutomatisation() {
  return (
    <div className={styles.schema}>
      <svg viewBox="0 0 600 340" role="img" aria-label="Déclencheur, condition, puis action.">
        <g className={styles.connections}>
          <path d="M160 155H240M360 155H440" />
        </g>
        <g className={styles.first}>
          <rect className={styles.node} x="40" y="95" width="120" height="120" rx="22" />
          <path className={styles.icon} d="m105 124-28 35h22l-4 27 28-37h-23z" />
          <circle className={styles.port} cx="160" cy="155" r="5" />
          <text className={styles.label} x="100" y="253">Déclencheur</text>
        </g>
        <g className={styles.second}>
          <rect className={styles.node} x="240" y="95" width="120" height="120" rx="22" />
          <path className={styles.icon} d="m300 125 30 30-30 30-30-30zM288 155l8 8 17-18" />
          <circle className={styles.port} cx="240" cy="155" r="5" />
          <circle className={styles.port} cx="360" cy="155" r="5" />
          <text className={styles.label} x="300" y="253">Condition</text>
        </g>
        <g className={styles.third}>
          <rect className={styles.node} x="440" y="95" width="120" height="120" rx="22" />
          <g className={styles.icon}>
            <circle cx="500" cy="155" r="27" />
            <path d="m487 155 9 9 18-19" />
          </g>
          <circle className={styles.port} cx="440" cy="155" r="5" />
          <text className={styles.label} x="500" y="253">Action</text>
        </g>
      </svg>
    </div>
  );
}
