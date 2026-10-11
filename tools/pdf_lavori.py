#!/usr/bin/env python3
"""Crea il PDF "Lavori interni" di un reparto Celea.

Uso:
  python3 tools/pdf_lavori.py uscita.pdf "Nome reparto" file1.json [file2.json ...]

Ogni file JSON è un documento del database (report o documento) con almeno
"titolo" e "testo"; "data" è facoltativa. Il primo file è il report del turno,
gli altri sono i documenti allegati. Usa solo i font standard (Helvetica),
così il PDF resta leggero (in genere 5-20 KB) e si può allegare a un'email.
"""
import json
import sys
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (KeepTogether, PageBreak, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

MARE, SAB, TER, INK, GR, LIN = (HexColor(c) for c in
                                ('#0F4C5C', '#F4EDE3', '#C8664A', '#1F2D33', '#5B6B70', '#E3D8C7'))

S = {
    'kick': ParagraphStyle('k', fontName='Helvetica-Bold', fontSize=8, textColor=TER, leading=11, spaceAfter=2),
    'h1': ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=18, textColor=MARE, leading=22, spaceAfter=4),
    'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=13, textColor=MARE, leading=17, spaceBefore=6, spaceAfter=4),
    'h3': ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=10.5, textColor=MARE, leading=14, spaceBefore=6, spaceAfter=2),
    'meta': ParagraphStyle('m', fontName='Helvetica', fontSize=8.5, textColor=GR, leading=11, spaceAfter=8),
    'p': ParagraphStyle('p', fontName='Helvetica', fontSize=9.5, textColor=INK, leading=13.5, spaceAfter=3),
    'li': ParagraphStyle('li', fontName='Helvetica', fontSize=9.5, textColor=INK, leading=13.5, leftIndent=10,
                         bulletIndent=1, spaceAfter=2),
    'cell': ParagraphStyle('c', fontName='Helvetica', fontSize=8, textColor=INK, leading=10.5),
}


def clean(s):
    # i font standard usano WinAnsi: sostituisci i caratteri che non esistono
    rep = {'≈': '~', '→': '->', '←': '<-', '≥': '>=', '≤': '<=', '×': 'x', '−': '-', '✓': 'v', '✔': 'v',
           ' ': ' ', ' ': ' ', ' ': ' '}
    for a, b in rep.items():
        s = s.replace(a, b)
    return s.encode('cp1252', 'replace').decode('cp1252')


def table(rows):
    data = [[Paragraph(escape(clean(c.strip())), S['cell']) for c in r] for r in rows]
    n = max(len(r) for r in data)
    data = [r + [''] * (n - len(r)) for r in data]
    t = Table(data, repeatRows=1, colWidths=[(A4[0] - 36 * mm) / n] * n)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SAB), ('LINEBELOW', (0, 0), (-1, -1), 0.4, LIN),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]))
    return t


def body(text):
    out, rows = [], []
    for raw in clean(text or '').splitlines():
        line = raw.strip()
        if line.startswith('|') and line.endswith('|'):
            cells = line.strip('|').split('|')
            if not all(set(c.strip()) <= set('-: ') for c in cells):
                rows.append(cells)
            continue
        if rows:
            out += [table(rows), Spacer(1, 4)]
            rows = []
        if not line:
            out.append(Spacer(1, 3))
        elif line.startswith('#'):
            out.append(Paragraph(escape(line.lstrip('# ')), S['h3']))
        elif line[:2] in ('- ', '* ', '• '):
            out.append(Paragraph(escape(line[2:]), S['li'], bulletText='•'))
        elif line.isupper() and len(line) < 90:
            out.append(Paragraph(escape(line.capitalize()), S['h3']))
        else:
            out.append(Paragraph(escape(line), S['p']))
    if rows:
        out.append(table(rows))
    return out


def footer(c, doc):
    c.saveState()
    c.setStrokeColor(LIN); c.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    c.setFont('Helvetica-Bold', 8); c.setFillColor(MARE); c.drawString(18 * mm, 10 * mm, 'celea')
    c.setFont('Helvetica', 7.5); c.setFillColor(GR)
    c.drawRightString(A4[0] - 18 * mm, 10 * mm, 'Lavori interni - uso riservato - pagina %d' % doc.page)
    c.restoreState()


def main():
    out, reparto, files = sys.argv[1], sys.argv[2], sys.argv[3:]
    docs = []
    for f in files:
        d = json.load(open(f, encoding='utf-8'))
        docs.append(d.get('data', d) if isinstance(d.get('data'), dict) else d)
    story = []
    for i, d in enumerate(docs):
        if i:
            story.append(PageBreak())
        story += [Paragraph(escape(clean('LAVORI INTERNI - ' + reparto.upper() if i == 0 else 'DOCUMENTO ALLEGATO')), S['kick']),
                  Paragraph(escape(clean(d.get('titolo', 'Senza titolo'))), S['h1'] if i == 0 else S['h2'])]
        if d.get('data'):
            story.append(Paragraph(escape(clean(str(d['data'])[:16].replace('T', ' '))), S['meta']))
        if d.get('url'):
            story.append(Paragraph(escape(clean('Link: ' + d['url'])), S['meta']))
        story += body(d.get('testo', ''))
    doc = SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm,
                            bottomMargin=20 * mm, title='Celea - ' + clean(reparto), author='Celea')
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == '__main__':
    main()
