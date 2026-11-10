# Voce dei reel

- **Motore:** Piper TTS (gratuito, open source, licenza MIT). Si installa con `pip install piper-tts`.
- **Voce scelta da William il 10/11/2026:** `it_IT-serena-high` (italiana, femminile, qualità alta, 22.050 Hz).
- **Licenza:** dati della voce con licenza **CC BY 4.0**: uso commerciale permesso, **con citazione della fonte**.
  Scheda del modello: `it_IT-serena-high.MODEL_CARD` in questa cartella (letta il 10/11/2026).
- **Fonte del modello:** https://huggingface.co/rhasspy/piper-voices/tree/main/it/it_IT/serena/high
- **Fonte dei dati:** https://huggingface.co/datasets/committa/serena-synthetic-it-27h (dati sintetici, 27 ore)
- **Citazione da usare:** «Voce generata con AI (Piper, voce Serena, CC BY 4.0)», in fondo al testo del post.

Il file del modello (`it_IT-serena-high.onnx`, 114 MB) **non è nel repository**: va scaricato dalla fonte qui sopra e
messo in questa cartella insieme a `it_IT-serena-high.onnx.json`.

## Voci provate e non scelte

- `it_IT-paola-medium` (femminile, licenza CC0 1.0): prima prova, giudicata troppo robotica.
- `it_IT-riccardo-x_low` (maschile): qualità troppo bassa (16.000 Hz), mai usata.
- Kokoro «Sara» e «Nicola» (altro motore, licenza Apache 2.0): ascoltate come campioni, non scelte.

## Da far verificare a Legale

I dati di Serena sono sintetici: la scheda dice che sono stati generati con un altro modello vocale in modalità
«clonazione». La licenza dichiarata è CC BY 4.0, ma non è scritto di chi sia la voce d'origine. Per le pubblicità a
pagamento conviene un controllo di Legale prima dell'uscita.
