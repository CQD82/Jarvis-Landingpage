import { LegalLayout } from "@/components/legal/LegalLayout";
import { LegalSection } from "@/components/legal/LegalSection";

export function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <LegalSection title="1. Verantwortlicher">
        <p>
          Marcus Kollosch
          <br />
          Zur Bergwiese 5, 82152 Planegg, Deutschland
          <br />
          E-Mail:{" "}
          <a href="mailto:jarvisclusterhomelab@gmail.com">
            jarvisclusterhomelab@gmail.com
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. Allgemeines zur Datenverarbeitung">
        <p>
          Diese Website dient ausschließlich der privaten, nicht-kommerziellen
          Präsentation eines Homelab-Projekts. Es werden keine Waren oder
          Dienstleistungen verkauft, keine Nutzerkonten angelegt und keine
          Zahlungsdaten verarbeitet. Alle auf dieser Seite gezeigten
          Betriebsdaten (Node-Status, Stromverbrauch etc.) sind simulierte
          Beispielwerte, keine live übertragene Telemetrie.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting & Server-Logfiles">
        <p>
          Diese Website wird über Cloudflare (Cloudflare, Inc., 101 Townsend
          St, San Francisco, CA 94107, USA, bzw. deren europäische
          Konzerngesellschaften) als Content-Delivery- und Hosting-
          Infrastruktur ausgeliefert. Beim Aufruf der Seite verarbeitet
          Cloudflare technisch notwendige Verbindungsdaten (u. a.
          IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Datei,
          verwendeter Browser) in Server-Logfiles, um die Website sicher und
          stabil auszuliefern. Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit.
          f DSGVO (berechtigtes Interesse an einem sicheren und stabilen
          Betrieb der Website). Diese Daten werden nicht mit anderen
          Datenquellen zusammengeführt. Weitere Informationen:{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflares Datenschutzerklärung
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies & lokale Speicherung">
        <p>
          Diese Website setzt keine Cookies. Ihre gewählte Sprache wird
          ausschließlich lokal im <code>localStorage</code> Ihres Browsers
          gespeichert (Schlüssel <code>jarvis-lang</code>), damit die Seite
          beim nächsten Besuch direkt in der zuletzt gewählten Sprache
          angezeigt wird. Diese Speicherung verlässt Ihr Gerät nicht und wird
          nicht an mich oder Dritte übertragen. Sie ist technisch notwendig
          für die Grundfunktion "Sprachauswahl"; eine Einwilligung ist hierfür
          gemäß § 25 Abs. 2 Nr. 2 TTDSG nicht erforderlich. Sie können den
          Speicher jederzeit über die Einstellungen Ihres Browsers löschen.
        </p>
      </LegalSection>

      <LegalSection title="5. Schriftarten (Fonts)">
        <p>
          Alle auf dieser Website verwendeten Schriftarten (Orbitron, Exo 2,
          JetBrains Mono) werden lokal auf diesem Server ausgeliefert. Es
          findet keine Verbindung zu Google Fonts oder anderen externen
          Font-Anbietern statt — beim Laden dieser Seite werden dafür keine
          IP-Adressen an Dritte übermittelt.
        </p>
      </LegalSection>

      <LegalSection title="6. Keine Analyse- und Tracking-Tools">
        <p>
          Diese Website verwendet keine Analyse-Dienste (z. B. Google
          Analytics, Matomo), kein Tracking, keine Marketing-Pixel und keine
          Social-Media-Plugins.
        </p>
      </LegalSection>

      <LegalSection title="7. Kontaktaufnahme">
        <p>
          Diese Website enthält kein Kontaktformular. Wenn Sie mich per
          E-Mail kontaktieren, werden Ihre Angaben (E-Mail-Adresse,
          gegebenenfalls Name und Nachricht) ausschließlich zur Bearbeitung
          Ihrer Anfrage gespeichert und nicht ohne Ihre Einwilligung
          weitergegeben (Art. 6 Abs. 1 lit. b bzw. f DSGVO).
        </p>
      </LegalSection>

      <LegalSection title="8. SSL/TLS-Verschlüsselung">
        <p>
          Diese Website nutzt aus Sicherheitsgründen eine
          SSL/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
          am Präfix <code>https://</code> in der Adresszeile Ihres Browsers.
        </p>
      </LegalSection>

      <LegalSection title="9. Ihre Rechte">
        <p>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art.
          16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung
          (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie
          Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten
          (Art. 21 DSGVO). Zudem steht Ihnen ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde zu, zum Beispiel bei der für Bayern
          zuständigen Behörde:
        </p>
        <p>
          Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
          <br />
          Promenade 27, 91522 Ansbach
        </p>
      </LegalSection>

      <LegalSection title="10. Änderung dieser Datenschutzerklärung">
        <p>
          Ich behalte mir vor, diese Datenschutzerklärung anzupassen, damit
          sie stets den aktuellen rechtlichen Anforderungen entspricht.
        </p>
        <p className="text-xs text-muted-foreground/70">Stand: August 2026</p>
      </LegalSection>
    </LegalLayout>
  );
}
