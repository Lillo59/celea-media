# Voce dei reel

- **Motore:** Piper TTS (gratuito, open source, licenza MIT). Si installa con `pip install piper-tts`.
- **Voce:** `it_IT-paola-medium` (italiana, femminile, 22.050 Hz).
- **Licenza:** i dati della voce sono pubblicati con licenza **CC0 1.0** (pubblico dominio: uso commerciale permesso,
  nessun obbligo di citazione). Scheda del modello: `it_IT-paola-medium.MODEL_CARD` in questa cartella.
- **Fonte del modello:** https://huggingface.co/rhasspy/piper-voices/tree/main/it/it_IT/paola/medium
- **Fonte dei dati:** https://huggingface.co/datasets/paolapersico1/Voice-Dataset-Italian (licenza letta il 10/11/2026: `cc0-1.0`)

Il file del modello (`it_IT-paola-medium.onnx`, 63 MB) **non è nel repository**: va scaricato dalla fonte qui sopra e
messo in questa cartella insieme a `it_IT-paola-medium.onnx.json`.

## Voci scartate

- `it_IT-riccardo-x_low` (maschile): licenza permissiva (dati M-AILABS), ma qualità «x_low» a 16.000 Hz: troppo bassa
  per un reel. Per questo Marco oggi ha la stessa voce narrante femminile.
- `it_IT-serena` (femminile): licenza CC-BY-4.0, uso commerciale permesso ma con citazione obbligatoria; i dati sono
  sintetici (voce clonata con un altro modello). Scartata per prudenza: Paola ha la licenza più semplice.

Nei testi dei post con voce va scritto in fondo: «Voce generata con AI».
