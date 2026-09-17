import Image from "next/image";
import styles from "./EquipeAgents.module.css";

const agents = [
  ["marco", "Marco"], ["elise", "Élise"], ["jacque", "Jacques"],
  ["alma", "Alma"], ["noe", "Noé"], ["ines", "Inès"], ["louis", "Louis"],
  ["sarah", "Sarah"], ["hugo", "Hugo"], ["lina", "Camille"],
];

export function EquipeAgents() {
  return (
    <ul className={styles.equipe} aria-label="Les agents IA Marssane">
      {agents.map(([id, nom]) => (
        <li key={id}>
          <Image
            src={`/images/agents/${id}.webp`}
            alt={`Portrait de ${nom}`}
            width={360}
            height={360}
            sizes="(max-width: 480px) 29vw, 116px"
            loading="eager"
          />
        </li>
      ))}
    </ul>
  );
}
