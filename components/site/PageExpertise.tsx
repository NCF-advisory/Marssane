import Link from "next/link";
import { Fragment } from "react";
import { JsonLd } from "./JsonLd";
import { serviceEntities } from "@/lib/structured-data";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";
import { RendezVousTrigger } from "./RendezVousTrigger";
import { Kicker } from "@/components/ui/Kicker";
import { EquipeAgents } from "./EquipeAgents";
import { SchemaAutomatisation } from "./SchemaAutomatisation";
import { SchemaDevis } from "./SchemaDevis";
import { SchemaProspection } from "./SchemaProspection";
import { SchemaPilotage } from "./SchemaPilotage";
import { SchemaSecretaire } from "./SchemaSecretaire";
import { SchemaSecretaireVocal } from "./SchemaSecretaireVocal";
import styles from "./PageExpertise.module.css";

type Bloc = { titre: string; texte: string };
type Demonstration = Bloc & {
  type: "devis-menuiserie" | "prospection" | "pilotage" | "secretaire" | "secretaire-vocal";
  precision?: string;
};
type PartieUsage = Bloc & {
  id: string;
  exemples: Bloc[];
  demonstrations?: Demonstration[];
};
export type Expertise = {
  nom: string; path: string; titre: string; accent: string; introduction: string;
  heroVisuel?: "agents" | "automatisation"; principe: string;
  parties: [PartieUsage, PartieUsage, PartieUsage]; livrables: string[]; methode: Bloc[];
  faq: { question: string; reponse: string }[];
  complement: { titre: string; texte: string; href: string; lien: string };
};

/** Gabarit commun aux deux expertises ; contenu et exemples propres à chacune. */
export function PageExpertise({ contenu: c }: { contenu: Expertise }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": serviceEntities({
          path: c.path,
          name: c.nom,
          description: c.introduction,
          faq: c.faq,
        }),
      }} />
      <main className={styles.page}>
        <section className={`${styles.section} ${styles.hero}`}>
          <Breadcrumbs items={[{ name: c.nom, path: c.path }]} />
          <div className={`${styles.heroGrille} ${c.heroVisuel ? "" : styles.heroSansVisuel}`}>
            <div>
              <Kicker className="text-turquoise!">{c.nom} · PME</Kicker>
              <h1>{c.titre} <span>{c.accent}</span></h1>
              <p className={styles.introduction}>{c.introduction}</p>
              <RendezVousTrigger>Discuter de mon projet</RendezVousTrigger>
            </div>
            {c.heroVisuel === "agents" && <EquipeAgents />}
            {c.heroVisuel === "automatisation" && <SchemaAutomatisation />}
          </div>
        </section>
        <div className={styles.clair}>
          <section className={styles.section}>
            <Kicker>{c.nom === "Automatisation" ? "Automatisation" : "Agents IA"}</Kicker>
            <h2>{c.principe}</h2>
            <div className={styles.cartes}>
              {c.parties.map((partie) => (
                <article key={partie.id} id={partie.id} aria-labelledby={`${partie.id}-titre`}>
                  <div className={styles.casTexte}>
                    <h3 id={`${partie.id}-titre`}>{partie.titre}</h3>
                    {partie.texte && <p>{partie.texte}</p>}
                    {partie.demonstrations?.[0] && <PresentationAgent demonstration={partie.demonstrations[0]} />}
                  </div>
                  {partie.demonstrations?.[0] && <SchemaUsage type={partie.demonstrations[0].type} />}
                  {partie.demonstrations?.slice(1).map((demonstration) => (
                    <Fragment key={demonstration.type}>
                      <div className={styles.casTexte}><PresentationAgent demonstration={demonstration} /></div>
                      <SchemaUsage type={demonstration.type} />
                    </Fragment>
                  ))}
                  {partie.exemples.length > 0 && <ul className={`${styles.casListe} ${partie.demonstrations?.length ? styles.casComplementaires : ""}`}>
                    {partie.exemples.map((exemple) => (
                      <li key={exemple.titre}>
                        <h4>{exemple.titre}</h4>
                        <p>{exemple.texte}</p>
                      </li>
                    ))}
                  </ul>}
                </article>
              ))}
            </div>
          </section>
        </div>
        <section className={`${styles.section} ${styles.livrables}`}>
          <div>
            <Kicker className="text-turquoise!">Ce que vous gardez</Kicker>
            <h2>Un système utile.<br />L’accompagnement qui vous convient.</h2>
            <p className={styles.chapeau}>Après la mise en place, vous choisissez une passation accompagnée pour votre équipe ou une maintenance assurée par Marssane. Nous définissons ensemble qui suit le système et prend en charge les ajustements.</p>
          </div>
          <ul>{c.livrables.map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
        </section>
        <div className={styles.clair}>
          <section className={styles.section}>
            <Kicker>La méthode Marssane</Kicker>
            <h2>Un premier usage, puis la suite.</h2>
            <ol className={styles.methode}>
              {c.methode.map((etape, i) => <li key={etape.titre}>
                <span className={styles.index}>0{i + 1}</span>
                <div><h3>{etape.titre}</h3><p>{etape.texte}</p></div>
              </li>)}
            </ol>
          </section>
        </div>
        <section className={styles.section}>
          <Kicker className="text-turquoise!">Avant de commencer</Kicker>
          <h2>Vos questions.</h2>
          <div className={styles.faq}>
            {c.faq.map(item => <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true">⌄</span></summary>
              <p>{item.reponse}</p>
            </details>)}
          </div>
          <aside className={styles.complement}>
            <div><h3>{c.complement.titre}</h3><p>{c.complement.texte}</p></div>
            <Link href={c.complement.href}>{c.complement.lien} <span aria-hidden="true">↗</span></Link>
          </aside>
        </section>
        <section className={`${styles.section} ${styles.contact}`}>
          <Kicker className="text-turquoise!">Parlons de votre quotidien</Kicker>
          <h2>Quelle tâche aimeriez-vous<br className="hidden sm:block" /> ne plus avoir à refaire ?</h2>
          <p>Partons de là. Nous regarderons ensemble ce qu’il est possible de mettre en place.</p>
          <RendezVousTrigger>Discuter de mon projet</RendezVousTrigger>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PresentationAgent({ demonstration }: { demonstration: Demonstration }) {
  return (
    <div className={styles.agentPresentation}>
      {demonstration.titre && <h4>{demonstration.titre}</h4>}
      <p>{demonstration.texte}</p>
      {demonstration.precision && <small>{demonstration.precision}</small>}
    </div>
  );
}

function SchemaUsage({ type }: { type: Demonstration["type"] }) {
  return (
    <div className={styles.agentSchema}>
      {type === "prospection" && <SchemaProspection />}
      {type === "pilotage" && <SchemaPilotage />}
      {type === "secretaire" && <SchemaSecretaire />}
      {type === "secretaire-vocal" && <SchemaSecretaireVocal />}
      {type === "devis-menuiserie" && <SchemaDevis theme="light" />}
    </div>
  );
}
