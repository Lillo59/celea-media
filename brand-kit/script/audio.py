#!/usr/bin/env python3
"""Voce e musica dei reel di Celea (nessuna spesa, niente scaricato a parte la voce di Piper).

  python3 brand-kit/script/audio.py sintesi lavoro.json   legge le frasi con Piper e ne misura la durata
  python3 brand-kit/script/audio.py mix lavoro.json       mette la voce ai secondi giusti, la musica sotto, e scrive il WAV
  python3 brand-kit/script/audio.py musica 1 30 base.wav  solo la base musicale (variante 1 o 2, durata in secondi)

Lo chiama esporta.js con l'opzione --voce; a mano serve solo per ascoltare la musica.
Voce: Piper TTS, modello it_IT-serena-high (dati con licenza CC BY 4.0: va citata la fonte). Il file del modello (114 MB) non sta nel
repository: va in brand-kit/voci/ (vedi brand-kit/voci/LEGGIMI.md).
Musica: scritta qui sotto con il codice (onde sinusoidali), originale, senza campioni.
"""
import json, math, os, re, subprocess, sys, wave
import numpy as np

SR = 44100
QUI = os.path.dirname(os.path.abspath(__file__))
MODELLO = os.path.join(QUI, '..', 'voci', 'it_IT-serena-high.onnx')  # voce scelta da William il 10/11/2026

# Parametri di Piper. «corpo» = le frasi della scena; «forte» = gancio iniziale e chiusura (un po' più di energia).
# length = velocità (più alto = più lento; 1.0 è il normale), noise = variazione dell'intonazione, noise_w = variazione del ritmo.
VARIANTI = {
    'A': {'corpo': dict(length=1.08, noise=0.667, noise_w=0.80, pausa=0.28, volume=1.0),
          'forte': dict(length=1.02, noise=0.72, noise_w=0.85, pausa=0.24, volume=1.12)},
    'B': {'corpo': dict(length=1.12, noise=0.75, noise_w=0.90, pausa=0.30, volume=1.0),   # come nel campione approvato
          'forte': dict(length=1.05, noise=0.75, noise_w=0.90, pausa=0.30, volume=1.1)},
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
        # voce più limpida: toglie i bassi inutili, schiarisce le consonanti, tiene il volume uniforme
        pulito = s['wav'].replace('.wav', '-p.wav')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', s['wav'], '-af',
                        'highpass=f=85,equalizer=f=3200:t=q:w=1.2:g=3,acompressor=threshold=-22dB:ratio=3:attack=5:release=120', pulito], check=True)
        s['wav'] = pulito
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



# ---------------------------------------------------------------- musica allegra (varianti 3, 4, 5)
# Strumenti «acustici» fatti con il codice: corda pizzicata (metodo Karplus-Strong), marimba, basso,
# cassa morbida, schiocco di dita e shaker. Nessun campione, niente scaricato.
_corde = {}
def corda(m, dur, morbida=0.996, seme=0):
    k = (m, round(dur, 2), morbida)
    if k not in _corde:
        N = max(2, int(round(SR / nota(m)))); rng = np.random.default_rng(1000 + m + seme)
        p = rng.uniform(-1, 1, N).astype(np.float32); p = (p + np.roll(p, 1) + np.roll(p, 2)) / 3  # pizzico meno aspro
        giri = int(dur * SR / N) + 1; out = np.empty(giri * N, np.float32)
        for g in range(giri):
            out[g * N:(g + 1) * N] = p; p = morbida * 0.5 * (p + np.roll(p, 1))
        out = out[:int(dur * SR)]; t = np.arange(len(out)) / SR
        _corde[k] = out * np.minimum(1, t / 0.003) * np.minimum(1, (dur - t) / 0.05)
    return _corde[k]

def marimba(m, dur=0.9):
    t = np.arange(int(dur * SR)) / SR; f = nota(m)
    return ((np.sin(2 * math.pi * f * t) + 0.45 * np.sin(2 * math.pi * 4 * f * t) * np.exp(-t * 14)) * np.exp(-t * 6.5) * np.minimum(1, t / 0.004)).astype(np.float32)

def cassa():
    t = np.arange(int(0.22 * SR)) / SR; f = 48 + 70 * np.exp(-t * 28)
    return (np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-t * 16)).astype(np.float32)

def schiocco(seme):
    rng = np.random.default_rng(seme); t = np.arange(int(0.09 * SR)) / SR
    r = rng.uniform(-1, 1, len(t)).astype(np.float32); r = np.diff(r, prepend=0); r = (r + np.roll(r, 1)) / 2
    return r * np.exp(-t * 55) * (1 + 0.7 * np.exp(-((t - 0.012) / 0.004) ** 2))

def shaker(seme):
    rng = np.random.default_rng(seme); t = np.arange(int(0.05 * SR)) / SR
    r = np.diff(rng.uniform(-1, 1, len(t)).astype(np.float32), prepend=0)
    return r * np.minimum(1, t / 0.012) * np.exp(-t * 60)

ALLEGRE = {
    # 3 · «ukulele allegro»: Do maggiore, 104 battiti, pennate di ukulele, marimba che canta, schiocco di dita
    3: dict(bpm=104, stile='pennata', accordi=[[67, 60, 64, 72], [67, 62, 67, 71], [69, 60, 64, 69], [69, 60, 65, 69]], basso=[48, 43, 45, 41],
            canto=[[76, None, 79, 84], [74, None, 79, 83], [72, None, 76, 81], [72, 77, 81, 79]], cassa=[0, 4], dita=[2, 6]),
    # 4 · «chitarra serena»: Sol maggiore, 88 battiti, arpeggio di chitarra, basso lungo, shaker leggero
    4: dict(bpm=88, stile='arpeggio', accordi=[[55, 59, 62, 67], [52, 59, 64, 67], [48, 60, 64, 67], [50, 57, 62, 66]], basso=[43, 40, 36, 38],
            canto=[[None, 74, None, 79], [None, 76, None, 79], [None, 76, None, 72], [None, 74, 78, 81]], cassa=[0], dita=[4]),
    # 5 · «marimba solare»: Fa maggiore, 112 battiti, marimba che gira, cassa morbida su ogni tempo
    5: dict(bpm=112, stile='marimba', accordi=[[65, 69, 72, 77], [64, 67, 72, 76], [62, 65, 69, 74], [62, 65, 70, 74]], basso=[41, 36, 38, 34],
            canto=[[81, None, 84, None], [79, None, 84, 88], [77, None, 81, None], [77, 82, 86, 84]], cassa=[0, 2, 4, 6], dita=[2, 6]),
}

def musica_allegra(variante, durata):
    b = ALLEGRE[int(variante)]; n = int(durata * SR); L = np.zeros(n + SR * 3, np.float32); R = np.zeros(n + SR * 3, np.float32)
    ott = 60 / b['bpm'] / 2; batt = ott * 8  # un ottavo, una battuta
    def metti(sig, t0, vol, pan=0.5):
        i = int(t0 * SR)
        if i >= n: return
        L[i:i + len(sig)] += sig * vol * (1 - pan) * 2; R[i:i + len(sig)] += sig * vol * pan * 2
    k = 0
    while k * batt < durata:
        t0 = k * batt; acc = b['accordi'][k % 4]; pieno = k >= 1  # la prima battuta entra più leggera
        metti(corda(b['basso'][k % 4], ott * 3.6, 0.998), t0, 0.30); metti(corda(b['basso'][k % 4], ott * 2.6, 0.998), t0 + ott * 4, 0.24)
        if b['stile'] == 'pennata':  # giù . giù su . su giù su
            for q, verso in [(0, 1), (2, 1), (3, -1), (5, -1), (6, 1), (7, -1)]:
                ordine = acc if verso > 0 else acc[::-1]
                for j, m in enumerate(ordine):
                    metti(corda(m, ott * 2.2, 0.994, j), t0 + q * ott + j * 0.011, (0.16 if verso > 0 else 0.10) * (1.15 if q == 0 else 1), 0.36 + 0.09 * j)
        elif b['stile'] == 'arpeggio':
            for q, j in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
                metti(corda(acc[j], ott * 4.5, 0.997, j), t0 + q * ott, 0.21 if q % 4 == 0 else 0.15, 0.4 + 0.07 * j)
        else:
            for q, j in enumerate([0, 2, 1, 3, 0, 2, 3, 1]):
                metti(marimba(acc[j] - 12 if q % 4 == 0 else acc[j], 0.7), t0 + q * ott, 0.20 if q % 2 == 0 else 0.13, 0.35 + 0.1 * j)
            for j, m in enumerate(acc[:3]): metti(corda(m, ott * 7, 0.997, j), t0 + j * 0.02, 0.07, 0.5)
        if pieno:
            for q, m in enumerate(b['canto'][k % 4]):
                if m: metti(marimba(m, 1.0), t0 + q * 2 * ott, 0.17 if b['stile'] != 'marimba' else 0.12, 0.62)
            for q in b['cassa']: metti(cassa(), t0 + q * ott, 0.34)
            for q in b['dita']: metti(schiocco(k * 8 + q), t0 + q * ott, 0.20, 0.55)
        for q in range(8): metti(shaker(k * 8 + q), t0 + q * ott, 0.05 if q % 2 else 0.03, 0.7)
        k += 1
    st = np.stack([L[:n], R[:n]], axis=1); t = np.arange(n) / SR
    st *= (np.minimum(1, t / 0.4) * np.minimum(1, (durata - t) / 1.6))[:, None]
    return st / max(1e-6, np.abs(st).max()) * 0.6

_musica_dolce = musica
def musica(variante, durata):
    return musica_allegra(variante, durata) if int(variante) in ALLEGRE else _musica_dolce(variante, durata)


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
