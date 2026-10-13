import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

// Background music: «جادك الغيث» — a muwashshah whose words are by Lisan al-Din ibn al-Khatib.
// Published with the site owner's permission. Loops; visitors can play/pause, mute and
// set the volume. Browsers block sound before a user gesture, so playback starts on the
// visitor's first interaction unless they turned the music off on an earlier visit.

const SRC = "./audio/andalus-music.m4a";
const STORE = "andalus-music";
const DEFAULT_VOLUME = 0.35;

interface Prefs {
  enabled: boolean;
  volume: number;
  muted: boolean;
}

function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Prefs>;
      return {
        enabled: p.enabled !== false,
        volume: typeof p.volume === "number" ? Math.min(1, Math.max(0, p.volume)) : DEFAULT_VOLUME,
        muted: !!p.muted,
      };
    }
  } catch {
    /* storage unavailable: use defaults */
  }
  return { enabled: true, volume: DEFAULT_VOLUME, muted: false };
}

function savePrefs(p: Prefs) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [playing, setPlaying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [volumeSettable, setVolumeSettable] = useState(true);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  // keep the element in sync with preferences
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = prefs.volume;
    a.muted = prefs.muted;
  }, [prefs.volume, prefs.muted]);

  // iOS ignores element.volume (hardware buttons only) — detect and hide the slider there
  useEffect(() => {
    const probe = new Audio();
    probe.volume = 0.5;
    setVolumeSettable(Math.abs(probe.volume - 0.5) < 0.01);
  }, []);

  const play = useCallback(async (target = prefsRef.current.volume) => {
    const a = audioRef.current;
    if (!a) return false;
    try {
      // gentle fade-in to the chosen volume
      a.volume = 0;
      await a.play();
      const steps = 15;
      for (let i = 1; i <= steps; i++) {
        window.setTimeout(() => {
          if (audioRef.current) audioRef.current.volume = Math.min(target, prefsRef.current.volume) * (i / steps);
        }, i * 80);
      }
      return true;
    } catch {
      a.volume = prefsRef.current.volume;
      return false;
    }
  }, []);

  // autostart on first interaction (browsers block sound before a gesture)
  useEffect(() => {
    if (!prefs.enabled) return;
    const start = (e: Event) => {
      // the music controls handle their own clicks
      if (wrapRef.current && e.target instanceof Node && wrapRef.current.contains(e.target)) return;
      cleanup();
      if (prefsRef.current.enabled) void play();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", start, true);
      window.removeEventListener("keydown", start, true);
    };
    window.addEventListener("pointerdown", start, true);
    window.addEventListener("keydown", start, true);
    return cleanup;
    // run once on mount with the stored preference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close the panel on outside click / Escape
  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && e.target instanceof Node && !wrapRef.current.contains(e.target)) setPanelOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  // Media Session: title on the lock screen / OS media controls
  useEffect(() => {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: "جادك الغيث", artist: "الأندلس: رحلة عبر الزمن" });
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      // pressing play on a silenced player should make sound
      const volume = prefs.volume === 0 ? DEFAULT_VOLUME : prefs.volume;
      prefsRef.current = { ...prefs, enabled: true, muted: false, volume };
      update({ enabled: true, muted: false, volume });
      await play(volume);
    } else {
      a.pause();
      update({ enabled: false });
    }
  };

  const toggleMute = () => update({ muted: !prefs.muted });

  const onVolume = (v: number) => {
    update({ volume: v, muted: v === 0 ? true : false });
  };

  const silent = prefs.muted || prefs.volume === 0;
  const pct = Math.round(prefs.volume * 100);

  return (
    <div className="music" ref={wrapRef} data-playing={playing}>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className="music__btn"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "إيقاف الموسيقى مؤقتاً" : "تشغيل الموسيقى"}
        title={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      >
        {playing ? (
          <span className="music__bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <Icon name="music" size={18} />
        )}
      </button>
      <button
        type="button"
        className="music__btn"
        aria-expanded={panelOpen}
        aria-controls="music-panel"
        aria-label="التحكم في الصوت"
        title="التحكم في الصوت"
        onClick={() => setPanelOpen((o) => !o)}
      >
        <Icon name={silent ? "volume-x" : "volume"} size={18} />
      </button>

      {panelOpen && (
        <div className="music__panel" id="music-panel" role="group" aria-label="التحكم في الموسيقى">
          <p className="music__title">
            <Icon name="music" size={14} /> «جادكَ الغيثُ» — موشّح من شعر لسان الدين بن الخطيب
          </p>
          <div className="music__row">
            <button type="button" className="music__wide" onClick={toggle} aria-pressed={playing}>
              <Icon name={playing ? "pause" : "play"} size={16} />
              {playing ? "إيقاف مؤقت" : "تشغيل"}
            </button>
            <button type="button" className="music__wide" onClick={toggleMute} aria-pressed={prefs.muted}>
              <Icon name={prefs.muted ? "volume" : "volume-x"} size={16} />
              {prefs.muted ? "إلغاء الكتم" : "كتم الصوت"}
            </button>
          </div>
          {volumeSettable ? (
            <label className="music__volume">
              <span>مستوى الصوت</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={prefs.muted ? 0 : pct}
                onChange={(e) => onVolume(Number(e.target.value) / 100)}
                aria-valuetext={`${prefs.muted ? 0 : pct}٪`}
              />
              <output>{prefs.muted ? 0 : pct}٪</output>
            </label>
          ) : (
            <p className="music__hint">استخدم أزرار الصوت في جهازك لتغيير المستوى.</p>
          )}
          <p className="music__hint">تتكرر المقطوعة تلقائياً، ويُحفظ اختيارك لزيارتك القادمة.</p>
        </div>
      )}
    </div>
  );
}
