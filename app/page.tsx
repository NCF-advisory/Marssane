import { CasConcrets } from "@/components/site/CasConcrets";
import { Footer } from "@/components/site/Footer";
import { Formation } from "@/components/site/Formation";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { OutilsIA } from "@/components/site/OutilsIA";
import { PourFaireQuoi } from "@/components/site/PourFaireQuoi";
import { PourQui } from "@/components/site/PourQui";
import { Preuves } from "@/components/site/Preuves";
import { Reservation } from "@/components/site/Reservation";
import { ReservationDialog } from "@/components/site/ReservationDialog";
import { champSession, mentionSession } from "@/lib/session-display";
import { getProchaineSessionSafe } from "@/lib/sessions";

// Page dynamique contrôlée : revalidation périodique + `revalidatePath("/")`
// depuis la server action, pour que le compteur de places se rafraîchisse.
export const revalidate = 60;

export default async function Home() {
  // Repli sans base : `null` → wording « liste d'attente » (voir getProchaineSessionSafe).
  const session = await getProchaineSessionSafe();
  const mention = session ? mentionSession(session) : null;

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <PourFaireQuoi />
        <CasConcrets />
        <Preuves />
        <PourQui />
        <OutilsIA />
        <Formation />
        <Reservation mention={mention} />
      </main>
      <Footer />
      <ReservationDialog
        sessionLabel={champSession(session)}
        sessionComplete={session?.complete ?? false}
      />
    </>
  );
}
