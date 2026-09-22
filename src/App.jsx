import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════
   CONFIG & DATA
   ═══════════════════════════════════════════════════════ */

const CONFIG = {
  name: "TARS",
  fullName: "Triton Astronautics Research Systems Group",
  tagline: "Dream with Ambition. Design with Discipline. Deploy with Proof.",
  email: "tarsatucsd@gmail.com",
  website: "tarsgrp.org",
  instagram: "https://instagram.com/tarsatucsd",
  formspreeId: "",
  logo: "/images/tars-logo.png",
};

const ROUTES = [
  { path: "", label: "Home" },
  { path: "about", label: "About" },
  { path: "teams", label: "Teams" },
  { path: "launches", label: "Launches" },
  { path: "contact", label: "Contact" },
];

const STATS = [
  { value: 50, suffix: "+", label: "Active Members" },
  { value: 2, suffix: "", label: "Flights Completed" },
  { value: 6, suffix: "", label: "Teams" },
  { value: 3, suffix: "", label: "Faculty Advisors" },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "High-Altitude Balloons",
    status: "NOW",
    desc: "Building and launching HAB systems to near-space. Developing payload structures, avionics, power systems, and flight operations from the ground up.",
  },
  {
    phase: "Phase 2",
    title: "CanSat Program",
    status: "2027",
    desc: "Designing miniature satellite payloads that simulate real satellite missions. Competing in the CanSat competition and advancing our systems.",
  },
  {
    phase: "Phase 3",
    title: "CubeSat Program",
    status: "2028+",
    desc: "Engineering and launching an orbital CubeSat. The culmination of our progressive development — from atmosphere to orbit.",
  },
];

const SUBTEAMS = [
  {
    name: "Mechanical",
    color: "from-blue-500/20 to-cyan-500/20",
    desc: "The Mechanical Department designs and builds all structural flight hardware within TARS. For our current high-altitude balloon (HIBAL) missions, the team is developing modular payload structures that house avionics, electrical systems, and mission payloads. These structures are designed to survive extreme temperatures and pressures at altitude while remaining recoverable and reusable for future flights. Mechanical works closely with every department to ensure seamless integration across systems.",
    focus: ["Structural Design & CAD", "Payload Integration", "Thermal Management", "Manufacturing & Fabrication"],
    photo: null,
  },
  {
    name: "Electrical",
    color: "from-yellow-500/20 to-orange-500/20",
    desc: "The Electrical Department is responsible for power distribution and communications across all flight systems. For HIBAL, the team is developing the payload's electrical power system and communications architecture, ensuring reliable operation throughout ascent, float, descent, and recovery. Electrical plays a critical role in keeping every subsystem powered, connected, and traceable throughout the mission.",
    focus: ["Power Systems (EPS)", "Communications", "PCB Design", "Circuit Analysis & Soldering"],
    photo: null,
  },
  {
    name: "Avionics",
    color: "from-green-500/20 to-emerald-500/20",
    desc: "The Avionics Department develops all onboard computing hardware and flight software. Currently, the team is designing the primary flight computer and sensor interface for the HIBAL payload. For the first flight, avionics systems will operate in a passive data-collection mode, recording sensor data to validate system performance before transitioning to active control and autonomy in future missions.",
    focus: ["Flight Computers (ESP32)", "Sensor Integration", "Data Logging", "Flight Software"],
    photo: null,
  },
  {
    name: "Astro / Pay",
    color: "from-purple-500/20 to-violet-500/20",
    desc: "The Astronautics, Payload, and Mission Design (Astro/Pay) Department defines mission objectives and develops the hardware and experiments flown on each mission. As the most versatile department, Astro/Pay leads mission planning, system requirements, and performance analysis. For the first HIBAL flight, the team is developing a sensor-based payload and running simulations to evaluate flight conditions, constraints, and expected mission outcomes.",
    focus: ["Mission Planning", "Scientific Payloads", "Simulations", "Launch Operations"],
    photo: null,
  },
  {
    name: "Finance",
    color: "from-amber-500/20 to-yellow-500/20",
    desc: "The Finance team manages TARS's financial operations and sponsorship pipeline. From securing corporate and institutional funding to budget planning and grant applications, they ensure the engineering teams have the resources needed to design, build, and fly.",
    focus: ["Sponsorship Acquisition", "Budget Management", "Grant Applications", "Financial Planning"],
    photo: null,
  },
  {
    name: "Marketing",
    color: "from-rose-500/20 to-pink-500/20",
    desc: "The Marketing team drives TARS's public presence and brand identity. Through social media content, event coordination, partnership communications, and visual storytelling, they amplify our mission and connect with the broader aerospace community.",
    focus: ["Social Media", "Content Creation", "Event Coordination", "Branding & Design"],
    photo: null,
  },
];

const LEADERSHIP = [
  { name: "Luis Ball", role: "President", major: "Aerospace Engineering", year: "1st Year" },
  { name: "Aadhithiya Anbalagan", role: "VP of Engineering", major: "Aerospace Engineering", year: "1st Year Transfer" },
  { name: "Adi Kalita", role: "VP of External", major: "Computer Science", year: "1st Year" },
];

const DIRECTORS = [
  { name: "John Smith", role: "Director of Avionics", major: "Aerospace Engineering", year: "4th Year" },
  { name: "Logan Parker", role: "Director of Astro/Pay", major: "Aerospace Engineering", year: "1st Year" },
  { name: "Sarah Espinoza", role: "Director of Mechanical", major: "Mechanical Engineering", year: "" },
  { name: "Luis Ball", role: "Acting Director of Electrical", major: "Aerospace Engineering", year: "1st Year" },
  { name: "Aaron Goldstone", role: "Director of Finance", major: "Business Economics", year: "1st Year" },
  { name: "Luke Lahoud", role: "Director of Marketing", major: "Economics", year: "1st Year" },
];

const ADVISORS = [
  { name: "Dr. Truong", title: "Lecturer, MAE Department" },
  { name: "Prof. Sadeghizadeh", title: "Asst. Teaching Professor, MAE Department" },
  { name: "Prof. Mullin", title: "Teaching Professor, MAE Department" },
];

const LAUNCHES = [
  {
    name: 'Flight 1 — "Toast"',
    date: "March 14, 2026",
    status: "Completed",
    missionGoal:
      "Our very first flight — the goal was simple: get something up in the air and prove we could do it. We wanted to validate our core balloon systems, test our tracking and communications, and run through a full launch operation from prep to (attempted) recovery. Flight 1 was about building confidence and learning what we didn't know yet.",
    howItWent:
      "We launched from the Torrey Pines Gliderport on the cliffs overlooking the ocean — an incredible backdrop for our first-ever flight. The balloon ascended beautifully, and for the first stretch everything looked great. But during descent, we lost contact with the payload tracker. It turned out the battery got punctured on the way down, cutting power to the GPS. We never recovered the payload — it likely ended up in the ocean. Still, the launch itself was a success: the balloon reached near-space altitude, the team executed the procedure well, and we proved TARS could fly.",
    lessonsLearned:
      "This one taught us a lot. Battery protection and power redundancy became immediate priorities. We also realized we needed better tracking systems — dual GPS, better antenna placement, and backup recovery plans. Most importantly, we learned to expect things to go wrong and plan for it. Flight 1 gave us our first real engineering failures, and those failures drove every improvement that went into Flight 2.",
    photos: [
      "/images/flight1-launch-1.png",
      "/images/flight1-launch-2.png",
      "/images/flight1-launch-3.png",
      "/images/flight1-launch-4.png",
      "/images/flight1-payload-inspection.jpg",
    ],
    highlights: [
      "First-ever TARS launch",
      "Near-space altitude reached",
      "Launched from Torrey Pines Gliderport",
      "Full launch operations validated",
      "Battery failure during descent — payload lost",
    ],
  },
  {
    name: 'Flight 2 — "Rocky"',
    date: "Spring 2026",
    status: "Completed",
    missionGoal:
      "Flight 2 was all about applying what we learned from Flight 1. The goal was to improve every system that failed or underperformed — better structure, better avionics, better tracking, better recovery. We also wanted to push the altitude higher and fly a more capable payload. This was our chance to prove we could iterate fast and fly again with meaningful upgrades.",
    howItWent:
      "Night and day difference from Flight 1. The new payload structure was more robust, the avionics were redesigned from scratch, and we implemented redundant tracking. Launch day went smoothly — the team had a much more refined procedure, and everything from helium fill to release was cleaner. The balloon climbed well and we maintained solid contact the entire flight. Recovery was successful — we got the payload back intact and pulled valuable data from the sensors. Flight 2 was the proof of concept that TARS's iterative development approach works.",
    lessonsLearned:
      "We confirmed that our revision process is solid — identify failures, root-cause them, redesign, and retest. For Flight 3, we're looking at more ambitious payloads, longer flight durations, and potentially coordinating with other student teams. We also want to improve our ground station operations and start building toward the CanSat competition systems.",
    photos: [
      "/images/flight2-payload-prep.png",
      "/images/flight2-helium-fill.png",
      "/images/flight2-balloon-hold.png",
      "/images/flight2-in-flight.png",
      "/images/flight2-balloon-ready.jpg",
      "/images/flight2-team-balloon-wide.jpg",
      "/images/flight2-helium-prep-close.jpg",
      "/images/flight2-helium-prep-wide.jpg",
    ],
    // video: "/videos/flight2-launch.mp4",
    highlights: [
      "Successful payload recovery",
      "Redundant tracking systems",
      "Redesigned avionics & structure",
      "Full sensor data captured",
      "Clean launch operations",
    ],
  },
];


/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

function useHashRoute() {
  const get = () => window.location.hash.replace("#/", "").replace("#", "");
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const handler = () => {
      setRoute(get());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const nav = (path) => { window.location.hash = `/${path}`; };
  return [route, nav];
}

function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: opts.threshold ?? 0.15, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useCountUp(end, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return value;
}


/* ═══════════════════════════════════════════════════════
   STARFIELD (Canvas)
   ═══════════════════════════════════════════════════════ */

function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [], mouse = { x: 0, y: 0 };
  const STAR_COUNT = 120;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        isGold: Math.random() < 0.08,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const time = Date.now() * 0.001;

    stars.forEach((s) => {
      const opacity = 0.2 + 0.5 * Math.abs(Math.sin(time * s.twinkleSpeed * 10 + s.twinklePhase));
      const parallaxX = (mouse.x - w / 2) * s.speed * 0.02;
      const parallaxY = (mouse.y - h / 2) * s.speed * 0.02;

      ctx.beginPath();
      ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.isGold
        ? `rgba(255, 222, 89, ${opacity * 0.5})`
        : `rgba(200, 215, 240, ${opacity * 0.3})`;
      ctx.fill();

      if (s.r > 1) {
        ctx.beginPath();
        ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.isGold
          ? `rgba(255, 222, 89, ${opacity * 0.04})`
          : `rgba(180, 200, 240, ${opacity * 0.025})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener("resize", () => { resize(); createStars(); });
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
}


/* ═══════════════════════════════════════════════════════
   3D SATELLITE (Three.js)
   ═══════════════════════════════════════════════════════ */

function SatelliteScene() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const gold = 0xffde59;
    const wireMat = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.4 });
    const wireMatDim = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.12 });

    const sat = new THREE.Group();

    const addEdges = (geo, mat, pos, rot) => {
      const line = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat || wireMat);
      if (pos) line.position.set(...pos);
      if (rot) line.rotation.set(...rot);
      sat.add(line);
    };

    const addLine = (points, mat) => {
      const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
      sat.add(new THREE.Line(geo, mat || wireMatDim));
    };

    // CubeSat bus
    addEdges(new THREE.BoxGeometry(1, 0.75, 1));
    addEdges(new THREE.BoxGeometry(0.5, 0.4, 0.5), wireMatDim);

    // Solar panels
    addEdges(new THREE.BoxGeometry(1.4, 0.02, 0.65), wireMat, [-1.2, 0, 0]);
    addEdges(new THREE.BoxGeometry(1.4, 0.02, 0.65), wireMat, [1.2, 0, 0]);

    // Panel grid lines
    for (const sx of [-1.2, 1.2]) {
      addLine([[sx - 0.68, 0.015, 0], [sx + 0.68, 0.015, 0]]);
      addLine([[sx, 0.015, -0.3], [sx, 0.015, 0.3]]);
    }

    // Panel struts
    addLine([[-0.5, 0, 0.08], [-0.5, 0, -0.08]]);
    addLine([[0.5, 0, 0.08], [0.5, 0, -0.08]]);

    // Antenna mast
    addLine([[0, 0.375, 0], [0, 1.05, 0]], wireMat);

    // Antenna dish
    const dishGeo = new THREE.ConeGeometry(0.1, 0.1, 8, 1, true);
    const dishWire = new THREE.LineSegments(new THREE.WireframeGeometry(dishGeo), wireMat);
    dishWire.position.set(0, 1.1, 0);
    dishWire.rotation.x = Math.PI;
    sat.add(dishWire);

    // Sensor module
    addEdges(new THREE.CylinderGeometry(0.06, 0.1, 0.16, 6), wireMatDim, [0.3, -0.45, 0.3]);

    // Orbit ring
    const orbitPts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(a) * 2.8, 0, Math.sin(a) * 2.8));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
    const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.06 }));
    orbitLine.rotation.set(1.2, 0, 0.3);
    sat.add(orbitLine);

    scene.add(sat);
    sat.rotation.set(0.3, -0.5, 0.1);

    // Perspective grid
    const grid = new THREE.GridHelper(20, 40, gold, gold);
    grid.position.y = -2;
    const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMats.forEach(m => { m.transparent = true; m.opacity = 0.025; });
    scene.add(grid);

    // Ambient particles
    const pCount = 40;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: gold, size: 0.015, transparent: true, opacity: 0.25,
    }));
    scene.add(particles);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      sat.rotation.y = -0.5 + t * 0.1;
      const tx = 0.3 + mouseRef.current.y * 0.15;
      const tz = mouseRef.current.x * 0.08;
      sat.rotation.x += (tx - sat.rotation.x) * 0.025;
      sat.rotation.z += (tz - sat.rotation.z) * 0.025;

      particles.rotation.y = t * 0.012;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}


/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, visible] = useInView();
  const transforms = {
    up: "translateY(24px)",
    down: "translateY(-24px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-gold font-semibold">
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4 tracking-tight">{title}</h2>
        {subtitle && <p className="text-ink-muted text-lg max-w-2xl mx-auto">{subtitle}</p>}
      </Reveal>
    </div>
  );
}

function GoldButton({ children, onClick, href, className = "", variant = "primary" }) {
  const base =
    variant === "primary"
      ? "bg-gold text-navy font-bold hover:bg-gold-glow hover:shadow-[0_0_24px_rgba(255,222,89,0.2)]"
      : variant === "outline"
      ? "border border-gold/60 text-gold font-bold hover:bg-gold/10"
      : "bg-navy-mid text-ink-muted hover:text-ink hover:bg-navy-surface";
  const cls = `inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm tracking-wide transition-all duration-300 cursor-pointer ${base} ${className}`;

  if (href) {
    const external = href.startsWith("http");
    return <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{children}</a>;
  }
  return <button onClick={onClick} className={cls}>{children}</button>;
}

function Card({ children, className = "", hover = true }) {
  return (
    <div className={`bg-navy-light/50 backdrop-blur-sm border border-ink-faint/8 rounded-xl ${hover ? "hover:border-gold/15 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300" : ""} ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ value, suffix, label, delay, visible }) {
  const count = useCountUp(value, 1800, visible);
  return (
    <Reveal delay={delay}>
      <Card className="p-8 text-center">
        <div className="font-display text-5xl font-bold gradient-text mb-2">
          {count}{suffix}
        </div>
        <div className="text-ink-muted text-sm tracking-wide">{label}</div>
      </Card>
    </Reveal>
  );
}


/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */

function Navbar({ route, nav }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/90 backdrop-blur-lg shadow-card" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        <button onClick={() => nav("")} className="flex items-center gap-3 cursor-pointer bg-transparent border-0">
          <img src={CONFIG.logo} alt="TARS" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-wide hidden sm:block">TARS</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {ROUTES.map((r) => (
            <button
              key={r.path}
              onClick={() => nav(r.path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer bg-transparent border-0 ${
                route === r.path
                  ? "text-gold bg-gold/10"
                  : "text-ink-muted hover:text-ink hover:bg-ink-faint/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-ink transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-navy-light/95 backdrop-blur-lg border-t border-ink-faint/10 px-5 pb-4">
          {ROUTES.map((r) => (
            <button
              key={r.path}
              onClick={() => { nav(r.path); setMobileOpen(false); }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer bg-transparent border-0 ${
                route === r.path ? "text-gold bg-gold/10" : "text-ink-muted hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}


/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */

function Footer({ nav }) {
  return (
    <footer className="relative z-10 border-t border-ink-faint/8 bg-navy-light/30 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={CONFIG.logo} alt="TARS" className="w-10 h-10 rounded-full" />
              <span className="font-display font-bold text-xl">TARS Group</span>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">
              Triton Astronautics Research Systems Group at UC San Diego.
            </p>
            <p className="text-ink-faint text-xs mt-3 italic">
              {CONFIG.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold text-sm tracking-wide mb-4">Navigate</h4>
            <div className="flex flex-col gap-2">
              {ROUTES.map((r) => (
                <button
                  key={r.path}
                  onClick={() => nav(r.path)}
                  className="text-ink-muted hover:text-gold text-sm text-left transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold text-sm tracking-wide mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-ink-muted">
              <a href={`mailto:${CONFIG.email}`} className="hover:text-gold transition-colors">{CONFIG.email}</a>
              <a href={CONFIG.instagram} target="_blank" rel="noopener" className="hover:text-gold transition-colors">@tarsatucsd</a>
              <span>9500 Gilman Drive, La Jolla, CA 92093-0078</span>
            </div>
          </div>
        </div>

        <div className="gradient-border-b mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
          <span>&copy; {new Date().getFullYear()} TARS Group — UC San Diego</span>
          <span>Student-Led &middot; MAE Dept Affiliated</span>
        </div>
      </div>
    </footer>
  );
}


/* ═══════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════ */

function Home({ nav }) {
  const [statsRef, statsVisible] = useInView();

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5">
        <SatelliteScene />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Reveal delay={100}>
            <img
              src={CONFIG.logo}
              alt="TARS Logo"
              className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-8 float-gentle drop-shadow-[0_0_24px_rgba(255,222,89,0.15)]"
            />
          </Reveal>
          <Reveal delay={250}>
            <Eyebrow>Student-Led &middot; MAE Dept Affiliated &middot; UC San Diego</Eyebrow>
          </Reveal>
          <Reveal delay={400}>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold mt-4 mb-4 tracking-tight leading-[1.05]">
              We're Building{" "}
              <span className="gradient-text">Satellites.</span>
            </h1>
          </Reveal>
          <Reveal delay={550}>
            <p className="text-xl sm:text-2xl text-ink-muted font-light mb-4">
              Aerospace Systems & Flight Testing Program
            </p>
          </Reveal>
          <Reveal delay={650}>
            <p className="text-ink-faint text-sm sm:text-base italic max-w-xl mx-auto mb-10">
              {CONFIG.tagline}
            </p>
          </Reveal>
          <Reveal delay={800}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <GoldButton onClick={() => nav("about")}>
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </GoldButton>
              <GoldButton variant="outline" onClick={() => nav("contact")}>
                Partner With Us
              </GoldButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MISSION STRIP ── */}
      <section className="relative z-10 py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="Our Mission"
            title="Engineering the Future of Space Exploration"
            subtitle="TARS empowers UC San Diego students from all disciplines to engineer spacecraft that advance the frontiers of space exploration — bridging academia and industry through hands-on project-based experience."
          />
        </div>
      </section>

      {/* ── TEAM BANNER ── */}
      <section className="relative z-10 px-5 pb-16">
        <Reveal>
          <div className="max-w-6xl mx-auto rounded-xl overflow-hidden relative group">
            <img
              src="/images/team-group-photo.png"
              alt="TARS team group photo"
              className="w-full h-56 sm:h-72 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <Eyebrow>Our Team</Eyebrow>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1">50+ Members Strong</h3>
              <p className="text-ink-muted text-sm mt-1">Building the future of space at UC San Diego</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── ROADMAP ── */}
      <section className="relative z-10 py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Development Roadmap"
            title="From Atmosphere to Orbit"
            subtitle="A progressive, multi-year development pipeline — each phase builds the foundation for the next."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAP.map((item, i) => (
              <Reveal key={item.phase} delay={i * 150}>
                <Card className={`p-8 h-full ${i === 0 ? "border-gold/20" : ""}`}>
                  <span className="font-mono text-3xl font-bold text-gold/15 leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <Eyebrow>{item.phase}</Eyebrow>
                  <h3 className="font-display text-xl font-bold mt-2 mb-1">{item.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-4 ${
                    i === 0 ? "bg-gold/15 text-gold" : "bg-ink-faint/15 text-ink-muted"
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-ink-muted text-sm leading-relaxed">{item.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-16 px-5" ref={statsRef}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 100} visible={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <section className="relative z-10 py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Why TARS"
            title="Built Different"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Progressive Development",
                text: "We don't jump to CubeSats day one. Our three-phase roadmap builds capability step by step — from balloons to orbit.",
              },
              {
                title: "Mission-Driven Operations",
                text: "We mirror professional aerospace practices: technical leads, documentation requirements, testing processes, and project management.",
              },
              {
                title: "Real Hardware, Real Flights",
                text: "We don't just design on paper. We build, test, fly, recover, and iterate. Every member touches real flight hardware.",
              },
              {
                title: "Cross-Discipline Collaboration",
                text: "Students from engineering, science, business, and more — all working together to solve real aerospace challenges.",
              },
              {
                title: "Faculty-Backed Research",
                text: "Three MAE Department faculty advisors support our technical work and help bridge classroom theory with practical application.",
              },
              {
                title: "Rapid Growth",
                text: "Founded in 2025, launched our first flight in 2026, and growing fast. We're building UCSD's spacecraft development pipeline.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <Card className="p-7 h-full">
                  <span className="font-mono text-xs text-gold/30 tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-lg font-bold mt-2 mb-2">{item.title}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{item.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-5">
        <Reveal>
          <Card className="max-w-4xl mx-auto p-10 sm:p-16 text-center" hover={false}>
            <Eyebrow>Get Involved</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Ready to help us reach orbit?
            </h2>
            <p className="text-ink-muted max-w-xl mx-auto mb-8">
              Whether you're an engineer, scientist, business mind, or creative — there's a place for you at TARS.
              Help us build the pipeline to spacecraft development at UC San Diego.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <GoldButton onClick={() => nav("contact")}>
                Contact Us
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </GoldButton>
              <GoldButton variant="outline" onClick={() => nav("teams")}>
                Explore Teams
              </GoldButton>
            </div>
          </Card>
        </Reveal>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════════════════ */

function About({ nav }) {
  return (
    <div className="pt-28 sm:pt-36 pb-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="About Us"
          title="Triton Astronautics Research Systems"
          subtitle="A student-led organization at UC San Diego advancing space research through design, applied engineering, and collaboration."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <Reveal direction="left">
            <Card className="p-8 sm:p-10 h-full" hover={false}>
              <Eyebrow>Our Story</Eyebrow>
              <h3 className="font-display text-2xl font-bold mt-3 mb-4">From an Idea to Flight Hardware</h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-4">
                TARS was born in the summer of 2025 when a group of UC San Diego students saw a gap between
                classroom theory and practical spacecraft engineering. What started as conversations during SIPP
                and with MAE professors turned into something bigger.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed mb-4">
                Originally called TOAST, the founding team met in Geisel Library for the first 3–4 months, connected
                with the TritonCubed founder to establish a HIBAL program, and moved into Envision by Winter Quarter.
                TARS officially became a registered organization on February 4th, 2026.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed mb-5">
                Less than six weeks later, they launched their first high-altitude balloon — "Toast" — into near-space.
                The second flight "Rocky" followed in Spring 2026 with improved systems and procedures.
              </p>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/flight1-payload-inspection.jpg"
                  alt="Team inspecting payload hardware at Torrey Pines"
                  className="w-full h-40 sm:h-48 object-cover"
                />
              </div>
            </Card>
          </Reveal>

          <Reveal direction="right">
            <Card className="p-8 sm:p-10 h-full" hover={false}>
              <Eyebrow>Our Mission</Eyebrow>
              <h3 className="font-display text-2xl font-bold mt-3 mb-4">Empowering the Next Generation</h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-4">
                The Triton Astronautics Research Systems Group was founded with the mission to empower UC San Diego
                students from all disciplines to engineer spacecraft that advance the frontiers of space exploration.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed mb-4">
                We aim to bridge the gap between academia and industry, providing students with hands-on,
                project-based experiences with spacecraft and satellite engineering.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed mb-5">
                Our operations directly mirror professional aeronautical organizational practices: subteams work with
                technical leads, documentation requirements, testing processes, and project management. Every member
                gains practical experience while contributing to real research.
              </p>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/flight2-balloon-ready.jpg"
                  alt="Team preparing balloon for launch"
                  className="w-full h-40 sm:h-48 object-cover"
                />
              </div>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <div className="rounded-xl overflow-hidden mb-20 relative group">
            <img
              src="/images/team-group-photo.png"
              alt="TARS full team"
              className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
              <p className="font-display text-xl sm:text-2xl font-bold">The TARS Family</p>
              <p className="text-ink-muted text-sm">Spring 2026</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <Card className="p-8 sm:p-12 mb-20 text-center" hover={false}>
            <Eyebrow>University Affiliation</Eyebrow>
            <h3 className="font-display text-2xl font-bold mt-3 mb-4">Part of UC San Diego</h3>
            <p className="text-ink-muted max-w-2xl mx-auto text-sm leading-relaxed">
              TARS is a student organization registered with the University of California, San Diego. While student-run,
              the group operates in alignment with university policies and benefits from UCSD's academic environment,
              research culture, and engineering resources. We are affiliated with the MAE Department and supported by
              three faculty advisors.
            </p>
          </Card>
        </Reveal>

        <SectionHeading
          eyebrow="Leadership"
          title="Meet the Team"
          subtitle="The people driving TARS's mission forward."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {LEADERSHIP.map((person, i) => (
            <Reveal key={person.name} delay={i * 120}>
              <Card className="p-7 text-center h-full">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold/15 to-navy-mid flex items-center justify-center text-2xl font-bold text-gold/70 mb-4 border border-gold/15">
                  {person.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h4 className="font-display font-bold text-lg">{person.name}</h4>
                <p className="text-gold text-sm font-medium">{person.role}</p>
                <p className="text-ink-faint text-xs mt-1">{person.major} &middot; {person.year}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {DIRECTORS.map((person, i) => (
            <Reveal key={person.name + person.role} delay={i * 80}>
              <Card className="p-5 text-center h-full">
                <div className="w-12 h-12 mx-auto rounded-full bg-navy-mid flex items-center justify-center text-sm font-bold text-gold/60 mb-3 border border-gold/15">
                  {person.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h4 className="font-display font-bold text-sm">{person.name}</h4>
                <p className="text-ink-faint text-[11px] mt-1">{person.role}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <SectionHeading
          eyebrow="Faculty Support"
          title="Our Advisors"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {ADVISORS.map((a, i) => (
            <Reveal key={a.name} delay={i * 100}>
              <Card className="p-7 text-center h-full">
                <div className="w-16 h-16 mx-auto rounded-full bg-navy-mid flex items-center justify-center text-lg mb-4 border border-ink-faint/15 font-display font-bold text-gold/50">
                  {a.name.split(" ").pop()[0]}
                </div>
                <h4 className="font-display font-bold">{a.name}</h4>
                <p className="text-ink-muted text-sm mt-1">{a.title}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Card className="p-8 sm:p-10 text-center" hover={false}>
            <Eyebrow>Organization</Eyebrow>
            <h3 className="font-display text-xl font-bold mt-3 mb-6">How We're Structured</h3>
            <div className="max-w-lg mx-auto">
              <div className="flex justify-center mb-4">
                <span className="bg-gold/15 text-gold text-xs font-bold px-4 py-2 rounded-full border border-gold/20">
                  President
                </span>
              </div>
              <div className="flex justify-center gap-6 mb-4">
                <span className="bg-navy-mid text-ink text-xs font-bold px-4 py-2 rounded-full border border-ink-faint/15">
                  VP Engineering
                </span>
                <span className="bg-navy-mid text-ink text-xs font-bold px-4 py-2 rounded-full border border-ink-faint/15">
                  VP External
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {["Avionics", "Electrical", "Mechanical", "Astro/Pay", "Finance", "Marketing"].map((t) => (
                  <span key={t} className="bg-navy-light text-ink-muted text-xs px-3 py-1.5 rounded-full border border-ink-faint/8">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   TEAMS PAGE
   ═══════════════════════════════════════════════════════ */

function Teams({ nav }) {
  return (
    <div className="pt-28 sm:pt-36 pb-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Engineering & Operations"
          title="Our Teams"
          subtitle="TARS teams work together as an integrated system to design and execute successful missions. Each contributes specialized expertise — from building and powering to computing and defining mission systems."
        />

        <div className="space-y-8">
          {SUBTEAMS.map((team, i) => (
            <Reveal key={team.name} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
              <Card className="overflow-hidden" hover={false}>
                {team.photo ? (
                  <div className="w-full h-48 sm:h-56 overflow-hidden">
                    <img
                      src={team.photo}
                      alt={`${team.name} team`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-full h-20 sm:h-24 bg-gradient-to-r ${team.color} flex items-center px-8`}>
                    <span className="font-display text-5xl sm:text-6xl font-bold text-white/[0.06] select-none">{team.name}</span>
                  </div>
                )}

                <div className="p-8 sm:p-10">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="font-display text-2xl font-bold">{team.name}</h3>
                        <div className="h-0.5 w-12 bg-gold/60 mt-2" />
                      </div>
                      <p className="text-ink-muted text-sm leading-relaxed">{team.desc}</p>
                    </div>
                    <div className="lg:w-64 shrink-0">
                      <h4 className="font-display font-bold text-sm text-gold mb-3">Focus Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.focus.map((f) => (
                          <span key={f} className="bg-navy-mid/80 text-ink-muted text-xs px-3 py-1.5 rounded-full border border-ink-faint/8">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center mt-16">
            <p className="text-ink-muted mb-6">
              Interested in joining a team? Reach out to learn more about current openings.
            </p>
            <GoldButton onClick={() => nav("contact")}>
              Contact Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </GoldButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PHOTO GALLERY (used by Launches)
   ═══════════════════════════════════════════════════════ */

function PhotoGallery({ photos }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className="mb-5">
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer group mb-3"
          style={{ aspectRatio: "16/10" }}
          onClick={() => setLightbox(true)}
        >
          <img
            src={photos[active]}
            alt={`Flight photo ${active + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-3 right-3 bg-navy/70 backdrop-blur-sm text-ink text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Click to expand
          </div>
        </div>

        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  i === active
                    ? "border-gold shadow-[0_0_10px_rgba(255,222,89,0.2)]"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-5 right-5 text-ink/60 hover:text-ink text-3xl cursor-pointer bg-transparent border-0"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            &#x2715;
          </button>
          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-light/80 border border-ink-faint/15 flex items-center justify-center text-ink hover:bg-navy-mid cursor-pointer transition-colors"
                onClick={(e) => { e.stopPropagation(); setActive((active - 1 + photos.length) % photos.length); }}
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-light/80 border border-ink-faint/15 flex items-center justify-center text-ink hover:bg-navy-mid cursor-pointer transition-colors"
                onClick={(e) => { e.stopPropagation(); setActive((active + 1) % photos.length); }}
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <img
            src={photos[active]}
            alt={`Flight photo ${active + 1}`}
            className="max-w-full max-h-[85vh] rounded-xl shadow-lift object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-ink-muted text-sm">
            {active + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   LAUNCHES PAGE
   ═══════════════════════════════════════════════════════ */

function LaunchesPage({ nav }) {
  return (
    <div className="pt-28 sm:pt-36 pb-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Flight Operations"
          title="Our Launches"
          subtitle="Every flight teaches us something new. Here's our mission log — from first launch to next frontier."
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent" />

          {[...LAUNCHES].reverse().map((flight, i) => (
            <Reveal key={flight.name} delay={i * 200}>
              <div className="relative pl-16 sm:pl-20 pb-16">
                <div className="absolute left-4 sm:left-6 top-2 w-5 h-5 rounded-full bg-navy border-2 border-gold flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>

                <Card className="p-7 sm:p-9" hover={false}>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold">{flight.name}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      flight.status === "Completed"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-gold/15 text-gold"
                    }`}>
                      {flight.status}
                    </span>
                  </div>
                  <p className="text-ink-faint text-sm mb-6">{flight.date}</p>

                  <PhotoGallery photos={flight.photos} />

                  {flight.video && (
                    <div className="mb-5 rounded-lg overflow-hidden border border-ink-faint/8">
                      <video
                        src={flight.video}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full rounded-lg"
                        poster={flight.photos?.[0]}
                      >
                        Your browser does not support the video element.
                      </video>
                      <div className="bg-navy-mid/50 px-4 py-2">
                        <span className="text-ink-muted text-xs">Launch Video</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-5 mb-6">
                    {flight.missionGoal && (
                      <div>
                        <h4 className="font-display font-bold text-gold text-sm tracking-wide mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" /> Mission Goal
                        </h4>
                        <p className="text-ink-muted text-sm leading-relaxed">{flight.missionGoal}</p>
                      </div>
                    )}
                    {flight.howItWent && (
                      <div>
                        <h4 className="font-display font-bold text-gold text-sm tracking-wide mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" /> How It Went
                        </h4>
                        <p className="text-ink-muted text-sm leading-relaxed">{flight.howItWent}</p>
                      </div>
                    )}
                    {flight.lessonsLearned && (
                      <div>
                        <h4 className="font-display font-bold text-gold text-sm tracking-wide mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" /> Lessons Learned
                        </h4>
                        <p className="text-ink-muted text-sm leading-relaxed">{flight.lessonsLearned}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {flight.highlights.map((h) => (
                      <span key={h} className="bg-navy-mid/80 text-ink-muted text-xs px-3 py-1.5 rounded-full border border-ink-faint/8">
                        {h}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            </Reveal>
          ))}

          <Reveal delay={400}>
            <div className="relative pl-16 sm:pl-20">
              <div className="absolute left-4 sm:left-6 top-2 w-5 h-5 rounded-full bg-navy border-2 border-ink-faint/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ink-faint/40" />
              </div>
              <Card className="p-7 border-dashed border-ink-faint/15" hover={false}>
                <h3 className="font-display text-lg font-bold text-ink-faint">Next Mission</h3>
                <p className="text-ink-faint text-sm mt-2">More flights in development. Stay tuned.</p>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   CONTACT PAGE
   ═══════════════════════════════════════════════════════ */

function Contact({ nav }) {
  const [tab, setTab] = useState("contact");
  const [formState, setFormState] = useState("idle");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (CONFIG.formspreeId) {
      setFormState("sending");
      try {
        const res = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setFormState("sent");
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          setFormState("error");
        }
      } catch {
        setFormState("error");
      }
    } else {
      const mailtoUrl = `mailto:${CONFIG.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;
      window.open(mailtoUrl);
    }
  };

  const inputClass =
    "w-full bg-navy-mid/40 border border-ink-faint/15 rounded-lg px-5 py-3.5 text-ink text-sm placeholder:text-ink-faint/50 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all font-body";

  const tabClass = (active) =>
    `px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer bg-transparent border-0 ${
      active ? "text-gold bg-gold/10" : "text-ink-muted hover:text-ink hover:bg-ink-faint/10"
    }`;

  // ponytail: recruitment link placeholder — uncomment and set URL when ready
  // const RECRUITMENT_LINK = "https://forms.gle/your-form-id";

  return (
    <div className="pt-28 sm:pt-36 pb-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Contact TARS"
          subtitle="Interested in sponsoring, collaborating, or learning more? We'd love to hear from you."
        />

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          <button className={tabClass(tab === "contact")} onClick={() => setTab("contact")}>Contact</button>
          <button className={tabClass(tab === "recruitment")} onClick={() => setTab("recruitment")}>Recruitment</button>
        </div>

        {tab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <Reveal direction="left">
                <Card className="p-8 sm:p-10" hover={false}>
                  {formState === "sent" ? (
                    <div className="text-center py-10">
                      <div className="w-14 h-14 mx-auto rounded-full bg-green-500/15 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="font-display text-2xl font-bold mb-2">Message Sent</h3>
                      <p className="text-ink-muted">Thank you for reaching out. We'll get back to you soon.</p>
                      <GoldButton className="mt-6" onClick={() => setFormState("idle")}>
                        Send Another
                      </GoldButton>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-sm text-ink-muted mb-1.5 block">Name</label>
                          <input
                            type="text"
                            required
                            className={inputClass}
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-ink-muted mb-1.5 block">Email</label>
                          <input
                            type="email"
                            required
                            className={inputClass}
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-ink-muted mb-1.5 block">Subject</label>
                        <select
                          className={inputClass}
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option value="">Select a topic...</option>
                          <option value="Sponsorship Inquiry">Sponsorship Inquiry</option>
                          <option value="Partnership / Collaboration">Partnership / Collaboration</option>
                          <option value="Media / Press Inquiry">Media / Press Inquiry</option>
                          <option value="General Question">General Question</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-ink-muted mb-1.5 block">Message</label>
                        <textarea
                          required
                          rows={5}
                          className={`${inputClass} resize-none`}
                          placeholder="Tell us how you'd like to get involved..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      {formState === "error" && (
                        <p className="text-red-400 text-sm">Something went wrong. Please try again or email us directly.</p>
                      )}
                      <GoldButton className="w-full justify-center">
                        {formState === "sending" ? "Sending..." : "Send Message"}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      </GoldButton>
                    </form>
                  )}
                </Card>
              </Reveal>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <Reveal direction="right" delay={100}>
                <Card className="p-6">
                  <h4 className="font-display font-bold text-sm text-gold tracking-wide mb-2">Email</h4>
                  <a href={`mailto:${CONFIG.email}`} className="text-ink-muted text-sm hover:text-gold transition-colors">
                    {CONFIG.email}
                  </a>
                </Card>
              </Reveal>
              <Reveal direction="right" delay={200}>
                <Card className="p-6">
                  <h4 className="font-display font-bold text-sm text-gold tracking-wide mb-2">Location</h4>
                  <p className="text-ink-muted text-sm">University of California, San Diego<br />9500 Gilman Drive<br />La Jolla, CA 92093-0078</p>
                </Card>
              </Reveal>
              <Reveal direction="right" delay={300}>
                <Card className="p-6">
                  <h4 className="font-display font-bold text-sm text-gold tracking-wide mb-2">Social</h4>
                  <a
                    href={CONFIG.instagram}
                    target="_blank"
                    rel="noopener"
                    className="text-ink-muted text-sm hover:text-gold transition-colors"
                  >
                    @tarsatucsd
                  </a>
                </Card>
              </Reveal>
              <Reveal direction="right" delay={400}>
                <Card className="p-6">
                  <h4 className="font-display font-bold text-sm text-gold tracking-wide mb-2">Website</h4>
                  <span className="text-ink-muted text-sm">{CONFIG.website}</span>
                </Card>
              </Reveal>
            </div>
          </div>
        )}

        {tab === "recruitment" && (
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <Card className="p-8 sm:p-12" hover={false}>
                <div className="text-center mb-8">
                  <Eyebrow>Join TARS</Eyebrow>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mt-3 mb-4">We're Recruiting</h3>
                  <p className="text-ink-muted max-w-xl mx-auto">
                    TARS is always looking for motivated students who want hands-on experience with real aerospace systems.
                    No prior experience required — just curiosity and commitment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { team: "Mechanical", what: "Structural design, CAD, fabrication" },
                    { team: "Electrical", what: "Power systems, PCB design, comms" },
                    { team: "Avionics", what: "Flight computers, sensors, software" },
                    { team: "Astro / Pay", what: "Mission design, payloads, simulations" },
                    { team: "Finance", what: "Sponsorships, budgets, grants" },
                    { team: "Marketing", what: "Social media, content, branding" },
                  ].map((r) => (
                    <div key={r.team} className="bg-navy-mid/40 border border-ink-faint/8 rounded-lg p-4">
                      <h4 className="font-display font-bold text-sm mb-1">{r.team}</h4>
                      <p className="text-ink-faint text-xs">{r.what}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <div className="bg-navy-mid/40 border border-gold/15 rounded-lg p-6">
                    <p className="text-ink-muted text-sm mb-1">Applications open quarterly. Follow us on Instagram for announcements.</p>
                    <a href={CONFIG.instagram} target="_blank" rel="noopener" className="text-gold text-sm font-medium hover:text-gold-glow transition-colors">
                      @tarsatucsd
                    </a>
                  </div>
                  {/* ponytail: uncomment when recruitment form link is ready
                  <GoldButton href={RECRUITMENT_LINK}>
                    Apply Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </GoldButton>
                  */}
                </div>
              </Card>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════ */

const PAGE_MAP = {
  "": Home,
  about: About,
  teams: Teams,
  launches: LaunchesPage,
  contact: Contact,
};

export default function App() {
  const [route, nav] = useHashRoute();
  const Page = PAGE_MAP[route] || Home;

  useEffect(() => {
    initStarfield();
  }, []);

  return (
    <div className="relative z-10 min-h-screen">
      <Navbar route={route} nav={nav} />
      <main key={route} className="rise-in">
        <Page nav={nav} />
      </main>
      <Footer nav={nav} />
    </div>
  );
}
