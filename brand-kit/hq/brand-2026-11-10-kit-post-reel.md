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

## Voce e musica nei reel (richiesta di William, 10/11/2026) · PROVA, in attesa del sì

**Stato:** fatti solo 3 reel di prova, rifatti dopo il primo ascolto di William. Gli altri si fanno dopo il suo sì.
I reel muti non sono stati toccati.

**Voce scelta da William:** Piper TTS (gratuito, open source, licenza MIT), voce `it_IT-serena-high`, italiana, femminile.
Licenza dei dati: **CC BY 4.0** (uso commerciale permesso, con citazione). Fonte del modello:
https://huggingface.co/rhasspy/piper-voices/tree/main/it/it_IT/serena/high · fonte dei dati:
https://huggingface.co/datasets/committa/serena-synthetic-it-27h. Citazione nel testo del post:
«Voce generata con AI (Piper, voce Serena, CC BY 4.0)». Il file del modello (114 MB) non è nel repository:
istruzioni in `brand-kit/voci/LEGGIMI.md`.
Prima prova con `it_IT-paola-medium` (CC0): bocciata da William, troppo robotica. Voce maschile per Marco: non c'è
una voce italiana di Piper di qualità sufficiente; Marco ha la stessa voce narrante.
**Da far verificare a Legale:** i dati di Serena sono sintetici (voce clonata con un altro modello); la licenza
dichiarata è CC BY 4.0 ma non è scritto di chi sia la voce d'origine.

**Come recita.** Velocità 1,12 nelle scene e 1,05 su gancio e chiusura (1,0 è il normale di Piper), pausa di 0,3 secondi
tra le frasi, voce schiarita (filtro sui bassi, più presenza sulle consonanti, volume uniforme). Da questa sessione
l'audio non si può ascoltare: il giudizio «a orecchio» è di William.

**Regola rispettata.** La voce dice solo il gancio, i sottotitoli, lo slogan e «Provi la demo gratis su celea.it», nello
stesso ordine dello schermo. Ogni frase parte quando appare la scritta e finisce prima che cambi: se è più lunga, la
scena si allunga (la voce non viene accelerata). Le scritte restano. Per ogni reel c'è `…-voce-sincronia.md` con i secondi.

**Musica.** Basi strumentali originali scritte con il codice (`brand-kit/script/audio.py`), senza campioni e senza nulla
di scaricato. Le prime due (tappeto morbido) sono state bocciate da William. Tre nuove, più allegre: 3 «ukulele
allegro», 4 «chitarra serena», 5 «marimba solare». William deve ancora scegliere: nella prova ce n'è una per reel.

**Missaggio.** Voce in primo piano, musica 18 dB sotto, nessun taglio. AAC stereo 44.100 Hz, circa −14 LUFS.

**Comando:** `node brand-kit/script/esporta.js <cartella dei testi> --voce --musica 3` (anche `--solo`).

**File nuovi della prova** (sul ramo `claude/celea-post-reel-kit-adg02t`, non ancora su `main`):

| Reel | File | Durata | Musica |
|---|---|---|---|
| Sofia · linea occupata | `brand-kit/esempi/post-2026-11-17-1-voce.mp4` | 28 s | 3 · ukulele allegro |
| Marco · chiamata della sera (pubblicità) | `brand-kit/pubblicita/immobiliare/immobiliare-chiamata-della-sera-1080x1920-voce.mp4` | 20 s | 4 · chitarra serena |
| Celea Uffici · dietro le quinte | `brand-kit/esempi/post-2026-11-21-1-voce.mp4` | 32 s | 5 · marimba solare |

**Da sapere.** Con la voce i reel si allungano di 4–5 secondi; quello di Celea Uffici supera i 30 (31,7 s): per
rientrare va tolta una frase.

## Elenco dei file, per la classifica e il calendario (Marketing, Brand, Strategia)

Aggiornato il 10/11/2026 dopo l'approvazione di William. I file sono sul ramo principale `main`.
Pagina con tutte le anteprime: `brand-kit/esempi/indice.html`. Le date nei nomi sono una proposta: le decide Marketing.

Repository `celea-media`, ramo principale `main`. Ogni link apre il file così com'è (link «raw» di GitHub).

### Settimana 2026-11-16

| Titolo | Settore | Tipo | Durata | File |
|---|---|---|---|---|
| Alle 21:00 chi risponde al telefono del Suo studio? | Studi dentistici · Sofia | Post 1080x1350 · domanda | – | [post-2026-11-16-1.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-16-1.png) |
| Pausa pranzo. La linea è occupata. | Studi dentistici · Sofia | Reel 1080x1920 · scenetta | 23 s | [post-2026-11-17-1.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-17-1.mp4) |
| Dai vocali da riascoltare all'agenda già pronta | Tutti i settori | Post 1080x1080 · prima-dopo | – | [post-2026-11-18-1.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-18-1.png) |
| Sabato mattina. Arriva un'urgenza. | Studi dentistici · Sofia | Reel 1080x1920 · celeo-spiega | 22 s | [post-2026-11-19-1.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-19-1.mp4) |
| È l'articolo dell'AI Act sulla trasparenza. | Tutti i settori | Post 1080x1350 · numero | – | [post-2026-11-20-1.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-1.png) |
| Dove risponde l'assistente AI, e da quando | Tutti i settori | Carosello, 7 slide 1080x1350 · guida | – | [post-2026-11-20-2-1.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-1.png)<br>[post-2026-11-20-2-2.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-2.png)<br>[post-2026-11-20-2-3.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-3.png)<br>[post-2026-11-20-2-4.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-4.png)<br>[post-2026-11-20-2-5.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-5.png)<br>[post-2026-11-20-2-6.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-6.png)<br>[post-2026-11-20-2-7.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-20-2-7.png) |
| Dietro le quinte: l'ufficio di Celea. | Celea Uffici | Reel 1080x1920 · dietro-le-quinte | 27 s | [post-2026-11-21-1.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-21-1.mp4) |
| Leandro non dà consigli su farmaci, dosi o cure. | Cliniche veterinarie · Leandro | Storia 1080x1920 · lo-sapevi | – | [post-2026-11-22-1.png](https://raw.githubusercontent.com/Lillo59/celea-media/main/post/post-2026-11-22-1.png) |

### Pubblicità · Studi dentistici · Sofia

| Titolo | Settore | Tipo | Durata | File |
|---|---|---|---|---|
| Linea occupata. E chi sta chiamando? | Studi dentistici · Sofia | Pubblicità 1080x1920 · gancio «linea occupata» | 12 s | [dentisti-linea-occupata-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-linea-occupata-1080x1920.mp4) |
| Linea occupata. E chi sta chiamando? | Studi dentistici · Sofia | Pubblicità 1080x1350 · gancio «linea occupata» | 12 s | [dentisti-linea-occupata-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-linea-occupata-1080x1350.mp4) |
| Linea occupata. E chi sta chiamando? | Studi dentistici · Sofia | Pubblicità 1080x1080 · gancio «linea occupata» | 12 s | [dentisti-linea-occupata-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-linea-occupata-1080x1080.mp4) |
| Sono le 21:07. Lo studio è chiuso. | Studi dentistici · Sofia | Pubblicità 1080x1920 · gancio «chiamata della sera» | 13 s | [dentisti-chiamata-della-sera-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-chiamata-della-sera-1080x1920.mp4) |
| Sono le 21:07. Lo studio è chiuso. | Studi dentistici · Sofia | Pubblicità 1080x1350 · gancio «chiamata della sera» | 13 s | [dentisti-chiamata-della-sera-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-chiamata-della-sera-1080x1350.mp4) |
| Sono le 21:07. Lo studio è chiuso. | Studi dentistici · Sofia | Pubblicità 1080x1080 · gancio «chiamata della sera» | 13 s | [dentisti-chiamata-della-sera-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-chiamata-della-sera-1080x1080.mp4) |
| Lo provi adesso. | Studi dentistici · Sofia | Pubblicità 1080x1920 · gancio «lo provi adesso» | 12 s | [dentisti-lo-provi-adesso-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-lo-provi-adesso-1080x1920.mp4) |
| Lo provi adesso. | Studi dentistici · Sofia | Pubblicità 1080x1350 · gancio «lo provi adesso» | 12 s | [dentisti-lo-provi-adesso-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-lo-provi-adesso-1080x1350.mp4) |
| Lo provi adesso. | Studi dentistici · Sofia | Pubblicità 1080x1080 · gancio «lo provi adesso» | 12 s | [dentisti-lo-provi-adesso-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/dentisti/dentisti-lo-provi-adesso-1080x1080.mp4) |

### Pubblicità · Agenzie immobiliari · Marco

| Titolo | Settore | Tipo | Durata | File |
|---|---|---|---|---|
| Linea occupata. E chi sta chiamando? | Agenzie immobiliari · Marco | Pubblicità 1080x1920 · gancio «linea occupata» | 13 s | [immobiliare-linea-occupata-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-linea-occupata-1080x1920.mp4) |
| Linea occupata. E chi sta chiamando? | Agenzie immobiliari · Marco | Pubblicità 1080x1350 · gancio «linea occupata» | 13 s | [immobiliare-linea-occupata-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-linea-occupata-1080x1350.mp4) |
| Linea occupata. E chi sta chiamando? | Agenzie immobiliari · Marco | Pubblicità 1080x1080 · gancio «linea occupata» | 13 s | [immobiliare-linea-occupata-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-linea-occupata-1080x1080.mp4) |
| Sono le 20:40. L'agenzia è chiusa. | Agenzie immobiliari · Marco | Pubblicità 1080x1920 · gancio «chiamata della sera» | 12 s | [immobiliare-chiamata-della-sera-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-chiamata-della-sera-1080x1920.mp4) |
| Sono le 20:40. L'agenzia è chiusa. | Agenzie immobiliari · Marco | Pubblicità 1080x1350 · gancio «chiamata della sera» | 12 s | [immobiliare-chiamata-della-sera-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-chiamata-della-sera-1080x1350.mp4) |
| Sono le 20:40. L'agenzia è chiusa. | Agenzie immobiliari · Marco | Pubblicità 1080x1080 · gancio «chiamata della sera» | 12 s | [immobiliare-chiamata-della-sera-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-chiamata-della-sera-1080x1080.mp4) |
| Lo provi adesso. | Agenzie immobiliari · Marco | Pubblicità 1080x1920 · gancio «lo provi adesso» | 12 s | [immobiliare-lo-provi-adesso-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-lo-provi-adesso-1080x1920.mp4) |
| Lo provi adesso. | Agenzie immobiliari · Marco | Pubblicità 1080x1350 · gancio «lo provi adesso» | 12 s | [immobiliare-lo-provi-adesso-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-lo-provi-adesso-1080x1350.mp4) |
| Lo provi adesso. | Agenzie immobiliari · Marco | Pubblicità 1080x1080 · gancio «lo provi adesso» | 12 s | [immobiliare-lo-provi-adesso-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/immobiliare/immobiliare-lo-provi-adesso-1080x1080.mp4) |

### Pubblicità · Strutture ricettive · Elena

| Titolo | Settore | Tipo | Durata | File |
|---|---|---|---|---|
| Linea occupata. E chi sta chiamando? | Strutture ricettive · Elena | Pubblicità 1080x1920 · gancio «linea occupata» | 13 s | [ricettive-linea-occupata-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-linea-occupata-1080x1920.mp4) |
| Linea occupata. E chi sta chiamando? | Strutture ricettive · Elena | Pubblicità 1080x1350 · gancio «linea occupata» | 13 s | [ricettive-linea-occupata-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-linea-occupata-1080x1350.mp4) |
| Linea occupata. E chi sta chiamando? | Strutture ricettive · Elena | Pubblicità 1080x1080 · gancio «linea occupata» | 13 s | [ricettive-linea-occupata-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-linea-occupata-1080x1080.mp4) |
| Sono le 22:15. La reception è chiusa. | Strutture ricettive · Elena | Pubblicità 1080x1920 · gancio «chiamata della sera» | 13 s | [ricettive-chiamata-della-sera-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-chiamata-della-sera-1080x1920.mp4) |
| Sono le 22:15. La reception è chiusa. | Strutture ricettive · Elena | Pubblicità 1080x1350 · gancio «chiamata della sera» | 13 s | [ricettive-chiamata-della-sera-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-chiamata-della-sera-1080x1350.mp4) |
| Sono le 22:15. La reception è chiusa. | Strutture ricettive · Elena | Pubblicità 1080x1080 · gancio «chiamata della sera» | 13 s | [ricettive-chiamata-della-sera-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-chiamata-della-sera-1080x1080.mp4) |
| Lo provi adesso. | Strutture ricettive · Elena | Pubblicità 1080x1920 · gancio «lo provi adesso» | 12 s | [ricettive-lo-provi-adesso-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-lo-provi-adesso-1080x1920.mp4) |
| Lo provi adesso. | Strutture ricettive · Elena | Pubblicità 1080x1350 · gancio «lo provi adesso» | 12 s | [ricettive-lo-provi-adesso-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-lo-provi-adesso-1080x1350.mp4) |
| Lo provi adesso. | Strutture ricettive · Elena | Pubblicità 1080x1080 · gancio «lo provi adesso» | 12 s | [ricettive-lo-provi-adesso-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/ricettive/ricettive-lo-provi-adesso-1080x1080.mp4) |

### Pubblicità · Celea Uffici

| Titolo | Settore | Tipo | Durata | File |
|---|---|---|---|---|
| Linea occupata? L'ufficio risponde. | Celea Uffici | Pubblicità 1080x1920 · gancio «linea occupata» | 17 s | [uffici-linea-occupata-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-linea-occupata-1080x1920.mp4) |
| Linea occupata? L'ufficio risponde. | Celea Uffici | Pubblicità 1080x1350 · gancio «linea occupata» | 17 s | [uffici-linea-occupata-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-linea-occupata-1080x1350.mp4) |
| Linea occupata? L'ufficio risponde. | Celea Uffici | Pubblicità 1080x1080 · gancio «linea occupata» | 17 s | [uffici-linea-occupata-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-linea-occupata-1080x1080.mp4) |
| Sono le 21:00. Chi prepara il lavoro di domani? | Celea Uffici | Pubblicità 1080x1920 · gancio «chiamata della sera» | 17 s | [uffici-chiamata-della-sera-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-chiamata-della-sera-1080x1920.mp4) |
| Sono le 21:00. Chi prepara il lavoro di domani? | Celea Uffici | Pubblicità 1080x1350 · gancio «chiamata della sera» | 17 s | [uffici-chiamata-della-sera-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-chiamata-della-sera-1080x1350.mp4) |
| Sono le 21:00. Chi prepara il lavoro di domani? | Celea Uffici | Pubblicità 1080x1080 · gancio «chiamata della sera» | 17 s | [uffici-chiamata-della-sera-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-chiamata-della-sera-1080x1080.mp4) |
| Lo provi adesso. | Celea Uffici | Pubblicità 1080x1920 · gancio «lo provi adesso» | 18 s | [uffici-lo-provi-adesso-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-lo-provi-adesso-1080x1920.mp4) |
| Lo provi adesso. | Celea Uffici | Pubblicità 1080x1350 · gancio «lo provi adesso» | 18 s | [uffici-lo-provi-adesso-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-lo-provi-adesso-1080x1350.mp4) |
| Lo provi adesso. | Celea Uffici | Pubblicità 1080x1080 · gancio «lo provi adesso» | 18 s | [uffici-lo-provi-adesso-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/uffici/uffici-lo-provi-adesso-1080x1080.mp4) |

### Pubblicità · Cliniche veterinarie · Leandro

| Titolo | Settore | Tipo | Durata | File |
|---|---|---|---|---|
| Linea occupata. E chi sta chiamando? | Cliniche veterinarie · Leandro | Pubblicità 1080x1920 · gancio «linea occupata» | 13 s | [veterinari-linea-occupata-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-linea-occupata-1080x1920.mp4) |
| Linea occupata. E chi sta chiamando? | Cliniche veterinarie · Leandro | Pubblicità 1080x1350 · gancio «linea occupata» | 13 s | [veterinari-linea-occupata-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-linea-occupata-1080x1350.mp4) |
| Linea occupata. E chi sta chiamando? | Cliniche veterinarie · Leandro | Pubblicità 1080x1080 · gancio «linea occupata» | 13 s | [veterinari-linea-occupata-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-linea-occupata-1080x1080.mp4) |
| Sono le 20:50. La clinica è chiusa. | Cliniche veterinarie · Leandro | Pubblicità 1080x1920 · gancio «chiamata della sera» | 13 s | [veterinari-chiamata-della-sera-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-chiamata-della-sera-1080x1920.mp4) |
| Sono le 20:50. La clinica è chiusa. | Cliniche veterinarie · Leandro | Pubblicità 1080x1350 · gancio «chiamata della sera» | 13 s | [veterinari-chiamata-della-sera-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-chiamata-della-sera-1080x1350.mp4) |
| Sono le 20:50. La clinica è chiusa. | Cliniche veterinarie · Leandro | Pubblicità 1080x1080 · gancio «chiamata della sera» | 13 s | [veterinari-chiamata-della-sera-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-chiamata-della-sera-1080x1080.mp4) |
| Lo provi adesso. | Cliniche veterinarie · Leandro | Pubblicità 1080x1920 · gancio «lo provi adesso» | 12 s | [veterinari-lo-provi-adesso-1080x1920.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-lo-provi-adesso-1080x1920.mp4) |
| Lo provi adesso. | Cliniche veterinarie · Leandro | Pubblicità 1080x1350 · gancio «lo provi adesso» | 12 s | [veterinari-lo-provi-adesso-1080x1350.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-lo-provi-adesso-1080x1350.mp4) |
| Lo provi adesso. | Cliniche veterinarie · Leandro | Pubblicità 1080x1080 · gancio «lo provi adesso» | 12 s | [veterinari-lo-provi-adesso-1080x1080.mp4](https://raw.githubusercontent.com/Lillo59/celea-media/main/brand-kit/pubblicita/veterinari/veterinari-lo-provi-adesso-1080x1080.mp4) |
