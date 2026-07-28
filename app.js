function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
    "tidy": "/img/tidy.png",
    "cook": "/img/cook.png",
    "club": "/img/club.png",
    "kind": "/img/kind.png"
  },
  shop: {
    "tv": "",
    "screentime": "",
    "snack": "",
    "movie": "",
    "switch15": "",
    "switch30": "",
    "tax": "",
    "toy-small": "",
    "park": "",
    "late": "",
    "dayout": "",
    "toy-big": "",
    "cinema": ""
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
  id: "dinner",
  name: "Sit nicely at the table",
  sub: "Eat your dinner",
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

/* ---------- image placeholder component ---------- */
function Slot(_ref) {
  var src = _ref.src,
    label = _ref.label,
    className = _ref.className,
    style = _ref.style,
    light = _ref.light;
  return /*#__PURE__*/React.createElement("div", {
    className: "slot " + (src ? "has-img " : "") + (light ? "light " : "") + (className || ""),
    style: style
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label
  }) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "slot-ico"
  }, "🖼️"), /*#__PURE__*/React.createElement("div", {
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
function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {
      kid: "sam",
      coins: Object.assign({}, DEFAULT_COINS),
      log: emptyLog()
    };
    var parsed = JSON.parse(raw);
    return {
      kid: parsed.kid && KIDS[parsed.kid] ? parsed.kid : "sam",
      coins: Object.assign({}, DEFAULT_COINS, parsed.coins || {}),
      log: {
        sam: Array.isArray(parsed.log && parsed.log.sam) ? parsed.log.sam : [],
        isaac: Array.isArray(parsed.log && parsed.log.isaac) ? parsed.log.isaac : [],
        ben: Array.isArray(parsed.log && parsed.log.ben) ? parsed.log.ben : []
      }
    };
  } catch (e) {
    return {
      kid: "sam",
      coins: Object.assign({}, DEFAULT_COINS),
      log: emptyLog()
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

/* ================= APP ================= */
function App() {
  var initial = useMemo(function () {
    return loadState();
  }, []);
  var _useState = useState(initial.kid),
    _useState2 = _slicedToArray(_useState, 2),
    kid = _useState2[0],
    setKid = _useState2[1];
  var _useState3 = useState(initial.coins),
    _useState4 = _slicedToArray(_useState3, 2),
    coins = _useState4[0],
    setCoins = _useState4[1];
  var _useState5 = useState(initial.log),
    _useState6 = _slicedToArray(_useState5, 2),
    log = _useState6[0],
    setLog = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    modal = _useState8[0],
    setModal = _useState8[1]; // 'vault' | 'timer' | 'history' | 'settings'
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    timerJob = _useState0[0],
    setTimerJob = _useState0[1];
  var _useState1 = useState(120),
    _useState10 = _slicedToArray(_useState1, 2),
    secs = _useState10[0],
    setSecs = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    running = _useState12[0],
    setRunning = _useState12[1];
  var _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    done = _useState14[0],
    setDone = _useState14[1];
  var _useState15 = useState(null),
    _useState16 = _slicedToArray(_useState15, 2),
    toast = _useState16[0],
    setToast = _useState16[1];
  var _useState17 = useState(supabaseReady() ? "syncing" : "local"),
    _useState18 = _slicedToArray(_useState17, 2),
    cloud = _useState18[0],
    setCloud = _useState18[1];
  var canvasRef = useRef(null);
  var kidIdsRef = useRef({});
  var hydratedRef = useRef(false);
  var syncReadyRef = useRef(false);
  var pendingSyncRef = useRef([]);
  var coinsRef = useRef(initial.coins);
  var logRef = useRef(initial.log);
  var tune = useBrushingTune();
  useEffect(function () {
    coinsRef.current = coins;
    logRef.current = log;
  }, [coins, log]);
  useEffect(function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        kid: kid,
        coins: coins,
        log: log
      }));
    } catch (e) {}
  }, [kid, coins, log]);
  useEffect(function () {
    if (!supabaseReady() || hydratedRef.current) return;
    hydratedRef.current = true;
    Promise.all([sbFetch("coin_kids?select=id,slug,balance&order=sort_order.asc", {
      headers: sbHeaders()
    }), sbFetch("coin_transactions?select=id,kid_id,entry_type,amount,description,created_at&order=created_at.desc", {
      headers: sbHeaders()
    })]).then(function (results) {
      var kids = results[0] || [];
      var txs = results[1] || [];
      var ids = {};
      var remoteCoins = Object.assign({}, DEFAULT_COINS);
      kids.forEach(function (row) {
        if (KIDS[row.slug]) {
          ids[row.slug] = row.id;
          remoteCoins[row.slug] = Number(row.balance) || 0;
        }
      });
      kidIdsRef.current = ids;
      // Keep syncReadyRef false until hydrate finishes so earns during fetch stay queued.

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
          when: formatWhen(tx.created_at)
        });
      });

      // Use live local state (may have changed while the fetch was in flight).
      var liveCoins = Object.assign({}, DEFAULT_COINS, coinsRef.current || {});
      var liveLog = {
        sam: logRef.current && logRef.current.sam || [],
        isaac: logRef.current && logRef.current.isaac || [],
        ben: logRef.current && logRef.current.ben || []
      };
      var remoteEmpty = totalCoins(remoteCoins) === 0 && logCount(remoteLog) === 0;
      var localHasData = totalCoins(liveCoins) > 0 || logCount(liveLog) > 0;
      var preferLocal = remoteEmpty && localHasData || localIsAhead(liveCoins, liveLog, remoteCoins, remoteLog);
      if (preferLocal && Object.keys(ids).length) {
        return pushLocalToCloud(liveCoins, liveLog, ids, remoteLog).then(function (result) {
          var mappedLog = result && result.log ? result.log : result || liveLog;
          var tempIdMap = result && result.tempIdMap || {};

          // Keep whatever the user has now (including earns during the upload).
          var latestCoins = Object.assign({}, DEFAULT_COINS, coinsRef.current || liveCoins);
          setLog(function (current) {
            var out = emptyLog();
            Object.keys(KIDS).forEach(function (slug) {
              out[slug] = (current[slug] || []).map(function (e) {
                var mapped = tempIdMap[e.id];
                return mapped ? Object.assign({}, e, mapped) : e;
              });
            });
            // If current was somehow empty, fall back to mapped log.
            if (logCount(out) === 0 && logCount(mappedLog) > 0) return mappedLog;
            logRef.current = out;
            return out;
          });
          coinsRef.current = latestCoins;
          setCoins(latestCoins);

          // Drop insert jobs already uploaded; keep anything newer for flush.
          pendingSyncRef.current = pendingSyncRef.current.filter(function (job) {
            return !(job.kind === "insert" && tempIdMap[job.tempId]);
          });
          syncReadyRef.current = true;
          var balTasks = Object.keys(KIDS).map(function (slug) {
            return runSyncJob({
              kind: "balance",
              slug: slug,
              balance: latestCoins[slug] || 0
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
      setCoins(remoteCoins);
      setLog(remoteLog);
      syncReadyRef.current = true;
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
  }, []);
  function pushLocalToCloud(localCoins, localLog, ids, remoteLog) {
    var patches = Object.keys(KIDS).map(function (slug) {
      if (!ids[slug]) return Promise.resolve();
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
          body: {
            kid_id: kidId,
            entry_type: entry.type === "spent" ? "spent" : "earned",
            amount: entry.amount,
            description: entry.desc || ""
          }
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
      if (!unsynced.length) return {
        log: merged,
        tempIdMap: tempIdMap
      };
      return sbFetch("coin_transactions", {
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
    });
  }
  function runSyncJob(job) {
    if (job.kind === "balance") {
      // Always prefer the live balance so out-of-order patches can't leave the cloud stale.
      var balance = coinsRef.current && coinsRef.current[job.slug] != null ? coinsRef.current[job.slug] : job.balance;
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
    }
    if (job.kind === "insert") {
      var kidId = kidIdsRef.current[job.slug];
      if (!kidId) return Promise.resolve(null);
      return sbFetch("coin_transactions", {
        method: "POST",
        headers: sbHeaders({
          "Prefer": "return=representation"
        }),
        body: JSON.stringify({
          kid_id: kidId,
          entry_type: job.entryType,
          amount: job.amount,
          description: job.desc
        })
      }).then(function (rows) {
        var row = rows && rows[0] ? rows[0] : null;
        if (row && job.tempId) {
          setLog(function (l) {
            var next = Object.assign({}, l);
            next[job.slug] = (l[job.slug] || []).map(function (e) {
              return e.id === job.tempId ? Object.assign({}, e, {
                id: row.id,
                when: formatWhen(row.created_at) || e.when
              }) : e;
            });
            return next;
          });
        }
        return row;
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
    return Promise.resolve();
  }
  function enqueueSync(job) {
    if (!supabaseReady()) return Promise.resolve(null);
    if (!syncReadyRef.current || job.slug && !kidIdsRef.current[job.slug] && job.kind !== "delete") {
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
  function syncBalance(slug, balance) {
    return enqueueSync({
      kind: "balance",
      slug: slug,
      balance: balance
    });
  }
  function syncInsertTx(slug, entryType, amount, desc, tempId) {
    return enqueueSync({
      kind: "insert",
      slug: slug,
      entryType: entryType,
      amount: amount,
      desc: desc,
      tempId: tempId
    });
  }
  var weekend = useMemo(function () {
    var d = new Date().getDay();
    return d === 0 || d === 6;
  }, []);
  var K = KIDS[kid];
  var flash = function flash(msg) {
    setToast(msg);
    setTimeout(function () {
      setToast(null);
    }, 1700);
  };
  var earn = function earn(amount, desc) {
    var when = new Date().toLocaleString("en-GB");
    var tempId = "local-" + Date.now();
    var entry = {
      id: tempId,
      type: "earned",
      amount: amount,
      desc: desc,
      when: when
    };
    var newBal = 0;
    setCoins(function (c) {
      var next = Object.assign({}, c);
      newBal = (c[kid] || 0) + amount;
      next[kid] = newBal;
      coinsRef.current = next;
      return next;
    });
    setLog(function (l) {
      var next = Object.assign({}, l);
      next[kid] = [entry].concat(l[kid] || []);
      logRef.current = next;
      return next;
    });
    flash("+" + amount + " for " + K.name + "!");
    Promise.all([syncInsertTx(kid, "earned", amount, desc, tempId), syncBalance(kid, newBal)]).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
  };
  var spend = function spend(amount, desc) {
    if ((coinsRef.current[kid] || 0) < amount) {
      flash("Not enough coins!");
      return;
    }
    var when = new Date().toLocaleString("en-GB");
    var tempId = "local-" + Date.now();
    var entry = {
      id: tempId,
      type: "spent",
      amount: amount,
      desc: desc,
      when: when
    };
    var newBal = 0;
    setCoins(function (c) {
      var next = Object.assign({}, c);
      newBal = (c[kid] || 0) - amount;
      next[kid] = newBal;
      coinsRef.current = next;
      return next;
    });
    setLog(function (l) {
      var next = Object.assign({}, l);
      next[kid] = [entry].concat(l[kid] || []);
      logRef.current = next;
      return next;
    });
    flash("−" + amount + " · " + desc);
    Promise.all([syncInsertTx(kid, "spent", amount, desc, tempId), syncBalance(kid, newBal)]).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
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
    flash("All kids reset to 0");
    setModal(null);
    if (!supabaseReady()) return;
    var ids = kidIdsRef.current;
    var idList = Object.keys(KIDS).map(function (s) {
      return ids[s];
    }).filter(Boolean);
    var tasks = Object.keys(KIDS).map(function (slug) {
      return syncBalance(slug, 0);
    });
    if (idList.length) {
      tasks.push(sbFetch("coin_transactions?kid_id=in.(" + idList.join(",") + ")", {
        method: "DELETE",
        headers: sbHeaders({
          "Prefer": "return=minimal"
        })
      }));
    }
    Promise.all(tasks).then(function () {
      setCloud("online");
    }).catch(function () {
      setCloud("offline");
    });
  };

  /* timer */
  var openTimer = function openTimer(job) {
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
  };
  useEffect(function () {
    if (!running) return;
    if (secs <= 0) {
      setRunning(false);
      tune.stop();
      tune.fanfare();
      setDone(true);
      earn(timerJob ? timerJob.coins : 1, timerJob ? timerJob.name + " (" + timerJob.sub + ")" : "Brush teeth");
      return;
    }
    var t = setTimeout(function () {
      return setSecs(function (s) {
        return s - 1;
      });
    }, 1000);
    return function () {
      return clearTimeout(t);
    };
  }, [running, secs]);

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
    var _loop2 = function loop() {
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
      raf = requestAnimationFrame(_loop2);
    };
    _loop2();
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
  var mmss = function mmss(s) {
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  var pct = 1 - secs / 120;

  /* ---------- row renderers ---------- */
  var JobRow = function JobRow(_ref3) {
    var job = _ref3.job,
      tone = _ref3.tone,
      group = _ref3.group;
    return /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement(Slot, {
      light: true,
      src: IMAGES.jobs[job.id],
      label: job.id,
      className: "icon-slot"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rtext"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rname"
    }, job.name), job.sub && /*#__PURE__*/React.createElement("div", {
      className: "rsub"
    }, job.sub)), job.timer && /*#__PURE__*/React.createElement("button", {
      className: "timer-mini",
      title: "Start 2-minute brushing timer",
      onClick: function onClick() {
        return openTimer(job);
      }
    }, "⏱️"), /*#__PURE__*/React.createElement(CoinBtn, {
      value: job.coins,
      tone: tone,
      onClick: function onClick() {
        return earn(job.coins, job.name + (job.sub ? " (" + job.sub + ")" : ""));
      }
    }));
  };
  var ShopRow = function ShopRow(_ref4) {
    var item = _ref4.item,
      tone = _ref4.tone,
      locked = _ref4.locked,
      section = _ref4.section;
    var cant = coins[kid] < item.coins;
    return /*#__PURE__*/React.createElement("div", {
      className: "row " + (locked ? "locked " : "") + (cant ? "cant" : "")
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
    }, item.sub)), /*#__PURE__*/React.createElement(CoinBtn, {
      value: item.coins,
      tone: tone,
      disabled: locked || cant,
      onClick: function onClick() {
        return spend(item.coins, item.name);
      }
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
        return setKid(key);
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      src: IMAGES[k.img],
      label: k.name + " photo",
      className: "portrait"
    }), /*#__PURE__*/React.createElement("div", {
      className: "comic hname"
    }, k.name, " ", k.badge), /*#__PURE__*/React.createElement("div", {
      className: "hbal"
    }, "🪙 ", coins[key]));
  })), /*#__PURE__*/React.createElement("div", {
    className: "vault",
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
  }, coins[kid])), /*#__PURE__*/React.createElement("div", {
    className: "tap"
  }, "Tap the lid", /*#__PURE__*/React.createElement("br", null), "to tip them out ⤵")), /*#__PURE__*/React.createElement("div", {
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
    className: "row"
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
  }, "Ask nicely — 2 coins per request")), /*#__PURE__*/React.createElement(CoinBtn, {
    value: 2,
    word: "PER REQ",
    onClick: function onClick() {
      return spend(2, "Mum's Food Tax");
    },
    disabled: coins[kid] < 2
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
        return setKid(key);
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
      return spend(2, "Mum's Food Tax");
    }
  }, "🍽️ Mum's Food Tax −2"), /*#__PURE__*/React.createElement("button", {
    className: "btn hist",
    onClick: function onClick() {
      return setModal("history");
    }
  }, "📋 ", K.name, "'s History"))), /*#__PURE__*/React.createElement("div", {
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
  }, "You earned 1 coin ⭐"), /*#__PURE__*/React.createElement("button", {
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
  }, "Cancel"))))), modal === "history" && /*#__PURE__*/React.createElement("div", {
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
  }, "Close")))), modal === "settings" && /*#__PURE__*/React.createElement("div", {
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
  }, "Sync: ", cloud === "online" ? "☁ Shared (Supabase)" : cloud === "syncing" ? "☁ Connecting…" : cloud === "offline" ? "⚠ Offline — this device only" : "📱 This device only"), /*#__PURE__*/React.createElement("button", {
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
