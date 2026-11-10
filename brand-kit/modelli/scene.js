/* Scene animate dei reel e delle pubblicità: le stesse storie del sito (telefonata con l'assistente AI,
   chiamata che passa all'assistente quando la linea è occupata, agenda che si riempie, urgenza passata
   al titolare, ufficio con i reparti) più la demo col nome della propria attività.
   Ogni scena è disegnata su un palco di 1000 x 900 e poi adattata alla misura del video. */
(function(){
  "use strict";
  var C=window.CELEA, h=C.h, I=C.ICONE;

  /* Testi d'esempio per nicchia. Attività e persone sono inventate; l'assistente dice sempre di essere un'AI
     e non dà consigli medici né su farmaci, dosi o cure. Si possono cambiare dal file di testo. */
  var N=C.NICCHIE={
    dentisti:{ nome:"Sofia", attivita:"Studio dentistico (esempio)", chi:"lo studio", da:"dallo studio", titolare:"Reperibile dello studio",
      tel:{ momento:"ore 21:07 · studio chiuso", giorno:"giovedì",
        b:["Studio dentistico, sono Sofia, l'assistente AI. Come posso aiutarLa?","Vorrei prenotare una pulizia dei denti.","Ho martedì alle 10:30 o giovedì alle 17:00. Quale preferisce?","Giovedì alle 17, grazie."],
        ev:["Pulizia · Giulia R.","fissato da Sofia, assistente AI"], prima:["Controllo","fissato dallo studio"] },
      occ:{ ora:"12:48", perche:"la segreteria è al telefono con un altro paziente", ai:"Studio dentistico, sono Sofia, l'assistente AI. Mi dica pure.", cl:"Vorrei spostare il controllo di domani.", nota:["Marta L. · sposta il controllo","richiesta pronta, da confermare"], per:"Per la segreteria" },
      ag:["Pulizia · Giulia R.","Prima visita · Luca M.","Controllo · Anna P."],
      urg:{ momento:"sabato · 11:20", cl:"Ho un dolore forte a un dente, è urgente.", ai:"Capisco. Non do consigli medici: La passo subito allo studio.", r1:"Paolo D., dolore forte a un dente da stamattina.", r2:"Chiede di essere visto oggi: è in linea.", linea:"In linea con il paziente" },
      demo:{ esempio:"Studio dentistico Rossi", cl:"Avete posto per una pulizia questa settimana?" } },
    immobiliare:{ nome:"Marco", attivita:"Agenzia immobiliare (esempio)", chi:"l'agenzia", da:"dall'agenzia", titolare:"L'agente",
      tel:{ momento:"ore 20:40 · agenzia chiusa", giorno:"sabato",
        b:["Agenzia immobiliare, sono Marco, l'assistente AI. Come posso aiutarLa?","Il trilocale in via del Porto è ancora disponibile?","Sì. Per una visita ho venerdì alle 18 o sabato alle 10.","Sabato alle 10 va bene."],
        ev:["Visita · via del Porto","fissata da Marco, assistente AI"], prima:["Valutazione","fissata dall'agenzia"] },
      occ:{ ora:"11:15", perche:"l'agente è in visita con un cliente", ai:"Agenzia immobiliare, sono Marco, l'assistente AI. Mi dica pure.", cl:"Chiamo per la casa con il box auto.", nota:["Sara B. · casa con box auto","richiesta pronta per l'agente"], per:"Per l'agente" },
      ag:["Visita · via del Porto","Valutazione · Sig. Riva","Visita · bilocale in centro"],
      urg:{ momento:"sabato · 16:05", cl:"Devo firmare lunedì, ho bisogno dell'agente adesso.", ai:"Capisco. La metto subito in contatto con l'agente.", r1:"Sig.ra Conti, deve firmare lunedì.", r2:"Chiede di parlare oggi con l'agente: è in linea.", linea:"In linea con la cliente" },
      demo:{ esempio:"Agenzia immobiliare Rossi", cl:"Avete bilocali in affitto in centro?" } },
    ricettive:{ nome:"Elena", attivita:"B&B (esempio)", chi:"la struttura", da:"dalla struttura", titolare:"Il responsabile",
      tel:{ momento:"ore 22:15 · reception chiusa", giorno:"sabato",
        b:["B&B, sono Elena, l'assistente AI. Come posso aiutarLa?","Avete una doppia per sabato notte?","Sì, una doppia con colazione. La segno a Suo nome?","Sì, grazie. Arriviamo verso le 19."],
        ev:["Doppia · Sig. Neri","richiesta raccolta da Elena, assistente AI"], prima:["Arrivo · camera 2","segnato dalla struttura"] },
      occ:{ ora:"10:30", perche:"la reception sta facendo un check-out", ai:"B&B, sono Elena, l'assistente AI. Mi dica pure.", cl:"Si può arrivare dopo le 22?", nota:["Sig. Neri · arrivo dopo le 22","richiesta pronta per la reception"], per:"Per la reception" },
      ag:["Arrivo · camera 2","Arrivo · camera 5","Visita della sala · evento"],
      urg:{ momento:"domenica · 23:10", cl:"Siamo arrivati ma non troviamo le chiavi.", ai:"Capisco. Chiamo subito il responsabile e La metto in linea.", r1:"Ospiti della camera 3, arrivati adesso.", r2:"Non trovano le chiavi: sono in linea.", linea:"In linea con gli ospiti" },
      demo:{ esempio:"B&B Rossi", cl:"Avete il parcheggio?" } },
    veterinari:{ nome:"Leandro", attivita:"Clinica veterinaria (esempio)", chi:"la clinica", da:"dalla clinica", titolare:"Veterinario reperibile",
      tel:{ momento:"ore 20:50 · clinica chiusa", giorno:"venerdì",
        b:["Clinica veterinaria, sono Leandro, l'assistente AI. Come posso aiutarLa?","Vorrei prenotare il vaccino per il mio cane.","Ho mercoledì alle 16:30 o venerdì alle 9:00. Quale preferisce?","Venerdì alle 9, grazie."],
        ev:["Vaccino · Luna (cane)","fissato da Leandro, assistente AI"], prima:["Controllo · Milo","fissato dalla clinica"] },
      occ:{ ora:"17:20", perche:"la segreteria è al telefono con un altro cliente", ai:"Clinica veterinaria, sono Leandro, l'assistente AI. Mi dica pure.", cl:"Vorrei un controllo per il mio gatto.", nota:["Elisa F. · controllo per il gatto","richiesta pronta, da confermare"], per:"Per la segreteria" },
      ag:["Vaccino · Luna (cane)","Controllo · Milo (gatto)","Prima visita · Kira"],
      urg:{ momento:"sabato · 15:40", cl:"Il mio cane sta male, è un'emergenza.", ai:"Capisco. Non do consigli su farmaci o cure: La passo subito alla clinica.", r1:"Sig. Greco, il cane sta male da un'ora.", r2:"Chiede un veterinario adesso: è in linea.", linea:"In linea con il cliente" },
      demo:{ esempio:"Clinica veterinaria Rossi", cl:"Fate anche le vaccinazioni?" } }
  };
  N.uffici=N.dentisti;

  function tel(box,n,cls,x,y){
    var t=h("div","tel"+(cls?" "+cls:""),null,box); t.style.left=x+"px"; t.style.top=y+"px";
    var s=h("div","schermo",null,t);
    h("div","isola",null,s); h("div","stato","<span>"+C.esc(n._ora||"9:41")+"</span><span>●●●</span>",s);
    var capo=h("div","capo",I.logo+"<b>"+C.esc(n.nome)+"</b><small>assistente AI · "+C.esc(n.attivita)+"</small>",s);
    var timer=h("span","timer","00:00",capo);
    var bat=h("div","battute",null,s);
    h("div","tasti","<i>"+I.persona+"</i><i class=\"fine\">"+I.tel+"</i>",s);
    return {el:t,battute:bat,timer:timer};
  }
  function batt(parent,chi,testo,n){
    return h("div","batt "+chi,(chi==="ai"?"<b>"+C.esc(n.nome)+" · assistente AI</b>":"")+C.esc(testo),parent);
  }
  function orologio(el,t0,t1){
    C.hook(function(t){ var s=Math.max(0,Math.floor((Math.min(t,t1)-t0)/1000)); el.textContent="00:"+(s<10?"0":"")+s; });
  }
  function pos(el,x,y,w){ el.style.left=x+"px"; el.style.top=y+"px"; if(w) el.style.width=w+"px"; return el; }
  function squillo(el,t0,t1,base){ // il telefono trema finché squilla
    C.hook(function(t){ var a=(t>t0&&t<t1)?Math.sin((t-t0)/60)*10:0; el.firstChild.style.transform="rotate("+a.toFixed(2)+"deg)"; });
    void base;
  }
  function onde(box,x,y,t0,t1){
    [0,1].forEach(function(i){
      var o=h("div","onda",null,box);
      C.hook(function(t){ var p=((t-t0)/1100+i*.5)%1, vivo=t>t0&&t<t1; var d=110+p*150;
        o.style.cssText="left:"+(x-d/2)+"px;top:"+(y-d/2)+"px;width:"+d+"px;height:"+d+"px;opacity:"+(vivo?(1-p)*.7:0).toFixed(3); });
    });
  }
  function filo(box,d,t0){
    box.insertAdjacentHTML("beforeend",'<svg class="filo" width="1000" height="900" viewBox="0 0 1000 900" style="left:0;top:0"><path d="'+d+'"/></svg>');
    var sv=box.lastElementChild, p=sv.querySelector("path");
    C.entra(sv,t0,{fx:"fade",dur:500});
    C.hook(function(t){ p.style.strokeDashoffset=(-(t/28)).toFixed(1); });
    return sv;
  }

  var S=C.SCENE={};

  /* 1 · Telefonata: l'assistente risponde, propone gli orari, l'appuntamento entra in agenda */
  S.telefonata={ passi:5, crea:function(box,n,T,fine){
    var m=n.tel; n._ora=(m.momento.match(/\d\d:\d\d/)||["9:41"])[0];
    var t=tel(box,n,"",30,20); t.el.style.width="440px"; t.el.style.height="860px";
    C.entra(t.el,T[0],{fx:"sx",dur:700});
    orologio(t.timer,T[1],T[5]);
    ["ai","cl","ai","cl"].forEach(function(chi,i){ C.entra(batt(t.battute,chi,m.b[i],n),T[i+1],{fx:"su"}); });
    C.entra(pos(h("div","etichetta chiara",C.esc(m.momento),box),500,150),T[0]+250,{fx:"pop"});
    var a=pos(h("div","scheda",null,box),490,250,480);
    a.innerHTML="<h4>"+I.cal+"Agenda<span>"+C.esc(m.giorno)+"</span></h4>";
    var r=h("div",null,null,a); r.style.marginTop="12px";
    h("div","ag-riga","<time>15:00</time><div class=\"ag-ev\" style=\"background:#E6EEEE;border-left-color:#0F4C5C\">"+C.esc(m.prima[0])+"<small>"+C.esc(m.prima[1])+"</small></div>",r);
    h("div","ag-riga","<time>16:00</time><i class=\"ag-vuoto\"></i>",r);
    var riga=h("div","ag-riga","<time>17:00</time>",r); riga.style.minHeight="96px";
    var ev=h("div","ag-ev",C.esc(m.ev[0])+"<small>"+C.esc(m.ev[1])+"</small>",riga);
    h("div","ag-riga","<time>18:00</time><i class=\"ag-vuoto\" style=\"width:40%\"></i>",r);
    C.entra(a,T[0]+400,{fx:"dx",dur:700}); C.entra(ev,T[5],{fx:"pop",dur:620});
    C.entra(pos(h("div","etichetta terra","Negli orari decisi "+C.esc(n.da),box),490,720),T[5]+450,{fx:"su"});
    void fine;
  }};

  /* 2 · Linea occupata: la chiamata passa all'assistente AI, la richiesta arriva pronta */
  S.occupato={ passi:5, crea:function(box,n,T){
    var m=n.occ; n._ora=m.ora;
    var l=pos(h("div","scheda",null,box),40,20,920);
    l.innerHTML="<h4>"+I.tel+C.esc(n.attivita)+"<span>ore "+C.esc(m.ora)+"</span></h4><p><span class=\"pallino\"></span><b>Linea occupata</b><small>"+C.esc(m.perche)+"</small></p>";
    C.entra(l,T[0],{fx:"giu",dur:600});
    var tt=pos(h("div","tondo-tel","<span>"+I.tel+"</span>",box),90,300);
    C.entra(tt,T[1],{fx:"pop"}); squillo(tt,T[1],T[3]); onde(box,145,355,T[1],T[3]);
    C.entra(pos(h("div","etichetta","Un'altra chiamata",box),40,440),T[1]+200,{fx:"su"});
    filo(box,"M215 350 C 300 290, 380 290, 470 350",T[2]);
    C.entra(pos(h("div","etichetta terra","passa all'assistente AI",box),150,226),T[2]+150,{fx:"pop"});
    var t=tel(box,n,"piccolo",500,200); t.el.style.height="690px";
    C.entra(t.el,T[2],{fx:"dx",dur:650}); orologio(t.timer,T[3],T[5]);
    C.entra(batt(t.battute,"ai",m.ai,n),T[3],{fx:"su"}); C.entra(batt(t.battute,"cl",m.cl,n),T[4],{fx:"su"});
    var s=pos(h("div","scheda scura",null,box),40,640,430);
    s.innerHTML="<h4>"+I.ok+C.esc(m.per)+"</h4><p>"+C.esc(m.nota[0])+"<small>"+C.esc(m.nota[1])+"</small></p>";
    C.entra(s,T[5],{fx:"pop",dur:620});
  }};

  /* 3 · Agenda che si riempie, solo negli orari decisi */
  S.agenda={ passi:5, crea:function(box,n,T){
    var a=h("div","scheda agenda-g",null,box);
    a.innerHTML="<h4>"+I.cal+"Agenda · "+C.esc(n.attivita)+"<span>giovedì</span></h4>";
    var o=h("div","orari","Orari decisi da Lei: 9–13 · 15–19",a);
    var r=h("div","righe",null,a), ag=n.ag;
    function riga(ora,html,cls){ return h("div","r"+(cls?" "+cls:""),"<time>"+ora+"</time>"+(html||""),r); }
    riga("9:00","<div class=\"ev studio\">Già in agenda<small>fissato "+C.esc(n.da)+"</small></div>");
    var e1=h("div","ev",C.esc(ag[0])+"<small>fissato da "+C.esc(n.nome)+", assistente AI</small>",riga("10:00"));
    riga("11:00","<i class=\"ag-vuoto\"></i>");
    riga("13:00","<em>pausa · non si prenota</em>","chiuso");
    var e2=h("div","ev",C.esc(ag[1])+"<small>fissato da "+C.esc(n.nome)+", assistente AI</small>",riga("15:00"));
    var e3=h("div","ev",C.esc(ag[2])+"<small>fissato da "+C.esc(n.nome)+", assistente AI</small>",riga("17:00"));
    var ch=riga("20:00","<em>chiuso · non si prenota</em>","chiuso");
    var no=h("div","no","Fuori orario: propone il primo orario libero",ch);
    C.entra(a,T[0],{fx:"su",dur:700}); C.entra(o,T[1],{fx:"pop"});
    C.entra(e1,T[2],{fx:"pop"}); C.entra(e2,T[3],{fx:"pop"}); C.entra(e3,T[4],{fx:"pop"}); C.entra(no,T[5],{fx:"dx"});
  }};

  /* 4 · Urgenza: riassunto di due frasi al titolare, poi il collegamento */
  S.urgenza={ passi:5, crea:function(box,n,T){
    var m=n.urg; n._ora=(m.momento.match(/\d\d:\d\d/)||["9:41"])[0];
    C.entra(pos(h("div","etichetta chiara",C.esc(m.momento),box),40,20),T[0],{fx:"pop"});
    var t=tel(box,n,"piccolo",40,96); t.el.style.height="700px";
    C.entra(t.el,T[0],{fx:"sx",dur:650}); orologio(t.timer,T[1],T[5]);
    C.entra(batt(t.battute,"cl",m.cl,n),T[1],{fx:"su"}); C.entra(batt(t.battute,"ai",m.ai,n),T[2],{fx:"su"});
    var r=pos(h("div","scheda allarme",null,box),450,110,520);
    r.innerHTML="<h4>"+I.allarme+"Riassunto per il titolare</h4><p><b>1.</b> "+C.esc(m.r1)+"</p><p><b>2.</b> "+C.esc(m.r2)+"<small>due frasi, prima di collegare</small></p>";
    C.entra(r,T[3],{fx:"dx",dur:650});
    filo(box,"M710 470 L 710 566",T[4]);
    var c=pos(h("div","scheda scura",null,box),450,580,520); c.style.height="200px";
    c.innerHTML="<h4>"+I.tel+C.esc(n.titolare)+"</h4>";
    var p1=h("p",null,"Sta squillando…<small>l'assistente AI resta in linea</small>",c), p2=h("p",null,"<span class=\"pallino ok\"></span><b>"+C.esc(m.linea)+"</b><small>la conversazione passa a una persona</small>",c);
    p2.style.cssText="position:absolute;left:28px;right:28px;top:66px";
    C.entra(c,T[4],{fx:"su",dur:600}); C.entra(p1,T[4],{fx:"fade",out:T[5]-150}); C.entra(p2,T[5],{fx:"su"});
  }};

  /* 5 · Demo col nome della propria attività */
  S.demo={ passi:4, crea:function(box,n,T){
    var m=n.demo;
    var s=pos(h("div","scheda",null,box),50,20,900); s.style.padding="32px 36px 36px";
    s.innerHTML="<h4>"+I.chat+"Demo gratuita · celea.it<span>dal browser</span></h4><p style=\"font-size:32px;margin-top:16px\">Come si chiama la Sua attività?</p>";
    var campo=h("div","campo",null,s), txt=h("span",null,"",campo); h("i",null,null,campo);
    var b=h("div","bottone",I.tel+"Parla ora",s);
    C.entra(s,T[0],{fx:"su",dur:650});
    C.hook(function(t){ var k=Math.round(C.clamp((t-T[1])/1300)*m.esempio.length); txt.textContent=m.esempio.slice(0,k); });
    C.entra(b,T[2],{fx:"pop"});
    var ai=pos(h("div","batt-g ai","<b>"+C.esc(n.nome)+" · assistente AI</b>Buongiorno, "+C.esc(m.esempio)+", sono "+C.esc(n.nome)+", l'assistente AI. Come posso aiutarLa?",box),50,440,760);
    C.entra(ai,T[3],{fx:"sx"});
    var cl=h("div","batt-g cl",C.esc(m.cl),box); cl.style.right="50px"; cl.style.top="680px"; C.entra(cl,T[4],{fx:"dx"});
    C.entra(pos(h("div","etichetta chiara","Nome d'esempio · risposte d'esempio",box),50,800),T[3]+300,{fx:"su"});
  }};

  /* 6 · Ufficio con i reparti: il disegno isometrico del sito, con Celeo che fa da guida */
  S.ufficio={ passi:9, crea:function(box,n,T){
    var iso=window.CELEA_ISO, perc=JSON.parse(JSON.stringify(iso.percorso)), K=1.85, VW=1000, VH=740, CH=1000*600/816;
    var qui={}; for(var z in perc) qui[z]=perc[z].slice(); qui.ingresso=[23.5,62]; // Celeo un passo più in là: non copre la scritta «assistente AI»
    var u=h("div","iso-ufficio",null,box), v=h("div","iso-vista",null,u), cam=h("div","iso-cam",iso.svg,v);
    var celeo=h("img","iso-celeo",null,cam); celeo.src="../assets/celeo-figura.webp";
    var passi=["ingresso","ingresso","ingresso","ingresso","whatsapp","marketing","contabilita","legale","vendite","ingresso"];
    [].forEach.call(cam.querySelectorAll("[data-at]"),function(el){ C.entra(el,T[+el.getAttribute("data-at")],{fx:"fade",dur:450}); });
    var stanze={}; [].forEach.call(cam.querySelectorAll(".iso-room"),function(g){ stanze[g.getAttribute("data-room")]=g.querySelector(".iso-glow"); });
    var etich={}; [].forEach.call(cam.querySelectorAll(".iso-label"),function(g){ etich[g.getAttribute("data-for")]=g.querySelector("rect"); });
    function vista(nome){ // inquadratura ingrandita sulla stanza
      var px=perc[nome][0]/100*VW*K, py=perc[nome][1]/100*CH*K;
      return [K, Math.min(0,Math.max(VW-VW*K,VW*.5-px)), Math.min(0,Math.max(VH-CH*K,VH*.62-py))];
    }
    var intera=[1,0,(VH-CH)/2], cams=[[T[0],intera]];
    for(var j=1;j<=8;j++) if(j===1||passi[j]!==passi[j-1]) cams.push([T[j],vista(passi[j])]);
    cams.push([T[9],intera]);
    var mosse=[[T[0],qui.ingresso]];
    for(var q=1;q<=9;q++) if(passi[q]!==passi[q-1]) mosse.push([T[q],qui[passi[q]]]);
    function tra(lista,t,dur){ // valore corrente di una lista di [tempo, valori]
      var i=0; while(i+1<lista.length&&t>=lista[i+1][0]) i++;
      var a=lista[Math.max(0,i-1)][1], b=lista[i][1], p=i===0?1:C.e.io(C.clamp((t-lista[i][0])/dur));
      return {v:b.map(function(x,k){ return a[k]+(x-a[k])*p; }),p:p,a:a,b:b};
    }
    C.hook(function(t){
      var c=tra(cams,t,1200).v; cam.style.transform="translate("+c[1].toFixed(1)+"px,"+c[2].toFixed(1)+"px) scale("+c[0].toFixed(4)+")";
      var m=tra(mosse,t,1300), cammina=m.p>0&&m.p<1, salto=cammina?-Math.abs(Math.sin(t/105))*5:0;
      celeo.style.left=m.v[0]+"%"; celeo.style.top=m.v[1]+"%";
      celeo.style.transform="translate(-50%,-100%) translateY("+salto.toFixed(1)+"px)"+(m.b[0]<m.a[0]?" scaleX(-1)":"");
      var passo=0; for(var s=1;s<=9;s++) if(t>=T[s]) passo=s;
      for(var nome in stanze){
        var su=0; for(var x=1;x<=9;x++) if(passi[x]===nome){ var fin=x<9&&passi[x+1]===nome?1e9:(x<9?T[x+1]:1e9); su=Math.max(su,C.clamp((t-T[x])/600)*(1-C.clamp((t-fin)/600))); }
        stanze[nome].style.opacity=(su*.26).toFixed(3);
        var on=passo>0&&passi[passo]===nome; etich[nome].style.stroke=on?"#E9B949":""; etich[nome].style.strokeWidth=on?"2.5":"";
      }
    });
    var r=h("div","scheda scura iso-riepilogo",null,box);
    r.innerHTML="<h4>"+I.logo+"Riepilogo di oggi<span>sul telefono del titolare</span></h4><p>3 chiamate · 1 appuntamento fissato · 1 post da approvare</p>";
    r.querySelector("h4 svg").style.cssText="border-radius:8px;width:38px;height:38px";
    C.entra(r,T[9],{fx:"su",dur:600});
  }};

  /* ---------- video: apertura con Celeo, scena con sottotitoli grandi, chiusura con logo ---------- */
  C.video=function(s,W,H){
    var ad=s.tipo==="pubblicita", tela=document.getElementById("tela");
    tela.innerHTML=""; tela.style.width=W+"px"; tela.style.height=H+"px"; tela.className="video bg-"+(s.sfondo||"sabbia");
    var Z=H>=1900?{barra:215,palcoY:300,palcoH:870,subB:385,subH:330,disp:318,arco:170,font:50}
         :H>=1300?{barra:46,palcoY:120,palcoH:770,subB:96,subH:300,disp:34,arco:150,font:46}
                 :{barra:30,palcoY:92,palcoH:690,subB:70,subH:200,disp:22,arco:112,font:40};
    var scena=C.SCENE[s.scena]||C.SCENE.telefonata, frasi=s.frasi||[];
    var n=JSON.parse(JSON.stringify(C.NICCHIE[s.nicchia]||C.NICCHIE.dentisti));
    if(s.nome) n.nome=s.nome; if(s.attivita) n.attivita=s.attivita;

    // tempi
    var tA=+s.apertura_ms||(ad?2000:2800), fine=+s.chiusura_ms||(ad?3000:3600), ritmo=ad?[2000,700,42]:[2600,900,50];
    var inizio=[], dur=[], t=tA;
    frasi.forEach(function(f){ var d=Math.max(ritmo[0],ritmo[1]+ritmo[2]*f.length); inizio.push(t); dur.push(d); t+=d; });
    var tC=t, D=tC+fine, T=[tA], m=frasi.length||1, np=scena.passi;
    for(var j=1;j<=np;j++){
      var k=Math.floor((j-1)*m/np), primo=j; while(primo>1&&Math.floor((primo-2)*m/np)===k) primo--;
      var quanti=0; for(var x=1;x<=np;x++) if(Math.floor((x-1)*m/np)===k) quanti++;
      T[j]=(inizio[k]||tA)+250+(j-primo)*(((dur[k]||2600)-500)/quanti);
    }
    C.durata=D;

    // 1 · apertura: Celeo presenta, con il gancio
    var ap=h("div","strato apertura",null,tela), an=h("div","anello",null,ap), d=Math.round(W*.95);
    an.style.cssText="width:"+d+"px;height:"+d+"px;right:"+(-d*.42)+"px;top:"+(-d*.2)+"px";
    var col=h("div",null,null,ap);
    col.style.cssText="position:absolute;left:70px;right:70px;top:"+(H>=1900?250:H>=1300?90:70)+"px;display:flex;flex-direction:column;gap:"+(H>=1300?34:22)+"px";
    var lg=C.logo(col); C.entra(lg,0,{fx:"giu",dur:400});
    if(s.occhiello) C.entra(h("div","occhiello",C.fmt(s.occhiello),col),80,{fx:"su",dur:420});
    var tit=h("h1","titolo",C.fmt(s.gancio||s.titolo||""),col); if(H<1300) tit.style.fontSize="84px"; else if(H<1900) tit.style.fontSize="100px";
    C.entra(tit,160,{fx:"su",dur:480});
    var ch=Math.round(H*(H>=1900?.47:H>=1300?.44:.46)), cf=C.celeo(ap,s.celeo==="sinistra"?"sinistra":"destra",ch,Math.round(ch*.1),40);
    C.entra(cf,120,{fx:"sali",dur:650,base:s.celeo==="sinistra"?"scaleX(-1)":""});
    if(s.fumetto){ var fu=h("div","fumetto"+(s.celeo==="sinistra"?"":" dx"),C.fmt(s.fumetto),ap); fu.style[s.celeo==="sinistra"?"left":"right"]=Math.round(ch*.5)+"px"; fu.style.bottom=Math.round(ch*.62)+"px"; fu.style.maxWidth="480px"; C.entra(fu,650,{fx:"pop"}); }
    C.entra(ap,-1000,{fx:"fade",out:tA-300});

    // 2 · scena con sottotitoli
    var sc=h("div","strato",null,tela);
    var barra=h("div","barra",null,sc); barra.style.top=Z.barra+"px"; C.logo(barra);
    h("div","chip chip-ai","<i></i>"+C.esc(s.scena==="ufficio"?"assistenti AI":n.nome+" · assistente AI"),barra);
    var k=Math.min((W-80)/1000,Z.palcoH/900), palco=h("div","palco",null,sc);
    palco.style.left=((W-1000*k)/2)+"px"; palco.style.top=(Z.palcoY+(Z.palcoH-900*k)/2)+"px"; palco.style.transform="scale("+k.toFixed(4)+")";
    scena.crea(palco,n,T,tC);
    var sub=h("div","sottotitoli",null,sc); sub.style.cssText="left:50px;right:50px;bottom:"+Z.subB+"px;height:"+Z.subH+"px";
    var ar=C.arco(sub,Z.arco); ar.style.position="relative"; ar.style.height=Math.round(Z.arco*1.4)+"px";
    var pila=h("div","pila",null,sub);
    frasi.forEach(function(f,i){ var b=h("div","sub",C.fmt(f),pila); b.style.fontSize=Z.font+"px"; C.entra(b,inizio[i],{fx:"su",dur:380,out:i<frasi.length-1?inizio[i+1]-120:null}); });
    var dd=C.disp(s.disponibilita); if(dd){ var dv=h("div","disp",C.esc(dd),sc); dv.style.bottom=Z.disp+"px"; }
    C.entra(sc,tA-200,{fx:"fade",dur:400,out:tC-100});

    // 3 · chiusura: logo, slogan, sito
    var cz=h("div","strato chiusura",null,tela);
    if(H<1300){ cz.style.gap="22px"; }
    var l2=C.logo(cz); l2.style.setProperty("--logo-a","#F4EDE3"); l2.style.setProperty("--logo-b","#E08A6A");
    if(H<1300){ l2.style.fontSize="110px"; l2.querySelector("svg").style.cssText="width:140px;height:140px"; }
    var sl=h("div","slogan",C.fmt(s.slogan||"Risponde ai Suoi clienti. / *Quando Lei non può.*"),cz);
    var inv=h("div","invito",C.fmt(s.invito||(ad?"Provi la demo gratis su celea.it":"Provi la demo gratis")),cz);
    var www=h("div","www","www.celea.it",cz);
    var nt=dd?h("div","nota",C.esc(dd),cz):null;
    C.entra(cz,tC,{fx:"fade",dur:350}); C.entra(l2,tC+150,{fx:"pop",dur:600}); C.entra(sl,tC+500,{fx:"su"}); C.entra(inv,tC+850,{fx:"su"}); C.entra(www,tC+1100,{fx:"pop"}); if(nt) C.entra(nt,tC+1350,{fx:"fade"});
  };
})();
