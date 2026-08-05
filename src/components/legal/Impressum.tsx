import { LegalLayout } from "@/components/legal/LegalLayout";
import { LegalSection } from "@/components/legal/LegalSection";

export function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <LegalSection title="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)">
        <p>
          Marcus Kollosch
          <br />
          Zur Bergwiese 5
          <br />
          82152 Planegg
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail:{" "}
          <a href="mailto:jarvisclusterhomelab@gmail.com">
            jarvisclusterhomelab@gmail.com
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>Marcus Kollosch, Anschrift wie oben.</p>
      </LegalSection>

      <LegalSection title="Projekthinweis">
        <p>
          JARVIS ist ein privates, nicht-kommerzielles Hobby- und
          Forschungsprojekt (Homelab). Über diese Website werden keine Waren
          oder Dienstleistungen angeboten, beworben oder verkauft.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p>
          Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
          oder Sperrung der Nutzung von Informationen nach den allgemeinen
          Gesetzen bleiben hiervon unberührt.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p>
          Diese Website enthält keine Links zu externen Inhalten Dritter, auf
          deren Inhalte ich Einfluss nehmen könnte. Sollte künftig auf fremde
          Inhalte verlinkt werden: Für die Inhalte der verlinkten Seiten ist
          ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden von
          Rechtsverletzungen würde ein entsprechender Link umgehend entfernt.
        </p>
      </LegalSection>

      <LegalSection title="Urheberrecht">
        <p>
          Die durch mich erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als
          solche gekennzeichnet. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
          Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
          Autors bzw. Erstellers.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
