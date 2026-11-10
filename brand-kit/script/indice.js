#!/usr/bin/env node
/* Prepara brand-kit/esempi/indice.html (anteprime da guardare dal telefono) e
   brand-kit/hq/elenco-file.md (elenco con i link diretti «raw» di GitHub).
   Uso: node brand-kit/script/indice.js      (dopo esporta.js) */
"use strict";
const fs=require("fs"), path=require("path"), {execFileSync}=require("child_process");
const KIT=path.resolve(__dirname,".."), REPO=path.resolve(KIT,"..");
const RAW="https://raw.githubusercontent.com/Lillo59/celea-media/main/";
const SETTORE={dentisti:"Studi dentistici · Sofia",immobiliare:"Agenzie immobiliari · Marco",ricettive:"Strutture ricettive · Elena",veterinari:"Cliniche veterinarie · Leandro",uffici:"Celea Uffici"};
const pulisci=s=>String(s||"").replace(/\*/g,"").replace(/ \/ /g," ");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const durata=f=>Math.round(+execFileSync("ffprobe",["-v","error","-show_entries","format=duration","-of","csv=p=0",f]).toString());
const campo=(t,k)=>(t.match(new RegExp("^"+k+":\\s*(.*)$","m"))||[])[1]||"";

const voci=[]; // {gruppo,titolo,settore,tipo,durata,file:[percorsi dal repo],poster}
// 1 · contenuti della settimana (cartelle di testi «settimana-…»)
fs.readdirSync(path.join(KIT,"testi")).filter(d=>d.startsWith("settimana-")).sort().forEach(sett=>{
  fs.readdirSync(path.join(KIT,"testi",sett)).filter(f=>f.endsWith(".txt")).sort().forEach(f=>{
    const t=fs.readFileSync(path.join(KIT,"testi",sett,f),"utf8"), n=f.replace(".txt",""), tipo=campo(t,"tipo"), nic=campo(t,"nicchia");
    const settore=campo(t,"scena")==="ufficio"?SETTORE.uffici:(SETTORE[nic]||(/studio|paziente/i.test(t)?SETTORE.dentisti:"Tutti i settori"));
    const v={gruppo:"Settimana "+sett.replace("settimana-",""),nome:n,titolo:pulisci(campo(t,"gancio")||campo(t,"titolo")||(t.match(/^---[\s\S]*?^titolo:\s*(.*)$/m)||[])[1]),settore,formato:campo(t,"formato")};
    if(tipo==="reel"){ v.tipo="Reel 1080x1920"; v.file=["post/"+n+".mp4"]; v.poster="post/"+n+"-copertina.jpg"; v.durata=durata(path.join(REPO,v.file[0])); }
    else if(tipo==="carosello"){ const k=fs.readdirSync(path.join(REPO,"post")).filter(x=>x.startsWith(n+"-")&&x.endsWith(".png")).sort(); v.tipo="Carosello, "+k.length+" slide 1080x1350"; v.file=k.map(x=>"post/"+x); }
    else { v.tipo=(tipo==="storia"?"Storia ":"Post ")+(campo(t,"misura")||"1080x1350"); v.file=["post/"+n+".png"]; }
    voci.push(v);
  });
});
// 2 · pubblicità
fs.readdirSync(path.join(KIT,"testi","pubblicita")).filter(f=>f.endsWith(".txt")).sort().forEach(f=>{
  const t=fs.readFileSync(path.join(KIT,"testi","pubblicita",f),"utf8"), nic=f.replace(".txt","");
  t.split(/^---\s*$/m).slice(1).forEach(b=>{
    const ver=campo(b,"versione");
    ["1080x1920","1080x1350","1080x1080"].forEach(m=>{
      const base="brand-kit/pubblicita/"+nic+"/"+nic+"-"+ver+"-"+m;
      voci.push({gruppo:"Pubblicità · "+SETTORE[nic],nome:nic+"-"+ver+"-"+m,titolo:pulisci(campo(b,"gancio")),settore:SETTORE[nic],formato:"gancio «"+ver.replace(/-/g," ")+"»",tipo:"Pubblicità "+m,file:[base+".mp4"],poster:base+"-copertina.jpg",durata:durata(path.join(REPO,base+".mp4"))});
    });
  });
});

// 3 · versioni con voce e musica: se esiste «…-voce.mp4» accanto al muto, compare subito dopo
for(let i=voci.length-1;i>=0;i--){
  const v=voci[i]; if(!v.file[0].endsWith(".mp4")) continue;
  const muto=v.gruppo.startsWith("Settimana")?"brand-kit/esempi/"+v.nome+".mp4":v.file[0], voce=muto.replace(/\.mp4$/,"-voce.mp4");
  if(fs.existsSync(path.join(REPO,voce))) voci.splice(i+1,0,{...v,nome:v.nome+"-voce",titolo:v.titolo+" · CON VOCE",tipo:v.tipo+" · voce e musica",file:[voce],poster:voce.replace(".mp4","-copertina.jpg"),durata:durata(path.join(REPO,voce))});
}

/* ---------- pagina ---------- */
const rel=p=>path.relative(path.join(KIT,"esempi"),path.join(REPO,p)).split(path.sep).join("/");
let gruppo="", corpo="";
voci.forEach(v=>{
  if(v.gruppo!==gruppo){ if(gruppo) corpo+="</section>\n"; gruppo=v.gruppo; corpo+='<section><h2>'+esc(gruppo)+"</h2>\n"; }
  const video=v.file[0].endsWith(".mp4");
  corpo+='<article><div class="m'+(v.file.length>1?" giro":"")+'">'+(video
    ?'<video controls playsinline preload="none" poster="'+rel(v.poster)+'"><source src="'+rel(v.file[0])+'" type="video/mp4"></video>'
    :v.file.map(f=>'<a href="'+rel(f)+'"><img loading="lazy" src="'+rel(f.replace(".png",".jpg"))+'" alt="'+esc(v.titolo)+'"></a>').join(""))
    +'</div><h3>'+esc(v.titolo)+'</h3><p><b>'+esc(v.settore)+'</b> · '+esc(v.tipo)+(v.durata?" · "+v.durata+" secondi":"")+'</p><p class="f">'+esc(v.formato)+' · <a href="'+RAW+v.file[0]+'">'+esc(v.nome)+"</a></p></article>\n";
});
corpo+="</section>";
const html=`<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Celea · anteprime post e reel</title><meta name="robots" content="noindex">
<style>
:root{--bg:#FBF7EF;--ink:#1F2D33;--muted:#56656A;--sea:#0F4C5C;--terra:#A9502F;--line:#E9DFC9;--card:#fff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif}
header{padding:22px 16px 6px;max-width:1100px;margin:auto}h1{margin:0;font-size:1.5rem;color:var(--sea)}header p{margin:6px 0 0;color:var(--muted)}
section{max-width:1100px;margin:auto;padding:8px 16px 18px;display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
h2{grid-column:1/-1;margin:18px 0 0;font-size:1.15rem;color:var(--terra);border-top:1px solid var(--line);padding-top:16px}
article{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;padding-bottom:10px}
.m{background:#0A3440;display:flex}.m video,.m img{display:block;width:100%;height:auto}.m a{flex:0 0 100%}
.m.giro{overflow-x:auto;scroll-snap-type:x mandatory}.m.giro a{scroll-snap-align:start}
h3{margin:10px 12px 2px;font-size:1rem;color:var(--sea)}article p{margin:2px 12px;font-size:.88rem;color:var(--muted)}
.f a{color:var(--terra);word-break:break-all}
</style></head><body>
<header><h1>Celea · anteprime post e reel</h1><p>${voci.length} contenuti. I video partono al tocco; i caroselli si scorrono di lato. Toccando il nome del file si apre il file originale.</p></header>
${corpo}
</body></html>
`;
fs.writeFileSync(path.join(KIT,"esempi","indice.html"),html);

/* ---------- elenco con i link diretti ---------- */
let md="# Elenco dei file con i link diretti\n\nRepository `celea-media`, ramo principale `main`. Ogni link apre il file così com'è (link «raw» di GitHub).\n", g2="";
voci.forEach(v=>{
  if(v.gruppo!==g2){ g2=v.gruppo; md+="\n## "+g2+"\n\n| Titolo | Settore | Tipo | Durata | File |\n|---|---|---|---|---|\n"; }
  md+="| "+v.titolo+" | "+v.settore+" | "+v.tipo+" · "+v.formato+" | "+(v.durata?v.durata+" s":"–")+" | "+v.file.map(f=>"["+path.basename(f)+"]("+RAW+f+")").join("<br>")+" |\n";
});
fs.writeFileSync(path.join(KIT,"hq","elenco-file.md"),md);
console.log(voci.length+" voci · scritti esempi/indice.html e hq/elenco-file.md");
