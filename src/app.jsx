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
    "sit":"/img/sit.png",
    "dinner":"/img/dinner.png",
    "calm-read":"/img/calm-read.png?v=2",
    "read-words":"/img/read-words.png?v=2",
    "bedtime":"/img/bedtime.png?v=2",
    "tidy":"/img/tidy.png",
    "cook":"/img/cook.png",
    "club":"/img/club.png",
    "kind":"/img/kind.png",
    "recycling":"/img/recycling.png?v=2",
    "hoover":"/img/hoover.png?v=2",
    "glass-tables":"/img/glass-tables.png?v=2",
    "skirting":"/img/skirting.png?v=2",
    "try-new":"/img/try-new.png"
  },
  shop: {
    "tv":"/img/tv.png",
    "screentime":"/img/screentime.png",
    "snack":"/img/snack.png",
    "movie":"/img/movie.png",
    "switch15":"/img/switch15.png",
    "switch30":"/img/switch30.png",
    "tax":"/img/tax.png",
    "toy-small":"/img/toy-small.png",
    "park":"/img/park.png",
    "late":"/img/late.png",
    "dayout":"/img/dayout.png",
    "toy-big":"/img/toy-big.png",
    "cinema":"/img/cinema.png"
  }
};

/* ---------- data ---------- */
const KIDS = {
  sam:   {name:"Sam",   cls:"h-sam",   colour:"#ff8c00", img:"heroSam",   badge:"⚡"},
  isaac: {name:"Isaac", cls:"h-isaac", colour:"#5aa9ff", img:"heroIsaac", badge:"⭐"},
  ben:   {name:"Ben",   cls:"h-ben",   colour:"#ff3b3b", img:"heroBen",   badge:"✊"}
};

/* Equal thirds on the brush-first spinner (clockwise from top) */
const BRUSH_WHEEL_ORDER = ["sam", "isaac", "ben"];

const EVERYDAY_JOBS = [
  {id:"brush-am", name:"Brush teeth", sub:"Morning",       coins:1, timer:true},
  {id:"brush-pm", name:"Brush teeth", sub:"Night",         coins:1, timer:true},
  {id:"bed",      name:"Make your bed",                     coins:1},
  {id:"dressed",  name:"Get dressed on time",               coins:1},
  {id:"homework", name:"Homework, no fuss",                 coins:2},
  {id:"sit",      name:"Sit nicely at the table",           coins:1, icon:"🪑"},
  {id:"dinner",   name:"Eat your dinner",                   coins:1, icon:"🍽️"},
  {id:"calm-read",name:"Calm reading", sub:"At bedtime",   coins:2},
  {id:"read-words",name:"Reading words", sub:"At bedtime", coins:2},
  {id:"bedtime",  name:"Going to bed on time",              coins:2}
];
const BONUS_JOBS = [
  {id:"tidy", name:"Tidy your room",           coins:3},
  {id:"cook", name:"Help cook or set the table",coins:2},
  {id:"club", name:"Go to a club or activity",  coins:3},
  {id:"kind", name:"Be kind & helpful",         coins:2},
  {id:"recycling", name:"Taking the recycling out", coins:2},
  {id:"hoover", name:"Hoovering properly",       coins:3},
  {id:"glass-tables", name:"Cleaning glass tables", sub:"Properly", coins:2},
  {id:"skirting", name:"Cleaning skirting",      coins:2},
  {id:"try-new", name:"Try new things",          coins:2}
];
const EVERYDAY_SHOP = [
  {id:"tv",         name:"Breakfast TV",      sub:"15 minutes",     coins:1},
  {id:"screentime", name:"Screen Time",       sub:"30 minutes",     coins:1},
  {id:"snack",      name:"Choose a special snack",                  coins:5},
  {id:"movie",      name:"Friday Movie Night", sub:"pick the film", coins:5}
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

/* General hero timer presets (not brushing — no coins) */
const HERO_TIMER_PRESETS = [
  {id:"quick",  name:"Quick race",    secs:60,  icon:"⚡"},
  {id:"ready",  name:"Getting ready", secs:300, icon:"👕"},
  {id:"tidy",   name:"Tidy race",     secs:600, icon:"🧹"},
  {id:"focus",  name:"Focus time",    secs:900, icon:"📚"}
];

const MAX_STACK = 20;

/* Cheapest shop treat the kid cannot afford yet (excludes Mum's Food Tax) */
function nextShopGoal(balance){
  const items = EVERYDAY_SHOP.concat(WEEKEND_SHOP, SAVINGS_SHOP)
    .slice().sort(function(a,b){ return a.coins - b.coins; });
  for(var i = 0; i < items.length; i++){
    if(balance < items[i].coins) return items[i];
  }
  return null;
}

/* Map balance + goal to filled/ghost disc counts for the vault stack */
function coinStackSlots(balance, goal){
  const bal = Math.max(0, balance|0);
  if(!goal){
    return {filled: Math.min(bal, MAX_STACK), ghost: 0};
  }
  const cost = goal.coins;
  if(cost <= MAX_STACK){
    const filled = Math.min(bal, cost);
    return {filled: filled, ghost: Math.max(0, cost - filled)};
  }
  var filled = Math.floor((bal / cost) * MAX_STACK);
  if(bal > 0 && filled < 1) filled = 1;
  if(filled >= MAX_STACK) filled = MAX_STACK - 1;
  return {filled: filled, ghost: MAX_STACK - filled};
}

/* Secret milestone trophies (titles only revealed on unlock / profile) */
const TROPHIES = [
  {id:"kind-5",     name:"Kind Heart",      icon:"💛", check:function(s){ return s.count.kind >= 5; }},
  {id:"kind-15",    name:"Super Helper",    icon:"🌟", check:function(s){ return s.count.kind >= 15; }},
  {id:"brush-10",   name:"Brush Boss",      icon:"🪥", check:function(s){ return s.brushTotal >= 10; }},
  {id:"bed-7",      name:"Bed Maker",       icon:"🛏️", check:function(s){ return s.count.bed >= 7; }},
  {id:"homework-5", name:"Homework Champ",  icon:"📚", check:function(s){ return s.count.homework >= 5; }},
  {id:"tidy-5",     name:"Tidy Titan",      icon:"🧹", check:function(s){ return s.count.tidy >= 5; }},
  {id:"cook-5",     name:"Kitchen Hero",    icon:"👨‍🍳", check:function(s){ return s.count.cook >= 5; }},
  {id:"club-3",     name:"Club Kid",        icon:"⚽", check:function(s){ return s.count.club >= 3; }},
  {id:"earned-50",  name:"Coin Collector",  icon:"🏆", check:function(s){ return s.earned >= 50; }},
  {id:"balance-50", name:"Big Saver",       icon:"🏦", check:function(s){ return s.balance >= 50; }},
  {id:"first-spend",name:"First Treat",     icon:"🎁", check:function(s){ return s.spentCount >= 1; }}
];

/* Usable power-ups — unlocked secretly, activated from the profile */
const POWERUPS = [
  {id:"double-3",    name:"Double Coin Burst", icon:"⚡", effect:"double",
    blurb:"Next 3 earns give double coins!",
    check:function(s){ return s.earned >= 20; }},
  {id:"free-switch", name:"Free Switch Pass",  icon:"🎮", effect:"freeSwitch",
    blurb:"One free Nintendo Switch (15 min)!",
    check:function(s){ return s.switchSpends >= 5 || s.earned >= 30; }},
  {id:"coin-boost",  name:"Coin Drop",         icon:"🪙", effect:"coinDrop",
    blurb:"Tap Use for an instant +5 coins!",
    check:function(s){ return s.count.kind >= 10; }},
  {id:"extra-drop",  name:"Bonus Drop",        icon:"🎯", effect:"playCoinDrop",
    blurb:"Play the coin drop game once — no brushing needed!",
    check:function(s){ return s.brushTotal >= 5; }},
  {id:"coin-blaster", name:"Coin Blaster",     icon:"🚀", effect:"playCoinBlaster",
    blurb:"Blast falling coins with laser beams!",
    check:function(s){ return s.brushTotal >= 12; }}
];

const ALL_REWARDS = TROPHIES.map(function(t){
  return Object.assign({}, t, {type:"trophy"});
}).concat(POWERUPS.map(function(p){
  return Object.assign({}, p, {type:"powerup"});
}));

const REWARD_BY_ID = {};
ALL_REWARDS.forEach(function(r){ REWARD_BY_ID[r.id] = r; });

/* Infer source from older log descriptions that lack a source field */
const DESC_SOURCE = {
  "Brush teeth (Morning)":"brush-am",
  "Brush teeth (Night)":"brush-pm",
  "Make your bed":"bed",
  "Get dressed on time":"dressed",
  "Homework, no fuss":"homework",
  "Sit nicely at the table":"sit",
  "Eat your dinner":"dinner",
  "Calm reading (At bedtime)":"calm-read",
  "Reading words (At bedtime)":"read-words",
  "Going to bed on time":"bedtime",
  "Tidy your room":"tidy",
  "Help cook or set the table":"cook",
  "Go to a club or activity":"club",
  "Be kind & helpful":"kind",
  "Taking the recycling out":"recycling",
  "Hoovering properly":"hoover",
  "Cleaning glass tables (Properly)":"glass-tables",
  "Cleaning skirting":"skirting",
  "Breakfast TV":"tv",
  "Screen Time":"screentime",
  "Choose a special snack":"snack",
  "Friday Movie Night":"movie",
  "Nintendo Switch":"switch15",
  "Mum's Food Tax":"tax",
  "Small toy":"toy-small",
  "Park trip + snack":"park",
  "Stay up later":"late",
  "Day out":"dayout",
  "Bigger toy":"toy-big",
  "Cinema trip":"cinema"
};

const JOB_SOURCES = {
  "brush-am":1,"brush-pm":1,"bed":1,"dressed":1,"homework":1,"sit":1,"dinner":1,
  "calm-read":1,"read-words":1,"bedtime":1,
  "tidy":1,"cook":1,"club":1,"kind":1,
  "recycling":1,"hoover":1,"glass-tables":1,"skirting":1
};

/* ---------- image placeholder component ---------- */
function Slot({src,label,className,style,light,icon}){
  return (
    <div className={"slot "+(src?"has-img ":"")+(light?"light ":"")+(className||"")} style={style}>
      {src ? <img src={src} alt={label}/> :
        <div>
          <div className={"slot-ico"+(icon?" emoji":"")}>{icon||"🖼️"}</div>
          {!icon && <div className="slot-label">{label}</div>}
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

/* ---------- brushing soundtrack (real MP3 + short win jingle) ---------- */
const BRUSH_TRACK = "/audio/brushing.mp3";
function useBrushingTune(){
  const audioRef = useRef(null);
  const ensure = () => {
    if(!audioRef.current){
      const a = new Audio(BRUSH_TRACK);
      a.loop = true;
      a.preload = "auto";
      audioRef.current = a;
    }
    return audioRef.current;
  };
  const start = () => {
    try{
      const a = ensure();
      const play = a.play();
      if(play && typeof play.catch === "function") play.catch(function(){});
    }catch(e){}
  };
  const pause = () => {
    try{ if(audioRef.current) audioRef.current.pause(); }catch(e){}
  };
  const stop = () => {
    try{
      if(audioRef.current){
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }catch(e){}
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
  return {start,pause,stop,fanfare};
}

/* Keep the screen on while any countdown timer is running (Screen Wake Lock API) */
function useScreenWakeLock(active){
  const lockRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(function(){
    let cancelled = false;
    let retryTimer = null;

    function clearRetry(){
      if(retryTimer){
        clearTimeout(retryTimer);
        retryTimer = null;
      }
    }

    async function requestLock(){
      if(cancelled || !activeRef.current) return;
      if(typeof navigator === "undefined" || !navigator.wakeLock || typeof navigator.wakeLock.request !== "function") return;
      if(typeof document !== "undefined" && document.visibilityState !== "visible") return;
      if(lockRef.current) return;
      try{
        const lock = await navigator.wakeLock.request("screen");
        if(cancelled || !activeRef.current){
          try{ await lock.release(); }catch(e){}
          return;
        }
        lockRef.current = lock;
        lock.addEventListener("release", function(){
          if(lockRef.current === lock) lockRef.current = null;
          /* OS can drop the lock on longer timers — reclaim while still counting down */
          if(!cancelled && activeRef.current && document.visibilityState === "visible"){
            clearRetry();
            retryTimer = setTimeout(function(){ requestLock(); }, 400);
          }
        });
      }catch(e){}
    }

    async function releaseLock(){
      clearRetry();
      const lock = lockRef.current;
      lockRef.current = null;
      if(!lock) return;
      try{ await lock.release(); }catch(e){}
    }

    if(active){
      requestLock();
    }else{
      releaseLock();
    }

    function onVisibility(){
      if(document.visibilityState === "visible" && activeRef.current) requestLock();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return function(){
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      releaseLock();
    };
  },[active]);
}

/* ---------- persistence: localStorage cache + shared Supabase project ---------- */
const STORAGE_KEY = "coin-chart-v2";
const DEFAULT_COINS = {sam:0,isaac:0,ben:0};
const DEFAULT_LOG = {sam:[],isaac:[],ben:[]};

function emptyLog(){ return {sam:[],isaac:[],ben:[]}; }
function emptyUnlocks(){ return {sam:[],isaac:[],ben:[]}; }
function defaultBoost(){ return {doubleEarnsLeft:0, freeSwitch:false}; }
function emptyBoosts(){
  return {
    sam: defaultBoost(),
    isaac: defaultBoost(),
    ben: defaultBoost()
  };
}

function normalizeUnlockList(list){
  if(!Array.isArray(list)) return [];
  return list.filter(function(u){ return u && u.id; }).map(function(u){
    return {
      id: u.id,
      type: u.type === "powerup" ? "powerup" : "trophy",
      used: !!u.used,
      at: u.at || u.unlocked_at || new Date().toISOString(),
      remoteId: u.remoteId || null
    };
  });
}

function defaultSettings(){
  return {
    coinDropEnabled:true,
    tiltControlsEnabled:true,
    lastBrushGame:"coinDrop",
    heroTimerSecs:300
  };
}

function normalizeSettings(raw){
  const base = defaultSettings();
  if(!raw || typeof raw !== "object") return base;
  var last = "coinDrop";
  if(raw.lastBrushGame === "coinChase") last = "coinChase";
  else if(raw.lastBrushGame === "mazeDash") last = "mazeDash";
  var heroSecs = parseInt(raw.heroTimerSecs, 10);
  if(!isFinite(heroSecs)) heroSecs = base.heroTimerSecs;
  heroSecs = clamp(heroSecs, 30, 3600);
  return {
    coinDropEnabled: raw.coinDropEnabled !== false,
    tiltControlsEnabled: raw.tiltControlsEnabled !== false,
    lastBrushGame: last,
    heroTimerSecs: heroSecs
  };
}

function nextBrushGame(last){
  if(last === "coinDrop") return "coinChase";
  if(last === "coinChase") return "mazeDash";
  return "coinDrop";
}

function isPracticeBrushSource(source){
  return source === "test-drop" || source === "test-chase" || source === "test-dash" || source === "test-blaster";
}

function normalizePendingReward(raw){
  if(!raw || typeof raw !== "object" || !raw.rewardId || !raw.kidId) return null;
  if(!KIDS[raw.kidId]) return null;
  var game = "coinDrop";
  if(raw.game === "coinChase" || raw.game === "mazeDash" || raw.game === "coinDrop" || raw.game === "coinBlaster"){
    game = raw.game;
  }
  return {
    rewardId: String(raw.rewardId),
    kidId: raw.kidId,
    amount: Math.max(1, Number(raw.amount) || 1),
    description: raw.description || "Brush teeth",
    source: raw.source || "brush-am",
    createdAt: raw.createdAt || new Date().toISOString(),
    awarded: !!raw.awarded,
    game: game
  };
}

function brushGameFromPending(pending){
  if(!pending) return "coinDrop";
  if(pending.game === "coinChase" || pending.game === "mazeDash" || pending.game === "coinDrop" || pending.game === "coinBlaster"){
    return pending.game;
  }
  if(pending.source === "test-chase") return "coinChase";
  if(pending.source === "test-dash") return "mazeDash";
  if(pending.source === "test-blaster" || pending.source === "powerup-coin-blaster") return "coinBlaster";
  return "coinDrop";
}

function makeRewardId(){
  try{
    if(typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"){
      return crypto.randomUUID();
    }
  }catch(e){}
  return "rw-"+Date.now()+"-"+Math.floor(Math.random()*1e9);
}

function clamp(n, lo, hi){
  return Math.max(lo, Math.min(hi, n));
}

function prefersReducedMotion(){
  try{
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }catch(e){ return false; }
}

function playCoinSfx(kind, enabled){
  if(enabled === false) return;
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    if(kind === "whoosh"){
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(420, now);
      o.frequency.exponentialRampToValueAtTime(120, now + 0.28);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.32);
    }else if(kind === "peg"){
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "square"; o.frequency.value = 880 + Math.random() * 120;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.1);
    }else if(kind === "vault"){
      [660, 880, 1046, 1318].forEach(function(f, i){
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        const t = now + i * 0.08;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.3);
      });
    }else if(kind === "side"){
      [520, 660].forEach(function(f, i){
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        const t = now + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.22);
      });
    }
    setTimeout(function(){ try{ ctx.close(); }catch(e){} }, 900);
  }catch(e){}
}

/* Shared Web Audio context for rapid blaster SFX (Android-friendly) */
var _blasterAudioCtx = null;
function blasterAudioCtx(){
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    if(!_blasterAudioCtx || _blasterAudioCtx.state === "closed"){
      _blasterAudioCtx = new AC();
    }
    if(_blasterAudioCtx.state === "suspended"){
      try{ _blasterAudioCtx.resume(); }catch(e){}
    }
    return _blasterAudioCtx;
  }catch(e){ return null; }
}

function playBlasterSfx(kind){
  try{
    const ctx = blasterAudioCtx();
    if(!ctx) return;
    const now = ctx.currentTime;
    if(kind === "laser"){
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(1400 + Math.random() * 200, now);
      o.frequency.exponentialRampToValueAtTime(380, now + 0.09);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.055, now + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.11);
    }else if(kind === "hit"){
      const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain();
      o1.type = "square"; o2.type = "triangle";
      o1.frequency.setValueAtTime(880, now);
      o1.frequency.exponentialRampToValueAtTime(220, now + 0.14);
      o2.frequency.setValueAtTime(1320, now);
      o2.frequency.exponentialRampToValueAtTime(330, now + 0.14);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      o1.connect(g); o2.connect(g); g.connect(ctx.destination);
      o1.start(now); o2.start(now); o1.stop(now + 0.2); o2.stop(now + 0.2);
    }else if(kind === "start"){
      [523, 659, 784, 1046].forEach(function(f, i){
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "square"; o.frequency.value = f;
        const t = now + i * 0.07;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.24);
      });
    }else if(kind === "win"){
      [523, 659, 784, 1046, 1318].forEach(function(f, i){
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        const t = now + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.38);
      });
    }else if(kind === "lose"){
      [392, 349, 294].forEach(function(f, i){
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        const t = now + i * 0.12;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.3);
      });
    }else if(kind === "tick"){
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "square"; o.frequency.value = 980;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.07);
    }
  }catch(e){}
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      return {
        kid:"sam",
        coins:Object.assign({}, DEFAULT_COINS),
        log:emptyLog(),
        unlocks:emptyUnlocks(),
        boosts:emptyBoosts(),
        settings:defaultSettings(),
        pendingReward:null
      };
    }
    const parsed = JSON.parse(raw);
    const boosts = emptyBoosts();
    Object.keys(KIDS).forEach(function(slug){
      const b = (parsed.boosts && parsed.boosts[slug]) || {};
      boosts[slug] = {
        doubleEarnsLeft: Math.max(0, Number(b.doubleEarnsLeft) || 0),
        freeSwitch: !!b.freeSwitch
      };
    });
    return {
      kid: parsed.kid && KIDS[parsed.kid] ? parsed.kid : "sam",
      coins: Object.assign({}, DEFAULT_COINS, parsed.coins||{}),
      log: {
        sam: Array.isArray(parsed.log && parsed.log.sam) ? parsed.log.sam : [],
        isaac: Array.isArray(parsed.log && parsed.log.isaac) ? parsed.log.isaac : [],
        ben: Array.isArray(parsed.log && parsed.log.ben) ? parsed.log.ben : []
      },
      unlocks: {
        sam: normalizeUnlockList(parsed.unlocks && parsed.unlocks.sam),
        isaac: normalizeUnlockList(parsed.unlocks && parsed.unlocks.isaac),
        ben: normalizeUnlockList(parsed.unlocks && parsed.unlocks.ben)
      },
      boosts: boosts,
      settings: normalizeSettings(parsed.settings),
      pendingReward: normalizePendingReward(parsed.pendingReward)
    };
  }catch(e){
    return {
      kid:"sam",
      coins:Object.assign({}, DEFAULT_COINS),
      log:emptyLog(),
      unlocks:emptyUnlocks(),
      boosts:emptyBoosts(),
      settings:defaultSettings(),
      pendingReward:null
    };
  }
}

function getSbConfig(){
  const c = window.COIN_CHART_CONFIG || {};
  return {
    url: String(c.supabaseUrl || "").replace(/\/$/, ""),
    key: String(c.supabaseAnonKey || "")
  };
}
function supabaseReady(){
  const c = getSbConfig();
  return !!(c.url && c.key && typeof fetch === "function");
}
function sbHeaders(extra){
  const c = getSbConfig();
  const h = {
    apikey: c.key,
    Authorization: "Bearer " + c.key,
    "Content-Type": "application/json"
  };
  if(extra) Object.assign(h, extra);
  return h;
}
function sbFetch(path, opts){
  const c = getSbConfig();
  return fetch(c.url + "/rest/v1/" + path, opts).then(function(res){
    if(!res.ok){
      return res.text().then(function(t){
        throw new Error(res.status + " " + (t || res.statusText));
      });
    }
    if(res.status === 204) return null;
    const ct = res.headers.get("content-type") || "";
    if(ct.indexOf("json") >= 0) return res.json();
    return null;
  });
}
function formatWhen(iso){
  try{ return new Date(iso).toLocaleString("en-GB"); }
  catch(e){ return String(iso || ""); }
}
function totalCoins(coins){
  return (coins.sam||0) + (coins.isaac||0) + (coins.ben||0);
}
function logCount(log){
  return (log.sam||[]).length + (log.isaac||[]).length + (log.ben||[]).length;
}
function isLocalId(id){
  return !id || String(id).indexOf("local-") === 0;
}
function hasUnsyncedLog(log){
  return Object.keys(KIDS).some(function(slug){
    return (log[slug]||[]).some(function(e){ return isLocalId(e.id); });
  });
}
function localIsAhead(localCoins, localLog, remoteCoins, remoteLog){
  if(hasUnsyncedLog(localLog)) return true;
  return Object.keys(KIDS).some(function(slug){
    return (localCoins[slug]||0) > (remoteCoins[slug]||0);
  }) || (totalCoins(localCoins) > totalCoins(remoteCoins))
    || (logCount(localLog) > logCount(remoteLog) && totalCoins(localCoins) >= totalCoins(remoteCoins));
}

function entrySource(e){
  if(e && e.source) return e.source;
  if(e && e.desc && DESC_SOURCE[e.desc]) return DESC_SOURCE[e.desc];
  if(e && e.desc && e.desc.indexOf("Nintendo Switch") === 0){
    if(e.desc.indexOf("30") >= 0) return "switch30";
    return "switch15";
  }
  return null;
}

function kidStats(slug, log, coins){
  const entries = (log && log[slug]) || [];
  const count = {};
  let earned = 0;
  let spent = 0;
  let spentCount = 0;
  let jobsDone = 0;
  let brushTotal = 0;
  let switchSpends = 0;

  entries.forEach(function(e){
    const src = entrySource(e);
    if(e.type === "earned"){
      earned += Number(e.amount) || 0;
      if(src && JOB_SOURCES[src]){
        jobsDone += 1;
        count[src] = (count[src] || 0) + 1;
        if(src === "brush-am" || src === "brush-pm") brushTotal += 1;
      }else if(src){
        count[src] = (count[src] || 0) + 1;
      }
    }else if(e.type === "spent"){
      spent += Number(e.amount) || 0;
      spentCount += 1;
      if(src){
        count[src] = (count[src] || 0) + 1;
        if(src === "switch15" || src === "switch30") switchSpends += 1;
      }
    }
  });

  return {
    count: count,
    earned: earned,
    spent: spent,
    spentCount: spentCount,
    jobsDone: jobsDone,
    brushTotal: brushTotal,
    switchSpends: switchSpends,
    balance: (coins && coins[slug]) || 0
  };
}

function findNewUnlocks(slug, log, coins, ownedIds){
  const stats = kidStats(slug, log, coins);
  const fresh = [];
  ALL_REWARDS.forEach(function(reward){
    if(ownedIds[reward.id]) return;
    try{
      if(reward.check(stats)){
        fresh.push({
          id: reward.id,
          type: reward.type,
          used: false,
          at: new Date().toISOString()
        });
      }
    }catch(err){}
  });
  return fresh;
}

/* ---------- Coin Drop mini-game (brushing reward collection) ---------- */
const CD_W = 360;
const CD_H = 520;
const CD_GRAVITY = 0.2;
const CD_AIR = 0.997;
const CD_BOUNCE = 0.82;
const CD_MAX_SPEED = 10;
const CD_TILT = 0.028;
const CD_LANDING_Y = 448;
const CD_MAX_MS = 15000;
const CD_JUMP_VY = -6.2;
const CD_JUMP_COOLDOWN_MS = 380;
const CD_STUCK_SPEED = 0.42;
const CD_STUCK_FRAMES = 28;

const CD_PEGS = [
  {x:90,y:110,r:8},{x:180,y:110,r:8},{x:270,y:110,r:8},
  {x:60,y:165,r:8},{x:135,y:165,r:8},{x:225,y:165,r:8},{x:300,y:165,r:8},
  {x:90,y:220,r:8},{x:180,y:220,r:8},{x:270,y:220,r:8},
  {x:120,y:275,r:8},{x:240,y:275,r:8},
  {x:70,y:330,r:8},{x:180,y:330,r:8},{x:290,y:330,r:8}
];

const CD_BUMPERS = [
  {x1:28,y1:240,x2:130,y2:275,thickness:10},
  {x1:332,y1:240,x2:230,y2:275,thickness:10},
  {x1:50,y1:370,x2:150,y2:400,thickness:9}
];

function cdZoneForX(x){
  if(x < 115) return "left";
  if(x > 245) return "right";
  return "vault";
}

function cdZoneLabel(zone){
  if(zone === "left") return "STILL IN!";
  if(zone === "right") return "COIN SAVED!";
  return "SUPER DROP!";
}

function cdZoneSub(zone){
  if(zone === "vault") return "Banked in the vault — amazing!";
  return "Your coin is safe either way!";
}

function cdZoneCheer(zone){
  if(zone === "vault") return "Well done!";
  return "Coin saved!";
}

function cdZoneIsVault(zone){
  return zone === "vault";
}

function cdThemeForKid(kid){
  const id = kid && kid.id;
  if(id === "sam"){
    return {
      top: "#ff9a3c",
      bottom: "#4a1a00",
      ray: "rgba(255,196,46,0.28)",
      peg: "#ffc42e",
      pegEdge: "#8a5300",
      vault: "#9a3e00",
      vaultStroke: "#ffc42e",
      vaultText: "#fff3b0",
      mover: "#e85d04",
      accent: "#ffc42e",
      badge: "⚡",
      particleA: "#ffc42e",
      particleB: "#fff3b0"
    };
  }
  if(id === "ben"){
    return {
      top: "#ff5b5b",
      bottom: "#3a0008",
      ray: "rgba(255,140,140,0.26)",
      peg: "#ffc42e",
      pegEdge: "#8a5300",
      vault: "#8b0000",
      vaultStroke: "#ffc42e",
      vaultText: "#ffd0d0",
      mover: "#ff3b3b",
      accent: "#ffc42e",
      badge: "✊",
      particleA: "#ffc42e",
      particleB: "#ffb0b0"
    };
  }
  return {
    top: "#5aa9ff",
    bottom: "#04113d",
    ray: "rgba(180,220,255,0.28)",
    peg: "#ffc42e",
    pegEdge: "#8a5300",
    vault: "#0b3d91",
    vaultStroke: "#ffc42e",
    vaultText: "#cfe8ff",
    mover: "#2f7ad1",
    accent: "#ffc42e",
    badge: "⭐",
    particleA: "#ffc42e",
    particleB: "#ffffff"
  };
}

function CoinDropGame(props){
  const kid = props.kid;
  const reward = props.reward;
  const tiltAllowedSetting = props.tiltControlsEnabled !== false;
  const onComplete = props.onComplete;
  const onClose = props.onClose;
  const awardReward = props.awardReward;

  const canvasRef = useRef(null);
  const coinRef = useRef({
    x: CD_W / 2, y: 48, radius: 18,
    vx: 0, vy: 0, rotation: 0, rotationSpeed: 0,
    active: false, landed: false
  });
  const tiltRef = useRef(0);
  const pointerSteerRef = useRef(0);
  const pointerActiveRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const buttonSteerRef = useRef(0);
  const keySteerRef = useRef(0);
  const animationFrameRef = useRef(0);
  const finishedRef = useRef(false);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef(0);
  const particlesRef = useRef([]);
  const moversRef = useRef([
    {x:90,y:300,w:46,h:18,vx:1.1,label:"POW"},
    {x:220,y:355,w:52,h:18,vx:-0.9,label:"ZAP"}
  ]);
  const pegHitCooldownRef = useRef(0);
  const awardResultRef = useRef(null);
  const reducedRef = useRef(prefersReducedMotion());
  const themeRef = useRef(cdThemeForKid(kid));
  const vaultFlashRef = useRef(0);
  const jumpCooldownRef = useRef(0);
  const stuckFramesRef = useRef(0);
  const jumpFlashRef = useRef(0);

  const [gameStage, setGameStage] = useState("ready");
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const tiltEnabledRef = useRef(false);
  const [tiltUnavailable, setTiltUnavailable] = useState(false);
  const [resultText, setResultText] = useState(null);
  const [resultSub, setResultSub] = useState(null);
  const [resultCheer, setResultCheer] = useState(null);
  const [resultVault, setResultVault] = useState(false);
  const [resultAmount, setResultAmount] = useState(null);
  const [boostFlash, setBoostFlash] = useState(false);
  const [jumpReady, setJumpReady] = useState(true);

  themeRef.current = cdThemeForKid(kid);

  const drawBoard = function(ctx, coin, movers, particles, bobY){
    const theme = themeRef.current;
    const g = ctx.createLinearGradient(0, 0, 0, CD_H);
    g.addColorStop(0, theme.top);
    g.addColorStop(1, theme.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CD_W, CD_H);

    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#fff";
    for(var hx = 12; hx < CD_W; hx += 18){
      for(var hy = 12; hy < CD_H - 80; hy += 18){
        ctx.beginPath();
        ctx.arc(hx + ((hy / 18) % 2) * 6, hy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    ctx.strokeStyle = theme.ray;
    ctx.lineWidth = 2;
    for(var ray = -4; ray <= 4; ray++){
      ctx.beginPath();
      ctx.moveTo(CD_W / 2, -20);
      ctx.lineTo(CD_W / 2 + ray * 55, CD_H * 0.55);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, 10, CD_H);
    ctx.fillRect(CD_W - 10, 0, 10, CD_H);

    CD_PEGS.forEach(function(p){
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = theme.peg;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x - 2, p.y - 2, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fill();
    });

    CD_BUMPERS.forEach(function(b){
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.lineWidth = b.thickness;
      ctx.lineCap = "round";
      ctx.strokeStyle = kid.colour || theme.mover;
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.stroke();
    });

    movers.forEach(function(m){
      ctx.fillStyle = theme.mover;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y + m.h / 2);
      ctx.lineTo(m.x + m.w * 0.2, m.y);
      ctx.lineTo(m.x + m.w * 0.8, m.y);
      ctx.lineTo(m.x + m.w, m.y + m.h / 2);
      ctx.lineTo(m.x + m.w * 0.8, m.y + m.h);
      ctx.lineTo(m.x + m.w * 0.2, m.y + m.h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Impact,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(m.label, m.x + m.w / 2, m.y + m.h / 2 + 1);
    });

    const zonesY = CD_H - 62;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(12, zonesY, 95, 50);
    ctx.fillRect(253, zonesY, 95, 50);
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, zonesY, 95, 50);
    ctx.strokeRect(253, zonesY, 95, 50);

    const flash = vaultFlashRef.current > 0;
    ctx.fillStyle = flash ? theme.accent : theme.vault;
    ctx.strokeStyle = theme.vaultStroke;
    ctx.lineWidth = flash ? 6 : 4;
    ctx.fillRect(112, zonesY - 6, 136, 56);
    ctx.strokeRect(112, zonesY - 6, 136, 56);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(112, zonesY - 6, 136, 56);

    ctx.fillStyle = flash ? "#111" : theme.accent;
    ctx.font = "22px Luckiest Guy,Impact,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(theme.badge + " VAULT", CD_W / 2, zonesY + 20);
    ctx.fillStyle = flash ? "#111" : theme.vaultText;
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("BEST DROP", CD_W / 2, zonesY + 40);

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 12px Impact,sans-serif";
    ctx.fillText("IN!", 59, zonesY + 22);
    ctx.fillText("SAFE!", 300, zonesY + 22);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("coin kept", 59, zonesY + 38);
    ctx.fillText("coin kept", 300, zonesY + 38);

    particles.forEach(function(pt){
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    const cy = bobY != null ? bobY : coin.y;
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(coin.x + 3, cy + coin.radius + 4, coin.radius * 0.85, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(coin.x, cy);
    ctx.rotate(coin.rotation);
    const rg = ctx.createRadialGradient(-6, -6, 2, 0, 0, coin.radius);
    rg.addColorStop(0, "#fff3b0");
    rg.addColorStop(0.45, "#ffc42e");
    rg.addColorStop(1, "#c97a00");
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = rg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#8a5300";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = "#b87300";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#8a5300";
    ctx.font = "bold 16px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(theme.badge || "★", 0, 1);
    if(jumpFlashRef.current > 0){
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius + 6 + (8 - jumpFlashRef.current), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255," + (jumpFlashRef.current / 10) + ")";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();
  };

  const finishGame = function(zone){
    if(finishedRef.current) return;
    finishedRef.current = true;
    coinRef.current.landed = true;
    coinRef.current.active = false;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if(timeoutRef.current) clearTimeout(timeoutRef.current);

    const isVault = cdZoneIsVault(zone);
    const theme = themeRef.current;
    setGameStage("landed");
    setResultText(cdZoneLabel(zone));
    setResultSub(cdZoneSub(zone));
    setResultCheer(cdZoneCheer(zone));
    setResultVault(isVault);
    playCoinSfx(isVault ? "vault" : "side", true);
    try{
      if(navigator.vibrate) navigator.vibrate(isVault ? [30, 40, 50, 30] : 30);
    }catch(e){}

    if(isVault) vaultFlashRef.current = 18;

    const burstCount = isVault ? 36 : 14;
    const burstSpeed = isVault ? 9 : 5;
    for(var i = 0; i < burstCount; i++){
      particlesRef.current.push({
        x: coinRef.current.x,
        y: coinRef.current.y,
        vx: (Math.random() - 0.5) * burstSpeed,
        vy: (Math.random() - 0.5) * burstSpeed - (isVault ? 3.5 : 1.5),
        r: 2 + Math.random() * (isVault ? 4.5 : 2.5),
        life: 1,
        color: isVault
          ? (Math.random() > 0.45 ? theme.particleA : theme.particleB)
          : (Math.random() > 0.5 ? theme.particleB : "#fff")
      });
    }

    const celebrateTick = function(){
      if(vaultFlashRef.current > 0) vaultFlashRef.current -= 1;
      particlesRef.current = particlesRef.current.filter(function(pt){
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        return pt.life > 0;
      });
      const canvas = canvasRef.current;
      if(canvas){
        drawBoard(canvas.getContext("2d"), coinRef.current, moversRef.current, particlesRef.current, null);
      }
      if(vaultFlashRef.current > 0 || particlesRef.current.length){
        animationFrameRef.current = requestAnimationFrame(celebrateTick);
      }
    };
    animationFrameRef.current = requestAnimationFrame(celebrateTick);

    Promise.resolve(awardReward(reward)).then(function(result){
      awardResultRef.current = result || null;
      const amt = result && result.amountAwarded != null ? result.amountAwarded : (reward.amount || 1);
      setResultAmount(amt);
      setBoostFlash(!!(result && result.boostApplied));
      setTimeout(function(){
        setGameStage("complete");
      }, isVault ? 800 : 550);
    }).catch(function(){
      setResultAmount(reward.amount || 1);
      setTimeout(function(){
        setGameStage("complete");
      }, isVault ? 800 : 550);
    });
  };

  const reflectCircle = function(coin, cx, cy, rad, kick){
    const dx = coin.x - cx;
    const dy = coin.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const min = coin.radius + rad;
    if(dist >= min) return false;
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = min - dist;
    coin.x += nx * (overlap + 0.4);
    coin.y += ny * (overlap + 0.4);
    const vn = coin.vx * nx + coin.vy * ny;
    if(vn < 0){
      coin.vx -= (1 + CD_BOUNCE) * vn * nx;
      coin.vy -= (1 + CD_BOUNCE) * vn * ny;
    }
    const impulse = kick != null ? kick : 0.85;
    coin.vx += nx * impulse + (Math.random() - 0.5) * 0.7;
    coin.vy += ny * impulse + (Math.random() - 0.35) * 0.45;
    coin.rotationSpeed += (Math.random() - 0.5) * 0.28;
    return true;
  };

  const collideBumper = function(coin, b){
    const dx = b.x2 - b.x1;
    const dy = b.y2 - b.y1;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((coin.x - b.x1) * dx + (coin.y - b.y1) * dy) / len2;
    t = clamp(t, 0, 1);
    const px = b.x1 + t * dx;
    const py = b.y1 + t * dy;
    const ox = coin.x - px;
    const oy = coin.y - py;
    const dist = Math.sqrt(ox * ox + oy * oy) || 0.0001;
    const min = coin.radius + b.thickness * 0.45;
    if(dist >= min) return false;
    const nx = ox / dist;
    const ny = oy / dist;
    coin.x += nx * (min - dist + 0.5);
    coin.y += ny * (min - dist + 0.5);
    const vn = coin.vx * nx + coin.vy * ny;
    if(vn < 0){
      coin.vx -= (1 + CD_BOUNCE) * vn * nx;
      coin.vy -= (1 + CD_BOUNCE) * vn * ny;
    }
    coin.vx += nx * 1.35;
    coin.vy += ny * 1.35 - 0.6;
    coin.rotationSpeed += (Math.random() - 0.5) * 0.25;
    return true;
  };

  const bumpCoin = function(reason){
    const coin = coinRef.current;
    if(!coin.active || coin.landed || finishedRef.current) return false;
    const now = Date.now();
    if(reason === "jump" && now < jumpCooldownRef.current) return false;

    const steer = pointerActiveRef.current
      ? pointerSteerRef.current
      : (buttonSteerRef.current || keySteerRef.current || (tiltEnabledRef.current ? tiltRef.current : 0));

    coin.vy = Math.min(coin.vy, 0) + CD_JUMP_VY;
    coin.vx += steer * 2.4 + (Math.random() - 0.5) * 1.2;
    coin.vx = clamp(coin.vx, -CD_MAX_SPEED, CD_MAX_SPEED);
    coin.vy = clamp(coin.vy, -CD_MAX_SPEED, CD_MAX_SPEED);
    coin.y = Math.max(coin.radius + 8, coin.y - 4);
    coin.rotationSpeed += (Math.random() - 0.5) * 0.4;
    stuckFramesRef.current = 0;
    jumpFlashRef.current = 8;

    if(reason === "jump"){
      jumpCooldownRef.current = now + CD_JUMP_COOLDOWN_MS;
      setJumpReady(false);
      setTimeout(function(){ setJumpReady(true); }, CD_JUMP_COOLDOWN_MS);
      playCoinSfx("whoosh", true);
      try{ if(navigator.vibrate) navigator.vibrate(18); }catch(e){}
    }else{
      playCoinSfx("peg", true);
    }
    return true;
  };

  const tick = function(){
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const coin = coinRef.current;
    const movers = moversRef.current;
    const now = Date.now();

    movers.forEach(function(m){
      m.x += m.vx;
      if(m.x < 20 || m.x + m.w > CD_W - 20) m.vx *= -1;
    });

    let bobY = null;
    if(!coin.active && !coin.landed){
      bobY = coin.y + Math.sin(now / 320) * 4;
    }

    if(jumpFlashRef.current > 0) jumpFlashRef.current -= 1;

    if(coin.active && !coin.landed){
      const steering = pointerActiveRef.current
        ? pointerSteerRef.current
        : (buttonSteerRef.current || keySteerRef.current || (tiltEnabledRef.current ? tiltRef.current : 0));

      coin.vy += CD_GRAVITY;
      coin.vx += steering * CD_TILT * 18;
      coin.vx *= CD_AIR;
      coin.vy *= CD_AIR;
      coin.vx = clamp(coin.vx, -CD_MAX_SPEED, CD_MAX_SPEED);
      coin.vy = clamp(coin.vy, -CD_MAX_SPEED, CD_MAX_SPEED);
      coin.x += coin.vx;
      coin.y += coin.vy;
      coin.rotation += coin.rotationSpeed;
      coin.rotationSpeed *= 0.995;

      if(coin.x - coin.radius < 10){
        coin.x = 10 + coin.radius;
        coin.vx = Math.abs(coin.vx) * CD_BOUNCE + 0.4;
      }
      if(coin.x + coin.radius > CD_W - 10){
        coin.x = CD_W - 10 - coin.radius;
        coin.vx = -Math.abs(coin.vx) * CD_BOUNCE - 0.4;
      }

      var hitPeg = false;
      CD_PEGS.forEach(function(p){
        if(reflectCircle(coin, p.x, p.y, p.r, 0.95)) hitPeg = true;
      });
      if(hitPeg && now - pegHitCooldownRef.current > 100){
        pegHitCooldownRef.current = now;
        if(Math.random() < 0.4) playCoinSfx("peg", true);
      }

      CD_BUMPERS.forEach(function(b){ collideBumper(coin, b); });

      movers.forEach(function(m){
        const cx = m.x + m.w / 2;
        const cy = m.y + m.h / 2;
        reflectCircle(coin, cx, cy, Math.max(m.w, m.h) * 0.45, 1.2);
      });

      const speed = Math.abs(coin.vx) + Math.abs(coin.vy);
      if(speed < CD_STUCK_SPEED){
        stuckFramesRef.current += 1;
        if(stuckFramesRef.current >= CD_STUCK_FRAMES){
          coin.vy = Math.max(coin.vy, 0) + 2.8;
          coin.vx += (Math.random() - 0.5) * 3.2;
          coin.y += 2;
          stuckFramesRef.current = 0;
          playCoinSfx("peg", true);
        }
      }else{
        stuckFramesRef.current = 0;
      }

      if(startTimeRef.current && now - startTimeRef.current > CD_MAX_MS - 1800){
        const targetX = CD_W / 2;
        coin.vx += (targetX - coin.x) * 0.01;
        coin.vy = Math.max(coin.vy, 2.2);
      }

      if(coin.y + coin.radius >= CD_LANDING_Y){
        drawBoard(ctx, coin, movers, particlesRef.current, null);
        finishGame(cdZoneForX(coin.x));
        return;
      }
    }

    particlesRef.current = particlesRef.current.filter(function(pt){
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12;
      pt.life -= 0.03;
      return pt.life > 0;
    });

    drawBoard(ctx, coin, movers, particlesRef.current, bobY);
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const startDrop = function(){
    if(coinRef.current.active || finishedRef.current) return;
    const coin = coinRef.current;
    coin.active = true;
    coin.vy = 1.2;
    coin.vx = (Math.random() - 0.5) * 0.8;
    coin.rotationSpeed = (Math.random() - 0.5) * 0.15;
    startTimeRef.current = Date.now();
    stuckFramesRef.current = 0;
    jumpCooldownRef.current = 0;
    setJumpReady(true);
    setGameStage("dropping");
    playCoinSfx("whoosh", true);

    if(reducedRef.current){
      const start = Date.now();
      const fromY = coin.y;
      const fromX = coin.x;
      const ease = function(){
        if(finishedRef.current) return;
        const t = clamp((Date.now() - start) / 1100, 0, 1);
        const e = t * t * (3 - 2 * t);
        coin.x = fromX + (CD_W / 2 - fromX) * e;
        coin.y = fromY + (CD_LANDING_Y - coin.radius - fromY) * e;
        const canvas = canvasRef.current;
        if(canvas) drawBoard(canvas.getContext("2d"), coin, moversRef.current, particlesRef.current, null);
        if(t >= 1){
          finishGame("vault");
          return;
        }
        animationFrameRef.current = requestAnimationFrame(ease);
      };
      animationFrameRef.current = requestAnimationFrame(ease);
      return;
    }

    timeoutRef.current = setTimeout(function(){
      if(finishedRef.current) return;
      const c = coinRef.current;
      c.x = CD_W / 2;
      c.y = CD_LANDING_Y - c.radius;
      finishGame("vault");
    }, CD_MAX_MS);
  };

  const enableTiltAndStart = function(){
    if(coinRef.current.active || finishedRef.current) return;
    var allowed = false;
    var finish = function(){
      setTiltEnabled(allowed);
      tiltEnabledRef.current = allowed;
      setTiltUnavailable(!allowed);
      startDrop();
    };
    if(tiltAllowedSetting){
      try{
        if(
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ){
          DeviceOrientationEvent.requestPermission().then(function(result){
            allowed = result === "granted";
            finish();
          }).catch(function(){
            allowed = false;
            finish();
          });
          return;
        }
        if(typeof DeviceOrientationEvent !== "undefined"){
          allowed = true;
        }
      }catch(e){
        allowed = false;
      }
    }
    finish();
  };

  useEffect(function(){
    const onOrient = function(e){
      const gamma = Number(e.gamma) || 0;
      tiltRef.current = clamp(gamma / 30, -1, 1);
    };
    if(tiltEnabled){
      window.addEventListener("deviceorientation", onOrient);
    }
    return function(){
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [tiltEnabled]);

  useEffect(function(){
    const onKeyDown = function(e){
      if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A"){
        e.preventDefault();
        keySteerRef.current = -1;
      }else if(e.key === "ArrowRight" || e.key === "d" || e.key === "D"){
        e.preventDefault();
        keySteerRef.current = 1;
      }else if(e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W"){
        e.preventDefault();
        bumpCoin("jump");
      }
    };
    const onKeyUp = function(e){
      if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A" || e.key === "ArrowRight" || e.key === "d" || e.key === "D"){
        keySteerRef.current = 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    animationFrameRef.current = requestAnimationFrame(tick);
    return function(){
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(timeoutRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      buttonSteerRef.current = 0;
      keySteerRef.current = 0;
    };
  }, []);

  const onPointerDown = function(e){
    if(gameStage !== "dropping") return;
    pointerActiveRef.current = true;
    pointerStartXRef.current = e.clientX;
    pointerSteerRef.current = 0;
    try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(err){}
  };
  const onPointerMove = function(e){
    if(!pointerActiveRef.current) return;
    const deltaX = e.clientX - pointerStartXRef.current;
    pointerSteerRef.current = clamp(deltaX / 80, -1, 1);
  };
  const onPointerUp = function(){
    pointerActiveRef.current = false;
    pointerSteerRef.current = 0;
  };

  const handleClose = function(){
    if(finishedRef.current){
      onClose();
      return;
    }
    finishedRef.current = true;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    Promise.resolve(awardReward(reward)).then(function(result){
      onComplete("vault", result || null);
    }).catch(function(){
      onComplete("vault", null);
    });
  };

  const dismissResult = function(){
    onComplete(resultVault ? "vault" : "side", awardResultRef.current);
  };

  const steerHint = tiltUnavailable || !tiltAllowedSetting
    ? "Slide on the board to steer — or tap ◀ ▶"
    : "Slide on the board to steer — tilt works too";

  const isPractice = !!(reward && reward.source === "test-drop");
  const showResult = gameStage === "landed" || gameStage === "complete";
  const theme = cdThemeForKid(kid);

  let headTitle = "Bank your coin!";
  if(reward && reward.source === "powerup-extra-drop") headTitle = "Bonus Drop!";
  else if(isPractice) headTitle = "Test Drop!";
  if(showResult && resultCheer) headTitle = resultCheer;

  const instruct = gameStage === "ready"
    ? "Slide to steer — JUMP if it sticks"
    : gameStage === "complete"
      ? (resultVault ? "Tap Done when you're ready" : "Coin kept — tap Done")
      : (steerHint + " · tap JUMP");

  return (
    <div className="modal coin-drop-modal">
      <div className={"coin-drop-sheet kid-"+kid.id} onClick={function(e){ e.stopPropagation(); }}>
        <div className="coin-drop-head">
          <h2 className="comic">{headTitle}</h2>
          <p className="coin-drop-instructions">{instruct}</p>
          {(tiltUnavailable || !tiltAllowedSetting) && gameStage === "dropping" && (
            <p className="coin-drop-toast">Tilt unavailable · Slide, JUMP, or use the arrows</p>
          )}
        </div>

        <div
          className="coin-drop-board"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <canvas
            ref={canvasRef}
            className="coin-drop-canvas"
            width={CD_W}
            height={CD_H}
            role="img"
            aria-label="Coin drop pinball. Slide to steer, tap JUMP if stuck. You keep your coin either way."
          />
          {gameStage === "ready" && (
            <div className="coin-drop-rules" aria-live="polite" style={{borderColor: theme.accent}}>
              <p className="coin-drop-rules-title" style={{color: theme.accent}}>How to play</p>
              <ol className="coin-drop-rules-list">
                <li><strong>Slide</strong> left or right on the board to steer</li>
                <li>Tap <strong>JUMP</strong> to bump the coin if it gets stuck</li>
                <li>Aim for {kid.name}'s gold <strong>VAULT</strong> — sides still keep your coin</li>
              </ol>
              <div className="coin-drop-slide-hint" aria-hidden="true">
                <span className="coin-drop-finger">👈👉</span>
                <span>Slide · JUMP</span>
              </div>
            </div>
          )}
          {showResult ? (
            <div className={"coin-drop-result" + (resultVault ? " is-vault" : " is-side")}>
              <div className="comic burst-label">{resultText || "SUPER DROP!"}</div>
              {resultSub && <div className="coin-drop-sub">{resultSub}</div>}
              {boostFlash && <div className="coin-drop-boost">2× POWER-UP!</div>}
              {isPractice
                ? <div className="coin-drop-amt coin-drop-practice">Practice — no coins added</div>
                : resultAmount != null && <div className="coin-drop-amt">+{resultAmount} coin{resultAmount === 1 ? "" : "s"}</div>}
            </div>
          ) : null}
        </div>

        {gameStage === "ready" && (
          <button className="btn go coin-drop-start" type="button" onClick={enableTiltAndStart}>
            Drop Coin
          </button>
        )}

        {gameStage === "complete" ? (
          <button className="btn go coin-drop-done" type="button" onClick={dismissResult}>
            {resultVault ? "Awesome — Done!" : "Done"}
          </button>
        ) : (
          <div className="coin-drop-controls">
            <button
              type="button"
              className="coin-drop-arrow"
              aria-label="Steer coin left"
              onPointerDown={function(e){ e.preventDefault(); buttonSteerRef.current = -1; }}
              onPointerUp={function(){ buttonSteerRef.current = 0; }}
              onPointerLeave={function(){ buttonSteerRef.current = 0; }}
              onPointerCancel={function(){ buttonSteerRef.current = 0; }}
            >◀ LEFT</button>
            <button
              type="button"
              className={"coin-drop-jump" + (jumpReady ? "" : " is-cooling")}
              aria-label="Jump bump the coin"
              disabled={gameStage !== "dropping" || !jumpReady}
              onPointerDown={function(e){
                e.preventDefault();
                bumpCoin("jump");
              }}
            >⬆ JUMP</button>
            <button
              type="button"
              className="coin-drop-arrow"
              aria-label="Steer coin right"
              onPointerDown={function(e){ e.preventDefault(); buttonSteerRef.current = 1; }}
              onPointerUp={function(){ buttonSteerRef.current = 0; }}
              onPointerLeave={function(){ buttonSteerRef.current = 0; }}
              onPointerCancel={function(){ buttonSteerRef.current = 0; }}
            >RIGHT ▶</button>
          </div>
        )}

        {gameStage !== "complete" && (
          <button className="btn close" type="button" onClick={handleClose}>Close</button>
        )}
      </div>
    </div>
  );
}

/* ================= COIN CHASE MINI-GAME ================= */
const CC_W = 360;
const CC_H = 420;
const CC_COLS = 11;
const CC_ROWS = 13;
const CC_CELL = 28;
const CC_OX = (CC_W - CC_COLS * CC_CELL) / 2;
const CC_OY = 28;
const CC_SPEED = 2.6;
const CC_TIME_SEC = 35;
const CC_COIN_TARGET = 14;

function ccCellCenter(c, r){
  return {
    x: CC_OX + c * CC_CELL + CC_CELL / 2,
    y: CC_OY + r * CC_CELL + CC_CELL / 2
  };
}

function ccIsWall(maze, c, r){
  if(r < 0 || c < 0 || r >= CC_ROWS || c >= CC_COLS) return true;
  return maze[r][c] === 1;
}

function ccShuffleInPlace(arr){
  for(var i = arr.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function ccReachableCells(maze, startC, startR){
  var seen = {};
  var out = [];
  var q = [{c:startC, r:startR}];
  seen[startC + "," + startR] = true;
  var dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while(q.length){
    var p = q.shift();
    out.push(p);
    for(var k = 0; k < 4; k++){
      var nc = p.c + dirs[k][0];
      var nr = p.r + dirs[k][1];
      if(ccIsWall(maze, nc, nr)) continue;
      var key = nc + "," + nr;
      if(seen[key]) continue;
      seen[key] = true;
      q.push({c:nc, r:nr});
    }
  }
  return out;
}

/* Fresh maze + coin set each play (recursive backtracker + a few loops). */
function ccGenerateLayout(){
  var maze = [];
  var r, c, i;
  for(r = 0; r < CC_ROWS; r++){
    maze[r] = [];
    for(c = 0; c < CC_COLS; c++) maze[r][c] = 1;
  }
  for(r = 1; r < CC_ROWS; r += 2){
    for(c = 1; c < CC_COLS; c += 2) maze[r][c] = 0;
  }

  var startC = 5;
  var startR = 1;
  var stack = [{c:startC, r:startR}];
  var visited = {};
  visited[startC + "," + startR] = true;
  var stepDirs = [[0,-2],[0,2],[-2,0],[2,0]];

  while(stack.length){
    var cur = stack[stack.length - 1];
    var opts = [];
    for(i = 0; i < stepDirs.length; i++){
      var nc = cur.c + stepDirs[i][0];
      var nr = cur.r + stepDirs[i][1];
      if(nr < 1 || nc < 1 || nr >= CC_ROWS - 1 || nc >= CC_COLS - 1) continue;
      if(visited[nc + "," + nr]) continue;
      opts.push({c:nc, r:nr, dc:stepDirs[i][0], dr:stepDirs[i][1]});
    }
    if(!opts.length){
      stack.pop();
      continue;
    }
    ccShuffleInPlace(opts);
    var next = opts[0];
    maze[cur.r + next.dr / 2][cur.c + next.dc / 2] = 0;
    maze[next.r][next.c] = 0;
    visited[next.c + "," + next.r] = true;
    stack.push({c:next.c, r:next.r});
  }

  var extras = 5 + Math.floor(Math.random() * 6);
  for(i = 0; i < extras; i++){
    var er = 2 + Math.floor(Math.random() * (CC_ROWS - 4));
    var ec = 2 + Math.floor(Math.random() * (CC_COLS - 4));
    if(maze[er][ec] !== 1) continue;
    var openN =
      (maze[er - 1][ec] === 0 ? 1 : 0) +
      (maze[er + 1][ec] === 0 ? 1 : 0) +
      (maze[er][ec - 1] === 0 ? 1 : 0) +
      (maze[er][ec + 1] === 0 ? 1 : 0);
    if(openN >= 2) maze[er][ec] = 0;
  }

  var reach = ccReachableCells(maze, startC, startR);
  var candidates = reach.filter(function(p){
    return !(p.c === startC && p.r === startR);
  });
  ccShuffleInPlace(candidates);
  var coinCount = Math.min(CC_COIN_TARGET, candidates.length);
  if(coinCount < 8 && candidates.length >= 8) coinCount = 8;
  var coins = [];
  for(i = 0; i < coinCount; i++){
    coins.push([candidates[i].c, candidates[i].r]);
  }

  return {
    maze: maze,
    start: {c:startC, r:startR},
    coins: coins
  };
}

function CoinChaseGame(props){
  const kid = props.kid;
  const reward = props.reward;
  const onComplete = props.onComplete;
  const onClose = props.onClose;
  const awardReward = props.awardReward;

  const [layout] = useState(function(){ return ccGenerateLayout(); });
  const mazeRef = useRef(layout.maze);

  const canvasRef = useRef(null);
  const playerRef = useRef({
    c: layout.start.c,
    r: layout.start.r,
    x: ccCellCenter(layout.start.c, layout.start.r).x,
    y: ccCellCenter(layout.start.c, layout.start.r).y,
    dir: {dc:0, dr:0},
    nextDir: {dc:0, dr:0}
  });
  const coinsRef = useRef(layout.coins.map(function(pair){
    return {c:pair[0], r:pair[1], taken:false};
  }));
  const animationFrameRef = useRef(0);
  const finishedRef = useRef(false);
  const endDeadlineRef = useRef(0);
  const awardResultRef = useRef(null);
  const reducedRef = useRef(prefersReducedMotion());
  const themeRef = useRef(cdThemeForKid(kid));
  const particlesRef = useRef([]);
  const pointerStartRef = useRef(null);
  const lastShownSecRef = useRef(CC_TIME_SEC);
  const playingRef = useRef(false);

  const [gameStage, setGameStage] = useState("ready");
  const [coinsLeft, setCoinsLeft] = useState(layout.coins.length);
  const [secsLeft, setSecsLeft] = useState(CC_TIME_SEC);
  const [resultWon, setResultWon] = useState(false);
  const [resultText, setResultText] = useState(null);
  const [resultSub, setResultSub] = useState(null);
  const [resultCheer, setResultCheer] = useState(null);
  const [resultAmount, setResultAmount] = useState(null);
  const [boostFlash, setBoostFlash] = useState(false);

  themeRef.current = cdThemeForKid(kid);

  const drawBoard = function(ctx){
    const theme = themeRef.current;
    const player = playerRef.current;
    const coins = coinsRef.current;
    const maze = mazeRef.current;
    const g = ctx.createLinearGradient(0, 0, 0, CC_H);
    g.addColorStop(0, theme.top);
    g.addColorStop(1, theme.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CC_W, CC_H);

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#fff";
    for(var hx = 10; hx < CC_W; hx += 16){
      for(var hy = 10; hy < CC_H; hy += 16){
        ctx.beginPath();
        ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    for(var r = 0; r < CC_ROWS; r++){
      for(var c = 0; c < CC_COLS; c++){
        if(maze[r][c] !== 1) continue;
        const x = CC_OX + c * CC_CELL;
        const y = CC_OY + r * CC_CELL;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x + 1, y + 1, CC_CELL - 2, CC_CELL - 2);
        ctx.strokeStyle = theme.mover;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, CC_CELL - 4, CC_CELL - 4);
      }
    }

    coins.forEach(function(coin){
      if(coin.taken) return;
      const p = ccCellCenter(coin.c, coin.r);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ffc42e";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x - 1.5, p.y - 1.5, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(player.x, player.y, 11, 0, Math.PI * 2);
    ctx.fillStyle = kid.colour || theme.accent;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(player.x - 3.5, player.y - 2.5, 2.2, 0, Math.PI * 2);
    ctx.arc(player.x + 3.5, player.y - 2.5, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();

    particlesRef.current.forEach(function(pt){
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(8, 4, 120, 22);
    ctx.fillRect(CC_W - 128, 4, 120, 22);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Nunito, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🪙 " + coins.filter(function(cn){ return !cn.taken; }).length + " left", 16, 19);
    ctx.textAlign = "right";
    const remain = endDeadlineRef.current
      ? Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000))
      : CC_TIME_SEC;
    ctx.fillText("⏱ " + remain + "s", CC_W - 16, 19);
  };

  const finishGame = function(won){
    if(finishedRef.current) return;
    finishedRef.current = true;
    playingRef.current = false;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const theme = themeRef.current;
    const player = playerRef.current;
    setResultWon(!!won);
    if(won){
      setResultText("ALL COINS!");
      setResultSub("You cleared the maze — amazing!");
      setResultCheer("Coin Chase champ!");
      playCoinSfx("vault", true);
    }else{
      setResultText("TIME'S UP!");
      setResultSub("Your brush coin is safe either way!");
      setResultCheer("Coin saved!");
      playCoinSfx("side", true);
    }

    for(var i = 0; i < (won ? 28 : 12); i++){
      particlesRef.current.push({
        x: player.x,
        y: player.y,
        vx: (Math.random() - 0.5) * (won ? 8 : 4),
        vy: (Math.random() - 0.5) * (won ? 8 : 4) - 2,
        r: 2 + Math.random() * 3,
        life: 1,
        color: Math.random() > 0.5 ? theme.particleA : theme.particleB
      });
    }

    const celebrateTick = function(){
      particlesRef.current = particlesRef.current.filter(function(pt){
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        return pt.life > 0;
      });
      const canvas = canvasRef.current;
      if(canvas) drawBoard(canvas.getContext("2d"));
      if(particlesRef.current.length){
        animationFrameRef.current = requestAnimationFrame(celebrateTick);
      }
    };
    animationFrameRef.current = requestAnimationFrame(celebrateTick);

    Promise.resolve(awardReward(reward)).then(function(result){
      awardResultRef.current = result || null;
      const amt = result && result.amountAwarded != null ? result.amountAwarded : (reward.amount || 1);
      setResultAmount(amt);
      setBoostFlash(!!(result && result.boostApplied));
      setTimeout(function(){ setGameStage("complete"); }, won ? 800 : 550);
    }).catch(function(){
      setResultAmount(reward.amount || 1);
      setTimeout(function(){ setGameStage("complete"); }, won ? 800 : 550);
    });
  };

  const trySetDir = function(dc, dr){
    const player = playerRef.current;
    const maze = mazeRef.current;
    player.nextDir = {dc:dc, dr:dr};
    if(player.dir.dc === 0 && player.dir.dr === 0){
      const nc = player.c + dc;
      const nr = player.r + dr;
      if(!ccIsWall(maze, nc, nr)){
        player.dir = {dc:dc, dr:dr};
      }
    }
  };

  const collectAt = function(c, r){
    var got = false;
    coinsRef.current.forEach(function(coin){
      if(!coin.taken && coin.c === c && coin.r === r){
        coin.taken = true;
        got = true;
      }
    });
    if(got){
      playCoinSfx("peg", true);
      const left = coinsRef.current.filter(function(cn){ return !cn.taken; }).length;
      setCoinsLeft(left);
      if(left <= 0) finishGame(true);
    }
  };

  const tick = function(){
    const canvas = canvasRef.current;
    if(!canvas || finishedRef.current) return;
    const ctx = canvas.getContext("2d");
    const player = playerRef.current;
    const maze = mazeRef.current;

    if(playingRef.current && !reducedRef.current){
      const center = ccCellCenter(player.c, player.r);
      const atCenter = Math.abs(player.x - center.x) < 1.2 && Math.abs(player.y - center.y) < 1.2;

      if(atCenter){
        player.x = center.x;
        player.y = center.y;
        collectAt(player.c, player.r);

        const nd = player.nextDir;
        if(nd.dc || nd.dr){
          if(!ccIsWall(maze, player.c + nd.dc, player.r + nd.dr)){
            player.dir = {dc:nd.dc, dr:nd.dr};
          }
        }
        if(player.dir.dc || player.dir.dr){
          if(ccIsWall(maze, player.c + player.dir.dc, player.r + player.dir.dr)){
            player.dir = {dc:0, dr:0};
          }else{
            player.c += player.dir.dc;
            player.r += player.dir.dr;
          }
        }
      }

      if(player.dir.dc || player.dir.dr){
        const target = ccCellCenter(player.c, player.r);
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if(dist <= CC_SPEED){
          player.x = target.x;
          player.y = target.y;
        }else{
          player.x += (dx / dist) * CC_SPEED;
          player.y += (dy / dist) * CC_SPEED;
        }
      }

      if(endDeadlineRef.current && Date.now() >= endDeadlineRef.current){
        drawBoard(ctx);
        finishGame(false);
        return;
      }
      const remain = Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000));
      if(remain !== lastShownSecRef.current){
        lastShownSecRef.current = remain;
        setSecsLeft(remain);
      }
    }

    particlesRef.current = particlesRef.current.filter(function(pt){
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12;
      pt.life -= 0.03;
      return pt.life > 0;
    });

    drawBoard(ctx);
    if(finishedRef.current) return;
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const startChase = function(){
    if(finishedRef.current || gameStage !== "ready") return;
    endDeadlineRef.current = Date.now() + CC_TIME_SEC * 1000;
    lastShownSecRef.current = CC_TIME_SEC;
    setSecsLeft(CC_TIME_SEC);
    playingRef.current = true;
    setGameStage("playing");
    playCoinSfx("whoosh", true);

    if(reducedRef.current){
      coinsRef.current.forEach(function(c){ c.taken = true; });
      setCoinsLeft(0);
      finishGame(true);
    }
  };

  useEffect(function(){
    const onKeyDown = function(e){
      if(!playingRef.current || finishedRef.current) return;
      if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A"){
        e.preventDefault(); trySetDir(-1, 0);
      }else if(e.key === "ArrowRight" || e.key === "d" || e.key === "D"){
        e.preventDefault(); trySetDir(1, 0);
      }else if(e.key === "ArrowUp" || e.key === "w" || e.key === "W"){
        e.preventDefault(); trySetDir(0, -1);
      }else if(e.key === "ArrowDown" || e.key === "s" || e.key === "S"){
        e.preventDefault(); trySetDir(0, 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    animationFrameRef.current = requestAnimationFrame(tick);
    return function(){
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onPointerDown = function(e){
    if(!playingRef.current) return;
    pointerStartRef.current = {x:e.clientX, y:e.clientY};
    try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(err){}
  };
  const onPointerUp = function(e){
    if(!pointerStartRef.current || !playingRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if(Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if(Math.abs(dx) > Math.abs(dy)) trySetDir(dx > 0 ? 1 : -1, 0);
    else trySetDir(0, dy > 0 ? 1 : -1);
  };

  const handleClose = function(){
    if(finishedRef.current){
      onClose();
      return;
    }
    finishedRef.current = true;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    Promise.resolve(awardReward(reward)).then(function(result){
      onComplete(result || null);
    }).catch(function(){
      onComplete(null);
    });
  };

  const dismissResult = function(){
    onComplete(awardResultRef.current);
  };

  const isPractice = !!(reward && reward.source === "test-chase");
  const showResult = gameStage === "complete";
  const theme = cdThemeForKid(kid);

  let headTitle = "Coin Chase!";
  if(isPractice) headTitle = "Test Chase!";
  if(showResult && resultCheer) headTitle = resultCheer;

  const instruct = gameStage === "ready"
    ? "Collect every coin before time runs out"
    : gameStage === "complete"
      ? (resultWon ? "Tap Done when you're ready" : "Coin kept — tap Done")
      : ("🪙 " + coinsLeft + " left · ⏱ " + secsLeft + "s");

  return (
    <div className="modal coin-drop-modal coin-chase-modal">
      <div className={"coin-drop-sheet coin-chase-sheet kid-"+kid.id} onClick={function(e){ e.stopPropagation(); }}>
        <div className="coin-drop-head">
          <h2 className="comic">{headTitle}</h2>
          <p className="coin-drop-instructions">{instruct}</p>
        </div>

        <div
          className="coin-drop-board coin-chase-board"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={function(){ pointerStartRef.current = null; }}
        >
          <canvas
            ref={canvasRef}
            className="coin-drop-canvas"
            width={CC_W}
            height={CC_H}
            role="img"
            aria-label="Coin chase maze. Swipe or use arrows to collect coins before time runs out."
          />
          {gameStage === "ready" && (
            <div className="coin-drop-rules" aria-live="polite" style={{borderColor: theme.accent}}>
              <p className="coin-drop-rules-title" style={{color: theme.accent}}>How to play</p>
              <ol className="coin-drop-rules-list">
                <li>Use <strong>arrows</strong> or <strong>swipe</strong> to move</li>
                <li>Collect <strong>all the coins</strong> in the maze</li>
                <li>Beat the clock — your brush coin is <strong>always kept</strong></li>
              </ol>
              <div className="coin-drop-slide-hint" aria-hidden="true">
                <span className="coin-drop-finger">👆👇👈👉</span>
                <span>Swipe · Arrows</span>
              </div>
            </div>
          )}
          {showResult ? (
            <div className={"coin-drop-result" + (resultWon ? " is-vault" : " is-side")}>
              <div className="comic burst-label">{resultText || "NICE RUN!"}</div>
              {resultSub && <div className="coin-drop-sub">{resultSub}</div>}
              {boostFlash && <div className="coin-drop-boost">2× POWER-UP!</div>}
              {isPractice
                ? <div className="coin-drop-amt coin-drop-practice">Practice — no coins added</div>
                : resultAmount != null && <div className="coin-drop-amt">+{resultAmount} coin{resultAmount === 1 ? "" : "s"}</div>}
            </div>
          ) : null}
        </div>

        {gameStage === "ready" && (
          <button className="btn go coin-drop-start" type="button" onClick={startChase}>
            Start Chase
          </button>
        )}

        {gameStage === "complete" ? (
          <button className="btn go coin-drop-done" type="button" onClick={dismissResult}>
            {resultWon ? "Awesome — Done!" : "Done"}
          </button>
        ) : (
          <div className="coin-chase-pad">
            <button type="button" className="coin-drop-arrow coin-chase-up" aria-label="Move up"
              onPointerDown={function(e){ e.preventDefault(); trySetDir(0, -1); }}>⬆</button>
            <div className="coin-chase-mid">
              <button type="button" className="coin-drop-arrow" aria-label="Move left"
                onPointerDown={function(e){ e.preventDefault(); trySetDir(-1, 0); }}>◀</button>
              <button type="button" className="coin-drop-arrow" aria-label="Move right"
                onPointerDown={function(e){ e.preventDefault(); trySetDir(1, 0); }}>▶</button>
            </div>
            <button type="button" className="coin-drop-arrow coin-chase-down" aria-label="Move down"
              onPointerDown={function(e){ e.preventDefault(); trySetDir(0, 1); }}>⬇</button>
          </div>
        )}

        {gameStage !== "complete" && (
          <button className="btn close" type="button" onClick={handleClose}>Close</button>
        )}
      </div>
    </div>
  );
}

/* ================= MAZE DASH MINI-GAME ================= */
const MD_W = 360;
const MD_H = 420;
const MD_COLS = 11;
const MD_ROWS = 13;
const MD_CELL = 28;
const MD_OX = (MD_W - MD_COLS * MD_CELL) / 2;
const MD_OY = 28;
const MD_SPEED = 2.8;
const MD_TIME_SEC = 30;
/* 1 = wall, 0 = path. Start top-left path, finish bottom-right. */
const MD_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1]
];
const MD_START = {c:1, r:1};
const MD_FINISH = {c:9, r:11};

function mdCellCenter(c, r){
  return {
    x: MD_OX + c * MD_CELL + MD_CELL / 2,
    y: MD_OY + r * MD_CELL + MD_CELL / 2
  };
}

function mdIsWall(c, r){
  if(r < 0 || c < 0 || r >= MD_ROWS || c >= MD_COLS) return true;
  return MD_MAZE[r][c] === 1;
}

function MazeDashGame(props){
  const kid = props.kid;
  const reward = props.reward;
  const onComplete = props.onComplete;
  const onClose = props.onClose;
  const awardReward = props.awardReward;

  const canvasRef = useRef(null);
  const playerRef = useRef({
    c: MD_START.c,
    r: MD_START.r,
    x: mdCellCenter(MD_START.c, MD_START.r).x,
    y: mdCellCenter(MD_START.c, MD_START.r).y,
    dir: {dc:0, dr:0},
    nextDir: {dc:0, dr:0}
  });
  const animationFrameRef = useRef(0);
  const finishedRef = useRef(false);
  const endDeadlineRef = useRef(0);
  const awardResultRef = useRef(null);
  const reducedRef = useRef(prefersReducedMotion());
  const themeRef = useRef(cdThemeForKid(kid));
  const particlesRef = useRef([]);
  const pointerStartRef = useRef(null);
  const lastShownSecRef = useRef(MD_TIME_SEC);
  const playingRef = useRef(false);

  const [gameStage, setGameStage] = useState("ready");
  const [secsLeft, setSecsLeft] = useState(MD_TIME_SEC);
  const [resultWon, setResultWon] = useState(false);
  const [resultText, setResultText] = useState(null);
  const [resultSub, setResultSub] = useState(null);
  const [resultCheer, setResultCheer] = useState(null);
  const [resultAmount, setResultAmount] = useState(null);
  const [boostFlash, setBoostFlash] = useState(false);

  themeRef.current = cdThemeForKid(kid);

  const drawBoard = function(ctx){
    const theme = themeRef.current;
    const player = playerRef.current;
    const g = ctx.createLinearGradient(0, 0, 0, MD_H);
    g.addColorStop(0, theme.top);
    g.addColorStop(1, theme.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, MD_W, MD_H);

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#fff";
    for(var hx = 10; hx < MD_W; hx += 16){
      for(var hy = 10; hy < MD_H; hy += 16){
        ctx.beginPath();
        ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    for(var r = 0; r < MD_ROWS; r++){
      for(var c = 0; c < MD_COLS; c++){
        if(MD_MAZE[r][c] !== 1) continue;
        const x = MD_OX + c * MD_CELL;
        const y = MD_OY + r * MD_CELL;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x + 1, y + 1, MD_CELL - 2, MD_CELL - 2);
        ctx.strokeStyle = theme.mover;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, MD_CELL - 4, MD_CELL - 4);
      }
    }

    const startP = mdCellCenter(MD_START.c, MD_START.r);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(startP.x, startP.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GO", startP.x, startP.y + 3);

    const finP = mdCellCenter(MD_FINISH.c, MD_FINISH.r);
    const fx = MD_OX + MD_FINISH.c * MD_CELL + 3;
    const fy = MD_OY + MD_FINISH.r * MD_CELL + 3;
    ctx.fillStyle = theme.vault || "#0b3d91";
    ctx.fillRect(fx, fy, MD_CELL - 6, MD_CELL - 6);
    ctx.strokeStyle = theme.vaultStroke || "#ffc42e";
    ctx.lineWidth = 3;
    ctx.strokeRect(fx, fy, MD_CELL - 6, MD_CELL - 6);
    ctx.fillStyle = theme.vaultText || "#ffc42e";
    ctx.font = "bold 8px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("END", finP.x, finP.y + 3);

    ctx.beginPath();
    ctx.arc(player.x, player.y, 11, 0, Math.PI * 2);
    ctx.fillStyle = kid.colour || theme.accent;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(player.x - 3.5, player.y - 2.5, 2.2, 0, Math.PI * 2);
    ctx.arc(player.x + 3.5, player.y - 2.5, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();

    particlesRef.current.forEach(function(pt){
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(MD_W / 2 - 60, 4, 120, 22);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Nunito, sans-serif";
    ctx.textAlign = "center";
    const remain = endDeadlineRef.current
      ? Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000))
      : MD_TIME_SEC;
    ctx.fillText("⏱ " + remain + "s", MD_W / 2, 19);
  };

  const finishGame = function(won){
    if(finishedRef.current) return;
    finishedRef.current = true;
    playingRef.current = false;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const theme = themeRef.current;
    const player = playerRef.current;
    setResultWon(!!won);
    if(won){
      setResultText("MADE IT!");
      setResultSub("You reached the finish — amazing!");
      setResultCheer("Maze Dash champ!");
      playCoinSfx("vault", true);
    }else{
      setResultText("TIME'S UP!");
      setResultSub("Your brush coin is safe either way!");
      setResultCheer("Coin saved!");
      playCoinSfx("side", true);
    }

    for(var i = 0; i < (won ? 28 : 12); i++){
      particlesRef.current.push({
        x: player.x,
        y: player.y,
        vx: (Math.random() - 0.5) * (won ? 8 : 4),
        vy: (Math.random() - 0.5) * (won ? 8 : 4) - 2,
        r: 2 + Math.random() * 3,
        life: 1,
        color: Math.random() > 0.5 ? theme.particleA : theme.particleB
      });
    }

    const celebrateTick = function(){
      particlesRef.current = particlesRef.current.filter(function(pt){
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        return pt.life > 0;
      });
      const canvas = canvasRef.current;
      if(canvas) drawBoard(canvas.getContext("2d"));
      if(particlesRef.current.length){
        animationFrameRef.current = requestAnimationFrame(celebrateTick);
      }
    };
    animationFrameRef.current = requestAnimationFrame(celebrateTick);

    Promise.resolve(awardReward(reward)).then(function(result){
      awardResultRef.current = result || null;
      const amt = result && result.amountAwarded != null ? result.amountAwarded : (reward.amount || 1);
      setResultAmount(amt);
      setBoostFlash(!!(result && result.boostApplied));
      setTimeout(function(){ setGameStage("complete"); }, won ? 800 : 550);
    }).catch(function(){
      setResultAmount(reward.amount || 1);
      setTimeout(function(){ setGameStage("complete"); }, won ? 800 : 550);
    });
  };

  const trySetDir = function(dc, dr){
    const player = playerRef.current;
    player.nextDir = {dc:dc, dr:dr};
    if(player.dir.dc === 0 && player.dir.dr === 0){
      const nc = player.c + dc;
      const nr = player.r + dr;
      if(!mdIsWall(nc, nr)){
        player.dir = {dc:dc, dr:dr};
      }
    }
  };

  const checkFinish = function(c, r){
    if(c === MD_FINISH.c && r === MD_FINISH.r){
      finishGame(true);
    }
  };

  const tick = function(){
    const canvas = canvasRef.current;
    if(!canvas || finishedRef.current) return;
    const ctx = canvas.getContext("2d");
    const player = playerRef.current;

    if(playingRef.current && !reducedRef.current){
      const center = mdCellCenter(player.c, player.r);
      const atCenter = Math.abs(player.x - center.x) < 1.2 && Math.abs(player.y - center.y) < 1.2;

      if(atCenter){
        player.x = center.x;
        player.y = center.y;
        checkFinish(player.c, player.r);
        if(finishedRef.current){
          drawBoard(ctx);
          return;
        }

        const nd = player.nextDir;
        if(nd.dc || nd.dr){
          if(!mdIsWall(player.c + nd.dc, player.r + nd.dr)){
            player.dir = {dc:nd.dc, dr:nd.dr};
          }
        }
        if(player.dir.dc || player.dir.dr){
          if(mdIsWall(player.c + player.dir.dc, player.r + player.dir.dr)){
            player.dir = {dc:0, dr:0};
          }else{
            player.c += player.dir.dc;
            player.r += player.dir.dr;
          }
        }
      }

      if(player.dir.dc || player.dir.dr){
        const target = mdCellCenter(player.c, player.r);
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if(dist <= MD_SPEED){
          player.x = target.x;
          player.y = target.y;
        }else{
          player.x += (dx / dist) * MD_SPEED;
          player.y += (dy / dist) * MD_SPEED;
        }
      }

      if(endDeadlineRef.current && Date.now() >= endDeadlineRef.current){
        drawBoard(ctx);
        finishGame(false);
        return;
      }
      const remain = Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000));
      if(remain !== lastShownSecRef.current){
        lastShownSecRef.current = remain;
        setSecsLeft(remain);
      }
    }

    particlesRef.current = particlesRef.current.filter(function(pt){
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12;
      pt.life -= 0.03;
      return pt.life > 0;
    });

    drawBoard(ctx);
    if(finishedRef.current) return;
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const startDash = function(){
    if(finishedRef.current || gameStage !== "ready") return;
    endDeadlineRef.current = Date.now() + MD_TIME_SEC * 1000;
    lastShownSecRef.current = MD_TIME_SEC;
    setSecsLeft(MD_TIME_SEC);
    playingRef.current = true;
    setGameStage("playing");
    playCoinSfx("whoosh", true);

    if(reducedRef.current){
      const player = playerRef.current;
      player.c = MD_FINISH.c;
      player.r = MD_FINISH.r;
      const p = mdCellCenter(MD_FINISH.c, MD_FINISH.r);
      player.x = p.x;
      player.y = p.y;
      finishGame(true);
    }
  };

  useEffect(function(){
    const onKeyDown = function(e){
      if(!playingRef.current || finishedRef.current) return;
      if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A"){
        e.preventDefault(); trySetDir(-1, 0);
      }else if(e.key === "ArrowRight" || e.key === "d" || e.key === "D"){
        e.preventDefault(); trySetDir(1, 0);
      }else if(e.key === "ArrowUp" || e.key === "w" || e.key === "W"){
        e.preventDefault(); trySetDir(0, -1);
      }else if(e.key === "ArrowDown" || e.key === "s" || e.key === "S"){
        e.preventDefault(); trySetDir(0, 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    animationFrameRef.current = requestAnimationFrame(tick);
    return function(){
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onPointerDown = function(e){
    if(!playingRef.current) return;
    pointerStartRef.current = {x:e.clientX, y:e.clientY};
    try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(err){}
  };
  const onPointerUp = function(e){
    if(!pointerStartRef.current || !playingRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if(Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if(Math.abs(dx) > Math.abs(dy)) trySetDir(dx > 0 ? 1 : -1, 0);
    else trySetDir(0, dy > 0 ? 1 : -1);
  };

  const handleClose = function(){
    if(finishedRef.current){
      onClose();
      return;
    }
    finishedRef.current = true;
    playingRef.current = false;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    Promise.resolve(awardReward(reward)).then(function(result){
      onComplete(result || null);
    }).catch(function(){
      onComplete(null);
    });
  };

  const dismissResult = function(){
    onComplete(awardResultRef.current);
  };

  const isPractice = !!(reward && reward.source === "test-dash");
  const showResult = gameStage === "complete";
  const theme = cdThemeForKid(kid);

  let headTitle = "Maze Dash!";
  if(isPractice) headTitle = "Test Dash!";
  if(showResult && resultCheer) headTitle = resultCheer;

  const instruct = gameStage === "ready"
    ? "Race from GO to END before time runs out"
    : gameStage === "complete"
      ? (resultWon ? "Tap Done when you're ready" : "Coin kept — tap Done")
      : ("⏱ " + secsLeft + "s — reach the gold END");

  return (
    <div className="modal coin-drop-modal maze-dash-modal">
      <div className={"coin-drop-sheet maze-dash-sheet kid-"+kid.id} onClick={function(e){ e.stopPropagation(); }}>
        <div className="coin-drop-head">
          <h2 className="comic">{headTitle}</h2>
          <p className="coin-drop-instructions">{instruct}</p>
        </div>

        <div
          className="coin-drop-board maze-dash-board"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={function(){ pointerStartRef.current = null; }}
        >
          <canvas
            ref={canvasRef}
            className="coin-drop-canvas"
            width={MD_W}
            height={MD_H}
            role="img"
            aria-label="Maze dash. Swipe or use arrows to reach the finish before time runs out."
          />
          {gameStage === "ready" && (
            <div className="coin-drop-rules" aria-live="polite" style={{borderColor: theme.accent}}>
              <p className="coin-drop-rules-title" style={{color: theme.accent}}>How to play</p>
              <ol className="coin-drop-rules-list">
                <li>Use <strong>arrows</strong> or <strong>swipe</strong> to move</li>
                <li>Find the path from <strong>GO</strong> to the gold <strong>END</strong></li>
                <li>Beat the clock — your brush coin is <strong>always kept</strong></li>
              </ol>
              <div className="coin-drop-slide-hint" aria-hidden="true">
                <span className="coin-drop-finger">👆👇👈👉</span>
                <span>Swipe · Arrows</span>
              </div>
            </div>
          )}
          {showResult ? (
            <div className={"coin-drop-result" + (resultWon ? " is-vault" : " is-side")}>
              <div className="comic burst-label">{resultText || "NICE RUN!"}</div>
              {resultSub && <div className="coin-drop-sub">{resultSub}</div>}
              {boostFlash && <div className="coin-drop-boost">2× POWER-UP!</div>}
              {isPractice
                ? <div className="coin-drop-amt coin-drop-practice">Practice — no coins added</div>
                : resultAmount != null && <div className="coin-drop-amt">+{resultAmount} coin{resultAmount === 1 ? "" : "s"}</div>}
            </div>
          ) : null}
        </div>

        {gameStage === "ready" && (
          <button className="btn go coin-drop-start" type="button" onClick={startDash}>
            Start Dash
          </button>
        )}

        {gameStage === "complete" ? (
          <button className="btn go coin-drop-done" type="button" onClick={dismissResult}>
            {resultWon ? "Awesome — Done!" : "Done"}
          </button>
        ) : (
          <div className="coin-chase-pad maze-dash-pad">
            <button type="button" className="coin-drop-arrow coin-chase-up" aria-label="Move up"
              onPointerDown={function(e){ e.preventDefault(); trySetDir(0, -1); }}>⬆</button>
            <div className="coin-chase-mid">
              <button type="button" className="coin-drop-arrow" aria-label="Move left"
                onPointerDown={function(e){ e.preventDefault(); trySetDir(-1, 0); }}>◀</button>
              <button type="button" className="coin-drop-arrow" aria-label="Move right"
                onPointerDown={function(e){ e.preventDefault(); trySetDir(1, 0); }}>▶</button>
            </div>
            <button type="button" className="coin-drop-arrow coin-chase-down" aria-label="Move down"
              onPointerDown={function(e){ e.preventDefault(); trySetDir(0, 1); }}>⬇</button>
          </div>
        )}

        {gameStage !== "complete" && (
          <button className="btn close" type="button" onClick={handleClose}>Close</button>
        )}
      </div>
    </div>
  );
}

/* ================= COIN BLASTER (hero ship) ================= */
const CB_W = 360;
const CB_H = 520;
const CB_TARGET_HITS = 8;
const CB_DURATION_MS = 30000;
const CB_FIRE_MS = 220;
const CB_SHIP_W = 56;
const CB_SHIP_H = 52;
const CB_COIN_R = 15;
const CB_LASER_H = 26;
const CB_LASER_W = 5;
const CB_LASER_SPEED = 12.5;
const CB_SHIP_SPEED = 5.6;
const CB_MAX_PARTICLES = 48;
const CB_MAX_FLOATS = 6;

function cbBuildStars(){
  const stars = [];
  for(var i = 0; i < 42; i++){
    stars.push({
      x: Math.random() * CB_W,
      y: Math.random() * CB_H,
      r: 0.6 + Math.random() * 1.8,
      speed: 0.35 + Math.random() * 1.4,
      a: 0.35 + Math.random() * 0.55
    });
  }
  return stars;
}

function CoinBlasterGame(props){
  const kid = props.kid;
  const reward = props.reward;
  const onComplete = props.onComplete;
  const onClose = props.onClose;
  const awardReward = props.awardReward;
  const theme = cdThemeForKid(kid);
  const heroSrc = (kid && kid.img && IMAGES[kid.img]) || "";

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(0);
  const finishedRef = useRef(false);
  const awardResultRef = useRef(null);
  const stageRef = useRef("ready");
  const shipRef = useRef({x: CB_W / 2, y: CB_H - 56, tilt: 0, thrust: 0});
  const lasersRef = useRef([]);
  const coinsRef = useRef([]);
  const particlesRef = useRef([]);
  const floatsRef = useRef([]);
  const starsRef = useRef(cbBuildStars());
  const hitsRef = useRef(0);
  const startMsRef = useRef(0);
  const lastSpawnMsRef = useRef(0);
  const lastFireMsRef = useRef(0);
  const buttonSteerRef = useRef(0);
  const keySteerRef = useRef(0);
  const fireHeldRef = useRef(false);
  const secsLeftRef = useRef(30);
  const shakeRef = useRef(0);
  const flashRef = useRef(0);
  const reducedRef = useRef(prefersReducedMotion());
  const heroImgRef = useRef(null);
  const heroReadyRef = useRef(false);
  const themeRef = useRef(theme);
  const celebrateRef = useRef(false);

  const [gameStage, setGameStage] = useState("ready");
  const [hudHits, setHudHits] = useState(0);
  const [hudSecs, setHudSecs] = useState(30);
  const [resultWon, setResultWon] = useState(false);
  const [resultAmount, setResultAmount] = useState(null);
  const [boostFlash, setBoostFlash] = useState(false);
  const [firingUi, setFiringUi] = useState(false);
  const closeHandlerRef = useRef(function(){});

  const setFireHeld = function(on){
    fireHeldRef.current = !!on;
    setFiringUi(!!on);
  };

  themeRef.current = theme;

  const setStage = function(next){
    stageRef.current = next;
    setGameStage(next);
  };

  useEffect(function(){
    heroReadyRef.current = false;
    if(!heroSrc){ heroImgRef.current = null; return; }
    const img = new Image();
    img.onload = function(){ heroReadyRef.current = true; };
    img.onerror = function(){ heroReadyRef.current = false; };
    img.src = heroSrc;
    heroImgRef.current = img;
  }, [heroSrc]);

  const spawnBurst = function(x, y, count, colorA, colorB){
    if(reducedRef.current) return;
    var n = Math.min(count, CB_MAX_PARTICLES - particlesRef.current.length);
    for(var i = 0; i < n; i++){
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 4.5;
      particlesRef.current.push({
        x: x, y: y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.2,
        r: 1.5 + Math.random() * 3.2,
        life: 1,
        color: Math.random() > 0.45 ? colorA : colorB
      });
    }
  };

  const pushFloat = function(x, y, text, color){
    if(floatsRef.current.length >= CB_MAX_FLOATS) floatsRef.current.shift();
    floatsRef.current.push({x: x, y: y, text: text, color: color, life: 1});
  };

  const drawShip = function(ctx, ship, t){
    const th = themeRef.current;
    const accent = (kid && kid.colour) || th.accent || "#ffc42e";
    const tilt = ship.tilt || 0;
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(tilt * 0.12);

    /* thruster flame */
    const thrust = 0.65 + (ship.thrust || 0) * 0.55 + Math.sin(t * 0.04) * 0.12;
    const flameH = 14 + thrust * 16;
    const fg = ctx.createLinearGradient(0, 22, 0, 22 + flameH);
    fg.addColorStop(0, "#fff7a8");
    fg.addColorStop(0.35, "#ff9a3c");
    fg.addColorStop(1, "rgba(255,60,0,0)");
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.moveTo(-8, 20);
    ctx.lineTo(0, 22 + flameH);
    ctx.lineTo(8, 20);
    ctx.closePath();
    ctx.fill();

    /* wing / hull */
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(28, 10);
    ctx.lineTo(18, 22);
    ctx.lineTo(-18, 22);
    ctx.lineTo(-28, 10);
    ctx.closePath();
    const hull = ctx.createLinearGradient(0, -28, 0, 24);
    hull.addColorStop(0, "#f4f7ff");
    hull.addColorStop(0.45, accent);
    hull.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = hull;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    /* wing stripes */
    ctx.strokeStyle = "#ffc42e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-22, 8); ctx.lineTo(-10, 18);
    ctx.moveTo(22, 8); ctx.lineTo(10, 18);
    ctx.stroke();

    /* cockpit ring + portrait */
    const pr = 16;
    ctx.beginPath();
    ctx.arc(0, -4, pr + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#04113d";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffc42e";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -4, pr + 3, 0, Math.PI * 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -4, pr, 0, Math.PI * 2);
    ctx.clip();
    if(heroReadyRef.current && heroImgRef.current){
      ctx.drawImage(heroImgRef.current, -pr, -4 - pr, pr * 2, pr * 2);
    }else{
      ctx.fillStyle = accent;
      ctx.fillRect(-pr, -4 - pr, pr * 2, pr * 2);
      ctx.fillStyle = "#fff";
      ctx.font = "18px Luckiest Guy,Impact,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((th.badge || "★"), 0, -3);
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, -4, pr, 0, Math.PI * 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* nose tip */
    ctx.fillStyle = "#ffc42e";
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(5, -20);
    ctx.lineTo(-5, -20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  const drawCoin = function(ctx, coin, badge){
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.rotate(coin.spin || 0);
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.ellipse(2, coin.r + 3, coin.r * 0.85, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.globalAlpha = 1;
    const rg = ctx.createRadialGradient(-5, -5, 2, 0, 0, coin.r);
    rg.addColorStop(0, "#fff3b0");
    rg.addColorStop(0.45, "#ffc42e");
    rg.addColorStop(1, "#c97a00");
    ctx.beginPath();
    ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
    ctx.fillStyle = rg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#8a5300";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, coin.r * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = "#b87300";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#8a5300";
    ctx.font = "bold 15px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badge || "★", 0, 1);
    ctx.restore();
  };

  const drawFrame = function(ctx, now){
    const th = themeRef.current;
    const t = now || performance.now();
    const shake = shakeRef.current;
    ctx.save();
    if(shake > 0){
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }

    const sky = ctx.createLinearGradient(0, 0, 0, CB_H);
    sky.addColorStop(0, th.top || "#1a3fa0");
    sky.addColorStop(0.55, "#071433");
    sky.addColorStop(1, th.bottom || "#020617");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CB_W, CB_H);

    /* nebula wash */
    ctx.fillStyle = "rgba(255,196,46,0.06)";
    ctx.beginPath();
    ctx.arc(CB_W * 0.2, CB_H * 0.25, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(90,169,255,0.08)";
    ctx.beginPath();
    ctx.arc(CB_W * 0.8, CB_H * 0.4, 110, 0, Math.PI * 2);
    ctx.fill();

    starsRef.current.forEach(function(s){
      ctx.globalAlpha = s.a * (0.7 + Math.sin(t * 0.01 + s.x) * 0.3);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    /* distant planet */
    ctx.beginPath();
    ctx.arc(CB_W - 48, 70, 28, 0, Math.PI * 2);
    const pg = ctx.createRadialGradient(CB_W - 56, 62, 4, CB_W - 48, 70, 28);
    pg.addColorStop(0, "#ffe08a");
    pg.addColorStop(1, "rgba(200,120,20,0.15)");
    ctx.fillStyle = pg;
    ctx.fill();

    lasersRef.current.forEach(function(laser){
      const lg = ctx.createLinearGradient(laser.x, laser.y, laser.x, laser.y - CB_LASER_H);
      lg.addColorStop(0, "rgba(0,229,255,0)");
      lg.addColorStop(0.3, "#fff");
      lg.addColorStop(1, "#00e5ff");
      ctx.strokeStyle = lg;
      ctx.lineWidth = CB_LASER_W + 2;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y + 4);
      ctx.lineTo(laser.x, laser.y - CB_LASER_H - 6);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#b8ffff";
      ctx.lineWidth = CB_LASER_W;
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(laser.x, laser.y - CB_LASER_H);
      ctx.stroke();
    });

    const badge = th.badge || "★";
    coinsRef.current.forEach(function(coin){ drawCoin(ctx, coin, badge); });

    particlesRef.current.forEach(function(pt){
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    floatsRef.current.forEach(function(f){
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.fillStyle = f.color;
      ctx.font = "900 16px Luckiest Guy,Impact,sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;

    if(stageRef.current === "playing" || stageRef.current === "ready" || stageRef.current === "won" || stageRef.current === "complete"){
      drawShip(ctx, shipRef.current, t);
    }

    /* HUD panels */
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.strokeStyle = "#ffc42e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(8, 8, 118, 36, 8) : ctx.rect(8, 8, 118, 36);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(CB_W - 96, 8, 88, 36, 8) : ctx.rect(CB_W - 96, 8, 88, 36);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#ffc42e";
    ctx.font = "900 15px Luckiest Guy,Impact,sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("HITS " + hitsRef.current + "/" + CB_TARGET_HITS, 16, 32);
    const secs = Math.max(0, secsLeftRef.current);
    const urgent = secs <= 5;
    ctx.fillStyle = urgent ? "#ff5b5b" : "#fff";
    ctx.textAlign = "right";
    ctx.fillText("0:" + (secs < 10 ? "0" : "") + secs, CB_W - 16, 32);

    /* progress bar */
    const barX = 10, barY = CB_H - 14, barW = CB_W - 20, barH = 6;
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = "#ffc42e";
    ctx.fillRect(barX, barY, barW * Math.min(1, hitsRef.current / CB_TARGET_HITS), barH);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    if(flashRef.current > 0){
      ctx.fillStyle = "rgba(255,243,176," + (flashRef.current * 0.25) + ")";
      ctx.fillRect(0, 0, CB_W, CB_H);
    }

    ctx.restore();
  };

  const endRound = function(won){
    if(finishedRef.current) return;
    finishedRef.current = true;
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = 0;
    setResultWon(!!won);
    if(won){
      playBlasterSfx("win");
      try{ if(navigator.vibrate) navigator.vibrate([30, 40, 50, 30]); }catch(e){}
      celebrateRef.current = true;
      spawnBurst(shipRef.current.x, shipRef.current.y - 20, 28, "#ffc42e", "#fff3b0");
      spawnBurst(CB_W / 2, CB_H / 3, 20, themeRef.current.particleA || "#ffc42e", "#fff");
      setStage("won");
      const canvas = canvasRef.current;
      if(canvas){
        var frames = 0;
        const celebrateTick = function(){
          frames += 1;
          particlesRef.current = particlesRef.current.filter(function(pt){
            pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.12; pt.life -= 0.03;
            return pt.life > 0;
          });
          drawFrame(canvas.getContext("2d"), performance.now());
          if(frames < 36 && particlesRef.current.length){
            animationFrameRef.current = requestAnimationFrame(celebrateTick);
          }
        };
        animationFrameRef.current = requestAnimationFrame(celebrateTick);
      }
      Promise.resolve(awardReward(reward)).then(function(result){
        awardResultRef.current = result || null;
        const amt = result && result.amountAwarded != null ? result.amountAwarded : (reward.amount || 1);
        setResultAmount(amt);
        setBoostFlash(!!(result && result.boostApplied));
        setStage("complete");
      }).catch(function(){
        setResultAmount(reward.amount || 1);
        setStage("complete");
      });
    }else{
      playBlasterSfx("lose");
      setResultAmount(null);
      setStage("complete");
    }
  };

  const tryFire = function(now){
    if(now - lastFireMsRef.current < CB_FIRE_MS) return;
    lastFireMsRef.current = now;
    const ship = shipRef.current;
    lasersRef.current.push({
      x: ship.x,
      y: ship.y - 30
    });
    ship.thrust = 1;
    playBlasterSfx("laser");
    if(!reducedRef.current){
      particlesRef.current.push({
        x: ship.x, y: ship.y + 18,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.5 + Math.random(),
        r: 2 + Math.random() * 2,
        life: 0.7,
        color: "#ff9a3c"
      });
      if(particlesRef.current.length > CB_MAX_PARTICLES){
        particlesRef.current.splice(0, particlesRef.current.length - CB_MAX_PARTICLES);
      }
    }
  };

  const spawnRatePerSec = function(elapsedMs){
    const t = Math.min(1, elapsedMs / 20000);
    return 1 + t * 1.75;
  };

  const coinFallSpeed = function(elapsedMs){
    return 1.6 + Math.min(2.2, (elapsedMs / 30000) * 2.2);
  };

  useEffect(function(){
    if(gameStage !== "playing") return;

    const tick = function(now){
      if(stageRef.current !== "playing" || finishedRef.current) return;
      const elapsed = now - startMsRef.current;
      const leftMs = CB_DURATION_MS - elapsed;
      const secs = Math.ceil(Math.max(0, leftMs) / 1000);
      if(secs !== secsLeftRef.current){
        secsLeftRef.current = secs;
        setHudSecs(secs);
        if(secs > 0 && secs <= 5) playBlasterSfx("tick");
      }

      if(leftMs <= 0){
        endRound(false);
        const canvas = canvasRef.current;
        if(canvas) drawFrame(canvas.getContext("2d"), now);
        return;
      }

      const steer = clamp(buttonSteerRef.current + keySteerRef.current, -1, 1);
      const ship = shipRef.current;
      ship.x = clamp(ship.x + steer * CB_SHIP_SPEED, CB_SHIP_W / 2 + 6, CB_W - CB_SHIP_W / 2 - 6);
      ship.tilt += (steer - ship.tilt) * 0.25;
      ship.thrust *= 0.85;

      starsRef.current.forEach(function(s){
        s.y += s.speed * (1 + elapsed / 40000);
        if(s.y > CB_H){ s.y = -2; s.x = Math.random() * CB_W; }
      });

      if(fireHeldRef.current) tryFire(now);

      const rate = spawnRatePerSec(elapsed);
      const spawnEvery = 1000 / rate;
      if(now - lastSpawnMsRef.current >= spawnEvery){
        lastSpawnMsRef.current = now;
        coinsRef.current.push({
          x: CB_COIN_R + 10 + Math.random() * (CB_W - CB_COIN_R * 2 - 20),
          y: -CB_COIN_R,
          r: CB_COIN_R,
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.12
        });
      }

      const fall = coinFallSpeed(elapsed);
      coinsRef.current = coinsRef.current.filter(function(coin){
        coin.y += fall;
        coin.spin += coin.spinSpeed || 0;
        return coin.y - coin.r < CB_H + 4;
      });

      lasersRef.current = lasersRef.current.filter(function(laser){
        laser.y -= CB_LASER_SPEED;
        return laser.y + CB_LASER_H > 0;
      });

      particlesRef.current = particlesRef.current.filter(function(pt){
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.08; pt.life -= 0.035;
        return pt.life > 0;
      });
      floatsRef.current = floatsRef.current.filter(function(f){
        f.y -= 0.9; f.life -= 0.025;
        return f.life > 0;
      });
      if(shakeRef.current > 0) shakeRef.current *= 0.85;
      if(flashRef.current > 0) flashRef.current -= 0.08;

      const lasers = lasersRef.current;
      const coins = coinsRef.current;
      for(var li = lasers.length - 1; li >= 0; li--){
        const laser = lasers[li];
        const lx = laser.x;
        const ly1 = laser.y - CB_LASER_H;
        const ly2 = laser.y;
        for(var ci = coins.length - 1; ci >= 0; ci--){
          const coin = coins[ci];
          if(Math.abs(lx - coin.x) > coin.r + CB_LASER_W) continue;
          if(ly2 < coin.y - coin.r || ly1 > coin.y + coin.r) continue;
          const hx = coin.x, hy = coin.y;
          coins.splice(ci, 1);
          lasers.splice(li, 1);
          hitsRef.current += 1;
          setHudHits(hitsRef.current);
          playBlasterSfx("hit");
          try{ if(navigator.vibrate) navigator.vibrate(18); }catch(e){}
          shakeRef.current = 5;
          flashRef.current = 1;
          spawnBurst(hx, hy, 12, "#ffc42e", "#fff3b0");
          const cheers = ["POW!", "ZAP!", "BOOM!", "NICE!", "YES!"];
          pushFloat(hx, hy - 8, cheers[Math.min(cheers.length - 1, hitsRef.current - 1)] || "POW!", "#ffc42e");
          if(hitsRef.current >= CB_TARGET_HITS){
            endRound(true);
            const canvasWin = canvasRef.current;
            if(canvasWin) drawFrame(canvasWin.getContext("2d"), now);
            return;
          }
          break;
        }
      }

      const canvas = canvasRef.current;
      if(canvas) drawFrame(canvas.getContext("2d"), now);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return function(){
      if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStage]);

  useEffect(function(){
    const canvas = canvasRef.current;
    if(canvas) drawFrame(canvas.getContext("2d"), performance.now());

    const onKeyDown = function(e){
      if(e.key === "Escape"){
        e.preventDefault();
        closeHandlerRef.current();
        return;
      }
      if(stageRef.current !== "playing") return;
      if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A"){
        e.preventDefault();
        keySteerRef.current = -1;
      }else if(e.key === "ArrowRight" || e.key === "d" || e.key === "D"){
        e.preventDefault();
        keySteerRef.current = 1;
      }else if(e.key === " " || e.code === "Space"){
        e.preventDefault();
        fireHeldRef.current = true;
        setFiringUi(true);
      }
    };
    const onKeyUp = function(e){
      if(e.key === "ArrowLeft" || e.key === "a" || e.key === "A"){
        if(keySteerRef.current < 0) keySteerRef.current = 0;
      }else if(e.key === "ArrowRight" || e.key === "d" || e.key === "D"){
        if(keySteerRef.current > 0) keySteerRef.current = 0;
      }else if(e.key === " " || e.code === "Space"){
        fireHeldRef.current = false;
        setFiringUi(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return function(){
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  /* idle preview bob on ready screen */
  useEffect(function(){
    if(gameStage !== "ready") return;
    var alive = true;
    const tick = function(now){
      if(!alive || stageRef.current !== "ready") return;
      const ship = shipRef.current;
      ship.y = CB_H - 56 + Math.sin(now / 350) * 3;
      ship.tilt = Math.sin(now / 500) * 0.35;
      ship.thrust = 0.5 + Math.sin(now / 180) * 0.25;
      starsRef.current.forEach(function(s){
        s.y += s.speed * 0.4;
        if(s.y > CB_H){ s.y = -2; s.x = Math.random() * CB_W; }
      });
      const canvas = canvasRef.current;
      if(canvas) drawFrame(canvas.getContext("2d"), now);
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
    return function(){
      alive = false;
      if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStage]);

  const startGame = function(){
    if(stageRef.current !== "ready") return;
    blasterAudioCtx();
    playBlasterSfx("start");
    finishedRef.current = false;
    celebrateRef.current = false;
    hitsRef.current = 0;
    lasersRef.current = [];
    coinsRef.current = [];
    particlesRef.current = [];
    floatsRef.current = [];
    starsRef.current = cbBuildStars();
    shipRef.current = {x: CB_W / 2, y: CB_H - 56, tilt: 0, thrust: 0};
    secsLeftRef.current = 30;
    shakeRef.current = 0;
    flashRef.current = 0;
    setHudHits(0);
    setHudSecs(30);
    setResultAmount(null);
    setResultWon(false);
    setBoostFlash(false);
    const now = performance.now();
    startMsRef.current = now;
    lastSpawnMsRef.current = now;
    lastFireMsRef.current = 0;
    setStage("playing");
  };

  const handleClose = function(){
    if(stageRef.current === "complete" || stageRef.current === "won"){
      onClose();
      return;
    }
    finishedRef.current = true;
    stageRef.current = "lost";
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = 0;
    onClose();
  };
  closeHandlerRef.current = handleClose;

  const dismissResult = function(){
    onComplete();
  };

  const isPractice = !!(reward && reward.source === "test-blaster");
  const showResult = gameStage === "complete" || gameStage === "won";
  const kidName = (kid && kid.name) || "Hero";

  let headTitle = "🚀 Hero Blaster!";
  if(isPractice) headTitle = "Test Flight!";
  if(showResult){
    headTitle = resultWon ? "MISSION CLEAR!" : "Almost, hero!";
  }

  const instruct = gameStage === "ready"
    ? kidName + " — blast " + CB_TARGET_HITS + " coins from the sky!"
    : showResult
      ? (resultWon ? "Legendary — tap Done when ready" : "No coins this run — tap Done")
      : "Steer your ship · hold FIRE for lasers";

  return (
    <div className="modal coin-drop-modal coin-blaster-modal">
      <div className={"coin-drop-sheet coin-blaster-sheet kid-"+(kid && kid.id)} onClick={function(e){ e.stopPropagation(); }}>
        <div className="coin-drop-head">
          <h2 className="comic">{headTitle}</h2>
          <p className="coin-drop-instructions">{instruct}</p>
        </div>

        <div className="coin-drop-board coin-blaster-board">
          <canvas
            ref={canvasRef}
            className="coin-drop-canvas"
            width={CB_W}
            height={CB_H}
            role="img"
            aria-label={"Hero Blaster. "+kidName+" ship. Hits "+hudHits+" of "+CB_TARGET_HITS+". "+hudSecs+" seconds left."}
          />
          {gameStage === "ready" && (
            <div className="coin-drop-rules coin-blaster-rules" aria-live="polite" style={{borderColor: theme.accent}}>
              <p className="coin-drop-rules-title" style={{color: theme.accent}}>Hero mission</p>
              <ol className="coin-drop-rules-list">
                <li>Pilot <strong>{kidName}</strong>&apos;s spaceship with ◀ ▶</li>
                <li>Hold <strong>FIRE</strong> (or Space) for laser beams</li>
                <li>Blast <strong>{CB_TARGET_HITS} coins</strong> before the clock hits zero</li>
              </ol>
              <div className="coin-drop-slide-hint" aria-hidden="true">
                <span className="coin-drop-finger">🚀</span>
                <span>Launch when ready</span>
              </div>
            </div>
          )}
          {showResult ? (
            <div className={"coin-drop-result" + (resultWon ? " is-vault" : " is-side")}>
              <div className="comic burst-label">{resultWon ? "MISSION CLEAR!" : "Almost!"}</div>
              {resultWon && <div className="coin-drop-sub">Hero flight complete</div>}
              {boostFlash && <div className="coin-drop-boost">2× POWER-UP!</div>}
              {resultWon && isPractice
                ? <div className="coin-drop-amt coin-drop-practice">Practice — no coins added</div>
                : resultWon && resultAmount != null && (
                  <div className="coin-drop-amt">+{resultAmount} coin{resultAmount === 1 ? "" : "s"}</div>
                )}
              {!resultWon && <div className="coin-drop-sub">Need {CB_TARGET_HITS} hits — try again next time</div>}
            </div>
          ) : null}
        </div>

        {gameStage === "ready" && (
          <button className="btn go coin-drop-start coin-blaster-start" type="button" onClick={startGame}>
            🚀 Launch!
          </button>
        )}

        {gameStage === "complete" ? (
          <button className="btn go coin-drop-done" type="button" onClick={dismissResult}>
            {resultWon ? "Awesome — Done!" : "Done"}
          </button>
        ) : gameStage === "won" ? (
          <button className="btn go coin-drop-done" type="button" disabled>
            Banking…
          </button>
        ) : (
          <div className="coin-drop-controls">
            <button
              type="button"
              className="coin-drop-arrow"
              aria-label="Steer left"
              onPointerDown={function(e){ e.preventDefault(); buttonSteerRef.current = -1; }}
              onPointerUp={function(){ buttonSteerRef.current = 0; }}
              onPointerLeave={function(){ buttonSteerRef.current = 0; }}
              onPointerCancel={function(){ buttonSteerRef.current = 0; }}
            >◀ LEFT</button>
            <button
              type="button"
              className={"coin-drop-jump coin-blaster-fire" + (firingUi ? " is-firing" : "")}
              aria-label="Fire lasers"
              onPointerDown={function(e){ e.preventDefault(); setFireHeld(true); }}
              onPointerUp={function(){ setFireHeld(false); }}
              onPointerLeave={function(){ setFireHeld(false); }}
              onPointerCancel={function(){ setFireHeld(false); }}
            >⚡ FIRE</button>
            <button
              type="button"
              className="coin-drop-arrow"
              aria-label="Steer right"
              onPointerDown={function(e){ e.preventDefault(); buttonSteerRef.current = 1; }}
              onPointerUp={function(){ buttonSteerRef.current = 0; }}
              onPointerLeave={function(){ buttonSteerRef.current = 0; }}
              onPointerCancel={function(){ buttonSteerRef.current = 0; }}
            >RIGHT ▶</button>
          </div>
        )}

        {gameStage !== "complete" && gameStage !== "won" && (
          <button className="btn close" type="button" onClick={handleClose}>Close</button>
        )}
      </div>
    </div>
  );
}

/* ================= APP ================= */
function App(){
  const initial = useMemo(function(){ return loadState(); },[]);
  const [kid,setKid] = useState(initial.kid);
  const [coins,setCoins] = useState(initial.coins);
  const [log,setLog] = useState(initial.log);
  const [unlocks,setUnlocks] = useState(initial.unlocks);
  const [boosts,setBoosts] = useState(initial.boosts);
  const [settings,setSettings] = useState(initial.settings || defaultSettings());
  const [pendingReward,setPendingReward] = useState(initial.pendingReward || null);
  const [modal,setModal] = useState(null); // vault | timer | heroTimer | brushWheel | history | settings | profile | unlock | coinDrop | coinChase | mazeDash | coinBlaster
  const [unlockQueue,setUnlockQueue] = useState([]);
  const unlockQueueRef = useRef([]);
  const [timerJob,setTimerJob] = useState(null);
  const [secs,setSecs] = useState(120);
  const [running,setRunning] = useState(false);
  const [done,setDone] = useState(false);
  const [heroSecs,setHeroSecs] = useState(initial.settings && initial.settings.heroTimerSecs || 300);
  const [heroTotal,setHeroTotal] = useState(initial.settings && initial.settings.heroTimerSecs || 300);
  const [heroRunning,setHeroRunning] = useState(false);
  const [heroDone,setHeroDone] = useState(false);
  const [heroLabel,setHeroLabel] = useState("Hero Timer");
  const [wheelRot,setWheelRot] = useState(0);
  const [wheelSpinning,setWheelSpinning] = useState(false);
  const [wheelWinner,setWheelWinner] = useState(null);
  const [toast,setToast] = useState(null);
  const [cloud,setCloud] = useState(supabaseReady() ? "syncing" : "local");
  const [focusedRow,setFocusedRow] = useState(null);
  const canvasRef = useRef(null);
  const kidIdsRef = useRef({});
  const hydratedRef = useRef(false);
  const syncReadyRef = useRef(false);
  const pendingSyncRef = useRef([]);
  const coinsRef = useRef(initial.coins);
  const logRef = useRef(initial.log);
  const unlocksRef = useRef(initial.unlocks);
  const boostsRef = useRef(initial.boosts);
  const pendingRewardRef = useRef(initial.pendingReward || null);
  const awardedRewardIdsRef = useRef({});
  const timerCompletedRef = useRef(false);
  const heroTimerCompletedRef = useRef(false);
  const wheelRotRef = useRef(0);
  const wheelWinnerIdxRef = useRef(null);
  const deferUnlockModalRef = useRef(false);
  const recoveryDoneRef = useRef(false);
  const tune = useBrushingTune();
  useScreenWakeLock(running || heroRunning);

  useEffect(function(){
    coinsRef.current = coins;
    logRef.current = log;
    unlocksRef.current = unlocks;
    boostsRef.current = boosts;
    pendingRewardRef.current = pendingReward;
  },[coins,log,unlocks,boosts,pendingReward]);

  useEffect(function(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        kid:kid, coins:coins, log:log, unlocks:unlocks, boosts:boosts,
        settings:settings, pendingReward:pendingReward
      }));
    }catch(e){}
  },[kid,coins,log,unlocks,boosts,settings,pendingReward]);

  useEffect(function(){
    if(!supabaseReady() || hydratedRef.current) return;
    hydratedRef.current = true;

    Promise.all([
      sbFetch(
        "coin_kids?select=id,slug,balance,double_earns_left,free_switch&order=sort_order.asc",
        {headers: sbHeaders()}
      ).catch(function(){
        return sbFetch("coin_kids?select=id,slug,balance&order=sort_order.asc", {headers: sbHeaders()});
      }),
      sbFetch(
        "coin_transactions?select=id,kid_id,entry_type,amount,description,source,reward_id,created_at&order=created_at.desc",
        {headers: sbHeaders()}
      ).catch(function(){
        return sbFetch(
          "coin_transactions?select=id,kid_id,entry_type,amount,description,source,created_at&order=created_at.desc",
          {headers: sbHeaders()}
        ).catch(function(){
          return sbFetch(
            "coin_transactions?select=id,kid_id,entry_type,amount,description,created_at&order=created_at.desc",
            {headers: sbHeaders()}
          );
        });
      }),
      sbFetch(
        "coin_unlocks?select=id,kid_id,unlock_id,unlock_type,used,unlocked_at&order=unlocked_at.asc",
        {headers: sbHeaders()}
      ).catch(function(){ return []; })
    ]).then(function(results){
      const kids = results[0] || [];
      const txs = results[1] || [];
      const remoteUnlockRows = results[2] || [];
      const ids = {};
      const remoteCoins = Object.assign({}, DEFAULT_COINS);
      const remoteBoosts = emptyBoosts();
      kids.forEach(function(row){
        if(KIDS[row.slug]){
          ids[row.slug] = row.id;
          remoteCoins[row.slug] = Number(row.balance) || 0;
          remoteBoosts[row.slug] = {
            doubleEarnsLeft: Math.max(0, Number(row.double_earns_left) || 0),
            freeSwitch: !!row.free_switch
          };
        }
      });
      kidIdsRef.current = ids;

      const idToSlug = {};
      Object.keys(ids).forEach(function(slug){ idToSlug[ids[slug]] = slug; });

      const remoteLog = emptyLog();
      txs.forEach(function(tx){
        const slug = idToSlug[tx.kid_id];
        if(!slug) return;
        remoteLog[slug].push({
          id: tx.id,
          type: tx.entry_type,
          amount: Number(tx.amount) || 0,
          desc: tx.description,
          source: tx.source || null,
          rewardId: tx.reward_id || null,
          when: formatWhen(tx.created_at)
        });
      });

      const remoteUnlocks = emptyUnlocks();
      remoteUnlockRows.forEach(function(row){
        const slug = idToSlug[row.kid_id];
        if(!slug) return;
        remoteUnlocks[slug].push({
          id: row.unlock_id,
          type: row.unlock_type === "powerup" ? "powerup" : "trophy",
          used: !!row.used,
          at: row.unlocked_at || new Date().toISOString(),
          remoteId: row.id
        });
      });

      const liveCoins = Object.assign({}, DEFAULT_COINS, coinsRef.current || {});
      const liveLog = {
        sam: (logRef.current && logRef.current.sam) || [],
        isaac: (logRef.current && logRef.current.isaac) || [],
        ben: (logRef.current && logRef.current.ben) || []
      };
      const liveUnlocks = unlocksRef.current || emptyUnlocks();
      const liveBoosts = boostsRef.current || emptyBoosts();
      const remoteEmpty = totalCoins(remoteCoins) === 0 && logCount(remoteLog) === 0;
      const localHasData = totalCoins(liveCoins) > 0 || logCount(liveLog) > 0;
      const preferLocal = (remoteEmpty && localHasData) || localIsAhead(liveCoins, liveLog, remoteCoins, remoteLog);

      if(preferLocal && Object.keys(ids).length){
        return pushLocalToCloud(liveCoins, liveLog, ids, remoteLog, liveUnlocks, liveBoosts).then(function(result){
          const mappedLog = result && result.log ? result.log : (result || liveLog);
          const tempIdMap = (result && result.tempIdMap) || {};
          const mappedUnlocks = (result && result.unlocks) || liveUnlocks;

          const latestCoins = Object.assign({}, DEFAULT_COINS, coinsRef.current || liveCoins);
          setLog(function(current){
            const out = emptyLog();
            Object.keys(KIDS).forEach(function(slug){
              out[slug] = (current[slug] || []).map(function(e){
                const mapped = tempIdMap[e.id];
                return mapped ? Object.assign({}, e, mapped) : e;
              });
            });
            if(logCount(out) === 0 && logCount(mappedLog) > 0) return mappedLog;
            logRef.current = out;
            return out;
          });
          coinsRef.current = latestCoins;
          setCoins(latestCoins);
          unlocksRef.current = mappedUnlocks;
          setUnlocks(mappedUnlocks);
          boostsRef.current = liveBoosts;
          setBoosts(liveBoosts);

          pendingSyncRef.current = pendingSyncRef.current.filter(function(job){
            return !(job.kind === "insert" && tempIdMap[job.tempId]);
          });
          syncReadyRef.current = true;

          const balTasks = Object.keys(KIDS).map(function(slug){
            return runSyncJob({
              kind:"balance",
              slug:slug,
              balance: latestCoins[slug] || 0,
              boosts: liveBoosts[slug]
            });
          });
          return Promise.all(balTasks)
            .then(function(){ return flushPendingSync(); })
            .then(function(){ setCloud("online"); });
        });
      }

      pendingSyncRef.current = [];
      coinsRef.current = remoteCoins;
      logRef.current = remoteLog;
      unlocksRef.current = remoteUnlocks;
      boostsRef.current = remoteBoosts;
      setCoins(remoteCoins);
      setLog(remoteLog);
      setUnlocks(remoteUnlocks);
      setBoosts(remoteBoosts);
      syncReadyRef.current = true;
      setCloud("online");
    }).catch(function(){
      setCloud("offline");
    });
  },[]);

  function pushLocalToCloud(localCoins, localLog, ids, remoteLog, localUnlocks, localBoosts){
    const patches = Object.keys(KIDS).map(function(slug){
      if(!ids[slug]) return Promise.resolve();
      const b = (localBoosts && localBoosts[slug]) || defaultBoost();
      return sbFetch("coin_kids?slug=eq."+encodeURIComponent(slug), {
        method: "PATCH",
        headers: sbHeaders({"Prefer":"return=minimal"}),
        body: JSON.stringify({
          balance: localCoins[slug] || 0,
          double_earns_left: b.doubleEarnsLeft || 0,
          free_switch: !!b.freeSwitch,
          updated_at: new Date().toISOString()
        })
      }).catch(function(){
        return sbFetch("coin_kids?slug=eq."+encodeURIComponent(slug), {
          method: "PATCH",
          headers: sbHeaders({"Prefer":"return=minimal"}),
          body: JSON.stringify({
            balance: localCoins[slug] || 0,
            updated_at: new Date().toISOString()
          })
        });
      });
    });

    const unsynced = [];
    Object.keys(KIDS).forEach(function(slug){
      const kidId = ids[slug];
      if(!kidId) return;
      const entries = (localLog[slug] || []).slice().reverse();
      entries.forEach(function(entry){
        if(!isLocalId(entry.id)) return;
        unsynced.push({
          tempId: entry.id,
          slug: slug,
          body: (function(){
            const body = {
              kid_id: kidId,
              entry_type: entry.type === "spent" ? "spent" : "earned",
              amount: entry.amount,
              description: entry.desc || "",
              source: entry.source || null
            };
            if(entry.rewardId) body.reward_id = entry.rewardId;
            return body;
          })()
        });
      });
    });

    return Promise.all(patches).then(function(){
      const base = remoteLog ? {
        sam: (remoteLog.sam || []).slice(),
        isaac: (remoteLog.isaac || []).slice(),
        ben: (remoteLog.ben || []).slice()
      } : emptyLog();

      const merged = emptyLog();
      Object.keys(KIDS).forEach(function(slug){
        const fromLocal = (localLog[slug] || []).filter(function(e){ return !isLocalId(e.id); });
        const fromRemote = base[slug] || [];
        const seen = {};
        const out = [];
        fromLocal.concat(fromRemote).forEach(function(e){
          if(!e || !e.id || seen[e.id]) return;
          seen[e.id] = true;
          out.push(e);
        });
        (localLog[slug] || []).forEach(function(e){
          if(isLocalId(e.id) && !seen[e.id]){
            seen[e.id] = true;
            out.unshift(e);
          }
        });
        merged[slug] = out;
      });

      const tempIdMap = {};
      const txPromise = !unsynced.length
        ? Promise.resolve({log: merged, tempIdMap: tempIdMap})
        : sbFetch("coin_transactions", {
            method: "POST",
            headers: sbHeaders({"Prefer":"return=representation"}),
            body: JSON.stringify(unsynced.map(function(i){ return i.body; }))
          }).then(function(rows){
            const list = rows || [];
            for(var i = 0; i < list.length; i++){
              const tx = list[i];
              const meta = unsynced[i];
              if(!meta) continue;
              const mapped = {
                id: tx.id,
                type: tx.entry_type,
                amount: Number(tx.amount) || 0,
                desc: tx.description,
                source: tx.source || meta.body.source || null,
                rewardId: tx.reward_id || meta.body.reward_id || null,
                when: formatWhen(tx.created_at)
              };
              tempIdMap[meta.tempId] = mapped;
              const slug = meta.slug;
              merged[slug] = (merged[slug] || []).map(function(e){
                if(e.id !== meta.tempId) return e;
                return Object.assign({}, e, mapped, {when: mapped.when || e.when});
              });
            }
            return {log: merged, tempIdMap: tempIdMap};
          });

      return txPromise.then(function(txResult){
        const unlockBodies = [];
        Object.keys(KIDS).forEach(function(slug){
          const kidId = ids[slug];
          if(!kidId) return;
          (localUnlocks[slug] || []).forEach(function(u){
            if(u.remoteId) return;
            unlockBodies.push({
              slug: slug,
              unlock_id: u.id,
              body: {
                kid_id: kidId,
                unlock_id: u.id,
                unlock_type: u.type === "powerup" ? "powerup" : "trophy",
                used: !!u.used,
                unlocked_at: u.at || new Date().toISOString()
              }
            });
          });
        });

        const nextUnlocks = {
          sam: (localUnlocks.sam || []).slice(),
          isaac: (localUnlocks.isaac || []).slice(),
          ben: (localUnlocks.ben || []).slice()
        };

        if(!unlockBodies.length){
          return Object.assign({}, txResult, {unlocks: nextUnlocks});
        }

        return sbFetch("coin_unlocks", {
          method: "POST",
          headers: sbHeaders({"Prefer":"return=representation"}),
          body: JSON.stringify(unlockBodies.map(function(i){ return i.body; }))
        }).then(function(rows){
          const list = rows || [];
          for(var i = 0; i < list.length; i++){
            const row = list[i];
            const meta = unlockBodies[i];
            if(!meta || !row) continue;
            nextUnlocks[meta.slug] = (nextUnlocks[meta.slug] || []).map(function(u){
              if(u.id !== meta.unlock_id) return u;
              return Object.assign({}, u, {remoteId: row.id});
            });
          }
          return Object.assign({}, txResult, {unlocks: nextUnlocks});
        }).catch(function(){
          return Object.assign({}, txResult, {unlocks: nextUnlocks});
        });
      });
    });
  }

  function runSyncJob(job){
    if(job.kind === "balance"){
      const balance = (coinsRef.current && coinsRef.current[job.slug] != null)
        ? coinsRef.current[job.slug]
        : job.balance;
      const b = (job.boosts) || (boostsRef.current && boostsRef.current[job.slug]) || defaultBoost();
      return sbFetch("coin_kids?slug=eq."+encodeURIComponent(job.slug), {
        method: "PATCH",
        headers: sbHeaders({"Prefer":"return=minimal"}),
        body: JSON.stringify({
          balance: balance,
          double_earns_left: b.doubleEarnsLeft || 0,
          free_switch: !!b.freeSwitch,
          updated_at: new Date().toISOString()
        })
      }).catch(function(){
        return sbFetch("coin_kids?slug=eq."+encodeURIComponent(job.slug), {
          method: "PATCH",
          headers: sbHeaders({"Prefer":"return=minimal"}),
          body: JSON.stringify({balance: balance, updated_at: new Date().toISOString()})
        });
      });
    }
    if(job.kind === "insert"){
      const kidId = kidIdsRef.current[job.slug];
      if(!kidId) return Promise.resolve(null);
      const body = {
        kid_id: kidId,
        entry_type: job.entryType,
        amount: job.amount,
        description: job.desc
      };
      if(job.source) body.source = job.source;
      if(job.rewardId) body.reward_id = job.rewardId;
      return sbFetch("coin_transactions", {
        method: "POST",
        headers: sbHeaders({"Prefer":"return=representation"}),
        body: JSON.stringify(body)
      }).then(function(rows){
        const row = rows && rows[0] ? rows[0] : null;
        if(row && job.tempId){
          setLog(function(l){
            const next = Object.assign({}, l);
            next[job.slug] = (l[job.slug]||[]).map(function(e){
              return e.id === job.tempId
                ? Object.assign({}, e, {
                    id: row.id,
                    when: formatWhen(row.created_at) || e.when,
                    source: row.source || e.source || null,
                    rewardId: row.reward_id || e.rewardId || null
                  })
                : e;
            });
            return next;
          });
        }
        return row;
      }).catch(function(err){
        if(job.rewardId && body.reward_id){
          delete body.reward_id;
          return sbFetch("coin_transactions", {
            method: "POST",
            headers: sbHeaders({"Prefer":"return=representation"}),
            body: JSON.stringify(body)
          }).then(function(rows){
            const row = rows && rows[0] ? rows[0] : null;
            if(row && job.tempId){
              setLog(function(l){
                const next = Object.assign({}, l);
                next[job.slug] = (l[job.slug]||[]).map(function(e){
                  return e.id === job.tempId
                    ? Object.assign({}, e, {
                        id: row.id,
                        when: formatWhen(row.created_at) || e.when,
                        source: row.source || e.source || null
                      })
                    : e;
                });
                return next;
              });
            }
            return row;
          });
        }
        throw err;
      });
    }
    if(job.kind === "delete"){
      return sbFetch("coin_transactions?id=eq."+encodeURIComponent(job.id), {
        method: "DELETE",
        headers: sbHeaders({"Prefer":"return=minimal"})
      });
    }
    if(job.kind === "unlockInsert"){
      const kidId = kidIdsRef.current[job.slug];
      if(!kidId) return Promise.resolve(null);
      return sbFetch("coin_unlocks", {
        method: "POST",
        headers: sbHeaders({"Prefer":"return=representation"}),
        body: JSON.stringify({
          kid_id: kidId,
          unlock_id: job.unlockId,
          unlock_type: job.unlockType,
          used: !!job.used,
          unlocked_at: job.at || new Date().toISOString()
        })
      }).then(function(rows){
        const row = rows && rows[0] ? rows[0] : null;
        if(row){
          setUnlocks(function(u){
            const next = Object.assign({}, u);
            next[job.slug] = (u[job.slug]||[]).map(function(item){
              return item.id === job.unlockId
                ? Object.assign({}, item, {remoteId: row.id})
                : item;
            });
            unlocksRef.current = next;
            return next;
          });
        }
        return row;
      });
    }
    if(job.kind === "unlockUsed"){
      const kidId = kidIdsRef.current[job.slug];
      if(job.remoteId){
        return sbFetch("coin_unlocks?id=eq."+encodeURIComponent(job.remoteId), {
          method: "PATCH",
          headers: sbHeaders({"Prefer":"return=minimal"}),
          body: JSON.stringify({used: true})
        });
      }
      if(!kidId) return Promise.resolve(null);
      return sbFetch(
        "coin_unlocks?kid_id=eq."+encodeURIComponent(kidId)+"&unlock_id=eq."+encodeURIComponent(job.unlockId),
        {
          method: "PATCH",
          headers: sbHeaders({"Prefer":"return=minimal"}),
          body: JSON.stringify({used: true})
        }
      );
    }
    if(job.kind === "unlockDeleteAll"){
      if(!job.kidIds || !job.kidIds.length) return Promise.resolve(null);
      return sbFetch("coin_unlocks?kid_id=in.("+job.kidIds.join(",")+")", {
        method: "DELETE",
        headers: sbHeaders({"Prefer":"return=minimal"})
      });
    }
    return Promise.resolve();
  }

  function enqueueSync(job){
    if(!supabaseReady()) return Promise.resolve(null);
    if(!syncReadyRef.current || (job.slug && !kidIdsRef.current[job.slug] && job.kind !== "delete" && job.kind !== "unlockDeleteAll")){
      pendingSyncRef.current.push(job);
      return Promise.resolve(null);
    }
    return runSyncJob(job);
  }

  function flushPendingSync(){
    const jobs = pendingSyncRef.current.splice(0);
    if(!jobs.length) return Promise.resolve();
    return jobs.reduce(function(chain, job){
      return chain.then(function(){ return runSyncJob(job); });
    }, Promise.resolve());
  }

  function syncBalance(slug, balance, boostOverride){
    return enqueueSync({
      kind:"balance",
      slug:slug,
      balance:balance,
      boosts: boostOverride || (boostsRef.current && boostsRef.current[slug]) || defaultBoost()
    });
  }

  function syncInsertTx(slug, entryType, amount, desc, tempId, source, rewardId){
    return enqueueSync({
      kind:"insert",
      slug:slug,
      entryType:entryType,
      amount:amount,
      desc:desc,
      tempId:tempId,
      source:source || null,
      rewardId:rewardId || null
    });
  }

  function applyUnlocks(slug, nextLog, nextCoins, opts){
    opts = opts || {};
    const owned = {};
    (unlocksRef.current[slug] || []).forEach(function(u){ owned[u.id] = true; });
    const fresh = findNewUnlocks(slug, nextLog, nextCoins, owned);
    if(!fresh.length) return [];

    const nextUnlocks = Object.assign({}, unlocksRef.current);
    nextUnlocks[slug] = (nextUnlocks[slug] || []).concat(fresh);
    unlocksRef.current = nextUnlocks;
    setUnlocks(nextUnlocks);

    fresh.forEach(function(u){
      enqueueSync({
        kind:"unlockInsert",
        slug:slug,
        unlockId:u.id,
        unlockType:u.type,
        used:false,
        at:u.at
      });
    });

    const queued = fresh.map(function(u){
      return Object.assign({}, u, {slug: slug});
    });
    unlockQueueRef.current = (unlockQueueRef.current || []).concat(queued);
    setUnlockQueue(function(q){
      return q.concat(queued);
    });

    if(!opts.deferCelebration && !deferUnlockModalRef.current){
      try{ tune.fanfare(); }catch(e){}
      setModal("unlock");
    }
    return fresh;
  }

  const weekend = useMemo(function(){const d=new Date().getDay();return d===0||d===6;},[]);
  const K = KIDS[kid];
  const celebrating = unlockQueue[0] || null;
  const celebrateMeta = celebrating ? REWARD_BY_ID[celebrating.id] : null;

  const flash = function(msg){setToast(msg);setTimeout(function(){setToast(null);},1700);};

  const dismissUnlock = function(){
    setUnlockQueue(function(q){
      const rest = q.slice(1);
      unlockQueueRef.current = rest;
      if(!rest.length) setModal(null);
      return rest;
    });
  };

  const earn = function(amount,desc,source,opts){
    opts = opts || {};
    const slug = opts.slug || opts.kidId || kid;
    const skipUnlockCheck = !!opts.skipUnlockCheck;
    const deferCelebration = !!opts.deferCelebration || deferUnlockModalRef.current;
    let award = amount;
    let doubled = false;
    const nextBoosts = Object.assign({}, boostsRef.current);
    const kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());

    if(opts.rewardId){
      if(awardedRewardIdsRef.current[opts.rewardId]){
        return {amountAwarded:0, boostApplied:false, duplicate:true, transaction:null};
      }
      const already = (logRef.current[slug] || []).some(function(tx){
        return tx && tx.rewardId && tx.rewardId === opts.rewardId;
      });
      if(already){
        awardedRewardIdsRef.current[opts.rewardId] = true;
        return {amountAwarded:0, boostApplied:false, duplicate:true, transaction:null};
      }
    }

    if(!opts.skipDouble && kidBoost.doubleEarnsLeft > 0){
      award = amount * 2;
      kidBoost.doubleEarnsLeft -= 1;
      nextBoosts[slug] = kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
      doubled = true;
    }

    const when = new Date().toLocaleString("en-GB");
    const tempId = "local-"+Date.now()+"-"+Math.floor(Math.random()*999);
    let finalDesc = desc;
    if(doubled) finalDesc = desc + " · 2× power-up";
    const entry = {
      id:tempId,
      type:"earned",
      amount:award,
      desc:finalDesc,
      when:when,
      source: source || null,
      rewardId: opts.rewardId || null
    };
    if(opts.rewardId) awardedRewardIdsRef.current[opts.rewardId] = true;

    let newBal = 0;
    const nextCoins = Object.assign({}, coinsRef.current);
    newBal = (nextCoins[slug]||0) + award;
    nextCoins[slug] = newBal;
    coinsRef.current = nextCoins;
    setCoins(nextCoins);

    const nextLog = Object.assign({}, logRef.current);
    nextLog[slug] = [entry].concat(nextLog[slug]||[]);
    logRef.current = nextLog;
    setLog(nextLog);

    if(!opts.quiet){
      if(doubled) flash("2× power-up! +"+award+" for "+KIDS[slug].name+"!");
      else flash("+"+award+" for "+KIDS[slug].name+"!");
    }

    Promise.all([
      syncInsertTx(slug, "earned", award, finalDesc, tempId, source, opts.rewardId || null),
      syncBalance(slug, newBal, kidBoost)
    ]).then(function(){
      setCloud("online");
    }).catch(function(){ setCloud("offline"); });

    if(!skipUnlockCheck) applyUnlocks(slug, nextLog, nextCoins, {deferCelebration: deferCelebration});

    return {
      amountAwarded: award,
      boostApplied: doubled,
      duplicate: false,
      transaction: entry
    };
  };

  const spend = function(amount,desc,source,opts){
    opts = opts || {};
    const slug = opts.slug || kid;
    let cost = amount;
    let usedFree = false;
    const nextBoosts = Object.assign({}, boostsRef.current);
    const kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());

    if(source === "switch15" && kidBoost.freeSwitch && !opts.forcePaid){
      cost = 0;
      usedFree = true;
      kidBoost.freeSwitch = false;
      nextBoosts[slug] = kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
    }

    if((coinsRef.current[slug]||0) < cost){ flash("Not enough coins!"); return; }

    const when = new Date().toLocaleString("en-GB");
    const tempId = "local-"+Date.now()+"-"+Math.floor(Math.random()*999);
    const entry = {
      id:tempId,
      type:"spent",
      amount:cost,
      desc: usedFree ? (desc + " (Free Pass)") : desc,
      when:when,
      source: source || null
    };
    let newBal = 0;
    const nextCoins = Object.assign({}, coinsRef.current);
    newBal = (nextCoins[slug]||0) - cost;
    nextCoins[slug] = newBal;
    coinsRef.current = nextCoins;
    setCoins(nextCoins);

    const nextLog = Object.assign({}, logRef.current);
    nextLog[slug] = [entry].concat(nextLog[slug]||[]);
    logRef.current = nextLog;
    setLog(nextLog);

    flash(usedFree ? "Free Switch Pass used!" : ("−"+cost+" · "+desc));

    Promise.all([
      syncInsertTx(slug, "spent", cost, entry.desc, tempId, source),
      syncBalance(slug, newBal, kidBoost)
    ]).then(function(){
      setCloud("online");
    }).catch(function(){ setCloud("offline"); });

    applyUnlocks(slug, nextLog, nextCoins);
  };

  const markPowerupUsed = function(slug, unlockId){
    const nextUnlocks = Object.assign({}, unlocksRef.current);
    let remoteId = null;
    nextUnlocks[slug] = (nextUnlocks[slug] || []).map(function(u){
      if(u.id !== unlockId) return u;
      remoteId = u.remoteId || null;
      return Object.assign({}, u, {used: true});
    });
    unlocksRef.current = nextUnlocks;
    setUnlocks(nextUnlocks);
    enqueueSync({kind:"unlockUsed", slug:slug, unlockId:unlockId, remoteId:remoteId});
  };

  const usePowerup = function(unlockId){
    const slug = kid;
    const owned = (unlocksRef.current[slug] || []).filter(function(u){
      return u.id === unlockId && u.type === "powerup" && !u.used;
    })[0];
    if(!owned){ flash("Already used!"); return; }
    const meta = REWARD_BY_ID[unlockId];
    if(!meta) return;

    if(meta.effect === "double"){
      const nextBoosts = Object.assign({}, boostsRef.current);
      const kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());
      kidBoost.doubleEarnsLeft = (kidBoost.doubleEarnsLeft || 0) + 3;
      nextBoosts[slug] = kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
      markPowerupUsed(slug, unlockId);
      syncBalance(slug, coinsRef.current[slug] || 0, kidBoost);
      flash("Double Coin Burst armed!");
      return;
    }
    if(meta.effect === "freeSwitch"){
      const nextBoosts = Object.assign({}, boostsRef.current);
      const kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());
      kidBoost.freeSwitch = true;
      nextBoosts[slug] = kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
      markPowerupUsed(slug, unlockId);
      syncBalance(slug, coinsRef.current[slug] || 0, kidBoost);
      flash("Free Switch Pass ready!");
      return;
    }
    if(meta.effect === "coinDrop"){
      markPowerupUsed(slug, unlockId);
      earn(5, "Coin Drop power-up", "powerup-coin-boost", {skipDouble:true});
      return;
    }
    if(meta.effect === "playCoinDrop"){
      markPowerupUsed(slug, unlockId);
      const reward = {
        rewardId: makeRewardId(),
        kidId: slug,
        amount: 1,
        description: "Bonus Coin Drop",
        source: "powerup-extra-drop",
        createdAt: new Date().toISOString(),
        awarded: false,
        game: "coinDrop"
      };
      pendingRewardRef.current = reward;
      setPendingReward(reward);
      deferUnlockModalRef.current = true;
      setModal("coinDrop");
      flash("Bonus Drop — guide that coin!");
      return;
    }
    if(meta.effect === "playCoinBlaster"){
      markPowerupUsed(slug, unlockId);
      const reward = {
        rewardId: makeRewardId(),
        kidId: slug,
        amount: 1,
        description: "Coin Blaster",
        source: "powerup-coin-blaster",
        createdAt: new Date().toISOString(),
        awarded: false,
        game: "coinBlaster"
      };
      pendingRewardRef.current = reward;
      setPendingReward(reward);
      deferUnlockModalRef.current = true;
      setModal("coinBlaster");
      flash("Coin Blaster — hit 8 coins!");
      return;
    }
  };

  const undoLast = function(){
    const entry = (logRef.current[kid]||[])[0] || log[kid][0];
    if(!entry){ flash("Nothing to undo"); return; }
    let newBal = 0;
    setCoins(function(c){
      const next = Object.assign({}, c);
      newBal = entry.type==="earned"
        ? Math.max(0, (c[kid]||0) - entry.amount)
        : (c[kid]||0) + entry.amount;
      next[kid] = newBal;
      coinsRef.current = next;
      return next;
    });
    setLog(function(l){
      const next = Object.assign({}, l);
      next[kid] = (l[kid]||[]).slice(1);
      logRef.current = next;
      return next;
    });
    flash("Undid "+entry.desc);

    const remoteId = !isLocalId(entry.id) ? entry.id : null;
    const tasks = [syncBalance(kid, newBal)];
    if(remoteId && supabaseReady()){
      tasks.push(enqueueSync({kind:"delete", id:remoteId}));
    }
    Promise.all(tasks).then(function(){ setCloud("online"); }).catch(function(){ setCloud("offline"); });
  };

  const resetAll = function(){
    setCoins({sam:0,isaac:0,ben:0});
    setLog(emptyLog());
    const clearedUnlocks = emptyUnlocks();
    const clearedBoosts = emptyBoosts();
    unlocksRef.current = clearedUnlocks;
    boostsRef.current = clearedBoosts;
    setUnlocks(clearedUnlocks);
    setBoosts(clearedBoosts);
    setUnlockQueue([]);
    unlockQueueRef.current = [];
    pendingRewardRef.current = null;
    setPendingReward(null);
    awardedRewardIdsRef.current = {};
    timerCompletedRef.current = false;
    flash("All kids reset to 0");
    setModal(null);

    if(!supabaseReady()) return;
    const ids = kidIdsRef.current;
    const idList = Object.keys(KIDS).map(function(s){ return ids[s]; }).filter(Boolean);
    const tasks = Object.keys(KIDS).map(function(slug){
      return syncBalance(slug, 0, defaultBoost());
    });
    if(idList.length){
      tasks.push(sbFetch("coin_transactions?kid_id=in.("+idList.join(",")+")", {
        method: "DELETE",
        headers: sbHeaders({"Prefer":"return=minimal"})
      }));
      tasks.push(enqueueSync({kind:"unlockDeleteAll", kidIds:idList}));
    }
    Promise.all(tasks).then(function(){ setCloud("online"); }).catch(function(){ setCloud("offline"); });
  };

  const clearPendingReward = function(){
    pendingRewardRef.current = null;
    setPendingReward(null);
  };

  const markPendingAwarded = function(reward){
    const marked = Object.assign({}, reward, {awarded: true});
    pendingRewardRef.current = marked;
    setPendingReward(marked);
    return marked;
  };

  const completePendingReward = function(reward){
    try{
      if(!reward || reward.awarded) return Promise.resolve(null);
      if(isPracticeBrushSource(reward.source)){
        if(reward.rewardId) awardedRewardIdsRef.current[reward.rewardId] = true;
        markPendingAwarded(reward);
        return Promise.resolve({amountAwarded:0, boostApplied:false, practice:true});
      }
      const slug = reward.kidId;
      if(reward.rewardId && awardedRewardIdsRef.current[reward.rewardId]){
        if(modal === "coinDrop" || modal === "coinChase" || modal === "mazeDash" || modal === "coinBlaster"){
          finishCoinDropFlow();
        }else{
          clearPendingReward();
        }
        return Promise.resolve({amountAwarded:0, boostApplied:false, duplicate:true});
      }
      const alreadyExists = (logRef.current[slug] || []).some(function(tx){
        return tx && reward.rewardId && tx.rewardId === reward.rewardId;
      });
      if(alreadyExists){
        if(modal === "coinDrop" || modal === "coinChase" || modal === "mazeDash" || modal === "coinBlaster"){
          finishCoinDropFlow();
        }else{
          clearPendingReward();
        }
        return Promise.resolve({amountAwarded:0, boostApplied:false, duplicate:true});
      }

      deferUnlockModalRef.current = true;
      const result = earn(
        reward.amount,
        reward.description,
        reward.source,
        {
          kidId: slug,
          rewardId: reward.rewardId,
          deferCelebration: true,
          quiet: modal === "coinDrop" || modal === "coinChase" || modal === "mazeDash" || modal === "coinBlaster"
        }
      );
      markPendingAwarded(reward);
      return Promise.resolve(result);
    }catch(err){
      try{
        deferUnlockModalRef.current = true;
        const fallback = earn(
          (reward && reward.amount) || 1,
          (reward && reward.description) || "Brush teeth",
          (reward && reward.source) || "brush-am",
          {
            kidId: (reward && reward.kidId) || kid,
            rewardId: reward && reward.rewardId,
            deferCelebration: true
          }
        );
        if(reward) markPendingAwarded(reward);
        else clearPendingReward();
        return Promise.resolve(fallback);
      }catch(e2){
        clearPendingReward();
        return Promise.resolve(null);
      }
    }
  };

  const launchTestCoinDrop = function(){
    const pending = pendingRewardRef.current || pendingReward;
    if(pending && !pending.awarded && !isPracticeBrushSource(pending.source)){
      flash("Finish the open coin game first");
      return;
    }
    const reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Coin Drop",
      source: "test-drop",
      createdAt: new Date().toISOString(),
      awarded: false,
      game: "coinDrop"
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("coinDrop");
    flash("Test drop — practice only");
  };

  const launchTestCoinChase = function(){
    const pending = pendingRewardRef.current || pendingReward;
    if(pending && !pending.awarded && !isPracticeBrushSource(pending.source)){
      flash("Finish the open coin game first");
      return;
    }
    const reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Coin Chase",
      source: "test-chase",
      createdAt: new Date().toISOString(),
      awarded: false,
      game: "coinChase"
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("coinChase");
    flash("Test chase — practice only");
  };

  const launchTestMazeDash = function(){
    const pending = pendingRewardRef.current || pendingReward;
    if(pending && !pending.awarded && !isPracticeBrushSource(pending.source)){
      flash("Finish the open coin game first");
      return;
    }
    const reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Maze Dash",
      source: "test-dash",
      createdAt: new Date().toISOString(),
      awarded: false,
      game: "mazeDash"
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("mazeDash");
    flash("Test dash — practice only");
  };

  const launchTestCoinBlaster = function(){
    const pending = pendingRewardRef.current || pendingReward;
    if(pending && !pending.awarded && !isPracticeBrushSource(pending.source)){
      flash("Finish the open coin game first");
      return;
    }
    const reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Coin Blaster",
      source: "test-blaster",
      createdAt: new Date().toISOString(),
      awarded: false,
      game: "coinBlaster"
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("coinBlaster");
    flash("Test blaster — practice only");
  };

  const finishCoinDropFlow = function(){
    deferUnlockModalRef.current = false;
    setPendingReward(null);
    pendingRewardRef.current = null;
    setTimerJob(null);
    setDone(false);
    setRunning(false);
    if(unlockQueueRef.current && unlockQueueRef.current.length){
      try{ tune.fanfare(); }catch(e){}
      setModal("unlock");
    }else{
      setModal(null);
    }
  };

  const handleCoinDropComplete = function(){
    finishCoinDropFlow();
  };

  const handleCloseCoinDrop = function(){
    completePendingReward(pendingRewardRef.current || pendingReward).then(function(){
      finishCoinDropFlow();
    });
  };

  /* timer */
  const openTimer = function(job){
    timerCompletedRef.current = false;
    setTimerJob(job);
    setSecs(120);
    setRunning(false);
    setDone(false);
    setModal("timer");
  };
  const closeTimer = function(){
    tune.stop();
    setRunning(false);
    setModal(null);
    setTimerJob(null);
    timerCompletedRef.current = false;
  };

  const setHeroTimerDuration = function(nextSecs, label){
    const clamped = clamp(nextSecs|0, 30, 3600);
    setSettings(function(s){
      return Object.assign({}, s, {heroTimerSecs: clamped});
    });
    if(!heroRunning){
      setHeroSecs(clamped);
      setHeroTotal(clamped);
      setHeroDone(false);
    }
    if(label) setHeroLabel(label);
  };

  const openHeroTimer = function(preset){
    const duration = preset
      ? preset.secs
      : (settings.heroTimerSecs || heroTotal || 300);
    const label = preset
      ? preset.name
      : (heroLabel && heroLabel !== "Hero Timer" ? heroLabel : "Hero Timer");
    const clamped = clamp(duration|0, 30, 3600);
    heroTimerCompletedRef.current = false;
    setHeroLabel(label);
    setHeroTotal(clamped);
    setHeroSecs(clamped);
    setHeroRunning(false);
    setHeroDone(false);
    setSettings(function(s){
      return Object.assign({}, s, {heroTimerSecs: clamped});
    });
    setModal("heroTimer");
  };

  const closeHeroTimer = function(){
    tune.stop();
    setHeroRunning(false);
    setModal(null);
    heroTimerCompletedRef.current = false;
  };

  const nudgeHeroDuration = function(delta){
    if(heroRunning) return;
    const base = settings.heroTimerSecs || heroTotal || 300;
    setHeroTimerDuration(base + delta);
  };

  const openBrushWheel = function(){
    setWheelWinner(null);
    wheelWinnerIdxRef.current = null;
    setWheelSpinning(false);
    setModal("brushWheel");
  };

  const closeBrushWheel = function(){
    setWheelSpinning(false);
    setModal(null);
  };

  const spinBrushWheel = function(){
    if(wheelSpinning) return;
    const n = BRUSH_WHEEL_ORDER.length;
    const slice = 360 / n;
    const winnerIdx = Math.floor(Math.random() * n);
    const jitter = (Math.random() - 0.5) * (slice * 0.55);
    const center = winnerIdx * slice + slice / 2 + jitter;
    const spins = 5 + Math.floor(Math.random() * 3);
    const current = wheelRotRef.current;
    const currentMod = ((current % 360) + 360) % 360;
    const desiredMod = ((360 - center) % 360 + 360) % 360;
    var delta = desiredMod - currentMod;
    if(delta < 0) delta += 360;
    const nextRot = current + spins * 360 + delta;
    wheelWinnerIdxRef.current = winnerIdx;
    setWheelWinner(null);
    setWheelSpinning(true);
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        wheelRotRef.current = nextRot;
        setWheelRot(nextRot);
      });
    });
  };

  const onBrushWheelTransitionEnd = function(e){
    if(!e || e.propertyName !== "transform") return;
    if(!wheelSpinning) return;
    const idx = wheelWinnerIdxRef.current;
    if(idx == null) return;
    const winnerKey = BRUSH_WHEEL_ORDER[idx];
    setWheelSpinning(false);
    setWheelWinner(winnerKey);
    setKid(winnerKey);
    setFocusedRow(null);
    try{ tune.fanfare(); }catch(err){}
  };

  useEffect(function(){
    if(!running) return;
    if(secs<=0){
      if(timerCompletedRef.current) return;
      timerCompletedRef.current = true;
      setRunning(false);
      tune.stop();

      const job = timerJob;
      const desc = job
        ? job.name+(job.sub?" ("+job.sub+")":"")
        : "Brush teeth";
      const source = job ? job.id : "brush-am";
      const amount = job ? job.coins : 1;
      const nextGame = settings.lastBrushGame === "coinChase"
        ? "coinChase"
        : settings.lastBrushGame === "mazeDash"
          ? "mazeDash"
          : "coinDrop";
      const reward = {
        rewardId: makeRewardId(),
        kidId: kid,
        amount: amount,
        description: desc,
        source: source,
        createdAt: new Date().toISOString(),
        awarded: false,
        game: nextGame
      };

      if(settings.coinDropEnabled !== false){
        pendingRewardRef.current = reward;
        setPendingReward(reward);
        deferUnlockModalRef.current = true;
        setSettings(function(s){
          return Object.assign({}, s, {lastBrushGame: nextBrushGame(nextGame)});
        });
        setModal(nextGame);
        return;
      }

      tune.fanfare();
      setDone(true);
      earn(amount, desc, source, {kidId: kid, rewardId: reward.rewardId});
      return;
    }
    const t=setTimeout(function(){ setSecs(function(s){ return s-1; }); },1000);
    return function(){ clearTimeout(t); };
  },[running,secs]);

  useEffect(function(){
    if(!heroRunning) return;
    if(heroSecs<=0){
      if(heroTimerCompletedRef.current) return;
      heroTimerCompletedRef.current = true;
      setHeroRunning(false);
      tune.stop();
      tune.fanfare();
      setHeroDone(true);
      return;
    }
    const t=setTimeout(function(){ setHeroSecs(function(s){ return s-1; }); },1000);
    return function(){ clearTimeout(t); };
  },[heroRunning,heroSecs]);

  /* Resume unresolved brushing games on boot — do not auto-award away the play */
  useEffect(function(){
    if(recoveryDoneRef.current) return;
    recoveryDoneRef.current = true;
    const pending = pendingRewardRef.current || pendingReward;
    if(!pending) return;

    const exists = (logRef.current[pending.kidId] || []).some(function(tx){
      return tx && tx.rewardId && tx.rewardId === pending.rewardId;
    });
    if(exists || pending.awarded){
      clearPendingReward();
      return;
    }

    deferUnlockModalRef.current = true;
    setModal(brushGameFromPending(pending));
  },[]);

  /* coin spill canvas — gravity follows phone tilt when available */
  useEffect(()=>{
    if(modal!=="vault"||!canvasRef.current) return;
    const cv=canvasRef.current, ctx=cv.getContext("2d");
    const W=cv.width,H=cv.height, target=Math.min(coins[kid],120);
    let parts=[],frame=0,raf;
    const tilt={gx:0, gy:0.34};
    const onOrient=(e)=>{
      const gamma = typeof e.gamma === "number" ? e.gamma : 0;
      const beta  = typeof e.beta  === "number" ? e.beta  : 0;
      const g = Math.max(-50, Math.min(50, gamma)) / 50;
      const b = Math.max(-50, Math.min(50, beta))  / 50;
      tilt.gx = g * 0.72;
      tilt.gy = 0.34 + b * 0.28;
    };
    window.addEventListener("deviceorientation", onOrient, true);
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
        if(p.rest && Math.abs(tilt.gx) > 0.1){
          p.rest=false;
          p.vx += tilt.gx * 4;
          p.vy -= 0.6;
        }
        if(!p.rest){
          p.vx+=tilt.gx; p.vy+=tilt.gy;
          p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
          if(p.x<p.s||p.x>W-p.s){p.vx*=-0.6;p.x=Math.max(p.s,Math.min(W-p.s,p.x));}
          if(p.y>H-p.s-4){p.y=H-p.s-4;p.vy*=-0.32;p.vx*=0.72;p.vr*=0.5;
            if(Math.abs(p.vy)<1.1 && Math.abs(tilt.gx)<0.12){p.rest=true;p.vy=0;p.r=Math.round(p.r/Math.PI)*Math.PI;}}
          if(p.y<p.s){p.y=p.s;p.vy*=-0.35;}
        }
        draw(p);
      });
      frame++;raf=requestAnimationFrame(loop);
    };
    loop();
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrient, true);
    };
  },[modal,kid,coins]);

  const openVault = ()=>{
    setModal("vault");
    try{
      const DOE = window.DeviceOrientationEvent;
      if(DOE && typeof DOE.requestPermission === "function"){
        DOE.requestPermission().catch(function(){});
      }
    }catch(e){}
  };

  const onHeroTap = function(key){
    if(kid === key){
      setModal("profile");
      return;
    }
    setKid(key);
    setFocusedRow(null);
  };

  const vaultRef = useRef(null);
  const [pinKid, setPinKid] = useState(false);
  useEffect(function(){
    const el = vaultRef.current;
    if(!el) return;
    if(typeof IntersectionObserver === "undefined"){
      setPinKid(true);
      return;
    }
    const io = new IntersectionObserver(function(entries){
      const entry = entries[0];
      if(entry) setPinKid(!entry.isIntersecting);
    }, {threshold:0, rootMargin:"-12px 0px 0px 0px"});
    io.observe(el);
    return function(){ io.disconnect(); };
  },[]);

  const mmss=(s)=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
  const pct = 1-(secs/120);
  const heroPct = heroTotal > 0 ? 1 - (heroSecs / heroTotal) : 0;
  const heroDurationSecs = settings.heroTimerSecs || 300;

  const profileStats = kidStats(kid, log, coins);
  const kidUnlocks = unlocks[kid] || [];
  const unlockedIds = {};
  kidUnlocks.forEach(function(u){ unlockedIds[u.id] = u; });
  const trophyOwned = TROPHIES.filter(function(t){ return unlockedIds[t.id]; });
  const lockedTrophySlots = Math.max(0, TROPHIES.length - trophyOwned.length);
  const powerOwned = POWERUPS.map(function(p){
    const u = unlockedIds[p.id];
    return u ? Object.assign({}, p, {used: !!u.used, at: u.at}) : null;
  }).filter(Boolean);
  const kidBoost = boosts[kid] || defaultBoost();
  const freeSwitchReady = !!kidBoost.freeSwitch;
  const balance = coins[kid] || 0;
  const shopGoal = nextShopGoal(balance);
  const stackSlots = coinStackSlots(balance, shopGoal);
  const stackDiscs = (function(){
    const discs = [];
    var i;
    for(i = 0; i < stackSlots.filled; i++) discs.push("filled");
    for(i = 0; i < stackSlots.ghost; i++) discs.push("ghost");
    return discs;
  })();
  const stackHeight = stackDiscs.length
    ? 30 + (stackDiscs.length - 1) * 10
    : 30;

  /* ---------- row renderers ---------- */
  const JobRow = ({job,tone}) => {
    const rowKey = "job:"+job.id;
    const focused = focusedRow === rowKey;
    const award = () => earn(job.coins, job.name+(job.sub?" ("+job.sub+")":""), job.id);
    const onCoin = (e) => {
      e.stopPropagation();
      if(!focused){ setFocusedRow(rowKey); return; }
      award();
      setFocusedRow(null);
    };
    return (
      <div
        className={"row is-pickable"+(focused?" is-focused":"")}
        role="button"
        tabIndex={0}
        aria-pressed={focused}
        onClick={()=>setFocusedRow(rowKey)}
        onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setFocusedRow(rowKey); } }}
      >
        <Slot light src={IMAGES.jobs[job.id]} label={job.id} icon={job.icon} className="icon-slot"/>
        <div className="rtext">
          <div className="rname">{job.name}</div>
          {job.sub && <div className="rsub">{job.sub}</div>}
          {focused && <div className="rsub focus-hint">Now tap the coin ✓</div>}
        </div>
        {job.timer && (
          <button
            className="timer-mini"
            title="Start 2-minute brushing timer"
            onClick={(e)=>{ e.stopPropagation(); openTimer(job); }}
          >⏱️</button>
        )}
        <CoinBtn value={job.coins} tone={tone} onClick={onCoin}/>
      </div>
    );
  };

  const ShopRow = ({item,tone,locked}) => {
    const rowKey = "shop:"+item.id;
    const focused = focusedRow === rowKey;
    const isFreeSwitch = item.id === "switch15" && freeSwitchReady;
    const cost = isFreeSwitch ? 0 : item.coins;
    const cant = !isFreeSwitch && coins[kid] < item.coins;
    const blocked = locked || cant;
    const buy = () => { if(!blocked) spend(cost, item.name, item.id); };
    const onCoin = (e) => {
      e.stopPropagation();
      if(blocked) return;
      if(!focused){ setFocusedRow(rowKey); return; }
      buy();
      setFocusedRow(null);
    };
    return (
      <div
        className={"row is-pickable "+(locked?"locked ":"")+(cant?"cant":"")+(isFreeSwitch?" free-pass":"")+(focused?" is-focused":"")}
        role="button"
        tabIndex={0}
        aria-pressed={focused}
        onClick={()=>setFocusedRow(rowKey)}
        onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setFocusedRow(rowKey); } }}
      >
        <Slot light src={IMAGES.shop[item.id]} label={item.id} className="icon-slot"/>
        <div className="rtext">
          <div className="rname">{item.name}</div>
          {item.sub && <div className="rsub">{item.sub}</div>}
          {isFreeSwitch && <div className="rsub free-tag">Free Switch Pass ready!</div>}
          {focused && !blocked && <div className="rsub focus-hint">Now tap the coin ✓</div>}
        </div>
        <CoinBtn
          value={isFreeSwitch ? 0 : item.coins}
          word={isFreeSwitch ? "FREE" : undefined}
          tone={tone}
          disabled={blocked}
          onClick={onCoin}
        />
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
          <div key={key} className={"hero-card "+k.cls+(kid===key?" active":"")} onClick={()=>onHeroTap(key)}>
            <Slot src={IMAGES[k.img]} label={k.name+" photo"} className="portrait"/>
            <div className="comic hname">{k.name} {k.badge}</div>
            <div className="hbal">🪙 {coins[key]}</div>
            {kid===key && <div className="hprofile-hint">Tap again for profile</div>}
          </div>
        ))}
      </div>

      {/* ---------------- VAULT / PROUD COIN STACK ---------------- */}
      <div className="vault" ref={vaultRef} onClick={openVault}>
        <div className="vault-main">
          <div className="vault-stack-col">
            <div className="lbl">{K.name}'s coin bank</div>
            <div className="vault-stack-row">
              <div
                className="coin-stack"
                key={"stack-"+kid+"-"+balance}
                style={{height: stackHeight + "px"}}
                aria-hidden="true"
              >
                {stackDiscs.length === 0 && (
                  <div className="stack-coin ghost" style={{bottom:0}} />
                )}
                {stackDiscs.map(function(kind, idx){
                  return (
                    <div
                      key={kind+"-"+idx}
                      className={"stack-coin "+kind}
                      style={{
                        bottom: (idx * 10) + "px",
                        zIndex: idx + 1,
                        WebkitAnimationDelay: (idx * 0.03) + "s",
                        animationDelay: (idx * 0.03) + "s"
                      }}
                    >
                      {kind === "filled" && <span className="stack-star">★</span>}
                    </div>
                  );
                })}
              </div>
              <div className="vault-balance">
                <div className="comic big">{balance}</div>
                {shopGoal
                  ? <div className="vault-goal">{balance} → {shopGoal.name} · {shopGoal.coins}</div>
                  : <div className="vault-goal">Ready for anything!</div>}
              </div>
            </div>
            {(kidBoost.doubleEarnsLeft > 0 || kidBoost.freeSwitch || powerOwned.length > 0) && (
              <div
                className="vault-powers"
                onClick={function(e){ e.stopPropagation(); setModal("profile"); }}
                role="button"
                tabIndex={0}
                onKeyDown={function(e){
                  if(e.key === "Enter" || e.key === " "){
                    e.preventDefault();
                    e.stopPropagation();
                    setModal("profile");
                  }
                }}
                aria-label="Open profile for power-ups"
              >
                {(kidBoost.doubleEarnsLeft > 0 || kidBoost.freeSwitch) && (
                  <div className="boost-pills vault-boosts">
                    {kidBoost.doubleEarnsLeft > 0 && (
                      <span className="boost-pill">⚡ 2× ×{kidBoost.doubleEarnsLeft}</span>
                    )}
                    {kidBoost.freeSwitch && (
                      <span className="boost-pill">🎮 Free Switch</span>
                    )}
                  </div>
                )}
                {powerOwned.length > 0 && (
                  <div className="vault-power-chips">
                    {powerOwned.map(function(p){
                      return (
                        <span
                          key={p.id}
                          className={"vault-power-chip"+(p.used ? " used" : "")}
                          title={p.name}
                        >
                          {p.icon}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={"vault-hero "+K.cls}>
            <Slot
              src={IMAGES[K.img]}
              label={K.name}
              className="vault-hero-face"
            />
            <div className="comic vault-hero-name">{K.name} {K.badge}</div>
          </div>
        </div>
        <div className="tap">Tap to tip them out ⤵</div>
      </div>

      {pinKid && !modal && (
        <button
          type="button"
          className={"kid-pin "+K.cls}
          onClick={function(){ window.scrollTo({top:0, behavior:"smooth"}); }}
          aria-label={K.name+"'s chart — tap to go to top"}
        >
          <Slot src={IMAGES[K.img]} label={K.name} className="kid-pin-face"/>
          <span className="comic kid-pin-name">{K.name} {K.badge}</span>
          <span className="kid-pin-bal">🪙 {coins[kid]}</span>
        </button>
      )}

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
            <div
              className={"row is-pickable"+(coins[kid]<2?" cant":"")+(focusedRow==="shop:tax"?" is-focused":"")}
              role="button"
              tabIndex={0}
              aria-pressed={focusedRow==="shop:tax"}
              onClick={()=>setFocusedRow("shop:tax")}
              onKeyDown={(e)=>{
                if(e.key==="Enter"||e.key===" "){ e.preventDefault(); setFocusedRow("shop:tax"); }
              }}
            >
              <Slot light src={IMAGES.shop.tax} label="tax" className="icon-slot"/>
              <div className="rtext">
                <div className="rname">Mum's Food Tax</div>
                <div className="rsub">Ask nicely — 2 coins per request</div>
                {focusedRow==="shop:tax" && coins[kid]>=2 && <div className="rsub focus-hint">Now tap the coin ✓</div>}
              </div>
              <CoinBtn
                value={2}
                word="PER REQ"
                disabled={coins[kid]<2}
                onClick={(e)=>{
                  e.stopPropagation();
                  if(coins[kid]<2) return;
                  if(focusedRow!=="shop:tax"){ setFocusedRow("shop:tax"); return; }
                  spend(2,"Mum's Food Tax","tax");
                  setFocusedRow(null);
                }}
              />
            </div>

            <div className="band red comic">★ Savings Shop — weekends ★</div>
            {!weekend && <div className="locknote">🔒 Big rewards open Saturday &amp; Sunday</div>}
            {SAVINGS_SHOP.map(i=><ShopRow key={i.id} item={i} locked={!weekend}/>)}
          </div>
        </section>
      </div>

      {/* ---------------- HERO TIMER SECTION ---------------- */}
      <section className="panel hero-timer-panel">
        <div className="panel-head">
          <div className="comic ptitle outline-2">Hero Timer</div>
          <div style={{fontSize:"1.7rem"}}>⏱</div>
        </div>
        <div className="panel-body">
          <div className="band navy comic">★ Race the clock — no coins, just hustle ★</div>
          <div className="hero-timer-presets">
            {HERO_TIMER_PRESETS.map(function(p){
              const active = heroDurationSecs === p.secs && !heroRunning;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={"hero-preset"+(active?" active":"")}
                  onClick={function(){ setHeroTimerDuration(p.secs, p.name); }}
                >
                  <span className="hero-preset-ico">{p.icon}</span>
                  <span className="hero-preset-name">{p.name}</span>
                  <span className="hero-preset-time">{mmss(p.secs)}</span>
                </button>
              );
            })}
          </div>
          <div className="hero-timer-custom">
            <div className="hero-timer-custom-lbl">Set your time</div>
            <div className="hero-timer-adjust">
              <button
                type="button"
                className="hero-nudge"
                onClick={function(){ nudgeHeroDuration(-60); }}
                aria-label="Minus one minute"
              >−1m</button>
              <div className="comic hero-timer-display">{mmss(heroDurationSecs)}</div>
              <button
                type="button"
                className="hero-nudge"
                onClick={function(){ nudgeHeroDuration(60); }}
                aria-label="Plus one minute"
              >+1m</button>
            </div>
            <div className="hero-timer-fine">
              <button type="button" className="hero-nudge fine" onClick={function(){ nudgeHeroDuration(-30); }}>−30s</button>
              <button type="button" className="hero-nudge fine" onClick={function(){ nudgeHeroDuration(30); }}>+30s</button>
            </div>
          </div>
          <button
            type="button"
            className="btn go hero-timer-start"
            onClick={function(){ openHeroTimer(); }}
          >
            ▶ Start {heroLabel && heroLabel !== "Hero Timer" ? heroLabel : "timer"}
          </button>
        </div>
      </section>

      {/* ---------------- BRUSH-FIRST WHEEL ---------------- */}
      <section className="panel brush-wheel-panel">
        <div className="panel-head">
          <div className="comic ptitle outline-2">Who Brushes First?</div>
          <div style={{fontSize:"1.7rem"}}>🪥</div>
        </div>
        <div className="panel-body">
          <div className="band purple comic">★ Spin the wheel — fair and square ★</div>
          <p className="brush-wheel-blurb">
            No more arguments! Spin to see who grabs the toothbrush first.
          </p>
          <div className="brush-wheel-mini" aria-hidden="true">
            <div className="brush-wheel-mini-pointer">▼</div>
            <div className="brush-wheel-disc mini" />
          </div>
          <button type="button" className="btn go brush-wheel-open" onClick={openBrushWheel}>
            🎡 Spin the wheel
          </button>
        </div>
      </section>

      {/* ---------------- BOTTOM ---------------- */}
      <div className="bottom">
        <div>
          <div className="hero-art">
            {Object.entries(KIDS).map(([key,k])=>(
              <div key={key} onClick={()=>onHeroTap(key)} style={{cursor:"pointer"}}>
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
          <button className="btn tax" onClick={()=>spend(2,"Mum's Food Tax","tax")}>🍽️ Mum's Food Tax −2</button>
          <button className="btn hist" onClick={()=>setModal("history")}>📋 {K.name}'s History</button>
          <button className="btn profile" onClick={()=>setModal("profile")}>🏅 {K.name}'s Profile</button>
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
                <div style={{fontWeight:800,fontSize:".85rem",color:"#7a3b00",marginTop:"6px"}}>Tilt your phone to roll the coins!</div>
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
                  <div style={{fontWeight:900,marginTop:"6px"}}>You earned your brushing coin ⭐</div>
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
                    : <button className="btn stop" onClick={()=>{tune.pause();setRunning(false);}}>⏸ Pause</button>}
                  <button className="btn close" onClick={closeTimer}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- HERO TIMER MODAL ---------------- */}
      {modal==="heroTimer" && (
        <div className="modal">
          <div className="sheet hero-timer-sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head hero-timer-head">
              <h2 className="comic outline-2">⏱ {heroLabel}</h2>
            </div>
            <div className="sheet-body">
              {heroDone ? (
                <div className="celebrate">
                  <div className="spin" style={{fontSize:"3.5rem"}}>💥</div>
                  <div className="comic pop">Time's up, {K.name}!</div>
                  <div style={{fontWeight:900,marginTop:"6px"}}>Hero hustle complete — nice work!</div>
                  <button className="btn go" onClick={closeHeroTimer}>Awesome!</button>
                </div>
              ):(
                <>
                  <div className="hero-timer-track" aria-hidden="true">
                    <div className="hero-timer-fill" style={{width: (heroPct * 100) + "%"}} />
                  </div>
                  <svg className="timer-ring hero-timer-ring" width="180" height="180" viewBox="0 0 120 120">
                    <rect x="10" y="10" width="100" height="100" rx="18" fill="none" stroke="#00000022" strokeWidth="10"/>
                    <rect
                      x="10" y="10" width="100" height="100" rx="18" fill="none"
                      stroke="#e08e00" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={400}
                      strokeDashoffset={400 * (1 - heroPct)}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="timer-num hero-timer-num">{mmss(heroSecs)}</div>
                  <div className="brush-tip hero-timer-tip">
                    {heroRunning
                      ? "Superhero music on — keep moving! 🎵"
                      : "Pick a time if you need, then hit start."}
                  </div>
                  {!heroRunning && (
                    <div className="hero-timer-adjust in-modal">
                      <button type="button" className="hero-nudge" onClick={function(){ nudgeHeroDuration(-60); }}>−1m</button>
                      <button type="button" className="hero-nudge" onClick={function(){ nudgeHeroDuration(60); }}>+1m</button>
                    </div>
                  )}
                  {!heroRunning
                    ? <button className="btn go" onClick={function(){ setHeroRunning(true); tune.start(); }}>▶ Start</button>
                    : <button className="btn stop" onClick={function(){ tune.pause(); setHeroRunning(false); }}>⏸ Pause</button>}
                  <button className="btn close" onClick={closeHeroTimer}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- BRUSH-FIRST WHEEL MODAL ---------------- */}
      {modal==="brushWheel" && (
        <div className="modal">
          <div className="sheet brush-wheel-sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head brush-wheel-head">
              <h2 className="comic outline-2">🎡 Who Brushes First?</h2>
            </div>
            <div className="sheet-body">
              <div className="brush-wheel-stage">
                <div className="brush-wheel-pointer" aria-hidden="true">▼</div>
                <div className="brush-wheel-disc-wrap">
                  <div
                    className={"brush-wheel-disc"+(wheelSpinning?" is-spinning":"")}
                    style={{
                      WebkitTransform: "rotate("+wheelRot+"deg)",
                      transform: "rotate("+wheelRot+"deg)"
                    }}
                    onTransitionEnd={onBrushWheelTransitionEnd}
                  >
                    {BRUSH_WHEEL_ORDER.map(function(key, i){
                      const k = KIDS[key];
                      const ang = i * 120 + 60;
                      return (
                        <div
                          key={key}
                          className="brush-wheel-slice-label"
                          style={{
                            WebkitTransform: "rotate("+ang+"deg) translateY(-78px)",
                            transform: "rotate("+ang+"deg) translateY(-78px)"
                          }}
                        >
                          <span className="brush-wheel-slice-badge">{k.badge}</span>
                          <span className="brush-wheel-slice-name">{k.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="brush-wheel-hub" aria-hidden="true">🪥</div>
                </div>
              </div>

              {wheelWinner ? (
                <div className="celebrate brush-wheel-result">
                  <Slot
                    src={IMAGES[KIDS[wheelWinner].img]}
                    label={KIDS[wheelWinner].name}
                    className="brush-wheel-winner-face"
                  />
                  <div className="comic pop" style={{color:KIDS[wheelWinner].colour}}>
                    {KIDS[wheelWinner].name} goes first!
                  </div>
                  <div style={{fontWeight:900,marginTop:"4px"}}>
                    Fair and square {KIDS[wheelWinner].badge}
                  </div>
                  <button
                    className="btn go"
                    type="button"
                    onClick={function(){
                      setModal(null);
                      openTimer(EVERYDAY_JOBS[0]);
                    }}
                  >
                    🪥 Start brushing
                  </button>
                  <button
                    className="btn hist"
                    type="button"
                    onClick={function(){
                      setWheelWinner(null);
                      wheelWinnerIdxRef.current = null;
                    }}
                  >
                    Spin again
                  </button>
                  <button className="btn close" type="button" onClick={closeBrushWheel}>Done</button>
                </div>
              ) : (
                <>
                  <div className="brush-tip">
                    {wheelSpinning
                      ? "Round and round — who will it be?!"
                      : "Tap spin for a fair pick. Equal chance for everyone!"}
                  </div>
                  <button
                    className="btn go"
                    type="button"
                    disabled={wheelSpinning}
                    onClick={spinBrushWheel}
                  >
                    {wheelSpinning ? "Spinning…" : "🎡 SPIN!"}
                  </button>
                  <button className="btn close" type="button" disabled={wheelSpinning} onClick={closeBrushWheel}>
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- COIN DROP MINI-GAME ---------------- */}
      {modal==="coinDrop" && pendingReward && (
        <CoinDropGame
          kid={Object.assign({}, KIDS[pendingReward.kidId] || K, {id: pendingReward.kidId || kid})}
          reward={pendingReward}
          tiltControlsEnabled={settings.tiltControlsEnabled !== false}
          awardReward={completePendingReward}
          onComplete={handleCoinDropComplete}
          onClose={handleCoinDropComplete}
        />
      )}

      {/* ---------------- COIN CHASE MINI-GAME ---------------- */}
      {modal==="coinChase" && pendingReward && (
        <CoinChaseGame
          kid={Object.assign({}, KIDS[pendingReward.kidId] || K, {id: pendingReward.kidId || kid})}
          reward={pendingReward}
          awardReward={completePendingReward}
          onComplete={handleCoinDropComplete}
          onClose={handleCoinDropComplete}
        />
      )}

      {/* ---------------- MAZE DASH MINI-GAME ---------------- */}
      {modal==="mazeDash" && pendingReward && (
        <MazeDashGame
          kid={Object.assign({}, KIDS[pendingReward.kidId] || K, {id: pendingReward.kidId || kid})}
          reward={pendingReward}
          awardReward={completePendingReward}
          onComplete={handleCoinDropComplete}
          onClose={handleCoinDropComplete}
        />
      )}

      {/* ---------------- COIN BLASTER MINI-GAME ---------------- */}
      {modal==="coinBlaster" && pendingReward && (
        <CoinBlasterGame
          kid={Object.assign({}, KIDS[pendingReward.kidId] || K, {id: pendingReward.kidId || kid})}
          reward={pendingReward}
          awardReward={completePendingReward}
          onComplete={handleCoinDropComplete}
          onClose={handleCoinDropComplete}
        />
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

      {/* ---------------- PROFILE MODAL ---------------- */}
      {modal==="profile" && (
        <div className="modal" onClick={()=>setModal(null)}>
          <div className="sheet profile-sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head" style={{background:K.colour}}>
              <h2 className="comic outline-2">🏅 {K.name}'s Profile</h2>
            </div>
            <div className="sheet-body">
              <div className="profile-hero">
                <Slot src={IMAGES[K.img]} label={K.name} className="profile-portrait"/>
                <div>
                  <div className="comic profile-name">{K.name} {K.badge}</div>
                  <div className="profile-bal">🪙 {coins[kid]} coins</div>
                </div>
              </div>

              <div className="stats-strip">
                <div className="stat"><div className="stat-n">{profileStats.earned}</div><div className="stat-l">Earned</div></div>
                <div className="stat"><div className="stat-n">{profileStats.spent}</div><div className="stat-l">Spent</div></div>
                <div className="stat"><div className="stat-n">{profileStats.jobsDone}</div><div className="stat-l">Jobs</div></div>
                <div className="stat"><div className="stat-n">{trophyOwned.length}</div><div className="stat-l">Trophies</div></div>
              </div>

              <div className="band gold comic">★ Trophies ★</div>
              <div className="trophy-grid">
                {trophyOwned.map(function(t){
                  return (
                    <div key={t.id} className="trophy-tile earned">
                      <div className="trophy-ico">{t.icon}</div>
                      <div className="trophy-name">{t.name}</div>
                    </div>
                  );
                })}
                {(function(){
                  const slots = [];
                  for(var i = 0; i < lockedTrophySlots; i++){
                    slots.push(
                      <div key={"locked-"+i} className="trophy-tile locked">
                        <div className="trophy-ico">❓</div>
                        <div className="trophy-name">???</div>
                      </div>
                    );
                  }
                  return slots;
                })()}
                {trophyOwned.length === 0 && lockedTrophySlots === 0 && (
                  <div className="empty-note">Keep being a hero — surprises await!</div>
                )}
              </div>

              <div className="band purple comic">★ Power-ups ★</div>
              <div className="power-list">
                {powerOwned.length === 0 && (
                  <div className="empty-note">No power-ups yet — keep earning!</div>
                )}
                {powerOwned.map(function(p){
                  return (
                    <div key={p.id} className={"power-row "+(p.used?"used":"")}>
                      <div className="power-ico">{p.icon}</div>
                      <div className="power-text">
                        <div className="power-name">{p.name}</div>
                        <div className="power-blurb">{p.blurb}</div>
                      </div>
                      {p.used
                        ? <span className="used-badge">Used</span>
                        : <button className="btn use-btn" type="button" onClick={()=>usePowerup(p.id)}>Use</button>}
                    </div>
                  );
                })}
              </div>

              <button className="btn hist" onClick={()=>setModal("history")}>📋 View History</button>
              <button className="btn close" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- UNLOCK CELEBRATION ---------------- */}
      {modal==="unlock" && celebrating && celebrateMeta && (
        <div className="modal unlock-modal">
          <div className="sheet unlock-sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-head" style={{background:KIDS[celebrating.slug || kid].colour}}>
              <h2 className="comic outline-2">
                {celebrateMeta.type === "powerup" ? "⚡ Power-up!" : "🏆 Trophy!"}
              </h2>
            </div>
            <div className="sheet-body unlock-body">
              <div className="unlock-burst">{celebrateMeta.icon}</div>
              <div className="comic unlock-title pop">{celebrateMeta.name}</div>
              <div className="unlock-sub">
                Amazing work, {KIDS[celebrating.slug || kid].name}!
                {celebrateMeta.type === "powerup"
                  ? " A power-up is waiting on your profile."
                  : " It's yours forever — check your profile!"}
              </div>
              <button className="btn go" onClick={dismissUnlock}>
                {unlockQueue.length > 1 ? "Next surprise!" : "Awesome!"}
              </button>
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
              <div className="settings-note" style={{marginTop:"8px"}}>
                Sync: {cloud==="online" ? "☁ Shared (Supabase)" : cloud==="syncing" ? "☁ Connecting…" : cloud==="offline" ? "⚠ Offline — this device only" : "📱 This device only"}
              </div>
              <div className="settings-note">
                Unlocks: {(unlocks[kid]||[]).length} · Boosts: 2×{kidBoost.doubleEarnsLeft}{kidBoost.freeSwitch?" · Free Switch":""}
              </div>

              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.coinDropEnabled !== false}
                  onChange={function(e){
                    setSettings(function(s){
                      return Object.assign({}, s, {coinDropEnabled: e.target.checked});
                    });
                  }}
                />
                <span>
                  <strong>Brushing reward games</strong>
                  <em>After brushing, rotate Coin Drop, Coin Chase, and Maze Dash. Coin is always kept.</em>
                </span>
              </label>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.tiltControlsEnabled !== false}
                  onChange={function(e){
                    setSettings(function(s){
                      return Object.assign({}, s, {tiltControlsEnabled: e.target.checked});
                    });
                  }}
                />
                <span>
                  <strong>Tilt controls</strong>
                  <em>Use device tilt in Coin Drop when available.</em>
                </span>
              </label>

              <button className="btn go" type="button" onClick={launchTestCoinDrop}>
                ▶ Play test drop ({K.name})
              </button>
              <div className="settings-note" style={{marginTop:"-4px"}}>
                Practice only — opens Coin Drop now, does not add coins.
              </div>
              <button className="btn go" type="button" onClick={launchTestCoinChase}>
                ▶ Play test chase ({K.name})
              </button>
              <div className="settings-note" style={{marginTop:"-4px"}}>
                Practice only — opens Coin Chase now, does not add coins.
              </div>
              <button className="btn go" type="button" onClick={launchTestMazeDash}>
                ▶ Play test dash ({K.name})
              </button>
              <div className="settings-note" style={{marginTop:"-4px"}}>
                Practice only — opens Maze Dash now, does not add coins.
              </div>
              <button className="btn go" type="button" onClick={launchTestCoinBlaster}>
                ▶ Play test blaster ({K.name})
              </button>
              <div className="settings-note" style={{marginTop:"-4px"}}>
                Practice only — opens Coin Blaster now, does not add coins.
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
