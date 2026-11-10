#!/usr/bin/env python3
"""Voce e musica dei reel di Celea (nessuna spesa, niente scaricato a parte la voce di Piper).

  python3 brand-kit/script/audio.py sintesi lavoro.json   legge le frasi con Piper e ne misura la durata
  python3 brand-kit/script/audio.py mix lavoro.json       mette la voce ai secondi giusti, la musica sotto, e scrive il WAV
  python3 brand-kit/script/audio.py musica 1 30 base.wav  solo la base musicale (variante 1 o 2, durata in secondi)

Lo chiama esporta.js con l'opzione --voce; a mano serve solo per ascoltare la musica.
Voce: Piper TTS, modello it_IT-paola-medium (dati con licenza CC0 1.0). Il file del modello (63 MB) non sta nel
repository: va in brand-kit/voci/ (vedi brand-kit/voci/LEGGIMI.md).
Musica: scritta qui sotto con il codice (onde sinusoidali), originale, senza campioni.
"""
import json, math, os, re, subprocess, sys, wave
import numpy as np

SR = 44100
QUI = os.path.dirname(os.path.abspath(__file__))
MODELLO = os.path.join(QUI, '..', 'voci', 'it_IT-paola-medium.onnx')

# Parametri di Piper. «corpo» = le frasi della scena; «forte» = gancio iniziale e chiusura (un po' più di energia).
# length = velocità (più alto = più lento; 1.0 è il normale), noise = variazione dell'intonazione, noise_w = variazione del ritmo.
VARIANTI = {
    'A': {'corpo': dict(length=1.08, noise=0.667, noise_w=0.80, pausa=0.28, volume=1.0),
          'forte': dict(length=1.02, noise=0.72, noise_w=0.85, pausa=0.24, volume=1.12)},
    'B': {'corpo': dict(length=1.16, noise=0.80, noise_w=0.95, pausa=0.36, volume=1.0),
          'forte': dict(length=1.08, noise=0.85, noise_w=1.00, pausa=0.30, volume=1.12)},
}


def pronuncia(t):
    """Stesse parole dello schermo, scritte in modo che Piper le dica bene. Non aggiunge e non toglie frasi."""
    t = re.sub(r'\*', '', t).replace(' / ', ' ')
    t = re.sub(r'(?i)\b(www\.)?celea\.it\b', 'celea punto it', t)
    t = re.sub(r"\b[Uu]n'AI\b", 'una A I', t)
    t = re.sub(r'\bAI\b', 'A I', t)
    t = re.sub(r'\b(\d{1,2}):00\b', r'\1', t)
    t = t.replace('«', '').replace('»', '').strip()
    return t if re.search(r'[.!?…]$', t) else t + '.'


def leggi_wav(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if w.getnchannels() == 2:
            a = a.reshape(-1, 2).mean(axis=1)
        sr = w.getframerate()
    if sr != SR:  # la voce esce a 22050 Hz
        x = np.arange(int(len(a) * SR / sr)) * sr / SR
        a = np.interp(x, np.arange(len(a)), a).astype(np.float32)
    return a


def scrivi_wav(p, st):
    st = np.clip(st, -1, 1)
    with wave.open(p, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def taglia_silenzio(a, soglia=0.012):
    forte = np.where(np.abs(a) > soglia)[0]
    if not len(forte):
        return a
    i, j = max(0, forte[0] - int(.02 * SR)), min(len(a), forte[-1] + int(.08 * SR))
    return a[i:j]


def sintesi(lav):
    par = VARIANTI[lav.get('variante', 'A')]
    os.makedirs(lav['cartella'], exist_ok=True)
    for s in lav['segmenti']:
        p = par[s.get('stile', 'corpo')]
        s['detto'] = pronuncia(s['testo'])
        s['wav'] = os.path.join(lav['cartella'], s['id'] + '.wav')
        subprocess.run([sys.executable, '-m', 'piper', '-m', MODELLO, '-f', s['wav'], '--length-scale', str(p['length']),
                        '--noise-scale', str(p['noise']), '--noise-w-scale', str(p['noise_w']),
                        '--sentence-silence', str(p['pausa']), '--volume', str(p['volume'])],
                       input=s['detto'].encode(), check=True, stderr=subprocess.DEVNULL)
        a = taglia_silenzio(leggi_wav(s['wav']))
        s['durata_ms'] = int(len(a) * 1000 / SR)
    return lav


# ---------------------------------------------------------------- musica
def nota(n):  # numero MIDI -> Hz
    return 440 * 2 ** ((n - 69) / 12)

BASI = {
    # variante 1: Re maggiore, 76 battiti al minuto, tappeto morbido e arpeggio leggero
    1: dict(bpm=76, accordi=[[50, 62, 66, 69, 73], [47, 59, 62, 66, 69], [43, 55, 59, 62, 66], [45, 57, 61, 64, 69]], arp=[1, 2, 3, 4, 3, 2, 3, 4]),
    # variante 2: Fa maggiore, 68 battiti al minuto, più calma, arpeggio più rado
    2: dict(bpm=68, accordi=[[41, 53, 57, 60, 64], [38, 50, 53, 57, 60], [46, 58, 62, 65, 69], [48, 60, 64, 67, 70]], arp=[1, 3, 2, 4, 0, 3, 2, 0]),
}


def musica(variante, durata):
    b = BASI[int(variante)]
    n = int(durata * SR); L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    battuta = 4 * 60 / b['bpm']; ottavo = battuta / 8
    def metti(sig, t0, pan):
        i = int(t0 * SR)
        if i >= n: return
        sig = sig[:n - i]
        L[i:i + len(sig)] += sig * (1 - pan); R[i:i + len(sig)] += sig * pan
    k = 0
    while k * battuta < durata:
        acc = b['accordi'][k % len(b['accordi'])]; t0 = k * battuta
        # tappeto: note lunghe, attacco e rilascio lenti
        lung = battuta * 1.12; t = np.arange(int(lung * SR)) / SR
        inv = np.minimum(1, t / 0.9) * np.minimum(1, (lung - t) / 1.1)
        for j, m in enumerate(acc):
            f = nota(m); vib = 1 + 0.0025 * np.sin(2 * math.pi * 4.6 * t + j)
            s = np.sin(2 * math.pi * f * t * vib) + 0.28 * np.sin(2 * math.pi * 2 * f * t) + 0.08 * np.sin(2 * math.pi * 3 * f * t)
            metti((0.055 if j else 0.085) * s * inv, t0, 0.5 + (j - 2) * 0.09)
        # arpeggio: tocchi brevi tipo carillon, un'ottava sopra
        for q, g in enumerate(b['arp']):
            if not g: continue
            f = nota(acc[g] + 12); t2 = np.arange(int(1.4 * SR)) / SR
            s = (np.sin(2 * math.pi * f * t2) + 0.35 * np.sin(2 * math.pi * 2 * f * t2) * np.exp(-t2 * 6)) * np.exp(-t2 * 3.2) * np.minimum(1, t2 / 0.006)
            metti(0.07 * s, t0 + q * ottavo, 0.32 if q % 2 else 0.68)
        k += 1
    st = np.stack([L, R], axis=1)
    t = np.arange(n) / SR
    st *= (np.minimum(1, t / 1.2) * np.minimum(1, (durata - t) / 1.8))[:, None]  # entra ed esce piano
    return st / max(1e-6, np.abs(st).max()) * 0.5


def rms_db(a):
    return 20 * math.log10(max(1e-9, float(np.sqrt(np.mean(a ** 2)))))


def mix(lav):
    n = int(lav['durata_ms'] / 1000 * SR); voce = np.zeros(n, np.float32); attivo = np.zeros(n, bool)
    for s in lav['segmenti']:
        a = taglia_silenzio(leggi_wav(s['wav'])); i = int(s['inizio_ms'] / 1000 * SR); a = a[:max(0, n - i)]
        voce[i:i + len(a)] += a; attivo[i:i + len(a)] = True
    m = musica(lav.get('musica', 1), lav['durata_ms'] / 1000)
    # musica circa 18 dB sotto la voce (misura sui tratti in cui la voce parla)
    sotto = float(lav.get('musica_db', -18))
    guadagno = 10 ** ((rms_db(voce[attivo]) + sotto - rms_db(m[1 * SR:-2 * SR])) / 20)
    st = np.stack([voce, voce], axis=1) + m * guadagno
    st *= 0.89 / max(0.89, float(np.abs(st).max()))
    scrivi_wav(lav['uscita'], st)
    lav['voce_db'] = round(rms_db(voce[attivo]), 1); lav['musica_db_reale'] = round(rms_db(m[1 * SR:-2 * SR] * guadagno), 1)
    return lav


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'musica':
        scrivi_wav(sys.argv[4], musica(sys.argv[2], float(sys.argv[3])))
    else:
        with open(sys.argv[2], encoding='utf8') as f:
            lav = json.load(f)
        lav = sintesi(lav) if cmd == 'sintesi' else mix(lav)
        with open(sys.argv[2], 'w', encoding='utf8') as f:
            json.dump(lav, f, ensure_ascii=False, indent=1)
