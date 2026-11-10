/* Controllo dei testi prima di esportare. Se trova una frase vietata l'esportazione si ferma.
   Le regole sono quelle del reparto Brand (10/11/2026); le frasi stanno in frasi-vietate.txt. */
"use strict";
const fs=require("fs"), path=require("path");
const DISP=require("../modelli/disponibilita.js").CELEA_DISP;

function regole(){
  const out={vietate:[],promesse:[],concorrenti:[],prezzi:[]}; let sez=null;
  fs.readFileSync(path.join(__dirname,"frasi-vietate.txt"),"utf8").split(/\r?\n/).forEach(r=>{
    r=r.trim(); if(!r||r.startsWith("#")) return;
    const m=r.match(/^\[(\w+)\]$/); if(m){ sez=m[1]; return; }
    if(sez&&out[sez]) out[sez].push(new RegExp(r,"i"));
  });
  return out;
}

// tutto il testo che finisce sull'immagine o nel video (e nel testo dell'annuncio)
function testoDi(spec){
  const pezzi=[];
  (function giro(v,k){
    if(v==null) return;
    if(Array.isArray(v)) v.forEach(x=>giro(x,k));
    else if(typeof v==="object") Object.keys(v).forEach(x=>giro(v[x],x));
    else if(k==="disponibilita") pezzi.push(String(v).split(/\s*,\s*/).map(x=>DISP[x]!=null?DISP[x]:x).join(" · "));
    else if(!["tipo","formato","misura","sfondo","celeo","scena","nicchia","nome_file","anello"].includes(k)) pezzi.push(String(v));
  })(spec,null);
  return pezzi.join("\n");
}

function controlla(spec){
  const R=regole(), t=testoDi(spec), err=[], avv=[], video=spec.tipo==="reel"||spec.tipo==="pubblicita";
  const trova=(lista,etichetta)=>lista.forEach(re=>{ const m=t.match(re); if(m) err.push(etichetta+": «"+m[0]+"»"); });
  trova(R.vietate,"frase vietata"); trova(R.promesse,"promessa di risultato"); trova(R.concorrenti,"nome di un concorrente");
  if(spec.tipo==="pubblicita") trova(R.prezzi,"prezzo in una pubblicità");

  // disponibilità sempre accanto alla funzione
  if(spec.disponibilita==null||spec.disponibilita==="") err.push("manca la riga «disponibilita:» (per esempio telefono, whatsapp, social, promemoria; «nessuna» solo se non si parla di funzioni)");
  const serve=(re,frase,cosa)=>{ if(re.test(t)&&!t.includes(frase)) err.push("si parla di "+cosa+" ma manca la scritta «"+frase+"»"); };
  serve(/whatsapp/i,"da gennaio 2027","WhatsApp");
  serve(/instagram|messenger|riconosc\w+ (di )?chi richiama|\bcsv\b|google sheets/i,"in arrivo nel 2027","Instagram, Messenger, riconoscimento, CSV o Google Sheets");
  serve(/promemoria con (la )?telefonata/i,"in arrivo","promemoria con telefonata");
  if(/telefon|agenda|chiamat/i.test(t)&&spec.disponibilita&&spec.disponibilita!=="nessuna"&&!/gennaio 2027|in arrivo|chiamata di 30 minuti/.test(t)) err.push("manca la data di disponibilità (gennaio 2027 o «in arrivo»)");

  // quando parla l'assistente si deve leggere «assistente AI» (nei video la scritta c'è sempre, in alto)
  if(!video&&/\b(Sofia|Marco|Elena|Leandro|Cesare)\b/.test(t)&&!/assistent[ei] (AI|di intelligenza artificiale)/i.test(t)) err.push("compare il nome di un assistente ma non la scritta «assistente AI»");
  if(spec.formato==="numero"&&!spec.fonte) err.push("il formato «numero» vuole la riga «fonte:»");
  if(spec.nicchia==="veterinari"&&/(consigli[ao]?|suggerisc\w+) (il|la|un|una|i|le)? ?(farmac|dos|cur)/i.test(t)) err.push("cliniche veterinarie: nessun consiglio su farmaci, dosi o cure");

  // misure e lunghezze
  if(video){
    const fr=[].concat(spec.frasi||[],...(spec.ganci||[]).map(g=>g.frasi||[]));
    fr.forEach(f=>{ if(f.length>84) avv.push("sottotitolo lungo ("+f.length+" caratteri, meglio sotto 80): «"+f.slice(0,40)+"…»"); });
    if(spec.tipo==="reel"&&!(spec.frasi||[]).length) err.push("il reel non ha frasi (riga «frasi:» con l'elenco)");
  }
  if(spec.titolo&&spec.titolo.length>90) avv.push("titolo lungo ("+spec.titolo.length+" caratteri)");
  if(spec.tipo==="pubblicita"){
    if(!spec.annuncio_titolo||!spec.annuncio_testo||!spec.annuncio_pulsante) err.push("mancano annuncio_titolo, annuncio_testo o annuncio_pulsante");
    if((spec.annuncio_titolo||"").length>40) avv.push("titolo dell'annuncio oltre 40 caratteri: Meta lo taglia");
    if((spec.ganci||[]).length!==3) avv.push("servono 3 ganci, ne ho trovati "+(spec.ganci||[]).length);
  }
  return {errori:err,avvisi:avv};
}

// varietà: mai due contenuti uguali di fila (formato), e sfondo e posizione di Celeo che cambiano
function varieta(specs){
  const err=[], avv=[];
  for(let i=1;i<specs.length;i++){
    const a=specs[i-1], b=specs[i];
    if(a.formato&&a.formato===b.formato) err.push(b.nome_file+": stesso formato del contenuto prima («"+b.formato+"»)");
    if((a.sfondo||"sabbia")===(b.sfondo||"sabbia")) avv.push(b.nome_file+": stesso sfondo del contenuto prima («"+(b.sfondo||"sabbia")+"»)");
    if(a.celeo&&a.celeo===b.celeo&&a.tipo===b.tipo) avv.push(b.nome_file+": Celeo nella stessa posizione del contenuto prima");
  }
  return {errori:err,avvisi:avv};
}

module.exports={controlla,varieta,testoDi};
