# Kit post e reel di Celea

Modelli e script per preparare post, caroselli, storie, reel e pubblicità con lo stile del sito nuovo
(palette A, Manrope e Source Sans 3, logo, Celeo, animazioni delle scene del sito).
Il reparto Brand scrive solo i testi; lo script produce PNG, JPG e MP4.

**Guida passo per passo:** `hq/brand-kit-post-guida.md`

## Cosa c'è

| Cartella | Contenuto |
|---|---|
| `modelli/` | Il modello HTML unico (`modello.html`), lo stile (`base.css`), il motore delle animazioni (`motore.js`), le scene (`scene.js`), il disegno dell'ufficio copiato dal sito (`ufficio-iso.js`), le scritte di disponibilità (`disponibilita.js`) |
| `assets/` | Celeo (figura intera e busto, gli stessi file del sito) e i caratteri (licenza OFL) |
| `testi/` | I file di testo: una cartella per settimana, più `pubblicita/` |
| `script/` | `esporta.js` (esportazione), `controlla.js` e `frasi-vietate.txt` (controllo dei testi) |
| `esempi/` | La settimana di prova del 16–22 novembre 2026: 8 contenuti |
| `pubblicita/` | Le pubblicità Meta: 5 nicchie × 3 ganci × 3 misure, con il testo dell'annuncio accanto |
| `hq/` | Guida, report e nota di ripartenza da caricare in HQ |

## In breve

```
node brand-kit/script/esporta.js brand-kit/testi/settimana-2026-11-16      # prepara la settimana in brand-kit/esempi
node brand-kit/script/esporta.js brand-kit/testi/settimana-2026-11-16 --pubblica   # copia anche in post/ (mai sopra un file che esiste)
node brand-kit/script/esporta.js brand-kit/testi/pubblicita                # prepara le pubblicità
node brand-kit/script/esporta.js brand-kit/testi/settimana-2026-11-16 --solo-controllo   # controlla solo i testi
```

I nomi dei file sono quelli che Metricool usa già: `post-AAAA-MM-GG-N.jpg` (e `.png`), le slide di un
carosello `post-AAAA-MM-GG-N-1.jpg`, `-2.jpg`…, i reel `post-AAAA-MM-GG-N.mp4`.

Regole: niente viene pubblicato, nessuna spesa, nessuna chiave. In `post/` non si sposta, rinomina o cancella niente.
