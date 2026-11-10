/* Motore dei modelli Celea (stile Stageshow, come il sito): ogni scena racconta una cosa sola, pochi passaggi,
   e un risultato che resta sullo schermo. Tutto è calcolato a partire dal tempo: CELEA.seek(ms) disegna
   il fotogramma esatto, così lo script di esportazione fotografa i video un fotogramma alla volta. */
(function(){
  "use strict";
  var C=window.CELEA={}, anim=[], hooks=[];
  function clamp(x){ return x<0?0:x>1?1:x; }
  C.clamp=clamp;
  C.e={ out:function(t){ return 1-Math.pow(1-t,3); },
        io:function(t){ return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; },
        back:function(t){ var c=1.70158; return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2); } };

  C.esc=function(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); };
  // *parola* diventa colorata, « / » va a capo
  C.fmt=function(s){ return C.esc(s).replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/\s\/\s/g,"<br>"); };
  C.h=function(tag,cls,html,parent){ var el=document.createElement(tag); if(cls) el.className=cls; if(html!=null) el.innerHTML=html; if(parent) parent.appendChild(el); return el; };

  C.ICONE={
    logo:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#0F4C5C"/><g transform="translate(14 12) scale(0.8)"><path d="M85.71 90.64A40 40 0 1 1 85.71 29.36" fill="none" stroke="#F4EDE3" stroke-width="12" stroke-linecap="round"/><path d="M72.86 75.32A20 20 0 1 1 72.86 44.68" fill="none" stroke="#E08A6A" stroke-width="10" stroke-linecap="round"/><circle cx="96" cy="60" r="6" fill="#E08A6A"/></g></svg>',
    marchio:'<svg viewBox="8 8 104 104"><path d="M85.71 90.64A40 40 0 1 1 85.71 29.36" fill="none" stroke="var(--logo-a,#0F4C5C)" stroke-width="12" stroke-linecap="round"/><path d="M72.86 75.32A20 20 0 1 1 72.86 44.68" fill="none" stroke="var(--logo-b,#C8664A)" stroke-width="10" stroke-linecap="round"/><circle cx="96" cy="60" r="6" fill="var(--logo-b,#C8664A)"/></svg>',
    tel:'<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    cal:'<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    persona:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chat:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    ok:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    allarme:'<svg viewBox="0 0 24 24"><path d="M12 3.5l9.5 16.5h-19z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.2v.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    freccia:'<svg viewBox="0 0 24 24" width="34" height="34"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  C.logo=function(parent){ return C.h("div","logo",C.ICONE.marchio+"<span>celea</span>",parent); };

  /* Disponibilità: le scritte sono quelle del listino v2.2 e vanno sempre accanto alla funzione. */
  C.DISP=window.CELEA_DISP||{};
  C.disp=function(v){ if(!v) return ""; return String(v).split(/\s*,\s*/).map(function(k){ return C.DISP[k]||k; }).join(" · "); };

  /* ---------- animazioni: ingresso (e uscita) calcolati dal tempo ---------- */
  C.entra=function(el,t0,o){ o=o||{}; anim.push({el:el,t0:t0,fx:o.fx||"su",dur:o.dur||520,out:o.out,base:o.base||""}); return el; };
  C.hook=function(fn){ hooks.push(fn); };
  C.seek=function(t){
    for(var i=0;i<anim.length;i++){
      var a=anim[i], p=clamp((t-a.t0)/a.dur), q=a.out!=null?clamp((t-a.out)/300):0;
      var e=a.fx==="pop"?C.e.back(p):C.e.out(p), op=clamp(p*2.4)*(1-q), tr="";
      if(a.fx==="su") tr="translateY("+((1-e)*46-q*30).toFixed(2)+"px)";
      else if(a.fx==="giu") tr="translateY("+(-(1-e)*46).toFixed(2)+"px)";
      else if(a.fx==="sx") tr="translateX("+(-(1-e)*90).toFixed(2)+"px)";
      else if(a.fx==="dx") tr="translateX("+((1-e)*90).toFixed(2)+"px)";
      else if(a.fx==="pop") tr="scale("+(p<=0?.6:.6+.4*e).toFixed(4)+")";
      else if(a.fx==="sali") tr="translateY("+((1-e)*260).toFixed(2)+"px)";
      a.el.style.opacity=op.toFixed(3);
      a.el.style.visibility=op<=.001?"hidden":"visible";
      if(a.fx!=="fade") a.el.style.transform=(tr+" "+a.base).trim();
    }
    for(var j=0;j<hooks.length;j++) hooks[j](t);
  };

  /* ---------- Celeo ---------- */
  var FIG="../assets/celeo-figura.webp", BUSTO="../assets/celeo-busto.webp";
  // figura intera ritagliata. lato: "destra" | "sinistra"; alt = altezza in px; giu = quanti px escono sotto il bordo
  C.celeo=function(parent,lato,alt,giu,dx){
    var img=C.h("img","celeo"+(lato==="sinistra"?" gira":""),null,parent);
    img.src=FIG; img.style.height=alt+"px"; img.style.bottom=(-giu)+"px"; img.style[lato==="sinistra"?"left":"right"]=(dx==null?30:dx)+"px";
    return img;
  };
  C.arco=function(parent,w,foto){
    var a=C.h("div","arco"+(foto?" foto":""),null,parent); a.style.width=w+"px"; a.style.height=Math.round(w*1.4)+"px";
    var img=C.h("img",null,null,a); img.src=foto?BUSTO:FIG; return a;
  };

  /* ---------- pagine ferme: post, storie, slide di carosello ---------- */
  var FORMATI={};
  C.FORMATI=FORMATI;
  function cornice(s,W,H){
    var tela=document.getElementById("tela"); tela.innerHTML=""; tela.style.width=W+"px"; tela.style.height=H+"px";
    tela.className="bg-"+(s.sfondo||"sabbia")+" f-"+s.formato+(H>=1900?" storia":H<=1080?" quadrato":"")+(s.classe?" "+s.classe:"");
    var an=C.h("div","anello",null,tela), v=s.anello||"alto-dx", d=Math.round(W*.95);
    an.style.width=an.style.height=d+"px";
    if(v==="alto-dx"){ an.style.right=-d*.42+"px"; an.style.top=-d*.3+"px"; }
    else if(v==="basso-sx"){ an.style.left=-d*.45+"px"; an.style.bottom=-d*.35+"px"; }
    else if(v==="basso-dx"){ an.style.right=-d*.4+"px"; an.style.bottom=-d*.4+"px"; }
    else if(v==="alto-sx"){ an.style.left=-d*.45+"px"; an.style.top=-d*.38+"px"; }
    else an.style.display="none";
    var pag=C.h("div","pagina",null,tela), testa=C.h("div","testa",null,pag);
    C.logo(testa);
    if(s.pagina) C.h("div","num-pag",C.esc(s.pagina),testa);
    var corpo=C.h("div","corpo",null,pag), piede=C.h("div","piede",null,pag), sx=C.h("div","sx",null,piede);
    if(s.nota) C.h("div","nota",C.fmt(s.nota),sx);
    var d2=C.disp(s.disponibilita); if(d2) C.h("div","chip","<i></i>"+C.esc(d2),sx);
    if(s.sito!=="no") C.h("div","sito","www.celea.it",sx);
    if(s.celeo&&s.celeo!=="no"&&s.formato!=="prima-dopo") sx.style.maxWidth="56%";
    if(s.celeo==="sinistra"){ piede.style.flexDirection="row-reverse"; sx.style.alignItems="flex-end"; sx.style.textAlign="right"; }
    return {tela:tela,pag:pag,corpo:corpo,piede:piede,W:W,H:H};
  }
  function base(k,s){
    if(s.occhiello) C.h("div","occhiello",C.fmt(s.occhiello),k.corpo);
    if(s.titolo) C.h("h1","titolo",C.fmt(s.titolo),k.corpo);
  }
  function stretto(el,k,s,quota){ // lascia libero il lato dove sta Celeo
    if(!s.celeo||s.celeo==="no") return;
    el.style.maxWidth=Math.round(k.W*(quota||.6))+"px";
    if(s.celeo==="sinistra") el.style.alignSelf="flex-end";
  }
  function figura(k,s,quota,giu){
    if(!s.celeo||s.celeo==="no") return;
    var alt=Math.round(k.H*(quota||.42)); C.celeo(k.tela,s.celeo,alt,giu==null?Math.round(alt*.12):giu,26);
  }

  FORMATI["domanda"]=function(s,W,H){
    var k=cornice(s,W,H); base(k,s);
    if(s.testo) stretto(C.h("p","testo",C.fmt(s.testo),k.corpo),k,s,.58);
    if(s.invito) stretto(C.h("div","invito",C.fmt(s.invito),k.corpo),k,s,.58);
    figura(k,s,H>=1900?.44:.42);
  };

  FORMATI["scenetta"]=function(s,W,H){
    var k=cornice(s,W,H);
    var ora=C.h("div","ora","<small>"+C.esc(s.giorno||"")+"</small>"+C.esc(s.ora||""),k.corpo);
    if(s.titolo) C.h("h1","titolo",C.fmt(s.titolo),k.corpo);
    (s.righe||[]).forEach(function(r){
      var p=r.split("|").map(function(x){ return x.trim(); }), ai=/^AI\s+/.test(p[0]); if(ai) p[0]=p[0].replace(/^AI\s+/,"");
      C.h("div","carta riga-scena"+(ai?" ai":""),"<time>"+C.esc(p[0])+"</time><p>"+(ai?'<span class="tag-ai">assistente AI</span><br>':"")+C.fmt(p[1]||"")+(p[2]?"<small>"+C.fmt(p[2])+"</small>":"")+"</p>",k.corpo);
    });
    if(s.celeo&&s.celeo!=="no"){ var c=C.celeo(k.tela,s.celeo,Math.round(H*.3),0,40); c.style.bottom="auto"; c.style.top=(H>=1900?250:96)+"px"; }
    void ora;
  };

  FORMATI["celeo-spiega"]=function(s,W,H){
    var k=cornice(s,W,H), riga=C.h("div",null,null,k.corpo), sin=s.celeo==="sinistra";
    riga.style.cssText="display:flex;gap:40px;align-items:flex-end;flex-direction:"+(sin?"row":"row-reverse");
    var a=C.arco(riga,H>=1300?300:250); a.style.position="relative"; a.style.flex="none";
    var col=C.h("div",null,null,riga); col.style.cssText="display:flex;flex-direction:column;gap:22px;flex:1";
    if(s.occhiello) C.h("div","occhiello",C.fmt(s.occhiello),col);
    if(s.fumetto){ var f=C.h("div","fumetto"+(sin?"":" dx"),C.fmt(s.fumetto),col); f.style.position="relative"; }
    if(s.titolo) C.h("h1","titolo",C.fmt(s.titolo),k.corpo);
    var ul=C.h("ul","punti",null,k.corpo);
    (s.punti||[]).forEach(function(p){ C.h("li",null,C.ICONE.ok+"<span>"+C.fmt(p)+"</span>",ul); });
  };

  FORMATI["prima-dopo"]=function(s,W,H){
    var k=cornice(s,W,H); base(k,s);
    var due=C.h("div","due",null,k.corpo);
    var a=C.h("div","carta col prima","<h3>"+C.fmt(s.prima_titolo||"Prima")+"</h3>",due);
    (s.prima||[]).forEach(function(v){ C.h("div","vocale","<b></b><span></span>"+C.esc(v),a); });
    if(s.prima_nota) C.h("p","nota",C.fmt(s.prima_nota),a).style.color="#56656A";
    var b=C.h("div","carta col dopo","<h3>"+C.fmt(s.dopo_titolo||"Con l'Agenda")+"</h3>",due);
    (s.dopo||[]).forEach(function(r){
      var p=r.split("|").map(function(x){ return x.trim(); });
      C.h("div","ag-riga","<time>"+C.esc(p[0])+"</time>"+(p[1]?'<div class="ag-ev">'+C.fmt(p[1])+(p[2]?"<small>"+C.fmt(p[2])+"</small>":"")+"</div>":'<i class="ag-vuoto"></i>'),b);
    });
    if(s.dopo_nota) C.h("p","nota",C.fmt(s.dopo_nota),b).style.color="#56656A";
    if(s.testo) C.h("p","testo",C.fmt(s.testo),k.corpo);
    if(s.celeo&&s.celeo!=="no") C.celeo(k.tela,s.celeo,Math.round(H*.24),Math.round(H*.03),20);
  };

  FORMATI["dietro-le-quinte"]=function(s,W,H){
    var k=cornice(s,W,H), sin=s.celeo==="sinistra", riga=C.h("div",null,null,k.corpo);
    riga.style.cssText="display:flex;gap:44px;align-items:flex-start;flex-direction:"+(sin?"row-reverse":"row");
    var col=C.h("div",null,null,riga); col.style.cssText="display:flex;flex-direction:column;gap:26px;flex:1";
    if(s.occhiello) C.h("div","occhiello",C.fmt(s.occhiello),col);
    if(s.titolo) C.h("h1","titolo",C.fmt(s.titolo),col);
    var a=C.arco(riga,H>=1300?330:290,true); a.style.position="relative"; a.style.flex="none";
    if(s.testo) C.h("p","testo",C.fmt(s.testo),k.corpo);
    if(s.firma) C.h("div","firma",C.fmt(s.firma),k.corpo);
  };

  FORMATI["numero"]=function(s,W,H){
    var k=cornice(s,W,H);
    if(s.occhiello) C.h("div","occhiello",C.fmt(s.occhiello),k.corpo);
    C.h("div","grande",C.fmt(s.numero_grande||""),k.corpo);
    if(s.titolo) stretto(C.h("h1","titolo",C.fmt(s.titolo),k.corpo),k,s,.66);
    if(s.testo) stretto(C.h("p","testo",C.fmt(s.testo),k.corpo),k,s,.62);
    stretto(C.h("div","fonte","Fonte: "+C.fmt(s.fonte||""),k.corpo),k,s,.62);
    figura(k,s,.36);
  };

  FORMATI["lo-sapevi"]=function(s,W,H){
    var k=cornice(s,W,H);
    C.h("div","badge",C.fmt(s.occhiello||"Lo sapevi che…"),k.corpo);
    if(s.titolo) C.h("h1","titolo",C.fmt(s.titolo),k.corpo);
    if(s.testo) stretto(C.h("p","testo",C.fmt(s.testo),k.corpo),k,s,.6);
    figura(k,s,H>=1900?.44:.4);
  };

  // carosello «mini guida»: la slide da disegnare è s.slide[s.indice]
  FORMATI["guida"]=function(s,W,H){
    var tot=s.slide.length, i=s.indice||0, sl=s.slide[i], ruolo=i===0?"copertina":(i===tot-1?"chiusura":"passo");
    var m={}; for(var x in s) m[x]=s[x]; for(var y in sl) m[y]=sl[y];
    m.classe=ruolo; m.pagina=(i+1)+" / "+tot;
    if(!sl.sfondo) m.sfondo=ruolo==="copertina"?(s.sfondo||"mare"):ruolo==="chiusura"?"notte":(i%2?"sabbia":"crema");
    m.anello=["alto-dx","basso-sx","alto-sx","basso-dx"][i%4];
    if(ruolo==="copertina"){
      m.celeo=m.celeo||"destra"; m.disponibilita=""; var k=cornice(m,W,H); base(k,m);
      if(m.testo) stretto(C.h("p","testo",C.fmt(m.testo),k.corpo),k,m,.56);
      stretto(C.h("div","scorri","Scorra "+C.ICONE.freccia,k.corpo),k,m,.56); figura(k,m,.46);
    } else if(ruolo==="chiusura"){
      m.celeo="destra"; m.sito="no"; m.disponibilita=""; var k2=cornice(m,W,H);
      if(m.occhiello) C.h("div","occhiello",C.fmt(m.occhiello),k2.corpo);
      C.h("h1","titolo",C.fmt(m.titolo||"Prova la demo gratis su *celea.it*"),k2.corpo);
      if(m.testo) stretto(C.h("p","testo",C.fmt(m.testo),k2.corpo),k2,m,.58);
      var b=C.h("div","pulsante","www.celea.it",k2.corpo); stretto(b,k2,m,.58);
      figura(k2,m,.44);
    } else {
      m.celeo="no"; var k3=cornice(m,W,H);
      C.h("div","passo-n",String(i),k3.corpo);
      if(m.titolo) C.h("h1","titolo",C.fmt(m.titolo),k3.corpo);
      if(m.testo) C.h("p","testo",C.fmt(m.testo),k3.corpo);
    }
  };

  /* ---------- avvio ---------- */
  C.avvia=function(spec){
    var mm=String(spec.misura||"1080x1350").split("x"), W=+mm[0], H=+mm[1];
    C.durata=0;
    if(spec.tipo==="reel"||spec.tipo==="pubblicita") C.video(spec,W,H);
    else (FORMATI[spec.formato]||FORMATI["domanda"])(spec,W,H);
    C.seek(spec.tempo!=null?spec.tempo:(C.durata?0:1e9));
    return {durata:C.durata,larghezza:W,altezza:H,tempi:C.tempi||null};
  };
  window.addEventListener("DOMContentLoaded",function(){
    var spec=window.__SPEC;
    if(!spec&&location.hash.length>1){ try{ spec=JSON.parse(decodeURIComponent(location.hash.slice(1))); }catch(e){} }
    if(!spec) return;
    var esito=C.avvia(spec);
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){
      var imgs=[].slice.call(document.images);
      return Promise.all(imgs.map(function(im){ return im.complete?null:new Promise(function(r){ im.onload=im.onerror=r; }); }));
    }).then(function(){
      window.__PRONTO=esito;
      // anteprima nel browser (senza script): se è un video e non lo guida lo script, lo fa scorrere
      if(esito.durata&&!window.__SPEC){ var t0=performance.now(); (function giro(){ C.seek((performance.now()-t0)%esito.durata); requestAnimationFrame(giro); })(); }
    });
  });
})();
