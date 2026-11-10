#!/usr/bin/env node
/* Esportazione automatica del kit Celea: da un file di testo (titolo e frasi) a PNG, JPG e MP4.

   Uso (dalla cartella principale di celea-media):
     node brand-kit/script/esporta.js brand-kit/testi/settimana-2026-11-16            tutta la settimana
     node brand-kit/script/esporta.js brand-kit/testi/settimana-2026-11-16/post-2026-11-16-1.txt
     node brand-kit/script/esporta.js brand-kit/testi/pubblicita                      le pubblicità
   Opzioni:
     --uscita CARTELLA   dove mettere i file (se manca: brand-kit/esempi, oppure brand-kit/pubblicita)
     --pubblica          copia i file finiti in post/ con i nomi che usa Metricool (non sovrascrive mai)
     --solo-controllo    controlla i testi e si ferma, senza disegnare niente
     --lavori N          quanti video preparare insieme (se manca: 3)

   Servono Node, Playwright (con Chromium) e ffmpeg. Nessun servizio a pagamento, niente viene pubblicato. */
"use strict";
const fs=require("fs"), path=require("path"), {spawn}=require("child_process");
const {controlla,varieta}=require("./controlla.js");
const KIT=path.resolve(__dirname,".."), REPO=path.resolve(KIT,".."), MODELLO="file://"+path.join(KIT,"modelli","modello.html");
const FPS=30, MISURE_AD=["1080x1350","1080x1920","1080x1080"];

/* ---------- lettura del file di testo ---------- */
function leggiBlocco(righe){
  const o={}; let chiave=null;
  for(let r of righe){
    if(/^\s*#/.test(r)||!r.trim()) continue;
    const el=r.match(/^\s*-\s+(.*)$/);
    if(el&&chiave){ if(!Array.isArray(o[chiave])) o[chiave]=o[chiave]?[o[chiave]]:[]; o[chiave].push(el[1].trim()); continue; }
    const kv=r.match(/^([A-Za-zÀ-ú_ ]{2,30}):\s*(.*)$/);
    if(kv){ chiave=kv[1].trim().toLowerCase().replace(/à/g,"a").replace(/\s+/g,"_"); o[chiave]=kv[2].trim(); continue; }
    if(chiave&&typeof o[chiave]==="string") o[chiave]=(o[chiave]+" "+r.trim()).trim(); // riga che continua
  }
  return o;
}
function leggi(file){
  const blocchi=[[]]; fs.readFileSync(file,"utf8").split(/\r?\n/).forEach(r=>{ if(/^\s*-{3,}\s*$/.test(r)) blocchi.push([]); else blocchi[blocchi.length-1].push(r); });
  const spec=leggiBlocco(blocchi[0]), altri=blocchi.slice(1).map(leggiBlocco).filter(b=>Object.keys(b).length);
  spec.nome_file=path.basename(file).replace(/\.txt$/,"");
  spec.tipo=spec.tipo||"post";
  if(spec.tipo==="carosello"){ spec.formato=spec.formato||"guida"; spec.slide=altri; }
  if(spec.tipo==="pubblicita") spec.ganci=altri;
  if(!spec.misura) spec.misura={post:"1080x1350",carosello:"1080x1350",storia:"1080x1920",reel:"1080x1920"}[spec.tipo]||"1080x1350";
  if(spec.tipo==="reel"&&!spec.formato) spec.formato="reel";
  return spec;
}

/* ---------- disegno ---------- */
let browser=null;
async function pagina(spec){
  const [W,H]=spec.misura.split("x").map(Number);
  const p=await browser.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
  await p.addInitScript(s=>{ window.__SPEC=s; },spec);
  p.on("pageerror",e=>{ console.error("  errore nel modello:",e.message); process.exitCode=1; });
  await p.goto(MODELLO); await p.waitForFunction("window.__PRONTO");
  return {p,info:await p.evaluate("window.__PRONTO"),W,H};
}
async function immagine(spec,base){
  const {p,W,H}=await pagina(spec);
  await p.screenshot({path:base+".png",clip:{x:0,y:0,width:W,height:H}});
  await p.screenshot({path:base+".jpg",type:"jpeg",quality:93,clip:{x:0,y:0,width:W,height:H}}); // TikTok non accetta PNG
  await p.close(); return [base+".png",base+".jpg"];
}
async function video(spec,base){
  const {p,info,W,H}=await pagina(spec), n=Math.round(info.durata/1000*FPS);
  const ff=spawn("ffmpeg",["-y","-loglevel","error","-f","image2pipe","-framerate",String(FPS),"-c:v","mjpeg","-i","-",
    "-f","lavfi","-i","anullsrc=r=44100:cl=stereo","-shortest",
    "-vf","scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p","-c:v","libx264","-preset","medium","-crf","21","-r",String(FPS),
    "-colorspace","bt709","-color_primaries","bt709","-color_trc","bt709","-c:a","aac","-b:a","64k","-movflags","+faststart",base+".mp4"],{stdio:["pipe","inherit","inherit"]});
  const finito=new Promise((ok,no)=>ff.on("close",c=>c===0?ok():no(new Error("ffmpeg si è fermato con errore "+c))));
  const clip={x:0,y:0,width:W,height:H}; let anteprima=Math.round(n*.55);
  for(let i=0;i<n;i++){
    await p.evaluate(t=>window.CELEA.seek(t),i*1000/FPS);
    const buf=await p.screenshot({type:"jpeg",quality:95,clip});
    if(i===anteprima) fs.writeFileSync(base+"-fotogramma.jpg",buf);
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once("drain",r));
  }
  ff.stdin.end(); await finito;
  // copertina: il primo fotogramma «pieno» dell'apertura (per Metricool: copertina a 1,5 secondi)
  await p.evaluate(t=>window.CELEA.seek(t),1500);
  await p.screenshot({path:base+"-copertina.jpg",type:"jpeg",quality:93,clip});
  await p.close();
  return [base+".mp4",base+"-copertina.jpg",base+"-fotogramma.jpg"];
}

/* ---------- lavori ---------- */
function lavoriDi(spec,uscita){
  const L=[];
  if(spec.tipo==="carosello") spec.slide.forEach((_,i)=>L.push({tipo:"img",spec:{...spec,indice:i},base:path.join(uscita,spec.nome_file+"-"+(i+1))}));
  else if(spec.tipo==="reel") L.push({tipo:"video",spec,base:path.join(uscita,spec.nome_file)});
  else if(spec.tipo==="pubblicita"){
    const dir=path.join(uscita,spec.nicchia); fs.mkdirSync(dir,{recursive:true});
    spec.ganci.forEach(g=>MISURE_AD.forEach(m=>{
      const s={...spec,...g,misura:m,tipo:"pubblicita"}; delete s.ganci;
      L.push({tipo:"video",spec:s,base:path.join(dir,spec.nicchia+"-"+(g.versione||"gancio")+"-"+m)});
    }));
    fs.writeFileSync(path.join(dir,spec.nicchia+"-annuncio.md"),annuncio(spec));
  } else L.push({tipo:"img",spec,base:path.join(uscita,spec.nome_file)});
  return L;
}
function annuncio(spec){
  const c=controlla(spec);
  return ["# Pubblicità Meta · "+spec.nicchia,"","Solo file: nessuna campagna creata, nessuna spesa. Nessun prezzo nel video e nel testo.","",
    "## Testo dell'annuncio","","- **Titolo:** "+spec.annuncio_titolo,"- **Testo:** "+spec.annuncio_testo,"- **Pulsante:** "+spec.annuncio_pulsante,
    "- **Indirizzo:** https://www.celea.it","- **Disponibilità (già scritta nel video):** "+require("../modelli/disponibilita.js").CELEA_DISP[spec.disponibilita]||spec.disponibilita,"",
    "## I tre ganci (primi 2 secondi)","",...spec.ganci.map((g,i)=>(i+1)+". **"+g.versione+"** · «"+String(g.gancio).replace(/\*/g,"").replace(/ \/ /g," ")+"» · scena: "+(g.scena||spec.scena)),"",
    "## File","",...spec.ganci.flatMap(g=>MISURE_AD.map(m=>"- `"+spec.nicchia+"-"+g.versione+"-"+m+".mp4`")),"",
    "## Controllo delle frasi vietate","",c.errori.length?"**DA CORREGGERE:** "+c.errori.join("; "):"Superato: niente «24 ore su 24» o «24/7», nessuna promessa di risultato, nessun concorrente, nessun prezzo; scritta «assistente AI» sempre visibile; disponibilità scritta.",
    ...(c.avvisi.length?["","Avvisi: "+c.avvisi.join("; ")]:[]),"","Musica: nessuna traccia nel file (audio muto). Se serve, solo brani senza diritti dalla libreria di Meta.",""].join("\n");
}

(async()=>{
  const arg=process.argv.slice(2), opz={}; const bersagli=[];
  for(let i=0;i<arg.length;i++){ if(arg[i]==="--uscita") opz.uscita=arg[++i]; else if(arg[i]==="--lavori") opz.lavori=+arg[++i]; else if(arg[i].startsWith("--")) opz[arg[i].slice(2)]=true; else bersagli.push(arg[i]); }
  if(!bersagli.length){ console.log(fs.readFileSync(__filename,"utf8").split("*/")[0].replace(/^#!.*\n\/\*\s?/,"")); process.exit(1); }
  let tuttiOk=true; const coda=[], fatti=[];
  for(const b of bersagli){
    const file=fs.statSync(b).isDirectory()?fs.readdirSync(b).filter(f=>f.endsWith(".txt")).sort().map(f=>path.join(b,f)):[b];
    const specs=file.map(leggi);
    const ads=specs.length&&specs.every(s=>s.tipo==="pubblicita");
    const uscita=path.resolve(opz.uscita||path.join(KIT,ads?"pubblicita":"esempi")); fs.mkdirSync(uscita,{recursive:true});
    specs.forEach(s=>{
      const c=controlla(s); console.log((c.errori.length?"✗ ":"✓ ")+s.nome_file+"  ["+s.tipo+(s.formato&&s.formato!==s.tipo?" · "+s.formato:"")+"]");
      c.errori.forEach(e=>console.log("    ERRORE: "+e)); c.avvisi.forEach(e=>console.log("    avviso: "+e));
      if(c.errori.length) tuttiOk=false;
    });
    if(specs.length>1&&!ads){ const v=varieta(specs); v.errori.forEach(e=>{ console.log("    ERRORE varietà: "+e); tuttiOk=false; }); v.avvisi.forEach(e=>console.log("    avviso varietà: "+e)); }
    specs.forEach(s=>coda.push(...lavoriDi(s,uscita)));
  }
  if(!tuttiOk){ console.log("\nTesti da correggere: non ho esportato niente."); process.exit(2); }
  if(opz["solo-controllo"]){ console.log("\nControllo superato."); return; }
  browser=await require("playwright").chromium.launch();
  const n=Math.max(1,opz.lavori||3); let i=0;
  await Promise.all(Array.from({length:n},async()=>{ while(i<coda.length){ const l=coda[i++]; const t0=Date.now(); const f=await (l.tipo==="video"?video:immagine)(l.spec,l.base); fatti.push(...f); console.log("  fatto "+path.relative(REPO,f[0])+"  ("+((Date.now()-t0)/1000).toFixed(0)+" s)"); } }));
  if(browser) await browser.close();
  if(opz.pubblica){
    const post=path.join(REPO,"post");
    fatti.filter(f=>/\.(png|jpg|mp4)$/.test(f)&&!/-fotogramma\.jpg$/.test(f)&&!f.includes(path.join(KIT,"pubblicita"))).forEach(f=>{
      const d=path.join(post,path.basename(f));
      if(fs.existsSync(d)) console.log("  NON copiato (esiste già, non si sovrascrive): post/"+path.basename(f));
      else { fs.copyFileSync(f,d); console.log("  copiato in post/"+path.basename(f)); }
    });
  }
  console.log("\nFinito: "+fatti.length+" file.");
})().catch(e=>{ console.error(e); process.exit(1); });
