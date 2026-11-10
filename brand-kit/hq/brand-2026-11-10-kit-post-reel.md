# brand-2026-11-10-kit-post-reel · Report del turno

Reparto Brand e grafica (Carolina) · 10/11/2026 · repository `celea-media`, ramo `claude/celea-post-reel-kit-adg02t`.

## In una riga

Il kit è pronto: modelli unici con lo stile del sito, script che dal testo produce PNG, JPG e MP4, la
settimana di prova (8 contenuti, 8 formati diversi, 3 reel) e 45 video pubblicitari. Niente pubblicato, nessuna spesa.

## Che cosa è stato fatto

1. **Letto com'è organizzato `celea-media`.** Metricool usa i file della cartella `post/` con i nomi
   `post-AAAA-MM-GG-N.jpg` (slide di carosello `-1`, `-2`…). JPG perché TikTok rifiuta i PNG. Niente spostato,
   rinominato o cancellato: tutto il lavoro nuovo è in `brand-kit/`.
2. **Stile preso dal sito** (solo lettura): palette A, Manrope e Source Sans 3, logo, Celeo, telefono, agenda,
   ufficio isometrico. La skill Stageshow non era raggiungibile: animazioni e componenti vengono dal codice del sito.
3. **Modelli** (`brand-kit/modelli/`): un solo modello HTML per post 1080x1080 e 1080x1350, carosello, storia
   1080x1920, reel e pubblicità. 8 formati, 6 sfondi, Celeo a destra o a sinistra, 4 posizioni del cerchio.
4. **Sei scene animate** per i video: telefonata, linea occupata, agenda che si riempie, urgenza al titolare,
   ufficio con i reparti, demo col nome dell'attività. Celeo presenta, sottotitoli grandi, scritta «assistente AI»
   sempre visibile, chiusura con logo, slogan e www.celea.it. 30 fotogrammi al secondo.
5. **Esportazione automatica** (`brand-kit/script/esporta.js`): Playwright e ffmpeg, un reel in circa un minuto.
6. **Controllo dei testi** prima di esportare: frasi vietate, promesse, prezzi nelle pubblicità, disponibilità
   mancanti, scritta «assistente AI», fonte nei numeri, varietà dei formati.
7. **Settimana di prova 16–22 novembre** in `brand-kit/esempi/`.
8. **Pubblicità Meta** in `brand-kit/pubblicita/`: 5 nicchie × 3 ganci × 3 misure = 45 video da 11 a 18 secondi,
   con il testo dell'annuncio accanto (`<nicchia>-annuncio.md`). Nessun prezzo.

## La settimana di prova

| File | Tipo | Formato | Funzione | Sfondo |
|---|---|---|---|---|
| `post-2026-11-16-1` | post 1080x1350 | domanda | risponde quando non può nessuno | sabbia |
| `post-2026-11-17-1` | reel, 23 s | scenetta (linea occupata a pranzo) | la chiamata passa all'assistente AI | crema |
| `post-2026-11-18-1` | post 1080x1080 | prima/dopo | prenota negli orari decisi, Agenda inclusa | mare |
| `post-2026-11-19-1` | reel, 22 s | Celeo spiega | urgenza al titolare con riassunto di due frasi | limone |
| `post-2026-11-20-1` | post 1080x1350 | numero con fonte | avviso AI all'inizio della chiamata | notte |
| `post-2026-11-20-2` | carosello, 7 slide | mini guida | WhatsApp, Instagram, Messenger, promemoria, riconoscimento, Sheets, con le date | mare |
| `post-2026-11-21-1` | reel, 27 s | dietro le quinte | Celea Uffici, l'ufficio con i reparti | sabbia |
| `post-2026-11-22-1` | storia 1080x1920 | lo sapevi che | cliniche veterinarie con Leandro, nessun consiglio su farmaci, dosi o cure | terra |

Anteprime: `anteprima-settimana-1.jpg`, `anteprima-settimana-2.jpg`, `anteprima-carosello.jpg`; per ogni reel
`…-copertina.jpg` e `…-fotogramma.jpg`.

## Da decidere (William)

1. **Le anteprime vanno bene?** Con il sì i file vengono copiati in `post/` e passati a Marketing.
2. **Le date della settimana di prova** (16–22 novembre) sono una proposta: se Marketing ha già contenuti in
   quei giorni, cambio il numero finale del nome.
3. **Il numero «50»** (articolo 50 dell'AI Act, Regolamento UE 2024/1689): chiedo a Legale di rileggere la frase prima dell'uscita.

## Cosa non è stato possibile

- **HQ non raggiungibile da questa sessione.** Non ho potuto leggere `strategia-listino` né `carolina-ripartenza`,
  né caricare guida e report. Prezzi e disponibilità vengono dal listino v2.2 pubblicato sul sito
  (`celea-sito/listino/`). Guida, report e nota di ripartenza sono in `brand-kit/hq/`, da caricare in HQ.
- **Celeo, tre pose** (Canva MAHaU-U4Izw): Canva dà solo la miniatura. Usate figura intera e busto, gli stessi
  file del sito. Servono i file caricati in `brand-kit/assets/`.
- **Elenco dei concorrenti**: vuoto. Il controllo sui nomi dei concorrenti scatta solo dopo che Brand lo compila.
- **«Ti richiama Sofia»**: non usata, perché non ancora accesa.
- **Prova su un telefono vero**: i video sono stati controllati fotogramma per fotogramma, non su Instagram.

## Regole rispettate

Niente «24 ore su 24» o «24/7», nessuna promessa di risultato, nessun concorrente, nessun consiglio medico,
«assistente AI» visibile quando parla l'assistente, disponibilità accanto a ogni funzione, nessun prezzo nelle
pubblicità, video senza musica. Su GitHub niente tolto, nessuna spesa, nessun contatto, nessuna chiave scritta.
