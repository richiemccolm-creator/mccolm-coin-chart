/* Small polyfills for iOS 10–12 Safari and older smart-TV Chromium */
(function () {
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(typeof padString !== "undefined" ? padString : " ");
      if (this.length >= targetLength) return String(this);
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat
          ? padString.repeat(targetLength / padString.length)
          : Array(targetLength + 1).join(padString);
      }
      return padString.slice(0, targetLength) + String(this);
    };
  }
  if (!Object.assign) {
    Object.assign = function (target) {
      if (target == null) throw new TypeError("Cannot convert undefined or null to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var next = arguments[i];
        if (next != null) {
          for (var key in next) {
            if (Object.prototype.hasOwnProperty.call(next, key)) to[key] = next[key];
          }
        }
      }
      return to;
    };
  }
  if (!Object.entries) {
    Object.entries = function (obj) {
      var own = Object.keys(obj), i = 0, out = [];
      for (; i < own.length; i++) out.push([own[i], obj[own[i]]]);
      return out;
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, from) {
      return this.indexOf(search, from || 0) !== -1;
    };
  }
  if (typeof window !== "undefined" && window.CanvasRenderingContext2D &&
      !CanvasRenderingContext2D.prototype.ellipse) {
    CanvasRenderingContext2D.prototype.ellipse = function (x, y, rx, ry, rot, start, end, ccw) {
      this.save();
      this.translate(x, y);
      this.rotate(rot || 0);
      this.scale(rx, ry);
      this.arc(0, 0, 1, start, end, ccw);
      this.restore();
    };
  }
})();

const {useState,useEffect,useRef,useMemo} = React;

/* =====================================================================
   IMAGE SLOTS — paste a URL (or a local file path like "img/sam.png")
   next to any key below and it replaces the dashed placeholder box.
   Leave "" to keep the placeholder visible.
   ===================================================================== */
const IMAGES = {
  logo:        "/img/logo.png",   // Hero Coins logo (transparent PNG)
  heroSam:     "/img/sam.png",   // Sam portrait (used in selector + bottom strip)
  heroIsaac:   "/img/isaac.png",
  heroBen:     "/img/ben.png",
  jobs: {
    "brush-am":"/img/brush.png",
    "brush-pm":"/img/brush-pm.png",
    "bed":"/img/bed.png",
    "dressed":"/img/dressed.png",
    "homework":"/img/homework.png",
    "tidy":"/img/tidy.png",
    "cook":"/img/cook.png",
    "club":"/img/club.png",
    "kind":"/img/kind.png"
  },
  shop: {
    "tv":"", "snack":"", "movie":"", "switch15":"", "switch30":"", "tax":"",
    "toy-small":"", "park":"", "late":"", "dayout":"", "toy-big":"", "cinema":""
  }
};

/* ---------- data ---------- */
const KIDS = {
  sam:   {name:"Sam",   cls:"h-sam",   colour:"#ff8c00", img:"heroSam",   badge:"⚡"},
  isaac: {name:"Isaac", cls:"h-isaac", colour:"#5aa9ff", img:"heroIsaac", badge:"⭐"},
  ben:   {name:"Ben",   cls:"h-ben",   colour:"#ff3b3b", img:"heroBen",   badge:"✊"}
};

const EVERYDAY_JOBS = [
  {id:"brush-am", name:"Brush teeth", sub:"Morning",       coins:1, timer:true},
  {id:"brush-pm", name:"Brush teeth", sub:"Night",         coins:1, timer:true},
  {id:"bed",      name:"Make your bed",                     coins:1},
  {id:"dressed",  name:"Get dressed on time",               coins:1},
  {id:"homework", name:"Homework, no fuss",                 coins:2}
];
const BONUS_JOBS = [
  {id:"tidy", name:"Tidy your room",           coins:3},
  {id:"cook", name:"Help cook or set the table",coins:2},
  {id:"club", name:"Go to a club or activity",  coins:3},
  {id:"kind", name:"Be kind & helpful",         coins:2}
];
const EVERYDAY_SHOP = [
  {id:"tv",    name:"Breakfast TV",      sub:"15 minutes",     coins:1},
  {id:"snack", name:"Choose a special snack",                  coins:5},
  {id:"movie", name:"Friday Movie Night", sub:"pick the film", coins:5}
];
const WEEKEND_SHOP = [
  {id:"switch15", name:"Nintendo Switch", sub:"15 minutes", coins:3},
  {id:"switch30", name:"Nintendo Switch", sub:"30 minutes", coins:5}
];
const SAVINGS_SHOP = [
  {id:"toy-small", name:"Small toy",        coins:50},
  {id:"park",      name:"Park trip + snack",coins:75},
  {id:"late",      name:"Stay up later",    sub:"30 minutes", coins:80},
  {id:"dayout",    name:"Day out",          coins:150},
  {id:"toy-big",   name:"Bigger toy",       coins:200},
  {id:"cinema",    name:"Cinema trip",      sub:"all three boys", coins:250}
];

/* ---------- image placeholder component ---------- */
function Slot({src,label,className,style,light}){
  return (
    <div className={"slot "+(src?"has-img ":"")+(light?"light ":"")+(className||"")} style={style}>
      {src ? <img src={src} alt={label}/> :
        <div>
          <div className="slot-ico">🖼️</div>
          <div className="slot-label">{label}</div>
        </div>}
    </div>
  );
}

function CoinBtn({value,word,tone,onClick,disabled}){
  return (
    <button className={"coin-btn "+(tone||"")} onClick={onClick} disabled={disabled}>
      <span className="cnum">{value}</span>
      <span className="cword">{word||(value===1?"COIN":"COINS")}</span>
    </button>
  );
}

/* ---------- simple built-in music (no files needed) ---------- */
function useBrushingTune(){
  const ctxRef = useRef(null), stopRef = useRef(null);
  const start = () => {
    try{
      const AC = window.AudioContext||window.webkitAudioContext;
      const ctx = new AC(); ctxRef.current = ctx;
      const notes=[523.25,587.33,659.25,783.99,659.25,587.33];
      let i=0;
      const gain = ctx.createGain(); gain.gain.value=0.06; gain.connect(ctx.destination);
      const tick=()=>{
        const o=ctx.createOscillator(); o.type="triangle";
        o.frequency.value=notes[i%notes.length]; i++;
        const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(1,ctx.currentTime+0.03);
        g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.42);
        o.connect(g); g.connect(gain); o.start(); o.stop(ctx.currentTime+0.45);
      };
      tick(); const iv=setInterval(tick,500); stopRef.current=iv;
    }catch(e){}
  };
  const stop = () => {
    if(stopRef.current) clearInterval(stopRef.current);
    if(ctxRef.current){ try{ctxRef.current.close();}catch(e){} ctxRef.current=null; }
  };
  const fanfare = () => {
    try{
      const AC = window.AudioContext||window.webkitAudioContext; const ctx=new AC();
      [523.25,659.25,783.99,1046.5].forEach((f,n)=>{
        const o=ctx.createOscillator(); o.type="square"; o.frequency.value=f;
        const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,ctx.currentTime+n*0.12);
        g.gain.exponentialRampToValueAtTime(0.14,ctx.currentTime+n*0.12+0.02);
        g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+n*0.12+0.5);
        o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime+n*0.12); o.stop(ctx.currentTime+n*0.12+0.55);
      });
      setTimeout(()=>{try{ctx.close();}catch(e){}},1800);
    }catch(e){}
  };
  return {start,stop,fanfare};
}

/* ---------- local persistence (Supabase sync can replace this later) ---------- */
const STORAGE_KEY = "coin-chart-v2";
const DEFAULT_COINS = {sam:0,isaac:0,ben:0};
const DEFAULT_LOG = {sam:[],isaac:[],ben:[]};
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return {kid:"sam", coins:DEFAULT_COINS, log:DEFAULT_LOG};
    const parsed = JSON.parse(raw);
    return {
      kid: parsed.kid && KIDS[parsed.kid] ? parsed.kid : "sam",
      coins: {...DEFAULT_COINS, ...(parsed.coins||{})},
      log: {
        sam: Array.isArray(parsed.log && parsed.log.sam) ? parsed.log.sam : [],
        isaac: Array.isArray(parsed.log && parsed.log.isaac) ? parsed.log.isaac : [],
        ben: Array.isArray(parsed.log && parsed.log.ben) ? parsed.log.ben : []
      }
    };
  }catch(e){
    return {kid:"sam", coins:DEFAULT_COINS, log:DEFAULT_LOG};
  }
}

/* ================= APP ================= */
function App(){
  const initial = useMemo(()=>loadState(),[]);
  const [kid,setKid] = useState(initial.kid);
  const [coins,setCoins] = useState(initial.coins);
  const [log,setLog] = useState(initial.log);
  const [modal,setModal] = useState(null);          // 'vault' | 'timer' | 'history' | 'settings'
  const [timerJob,setTimerJob] = useState(null);
  const [secs,setSecs] = useState(120);
  const [running,setRunning] = useState(false);
  const [done,setDone] = useState(false);
  const [toast,setToast] = useState(null);
  const canvasRef = useRef(null);
  const tune = useBrushingTune();

  useEffect(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({kid, coins, log}));
    }catch(e){}
  },[kid,coins,log]);

  const weekend = useMemo(()=>{const d=new Date().getDay();return d===0||d===6;},[]);
  const K = KIDS[kid];

  const flash = (msg)=>{setToast(msg);setTimeout(()=>setToast(null),1700);};

  const earn = (amount,desc)=>{
    setCoins(c=>({...c,[kid]:c[kid]+amount}));
    setLog(l=>({...l,[kid]:[{type:"earned",amount,desc,when:new Date().toLocaleString("en-GB")},...l[kid]]}));
    flash("+"+amount+" for "+K.name+"!");
  };
  const spend = (amount,desc)=>{
    if(coins[kid] < amount){ flash("Not enough coins!"); return; }
    setCoins(c=>({...c,[kid]:c[kid]-amount}));
    setLog(l=>({...l,[kid]:[{type:"spent",amount,desc,when:new Date().toLocaleString("en-GB")},...l[kid]]}));
    flash("−"+amount+" · "+desc);
  };

  const undoLast = ()=>{
    const entry = log[kid][0];
    if(!entry){ flash("Nothing to undo"); return; }
    setCoins(c=>({
      ...c,
      [kid]: entry.type==="earned" ? Math.max(0, c[kid]-entry.amount) : c[kid]+entry.amount
    }));
    setLog(l=>({...l,[kid]:l[kid].slice(1)}));
    flash("Undid "+entry.desc);
  };

  const resetAll = ()=>{
    setCoins({sam:0,isaac:0,ben:0});
    setLog({sam:[],isaac:[],ben:[]});
    flash("All kids reset to 0");
    setModal(null);
  };

  /* timer */
  const openTimer = (job)=>{ setTimerJob(job); setSecs(120); setRunning(false); setDone(false); setModal("timer"); };
  const closeTimer = ()=>{ tune.stop(); setRunning(false); setModal(null); setTimerJob(null); };
  useEffect(()=>{
    if(!running) return;
    if(secs<=0){
      setRunning(false); tune.stop(); tune.fanfare(); setDone(true);
      earn(timerJob ? timerJob.coins : 1, (timerJob?timerJob.name+" ("+timerJob.sub+")":"Brush teeth"));
      return;
    }
    const t=setTimeout(()=>setSecs(s=>s-1),1000);
    return ()=>clearTimeout(t);
  },[running,secs]);

  /* coin spill canvas */
  useEffect(()=>{
    if(modal!=="vault"||!canvasRef.current) return;
    const cv=canvasRef.current, ctx=cv.getContext("2d");
    const W=cv.width,H=cv.height, target=Math.min(coins[kid],120);
    let parts=[],frame=0,raf;
    const make=()=>({x:W*0.5+(Math.random()-0.5)*W*0.5,y:-30-Math.random()*60,
      vx:(Math.random()-0.5)*3.4,vy:Math.random()*1.6+1,r:Math.random()*Math.PI*2,
      vr:(Math.random()-0.5)*0.22,s:13+Math.random()*7,rest:false});
    const draw=(p)=>{
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);
      const sq=Math.abs(Math.cos(p.r));
      ctx.beginPath();ctx.ellipse(0,0,p.s*Math.max(sq,0.18),p.s,0,0,Math.PI*2);
      const g=ctx.createLinearGradient(-p.s,-p.s,p.s,p.s);
      g.addColorStop(0,"#fff3b0");g.addColorStop(.45,"#ffc42e");g.addColorStop(1,"#c97a00");
      ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle="#8a5300";ctx.stroke();
      if(sq>0.45){ctx.fillStyle="#8a5300";ctx.font="bold "+Math.round(p.s)+"px serif";
        ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("★",0,1);}
      ctx.restore();
    };
    const loop=()=>{
      ctx.clearRect(0,0,W,H);
      if(frame%3===0 && parts.length<target) parts.push(make());
      parts.forEach(p=>{
        if(!p.rest){
          p.vy+=0.34;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
          if(p.x<p.s||p.x>W-p.s){p.vx*=-0.6;p.x=Math.max(p.s,Math.min(W-p.s,p.x));}
          if(p.y>H-p.s-4){p.y=H-p.s-4;p.vy*=-0.32;p.vx*=0.72;p.vr*=0.5;
            if(Math.abs(p.vy)<1.1){p.rest=true;p.vy=0;p.r=Math.round(p.r/Math.PI)*Math.PI;}}
        }
        draw(p);
      });
      frame++;raf=requestAnimationFrame(loop);
    };
    loop();
    return ()=>cancelAnimationFrame(raf);
  },[modal,kid,coins]);

  const mmss=(s)=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
  const pct = 1-(secs/120);

  /* ---------- row renderers ---------- */
  const JobRow = ({job,tone,group}) => (
    <div className="row">
      <Slot light src={IMAGES.jobs[job.id]} label={job.id} className="icon-slot"/>
      <div className="rtext">
        <div className="rname">{job.name}</div>
        {job.sub && <div className="rsub">{job.sub}</div>}
      </div>
      {job.timer && <button className="timer-mini" title="Start 2-minute brushing timer" onClick={()=>openTimer(job)}>⏱️</button>}
      <CoinBtn value={job.coins} tone={tone} onClick={()=>earn(job.coins,job.name+(job.sub?" ("+job.sub+")":""))}/>
    </div>
  );

  const ShopRow = ({item,tone,locked,section}) => {
    const cant = coins[kid] < item.coins;
    return (
      <div className={"row "+(locked?"locked ":"")+(cant?"cant":"")}>
        <Slot light src={IMAGES.shop[item.id]} label={item.id} className="icon-slot"/>
        <div className="rtext">
          <div className="rname">{item.name}</div>
          {item.sub && <div className="rsub">{item.sub}</div>}
        </div>
        <CoinBtn value={item.coins} tone={tone} disabled={locked||cant}
          onClick={()=>spend(item.coins,item.name)}/>
      </div>
    );
  };

  return (
    <div className="wrap">

      {/* ---------------- HEADER ---------------- */}
      <header>
        <button className="cog-btn" type="button" aria-label="Parent settings" onClick={()=>setModal("settings")}>⚙</button>
        <div className="burst"></div>
        <img className="brand-logo" src={IMAGES.logo} alt="Hero Coins"/>
        <div className="comic title-line1 outline-2">
          <span className="n-sam">Sam</span><span className="n-amp">, </span>
          <span className="n-isaac">Isaac</span> <span className="n-amp">&amp;</span> <span className="n-ben">Ben's</span>
        </div>
        <div className="comic title-line2 outline-3">Coin Chart</div>
        <div className="ribbon bang">★ Earn coins. Spend or save! ★</div>
      </header>

      {/* ---------------- HERO SELECT ---------------- */}
      <div className="hero-row">
        {Object.entries(KIDS).map(([key,k])=>(
          <div key={key} className={"hero-card "+k.cls+(kid===key?" active":"")} onClick={()=>setKid(key)}>
            <Slot src={IMAGES[k.img]} label={k.name+" photo"} className="portrait"/>
            <div className="comic hname">{k.name} {k.badge}</div>
            <div className="hbal">🪙 {coins[key]}</div>
          </div>
        ))}
      </div>

      {/* ---------------- VAULT ---------------- */}
      <div className="vault" onClick={()=>setModal("vault")}>
        <Slot light src={IMAGES[K.img]} label={K.name} style={{width:"56px",height:"56px",borderRadius:"50%"}}/>
        <div>
          <div className="lbl">{K.name}'s coin bank</div>
          <div className="comic big">{coins[kid]}</div>
        </div>
        <div className="tap">Tap the lid<br/>to tip them out ⤵</div>
      </div>

      {/* ---------------- TWO PANELS ---------------- */}
      <div className="cols">

        {/* EARN */}
        <section className="panel earn">
          <div className="panel-head">
            <div className="comic ptitle outline-2">How to Earn</div>
            <div style={{fontSize:"1.7rem"}}>🪙</div>
          </div>
          <div className="panel-body">
            <div className="band gold comic">★ Everyday Jobs ★</div>
            {EVERYDAY_JOBS.map(j=><JobRow key={j.id} job={j}/>)}
            <div className="band red comic">★ Bonus Jobs ★</div>
            {BONUS_JOBS.map(j=><JobRow key={j.id} job={j}/>)}
          </div>
        </section>

        {/* SHOP */}
        <section className="panel shop">
          <div className="panel-head">
            <div className="comic ptitle outline-2">The Shop</div>
            <div style={{fontSize:"1.7rem"}}>🛒</div>
          </div>
          <div className="panel-body">
            <div className="band blue comic">★ Everyday Shop — any day ★</div>
            {EVERYDAY_SHOP.map(i=><ShopRow key={i.id} item={i} tone="blue"/>)}

            <div className="band green comic">★ Weekend Only ★</div>
            {!weekend && <div className="locknote">🔒 Locked until Saturday</div>}
            {WEEKEND_SHOP.map(i=><ShopRow key={i.id} item={i} tone="green" locked={!weekend}/>)}

            <div className="band purple comic">★ Special Rule ★</div>
            <div className="row">
              <Slot light src={IMAGES.shop.tax} label="tax" className="icon-slot"/>
              <div className="rtext">
                <div className="rname">Mum's Food Tax</div>
                <div className="rsub">Ask nicely — 2 coins per request</div>
              </div>
              <CoinBtn value={2} word="PER REQ" onClick={()=>spend(2,"Mum's Food Tax")} disabled={coins[kid]<2}/>
            </div>

            <div className="band red comic">★ Savings Shop — weekends ★</div>
            {!weekend && <div className="locknote">🔒 Big rewards open Saturday &amp; Sunday</div>}
            {SAVINGS_SHOP.map(i=><ShopRow key={i.id} item={i} locked={!weekend}/>)}
          </div>
        </section>
      </div>

      {/* ---------------- BOTTOM ---------------- */}
      <div className="bottom">
        <div>
          <div className="hero-art">
            {Object.entries(KIDS).map(([key,k])=>(
              <div key={key} onClick={()=>setKid(key)} style={{cursor:"pointer"}}>
                <Slot src={IMAGES[k.img]} label={k.name+" hero art"} className="big-slot"/>
                <div className="comic cap" style={{color:k.colour}}>{k.name} {k.badge}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rules">
          <h3 className="comic">★ The Rules ★</h3>
          <div className="rule"><span className="num">1</span><span>Do the job ➜ get your coins</span></div>
          <div className="rule"><span className="num">2</span><span>Payday every day 🪙 — Shop Day is <b>Saturday</b></span></div>
          <div className="rule"><span className="num">3</span><span>Spend now or save up for something bigger — your choice!</span></div>
          <button className="btn tax" onClick={()=>spend(2,"Mum's Food Tax")}>🍽️ Mum's Food Tax −2</button>
          <button className="btn hist" onClick={()=>setModal("history")}>📋 {K.name}'s History</button>
        </div>
      </div>

      <div className="footer-strip comic">★ Be a hero. Make good choices. Reach your goals! ★</div>

      {/* ---------------- VAULT MODAL ---------------- */}
      {modal==="vault" && (
        <div className="modal" onClick={()=>setModal(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head" style={{background:K.colour}}>
              <h2 className="comic outline-2">{K.name}'s Coins</h2>
            </div>
            <div className="sheet-body">
              <canvas id="coinCanvas" ref={canvasRef} width="460" height="340"></canvas>
              <div style={{textAlign:"center",marginTop:"10px"}}>
                <div className="comic" style={{fontSize:"3.4rem",color:"var(--red-dark)"}}>{coins[kid]}</div>
                <div style={{fontWeight:900,letterSpacing:"1px"}}>COINS IN THE BANK</div>
              </div>
              <button className="btn close" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TIMER MODAL ---------------- */}
      {modal==="timer" && (
        <div className="modal">
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head" style={{background:"var(--green)"}}>
              <h2 className="comic outline-2">🪥 Brushing Time</h2>
            </div>
            <div className="sheet-body">
              {done ? (
                <div className="celebrate">
                  <div className="spin" style={{fontSize:"3.5rem"}}>🪙</div>
                  <div className="comic pop">Well done, {K.name}!</div>
                  <div style={{fontWeight:900,marginTop:"6px"}}>You earned 1 coin ⭐</div>
                  <button className="btn go" onClick={closeTimer}>Brilliant!</button>
                </div>
              ):(
                <>
                  <svg className="timer-ring" width="180" height="180" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#00000022" strokeWidth="12"/>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#1a7a34" strokeWidth="12"
                      strokeLinecap="round" strokeDasharray={2*Math.PI*52}
                      strokeDashoffset={2*Math.PI*52*(1-pct)}
                      transform="rotate(-90 60 60)"/>
                  </svg>
                  <div className="timer-num">{mmss(secs)}</div>
                  <div className="brush-tip">
                    {running ? "Keep going — top, bottom, all the way round! 🎵" : "Press start, then brush for two whole minutes."}
                  </div>
                  {!running
                    ? <button className="btn go" onClick={()=>{setRunning(true);tune.start();}}>▶ Start brushing</button>
                    : <button className="btn stop" onClick={()=>{tune.stop();setRunning(false);}}>⏸ Pause</button>}
                  <button className="btn close" onClick={closeTimer}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- HISTORY MODAL ---------------- */}
      {modal==="history" && (
        <div className="modal" onClick={()=>setModal(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head" style={{background:"var(--blue-dark)"}}>
              <h2 className="comic outline-2">📋 {K.name}'s History</h2>
            </div>
            <div className="sheet-body">
              {log[kid].length===0
                ? <div style={{textAlign:"center",padding:"26px",fontWeight:800,color:"#777"}}>Nothing logged yet today.</div>
                : log[kid].map((e,i)=>(
                    <div key={i} className={"hist-item "+e.type}>
                      <div>
                        <div className="hdesc">{e.desc}</div>
                        <div className="htime">{e.when}</div>
                      </div>
                      <div className="hamt">{e.type==="earned"?"+":"−"}{e.amount}</div>
                    </div>
                  ))}
              <button className="btn close" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PARENT SETTINGS ---------------- */}
      {modal==="settings" && (
        <div className="modal" onClick={()=>setModal(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head" style={{background:"var(--navy)"}}>
              <h2 className="comic outline-2">⚙ Parent Settings</h2>
            </div>
            <div className="sheet-body">
              <div className="settings-note">For Mum &amp; Dad — undo mistakes or start fresh.</div>
              <div className="settings-bal">
                {K.name}: 🪙 {coins[kid]}
                {log[kid][0] ? " · last: "+(log[kid][0].type==="earned"?"+":"−")+log[kid][0].amount+" "+log[kid][0].desc : " · no history"}
              </div>
              <button className="btn undo" onClick={undoLast} disabled={!log[kid].length}>↩ Undo last for {K.name}</button>
              <button className="btn stop" onClick={resetAll}>Reset all kids to 0</button>
              <button className="btn close" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("/sw.js").catch(()=>{});
  });
}
