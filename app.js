function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* Small polyfills for iOS 10–12 Safari and older smart-TV Chromium */
(function () {
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(typeof padString !== "undefined" ? padString : " ");
      if (this.length >= targetLength) return String(this);
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat ? padString.repeat(targetLength / padString.length) : Array(targetLength + 1).join(padString);
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
      var own = Object.keys(obj),
        i = 0,
        out = [];
      for (; i < own.length; i++) out.push([own[i], obj[own[i]]]);
      return out;
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, from) {
      return this.indexOf(search, from || 0) !== -1;
    };
  }
  if (typeof window !== "undefined" && window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.ellipse) {
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
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useMemo = _React.useMemo;

/* =====================================================================
   IMAGE SLOTS — paste a URL (or a local file path like "img/sam.png")
   next to any key below and it replaces the dashed placeholder box.
   Leave "" to keep the placeholder visible.
   ===================================================================== */
var IMAGES = {
  logo: "/img/logo.png",
  // Hero Coins logo (transparent PNG)
  heroSam: "/img/sam.png",
  // Sam portrait (used in selector + bottom strip)
  heroIsaac: "/img/isaac.png",
  heroBen: "/img/ben.png",
  jobs: {
    "brush-am": "/img/brush.png",
    "brush-pm": "/img/brush-pm.png",
    "bed": "/img/bed.png",
    "dressed": "/img/dressed.png",
    "homework": "/img/homework.png",
    "sit": "/img/sit.png",
    "dinner": "/img/dinner.png",
    "calm-read": "/img/calm-read.png?v=2",
    "read-words": "/img/read-words.png?v=2",
    "bedtime": "/img/bedtime.png?v=2",
    "tidy": "/img/tidy.png",
    "cook": "/img/cook.png",
    "club": "/img/club.png",
    "kind": "/img/kind.png",
    "recycling": "/img/recycling.png?v=2",
    "hoover": "/img/hoover.png?v=2",
    "glass-tables": "/img/glass-tables.png?v=2",
    "skirting": "/img/skirting.png?v=2",
    "try-new": "/img/try-new.png"
  },
  shop: {
    "tv": "/img/tv.png",
    "screentime": "/img/screentime.png",
    "snack": "/img/snack.png",
    "movie": "/img/movie.png",
    "switch15": "/img/switch15.png",
    "switch30": "/img/switch30.png",
    "tax": "/img/tax.png",
    "toy-small": "/img/toy-small.png",
    "park": "/img/park.png",
    "late": "/img/late.png",
    "dayout": "/img/dayout.png",
    "toy-big": "/img/toy-big.png",
    "cinema": "/img/cinema.png"
  }
};

/* ---------- data ---------- */
var KIDS = {
  sam: {
    name: "Sam",
    cls: "h-sam",
    colour: "#ff8c00",
    img: "heroSam",
    badge: "⚡"
  },
  isaac: {
    name: "Isaac",
    cls: "h-isaac",
    colour: "#5aa9ff",
    img: "heroIsaac",
    badge: "⭐"
  },
  ben: {
    name: "Ben",
    cls: "h-ben",
    colour: "#ff3b3b",
    img: "heroBen",
    badge: "✊"
  }
};
var EVERYDAY_JOBS = [{
  id: "brush-am",
  name: "Brush teeth",
  sub: "Morning",
  coins: 1,
  timer: true
}, {
  id: "brush-pm",
  name: "Brush teeth",
  sub: "Night",
  coins: 1,
  timer: true
}, {
  id: "bed",
  name: "Make your bed",
  coins: 1
}, {
  id: "dressed",
  name: "Get dressed on time",
  coins: 1
}, {
  id: "homework",
  name: "Homework, no fuss",
  coins: 2
}, {
  id: "sit",
  name: "Sit nicely at the table",
  coins: 1,
  icon: "🪑"
}, {
  id: "dinner",
  name: "Eat your dinner",
  coins: 1,
  icon: "🍽️"
}, {
  id: "calm-read",
  name: "Calm reading",
  sub: "At bedtime",
  coins: 2
}, {
  id: "read-words",
  name: "Reading words",
  sub: "At bedtime",
  coins: 2
}, {
  id: "bedtime",
  name: "Going to bed on time",
  coins: 2
}];
var BONUS_JOBS = [{
  id: "tidy",
  name: "Tidy your room",
  coins: 3
}, {
  id: "cook",
  name: "Help cook or set the table",
  coins: 2
}, {
  id: "club",
  name: "Go to a club or activity",
  coins: 3
}, {
  id: "kind",
  name: "Be kind & helpful",
  coins: 2
}, {
  id: "recycling",
  name: "Taking the recycling out",
  coins: 2
}, {
  id: "hoover",
  name: "Hoovering properly",
  coins: 3
}, {
  id: "glass-tables",
  name: "Cleaning glass tables",
  sub: "Properly",
  coins: 2
}, {
  id: "skirting",
  name: "Cleaning skirting",
  coins: 2
}, {
  id: "try-new",
  name: "Try new things",
  coins: 2
}];
var EVERYDAY_SHOP = [{
  id: "tv",
  name: "Breakfast TV",
  sub: "15 minutes",
  coins: 1
}, {
  id: "screentime",
  name: "Screen Time",
  sub: "30 minutes",
  coins: 1
}, {
  id: "snack",
  name: "Choose a special snack",
  coins: 5
}, {
  id: "movie",
  name: "Friday Movie Night",
  sub: "pick the film",
  coins: 5
}];
var WEEKEND_SHOP = [{
  id: "switch15",
  name: "Nintendo Switch",
  sub: "15 minutes",
  coins: 3
}, {
  id: "switch30",
  name: "Nintendo Switch",
  sub: "30 minutes",
  coins: 5
}];
var SAVINGS_SHOP = [{
  id: "toy-small",
  name: "Small toy",
  coins: 50
}, {
  id: "park",
  name: "Park trip + snack",
  coins: 75
}, {
  id: "late",
  name: "Stay up later",
  sub: "30 minutes",
  coins: 80
}, {
  id: "dayout",
  name: "Day out",
  coins: 150
}, {
  id: "toy-big",
  name: "Bigger toy",
  coins: 200
}, {
  id: "cinema",
  name: "Cinema trip",
  sub: "all three boys",
  coins: 250
}];

/* Secret milestone trophies (titles only revealed on unlock / profile) */
var TROPHIES = [{
  id: "kind-5",
  name: "Kind Heart",
  icon: "💛",
  check: function check(s) {
    return s.count.kind >= 5;
  }
}, {
  id: "kind-15",
  name: "Super Helper",
  icon: "🌟",
  check: function check(s) {
    return s.count.kind >= 15;
  }
}, {
  id: "brush-10",
  name: "Brush Boss",
  icon: "🪥",
  check: function check(s) {
    return s.brushTotal >= 10;
  }
}, {
  id: "bed-7",
  name: "Bed Maker",
  icon: "🛏️",
  check: function check(s) {
    return s.count.bed >= 7;
  }
}, {
  id: "homework-5",
  name: "Homework Champ",
  icon: "📚",
  check: function check(s) {
    return s.count.homework >= 5;
  }
}, {
  id: "tidy-5",
  name: "Tidy Titan",
  icon: "🧹",
  check: function check(s) {
    return s.count.tidy >= 5;
  }
}, {
  id: "cook-5",
  name: "Kitchen Hero",
  icon: "👨‍🍳",
  check: function check(s) {
    return s.count.cook >= 5;
  }
}, {
  id: "club-3",
  name: "Club Kid",
  icon: "⚽",
  check: function check(s) {
    return s.count.club >= 3;
  }
}, {
  id: "earned-50",
  name: "Coin Collector",
  icon: "🏆",
  check: function check(s) {
    return s.earned >= 50;
  }
}, {
  id: "balance-50",
  name: "Big Saver",
  icon: "🏦",
  check: function check(s) {
    return s.balance >= 50;
  }
}, {
  id: "first-spend",
  name: "First Treat",
  icon: "🎁",
  check: function check(s) {
    return s.spentCount >= 1;
  }
}];

/* Usable power-ups — unlocked secretly, activated from the profile */
var POWERUPS = [{
  id: "double-3",
  name: "Double Coin Burst",
  icon: "⚡",
  effect: "double",
  blurb: "Next 3 earns give double coins!",
  check: function check(s) {
    return s.earned >= 20;
  }
}, {
  id: "free-switch",
  name: "Free Switch Pass",
  icon: "🎮",
  effect: "freeSwitch",
  blurb: "One free Nintendo Switch (15 min)!",
  check: function check(s) {
    return s.switchSpends >= 5 || s.earned >= 30;
  }
}, {
  id: "coin-boost",
  name: "Coin Drop",
  icon: "🪙",
  effect: "coinDrop",
  blurb: "Tap Use for an instant +5 coins!",
  check: function check(s) {
    return s.count.kind >= 10;
  }
}, {
  id: "extra-drop",
  name: "Bonus Drop",
  icon: "🎯",
  effect: "playCoinDrop",
  blurb: "Play the coin drop game once — no brushing needed!",
  check: function check(s) {
    return s.brushTotal >= 5;
  }
}];
var ALL_REWARDS = TROPHIES.map(function (t) {
  return Object.assign({}, t, {
    type: "trophy"
  });
}).concat(POWERUPS.map(function (p) {
  return Object.assign({}, p, {
    type: "powerup"
  });
}));
var REWARD_BY_ID = {};
ALL_REWARDS.forEach(function (r) {
  REWARD_BY_ID[r.id] = r;
});

/* Infer source from older log descriptions that lack a source field */
var DESC_SOURCE = {
  "Brush teeth (Morning)": "brush-am",
  "Brush teeth (Night)": "brush-pm",
  "Make your bed": "bed",
  "Get dressed on time": "dressed",
  "Homework, no fuss": "homework",
  "Sit nicely at the table": "sit",
  "Eat your dinner": "dinner",
  "Calm reading (At bedtime)": "calm-read",
  "Reading words (At bedtime)": "read-words",
  "Going to bed on time": "bedtime",
  "Tidy your room": "tidy",
  "Help cook or set the table": "cook",
  "Go to a club or activity": "club",
  "Be kind & helpful": "kind",
  "Taking the recycling out": "recycling",
  "Hoovering properly": "hoover",
  "Cleaning glass tables (Properly)": "glass-tables",
  "Cleaning skirting": "skirting",
  "Breakfast TV": "tv",
  "Screen Time": "screentime",
  "Choose a special snack": "snack",
  "Friday Movie Night": "movie",
  "Nintendo Switch": "switch15",
  "Mum's Food Tax": "tax",
  "Small toy": "toy-small",
  "Park trip + snack": "park",
  "Stay up later": "late",
  "Day out": "dayout",
  "Bigger toy": "toy-big",
  "Cinema trip": "cinema"
};
var JOB_SOURCES = {
  "brush-am": 1,
  "brush-pm": 1,
  "bed": 1,
  "dressed": 1,
  "homework": 1,
  "sit": 1,
  "dinner": 1,
  "calm-read": 1,
  "read-words": 1,
  "bedtime": 1,
  "tidy": 1,
  "cook": 1,
  "club": 1,
  "kind": 1,
  "recycling": 1,
  "hoover": 1,
  "glass-tables": 1,
  "skirting": 1
};

/* ---------- image placeholder component ---------- */
function Slot(_ref) {
  var src = _ref.src,
    label = _ref.label,
    className = _ref.className,
    style = _ref.style,
    light = _ref.light,
    icon = _ref.icon;
  return /*#__PURE__*/React.createElement("div", {
    className: "slot " + (src ? "has-img " : "") + (light ? "light " : "") + (className || ""),
    style: style
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label
  }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "slot-ico" + (icon ? " emoji" : "")
  }, icon || "🖼️"), !icon && /*#__PURE__*/React.createElement("div", {
    className: "slot-label"
  }, label)));
}
function CoinBtn(_ref2) {
  var value = _ref2.value,
    word = _ref2.word,
    tone = _ref2.tone,
    onClick = _ref2.onClick,
    disabled = _ref2.disabled;
  return /*#__PURE__*/React.createElement("button", {
    className: "coin-btn " + (tone || ""),
    onClick: onClick,
    disabled: disabled
  }, /*#__PURE__*/React.createElement("span", {
    className: "cnum"
  }, value), /*#__PURE__*/React.createElement("span", {
    className: "cword"
  }, word || (value === 1 ? "COIN" : "COINS")));
}

/* ---------- brushing soundtrack (real MP3 + short win jingle) ---------- */
var BRUSH_TRACK = "/audio/brushing.mp3";
function useBrushingTune() {
  var audioRef = useRef(null);
  var ensure = function ensure() {
    if (!audioRef.current) {
      var a = new Audio(BRUSH_TRACK);
      a.loop = true;
      a.preload = "auto";
      audioRef.current = a;
    }
    return audioRef.current;
  };
  var start = function start() {
    try {
      var a = ensure();
      var play = a.play();
      if (play && typeof play.catch === "function") play.catch(function () {});
    } catch (e) {}
  };
  var pause = function pause() {
    try {
      if (audioRef.current) audioRef.current.pause();
    } catch (e) {}
  };
  var stop = function stop() {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (e) {}
  };
  var fanfare = function fanfare() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      var ctx = new AC();
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, n) {
        var o = ctx.createOscillator();
        o.type = "square";
        o.frequency.value = f;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, ctx.currentTime + n * 0.12);
        g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + n * 0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n * 0.12 + 0.5);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + n * 0.12);
        o.stop(ctx.currentTime + n * 0.12 + 0.55);
      });
      setTimeout(function () {
        try {
          ctx.close();
        } catch (e) {}
      }, 1800);
    } catch (e) {}
  };
  return {
    start,
    pause,
    stop,
    fanfare
  };
}

/* ---------- persistence: localStorage cache + shared Supabase project ---------- */
var STORAGE_KEY = "coin-chart-v2";
var DEFAULT_COINS = {
  sam: 0,
  isaac: 0,
  ben: 0
};
var DEFAULT_LOG = {
  sam: [],
  isaac: [],
  ben: []
};
function emptyLog() {
  return {
    sam: [],
    isaac: [],
    ben: []
  };
}
function emptyUnlocks() {
  return {
    sam: [],
    isaac: [],
    ben: []
  };
}
function defaultBoost() {
  return {
    doubleEarnsLeft: 0,
    freeSwitch: false
  };
}
function emptyBoosts() {
  return {
    sam: defaultBoost(),
    isaac: defaultBoost(),
    ben: defaultBoost()
  };
}
function normalizeUnlockList(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(function (u) {
    return u && u.id;
  }).map(function (u) {
    return {
      id: u.id,
      type: u.type === "powerup" ? "powerup" : "trophy",
      used: !!u.used,
      at: u.at || u.unlocked_at || new Date().toISOString(),
      remoteId: u.remoteId || null
    };
  });
}
function defaultSettings() {
  return {
    coinDropEnabled: true,
    tiltControlsEnabled: true,
    lastBrushGame: "coinDrop"
  };
}
function normalizeSettings(raw) {
  var base = defaultSettings();
  if (!raw || _typeof(raw) !== "object") return base;
  var last = "coinDrop";
  if (raw.lastBrushGame === "coinChase") last = "coinChase";else if (raw.lastBrushGame === "mazeDash") last = "mazeDash";
  return {
    coinDropEnabled: raw.coinDropEnabled !== false,
    tiltControlsEnabled: raw.tiltControlsEnabled !== false,
    lastBrushGame: last
  };
}
function nextBrushGame(last) {
  if (last === "coinDrop") return "coinChase";
  if (last === "coinChase") return "mazeDash";
  return "coinDrop";
}
function isPracticeBrushSource(source) {
  return source === "test-drop" || source === "test-chase" || source === "test-dash";
}
function normalizePendingReward(raw) {
  if (!raw || _typeof(raw) !== "object" || !raw.rewardId || !raw.kidId) return null;
  if (!KIDS[raw.kidId]) return null;
  return {
    rewardId: String(raw.rewardId),
    kidId: raw.kidId,
    amount: Math.max(1, Number(raw.amount) || 1),
    description: raw.description || "Brush teeth",
    source: raw.source || "brush-am",
    createdAt: raw.createdAt || new Date().toISOString(),
    awarded: !!raw.awarded
  };
}
function makeRewardId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch (e) {}
  return "rw-" + Date.now() + "-" + Math.floor(Math.random() * 1e9);
}
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) {
    return false;
  }
}
function playCoinSfx(kind, enabled) {
  if (enabled === false) return;
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    var now = ctx.currentTime;
    if (kind === "whoosh") {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(420, now);
      o.frequency.exponentialRampToValueAtTime(120, now + 0.28);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.32);
    } else if (kind === "peg") {
      var _o = ctx.createOscillator();
      var _g = ctx.createGain();
      _o.type = "square";
      _o.frequency.value = 880 + Math.random() * 120;
      _g.gain.setValueAtTime(0.0001, now);
      _g.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
      _g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      _o.connect(_g);
      _g.connect(ctx.destination);
      _o.start(now);
      _o.stop(now + 0.1);
    } else if (kind === "vault") {
      [660, 880, 1046, 1318].forEach(function (f, i) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        var t = now + i * 0.08;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.3);
      });
    } else if (kind === "side") {
      [520, 660].forEach(function (f, i) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        var t = now + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.22);
      });
    }
    setTimeout(function () {
      try {
        ctx.close();
      } catch (e) {}
    }, 900);
  } catch (e) {}
}
function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        kid: "sam",
        coins: Object.assign({}, DEFAULT_COINS),
        log: emptyLog(),
        unlocks: emptyUnlocks(),
        boosts: emptyBoosts(),
        settings: defaultSettings(),
        pendingReward: null
      };
    }
    var parsed = JSON.parse(raw);
    var boosts = emptyBoosts();
    Object.keys(KIDS).forEach(function (slug) {
      var b = parsed.boosts && parsed.boosts[slug] || {};
      boosts[slug] = {
        doubleEarnsLeft: Math.max(0, Number(b.doubleEarnsLeft) || 0),
        freeSwitch: !!b.freeSwitch
      };
    });
    return {
      kid: parsed.kid && KIDS[parsed.kid] ? parsed.kid : "sam",
      coins: Object.assign({}, DEFAULT_COINS, parsed.coins || {}),
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
  } catch (e) {
    return {
      kid: "sam",
      coins: Object.assign({}, DEFAULT_COINS),
      log: emptyLog(),
      unlocks: emptyUnlocks(),
      boosts: emptyBoosts(),
      settings: defaultSettings(),
      pendingReward: null
    };
  }
}
function getSbConfig() {
  var c = window.COIN_CHART_CONFIG || {};
  return {
    url: String(c.supabaseUrl || "").replace(/\/$/, ""),
    key: String(c.supabaseAnonKey || "")
  };
}
function supabaseReady() {
  var c = getSbConfig();
  return !!(c.url && c.key && typeof fetch === "function");
}
function sbHeaders(extra) {
  var c = getSbConfig();
  var h = {
    apikey: c.key,
    Authorization: "Bearer " + c.key,
    "Content-Type": "application/json"
  };
  if (extra) Object.assign(h, extra);
  return h;
}
function sbFetch(path, opts) {
  var c = getSbConfig();
  return fetch(c.url + "/rest/v1/" + path, opts).then(function (res) {
    if (!res.ok) {
      return res.text().then(function (t) {
        throw new Error(res.status + " " + (t || res.statusText));
      });
    }
    if (res.status === 204) return null;
    var ct = res.headers.get("content-type") || "";
    if (ct.indexOf("json") >= 0) return res.json();
    return null;
  });
}
function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString("en-GB");
  } catch (e) {
    return String(iso || "");
  }
}
function totalCoins(coins) {
  return (coins.sam || 0) + (coins.isaac || 0) + (coins.ben || 0);
}
function logCount(log) {
  return (log.sam || []).length + (log.isaac || []).length + (log.ben || []).length;
}
function isLocalId(id) {
  return !id || String(id).indexOf("local-") === 0;
}
function hasUnsyncedLog(log) {
  return Object.keys(KIDS).some(function (slug) {
    return (log[slug] || []).some(function (e) {
      return isLocalId(e.id);
    });
  });
}
function localIsAhead(localCoins, localLog, remoteCoins, remoteLog) {
  if (hasUnsyncedLog(localLog)) return true;
  return Object.keys(KIDS).some(function (slug) {
    return (localCoins[slug] || 0) > (remoteCoins[slug] || 0);
  }) || totalCoins(localCoins) > totalCoins(remoteCoins) || logCount(localLog) > logCount(remoteLog) && totalCoins(localCoins) >= totalCoins(remoteCoins);
}
function entrySource(e) {
  if (e && e.source) return e.source;
  if (e && e.desc && DESC_SOURCE[e.desc]) return DESC_SOURCE[e.desc];
  if (e && e.desc && e.desc.indexOf("Nintendo Switch") === 0) {
    if (e.desc.indexOf("30") >= 0) return "switch30";
    return "switch15";
  }
  return null;
}
function kidStats(slug, log, coins) {
  var entries = log && log[slug] || [];
  var count = {};
  var earned = 0;
  var spent = 0;
  var spentCount = 0;
  var jobsDone = 0;
  var brushTotal = 0;
  var switchSpends = 0;
  entries.forEach(function (e) {
    var src = entrySource(e);
    if (e.type === "earned") {
      earned += Number(e.amount) || 0;
      if (src && JOB_SOURCES[src]) {
        jobsDone += 1;
        count[src] = (count[src] || 0) + 1;
        if (src === "brush-am" || src === "brush-pm") brushTotal += 1;
      } else if (src) {
        count[src] = (count[src] || 0) + 1;
      }
    } else if (e.type === "spent") {
      spent += Number(e.amount) || 0;
      spentCount += 1;
      if (src) {
        count[src] = (count[src] || 0) + 1;
        if (src === "switch15" || src === "switch30") switchSpends += 1;
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
    balance: coins && coins[slug] || 0
  };
}
function findNewUnlocks(slug, log, coins, ownedIds) {
  var stats = kidStats(slug, log, coins);
  var fresh = [];
  ALL_REWARDS.forEach(function (reward) {
    if (ownedIds[reward.id]) return;
    try {
      if (reward.check(stats)) {
        fresh.push({
          id: reward.id,
          type: reward.type,
          used: false,
          at: new Date().toISOString()
        });
      }
    } catch (err) {}
  });
  return fresh;
}

/* ---------- Coin Drop mini-game (brushing reward collection) ---------- */
var CD_W = 360;
var CD_H = 520;
var CD_GRAVITY = 0.2;
var CD_AIR = 0.997;
var CD_BOUNCE = 0.82;
var CD_MAX_SPEED = 10;
var CD_TILT = 0.028;
var CD_LANDING_Y = 448;
var CD_MAX_MS = 15000;
var CD_JUMP_VY = -6.2;
var CD_JUMP_COOLDOWN_MS = 380;
var CD_STUCK_SPEED = 0.42;
var CD_STUCK_FRAMES = 28;
var CD_PEGS = [{
  x: 90,
  y: 110,
  r: 8
}, {
  x: 180,
  y: 110,
  r: 8
}, {
  x: 270,
  y: 110,
  r: 8
}, {
  x: 60,
  y: 165,
  r: 8
}, {
  x: 135,
  y: 165,
  r: 8
}, {
  x: 225,
  y: 165,
  r: 8
}, {
  x: 300,
  y: 165,
  r: 8
}, {
  x: 90,
  y: 220,
  r: 8
}, {
  x: 180,
  y: 220,
  r: 8
}, {
  x: 270,
  y: 220,
  r: 8
}, {
  x: 120,
  y: 275,
  r: 8
}, {
  x: 240,
  y: 275,
  r: 8
}, {
  x: 70,
  y: 330,
  r: 8
}, {
  x: 180,
  y: 330,
  r: 8
}, {
  x: 290,
  y: 330,
  r: 8
}];
var CD_BUMPERS = [{
  x1: 28,
  y1: 240,
  x2: 130,
  y2: 275,
  thickness: 10
}, {
  x1: 332,
  y1: 240,
  x2: 230,
  y2: 275,
  thickness: 10
}, {
  x1: 50,
  y1: 370,
  x2: 150,
  y2: 400,
  thickness: 9
}];
function cdZoneForX(x) {
  if (x < 115) return "left";
  if (x > 245) return "right";
  return "vault";
}
function cdZoneLabel(zone) {
  if (zone === "left") return "STILL IN!";
  if (zone === "right") return "COIN SAVED!";
  return "SUPER DROP!";
}
function cdZoneSub(zone) {
  if (zone === "vault") return "Banked in the vault — amazing!";
  return "Your coin is safe either way!";
}
function cdZoneCheer(zone) {
  if (zone === "vault") return "Well done!";
  return "Coin saved!";
}
function cdZoneIsVault(zone) {
  return zone === "vault";
}
function cdThemeForKid(kid) {
  var id = kid && kid.id;
  if (id === "sam") {
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
  if (id === "ben") {
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
function CoinDropGame(props) {
  var kid = props.kid;
  var reward = props.reward;
  var tiltAllowedSetting = props.tiltControlsEnabled !== false;
  var onComplete = props.onComplete;
  var onClose = props.onClose;
  var awardReward = props.awardReward;
  var canvasRef = useRef(null);
  var coinRef = useRef({
    x: CD_W / 2,
    y: 48,
    radius: 18,
    vx: 0,
    vy: 0,
    rotation: 0,
    rotationSpeed: 0,
    active: false,
    landed: false
  });
  var tiltRef = useRef(0);
  var pointerSteerRef = useRef(0);
  var pointerActiveRef = useRef(false);
  var pointerStartXRef = useRef(0);
  var buttonSteerRef = useRef(0);
  var keySteerRef = useRef(0);
  var animationFrameRef = useRef(0);
  var finishedRef = useRef(false);
  var startTimeRef = useRef(0);
  var timeoutRef = useRef(0);
  var particlesRef = useRef([]);
  var moversRef = useRef([{
    x: 90,
    y: 300,
    w: 46,
    h: 18,
    vx: 1.1,
    label: "POW"
  }, {
    x: 220,
    y: 355,
    w: 52,
    h: 18,
    vx: -0.9,
    label: "ZAP"
  }]);
  var pegHitCooldownRef = useRef(0);
  var awardResultRef = useRef(null);
  var reducedRef = useRef(prefersReducedMotion());
  var themeRef = useRef(cdThemeForKid(kid));
  var vaultFlashRef = useRef(0);
  var jumpCooldownRef = useRef(0);
  var stuckFramesRef = useRef(0);
  var jumpFlashRef = useRef(0);
  var _useState = useState("ready"),
    _useState2 = _slicedToArray(_useState, 2),
    gameStage = _useState2[0],
    setGameStage = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    tiltEnabled = _useState4[0],
    setTiltEnabled = _useState4[1];
  var tiltEnabledRef = useRef(false);
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    tiltUnavailable = _useState6[0],
    setTiltUnavailable = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    resultText = _useState8[0],
    setResultText = _useState8[1];
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    resultSub = _useState0[0],
    setResultSub = _useState0[1];
  var _useState1 = useState(null),
    _useState10 = _slicedToArray(_useState1, 2),
    resultCheer = _useState10[0],
    setResultCheer = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    resultVault = _useState12[0],
    setResultVault = _useState12[1];
  var _useState13 = useState(null),
    _useState14 = _slicedToArray(_useState13, 2),
    resultAmount = _useState14[0],
    setResultAmount = _useState14[1];
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    boostFlash = _useState16[0],
    setBoostFlash = _useState16[1];
  var _useState17 = useState(true),
    _useState18 = _slicedToArray(_useState17, 2),
    jumpReady = _useState18[0],
    setJumpReady = _useState18[1];
  themeRef.current = cdThemeForKid(kid);
  var drawBoard = function drawBoard(ctx, coin, movers, particles, bobY) {
    var theme = themeRef.current;
    var g = ctx.createLinearGradient(0, 0, 0, CD_H);
    g.addColorStop(0, theme.top);
    g.addColorStop(1, theme.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CD_W, CD_H);
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#fff";
    for (var hx = 12; hx < CD_W; hx += 18) {
      for (var hy = 12; hy < CD_H - 80; hy += 18) {
        ctx.beginPath();
        ctx.arc(hx + hy / 18 % 2 * 6, hy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.strokeStyle = theme.ray;
    ctx.lineWidth = 2;
    for (var ray = -4; ray <= 4; ray++) {
      ctx.beginPath();
      ctx.moveTo(CD_W / 2, -20);
      ctx.lineTo(CD_W / 2 + ray * 55, CD_H * 0.55);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, 10, CD_H);
    ctx.fillRect(CD_W - 10, 0, 10, CD_H);
    CD_PEGS.forEach(function (p) {
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
    CD_BUMPERS.forEach(function (b) {
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
    movers.forEach(function (m) {
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
    var zonesY = CD_H - 62;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(12, zonesY, 95, 50);
    ctx.fillRect(253, zonesY, 95, 50);
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, zonesY, 95, 50);
    ctx.strokeRect(253, zonesY, 95, 50);
    var flash = vaultFlashRef.current > 0;
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
    particles.forEach(function (pt) {
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    var cy = bobY != null ? bobY : coin.y;
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
    var rg = ctx.createRadialGradient(-6, -6, 2, 0, 0, coin.radius);
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
    if (jumpFlashRef.current > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius + 6 + (8 - jumpFlashRef.current), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255," + jumpFlashRef.current / 10 + ")";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();
  };
  var finishGame = function finishGame(zone) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    coinRef.current.landed = true;
    coinRef.current.active = false;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    var isVault = cdZoneIsVault(zone);
    var theme = themeRef.current;
    setGameStage("landed");
    setResultText(cdZoneLabel(zone));
    setResultSub(cdZoneSub(zone));
    setResultCheer(cdZoneCheer(zone));
    setResultVault(isVault);
    playCoinSfx(isVault ? "vault" : "side", true);
    try {
      if (navigator.vibrate) navigator.vibrate(isVault ? [30, 40, 50, 30] : 30);
    } catch (e) {}
    if (isVault) vaultFlashRef.current = 18;
    var burstCount = isVault ? 36 : 14;
    var burstSpeed = isVault ? 9 : 5;
    for (var i = 0; i < burstCount; i++) {
      particlesRef.current.push({
        x: coinRef.current.x,
        y: coinRef.current.y,
        vx: (Math.random() - 0.5) * burstSpeed,
        vy: (Math.random() - 0.5) * burstSpeed - (isVault ? 3.5 : 1.5),
        r: 2 + Math.random() * (isVault ? 4.5 : 2.5),
        life: 1,
        color: isVault ? Math.random() > 0.45 ? theme.particleA : theme.particleB : Math.random() > 0.5 ? theme.particleB : "#fff"
      });
    }
    var _celebrateTick = function celebrateTick() {
      if (vaultFlashRef.current > 0) vaultFlashRef.current -= 1;
      particlesRef.current = particlesRef.current.filter(function (pt) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        return pt.life > 0;
      });
      var canvas = canvasRef.current;
      if (canvas) {
        drawBoard(canvas.getContext("2d"), coinRef.current, moversRef.current, particlesRef.current, null);
      }
      if (vaultFlashRef.current > 0 || particlesRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(_celebrateTick);
      }
    };
    animationFrameRef.current = requestAnimationFrame(_celebrateTick);
    Promise.resolve(awardReward(reward)).then(function (result) {
      awardResultRef.current = result || null;
      var amt = result && result.amountAwarded != null ? result.amountAwarded : reward.amount || 1;
      setResultAmount(amt);
      setBoostFlash(!!(result && result.boostApplied));
      setTimeout(function () {
        setGameStage("complete");
      }, isVault ? 800 : 550);
    }).catch(function () {
      setResultAmount(reward.amount || 1);
      setTimeout(function () {
        setGameStage("complete");
      }, isVault ? 800 : 550);
    });
  };
  var reflectCircle = function reflectCircle(coin, cx, cy, rad, kick) {
    var dx = coin.x - cx;
    var dy = coin.y - cy;
    var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    var min = coin.radius + rad;
    if (dist >= min) return false;
    var nx = dx / dist;
    var ny = dy / dist;
    var overlap = min - dist;
    coin.x += nx * (overlap + 0.4);
    coin.y += ny * (overlap + 0.4);
    var vn = coin.vx * nx + coin.vy * ny;
    if (vn < 0) {
      coin.vx -= (1 + CD_BOUNCE) * vn * nx;
      coin.vy -= (1 + CD_BOUNCE) * vn * ny;
    }
    var impulse = kick != null ? kick : 0.85;
    coin.vx += nx * impulse + (Math.random() - 0.5) * 0.7;
    coin.vy += ny * impulse + (Math.random() - 0.35) * 0.45;
    coin.rotationSpeed += (Math.random() - 0.5) * 0.28;
    return true;
  };
  var collideBumper = function collideBumper(coin, b) {
    var dx = b.x2 - b.x1;
    var dy = b.y2 - b.y1;
    var len2 = dx * dx + dy * dy || 1;
    var t = ((coin.x - b.x1) * dx + (coin.y - b.y1) * dy) / len2;
    t = clamp(t, 0, 1);
    var px = b.x1 + t * dx;
    var py = b.y1 + t * dy;
    var ox = coin.x - px;
    var oy = coin.y - py;
    var dist = Math.sqrt(ox * ox + oy * oy) || 0.0001;
    var min = coin.radius + b.thickness * 0.45;
    if (dist >= min) return false;
    var nx = ox / dist;
    var ny = oy / dist;
    coin.x += nx * (min - dist + 0.5);
    coin.y += ny * (min - dist + 0.5);
    var vn = coin.vx * nx + coin.vy * ny;
    if (vn < 0) {
      coin.vx -= (1 + CD_BOUNCE) * vn * nx;
      coin.vy -= (1 + CD_BOUNCE) * vn * ny;
    }
    coin.vx += nx * 1.35;
    coin.vy += ny * 1.35 - 0.6;
    coin.rotationSpeed += (Math.random() - 0.5) * 0.25;
    return true;
  };
  var bumpCoin = function bumpCoin(reason) {
    var coin = coinRef.current;
    if (!coin.active || coin.landed || finishedRef.current) return false;
    var now = Date.now();
    if (reason === "jump" && now < jumpCooldownRef.current) return false;
    var steer = pointerActiveRef.current ? pointerSteerRef.current : buttonSteerRef.current || keySteerRef.current || (tiltEnabledRef.current ? tiltRef.current : 0);
    coin.vy = Math.min(coin.vy, 0) + CD_JUMP_VY;
    coin.vx += steer * 2.4 + (Math.random() - 0.5) * 1.2;
    coin.vx = clamp(coin.vx, -CD_MAX_SPEED, CD_MAX_SPEED);
    coin.vy = clamp(coin.vy, -CD_MAX_SPEED, CD_MAX_SPEED);
    coin.y = Math.max(coin.radius + 8, coin.y - 4);
    coin.rotationSpeed += (Math.random() - 0.5) * 0.4;
    stuckFramesRef.current = 0;
    jumpFlashRef.current = 8;
    if (reason === "jump") {
      jumpCooldownRef.current = now + CD_JUMP_COOLDOWN_MS;
      setJumpReady(false);
      setTimeout(function () {
        setJumpReady(true);
      }, CD_JUMP_COOLDOWN_MS);
      playCoinSfx("whoosh", true);
      try {
        if (navigator.vibrate) navigator.vibrate(18);
      } catch (e) {}
    } else {
      playCoinSfx("peg", true);
    }
    return true;
  };
  var _tick = function tick() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var coin = coinRef.current;
    var movers = moversRef.current;
    var now = Date.now();
    movers.forEach(function (m) {
      m.x += m.vx;
      if (m.x < 20 || m.x + m.w > CD_W - 20) m.vx *= -1;
    });
    var bobY = null;
    if (!coin.active && !coin.landed) {
      bobY = coin.y + Math.sin(now / 320) * 4;
    }
    if (jumpFlashRef.current > 0) jumpFlashRef.current -= 1;
    if (coin.active && !coin.landed) {
      var steering = pointerActiveRef.current ? pointerSteerRef.current : buttonSteerRef.current || keySteerRef.current || (tiltEnabledRef.current ? tiltRef.current : 0);
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
      if (coin.x - coin.radius < 10) {
        coin.x = 10 + coin.radius;
        coin.vx = Math.abs(coin.vx) * CD_BOUNCE + 0.4;
      }
      if (coin.x + coin.radius > CD_W - 10) {
        coin.x = CD_W - 10 - coin.radius;
        coin.vx = -Math.abs(coin.vx) * CD_BOUNCE - 0.4;
      }
      var hitPeg = false;
      CD_PEGS.forEach(function (p) {
        if (reflectCircle(coin, p.x, p.y, p.r, 0.95)) hitPeg = true;
      });
      if (hitPeg && now - pegHitCooldownRef.current > 100) {
        pegHitCooldownRef.current = now;
        if (Math.random() < 0.4) playCoinSfx("peg", true);
      }
      CD_BUMPERS.forEach(function (b) {
        collideBumper(coin, b);
      });
      movers.forEach(function (m) {
        var cx = m.x + m.w / 2;
        var cy = m.y + m.h / 2;
        reflectCircle(coin, cx, cy, Math.max(m.w, m.h) * 0.45, 1.2);
      });
      var speed = Math.abs(coin.vx) + Math.abs(coin.vy);
      if (speed < CD_STUCK_SPEED) {
        stuckFramesRef.current += 1;
        if (stuckFramesRef.current >= CD_STUCK_FRAMES) {
          coin.vy = Math.max(coin.vy, 0) + 2.8;
          coin.vx += (Math.random() - 0.5) * 3.2;
          coin.y += 2;
          stuckFramesRef.current = 0;
          playCoinSfx("peg", true);
        }
      } else {
        stuckFramesRef.current = 0;
      }
      if (startTimeRef.current && now - startTimeRef.current > CD_MAX_MS - 1800) {
        var targetX = CD_W / 2;
        coin.vx += (targetX - coin.x) * 0.01;
        coin.vy = Math.max(coin.vy, 2.2);
      }
      if (coin.y + coin.radius >= CD_LANDING_Y) {
        drawBoard(ctx, coin, movers, particlesRef.current, null);
        finishGame(cdZoneForX(coin.x));
        return;
      }
    }
    particlesRef.current = particlesRef.current.filter(function (pt) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12;
      pt.life -= 0.03;
      return pt.life > 0;
    });
    drawBoard(ctx, coin, movers, particlesRef.current, bobY);
    animationFrameRef.current = requestAnimationFrame(_tick);
  };
  var startDrop = function startDrop() {
    if (coinRef.current.active || finishedRef.current) return;
    var coin = coinRef.current;
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
    if (reducedRef.current) {
      var start = Date.now();
      var fromY = coin.y;
      var fromX = coin.x;
      var _ease = function ease() {
        if (finishedRef.current) return;
        var t = clamp((Date.now() - start) / 1100, 0, 1);
        var e = t * t * (3 - 2 * t);
        coin.x = fromX + (CD_W / 2 - fromX) * e;
        coin.y = fromY + (CD_LANDING_Y - coin.radius - fromY) * e;
        var canvas = canvasRef.current;
        if (canvas) drawBoard(canvas.getContext("2d"), coin, moversRef.current, particlesRef.current, null);
        if (t >= 1) {
          finishGame("vault");
          return;
        }
        animationFrameRef.current = requestAnimationFrame(_ease);
      };
      animationFrameRef.current = requestAnimationFrame(_ease);
      return;
    }
    timeoutRef.current = setTimeout(function () {
      if (finishedRef.current) return;
      var c = coinRef.current;
      c.x = CD_W / 2;
      c.y = CD_LANDING_Y - c.radius;
      finishGame("vault");
    }, CD_MAX_MS);
  };
  var enableTiltAndStart = function enableTiltAndStart() {
    if (coinRef.current.active || finishedRef.current) return;
    var allowed = false;
    var finish = function finish() {
      setTiltEnabled(allowed);
      tiltEnabledRef.current = allowed;
      setTiltUnavailable(!allowed);
      startDrop();
    };
    if (tiltAllowedSetting) {
      try {
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
          DeviceOrientationEvent.requestPermission().then(function (result) {
            allowed = result === "granted";
            finish();
          }).catch(function () {
            allowed = false;
            finish();
          });
          return;
        }
        if (typeof DeviceOrientationEvent !== "undefined") {
          allowed = true;
        }
      } catch (e) {
        allowed = false;
      }
    }
    finish();
  };
  useEffect(function () {
    var onOrient = function onOrient(e) {
      var gamma = Number(e.gamma) || 0;
      tiltRef.current = clamp(gamma / 30, -1, 1);
    };
    if (tiltEnabled) {
      window.addEventListener("deviceorientation", onOrient);
    }
    return function () {
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [tiltEnabled]);
  useEffect(function () {
    var onKeyDown = function onKeyDown(e) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        keySteerRef.current = -1;
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        keySteerRef.current = 1;
      } else if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        bumpCoin("jump");
      }
    };
    var onKeyUp = function onKeyUp(e) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keySteerRef.current = 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    animationFrameRef.current = requestAnimationFrame(_tick);
    return function () {
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(timeoutRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      buttonSteerRef.current = 0;
      keySteerRef.current = 0;
    };
  }, []);
  var onPointerDown = function onPointerDown(e) {
    if (gameStage !== "dropping") return;
    pointerActiveRef.current = true;
    pointerStartXRef.current = e.clientX;
    pointerSteerRef.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };
  var onPointerMove = function onPointerMove(e) {
    if (!pointerActiveRef.current) return;
    var deltaX = e.clientX - pointerStartXRef.current;
    pointerSteerRef.current = clamp(deltaX / 80, -1, 1);
  };
  var onPointerUp = function onPointerUp() {
    pointerActiveRef.current = false;
    pointerSteerRef.current = 0;
  };
  var handleClose = function handleClose() {
    if (finishedRef.current) {
      onClose();
      return;
    }
    finishedRef.current = true;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    Promise.resolve(awardReward(reward)).then(function (result) {
      onComplete("vault", result || null);
    }).catch(function () {
      onComplete("vault", null);
    });
  };
  var dismissResult = function dismissResult() {
    onComplete(resultVault ? "vault" : "side", awardResultRef.current);
  };
  var steerHint = tiltUnavailable || !tiltAllowedSetting ? "Slide on the board to steer — or tap ◀ ▶" : "Slide on the board to steer — tilt works too";
  var isPractice = !!(reward && reward.source === "test-drop");
  var showResult = gameStage === "landed" || gameStage === "complete";
  var theme = cdThemeForKid(kid);
  var headTitle = "Bank your coin!";
  if (reward && reward.source === "powerup-extra-drop") headTitle = "Bonus Drop!";else if (isPractice) headTitle = "Test Drop!";
  if (showResult && resultCheer) headTitle = resultCheer;
  var instruct = gameStage === "ready" ? "Slide to steer — JUMP if it sticks" : gameStage === "complete" ? resultVault ? "Tap Done when you're ready" : "Coin kept — tap Done" : steerHint + " · tap JUMP";
  return /*#__PURE__*/React.createElement("div", {
    className: "modal coin-drop-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-sheet kid-" + kid.id,
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic"
  }, headTitle), /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-instructions"
  }, instruct), (tiltUnavailable || !tiltAllowedSetting) && gameStage === "dropping" && /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-toast"
  }, "Tilt unavailable · Slide, JUMP, or use the arrows")), /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-board",
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onPointerCancel: onPointerUp
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "coin-drop-canvas",
    width: CD_W,
    height: CD_H,
    role: "img",
    "aria-label": "Coin drop pinball. Slide to steer, tap JUMP if stuck. You keep your coin either way."
  }), gameStage === "ready" && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-rules",
    "aria-live": "polite",
    style: {
      borderColor: theme.accent
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-rules-title",
    style: {
      color: theme.accent
    }
  }, "How to play"), /*#__PURE__*/React.createElement("ol", {
    className: "coin-drop-rules-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Slide"), " left or right on the board to steer"), /*#__PURE__*/React.createElement("li", null, "Tap ", /*#__PURE__*/React.createElement("strong", null, "JUMP"), " to bump the coin if it gets stuck"), /*#__PURE__*/React.createElement("li", null, "Aim for ", kid.name, "'s gold ", /*#__PURE__*/React.createElement("strong", null, "VAULT"), " — sides still keep your coin")), /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-slide-hint",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "coin-drop-finger"
  }, "👈👉"), /*#__PURE__*/React.createElement("span", null, "Slide · JUMP"))), showResult ? /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-result" + (resultVault ? " is-vault" : " is-side")
  }, /*#__PURE__*/React.createElement("div", {
    className: "comic burst-label"
  }, resultText || "SUPER DROP!"), resultSub && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-sub"
  }, resultSub), boostFlash && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-boost"
  }, "2× POWER-UP!"), isPractice ? /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-amt coin-drop-practice"
  }, "Practice — no coins added") : resultAmount != null && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-amt"
  }, "+", resultAmount, " coin", resultAmount === 1 ? "" : "s")) : null), gameStage === "ready" && /*#__PURE__*/React.createElement("button", {
    className: "btn go coin-drop-start",
    type: "button",
    onClick: enableTiltAndStart
  }, "Drop Coin"), gameStage === "complete" ? /*#__PURE__*/React.createElement("button", {
    className: "btn go coin-drop-done",
    type: "button",
    onClick: dismissResult
  }, resultVault ? "Awesome — Done!" : "Done") : /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow",
    "aria-label": "Steer coin left",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      buttonSteerRef.current = -1;
    },
    onPointerUp: function onPointerUp() {
      buttonSteerRef.current = 0;
    },
    onPointerLeave: function onPointerLeave() {
      buttonSteerRef.current = 0;
    },
    onPointerCancel: function onPointerCancel() {
      buttonSteerRef.current = 0;
    }
  }, "◀ LEFT"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-jump" + (jumpReady ? "" : " is-cooling"),
    "aria-label": "Jump bump the coin",
    disabled: gameStage !== "dropping" || !jumpReady,
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      bumpCoin("jump");
    }
  }, "⬆ JUMP"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow",
    "aria-label": "Steer coin right",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      buttonSteerRef.current = 1;
    },
    onPointerUp: function onPointerUp() {
      buttonSteerRef.current = 0;
    },
    onPointerLeave: function onPointerLeave() {
      buttonSteerRef.current = 0;
    },
    onPointerCancel: function onPointerCancel() {
      buttonSteerRef.current = 0;
    }
  }, "RIGHT ▶")), gameStage !== "complete" && /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    type: "button",
    onClick: handleClose
  }, "Close")));
}

/* ================= COIN CHASE MINI-GAME ================= */
var CC_W = 360;
var CC_H = 420;
var CC_COLS = 11;
var CC_ROWS = 13;
var CC_CELL = 28;
var CC_OX = (CC_W - CC_COLS * CC_CELL) / 2;
var CC_OY = 28;
var CC_SPEED = 2.6;
var CC_TIME_SEC = 35;
var CC_COIN_TARGET = 14;
function ccCellCenter(c, r) {
  return {
    x: CC_OX + c * CC_CELL + CC_CELL / 2,
    y: CC_OY + r * CC_CELL + CC_CELL / 2
  };
}
function ccIsWall(maze, c, r) {
  if (r < 0 || c < 0 || r >= CC_ROWS || c >= CC_COLS) return true;
  return maze[r][c] === 1;
}
function ccShuffleInPlace(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
function ccReachableCells(maze, startC, startR) {
  var seen = {};
  var out = [];
  var q = [{
    c: startC,
    r: startR
  }];
  seen[startC + "," + startR] = true;
  var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  while (q.length) {
    var p = q.shift();
    out.push(p);
    for (var k = 0; k < 4; k++) {
      var nc = p.c + dirs[k][0];
      var nr = p.r + dirs[k][1];
      if (ccIsWall(maze, nc, nr)) continue;
      var key = nc + "," + nr;
      if (seen[key]) continue;
      seen[key] = true;
      q.push({
        c: nc,
        r: nr
      });
    }
  }
  return out;
}

/* Fresh maze + coin set each play (recursive backtracker + a few loops). */
function ccGenerateLayout() {
  var maze = [];
  var r, c, i;
  for (r = 0; r < CC_ROWS; r++) {
    maze[r] = [];
    for (c = 0; c < CC_COLS; c++) maze[r][c] = 1;
  }
  for (r = 1; r < CC_ROWS; r += 2) {
    for (c = 1; c < CC_COLS; c += 2) maze[r][c] = 0;
  }
  var startC = 5;
  var startR = 1;
  var stack = [{
    c: startC,
    r: startR
  }];
  var visited = {};
  visited[startC + "," + startR] = true;
  var stepDirs = [[0, -2], [0, 2], [-2, 0], [2, 0]];
  while (stack.length) {
    var cur = stack[stack.length - 1];
    var opts = [];
    for (i = 0; i < stepDirs.length; i++) {
      var nc = cur.c + stepDirs[i][0];
      var nr = cur.r + stepDirs[i][1];
      if (nr < 1 || nc < 1 || nr >= CC_ROWS - 1 || nc >= CC_COLS - 1) continue;
      if (visited[nc + "," + nr]) continue;
      opts.push({
        c: nc,
        r: nr,
        dc: stepDirs[i][0],
        dr: stepDirs[i][1]
      });
    }
    if (!opts.length) {
      stack.pop();
      continue;
    }
    ccShuffleInPlace(opts);
    var next = opts[0];
    maze[cur.r + next.dr / 2][cur.c + next.dc / 2] = 0;
    maze[next.r][next.c] = 0;
    visited[next.c + "," + next.r] = true;
    stack.push({
      c: next.c,
      r: next.r
    });
  }
  var extras = 5 + Math.floor(Math.random() * 6);
  for (i = 0; i < extras; i++) {
    var er = 2 + Math.floor(Math.random() * (CC_ROWS - 4));
    var ec = 2 + Math.floor(Math.random() * (CC_COLS - 4));
    if (maze[er][ec] !== 1) continue;
    var openN = (maze[er - 1][ec] === 0 ? 1 : 0) + (maze[er + 1][ec] === 0 ? 1 : 0) + (maze[er][ec - 1] === 0 ? 1 : 0) + (maze[er][ec + 1] === 0 ? 1 : 0);
    if (openN >= 2) maze[er][ec] = 0;
  }
  var reach = ccReachableCells(maze, startC, startR);
  var candidates = reach.filter(function (p) {
    return !(p.c === startC && p.r === startR);
  });
  ccShuffleInPlace(candidates);
  var coinCount = Math.min(CC_COIN_TARGET, candidates.length);
  if (coinCount < 8 && candidates.length >= 8) coinCount = 8;
  var coins = [];
  for (i = 0; i < coinCount; i++) {
    coins.push([candidates[i].c, candidates[i].r]);
  }
  return {
    maze: maze,
    start: {
      c: startC,
      r: startR
    },
    coins: coins
  };
}
function CoinChaseGame(props) {
  var kid = props.kid;
  var reward = props.reward;
  var onComplete = props.onComplete;
  var onClose = props.onClose;
  var awardReward = props.awardReward;
  var _useState19 = useState(function () {
      return ccGenerateLayout();
    }),
    _useState20 = _slicedToArray(_useState19, 1),
    layout = _useState20[0];
  var mazeRef = useRef(layout.maze);
  var canvasRef = useRef(null);
  var playerRef = useRef({
    c: layout.start.c,
    r: layout.start.r,
    x: ccCellCenter(layout.start.c, layout.start.r).x,
    y: ccCellCenter(layout.start.c, layout.start.r).y,
    dir: {
      dc: 0,
      dr: 0
    },
    nextDir: {
      dc: 0,
      dr: 0
    }
  });
  var coinsRef = useRef(layout.coins.map(function (pair) {
    return {
      c: pair[0],
      r: pair[1],
      taken: false
    };
  }));
  var animationFrameRef = useRef(0);
  var finishedRef = useRef(false);
  var endDeadlineRef = useRef(0);
  var awardResultRef = useRef(null);
  var reducedRef = useRef(prefersReducedMotion());
  var themeRef = useRef(cdThemeForKid(kid));
  var particlesRef = useRef([]);
  var pointerStartRef = useRef(null);
  var lastShownSecRef = useRef(CC_TIME_SEC);
  var playingRef = useRef(false);
  var _useState21 = useState("ready"),
    _useState22 = _slicedToArray(_useState21, 2),
    gameStage = _useState22[0],
    setGameStage = _useState22[1];
  var _useState23 = useState(layout.coins.length),
    _useState24 = _slicedToArray(_useState23, 2),
    coinsLeft = _useState24[0],
    setCoinsLeft = _useState24[1];
  var _useState25 = useState(CC_TIME_SEC),
    _useState26 = _slicedToArray(_useState25, 2),
    secsLeft = _useState26[0],
    setSecsLeft = _useState26[1];
  var _useState27 = useState(false),
    _useState28 = _slicedToArray(_useState27, 2),
    resultWon = _useState28[0],
    setResultWon = _useState28[1];
  var _useState29 = useState(null),
    _useState30 = _slicedToArray(_useState29, 2),
    resultText = _useState30[0],
    setResultText = _useState30[1];
  var _useState31 = useState(null),
    _useState32 = _slicedToArray(_useState31, 2),
    resultSub = _useState32[0],
    setResultSub = _useState32[1];
  var _useState33 = useState(null),
    _useState34 = _slicedToArray(_useState33, 2),
    resultCheer = _useState34[0],
    setResultCheer = _useState34[1];
  var _useState35 = useState(null),
    _useState36 = _slicedToArray(_useState35, 2),
    resultAmount = _useState36[0],
    setResultAmount = _useState36[1];
  var _useState37 = useState(false),
    _useState38 = _slicedToArray(_useState37, 2),
    boostFlash = _useState38[0],
    setBoostFlash = _useState38[1];
  themeRef.current = cdThemeForKid(kid);
  var drawBoard = function drawBoard(ctx) {
    var theme = themeRef.current;
    var player = playerRef.current;
    var coins = coinsRef.current;
    var maze = mazeRef.current;
    var g = ctx.createLinearGradient(0, 0, 0, CC_H);
    g.addColorStop(0, theme.top);
    g.addColorStop(1, theme.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CC_W, CC_H);
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#fff";
    for (var hx = 10; hx < CC_W; hx += 16) {
      for (var hy = 10; hy < CC_H; hy += 16) {
        ctx.beginPath();
        ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    for (var r = 0; r < CC_ROWS; r++) {
      for (var c = 0; c < CC_COLS; c++) {
        if (maze[r][c] !== 1) continue;
        var x = CC_OX + c * CC_CELL;
        var y = CC_OY + r * CC_CELL;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x + 1, y + 1, CC_CELL - 2, CC_CELL - 2);
        ctx.strokeStyle = theme.mover;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, CC_CELL - 4, CC_CELL - 4);
      }
    }
    coins.forEach(function (coin) {
      if (coin.taken) return;
      var p = ccCellCenter(coin.c, coin.r);
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
    particlesRef.current.forEach(function (pt) {
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
    ctx.fillText("🪙 " + coins.filter(function (cn) {
      return !cn.taken;
    }).length + " left", 16, 19);
    ctx.textAlign = "right";
    var remain = endDeadlineRef.current ? Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000)) : CC_TIME_SEC;
    ctx.fillText("⏱ " + remain + "s", CC_W - 16, 19);
  };
  var finishGame = function finishGame(won) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    playingRef.current = false;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    var theme = themeRef.current;
    var player = playerRef.current;
    setResultWon(!!won);
    if (won) {
      setResultText("ALL COINS!");
      setResultSub("You cleared the maze — amazing!");
      setResultCheer("Coin Chase champ!");
      playCoinSfx("vault", true);
    } else {
      setResultText("TIME'S UP!");
      setResultSub("Your brush coin is safe either way!");
      setResultCheer("Coin saved!");
      playCoinSfx("side", true);
    }
    for (var i = 0; i < (won ? 28 : 12); i++) {
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
    var _celebrateTick2 = function celebrateTick() {
      particlesRef.current = particlesRef.current.filter(function (pt) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        return pt.life > 0;
      });
      var canvas = canvasRef.current;
      if (canvas) drawBoard(canvas.getContext("2d"));
      if (particlesRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(_celebrateTick2);
      }
    };
    animationFrameRef.current = requestAnimationFrame(_celebrateTick2);
    Promise.resolve(awardReward(reward)).then(function (result) {
      awardResultRef.current = result || null;
      var amt = result && result.amountAwarded != null ? result.amountAwarded : reward.amount || 1;
      setResultAmount(amt);
      setBoostFlash(!!(result && result.boostApplied));
      setTimeout(function () {
        setGameStage("complete");
      }, won ? 800 : 550);
    }).catch(function () {
      setResultAmount(reward.amount || 1);
      setTimeout(function () {
        setGameStage("complete");
      }, won ? 800 : 550);
    });
  };
  var trySetDir = function trySetDir(dc, dr) {
    var player = playerRef.current;
    var maze = mazeRef.current;
    player.nextDir = {
      dc: dc,
      dr: dr
    };
    if (player.dir.dc === 0 && player.dir.dr === 0) {
      var nc = player.c + dc;
      var nr = player.r + dr;
      if (!ccIsWall(maze, nc, nr)) {
        player.dir = {
          dc: dc,
          dr: dr
        };
      }
    }
  };
  var collectAt = function collectAt(c, r) {
    var got = false;
    coinsRef.current.forEach(function (coin) {
      if (!coin.taken && coin.c === c && coin.r === r) {
        coin.taken = true;
        got = true;
      }
    });
    if (got) {
      playCoinSfx("peg", true);
      var left = coinsRef.current.filter(function (cn) {
        return !cn.taken;
      }).length;
      setCoinsLeft(left);
      if (left <= 0) finishGame(true);
    }
  };
  var _tick2 = function tick() {
    var canvas = canvasRef.current;
    if (!canvas || finishedRef.current) return;
    var ctx = canvas.getContext("2d");
    var player = playerRef.current;
    var maze = mazeRef.current;
    if (playingRef.current && !reducedRef.current) {
      var center = ccCellCenter(player.c, player.r);
      var atCenter = Math.abs(player.x - center.x) < 1.2 && Math.abs(player.y - center.y) < 1.2;
      if (atCenter) {
        player.x = center.x;
        player.y = center.y;
        collectAt(player.c, player.r);
        var nd = player.nextDir;
        if (nd.dc || nd.dr) {
          if (!ccIsWall(maze, player.c + nd.dc, player.r + nd.dr)) {
            player.dir = {
              dc: nd.dc,
              dr: nd.dr
            };
          }
        }
        if (player.dir.dc || player.dir.dr) {
          if (ccIsWall(maze, player.c + player.dir.dc, player.r + player.dir.dr)) {
            player.dir = {
              dc: 0,
              dr: 0
            };
          } else {
            player.c += player.dir.dc;
            player.r += player.dir.dr;
          }
        }
      }
      if (player.dir.dc || player.dir.dr) {
        var target = ccCellCenter(player.c, player.r);
        var dx = target.x - player.x;
        var dy = target.y - player.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if (dist <= CC_SPEED) {
          player.x = target.x;
          player.y = target.y;
        } else {
          player.x += dx / dist * CC_SPEED;
          player.y += dy / dist * CC_SPEED;
        }
      }
      if (endDeadlineRef.current && Date.now() >= endDeadlineRef.current) {
        drawBoard(ctx);
        finishGame(false);
        return;
      }
      var remain = Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000));
      if (remain !== lastShownSecRef.current) {
        lastShownSecRef.current = remain;
        setSecsLeft(remain);
      }
    }
    particlesRef.current = particlesRef.current.filter(function (pt) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12;
      pt.life -= 0.03;
      return pt.life > 0;
    });
    drawBoard(ctx);
    if (finishedRef.current) return;
    animationFrameRef.current = requestAnimationFrame(_tick2);
  };
  var startChase = function startChase() {
    if (finishedRef.current || gameStage !== "ready") return;
    endDeadlineRef.current = Date.now() + CC_TIME_SEC * 1000;
    lastShownSecRef.current = CC_TIME_SEC;
    setSecsLeft(CC_TIME_SEC);
    playingRef.current = true;
    setGameStage("playing");
    playCoinSfx("whoosh", true);
    if (reducedRef.current) {
      coinsRef.current.forEach(function (c) {
        c.taken = true;
      });
      setCoinsLeft(0);
      finishGame(true);
    }
  };
  useEffect(function () {
    var onKeyDown = function onKeyDown(e) {
      if (!playingRef.current || finishedRef.current) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        trySetDir(-1, 0);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        trySetDir(1, 0);
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        trySetDir(0, -1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        trySetDir(0, 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    animationFrameRef.current = requestAnimationFrame(_tick2);
    return function () {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  var onPointerDown = function onPointerDown(e) {
    if (!playingRef.current) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };
  var onPointerUp = function onPointerUp(e) {
    if (!pointerStartRef.current || !playingRef.current) return;
    var dx = e.clientX - pointerStartRef.current.x;
    var dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) trySetDir(dx > 0 ? 1 : -1, 0);else trySetDir(0, dy > 0 ? 1 : -1);
  };
  var handleClose = function handleClose() {
    if (finishedRef.current) {
      onClose();
      return;
    }
    finishedRef.current = true;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    Promise.resolve(awardReward(reward)).then(function (result) {
      onComplete(result || null);
    }).catch(function () {
      onComplete(null);
    });
  };
  var dismissResult = function dismissResult() {
    onComplete(awardResultRef.current);
  };
  var isPractice = !!(reward && reward.source === "test-chase");
  var showResult = gameStage === "complete";
  var theme = cdThemeForKid(kid);
  var headTitle = "Coin Chase!";
  if (isPractice) headTitle = "Test Chase!";
  if (showResult && resultCheer) headTitle = resultCheer;
  var instruct = gameStage === "ready" ? "Collect every coin before time runs out" : gameStage === "complete" ? resultWon ? "Tap Done when you're ready" : "Coin kept — tap Done" : "🪙 " + coinsLeft + " left · ⏱ " + secsLeft + "s";
  return /*#__PURE__*/React.createElement("div", {
    className: "modal coin-drop-modal coin-chase-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-sheet coin-chase-sheet kid-" + kid.id,
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic"
  }, headTitle), /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-instructions"
  }, instruct)), /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-board coin-chase-board",
    onPointerDown: onPointerDown,
    onPointerUp: onPointerUp,
    onPointerCancel: function onPointerCancel() {
      pointerStartRef.current = null;
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "coin-drop-canvas",
    width: CC_W,
    height: CC_H,
    role: "img",
    "aria-label": "Coin chase maze. Swipe or use arrows to collect coins before time runs out."
  }), gameStage === "ready" && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-rules",
    "aria-live": "polite",
    style: {
      borderColor: theme.accent
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-rules-title",
    style: {
      color: theme.accent
    }
  }, "How to play"), /*#__PURE__*/React.createElement("ol", {
    className: "coin-drop-rules-list"
  }, /*#__PURE__*/React.createElement("li", null, "Use ", /*#__PURE__*/React.createElement("strong", null, "arrows"), " or ", /*#__PURE__*/React.createElement("strong", null, "swipe"), " to move"), /*#__PURE__*/React.createElement("li", null, "Collect ", /*#__PURE__*/React.createElement("strong", null, "all the coins"), " in the maze"), /*#__PURE__*/React.createElement("li", null, "Beat the clock — your brush coin is ", /*#__PURE__*/React.createElement("strong", null, "always kept"))), /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-slide-hint",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "coin-drop-finger"
  }, "👆👇👈👉"), /*#__PURE__*/React.createElement("span", null, "Swipe · Arrows"))), showResult ? /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-result" + (resultWon ? " is-vault" : " is-side")
  }, /*#__PURE__*/React.createElement("div", {
    className: "comic burst-label"
  }, resultText || "NICE RUN!"), resultSub && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-sub"
  }, resultSub), boostFlash && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-boost"
  }, "2× POWER-UP!"), isPractice ? /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-amt coin-drop-practice"
  }, "Practice — no coins added") : resultAmount != null && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-amt"
  }, "+", resultAmount, " coin", resultAmount === 1 ? "" : "s")) : null), gameStage === "ready" && /*#__PURE__*/React.createElement("button", {
    className: "btn go coin-drop-start",
    type: "button",
    onClick: startChase
  }, "Start Chase"), gameStage === "complete" ? /*#__PURE__*/React.createElement("button", {
    className: "btn go coin-drop-done",
    type: "button",
    onClick: dismissResult
  }, resultWon ? "Awesome — Done!" : "Done") : /*#__PURE__*/React.createElement("div", {
    className: "coin-chase-pad"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow coin-chase-up",
    "aria-label": "Move up",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(0, -1);
    }
  }, "⬆"), /*#__PURE__*/React.createElement("div", {
    className: "coin-chase-mid"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow",
    "aria-label": "Move left",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(-1, 0);
    }
  }, "◀"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow",
    "aria-label": "Move right",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(1, 0);
    }
  }, "▶")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow coin-chase-down",
    "aria-label": "Move down",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(0, 1);
    }
  }, "⬇")), gameStage !== "complete" && /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    type: "button",
    onClick: handleClose
  }, "Close")));
}

/* ================= MAZE DASH MINI-GAME ================= */
var MD_W = 360;
var MD_H = 420;
var MD_COLS = 11;
var MD_ROWS = 13;
var MD_CELL = 28;
var MD_OX = (MD_W - MD_COLS * MD_CELL) / 2;
var MD_OY = 28;
var MD_SPEED = 2.8;
var MD_TIME_SEC = 30;
/* 1 = wall, 0 = path. Start top-left path, finish bottom-right. */
var MD_MAZE = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1], [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
var MD_START = {
  c: 1,
  r: 1
};
var MD_FINISH = {
  c: 9,
  r: 11
};
function mdCellCenter(c, r) {
  return {
    x: MD_OX + c * MD_CELL + MD_CELL / 2,
    y: MD_OY + r * MD_CELL + MD_CELL / 2
  };
}
function mdIsWall(c, r) {
  if (r < 0 || c < 0 || r >= MD_ROWS || c >= MD_COLS) return true;
  return MD_MAZE[r][c] === 1;
}
function MazeDashGame(props) {
  var kid = props.kid;
  var reward = props.reward;
  var onComplete = props.onComplete;
  var onClose = props.onClose;
  var awardReward = props.awardReward;
  var canvasRef = useRef(null);
  var playerRef = useRef({
    c: MD_START.c,
    r: MD_START.r,
    x: mdCellCenter(MD_START.c, MD_START.r).x,
    y: mdCellCenter(MD_START.c, MD_START.r).y,
    dir: {
      dc: 0,
      dr: 0
    },
    nextDir: {
      dc: 0,
      dr: 0
    }
  });
  var animationFrameRef = useRef(0);
  var finishedRef = useRef(false);
  var endDeadlineRef = useRef(0);
  var awardResultRef = useRef(null);
  var reducedRef = useRef(prefersReducedMotion());
  var themeRef = useRef(cdThemeForKid(kid));
  var particlesRef = useRef([]);
  var pointerStartRef = useRef(null);
  var lastShownSecRef = useRef(MD_TIME_SEC);
  var playingRef = useRef(false);
  var _useState39 = useState("ready"),
    _useState40 = _slicedToArray(_useState39, 2),
    gameStage = _useState40[0],
    setGameStage = _useState40[1];
  var _useState41 = useState(MD_TIME_SEC),
    _useState42 = _slicedToArray(_useState41, 2),
    secsLeft = _useState42[0],
    setSecsLeft = _useState42[1];
  var _useState43 = useState(false),
    _useState44 = _slicedToArray(_useState43, 2),
    resultWon = _useState44[0],
    setResultWon = _useState44[1];
  var _useState45 = useState(null),
    _useState46 = _slicedToArray(_useState45, 2),
    resultText = _useState46[0],
    setResultText = _useState46[1];
  var _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    resultSub = _useState48[0],
    setResultSub = _useState48[1];
  var _useState49 = useState(null),
    _useState50 = _slicedToArray(_useState49, 2),
    resultCheer = _useState50[0],
    setResultCheer = _useState50[1];
  var _useState51 = useState(null),
    _useState52 = _slicedToArray(_useState51, 2),
    resultAmount = _useState52[0],
    setResultAmount = _useState52[1];
  var _useState53 = useState(false),
    _useState54 = _slicedToArray(_useState53, 2),
    boostFlash = _useState54[0],
    setBoostFlash = _useState54[1];
  themeRef.current = cdThemeForKid(kid);
  var drawBoard = function drawBoard(ctx) {
    var theme = themeRef.current;
    var player = playerRef.current;
    var g = ctx.createLinearGradient(0, 0, 0, MD_H);
    g.addColorStop(0, theme.top);
    g.addColorStop(1, theme.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, MD_W, MD_H);
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#fff";
    for (var hx = 10; hx < MD_W; hx += 16) {
      for (var hy = 10; hy < MD_H; hy += 16) {
        ctx.beginPath();
        ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    for (var r = 0; r < MD_ROWS; r++) {
      for (var c = 0; c < MD_COLS; c++) {
        if (MD_MAZE[r][c] !== 1) continue;
        var x = MD_OX + c * MD_CELL;
        var y = MD_OY + r * MD_CELL;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x + 1, y + 1, MD_CELL - 2, MD_CELL - 2);
        ctx.strokeStyle = theme.mover;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, MD_CELL - 4, MD_CELL - 4);
      }
    }
    var startP = mdCellCenter(MD_START.c, MD_START.r);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(startP.x, startP.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GO", startP.x, startP.y + 3);
    var finP = mdCellCenter(MD_FINISH.c, MD_FINISH.r);
    var fx = MD_OX + MD_FINISH.c * MD_CELL + 3;
    var fy = MD_OY + MD_FINISH.r * MD_CELL + 3;
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
    particlesRef.current.forEach(function (pt) {
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
    var remain = endDeadlineRef.current ? Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000)) : MD_TIME_SEC;
    ctx.fillText("⏱ " + remain + "s", MD_W / 2, 19);
  };
  var finishGame = function finishGame(won) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    playingRef.current = false;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    var theme = themeRef.current;
    var player = playerRef.current;
    setResultWon(!!won);
    if (won) {
      setResultText("MADE IT!");
      setResultSub("You reached the finish — amazing!");
      setResultCheer("Maze Dash champ!");
      playCoinSfx("vault", true);
    } else {
      setResultText("TIME'S UP!");
      setResultSub("Your brush coin is safe either way!");
      setResultCheer("Coin saved!");
      playCoinSfx("side", true);
    }
    for (var i = 0; i < (won ? 28 : 12); i++) {
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
    var _celebrateTick3 = function celebrateTick() {
      particlesRef.current = particlesRef.current.filter(function (pt) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        return pt.life > 0;
      });
      var canvas = canvasRef.current;
      if (canvas) drawBoard(canvas.getContext("2d"));
      if (particlesRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(_celebrateTick3);
      }
    };
    animationFrameRef.current = requestAnimationFrame(_celebrateTick3);
    Promise.resolve(awardReward(reward)).then(function (result) {
      awardResultRef.current = result || null;
      var amt = result && result.amountAwarded != null ? result.amountAwarded : reward.amount || 1;
      setResultAmount(amt);
      setBoostFlash(!!(result && result.boostApplied));
      setTimeout(function () {
        setGameStage("complete");
      }, won ? 800 : 550);
    }).catch(function () {
      setResultAmount(reward.amount || 1);
      setTimeout(function () {
        setGameStage("complete");
      }, won ? 800 : 550);
    });
  };
  var trySetDir = function trySetDir(dc, dr) {
    var player = playerRef.current;
    player.nextDir = {
      dc: dc,
      dr: dr
    };
    if (player.dir.dc === 0 && player.dir.dr === 0) {
      var nc = player.c + dc;
      var nr = player.r + dr;
      if (!mdIsWall(nc, nr)) {
        player.dir = {
          dc: dc,
          dr: dr
        };
      }
    }
  };
  var checkFinish = function checkFinish(c, r) {
    if (c === MD_FINISH.c && r === MD_FINISH.r) {
      finishGame(true);
    }
  };
  var _tick3 = function tick() {
    var canvas = canvasRef.current;
    if (!canvas || finishedRef.current) return;
    var ctx = canvas.getContext("2d");
    var player = playerRef.current;
    if (playingRef.current && !reducedRef.current) {
      var center = mdCellCenter(player.c, player.r);
      var atCenter = Math.abs(player.x - center.x) < 1.2 && Math.abs(player.y - center.y) < 1.2;
      if (atCenter) {
        player.x = center.x;
        player.y = center.y;
        checkFinish(player.c, player.r);
        if (finishedRef.current) {
          drawBoard(ctx);
          return;
        }
        var nd = player.nextDir;
        if (nd.dc || nd.dr) {
          if (!mdIsWall(player.c + nd.dc, player.r + nd.dr)) {
            player.dir = {
              dc: nd.dc,
              dr: nd.dr
            };
          }
        }
        if (player.dir.dc || player.dir.dr) {
          if (mdIsWall(player.c + player.dir.dc, player.r + player.dir.dr)) {
            player.dir = {
              dc: 0,
              dr: 0
            };
          } else {
            player.c += player.dir.dc;
            player.r += player.dir.dr;
          }
        }
      }
      if (player.dir.dc || player.dir.dr) {
        var target = mdCellCenter(player.c, player.r);
        var dx = target.x - player.x;
        var dy = target.y - player.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if (dist <= MD_SPEED) {
          player.x = target.x;
          player.y = target.y;
        } else {
          player.x += dx / dist * MD_SPEED;
          player.y += dy / dist * MD_SPEED;
        }
      }
      if (endDeadlineRef.current && Date.now() >= endDeadlineRef.current) {
        drawBoard(ctx);
        finishGame(false);
        return;
      }
      var remain = Math.max(0, Math.ceil((endDeadlineRef.current - Date.now()) / 1000));
      if (remain !== lastShownSecRef.current) {
        lastShownSecRef.current = remain;
        setSecsLeft(remain);
      }
    }
    particlesRef.current = particlesRef.current.filter(function (pt) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.12;
      pt.life -= 0.03;
      return pt.life > 0;
    });
    drawBoard(ctx);
    if (finishedRef.current) return;
    animationFrameRef.current = requestAnimationFrame(_tick3);
  };
  var startDash = function startDash() {
    if (finishedRef.current || gameStage !== "ready") return;
    endDeadlineRef.current = Date.now() + MD_TIME_SEC * 1000;
    lastShownSecRef.current = MD_TIME_SEC;
    setSecsLeft(MD_TIME_SEC);
    playingRef.current = true;
    setGameStage("playing");
    playCoinSfx("whoosh", true);
    if (reducedRef.current) {
      var player = playerRef.current;
      player.c = MD_FINISH.c;
      player.r = MD_FINISH.r;
      var p = mdCellCenter(MD_FINISH.c, MD_FINISH.r);
      player.x = p.x;
      player.y = p.y;
      finishGame(true);
    }
  };
  useEffect(function () {
    var onKeyDown = function onKeyDown(e) {
      if (!playingRef.current || finishedRef.current) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        trySetDir(-1, 0);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        trySetDir(1, 0);
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        trySetDir(0, -1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        trySetDir(0, 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    animationFrameRef.current = requestAnimationFrame(_tick3);
    return function () {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  var onPointerDown = function onPointerDown(e) {
    if (!playingRef.current) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };
  var onPointerUp = function onPointerUp(e) {
    if (!pointerStartRef.current || !playingRef.current) return;
    var dx = e.clientX - pointerStartRef.current.x;
    var dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) trySetDir(dx > 0 ? 1 : -1, 0);else trySetDir(0, dy > 0 ? 1 : -1);
  };
  var handleClose = function handleClose() {
    if (finishedRef.current) {
      onClose();
      return;
    }
    finishedRef.current = true;
    playingRef.current = false;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    Promise.resolve(awardReward(reward)).then(function (result) {
      onComplete(result || null);
    }).catch(function () {
      onComplete(null);
    });
  };
  var dismissResult = function dismissResult() {
    onComplete(awardResultRef.current);
  };
  var isPractice = !!(reward && reward.source === "test-dash");
  var showResult = gameStage === "complete";
  var theme = cdThemeForKid(kid);
  var headTitle = "Maze Dash!";
  if (isPractice) headTitle = "Test Dash!";
  if (showResult && resultCheer) headTitle = resultCheer;
  var instruct = gameStage === "ready" ? "Race from GO to END before time runs out" : gameStage === "complete" ? resultWon ? "Tap Done when you're ready" : "Coin kept — tap Done" : "⏱ " + secsLeft + "s — reach the gold END";
  return /*#__PURE__*/React.createElement("div", {
    className: "modal coin-drop-modal maze-dash-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-sheet maze-dash-sheet kid-" + kid.id,
    onClick: function onClick(e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic"
  }, headTitle), /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-instructions"
  }, instruct)), /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-board maze-dash-board",
    onPointerDown: onPointerDown,
    onPointerUp: onPointerUp,
    onPointerCancel: function onPointerCancel() {
      pointerStartRef.current = null;
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "coin-drop-canvas",
    width: MD_W,
    height: MD_H,
    role: "img",
    "aria-label": "Maze dash. Swipe or use arrows to reach the finish before time runs out."
  }), gameStage === "ready" && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-rules",
    "aria-live": "polite",
    style: {
      borderColor: theme.accent
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "coin-drop-rules-title",
    style: {
      color: theme.accent
    }
  }, "How to play"), /*#__PURE__*/React.createElement("ol", {
    className: "coin-drop-rules-list"
  }, /*#__PURE__*/React.createElement("li", null, "Use ", /*#__PURE__*/React.createElement("strong", null, "arrows"), " or ", /*#__PURE__*/React.createElement("strong", null, "swipe"), " to move"), /*#__PURE__*/React.createElement("li", null, "Find the path from ", /*#__PURE__*/React.createElement("strong", null, "GO"), " to the gold ", /*#__PURE__*/React.createElement("strong", null, "END")), /*#__PURE__*/React.createElement("li", null, "Beat the clock — your brush coin is ", /*#__PURE__*/React.createElement("strong", null, "always kept"))), /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-slide-hint",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "coin-drop-finger"
  }, "👆👇👈👉"), /*#__PURE__*/React.createElement("span", null, "Swipe · Arrows"))), showResult ? /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-result" + (resultWon ? " is-vault" : " is-side")
  }, /*#__PURE__*/React.createElement("div", {
    className: "comic burst-label"
  }, resultText || "NICE RUN!"), resultSub && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-sub"
  }, resultSub), boostFlash && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-boost"
  }, "2× POWER-UP!"), isPractice ? /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-amt coin-drop-practice"
  }, "Practice — no coins added") : resultAmount != null && /*#__PURE__*/React.createElement("div", {
    className: "coin-drop-amt"
  }, "+", resultAmount, " coin", resultAmount === 1 ? "" : "s")) : null), gameStage === "ready" && /*#__PURE__*/React.createElement("button", {
    className: "btn go coin-drop-start",
    type: "button",
    onClick: startDash
  }, "Start Dash"), gameStage === "complete" ? /*#__PURE__*/React.createElement("button", {
    className: "btn go coin-drop-done",
    type: "button",
    onClick: dismissResult
  }, resultWon ? "Awesome — Done!" : "Done") : /*#__PURE__*/React.createElement("div", {
    className: "coin-chase-pad maze-dash-pad"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow coin-chase-up",
    "aria-label": "Move up",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(0, -1);
    }
  }, "⬆"), /*#__PURE__*/React.createElement("div", {
    className: "coin-chase-mid"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow",
    "aria-label": "Move left",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(-1, 0);
    }
  }, "◀"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow",
    "aria-label": "Move right",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(1, 0);
    }
  }, "▶")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "coin-drop-arrow coin-chase-down",
    "aria-label": "Move down",
    onPointerDown: function onPointerDown(e) {
      e.preventDefault();
      trySetDir(0, 1);
    }
  }, "⬇")), gameStage !== "complete" && /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    type: "button",
    onClick: handleClose
  }, "Close")));
}

/* ================= APP ================= */
function App() {
  var initial = useMemo(function () {
    return loadState();
  }, []);
  var _useState55 = useState(initial.kid),
    _useState56 = _slicedToArray(_useState55, 2),
    kid = _useState56[0],
    setKid = _useState56[1];
  var _useState57 = useState(initial.coins),
    _useState58 = _slicedToArray(_useState57, 2),
    coins = _useState58[0],
    setCoins = _useState58[1];
  var _useState59 = useState(initial.log),
    _useState60 = _slicedToArray(_useState59, 2),
    log = _useState60[0],
    setLog = _useState60[1];
  var _useState61 = useState(initial.unlocks),
    _useState62 = _slicedToArray(_useState61, 2),
    unlocks = _useState62[0],
    setUnlocks = _useState62[1];
  var _useState63 = useState(initial.boosts),
    _useState64 = _slicedToArray(_useState63, 2),
    boosts = _useState64[0],
    setBoosts = _useState64[1];
  var _useState65 = useState(initial.settings || defaultSettings()),
    _useState66 = _slicedToArray(_useState65, 2),
    settings = _useState66[0],
    setSettings = _useState66[1];
  var _useState67 = useState(initial.pendingReward || null),
    _useState68 = _slicedToArray(_useState67, 2),
    pendingReward = _useState68[0],
    setPendingReward = _useState68[1];
  var _useState69 = useState(null),
    _useState70 = _slicedToArray(_useState69, 2),
    modal = _useState70[0],
    setModal = _useState70[1]; // vault | timer | history | settings | profile | unlock | coinDrop
  var _useState71 = useState([]),
    _useState72 = _slicedToArray(_useState71, 2),
    unlockQueue = _useState72[0],
    setUnlockQueue = _useState72[1];
  var unlockQueueRef = useRef([]);
  var _useState73 = useState(null),
    _useState74 = _slicedToArray(_useState73, 2),
    timerJob = _useState74[0],
    setTimerJob = _useState74[1];
  var _useState75 = useState(120),
    _useState76 = _slicedToArray(_useState75, 2),
    secs = _useState76[0],
    setSecs = _useState76[1];
  var _useState77 = useState(false),
    _useState78 = _slicedToArray(_useState77, 2),
    running = _useState78[0],
    setRunning = _useState78[1];
  var _useState79 = useState(false),
    _useState80 = _slicedToArray(_useState79, 2),
    done = _useState80[0],
    setDone = _useState80[1];
  var _useState81 = useState(null),
    _useState82 = _slicedToArray(_useState81, 2),
    toast = _useState82[0],
    setToast = _useState82[1];
  var _useState83 = useState(supabaseReady() ? "syncing" : "local"),
    _useState84 = _slicedToArray(_useState83, 2),
    cloud = _useState84[0],
    setCloud = _useState84[1];
  var _useState85 = useState(null),
    _useState86 = _slicedToArray(_useState85, 2),
    focusedRow = _useState86[0],
    setFocusedRow = _useState86[1];
  var canvasRef = useRef(null);
  var kidIdsRef = useRef({});
  var hydratedRef = useRef(false);
  var syncReadyRef = useRef(false);
  var pendingSyncRef = useRef([]);
  var coinsRef = useRef(initial.coins);
  var logRef = useRef(initial.log);
  var unlocksRef = useRef(initial.unlocks);
  var boostsRef = useRef(initial.boosts);
  var pendingRewardRef = useRef(initial.pendingReward || null);
  var awardedRewardIdsRef = useRef({});
  var timerCompletedRef = useRef(false);
  var deferUnlockModalRef = useRef(false);
  var recoveryDoneRef = useRef(false);
  var tune = useBrushingTune();
  useEffect(function () {
    coinsRef.current = coins;
    logRef.current = log;
    unlocksRef.current = unlocks;
    boostsRef.current = boosts;
    pendingRewardRef.current = pendingReward;
  }, [coins, log, unlocks, boosts, pendingReward]);
  useEffect(function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        kid: kid,
        coins: coins,
        log: log,
        unlocks: unlocks,
        boosts: boosts,
        settings: settings,
        pendingReward: pendingReward
      }));
    } catch (e) {}
  }, [kid, coins, log, unlocks, boosts, settings, pendingReward]);
  useEffect(function () {
    if (!supabaseReady() || hydratedRef.current) return;
    hydratedRef.current = true;
    Promise.all([sbFetch("coin_kids?select=id,slug,balance,double_earns_left,free_switch&order=sort_order.asc", {
      headers: sbHeaders()
    }).catch(function () {
      return sbFetch("coin_kids?select=id,slug,balance&order=sort_order.asc", {
        headers: sbHeaders()
      });
    }), sbFetch("coin_transactions?select=id,kid_id,entry_type,amount,description,source,reward_id,created_at&order=created_at.desc", {
      headers: sbHeaders()
    }).catch(function () {
      return sbFetch("coin_transactions?select=id,kid_id,entry_type,amount,description,source,created_at&order=created_at.desc", {
        headers: sbHeaders()
      }).catch(function () {
        return sbFetch("coin_transactions?select=id,kid_id,entry_type,amount,description,created_at&order=created_at.desc", {
          headers: sbHeaders()
        });
      });
    }), sbFetch("coin_unlocks?select=id,kid_id,unlock_id,unlock_type,used,unlocked_at&order=unlocked_at.asc", {
      headers: sbHeaders()
    }).catch(function () {
      return [];
    })]).then(function (results) {
      var kids = results[0] || [];
      var txs = results[1] || [];
      var remoteUnlockRows = results[2] || [];
      var ids = {};
      var remoteCoins = Object.assign({}, DEFAULT_COINS);
      var remoteBoosts = emptyBoosts();
      kids.forEach(function (row) {
        if (KIDS[row.slug]) {
          ids[row.slug] = row.id;
          remoteCoins[row.slug] = Number(row.balance) || 0;
          remoteBoosts[row.slug] = {
            doubleEarnsLeft: Math.max(0, Number(row.double_earns_left) || 0),
            freeSwitch: !!row.free_switch
          };
        }
      });
      kidIdsRef.current = ids;
      var idToSlug = {};
      Object.keys(ids).forEach(function (slug) {
        idToSlug[ids[slug]] = slug;
      });
      var remoteLog = emptyLog();
      txs.forEach(function (tx) {
        var slug = idToSlug[tx.kid_id];
        if (!slug) return;
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
      var remoteUnlocks = emptyUnlocks();
      remoteUnlockRows.forEach(function (row) {
        var slug = idToSlug[row.kid_id];
        if (!slug) return;
        remoteUnlocks[slug].push({
          id: row.unlock_id,
          type: row.unlock_type === "powerup" ? "powerup" : "trophy",
          used: !!row.used,
          at: row.unlocked_at || new Date().toISOString(),
          remoteId: row.id
        });
      });
      var liveCoins = Object.assign({}, DEFAULT_COINS, coinsRef.current || {});
      var liveLog = {
        sam: logRef.current && logRef.current.sam || [],
        isaac: logRef.current && logRef.current.isaac || [],
        ben: logRef.current && logRef.current.ben || []
      };
      var liveUnlocks = unlocksRef.current || emptyUnlocks();
      var liveBoosts = boostsRef.current || emptyBoosts();
      var remoteEmpty = totalCoins(remoteCoins) === 0 && logCount(remoteLog) === 0;
      var localHasData = totalCoins(liveCoins) > 0 || logCount(liveLog) > 0;
      var preferLocal = remoteEmpty && localHasData || localIsAhead(liveCoins, liveLog, remoteCoins, remoteLog);
      if (preferLocal && Object.keys(ids).length) {
        return pushLocalToCloud(liveCoins, liveLog, ids, remoteLog, liveUnlocks, liveBoosts).then(function (result) {
          var mappedLog = result && result.log ? result.log : result || liveLog;
          var tempIdMap = result && result.tempIdMap || {};
          var mappedUnlocks = result && result.unlocks || liveUnlocks;
          var latestCoins = Object.assign({}, DEFAULT_COINS, coinsRef.current || liveCoins);
          setLog(function (current) {
            var out = emptyLog();
            Object.keys(KIDS).forEach(function (slug) {
              out[slug] = (current[slug] || []).map(function (e) {
                var mapped = tempIdMap[e.id];
                return mapped ? Object.assign({}, e, mapped) : e;
              });
            });
            if (logCount(out) === 0 && logCount(mappedLog) > 0) return mappedLog;
            logRef.current = out;
            return out;
          });
          coinsRef.current = latestCoins;
          setCoins(latestCoins);
          unlocksRef.current = mappedUnlocks;
          setUnlocks(mappedUnlocks);
          boostsRef.current = liveBoosts;
          setBoosts(liveBoosts);
          pendingSyncRef.current = pendingSyncRef.current.filter(function (job) {
            return !(job.kind === "insert" && tempIdMap[job.tempId]);
          });
          syncReadyRef.current = true;
          var balTasks = Object.keys(KIDS).map(function (slug) {
            return runSyncJob({
              kind: "balance",
              slug: slug,
              balance: latestCoins[slug] || 0,
              boosts: liveBoosts[slug]
            });
          });
          return Promise.all(balTasks).then(function () {
            return flushPendingSync();
          }).then(function () {
            setCloud("online");
          });
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
    }).catch(function () {
      setCloud("offline");
    });
  }, []);
  function pushLocalToCloud(localCoins, localLog, ids, remoteLog, localUnlocks, localBoosts) {
    var patches = Object.keys(KIDS).map(function (slug) {
      if (!ids[slug]) return Promise.resolve();
      var b = localBoosts && localBoosts[slug] || defaultBoost();
      return sbFetch("coin_kids?slug=eq." + encodeURIComponent(slug), {
        method: "PATCH",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        }),
        body: JSON.stringify({
          balance: localCoins[slug] || 0,
          double_earns_left: b.doubleEarnsLeft || 0,
          free_switch: !!b.freeSwitch,
          updated_at: new Date().toISOString()
        })
      }).catch(function () {
        return sbFetch("coin_kids?slug=eq." + encodeURIComponent(slug), {
          method: "PATCH",
          headers: sbHeaders({
            "Prefer": "return=minimal"
          }),
          body: JSON.stringify({
            balance: localCoins[slug] || 0,
            updated_at: new Date().toISOString()
          })
        });
      });
    });
    var unsynced = [];
    Object.keys(KIDS).forEach(function (slug) {
      var kidId = ids[slug];
      if (!kidId) return;
      var entries = (localLog[slug] || []).slice().reverse();
      entries.forEach(function (entry) {
        if (!isLocalId(entry.id)) return;
        unsynced.push({
          tempId: entry.id,
          slug: slug,
          body: function () {
            var body = {
              kid_id: kidId,
              entry_type: entry.type === "spent" ? "spent" : "earned",
              amount: entry.amount,
              description: entry.desc || "",
              source: entry.source || null
            };
            if (entry.rewardId) body.reward_id = entry.rewardId;
            return body;
          }()
        });
      });
    });
    return Promise.all(patches).then(function () {
      var base = remoteLog ? {
        sam: (remoteLog.sam || []).slice(),
        isaac: (remoteLog.isaac || []).slice(),
        ben: (remoteLog.ben || []).slice()
      } : emptyLog();
      var merged = emptyLog();
      Object.keys(KIDS).forEach(function (slug) {
        var fromLocal = (localLog[slug] || []).filter(function (e) {
          return !isLocalId(e.id);
        });
        var fromRemote = base[slug] || [];
        var seen = {};
        var out = [];
        fromLocal.concat(fromRemote).forEach(function (e) {
          if (!e || !e.id || seen[e.id]) return;
          seen[e.id] = true;
          out.push(e);
        });
        (localLog[slug] || []).forEach(function (e) {
          if (isLocalId(e.id) && !seen[e.id]) {
            seen[e.id] = true;
            out.unshift(e);
          }
        });
        merged[slug] = out;
      });
      var tempIdMap = {};
      var txPromise = !unsynced.length ? Promise.resolve({
        log: merged,
        tempIdMap: tempIdMap
      }) : sbFetch("coin_transactions", {
        method: "POST",
        headers: sbHeaders({
          "Prefer": "return=representation"
        }),
        body: JSON.stringify(unsynced.map(function (i) {
          return i.body;
        }))
      }).then(function (rows) {
        var list = rows || [];
        var _loop = function _loop() {
          var tx = list[i];
          var meta = unsynced[i];
          if (!meta) return 1; // continue
          var mapped = {
            id: tx.id,
            type: tx.entry_type,
            amount: Number(tx.amount) || 0,
            desc: tx.description,
            source: tx.source || meta.body.source || null,
            rewardId: tx.reward_id || meta.body.reward_id || null,
            when: formatWhen(tx.created_at)
          };
          tempIdMap[meta.tempId] = mapped;
          var slug = meta.slug;
          merged[slug] = (merged[slug] || []).map(function (e) {
            if (e.id !== meta.tempId) return e;
            return Object.assign({}, e, mapped, {
              when: mapped.when || e.when
            });
          });
        };
        for (var i = 0; i < list.length; i++) {
          if (_loop()) continue;
        }
        return {
          log: merged,
          tempIdMap: tempIdMap
        };
      });
      return txPromise.then(function (txResult) {
        var unlockBodies = [];
        Object.keys(KIDS).forEach(function (slug) {
          var kidId = ids[slug];
          if (!kidId) return;
          (localUnlocks[slug] || []).forEach(function (u) {
            if (u.remoteId) return;
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
        var nextUnlocks = {
          sam: (localUnlocks.sam || []).slice(),
          isaac: (localUnlocks.isaac || []).slice(),
          ben: (localUnlocks.ben || []).slice()
        };
        if (!unlockBodies.length) {
          return Object.assign({}, txResult, {
            unlocks: nextUnlocks
          });
        }
        return sbFetch("coin_unlocks", {
          method: "POST",
          headers: sbHeaders({
            "Prefer": "return=representation"
          }),
          body: JSON.stringify(unlockBodies.map(function (i) {
            return i.body;
          }))
        }).then(function (rows) {
          var list = rows || [];
          var _loop2 = function _loop2() {
            var row = list[i];
            var meta = unlockBodies[i];
            if (!meta || !row) return 1; // continue
            nextUnlocks[meta.slug] = (nextUnlocks[meta.slug] || []).map(function (u) {
              if (u.id !== meta.unlock_id) return u;
              return Object.assign({}, u, {
                remoteId: row.id
              });
            });
          };
          for (var i = 0; i < list.length; i++) {
            if (_loop2()) continue;
          }
          return Object.assign({}, txResult, {
            unlocks: nextUnlocks
          });
        }).catch(function () {
          return Object.assign({}, txResult, {
            unlocks: nextUnlocks
          });
        });
      });
    });
  }
  function runSyncJob(job) {
    if (job.kind === "balance") {
      var balance = coinsRef.current && coinsRef.current[job.slug] != null ? coinsRef.current[job.slug] : job.balance;
      var b = job.boosts || boostsRef.current && boostsRef.current[job.slug] || defaultBoost();
      return sbFetch("coin_kids?slug=eq." + encodeURIComponent(job.slug), {
        method: "PATCH",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        }),
        body: JSON.stringify({
          balance: balance,
          double_earns_left: b.doubleEarnsLeft || 0,
          free_switch: !!b.freeSwitch,
          updated_at: new Date().toISOString()
        })
      }).catch(function () {
        return sbFetch("coin_kids?slug=eq." + encodeURIComponent(job.slug), {
          method: "PATCH",
          headers: sbHeaders({
            "Prefer": "return=minimal"
          }),
          body: JSON.stringify({
            balance: balance,
            updated_at: new Date().toISOString()
          })
        });
      });
    }
    if (job.kind === "insert") {
      var kidId = kidIdsRef.current[job.slug];
      if (!kidId) return Promise.resolve(null);
      var body = {
        kid_id: kidId,
        entry_type: job.entryType,
        amount: job.amount,
        description: job.desc
      };
      if (job.source) body.source = job.source;
      if (job.rewardId) body.reward_id = job.rewardId;
      return sbFetch("coin_transactions", {
        method: "POST",
        headers: sbHeaders({
          "Prefer": "return=representation"
        }),
        body: JSON.stringify(body)
      }).then(function (rows) {
        var row = rows && rows[0] ? rows[0] : null;
        if (row && job.tempId) {
          setLog(function (l) {
            var next = Object.assign({}, l);
            next[job.slug] = (l[job.slug] || []).map(function (e) {
              return e.id === job.tempId ? Object.assign({}, e, {
                id: row.id,
                when: formatWhen(row.created_at) || e.when,
                source: row.source || e.source || null,
                rewardId: row.reward_id || e.rewardId || null
              }) : e;
            });
            return next;
          });
        }
        return row;
      }).catch(function (err) {
        if (job.rewardId && body.reward_id) {
          delete body.reward_id;
          return sbFetch("coin_transactions", {
            method: "POST",
            headers: sbHeaders({
              "Prefer": "return=representation"
            }),
            body: JSON.stringify(body)
          }).then(function (rows) {
            var row = rows && rows[0] ? rows[0] : null;
            if (row && job.tempId) {
              setLog(function (l) {
                var next = Object.assign({}, l);
                next[job.slug] = (l[job.slug] || []).map(function (e) {
                  return e.id === job.tempId ? Object.assign({}, e, {
                    id: row.id,
                    when: formatWhen(row.created_at) || e.when,
                    source: row.source || e.source || null
                  }) : e;
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
    if (job.kind === "delete") {
      return sbFetch("coin_transactions?id=eq." + encodeURIComponent(job.id), {
        method: "DELETE",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        })
      });
    }
    if (job.kind === "unlockInsert") {
      var _kidId = kidIdsRef.current[job.slug];
      if (!_kidId) return Promise.resolve(null);
      return sbFetch("coin_unlocks", {
        method: "POST",
        headers: sbHeaders({
          "Prefer": "return=representation"
        }),
        body: JSON.stringify({
          kid_id: _kidId,
          unlock_id: job.unlockId,
          unlock_type: job.unlockType,
          used: !!job.used,
          unlocked_at: job.at || new Date().toISOString()
        })
      }).then(function (rows) {
        var row = rows && rows[0] ? rows[0] : null;
        if (row) {
          setUnlocks(function (u) {
            var next = Object.assign({}, u);
            next[job.slug] = (u[job.slug] || []).map(function (item) {
              return item.id === job.unlockId ? Object.assign({}, item, {
                remoteId: row.id
              }) : item;
            });
            unlocksRef.current = next;
            return next;
          });
        }
        return row;
      });
    }
    if (job.kind === "unlockUsed") {
      var _kidId2 = kidIdsRef.current[job.slug];
      if (job.remoteId) {
        return sbFetch("coin_unlocks?id=eq." + encodeURIComponent(job.remoteId), {
          method: "PATCH",
          headers: sbHeaders({
            "Prefer": "return=minimal"
          }),
          body: JSON.stringify({
            used: true
          })
        });
      }
      if (!_kidId2) return Promise.resolve(null);
      return sbFetch("coin_unlocks?kid_id=eq." + encodeURIComponent(_kidId2) + "&unlock_id=eq." + encodeURIComponent(job.unlockId), {
        method: "PATCH",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        }),
        body: JSON.stringify({
          used: true
        })
      });
    }
    if (job.kind === "unlockDeleteAll") {
      if (!job.kidIds || !job.kidIds.length) return Promise.resolve(null);
      return sbFetch("coin_unlocks?kid_id=in.(" + job.kidIds.join(",") + ")", {
        method: "DELETE",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        })
      });
    }
    return Promise.resolve();
  }
  function enqueueSync(job) {
    if (!supabaseReady()) return Promise.resolve(null);
    if (!syncReadyRef.current || job.slug && !kidIdsRef.current[job.slug] && job.kind !== "delete" && job.kind !== "unlockDeleteAll") {
      pendingSyncRef.current.push(job);
      return Promise.resolve(null);
    }
    return runSyncJob(job);
  }
  function flushPendingSync() {
    var jobs = pendingSyncRef.current.splice(0);
    if (!jobs.length) return Promise.resolve();
    return jobs.reduce(function (chain, job) {
      return chain.then(function () {
        return runSyncJob(job);
      });
    }, Promise.resolve());
  }
  function syncBalance(slug, balance, boostOverride) {
    return enqueueSync({
      kind: "balance",
      slug: slug,
      balance: balance,
      boosts: boostOverride || boostsRef.current && boostsRef.current[slug] || defaultBoost()
    });
  }
  function syncInsertTx(slug, entryType, amount, desc, tempId, source, rewardId) {
    return enqueueSync({
      kind: "insert",
      slug: slug,
      entryType: entryType,
      amount: amount,
      desc: desc,
      tempId: tempId,
      source: source || null,
      rewardId: rewardId || null
    });
  }
  function applyUnlocks(slug, nextLog, nextCoins, opts) {
    opts = opts || {};
    var owned = {};
    (unlocksRef.current[slug] || []).forEach(function (u) {
      owned[u.id] = true;
    });
    var fresh = findNewUnlocks(slug, nextLog, nextCoins, owned);
    if (!fresh.length) return [];
    var nextUnlocks = Object.assign({}, unlocksRef.current);
    nextUnlocks[slug] = (nextUnlocks[slug] || []).concat(fresh);
    unlocksRef.current = nextUnlocks;
    setUnlocks(nextUnlocks);
    fresh.forEach(function (u) {
      enqueueSync({
        kind: "unlockInsert",
        slug: slug,
        unlockId: u.id,
        unlockType: u.type,
        used: false,
        at: u.at
      });
    });
    var queued = fresh.map(function (u) {
      return Object.assign({}, u, {
        slug: slug
      });
    });
    unlockQueueRef.current = (unlockQueueRef.current || []).concat(queued);
    setUnlockQueue(function (q) {
      return q.concat(queued);
    });
    if (!opts.deferCelebration && !deferUnlockModalRef.current) {
      try {
        tune.fanfare();
      } catch (e) {}
      setModal("unlock");
    }
    return fresh;
  }
  var weekend = useMemo(function () {
    var d = new Date().getDay();
    return d === 0 || d === 6;
  }, []);
  var K = KIDS[kid];
  var celebrating = unlockQueue[0] || null;
  var celebrateMeta = celebrating ? REWARD_BY_ID[celebrating.id] : null;
  var flash = function flash(msg) {
    setToast(msg);
    setTimeout(function () {
      setToast(null);
    }, 1700);
  };
  var dismissUnlock = function dismissUnlock() {
    setUnlockQueue(function (q) {
      var rest = q.slice(1);
      unlockQueueRef.current = rest;
      if (!rest.length) setModal(null);
      return rest;
    });
  };
  var earn = function earn(amount, desc, source, opts) {
    opts = opts || {};
    var slug = opts.slug || opts.kidId || kid;
    var skipUnlockCheck = !!opts.skipUnlockCheck;
    var deferCelebration = !!opts.deferCelebration || deferUnlockModalRef.current;
    var award = amount;
    var doubled = false;
    var nextBoosts = Object.assign({}, boostsRef.current);
    var kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());
    if (opts.rewardId) {
      if (awardedRewardIdsRef.current[opts.rewardId]) {
        return {
          amountAwarded: 0,
          boostApplied: false,
          duplicate: true,
          transaction: null
        };
      }
      var already = (logRef.current[slug] || []).some(function (tx) {
        return tx && tx.rewardId && tx.rewardId === opts.rewardId;
      });
      if (already) {
        awardedRewardIdsRef.current[opts.rewardId] = true;
        return {
          amountAwarded: 0,
          boostApplied: false,
          duplicate: true,
          transaction: null
        };
      }
    }
    if (!opts.skipDouble && kidBoost.doubleEarnsLeft > 0) {
      award = amount * 2;
      kidBoost.doubleEarnsLeft -= 1;
      nextBoosts[slug] = kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
      doubled = true;
    }
    var when = new Date().toLocaleString("en-GB");
    var tempId = "local-" + Date.now() + "-" + Math.floor(Math.random() * 999);
    var finalDesc = desc;
    if (doubled) finalDesc = desc + " · 2× power-up";
    var entry = {
      id: tempId,
      type: "earned",
      amount: award,
      desc: finalDesc,
      when: when,
      source: source || null,
      rewardId: opts.rewardId || null
    };
    if (opts.rewardId) awardedRewardIdsRef.current[opts.rewardId] = true;
    var newBal = 0;
    var nextCoins = Object.assign({}, coinsRef.current);
    newBal = (nextCoins[slug] || 0) + award;
    nextCoins[slug] = newBal;
    coinsRef.current = nextCoins;
    setCoins(nextCoins);
    var nextLog = Object.assign({}, logRef.current);
    nextLog[slug] = [entry].concat(nextLog[slug] || []);
    logRef.current = nextLog;
    setLog(nextLog);
    if (!opts.quiet) {
      if (doubled) flash("2× power-up! +" + award + " for " + KIDS[slug].name + "!");else flash("+" + award + " for " + KIDS[slug].name + "!");
    }
    Promise.all([syncInsertTx(slug, "earned", award, finalDesc, tempId, source, opts.rewardId || null), syncBalance(slug, newBal, kidBoost)]).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
    if (!skipUnlockCheck) applyUnlocks(slug, nextLog, nextCoins, {
      deferCelebration: deferCelebration
    });
    return {
      amountAwarded: award,
      boostApplied: doubled,
      duplicate: false,
      transaction: entry
    };
  };
  var spend = function spend(amount, desc, source, opts) {
    opts = opts || {};
    var slug = opts.slug || kid;
    var cost = amount;
    var usedFree = false;
    var nextBoosts = Object.assign({}, boostsRef.current);
    var kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());
    if (source === "switch15" && kidBoost.freeSwitch && !opts.forcePaid) {
      cost = 0;
      usedFree = true;
      kidBoost.freeSwitch = false;
      nextBoosts[slug] = kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
    }
    if ((coinsRef.current[slug] || 0) < cost) {
      flash("Not enough coins!");
      return;
    }
    var when = new Date().toLocaleString("en-GB");
    var tempId = "local-" + Date.now() + "-" + Math.floor(Math.random() * 999);
    var entry = {
      id: tempId,
      type: "spent",
      amount: cost,
      desc: usedFree ? desc + " (Free Pass)" : desc,
      when: when,
      source: source || null
    };
    var newBal = 0;
    var nextCoins = Object.assign({}, coinsRef.current);
    newBal = (nextCoins[slug] || 0) - cost;
    nextCoins[slug] = newBal;
    coinsRef.current = nextCoins;
    setCoins(nextCoins);
    var nextLog = Object.assign({}, logRef.current);
    nextLog[slug] = [entry].concat(nextLog[slug] || []);
    logRef.current = nextLog;
    setLog(nextLog);
    flash(usedFree ? "Free Switch Pass used!" : "−" + cost + " · " + desc);
    Promise.all([syncInsertTx(slug, "spent", cost, entry.desc, tempId, source), syncBalance(slug, newBal, kidBoost)]).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
    applyUnlocks(slug, nextLog, nextCoins);
  };
  var markPowerupUsed = function markPowerupUsed(slug, unlockId) {
    var nextUnlocks = Object.assign({}, unlocksRef.current);
    var remoteId = null;
    nextUnlocks[slug] = (nextUnlocks[slug] || []).map(function (u) {
      if (u.id !== unlockId) return u;
      remoteId = u.remoteId || null;
      return Object.assign({}, u, {
        used: true
      });
    });
    unlocksRef.current = nextUnlocks;
    setUnlocks(nextUnlocks);
    enqueueSync({
      kind: "unlockUsed",
      slug: slug,
      unlockId: unlockId,
      remoteId: remoteId
    });
  };
  var usePowerup = function usePowerup(unlockId) {
    var slug = kid;
    var owned = (unlocksRef.current[slug] || []).filter(function (u) {
      return u.id === unlockId && u.type === "powerup" && !u.used;
    })[0];
    if (!owned) {
      flash("Already used!");
      return;
    }
    var meta = REWARD_BY_ID[unlockId];
    if (!meta) return;
    if (meta.effect === "double") {
      var nextBoosts = Object.assign({}, boostsRef.current);
      var _kidBoost = Object.assign({}, nextBoosts[slug] || defaultBoost());
      _kidBoost.doubleEarnsLeft = (_kidBoost.doubleEarnsLeft || 0) + 3;
      nextBoosts[slug] = _kidBoost;
      boostsRef.current = nextBoosts;
      setBoosts(nextBoosts);
      markPowerupUsed(slug, unlockId);
      syncBalance(slug, coinsRef.current[slug] || 0, _kidBoost);
      flash("Double Coin Burst armed!");
      return;
    }
    if (meta.effect === "freeSwitch") {
      var _nextBoosts = Object.assign({}, boostsRef.current);
      var _kidBoost2 = Object.assign({}, _nextBoosts[slug] || defaultBoost());
      _kidBoost2.freeSwitch = true;
      _nextBoosts[slug] = _kidBoost2;
      boostsRef.current = _nextBoosts;
      setBoosts(_nextBoosts);
      markPowerupUsed(slug, unlockId);
      syncBalance(slug, coinsRef.current[slug] || 0, _kidBoost2);
      flash("Free Switch Pass ready!");
      return;
    }
    if (meta.effect === "coinDrop") {
      markPowerupUsed(slug, unlockId);
      earn(5, "Coin Drop power-up", "powerup-coin-boost", {
        skipDouble: true
      });
      return;
    }
    if (meta.effect === "playCoinDrop") {
      markPowerupUsed(slug, unlockId);
      var reward = {
        rewardId: makeRewardId(),
        kidId: slug,
        amount: 1,
        description: "Bonus Coin Drop",
        source: "powerup-extra-drop",
        createdAt: new Date().toISOString(),
        awarded: false
      };
      pendingRewardRef.current = reward;
      setPendingReward(reward);
      deferUnlockModalRef.current = true;
      setModal("coinDrop");
      flash("Bonus Drop — guide that coin!");
      return;
    }
  };
  var undoLast = function undoLast() {
    var entry = (logRef.current[kid] || [])[0] || log[kid][0];
    if (!entry) {
      flash("Nothing to undo");
      return;
    }
    var newBal = 0;
    setCoins(function (c) {
      var next = Object.assign({}, c);
      newBal = entry.type === "earned" ? Math.max(0, (c[kid] || 0) - entry.amount) : (c[kid] || 0) + entry.amount;
      next[kid] = newBal;
      coinsRef.current = next;
      return next;
    });
    setLog(function (l) {
      var next = Object.assign({}, l);
      next[kid] = (l[kid] || []).slice(1);
      logRef.current = next;
      return next;
    });
    flash("Undid " + entry.desc);
    var remoteId = !isLocalId(entry.id) ? entry.id : null;
    var tasks = [syncBalance(kid, newBal)];
    if (remoteId && supabaseReady()) {
      tasks.push(enqueueSync({
        kind: "delete",
        id: remoteId
      }));
    }
    Promise.all(tasks).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
  };
  var resetAll = function resetAll() {
    setCoins({
      sam: 0,
      isaac: 0,
      ben: 0
    });
    setLog(emptyLog());
    var clearedUnlocks = emptyUnlocks();
    var clearedBoosts = emptyBoosts();
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
    if (!supabaseReady()) return;
    var ids = kidIdsRef.current;
    var idList = Object.keys(KIDS).map(function (s) {
      return ids[s];
    }).filter(Boolean);
    var tasks = Object.keys(KIDS).map(function (slug) {
      return syncBalance(slug, 0, defaultBoost());
    });
    if (idList.length) {
      tasks.push(sbFetch("coin_transactions?kid_id=in.(" + idList.join(",") + ")", {
        method: "DELETE",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        })
      }));
      tasks.push(enqueueSync({
        kind: "unlockDeleteAll",
        kidIds: idList
      }));
    }
    Promise.all(tasks).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
  };
  var clearPendingReward = function clearPendingReward() {
    pendingRewardRef.current = null;
    setPendingReward(null);
  };
  var markPendingAwarded = function markPendingAwarded(reward) {
    var marked = Object.assign({}, reward, {
      awarded: true
    });
    pendingRewardRef.current = marked;
    setPendingReward(marked);
    return marked;
  };
  var completePendingReward = function completePendingReward(reward) {
    try {
      if (!reward || reward.awarded) return Promise.resolve(null);
      if (isPracticeBrushSource(reward.source)) {
        if (reward.rewardId) awardedRewardIdsRef.current[reward.rewardId] = true;
        markPendingAwarded(reward);
        return Promise.resolve({
          amountAwarded: 0,
          boostApplied: false,
          practice: true
        });
      }
      var slug = reward.kidId;
      if (reward.rewardId && awardedRewardIdsRef.current[reward.rewardId]) {
        clearPendingReward();
        return Promise.resolve({
          amountAwarded: 0,
          boostApplied: false,
          duplicate: true
        });
      }
      var alreadyExists = (logRef.current[slug] || []).some(function (tx) {
        return tx && reward.rewardId && tx.rewardId === reward.rewardId;
      });
      if (alreadyExists) {
        clearPendingReward();
        return Promise.resolve({
          amountAwarded: 0,
          boostApplied: false,
          duplicate: true
        });
      }
      deferUnlockModalRef.current = true;
      var result = earn(reward.amount, reward.description, reward.source, {
        kidId: slug,
        rewardId: reward.rewardId,
        deferCelebration: true,
        quiet: modal === "coinDrop" || modal === "coinChase" || modal === "mazeDash"
      });
      markPendingAwarded(reward);
      return Promise.resolve(result);
    } catch (err) {
      try {
        deferUnlockModalRef.current = true;
        var fallback = earn(reward && reward.amount || 1, reward && reward.description || "Brush teeth", reward && reward.source || "brush-am", {
          kidId: reward && reward.kidId || kid,
          rewardId: reward && reward.rewardId,
          deferCelebration: true
        });
        if (reward) markPendingAwarded(reward);else clearPendingReward();
        return Promise.resolve(fallback);
      } catch (e2) {
        clearPendingReward();
        return Promise.resolve(null);
      }
    }
  };
  var launchTestCoinDrop = function launchTestCoinDrop() {
    var pending = pendingRewardRef.current || pendingReward;
    if (pending && !pending.awarded && !isPracticeBrushSource(pending.source)) {
      flash("Finish the open coin game first");
      return;
    }
    var reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Coin Drop",
      source: "test-drop",
      createdAt: new Date().toISOString(),
      awarded: false
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("coinDrop");
    flash("Test drop — practice only");
  };
  var launchTestCoinChase = function launchTestCoinChase() {
    var pending = pendingRewardRef.current || pendingReward;
    if (pending && !pending.awarded && !isPracticeBrushSource(pending.source)) {
      flash("Finish the open coin game first");
      return;
    }
    var reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Coin Chase",
      source: "test-chase",
      createdAt: new Date().toISOString(),
      awarded: false
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("coinChase");
    flash("Test chase — practice only");
  };
  var launchTestMazeDash = function launchTestMazeDash() {
    var pending = pendingRewardRef.current || pendingReward;
    if (pending && !pending.awarded && !isPracticeBrushSource(pending.source)) {
      flash("Finish the open coin game first");
      return;
    }
    var reward = {
      rewardId: makeRewardId(),
      kidId: kid,
      amount: 1,
      description: "Test Maze Dash",
      source: "test-dash",
      createdAt: new Date().toISOString(),
      awarded: false
    };
    pendingRewardRef.current = reward;
    setPendingReward(reward);
    deferUnlockModalRef.current = true;
    setModal("mazeDash");
    flash("Test dash — practice only");
  };
  var finishCoinDropFlow = function finishCoinDropFlow() {
    deferUnlockModalRef.current = false;
    setPendingReward(null);
    pendingRewardRef.current = null;
    setTimerJob(null);
    setDone(false);
    setRunning(false);
    if (unlockQueueRef.current && unlockQueueRef.current.length) {
      try {
        tune.fanfare();
      } catch (e) {}
      setModal("unlock");
    } else {
      setModal(null);
    }
  };
  var handleCoinDropComplete = function handleCoinDropComplete() {
    finishCoinDropFlow();
  };
  var handleCloseCoinDrop = function handleCloseCoinDrop() {
    completePendingReward(pendingRewardRef.current || pendingReward).then(function () {
      finishCoinDropFlow();
    });
  };

  /* timer */
  var openTimer = function openTimer(job) {
    timerCompletedRef.current = false;
    setTimerJob(job);
    setSecs(120);
    setRunning(false);
    setDone(false);
    setModal("timer");
  };
  var closeTimer = function closeTimer() {
    tune.stop();
    setRunning(false);
    setModal(null);
    setTimerJob(null);
    timerCompletedRef.current = false;
  };
  useEffect(function () {
    if (!running) return;
    if (secs <= 0) {
      if (timerCompletedRef.current) return;
      timerCompletedRef.current = true;
      setRunning(false);
      tune.stop();
      var job = timerJob;
      var desc = job ? job.name + (job.sub ? " (" + job.sub + ")" : "") : "Brush teeth";
      var source = job ? job.id : "brush-am";
      var amount = job ? job.coins : 1;
      var reward = {
        rewardId: makeRewardId(),
        kidId: kid,
        amount: amount,
        description: desc,
        source: source,
        createdAt: new Date().toISOString(),
        awarded: false
      };
      if (settings.coinDropEnabled !== false) {
        pendingRewardRef.current = reward;
        setPendingReward(reward);
        deferUnlockModalRef.current = true;
        var nextGame = settings.lastBrushGame === "coinChase" ? "coinChase" : settings.lastBrushGame === "mazeDash" ? "mazeDash" : "coinDrop";
        setSettings(function (s) {
          return Object.assign({}, s, {
            lastBrushGame: nextBrushGame(nextGame)
          });
        });
        setModal(nextGame);
        return;
      }
      tune.fanfare();
      setDone(true);
      earn(amount, desc, source, {
        kidId: kid,
        rewardId: reward.rewardId
      });
      return;
    }
    var t = setTimeout(function () {
      setSecs(function (s) {
        return s - 1;
      });
    }, 1000);
    return function () {
      clearTimeout(t);
    };
  }, [running, secs]);

  /* Recover unresolved pending brushing rewards on boot */
  useEffect(function () {
    if (recoveryDoneRef.current) return;
    recoveryDoneRef.current = true;
    var pending = pendingRewardRef.current || pendingReward;
    if (!pending || pending.awarded) return;
    var exists = (logRef.current[pending.kidId] || []).some(function (tx) {
      return tx && tx.rewardId && tx.rewardId === pending.rewardId;
    });
    if (exists) {
      clearPendingReward();
      return;
    }
    // Prefer automatic recovery if unclear whether the game was already played
    completePendingReward(pending).then(function () {
      deferUnlockModalRef.current = false;
      if (unlockQueueRef.current && unlockQueueRef.current.length) {
        try {
          tune.fanfare();
        } catch (e) {}
        setModal("unlock");
      }
    });
  }, []);

  /* coin spill canvas — gravity follows phone tilt when available */
  useEffect(function () {
    if (modal !== "vault" || !canvasRef.current) return;
    var cv = canvasRef.current,
      ctx = cv.getContext("2d");
    var W = cv.width,
      H = cv.height,
      target = Math.min(coins[kid], 120);
    var parts = [],
      frame = 0,
      raf;
    var tilt = {
      gx: 0,
      gy: 0.34
    };
    var onOrient = function onOrient(e) {
      var gamma = typeof e.gamma === "number" ? e.gamma : 0;
      var beta = typeof e.beta === "number" ? e.beta : 0;
      var g = Math.max(-50, Math.min(50, gamma)) / 50;
      var b = Math.max(-50, Math.min(50, beta)) / 50;
      tilt.gx = g * 0.72;
      tilt.gy = 0.34 + b * 0.28;
    };
    window.addEventListener("deviceorientation", onOrient, true);
    var make = function make() {
      return {
        x: W * 0.5 + (Math.random() - 0.5) * W * 0.5,
        y: -30 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 3.4,
        vy: Math.random() * 1.6 + 1,
        r: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.22,
        s: 13 + Math.random() * 7,
        rest: false
      };
    };
    var draw = function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      var sq = Math.abs(Math.cos(p.r));
      ctx.beginPath();
      ctx.ellipse(0, 0, p.s * Math.max(sq, 0.18), p.s, 0, 0, Math.PI * 2);
      var g = ctx.createLinearGradient(-p.s, -p.s, p.s, p.s);
      g.addColorStop(0, "#fff3b0");
      g.addColorStop(.45, "#ffc42e");
      g.addColorStop(1, "#c97a00");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#8a5300";
      ctx.stroke();
      if (sq > 0.45) {
        ctx.fillStyle = "#8a5300";
        ctx.font = "bold " + Math.round(p.s) + "px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("★", 0, 1);
      }
      ctx.restore();
    };
    var _loop3 = function loop() {
      ctx.clearRect(0, 0, W, H);
      if (frame % 3 === 0 && parts.length < target) parts.push(make());
      parts.forEach(function (p) {
        if (p.rest && Math.abs(tilt.gx) > 0.1) {
          p.rest = false;
          p.vx += tilt.gx * 4;
          p.vy -= 0.6;
        }
        if (!p.rest) {
          p.vx += tilt.gx;
          p.vy += tilt.gy;
          p.x += p.vx;
          p.y += p.vy;
          p.r += p.vr;
          if (p.x < p.s || p.x > W - p.s) {
            p.vx *= -0.6;
            p.x = Math.max(p.s, Math.min(W - p.s, p.x));
          }
          if (p.y > H - p.s - 4) {
            p.y = H - p.s - 4;
            p.vy *= -0.32;
            p.vx *= 0.72;
            p.vr *= 0.5;
            if (Math.abs(p.vy) < 1.1 && Math.abs(tilt.gx) < 0.12) {
              p.rest = true;
              p.vy = 0;
              p.r = Math.round(p.r / Math.PI) * Math.PI;
            }
          }
          if (p.y < p.s) {
            p.y = p.s;
            p.vy *= -0.35;
          }
        }
        draw(p);
      });
      frame++;
      raf = requestAnimationFrame(_loop3);
    };
    _loop3();
    return function () {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrient, true);
    };
  }, [modal, kid, coins]);
  var openVault = function openVault() {
    setModal("vault");
    try {
      var DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === "function") {
        DOE.requestPermission().catch(function () {});
      }
    } catch (e) {}
  };
  var onHeroTap = function onHeroTap(key) {
    if (kid === key) {
      setModal("profile");
      return;
    }
    setKid(key);
    setFocusedRow(null);
  };
  var vaultRef = useRef(null);
  var _useState87 = useState(false),
    _useState88 = _slicedToArray(_useState87, 2),
    pinKid = _useState88[0],
    setPinKid = _useState88[1];
  useEffect(function () {
    var el = vaultRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setPinKid(true);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (entry) setPinKid(!entry.isIntersecting);
    }, {
      threshold: 0,
      rootMargin: "-12px 0px 0px 0px"
    });
    io.observe(el);
    return function () {
      io.disconnect();
    };
  }, []);
  var mmss = function mmss(s) {
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  var pct = 1 - secs / 120;
  var profileStats = kidStats(kid, log, coins);
  var kidUnlocks = unlocks[kid] || [];
  var unlockedIds = {};
  kidUnlocks.forEach(function (u) {
    unlockedIds[u.id] = u;
  });
  var trophyOwned = TROPHIES.filter(function (t) {
    return unlockedIds[t.id];
  });
  var lockedTrophySlots = Math.max(0, TROPHIES.length - trophyOwned.length);
  var powerOwned = POWERUPS.map(function (p) {
    var u = unlockedIds[p.id];
    return u ? Object.assign({}, p, {
      used: !!u.used,
      at: u.at
    }) : null;
  }).filter(Boolean);
  var kidBoost = boosts[kid] || defaultBoost();
  var freeSwitchReady = !!kidBoost.freeSwitch;

  /* ---------- row renderers ---------- */
  var JobRow = function JobRow(_ref3) {
    var job = _ref3.job,
      tone = _ref3.tone;
    var rowKey = "job:" + job.id;
    var focused = focusedRow === rowKey;
    var award = function award() {
      return earn(job.coins, job.name + (job.sub ? " (" + job.sub + ")" : ""), job.id);
    };
    var onCoin = function onCoin(e) {
      e.stopPropagation();
      if (!focused) {
        setFocusedRow(rowKey);
        return;
      }
      award();
      setFocusedRow(null);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "row is-pickable" + (focused ? " is-focused" : ""),
      role: "button",
      tabIndex: 0,
      "aria-pressed": focused,
      onClick: function onClick() {
        return setFocusedRow(rowKey);
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFocusedRow(rowKey);
        }
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      light: true,
      src: IMAGES.jobs[job.id],
      label: job.id,
      icon: job.icon,
      className: "icon-slot"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rtext"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rname"
    }, job.name), job.sub && /*#__PURE__*/React.createElement("div", {
      className: "rsub"
    }, job.sub), focused && /*#__PURE__*/React.createElement("div", {
      className: "rsub focus-hint"
    }, "Now tap the coin ✓")), job.timer && /*#__PURE__*/React.createElement("button", {
      className: "timer-mini",
      title: "Start 2-minute brushing timer",
      onClick: function onClick(e) {
        e.stopPropagation();
        openTimer(job);
      }
    }, "⏱️"), /*#__PURE__*/React.createElement(CoinBtn, {
      value: job.coins,
      tone: tone,
      onClick: onCoin
    }));
  };
  var ShopRow = function ShopRow(_ref4) {
    var item = _ref4.item,
      tone = _ref4.tone,
      locked = _ref4.locked;
    var rowKey = "shop:" + item.id;
    var focused = focusedRow === rowKey;
    var isFreeSwitch = item.id === "switch15" && freeSwitchReady;
    var cost = isFreeSwitch ? 0 : item.coins;
    var cant = !isFreeSwitch && coins[kid] < item.coins;
    var blocked = locked || cant;
    var buy = function buy() {
      if (!blocked) spend(cost, item.name, item.id);
    };
    var onCoin = function onCoin(e) {
      e.stopPropagation();
      if (blocked) return;
      if (!focused) {
        setFocusedRow(rowKey);
        return;
      }
      buy();
      setFocusedRow(null);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "row is-pickable " + (locked ? "locked " : "") + (cant ? "cant" : "") + (isFreeSwitch ? " free-pass" : "") + (focused ? " is-focused" : ""),
      role: "button",
      tabIndex: 0,
      "aria-pressed": focused,
      onClick: function onClick() {
        return setFocusedRow(rowKey);
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFocusedRow(rowKey);
        }
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      light: true,
      src: IMAGES.shop[item.id],
      label: item.id,
      className: "icon-slot"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rtext"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rname"
    }, item.name), item.sub && /*#__PURE__*/React.createElement("div", {
      className: "rsub"
    }, item.sub), isFreeSwitch && /*#__PURE__*/React.createElement("div", {
      className: "rsub free-tag"
    }, "Free Switch Pass ready!"), focused && !blocked && /*#__PURE__*/React.createElement("div", {
      className: "rsub focus-hint"
    }, "Now tap the coin ✓")), /*#__PURE__*/React.createElement(CoinBtn, {
      value: isFreeSwitch ? 0 : item.coins,
      word: isFreeSwitch ? "FREE" : undefined,
      tone: tone,
      disabled: blocked,
      onClick: onCoin
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("button", {
    className: "cog-btn",
    type: "button",
    "aria-label": "Parent settings",
    onClick: function onClick() {
      return setModal("settings");
    }
  }, "⚙"), /*#__PURE__*/React.createElement("div", {
    className: "burst"
  }), /*#__PURE__*/React.createElement("img", {
    className: "brand-logo",
    src: IMAGES.logo,
    alt: "Hero Coins"
  }), /*#__PURE__*/React.createElement("div", {
    className: "comic title-line1 outline-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n-sam"
  }, "Sam"), /*#__PURE__*/React.createElement("span", {
    className: "n-amp"
  }, ", "), /*#__PURE__*/React.createElement("span", {
    className: "n-isaac"
  }, "Isaac"), " ", /*#__PURE__*/React.createElement("span", {
    className: "n-amp"
  }, "&"), " ", /*#__PURE__*/React.createElement("span", {
    className: "n-ben"
  }, "Ben's")), /*#__PURE__*/React.createElement("div", {
    className: "comic title-line2 outline-3"
  }, "Coin Chart"), /*#__PURE__*/React.createElement("div", {
    className: "ribbon bang"
  }, "★ Earn coins. Spend or save! ★")), /*#__PURE__*/React.createElement("div", {
    className: "hero-row"
  }, Object.entries(KIDS).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
      key = _ref6[0],
      k = _ref6[1];
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: "hero-card " + k.cls + (kid === key ? " active" : ""),
      onClick: function onClick() {
        return onHeroTap(key);
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      src: IMAGES[k.img],
      label: k.name + " photo",
      className: "portrait"
    }), /*#__PURE__*/React.createElement("div", {
      className: "comic hname"
    }, k.name, " ", k.badge), /*#__PURE__*/React.createElement("div", {
      className: "hbal"
    }, "🪙 ", coins[key]), kid === key && /*#__PURE__*/React.createElement("div", {
      className: "hprofile-hint"
    }, "Tap again for profile"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "vault",
    ref: vaultRef,
    onClick: openVault
  }, /*#__PURE__*/React.createElement(Slot, {
    light: true,
    src: IMAGES[K.img],
    label: K.name,
    style: {
      width: "56px",
      height: "56px",
      borderRadius: "50%"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, K.name, "'s coin bank"), /*#__PURE__*/React.createElement("div", {
    className: "comic big"
  }, coins[kid]), (kidBoost.doubleEarnsLeft > 0 || kidBoost.freeSwitch) && /*#__PURE__*/React.createElement("div", {
    className: "boost-pills"
  }, kidBoost.doubleEarnsLeft > 0 && /*#__PURE__*/React.createElement("span", {
    className: "boost-pill"
  }, "⚡ 2× ×", kidBoost.doubleEarnsLeft), kidBoost.freeSwitch && /*#__PURE__*/React.createElement("span", {
    className: "boost-pill"
  }, "🎮 Free Switch"))), /*#__PURE__*/React.createElement("div", {
    className: "tap"
  }, "Tap the lid", /*#__PURE__*/React.createElement("br", null), "to tip them out ⤵")), pinKid && !modal && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kid-pin " + K.cls,
    onClick: function onClick() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    "aria-label": K.name + "'s chart — tap to go to top"
  }, /*#__PURE__*/React.createElement(Slot, {
    src: IMAGES[K.img],
    label: K.name,
    className: "kid-pin-face"
  }), /*#__PURE__*/React.createElement("span", {
    className: "comic kid-pin-name"
  }, K.name, " ", K.badge), /*#__PURE__*/React.createElement("span", {
    className: "kid-pin-bal"
  }, "🪙 ", coins[kid])), /*#__PURE__*/React.createElement("div", {
    className: "cols"
  }, /*#__PURE__*/React.createElement("section", {
    className: "panel earn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "comic ptitle outline-2"
  }, "How to Earn"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "1.7rem"
    }
  }, "🪙")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band gold comic"
  }, "★ Everyday Jobs ★"), EVERYDAY_JOBS.map(function (j) {
    return /*#__PURE__*/React.createElement(JobRow, {
      key: j.id,
      job: j
    });
  }), /*#__PURE__*/React.createElement("div", {
    className: "band red comic"
  }, "★ Bonus Jobs ★"), BONUS_JOBS.map(function (j) {
    return /*#__PURE__*/React.createElement(JobRow, {
      key: j.id,
      job: j
    });
  }))), /*#__PURE__*/React.createElement("section", {
    className: "panel shop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "comic ptitle outline-2"
  }, "The Shop"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "1.7rem"
    }
  }, "🛒")), /*#__PURE__*/React.createElement("div", {
    className: "panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band blue comic"
  }, "★ Everyday Shop — any day ★"), EVERYDAY_SHOP.map(function (i) {
    return /*#__PURE__*/React.createElement(ShopRow, {
      key: i.id,
      item: i,
      tone: "blue"
    });
  }), /*#__PURE__*/React.createElement("div", {
    className: "band green comic"
  }, "★ Weekend Only ★"), !weekend && /*#__PURE__*/React.createElement("div", {
    className: "locknote"
  }, "🔒 Locked until Saturday"), WEEKEND_SHOP.map(function (i) {
    return /*#__PURE__*/React.createElement(ShopRow, {
      key: i.id,
      item: i,
      tone: "green",
      locked: !weekend
    });
  }), /*#__PURE__*/React.createElement("div", {
    className: "band purple comic"
  }, "★ Special Rule ★"), /*#__PURE__*/React.createElement("div", {
    className: "row is-pickable" + (coins[kid] < 2 ? " cant" : "") + (focusedRow === "shop:tax" ? " is-focused" : ""),
    role: "button",
    tabIndex: 0,
    "aria-pressed": focusedRow === "shop:tax",
    onClick: function onClick() {
      return setFocusedRow("shop:tax");
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setFocusedRow("shop:tax");
      }
    }
  }, /*#__PURE__*/React.createElement(Slot, {
    light: true,
    src: IMAGES.shop.tax,
    label: "tax",
    className: "icon-slot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rtext"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rname"
  }, "Mum's Food Tax"), /*#__PURE__*/React.createElement("div", {
    className: "rsub"
  }, "Ask nicely — 2 coins per request"), focusedRow === "shop:tax" && coins[kid] >= 2 && /*#__PURE__*/React.createElement("div", {
    className: "rsub focus-hint"
  }, "Now tap the coin ✓")), /*#__PURE__*/React.createElement(CoinBtn, {
    value: 2,
    word: "PER REQ",
    disabled: coins[kid] < 2,
    onClick: function onClick(e) {
      e.stopPropagation();
      if (coins[kid] < 2) return;
      if (focusedRow !== "shop:tax") {
        setFocusedRow("shop:tax");
        return;
      }
      spend(2, "Mum's Food Tax", "tax");
      setFocusedRow(null);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "band red comic"
  }, "★ Savings Shop — weekends ★"), !weekend && /*#__PURE__*/React.createElement("div", {
    className: "locknote"
  }, "🔒 Big rewards open Saturday & Sunday"), SAVINGS_SHOP.map(function (i) {
    return /*#__PURE__*/React.createElement(ShopRow, {
      key: i.id,
      item: i,
      locked: !weekend
    });
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bottom"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero-art"
  }, Object.entries(KIDS).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
      key = _ref8[0],
      k = _ref8[1];
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      onClick: function onClick() {
        return onHeroTap(key);
      },
      style: {
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      src: IMAGES[k.img],
      label: k.name + " hero art",
      className: "big-slot"
    }), /*#__PURE__*/React.createElement("div", {
      className: "comic cap",
      style: {
        color: k.colour
      }
    }, k.name, " ", k.badge));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "comic"
  }, "★ The Rules ★"), /*#__PURE__*/React.createElement("div", {
    className: "rule"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "1"), /*#__PURE__*/React.createElement("span", null, "Do the job ➜ get your coins")), /*#__PURE__*/React.createElement("div", {
    className: "rule"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "2"), /*#__PURE__*/React.createElement("span", null, "Payday every day 🪙 — Shop Day is ", /*#__PURE__*/React.createElement("b", null, "Saturday"))), /*#__PURE__*/React.createElement("div", {
    className: "rule"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "3"), /*#__PURE__*/React.createElement("span", null, "Spend now or save up for something bigger — your choice!")), /*#__PURE__*/React.createElement("button", {
    className: "btn tax",
    onClick: function onClick() {
      return spend(2, "Mum's Food Tax", "tax");
    }
  }, "🍽️ Mum's Food Tax −2"), /*#__PURE__*/React.createElement("button", {
    className: "btn hist",
    onClick: function onClick() {
      return setModal("history");
    }
  }, "📋 ", K.name, "'s History"), /*#__PURE__*/React.createElement("button", {
    className: "btn profile",
    onClick: function onClick() {
      return setModal("profile");
    }
  }, "🏅 ", K.name, "'s Profile"))), /*#__PURE__*/React.createElement("div", {
    className: "footer-strip comic"
  }, "★ Be a hero. Make good choices. Reach your goals! ★"), modal === "vault" && /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet-head",
    style: {
      background: K.colour
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic outline-2"
  }, K.name, "'s Coins")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-body"
  }, /*#__PURE__*/React.createElement("canvas", {
    id: "coinCanvas",
    ref: canvasRef,
    width: "460",
    height: "340"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "comic",
    style: {
      fontSize: "3.4rem",
      color: "var(--red-dark)"
    }
  }, coins[kid]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      letterSpacing: "1px"
    }
  }, "COINS IN THE BANK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: ".85rem",
      color: "#7a3b00",
      marginTop: "6px"
    }
  }, "Tilt your phone to roll the coins!")), /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Close")))), modal === "timer" && /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet-head",
    style: {
      background: "var(--green)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic outline-2"
  }, "🪥 Brushing Time")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-body"
  }, done ? /*#__PURE__*/React.createElement("div", {
    className: "celebrate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spin",
    style: {
      fontSize: "3.5rem"
    }
  }, "🪙"), /*#__PURE__*/React.createElement("div", {
    className: "comic pop"
  }, "Well done, ", K.name, "!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      marginTop: "6px"
    }
  }, "You earned your brushing coin ⭐"), /*#__PURE__*/React.createElement("button", {
    className: "btn go",
    onClick: closeTimer
  }, "Brilliant!")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    className: "timer-ring",
    width: "180",
    height: "180",
    viewBox: "0 0 120 120"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "52",
    fill: "none",
    stroke: "#00000022",
    strokeWidth: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "60",
    r: "52",
    fill: "none",
    stroke: "#1a7a34",
    strokeWidth: "12",
    strokeLinecap: "round",
    strokeDasharray: 2 * Math.PI * 52,
    strokeDashoffset: 2 * Math.PI * 52 * (1 - pct),
    transform: "rotate(-90 60 60)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "timer-num"
  }, mmss(secs)), /*#__PURE__*/React.createElement("div", {
    className: "brush-tip"
  }, running ? "Keep going — top, bottom, all the way round! 🎵" : "Press start, then brush for two whole minutes."), !running ? /*#__PURE__*/React.createElement("button", {
    className: "btn go",
    onClick: function onClick() {
      setRunning(true);
      tune.start();
    }
  }, "▶ Start brushing") : /*#__PURE__*/React.createElement("button", {
    className: "btn stop",
    onClick: function onClick() {
      tune.pause();
      setRunning(false);
    }
  }, "⏸ Pause"), /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    onClick: closeTimer
  }, "Cancel"))))), modal === "coinDrop" && pendingReward && /*#__PURE__*/React.createElement(CoinDropGame, {
    kid: Object.assign({}, KIDS[pendingReward.kidId] || K, {
      id: pendingReward.kidId || kid
    }),
    reward: pendingReward,
    tiltControlsEnabled: settings.tiltControlsEnabled !== false,
    awardReward: completePendingReward,
    onComplete: handleCoinDropComplete,
    onClose: handleCoinDropComplete
  }), modal === "coinChase" && pendingReward && /*#__PURE__*/React.createElement(CoinChaseGame, {
    kid: Object.assign({}, KIDS[pendingReward.kidId] || K, {
      id: pendingReward.kidId || kid
    }),
    reward: pendingReward,
    awardReward: completePendingReward,
    onComplete: handleCoinDropComplete,
    onClose: handleCoinDropComplete
  }), modal === "mazeDash" && pendingReward && /*#__PURE__*/React.createElement(MazeDashGame, {
    kid: Object.assign({}, KIDS[pendingReward.kidId] || K, {
      id: pendingReward.kidId || kid
    }),
    reward: pendingReward,
    awardReward: completePendingReward,
    onComplete: handleCoinDropComplete,
    onClose: handleCoinDropComplete
  }), modal === "history" && /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet-head",
    style: {
      background: "var(--blue-dark)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic outline-2"
  }, "📋 ", K.name, "'s History")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-body"
  }, log[kid].length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "26px",
      fontWeight: 800,
      color: "#777"
    }
  }, "Nothing logged yet today.") : log[kid].map(function (e, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "hist-item " + e.type
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "hdesc"
    }, e.desc), /*#__PURE__*/React.createElement("div", {
      className: "htime"
    }, e.when)), /*#__PURE__*/React.createElement("div", {
      className: "hamt"
    }, e.type === "earned" ? "+" : "−", e.amount));
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Close")))), modal === "profile" && /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet profile-sheet",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet-head",
    style: {
      background: K.colour
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic outline-2"
  }, "🏅 ", K.name, "'s Profile")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-hero"
  }, /*#__PURE__*/React.createElement(Slot, {
    src: IMAGES[K.img],
    label: K.name,
    className: "profile-portrait"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "comic profile-name"
  }, K.name, " ", K.badge), /*#__PURE__*/React.createElement("div", {
    className: "profile-bal"
  }, "🪙 ", coins[kid], " coins"))), /*#__PURE__*/React.createElement("div", {
    className: "stats-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-n"
  }, profileStats.earned), /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "Earned")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-n"
  }, profileStats.spent), /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "Spent")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-n"
  }, profileStats.jobsDone), /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "Jobs")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-n"
  }, trophyOwned.length), /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, "Trophies"))), /*#__PURE__*/React.createElement("div", {
    className: "band gold comic"
  }, "★ Trophies ★"), /*#__PURE__*/React.createElement("div", {
    className: "trophy-grid"
  }, trophyOwned.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "trophy-tile earned"
    }, /*#__PURE__*/React.createElement("div", {
      className: "trophy-ico"
    }, t.icon), /*#__PURE__*/React.createElement("div", {
      className: "trophy-name"
    }, t.name));
  }), function () {
    var slots = [];
    for (var i = 0; i < lockedTrophySlots; i++) {
      slots.push(/*#__PURE__*/React.createElement("div", {
        key: "locked-" + i,
        className: "trophy-tile locked"
      }, /*#__PURE__*/React.createElement("div", {
        className: "trophy-ico"
      }, "❓"), /*#__PURE__*/React.createElement("div", {
        className: "trophy-name"
      }, "???")));
    }
    return slots;
  }(), trophyOwned.length === 0 && lockedTrophySlots === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-note"
  }, "Keep being a hero — surprises await!")), /*#__PURE__*/React.createElement("div", {
    className: "band purple comic"
  }, "★ Power-ups ★"), /*#__PURE__*/React.createElement("div", {
    className: "power-list"
  }, powerOwned.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty-note"
  }, "No power-ups yet — keep earning!"), powerOwned.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "power-row " + (p.used ? "used" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "power-ico"
    }, p.icon), /*#__PURE__*/React.createElement("div", {
      className: "power-text"
    }, /*#__PURE__*/React.createElement("div", {
      className: "power-name"
    }, p.name), /*#__PURE__*/React.createElement("div", {
      className: "power-blurb"
    }, p.blurb)), p.used ? /*#__PURE__*/React.createElement("span", {
      className: "used-badge"
    }, "Used") : /*#__PURE__*/React.createElement("button", {
      className: "btn use-btn",
      type: "button",
      onClick: function onClick() {
        return usePowerup(p.id);
      }
    }, "Use"));
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn hist",
    onClick: function onClick() {
      return setModal("history");
    }
  }, "📋 View History"), /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Close")))), modal === "unlock" && celebrating && celebrateMeta && /*#__PURE__*/React.createElement("div", {
    className: "modal unlock-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet unlock-sheet",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet-head",
    style: {
      background: KIDS[celebrating.slug || kid].colour
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic outline-2"
  }, celebrateMeta.type === "powerup" ? "⚡ Power-up!" : "🏆 Trophy!")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-body unlock-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "unlock-burst"
  }, celebrateMeta.icon), /*#__PURE__*/React.createElement("div", {
    className: "comic unlock-title pop"
  }, celebrateMeta.name), /*#__PURE__*/React.createElement("div", {
    className: "unlock-sub"
  }, "Amazing work, ", KIDS[celebrating.slug || kid].name, "!", celebrateMeta.type === "powerup" ? " A power-up is waiting on your profile." : " It's yours forever — check your profile!"), /*#__PURE__*/React.createElement("button", {
    className: "btn go",
    onClick: dismissUnlock
  }, unlockQueue.length > 1 ? "Next surprise!" : "Awesome!")))), modal === "settings" && /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: function onClick() {
      return setModal(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sheet-head",
    style: {
      background: "var(--navy)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "comic outline-2"
  }, "⚙ Parent Settings")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "settings-note"
  }, "For Mum & Dad — undo mistakes or start fresh."), /*#__PURE__*/React.createElement("div", {
    className: "settings-bal"
  }, K.name, ": 🪙 ", coins[kid], log[kid][0] ? " · last: " + (log[kid][0].type === "earned" ? "+" : "−") + log[kid][0].amount + " " + log[kid][0].desc : " · no history"), /*#__PURE__*/React.createElement("div", {
    className: "settings-note",
    style: {
      marginTop: "8px"
    }
  }, "Sync: ", cloud === "online" ? "☁ Shared (Supabase)" : cloud === "syncing" ? "☁ Connecting…" : cloud === "offline" ? "⚠ Offline — this device only" : "📱 This device only"), /*#__PURE__*/React.createElement("div", {
    className: "settings-note"
  }, "Unlocks: ", (unlocks[kid] || []).length, " · Boosts: 2×", kidBoost.doubleEarnsLeft, kidBoost.freeSwitch ? " · Free Switch" : ""), /*#__PURE__*/React.createElement("label", {
    className: "settings-toggle"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: settings.coinDropEnabled !== false,
    onChange: function onChange(e) {
      setSettings(function (s) {
        return Object.assign({}, s, {
          coinDropEnabled: e.target.checked
        });
      });
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Brushing reward games"), /*#__PURE__*/React.createElement("em", null, "After brushing, rotate Coin Drop, Coin Chase, and Maze Dash. Coin is always kept."))), /*#__PURE__*/React.createElement("label", {
    className: "settings-toggle"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: settings.tiltControlsEnabled !== false,
    onChange: function onChange(e) {
      setSettings(function (s) {
        return Object.assign({}, s, {
          tiltControlsEnabled: e.target.checked
        });
      });
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Tilt controls"), /*#__PURE__*/React.createElement("em", null, "Use device tilt in Coin Drop when available."))), /*#__PURE__*/React.createElement("button", {
    className: "btn go",
    type: "button",
    onClick: launchTestCoinDrop
  }, "▶ Play test drop (", K.name, ")"), /*#__PURE__*/React.createElement("div", {
    className: "settings-note",
    style: {
      marginTop: "-4px"
    }
  }, "Practice only — opens Coin Drop now, does not add coins."), /*#__PURE__*/React.createElement("button", {
    className: "btn go",
    type: "button",
    onClick: launchTestCoinChase
  }, "▶ Play test chase (", K.name, ")"), /*#__PURE__*/React.createElement("div", {
    className: "settings-note",
    style: {
      marginTop: "-4px"
    }
  }, "Practice only — opens Coin Chase now, does not add coins."), /*#__PURE__*/React.createElement("button", {
    className: "btn go",
    type: "button",
    onClick: launchTestMazeDash
  }, "▶ Play test dash (", K.name, ")"), /*#__PURE__*/React.createElement("div", {
    className: "settings-note",
    style: {
      marginTop: "-4px"
    }
  }, "Practice only — opens Maze Dash now, does not add coins."), /*#__PURE__*/React.createElement("button", {
    className: "btn undo",
    onClick: undoLast,
    disabled: !log[kid].length
  }, "↩ Undo last for ", K.name), /*#__PURE__*/React.createElement("button", {
    className: "btn stop",
    onClick: resetAll
  }, "Reset all kids to 0"), /*#__PURE__*/React.createElement("button", {
    className: "btn close",
    onClick: function onClick() {
      return setModal(null);
    }
  }, "Close")))), toast && /*#__PURE__*/React.createElement("div", {
    className: "toast"
  }, toast));
}
ReactDOM.render(/*#__PURE__*/React.createElement(App, null), document.getElementById("root"));
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  });
}
