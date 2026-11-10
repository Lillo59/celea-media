# brand-kit-post-guida · Come si preparano post, reel e pubblicità con il kit

Reparto Brand e grafica · 10/11/2026 · vale per il repository `celea-media`, cartella `brand-kit/`.

## A cosa serve

Scrivendo un file di testo (titolo e frasi) si ottengono le immagini e i video finiti, con lo stile del sito
nuovo, Celeo e il logo. Nessun programma di grafica, nessuna spesa. Lo script non pubblica niente:
la pubblicazione su Metricool resta a Marketing, all'ora fissata.

## Per il reparto Brand: i passi

1. **Copiare un file di testo simile** dalla cartella `brand-kit/testi/settimana-2026-11-16/` in una cartella nuova
   per la settimana, per esempio `brand-kit/testi/settimana-2026-11-23/`.
2. **Dare al file il nome che avrà su Metricool:** `post-AAAA-MM-GG-N.txt` (data di uscita e numero del contenuto
   del giorno). Lo script userà lo stesso nome per l'immagine o il video.
3. **Cambiare solo i testi.** Le righe sono «chiave: valore»; gli elenchi hanno un trattino davanti.
   Una parola tra asterischi (`*così*`) esce colorata; ` / ` manda a capo.
4. **Controllare:** `node brand-kit/script/esporta.js brand-kit/testi/settimana-2026-11-23 --solo-controllo`.
   Se c'è una frase vietata o manca una disponibilità, lo script lo dice e si ferma.
5. **Esportare:** stesso comando senza `--solo-controllo`. I file arrivano in `brand-kit/esempi/`.
6. **Guardare le anteprime.** Per ogni reel ci sono anche `…-copertina.jpg` e `…-fotogramma.jpg`.
7. **Dopo l'approvazione di William:** aggiungere `--pubblica`. I file vengono copiati in `post/`
   con i nomi di Metricool. Se un file con quel nome esiste già, **non viene sovrascritto**.
8. Marketing carica i file su Metricool. Per i reel la copertina va a 1,5 secondi.

## Le righe che si possono scrivere

| Riga | Cosa fa | Valori |
|---|---|---|
| `tipo` | che cosa si prepara | `post`, `carosello`, `storia`, `reel`, `pubblicita` |
| `formato` | uno degli 8 formati | `domanda`, `scenetta`, `celeo-spiega`, `prima-dopo`, `dietro-le-quinte`, `numero`, `guida`, `lo-sapevi` |
| `misura` | grandezza | `1080x1080`, `1080x1350`, `1080x1920` |
| `sfondo` | colore di fondo (palette A) | `sabbia`, `crema`, `limone`, `mare`, `notte`, `terra` |
| `celeo` | dove sta Celeo | `destra`, `sinistra`, `no` |
| `anello` | dove sta il cerchio del logo sullo sfondo | `alto-dx`, `alto-sx`, `basso-dx`, `basso-sx`, `no` |
| `occhiello`, `titolo`, `testo`, `nota` | i testi | liberi |
| `disponibilita` | la scritta con la data, **obbligatoria** | `telefono`, `whatsapp`, `social`, `promemoria`, `riconoscimento`, `sheets`, `uffici`, `nessuna` (anche più di una, con la virgola) |

Righe proprie di un formato: `invito` (domanda); `ora`, `giorno`, `righe` (scenetta: `- 21:07 | testo | nota`,
con `AI` davanti all'ora quando parla l'assistente); `fumetto`, `punti` (celeo-spiega); `prima`, `dopo`,
`prima_titolo`, `dopo_titolo` (prima-dopo); `firma` (dietro-le-quinte); `numero_grande`, `fonte` (numero: la fonte è obbligatoria).

**Carosello:** dopo le righe generali, ogni slide è un blocco separato da una riga `---`. La prima è la copertina
con Celeo, l'ultima la chiusura «Prova la demo gratis su celea.it». Da 5 a 7 slide.

**Reel:** `scena` sceglie l'animazione; `gancio` è il titolo dei primi secondi, presentato da Celeo; `frasi` è l'elenco
dei sottotitoli (grandi, si legge senza audio). Una frase per passaggio: meglio sotto gli 80 caratteri.
Con 5 o 6 frasi il reel dura 20–28 secondi, a 30 fotogrammi al secondo. La chiusura con logo, slogan e
www.celea.it si aggiunge da sola.

| `scena` | Che cosa mostra | Passaggi |
|---|---|---|
| `telefonata` | l'assistente AI risponde, propone gli orari, l'appuntamento entra in agenda | 5 |
| `occupato` | linea occupata: la chiamata passa all'assistente AI | 5 |
| `agenda` | l'agenda si riempie, solo negli orari decisi | 5 |
| `urgenza` | urgenza passata al titolare con il riassunto di due frasi | 5 |
| `ufficio` | l'ufficio con i reparti (disegno isometrico del sito), Celeo fa da guida | 9 |
| `demo` | la demo col nome della propria attività | 4 |

`nicchia` sceglie nomi e battute d'esempio: `dentisti` (Sofia), `immobiliare` (Marco), `ricettive` (Elena),
`veterinari` (Leandro), `uffici`. Le battute stanno in `brand-kit/modelli/scene.js`, in alto.

**Pubblicità:** un file per nicchia in `brand-kit/testi/pubblicita/`. In alto `annuncio_titolo`, `annuncio_testo`,
`annuncio_pulsante`; poi tre blocchi, uno per gancio (`versione`, `gancio`, `scena`, `frasi`). Lo script prepara
ogni gancio in tre misure e scrive accanto `<nicchia>-annuncio.md` con il testo e l'esito del controllo.

## Le regole che lo script controlla da solo

- Niente «24 ore su 24», «24/7» e simili; nessuna promessa di risultato; nessun nome di concorrente
  (l'elenco dei concorrenti va scritto in `brand-kit/script/frasi-vietate.txt`: oggi è vuoto).
- Nelle pubblicità nessun prezzo.
- Disponibilità sempre scritta: telefono e Agenda «attivazioni da gennaio 2027»; WhatsApp «da gennaio 2027»;
  Instagram, Messenger, riconoscimento di chi richiama, CSV e Google Sheets «in arrivo nel 2027»;
  promemoria con telefonata «in arrivo».
- Se compare il nome di un assistente deve comparire anche «assistente AI» (nei video la scritta è sempre in alto).
- Il formato «numero» vuole la fonte.
- Varietà: in una cartella mai due contenuti dello stesso formato di fila; avvisa se sfondo o posizione di Celeo si ripetono.

Quello che lo script **non** può controllare e resta a chi scrive: che i fatti siano veri, che prezzi e servizi
vengano solo dal listino v2.2, che non si diano consigli medici né su farmaci, dosi o cure.

## Gli 8 formati che ruotano

1. Domanda al pubblico · 2. Scenetta (chiamata alle 21, linea occupata a pranzo, urgenza del sabato) ·
3. Celeo che spiega una funzione · 4. Prima/dopo, senza promesse · 5. Dietro le quinte di Celea ·
6. Numero o curiosità vera, con la fonte · 7. Mini guida in carosello · 8. «Lo sapevi che».

## Per William

- Le anteprime da guardare sono in `brand-kit/esempi/` (immagini e, per ogni reel, copertina e fotogramma).
- Le pubblicità sono in `brand-kit/pubblicita/<nicchia>/`, con il testo dell'annuncio nel file `…-annuncio.md`.
  Sono solo file: nessuna campagna creata, nessuna spesa.
- Niente va su Metricool finché non lo decide Lei. Per dire sì a una settimana basta rispondere «approvata»:
  Brand rifà l'esportazione con `--pubblica` e Marketing programma.
- Per cambiare una scritta di disponibilità (per esempio quando una funzione viene accesa) si corregge una riga
  sola in `brand-kit/modelli/disponibilita.js` e si riesporta.

## Celeo

Si usano le due immagini già presenti sul sito: figura intera che saluta (Canva MAHaU9AECRU) e busto alla
scrivania (Canva MAHaU6nnm_o). Le tre pose (Canva MAHaU-U4Izw) non sono ancora nel kit: da Canva si riesce
a scaricare solo la miniatura. Quando arrivano i vettoriali, o i file caricati in `brand-kit/assets/`, basta
sostituire i file senza toccare i modelli. Non si disegna un leone diverso.

## Musica

I video escono con l'audio muto. Se serve musica, solo brani senza diritti (libreria di Meta o di Metricool).

## Che cosa serve sul computer

Node, Playwright con Chromium, ffmpeg. Un reel si prepara in circa un minuto.
