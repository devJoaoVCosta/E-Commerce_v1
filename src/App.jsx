import { useState, useEffect, Fragment } from "react";
import {
  ShoppingBag, ShoppingCart, Package, LayoutGrid, Tag, Users,
  LogIn, LogOut, Plus, Pencil, Trash2, Search, Check,
  Eye, EyeOff, X, User, Shield, Zap, Shirt, Activity,
  Minus, Headphones, Watch, Backpack, Lightbulb, Clock,
  Lock, Mail, Truck, CheckCircle, ChevronRight, ChevronLeft,
  AlertCircle, Camera, Coffee, Smartphone, Star, Heart,
  Globe, Settings, BarChart2, Package2, Layers
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg0:"#03030A", bg1:"#070710", bg2:"#0D0D1A", bg3:"#131322", bg4:"#1A1A2C",
  bd:"#1E1E32", bdH:"#2C2C48",
  t1:"#EEEAF8", t2:"#8080A8", t3:"#40405A",
  gold:"#C8961E", goldL:"#E0AE3A", goldBg:"#110E04", goldBd:"#302400",
  ok:"#34D399", err:"#F87171", info:"#60A5FA",
  blue:"#4A8CF7", pink:"#E05A9A", green:"#22C97A", amber:"#E09B2A",
};

const ROLE_META = {
  admin:    { label:"Administrador", c:T.goldL, bg:"#141000", bd:"#342800", ico:"Shield"  },
  vendedor: { label:"Vendedor",      c:T.info,  bg:"#071420", bd:"#142840", ico:"Tag"     },
  cliente:  { label:"Cliente",       c:T.ok,    bg:"#071810", bd:"#14302A", ico:"User"    },
};
const STATUS_META = {
  pendente:    { label:"Pendente",    c:T.amber,   bg:"#130F00", bd:"#2E2200", ico:"Clock"        },
  processando: { label:"Processando", c:T.info,    bg:"#071420", bd:"#142840", ico:"Settings"     },
  enviado:     { label:"Enviado",     c:T.ok,      bg:"#071810", bd:"#14302A", ico:"Truck"        },
  entregue:    { label:"Entregue",    c:"#4ade80", bg:"#051505", bd:"#0F3010", ico:"CheckCircle"  },
  cancelado:   { label:"Cancelado",   c:T.err,     bg:"#130505", bd:"#2E0E0E", ico:"X"            },
};

// ─── ICON REGISTRY ────────────────────────────────────────────────────────────
const IR = {
  ShoppingBag,ShoppingCart,Package,LayoutGrid,Tag,Users,LogIn,LogOut,Plus,
  Pencil,Trash2,Search,Check,Eye,EyeOff,X,User,Shield,Zap,Shirt,Activity,
  Minus,Headphones,Watch,Backpack,Lightbulb,Clock,Lock,Mail,Truck,
  CheckCircle,ChevronRight,ChevronLeft,AlertCircle,Camera,Coffee,
  Smartphone,Star,Heart,Globe,Settings,BarChart2,Package2,Layers,
};
function Ic({ n, s=18, c, style: st, ...p }) {
  const C = IR[n] || Package;
  return <C size={s} color={c} style={st} {...p}/>;
}

const PROD_ICONS = ["Headphones","Watch","Shirt","Backpack","Lightbulb","Activity",
  "Smartphone","Camera","Coffee","Globe","Star","Heart","Zap","Package","BarChart2","Layers"];
const CAT_ICONS  = ["Zap","Shirt","Lightbulb","Activity","Smartphone","Camera","Coffee",
  "Globe","Star","Heart","Tag","Package","Settings","Backpack","Layers"];
const PALETTE    = [T.blue,T.pink,T.green,T.amber,"#9B7AF0","#E05050","#50C0B0","#C07050"];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_CATS = [
  { id:"c1", name:"Eletrônicos", icon:"Zap",      color:T.blue  },
  { id:"c2", name:"Moda",        icon:"Shirt",     color:T.pink  },
  { id:"c3", name:"Casa",        icon:"Lightbulb", color:T.green },
  { id:"c4", name:"Esportes",    icon:"Activity",  color:T.amber },
];
const SEED_PRODS = [
  { id:"p1", name:"Headphone Pro X",   categoryId:"c1", price:349.90, stock:12, icon:"Headphones", description:"Som imersivo 360° com ANC" },
  { id:"p2", name:"Smart Watch Ultra", categoryId:"c1", price:899.00, stock:5,  icon:"Watch",      description:"Saúde e performance no pulso" },
  { id:"p3", name:"Tênis Runner V2",   categoryId:"c4", price:279.90, stock:20, icon:"Activity",   description:"Performance máxima nas pistas" },
  { id:"p4", name:"Jaqueta Premium",   categoryId:"c2", price:459.00, stock:8,  icon:"Shirt",      description:"Estilo e conforto inigualável" },
  { id:"p5", name:"Luminária LED",     categoryId:"c3", price:129.90, stock:15, icon:"Lightbulb",  description:"Iluminação inteligente dimável" },
  { id:"p6", name:"Mochila Urban",     categoryId:"c2", price:199.90, stock:3,  icon:"Backpack",   description:"Espaço e organização para o dia a dia" },
];
const SEED_USERS = [
  { id:"u1", name:"João Costa",   email:"joao@email.com",  password:"@m123", role:"admin",    createdAt:"10/01/2024" },
  { id:"u2", name:"Pedro Alves",  email:"pedro@email.com", password:"v@123", role:"vendedor", createdAt:"15/02/2024" },
  { id:"u3", name:"Ana Lima",     email:"ana@email.com",   password:"c@123", role:"cliente",  createdAt:"20/03/2024" },
  { id:"u4", name:"Bruno Santos", email:"bruno@email.com", password:"c@456", role:"cliente",  createdAt:"05/04/2024" },
];

// ─── LOCALSTORAGE HELPERS ─────────────────────────────────────────────────────
const lsGet = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch { return fb; }
};
const lsSet = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{min-height:100vh}
input,select,textarea,button{font-family:'Outfit',sans-serif}
input::placeholder,textarea::placeholder{color:${T.t3}}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:${T.bg0}}
::-webkit-scrollbar-thumb{background:${T.bg4};border-radius:3px}

@keyframes fadeIn  {from{opacity:0}                             to{opacity:1}}
@keyframes slideUp {from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn {from{opacity:0;transform:scale(.92)}       to{opacity:1;transform:scale(1)}}
@keyframes popIn   {0%{transform:scale(0)}65%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes spin    {to{transform:rotate(360deg)}}
@keyframes toastIn {from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes confetti{0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(600px) rotate(720deg);opacity:0}}
@keyframes glowOk  {0%,100%{box-shadow:0 0 14px rgba(52,211,153,.15)} 50%{box-shadow:0 0 32px rgba(52,211,153,.4)}}

.fade    {animation:fadeIn  .25s ease}
.slideUp {animation:slideUp .32s ease}
.scaleIn {animation:scaleIn .45s cubic-bezier(.34,1.56,.64,1)}

.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:9999;
  display:flex;align-items:center;gap:8px;padding:11px 24px;border-radius:100px;
  font-size:13px;font-weight:500;backdrop-filter:blur(20px);white-space:nowrap;
  box-shadow:0 10px 50px rgba(0,0,0,.8);animation:toastIn .25s ease;letter-spacing:.1px}

.nav-item{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:10px;
  cursor:pointer;font-size:13.5px;font-weight:500;color:${T.t2};
  transition:all .15s;border:1px solid transparent;user-select:none;position:relative}
.nav-item:hover{background:${T.bg3};color:${T.t1}}
.nav-item.active{background:${T.goldBg};border-color:${T.goldBd};color:${T.goldL}}
.nav-badge{margin-left:auto;background:${T.goldL};color:${T.bg0};
  min-width:18px;height:18px;border-radius:9px;font-size:10px;font-weight:700;
  display:flex;align-items:center;justify-content:center;padding:0 4px}

.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:10px;
  cursor:pointer;font-size:14px;font-weight:600;transition:all .15s;
  border:1px solid;white-space:nowrap;letter-spacing:.1px}
.btn-gold  {background:${T.goldBg};border-color:${T.goldBd};color:${T.goldL}}
.btn-gold:hover{background:#1A1200;border-color:#4A3200;color:#F2C44A;transform:translateY(-1px)}
.btn-ghost {background:transparent;border-color:${T.bd};color:${T.t2}}
.btn-ghost:hover{background:${T.bg3};border-color:${T.bdH};color:${T.t1}}
.btn-sm{padding:7px 15px;font-size:13px}
.btn-full{width:100%;justify-content:center}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important}

.field{background:${T.bg3};border:1px solid ${T.bd};color:${T.t1};
  padding:11px 14px;border-radius:10px;font-size:14px;width:100%;
  outline:none;transition:border-color .15s}
.field:focus{border-color:${T.goldBd};background:${T.bg4}}
.field.has-left{padding-left:42px}
.field.has-right{padding-right:42px}

.icoBtn{display:inline-flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid transparent;color:${T.t3};
  padding:7px;border-radius:8px;cursor:pointer;transition:all .15s}
.icoBtn:hover{background:${T.bg4};border-color:${T.bd};color:${T.t1}}
.icoBtn.danger:hover{background:#160404;border-color:#380808;color:${T.err}}

.card{background:${T.bg2};border:1px solid ${T.bd};border-radius:16px;transition:border-color .2s}
.card:hover{border-color:${T.bdH}}

.pcard{background:${T.bg2};border:1px solid ${T.bd};border-radius:20px;
  overflow:hidden;transition:all .3s cubic-bezier(.22,1,.36,1)}
.pcard:hover{border-color:${T.bdH};transform:translateY(-6px);
  box-shadow:0 24px 64px rgba(0,0,0,.6)}

.pill{display:inline-flex;align-items:center;gap:5px;
  padding:3px 10px;border-radius:100px;font-size:11.5px;font-weight:600;letter-spacing:.1px}

.sttl{font-family:'Cormorant Garamond',serif;font-size:34px;
  font-weight:600;color:${T.t1};letter-spacing:.3px;line-height:1.1}

.row{background:${T.bg2};border:1px solid ${T.bd};border-radius:12px;
  padding:13px 17px;display:flex;align-items:center;gap:13px;transition:border-color .15s}
.row:hover{border-color:${T.bdH}}

.qbtn{background:${T.bg3};border:1px solid ${T.bd};color:${T.t1};
  width:32px;height:32px;border-radius:8px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s}
.qbtn:hover{background:${T.bg4};border-color:${T.bdH}}

.sl{font-size:10px;font-weight:700;color:${T.t3};letter-spacing:1.8px;
  text-transform:uppercase;padding:0 12px;margin:18px 0 5px}

.sel{background:${T.bg3};border:1px solid ${T.bd};color:${T.t1};
  padding:11px 14px;border-radius:10px;font-size:14px;width:100%;
  outline:none;transition:border-color .15s;cursor:pointer;-webkit-appearance:none}
.sel:focus{border-color:${T.goldBd}}

.confetti-p{position:absolute;border-radius:2px;animation:confetti linear forwards}
.spinner{width:18px;height:18px;border:2px solid rgba(200,150,30,.2);
  border-top:2px solid ${T.goldL};border-radius:50%;animation:spin 1s linear infinite}
.divider{border:none;border-top:1px solid ${T.bd}}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
`;

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [products,    setProducts]    = useState(() => lsGet("v4_products",   SEED_PRODS));
  const [categories,  setCategories]  = useState(() => lsGet("v4_categories", SEED_CATS));
  const [orders,      setOrders]      = useState(() => lsGet("v4_orders",     []));
  const [users,       setUsers]       = useState(() => lsGet("v4_users",      SEED_USERS));
  const [cart,        setCart]        = useState(() => lsGet("v4_cart",       []));
  const [session,     setSession]     = useState(() => lsGet("v4_session",    null));
  const [page,        setPage]        = useState("shop");
  const [loginOpen,   setLoginOpen]   = useState(false);
  const [confirmOrd,  setConfirmOrd]  = useState(null);
  const [toast,       setToast]       = useState(null);

  // Persist to localStorage on every change
  useEffect(() => lsSet("v4_products",   products),   [products]);
  useEffect(() => lsSet("v4_categories", categories), [categories]);
  useEffect(() => lsSet("v4_orders",     orders),     [orders]);
  useEffect(() => lsSet("v4_users",      users),      [users]);
  useEffect(() => lsSet("v4_cart",       cart),       [cart]);
  useEffect(() => lsSet("v4_session",    session),    [session]);

  const notify = (msg, type = "ok") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (user) => {
    setSession(user);
    setLoginOpen(false);
    notify(`Bem-vindo, ${user.name.split(" ")[0]}!`);
    setPage(user.role === "cliente" ? "shop" : "admin-products");
  };

  const handleLogout = () => {
    setSession(null);
    setPage("shop");
    notify("Sessão encerrada.");
  };

  const isAdmin = session?.role === "admin";
  const isStaff = session?.role === "admin" || session?.role === "vendedor";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const ctx = {
    products, setProducts,
    categories, setCategories,
    orders, setOrders,
    users, setUsers,
    cart, setCart,
    cartCount,
    session, isAdmin, isStaff,
    notify,
    page, setPage,
    setConfirmOrd,
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg0, color:T.t1, fontFamily:"'Outfit',sans-serif" }}>
      <style>{CSS}</style>

      {loginOpen  && <LoginModal users={users} onLogin={handleLogin} onClose={() => setLoginOpen(false)}/>}
      {confirmOrd && (
        <ConfirmModal
          order={confirmOrd}
          products={products}
          categories={categories}
          onClose={() => { setConfirmOrd(null); setPage("shop"); }}
        />
      )}

      {toast && (
        <div key={toast.id} className="toast" style={{
          background: toast.type === "ok" ? "rgba(7,20,12,.97)" : "rgba(20,7,7,.97)",
          border: `1px solid ${toast.type === "ok" ? "#1A4A28" : "#4A1A1A"}`,
          color: toast.type === "ok" ? T.ok : T.err,
        }}>
          {toast.type === "ok" ? <Check size={13}/> : <AlertCircle size={13}/>}
          {toast.msg}
        </div>
      )}

      {isStaff
        ? <StaffLayout  {...ctx} onLogout={handleLogout}/>
        : <PublicLayout {...ctx} onLoginClick={() => setLoginOpen(true)} onLogout={handleLogout}/>
      }
    </div>
  );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ users, onLogin, onClose }) {
  const [email, setEmail] = useState("");
  const [pw,    setPw]    = useState("");
  const [show,  setShow]  = useState(false);
  const [err,   setErr]   = useState("");
  const [busy,  setBusy]  = useState(false);

  const submit = () => {
    if (!email || !pw) return setErr("Preencha email e senha.");
    setErr(""); setBusy(true);
    setTimeout(() => {
      const u = users.find(u => u.email === email && u.password === pw);
      if (u) onLogin(u);
      else { setErr("Email ou senha incorretos."); setBusy(false); }
    }, 600);
  };

  const DEMOS = [
    { role:"Admin",    email:"joao@email.com",  pw:"@m123", color:T.goldL },
    { role:"Vendedor", email:"pedro@email.com", pw:"v@123", color:T.info  },
    { role:"Cliente",  email:"ana@email.com",   pw:"c@123", color:T.ok   },
  ];

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:2000,
        display:"flex", alignItems:"center", justifyContent:"center",
        backdropFilter:"blur(12px)", animation:"fadeIn .2s ease" }}>
      <div className="scaleIn" style={{ background:T.bg1, border:`1px solid ${T.bdH}`,
        borderRadius:28, padding:"46px 42px", width:440, maxWidth:"95vw", position:"relative",
        boxShadow:"0 60px 130px rgba(0,0,0,.9)" }}>

        <button className="icoBtn" onClick={onClose}
          style={{ position:"absolute", top:18, right:18 }}><X size={18}/></button>

        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:56, height:56, borderRadius:16, margin:"0 auto 18px",
            background:`linear-gradient(145deg,${T.goldBg},#201600)`,
            border:`1px solid ${T.goldBd}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 8px 32px rgba(200,150,30,.15)` }}>
            <ShoppingBag size={26} color={T.goldL}/>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32,
            fontWeight:600, color:T.goldL, letterSpacing:3, lineHeight:1 }}>MERCADO</div>
          <div style={{ fontSize:11, color:T.t3, letterSpacing:3, marginTop:6, fontWeight:500 }}>
            PLATAFORMA DE VENDAS
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ position:"relative" }}>
            <Mail size={15} style={{ position:"absolute", left:14, top:"50%",
              transform:"translateY(-50%)", color:T.t3, pointerEvents:"none" }}/>
            <input className="field has-left" value={email} type="email"
              onChange={e => { setEmail(e.target.value); setErr(""); }}
              placeholder="seu@email.com"
              onKeyDown={e => e.key === "Enter" && submit()}/>
          </div>

          <div style={{ position:"relative" }}>
            <Lock size={15} style={{ position:"absolute", left:14, top:"50%",
              transform:"translateY(-50%)", color:T.t3, pointerEvents:"none" }}/>
            <input className="field has-left" value={pw} type={show ? "text" : "password"}
              style={{ paddingRight:46 }} placeholder="Senha"
              onChange={e => { setPw(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && submit()}/>
            <button onClick={() => setShow(v => !v)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", color:T.t3,
                display:"flex", alignItems:"center", padding:4 }}>
              {show ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>

          {err && (
            <div style={{ display:"flex", alignItems:"center", gap:8, color:T.err, fontSize:13,
              background:"#110305", border:`1px solid #2A080E`, borderRadius:10, padding:"10px 14px" }}>
              <AlertCircle size={14}/> {err}
            </div>
          )}

          <button className="btn btn-gold btn-full" onClick={submit} disabled={busy}
            style={{ height:50, fontSize:15, marginTop:4 }}>
            {busy ? <div className="spinner"/> : <><LogIn size={16}/> Entrar</>}
          </button>
        </div>

        <div style={{ marginTop:28, background:T.bg3, border:`1px solid ${T.bd}`,
          borderRadius:14, padding:"16px 18px" }}>
          <div style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:2,
            textTransform:"uppercase", marginBottom:12 }}>Acesso Rápido</div>
          {DEMOS.map((d, i) => (
            <div key={d.email} onClick={() => { setEmail(d.email); setPw(d.pw); setErr(""); }}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"9px 4px", cursor:"pointer",
                borderBottom: i < DEMOS.length - 1 ? `1px solid ${T.bd}` : "none",
                transition:"opacity .15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = ".65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <div>
                <div style={{ fontSize:13, color:T.t1, fontWeight:500 }}>{d.email}</div>
                <div style={{ fontSize:11, color:T.t3, marginTop:1 }}>Clique para preencher</div>
              </div>
              <span className="pill" style={{ background:T.bg4, border:`1px solid ${T.bd}`, color:d.color }}>
                {d.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ order, products, categories, onClose }) {
  const COLORS = [T.goldL, T.ok, T.info, T.pink, "#ffffff", "#E8D870"];
  const pieces = Array.from({ length:30 }, (_, i) => ({
    id:i, left:Math.random()*100, color:COLORS[i%COLORS.length],
    delay:Math.random()*1.4, dur:2.0+Math.random()*1.2,
    w:5+Math.random()*9, h:3+Math.random()*5, rot:Math.random()*360,
  }));

  const STEPS = [
    { label:"Confirmado", ico:"Check",        done:true  },
    { label:"Separando",  ico:"Package2",     done:false },
    { label:"A Caminho",  ico:"Truck",        done:false },
    { label:"Entregue",   ico:"CheckCircle",  done:false },
  ];

  const items = order.items
    .map(i => ({ ...i, p: products.find(pr => pr.id === i.productId) }))
    .filter(i => i.p);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.9)", zIndex:2000,
      display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(16px)", animation:"fadeIn .3s ease" }}>

      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {pieces.map(c => (
          <div key={c.id} className="confetti-p" style={{
            left:`${c.left}%`, top:-12, width:c.w, height:c.h,
            background:c.color, transform:`rotate(${c.rot}deg)`,
            animationDelay:`${c.delay}s`, animationDuration:`${c.dur}s`,
          }}/>
        ))}
      </div>

      <div className="scaleIn" style={{ background:T.bg1, border:`1px solid ${T.bdH}`,
        borderRadius:30, padding:"52px 48px", maxWidth:520, width:"95vw",
        position:"relative", textAlign:"center",
        maxHeight:"95vh", overflowY:"auto",
        boxShadow:"0 70px 140px rgba(0,0,0,.9)" }}>

        <button className="icoBtn" onClick={onClose}
          style={{ position:"absolute", top:20, right:20 }}><X size={18}/></button>

        <div style={{ width:96, height:96, borderRadius:"50%", margin:"0 auto 32px",
          background:"linear-gradient(145deg,#081E10,#0E2A18)",
          border:"2px solid #1C6034",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:"popIn .7s cubic-bezier(.34,1.56,.64,1) .1s both, glowOk 2s ease 1s infinite",
          boxShadow:"0 0 50px rgba(52,211,153,.25)" }}>
          <Check size={46} color={T.ok} strokeWidth={2.5}/>
        </div>

        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42,
          fontWeight:600, letterSpacing:.5, marginBottom:6, lineHeight:1 }}>
          Pedido Confirmado!
        </div>
        <div style={{ color:T.t2, fontSize:14, marginBottom:4 }}>
          Número do pedido:&nbsp;
          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700,
            color:T.t1, background:T.bg3, padding:"2px 9px", borderRadius:6 }}>
            #{order.id.slice(-8).toUpperCase()}
          </span>
        </div>

        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52,
          fontWeight:600, color:T.goldL, lineHeight:1, margin:"20px 0 32px" }}>
          R$ {order.total.toFixed(2)}
        </div>

        <div style={{ background:T.bg2, border:`1px solid ${T.bd}`,
          borderRadius:16, overflow:"hidden", marginBottom:32, textAlign:"left" }}>
          {items.map(({ p, qty }, i) => {
            const cat = categories.find(c => c.id === p.categoryId);
            const col = cat?.color || T.t2;
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14,
                padding:"13px 18px",
                borderBottom: i < items.length-1 ? `1px solid ${T.bd}` : "none" }}>
                <div style={{ width:40, height:40, borderRadius:10,
                  background:`${col}18`, border:`1px solid ${col}30`, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Ic n={p.icon} s={18} c={col}/>
                </div>
                <div style={{ flex:1, fontSize:14, fontWeight:500, color:T.t1 }}>{p.name}</div>
                <div style={{ fontSize:12, color:T.t3, marginRight:8 }}>×{qty}</div>
                <div style={{ fontSize:15, fontWeight:700, color:T.t1,
                  fontFamily:"'Cormorant Garamond',serif" }}>
                  R$ {(p.price*qty).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom:32 }}>
          <div style={{ fontSize:11, color:T.t3, fontWeight:700, letterSpacing:2,
            textTransform:"uppercase", marginBottom:20 }}>Status do Pedido</div>
          <div style={{ display:"flex", alignItems:"flex-start" }}>
            {STEPS.map((step, i) => (
              <Fragment key={i}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:9, flex:1 }}>
                  <div style={{
                    width:38, height:38, borderRadius:"50%",
                    background: step.done ? "linear-gradient(145deg,#0B2718,#12331E)" : T.bg3,
                    border:`2px solid ${step.done ? "#276040" : T.bd}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow: step.done ? "0 0 18px rgba(52,211,153,.3)" : "none",
                    animation: step.done
                      ? `popIn .5s cubic-bezier(.34,1.56,.64,1) ${.3+i*.12}s both`
                      : "none",
                  }}>
                    <Ic n={step.ico} s={16} c={step.done ? T.ok : T.t3}/>
                  </div>
                  <span style={{ fontSize:10.5, fontWeight:700, color:step.done?T.ok:T.t3,
                    textAlign:"center", lineHeight:1.3, maxWidth:64 }}>{step.label}</span>
                </div>
                {i < STEPS.length-1 && (
                  <div style={{ height:2, flex:1, marginTop:18,
                    background: i===0 ? `linear-gradient(90deg,#276040,${T.bd})` : T.bd }}/>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { ico:"Truck",       label:"Entrega estimada",   val:"3 a 5 dias úteis" },
            { ico:"CheckCircle", label:"Método de pagamento", val:"Simulação"        },
          ].map(item => (
            <div key={item.label} style={{ background:T.bg3, border:`1px solid ${T.bd}`,
              borderRadius:12, padding:"14px 16px", display:"flex", gap:11, textAlign:"left" }}>
              <Ic n={item.ico} s={18} c={T.t3} style={{ flexShrink:0, marginTop:1 }}/>
              <div>
                <div style={{ fontSize:11, color:T.t3, marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:T.t1 }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-ghost btn-full" onClick={onClose} style={{ height:48, fontSize:15 }}>
          <ShoppingBag size={16}/> Continuar Comprando
        </button>
      </div>
    </div>
  );
}

// ─── STAFF LAYOUT ─────────────────────────────────────────────────────────────
function StaffLayout({ page, setPage, session, isAdmin, onLogout, cartCount, ...rest }) {
  const [slim, setSlim] = useState(false);
  const rm = ROLE_META[session?.role] || ROLE_META.vendedor;

  const NAV_GROUPS = [
    { label:"Vitrine", items:[
      { id:"shop",       label:"Loja",      ico:"ShoppingBag"  },
      { id:"cart",       label:"Carrinho",  ico:"ShoppingCart", badge:cartCount||null },
      { id:"orders-all", label:"Pedidos",   ico:"Package"      },
    ]},
    { label:"Gestão", items:[
      { id:"admin-products",   label:"Produtos",   ico:"LayoutGrid" },
      { id:"admin-categories", label:"Categorias", ico:"Tag"        },
      ...(isAdmin ? [{ id:"admin-users", label:"Usuários", ico:"Users" }] : []),
    ]},
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <aside style={{
        width: slim ? 68 : 252, flexShrink:0,
        background:T.bg1, borderRight:`1px solid ${T.bd}`,
        display:"flex", flexDirection:"column",
        position:"sticky", top:0, height:"100vh",
        transition:"width .22s ease", overflow:"hidden", zIndex:50,
      }}>
        <div style={{ padding:"20px 14px", borderBottom:`1px solid ${T.bd}`,
          display:"flex", alignItems:"center", gap:12, overflow:"hidden" }}>
          <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
            background:`linear-gradient(145deg,${T.goldBg},#281C00)`,
            border:`1px solid ${T.goldBd}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 16px rgba(200,150,30,.2)` }}>
            <ShoppingBag size={18} color={T.goldL}/>
          </div>
          {!slim && (
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22,
                fontWeight:600, color:T.goldL, letterSpacing:2.5, lineHeight:1, whiteSpace:"nowrap" }}>
                MERCADO
              </div>
              <div style={{ fontSize:9, color:T.t3, letterSpacing:2, marginTop:3, fontWeight:600 }}>
                PLATAFORMA
              </div>
            </div>
          )}
        </div>

        <nav style={{ flex:1, padding:"8px", overflowY:"auto" }}>
          {NAV_GROUPS.map(g => (
            <div key={g.label}>
              {!slim
                ? <div className="sl">{g.label}</div>
                : <hr className="divider" style={{ margin:"10px 4px" }}/>
              }
              {g.items.map(item => (
                <div key={item.id}
                  className={`nav-item ${page === item.id ? "active" : ""}`}
                  onClick={() => setPage(item.id)}
                  title={slim ? item.label : undefined}
                  style={slim ? { justifyContent:"center", padding:"11px 0", position:"relative" } : {}}>
                  <Ic n={item.ico} s={17}/>
                  {!slim && <span style={{ flex:1 }}>{item.label}</span>}
                  {!slim && item.badge && <span className="nav-badge">{item.badge}</span>}
                  {slim && item.badge && (
                    <span style={{ position:"absolute", top:6, right:6,
                      background:T.goldL, color:T.bg0, width:15, height:15,
                      borderRadius:"50%", fontSize:9, fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding:"10px 8px", borderTop:`1px solid ${T.bd}` }}>
          {!slim ? (
            <div style={{ background:T.bg3, border:`1px solid ${T.bd}`, borderRadius:12, padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
                  background:`linear-gradient(145deg,${T.bg4},${T.bg3})`,
                  border:`1px solid ${rm.bd}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:15, fontWeight:700, color:rm.c }}>
                  {session.name[0]}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T.t1,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {session.name}
                  </div>
                  <span className="pill" style={{ background:rm.bg, border:`1px solid ${rm.bd}`,
                    color:rm.c, fontSize:10, marginTop:3 }}>
                    <Ic n={rm.ico} s={9}/> {rm.label}
                  </span>
                </div>
              </div>
              <button className="btn btn-ghost btn-full btn-sm" onClick={onLogout}>
                <LogOut size={13}/> Sair
              </button>
            </div>
          ) : (
            <button className="icoBtn" onClick={onLogout} title="Sair"
              style={{ width:"100%", justifyContent:"center", padding:"11px 0" }}>
              <LogOut size={17}/>
            </button>
          )}
        </div>

        <button onClick={() => setSlim(v => !v)}
          style={{ position:"absolute", top:"50%", right:-14, transform:"translateY(-50%)",
            background:T.bg2, border:`1px solid ${T.bd}`, width:28, height:28,
            borderRadius:"50%", cursor:"pointer", zIndex:60,
            display:"flex", alignItems:"center", justifyContent:"center", color:T.t3 }}>
          {slim ? <ChevronRight size={13}/> : <ChevronLeft size={13}/>}
        </button>
      </aside>

      <main style={{ flex:1, overflow:"auto", padding:"38px 42px", minWidth:0 }}>
        <PageRouter page={page} ctx={{ ...rest, session, isAdmin, cartCount, page, setPage }}/>
      </main>
    </div>
  );
}

// ─── PUBLIC LAYOUT ────────────────────────────────────────────────────────────
function PublicLayout({ page, setPage, session, onLoginClick, onLogout, cartCount, ...rest }) {
  const TABS = [
    { id:"shop",      label:"Loja",         ico:"ShoppingBag"  },
    { id:"cart",      label:"Carrinho",     ico:"ShoppingCart", badge:cartCount },
    { id:"my-orders", label:"Meus Pedidos", ico:"Package"       },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <header style={{ background:T.bg1, borderBottom:`1px solid ${T.bd}`,
        position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1260, margin:"0 auto", padding:"0 28px",
          display:"flex", alignItems:"center", gap:18, height:66 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28,
            fontWeight:600, color:T.goldL, letterSpacing:3, flexShrink:0 }}>MERCADO</div>
          <div style={{ width:1, height:26, background:T.bd, flexShrink:0 }}/>
          <nav style={{ display:"flex", gap:4, flex:1, overflowX:"auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setPage(t.id)} className="btn btn-sm"
                style={{ background:page===t.id?T.goldBg:"transparent",
                  border:`1px solid ${page===t.id?T.goldBd:"transparent"}`,
                  color:page===t.id?T.goldL:T.t2 }}>
                <Ic n={t.ico} s={14}/> {t.label}
                {t.badge > 0 && (
                  <span style={{ background:T.goldL, color:T.bg0, minWidth:18, height:18,
                    borderRadius:9, fontSize:10, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px" }}>
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          {session
            ? <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <span style={{ fontSize:13, color:T.t2 }}>{session.name.split(" ")[0]}</span>
                <button className="btn btn-ghost btn-sm" onClick={onLogout}>
                  <LogOut size={14}/> Sair
                </button>
              </div>
            : <button className="btn btn-gold btn-sm" onClick={onLoginClick} style={{ flexShrink:0 }}>
                <LogIn size={14}/> Entrar
              </button>
          }
        </div>
      </header>
      <main style={{ flex:1, maxWidth:1260, margin:"0 auto", width:"100%", padding:"36px 28px" }}>
        <PageRouter page={page} ctx={{ ...rest, session, cartCount, page, setPage }}/>
      </main>
    </div>
  );
}

// ─── PAGE ROUTER ──────────────────────────────────────────────────────────────
function PageRouter({ page, ctx }) {
  switch (page) {
    case "shop":             return <ShopView            {...ctx}/>;
    case "cart":             return <CartView            {...ctx}/>;
    case "my-orders":        return <MyOrdersView        {...ctx}/>;
    case "orders-all":       return <AdminOrdersView     {...ctx}/>;
    case "admin-products":   return <AdminProductsView   {...ctx}/>;
    case "admin-categories": return <AdminCategoriesView {...ctx}/>;
    case "admin-users":      return <AdminUsersView      {...ctx}/>;
    default:                 return <ShopView            {...ctx}/>;
  }
}

// ─── SHOP VIEW ────────────────────────────────────────────────────────────────
function ShopView({ products, categories, cart, setCart, notify }) {
  const [search, setSearch] = useState("");
  const [cat,    setCat]    = useState("all");

  const filtered = products.filter(p =>
    (cat === "all" || p.categoryId === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const inCart = id => cart.find(i => i.productId === id);

  const addToCart = p => {
    if (p.stock === 0) return notify("Produto sem estoque!", "err");
    setCart(prev => {
      const ex = prev.find(i => i.productId === p.id);
      if (ex) {
        if (ex.qty >= p.stock) { notify("Estoque insuficiente!", "err"); return prev; }
        return prev.map(i => i.productId === p.id ? { ...i, qty:i.qty+1 } : i);
      }
      return [...prev, { productId:p.id, qty:1 }];
    });
    notify(`${p.name} adicionado ao carrinho`);
  };

  return (
    <div className="fade">
      <div style={{ background:`linear-gradient(135deg,${T.bg2},${T.bg3})`,
        border:`1px solid ${T.bd}`, borderRadius:24, padding:"34px 40px",
        marginBottom:30, overflow:"hidden", position:"relative",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ position:"absolute", right:-80, top:-80, width:320, height:320, borderRadius:"50%",
          background:`radial-gradient(circle,${T.goldL}08,transparent 65%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", left:-40, bottom:-40, width:200, height:200, borderRadius:"50%",
          background:`radial-gradient(circle,${T.blue}06,transparent 65%)`, pointerEvents:"none" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:48,
            fontWeight:600, letterSpacing:.5, lineHeight:1.05, marginBottom:10 }}>
            Nossa Coleção
          </div>
          <div style={{ display:"flex", gap:20 }}>
            <span style={{ fontSize:13, color:T.t3 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:T.goldL, fontWeight:600 }}>
                {products.length}
              </span> produtos
            </span>
            <span style={{ fontSize:13, color:T.t3 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:T.goldL, fontWeight:600 }}>
                {categories.length}
              </span> categorias
            </span>
          </div>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:120,
          color:`${T.goldL}09`, fontWeight:600, letterSpacing:6, lineHeight:1,
          userSelect:"none", position:"relative", flexShrink:0 }}>SHOP</div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:26, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <Search size={15} style={{ position:"absolute", left:14, top:"50%",
            transform:"translateY(-50%)", color:T.t3, pointerEvents:"none" }}/>
          <input className="field has-left" value={search}
            onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..."/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[{ id:"all", name:"Todos", icon:"ShoppingBag", color:T.t2 }, ...categories].map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
                borderRadius:100, cursor:"pointer", fontSize:13.5, fontFamily:"'Outfit',sans-serif",
                fontWeight:500, transition:"all .15s",
                background: cat===c.id ? `${c.color}16` : T.bg2,
                border: `1px solid ${cat===c.id ? c.color+"45" : T.bd}`,
                color: cat===c.id ? c.color : T.t2 }}>
              <Ic n={c.icon} s={13}/> {c.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:18 }}>
        {filtered.map(p => {
          const category = categories.find(c => c.id === p.categoryId);
          const col = category?.color || T.t2;
          const ic  = inCart(p.id);
          return (
            <div key={p.id} className="pcard">
              <div style={{ height:162, position:"relative", overflow:"hidden",
                background:`linear-gradient(145deg,${col}0E,${col}06)`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ position:"absolute", bottom:-30, right:-30, width:140, height:140,
                  borderRadius:"50%", background:`${col}08`, pointerEvents:"none" }}/>
                <div style={{ position:"absolute", top:-20, left:-20, width:90, height:90,
                  borderRadius:"50%", background:`${col}06`, pointerEvents:"none" }}/>
                {category && (
                  <span className="pill" style={{ position:"absolute", top:12, left:12,
                    background:`${col}20`, border:`1px solid ${col}38`, color:col, fontSize:10.5 }}>
                    <Ic n={category.icon} s={10}/> {category.name}
                  </span>
                )}
                {p.stock === 0
                  ? <span className="pill" style={{ position:"absolute", top:12, right:12,
                      background:"#160505", border:`1px solid #3A0E0E`, color:T.err, fontSize:10 }}>
                      Esgotado
                    </span>
                  : p.stock <= 3
                  ? <span className="pill" style={{ position:"absolute", top:12, right:12,
                      background:"#161000", border:`1px solid #3A2800`, color:T.amber, fontSize:10 }}>
                      Últimas {p.stock}
                    </span>
                  : null
                }
                <div style={{ width:72, height:72, borderRadius:20,
                  background:`${col}20`, border:`1px solid ${col}38`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 6px 28px ${col}28` }}>
                  <Ic n={p.icon} s={34} c={col}/>
                </div>
              </div>
              <div style={{ padding:"16px 18px 18px" }}>
                <div style={{ fontWeight:700, fontSize:15, color:T.t1, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:12.5, color:T.t3, marginBottom:16, lineHeight:1.5 }}>{p.description}</div>
                <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:8 }}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif",
                      fontSize:28, fontWeight:600, color:T.goldL, lineHeight:1 }}>
                      R$ {p.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize:11, marginTop:3, fontWeight:500,
                      color: p.stock>5 ? T.t3 : p.stock>0 ? T.amber : T.err }}>
                      {p.stock > 0 ? `${p.stock} em estoque` : "Sem estoque"}
                    </div>
                  </div>
                  <button onClick={() => addToCart(p)} className="btn btn-sm"
                    style={{ flexShrink:0,
                      background: p.stock===0 ? T.bg3 : ic ? `${T.ok}14` : T.goldBg,
                      border: `1px solid ${p.stock===0 ? T.bd : ic ? T.ok+"30" : T.goldBd}`,
                      color: p.stock===0 ? T.t3 : ic ? T.ok : T.goldL,
                      cursor: p.stock===0 ? "not-allowed" : "pointer" }}>
                    {ic ? <><Check size={12}/> {ic.qty}</> : <><Plus size={13}/> Adicionar</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 24px", color:T.t3 }}>
            <Search size={42} style={{ display:"block", margin:"0 auto 16px", opacity:.18 }}/>
            <div style={{ fontSize:18, color:T.t2, marginBottom:6 }}>Nenhum produto encontrado</div>
            <div style={{ fontSize:14 }}>Tente outro termo ou categoria</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CART VIEW ────────────────────────────────────────────────────────────────
function CartView({ cart, setCart, products, categories, users, setOrders, session, notify, setConfirmOrd, setPage }) {
  const [uid, setUid] = useState(
    session?.role === "cliente" ? session.id : users.find(u => u.role === "cliente")?.id || ""
  );

  const items = cart.map(i => ({ ...i, p: products.find(pr => pr.id === i.productId) })).filter(i => i.p);
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0);

  const updQty = (pid, qty) => {
    const p = products.find(p => p.id === pid);
    if (qty < 1) { setCart(prev => prev.filter(i => i.productId !== pid)); return; }
    if (qty > p.stock) return notify("Estoque insuficiente!", "err");
    setCart(prev => prev.map(i => i.productId === pid ? { ...i, qty } : i));
  };

  const checkout = () => {
    if (!uid) return notify("Selecione um cliente!", "err");
    const ord = {
      id: "ord_" + Date.now().toString(36),
      userId: uid, items: cart.map(i => ({ ...i })),
      total, status:"pendente",
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    setOrders(prev => [ord, ...prev]);
    setCart([]);
    setConfirmOrd(ord);
  };

  if (!items.length) return (
    <div className="fade" style={{ textAlign:"center", padding:"90px 24px" }}>
      <div style={{ width:84, height:84, borderRadius:24, background:T.bg2,
        border:`1px solid ${T.bd}`, display:"flex", alignItems:"center", justifyContent:"center",
        margin:"0 auto 24px", boxShadow:"0 12px 40px rgba(0,0,0,.4)" }}>
        <ShoppingCart size={38} color={T.t3}/>
      </div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:T.t2, marginBottom:8 }}>
        Carrinho vazio
      </div>
      <div style={{ color:T.t3, fontSize:15, marginBottom:28 }}>Explore a loja e adicione produtos</div>
      <button className="btn btn-gold" onClick={() => setPage("shop")}>
        <ShoppingBag size={16}/> Ir para a Loja
      </button>
    </div>
  );

  return (
    <div className="fade" style={{ maxWidth:700, margin:"0 auto" }}>
      <div className="sttl" style={{ marginBottom:26 }}>Carrinho de Compras</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
        {items.map(({ p, qty, productId }) => {
          const cat = categories.find(c => c.id === p.categoryId);
          const col = cat?.color || T.t2;
          return (
            <div key={productId} className="row">
              <div style={{ width:50, height:50, borderRadius:13, flexShrink:0,
                background:`${col}18`, border:`1px solid ${col}28`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ic n={p.icon} s={23} c={col}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14.5, color:T.t1 }}>{p.name}</div>
                <div style={{ fontSize:12, color:T.t3, marginTop:2 }}>R$ {p.price.toFixed(2)} cada</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <button className="qbtn" onClick={() => updQty(productId, qty-1)}><Minus size={13}/></button>
                <span style={{ minWidth:30, textAlign:"center", fontSize:15, fontWeight:700 }}>{qty}</span>
                <button className="qbtn" onClick={() => updQty(productId, qty+1)}><Plus size={13}/></button>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:22, color:T.goldL, fontWeight:600, minWidth:110, textAlign:"right" }}>
                R$ {(p.price * qty).toFixed(2)}
              </div>
              <button className="icoBtn danger"
                onClick={() => setCart(prev => prev.filter(i => i.productId !== productId))}>
                <Trash2 size={15}/>
              </button>
            </div>
          );
        })}
      </div>
      <div className="card" style={{ padding:"24px 28px" }}>
        {session?.role !== "cliente" && (
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
              display:"block", marginBottom:8 }}>CLIENTE</label>
            <select className="sel" value={uid} onChange={e => setUid(e.target.value)}>
              <option value="">Selecione um cliente...</option>
              {users.filter(u => u.role === "cliente").map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          borderTop:`1px solid ${T.bd}`, paddingTop:22 }}>
          <div>
            <div style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8, marginBottom:5 }}>
              TOTAL DO PEDIDO
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:46, fontWeight:600, color:T.goldL, lineHeight:1 }}>
              R$ {total.toFixed(2)}
            </div>
            <div style={{ fontSize:12, color:T.t3, marginTop:4 }}>
              {items.reduce((s, i) => s + i.qty, 0)} itens no pedido
            </div>
          </div>
          <button className="btn btn-gold" onClick={checkout} style={{ height:54, padding:"0 32px", fontSize:15 }}>
            Finalizar Pedido <ChevronRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MY ORDERS ────────────────────────────────────────────────────────────────
function MyOrdersView({ orders, session, products, categories }) {
  const mine = session ? orders.filter(o => o.userId === session.id) : orders;
  if (!mine.length) return (
    <div style={{ textAlign:"center", padding:"80px 24px", color:T.t3 }}>
      <Package size={42} style={{ display:"block", margin:"0 auto 16px", opacity:.18 }}/>
      <div style={{ fontSize:18, color:T.t2, marginBottom:8 }}>Nenhum pedido ainda</div>
      <div style={{ fontSize:14 }}>Seus pedidos aparecerão aqui</div>
    </div>
  );
  return (
    <div className="fade">
      <div className="sttl" style={{ marginBottom:24 }}>Meus Pedidos</div>
      <OrderList orders={mine} products={products} categories={categories}/>
    </div>
  );
}

// ─── ADMIN ORDERS ─────────────────────────────────────────────────────────────
function AdminOrdersView({ orders, setOrders, users, products, categories, notify }) {
  const upd = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    notify(`Status → ${STATUS_META[status]?.label}`);
  };
  if (!orders.length) return (
    <div style={{ textAlign:"center", padding:"80px 24px", color:T.t3 }}>
      <Package size={42} style={{ display:"block", margin:"0 auto 16px", opacity:.18 }}/>
      <div style={{ fontSize:18, color:T.t2 }}>Nenhum pedido ainda</div>
    </div>
  );
  return (
    <div className="fade">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div className="sttl">Todos os Pedidos</div>
        <span className="pill" style={{ background:T.bg3, border:`1px solid ${T.bd}`,
          color:T.t2, fontSize:13.5 }}>{orders.length} pedidos</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {orders.map(o => {
          const u  = users.find(u => u.id === o.userId);
          const sm = STATUS_META[o.status] || STATUS_META.pendente;
          return (
            <div key={o.id} className="card" style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontFamily:"monospace", fontSize:12, color:T.t3, letterSpacing:1, marginBottom:4 }}>
                    #{o.id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontWeight:700, fontSize:15, color:T.t1 }}>{u?.name || "Cliente"}</div>
                  <div style={{ fontSize:12, color:T.t3, marginTop:3 }}>{o.createdAt}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",
                    fontSize:30, color:T.goldL, fontWeight:600 }}>
                    R$ {o.total.toFixed(2)}
                  </div>
                  <select value={o.status} onChange={e => upd(o.id, e.target.value)}
                    style={{ background:sm.bg, border:`1px solid ${sm.bd}`, color:sm.c,
                      padding:"8px 14px", borderRadius:10, fontSize:13,
                      fontFamily:"'Outfit',sans-serif", cursor:"pointer",
                      outline:"none", WebkitAppearance:"none" }}>
                    {Object.entries(STATUS_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {o.items.map(item => {
                  const p   = products.find(pr => pr.id === item.productId);
                  const cat = p && categories.find(c => c.id === p.categoryId);
                  const col = cat?.color || T.t2;
                  return p ? (
                    <span key={item.productId} style={{ fontSize:12.5, color:T.t2,
                      background:T.bg3, border:`1px solid ${T.bd}`, borderRadius:8,
                      padding:"4px 11px", display:"flex", alignItems:"center", gap:5 }}>
                      <Ic n={p.icon} s={11} c={col}/> {p.name} ×{item.qty}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ADMIN PRODUCTS ───────────────────────────────────────────────────────────
function AdminProductsView({ products, setProducts, categories, notify }) {
  const BLANK = { name:"", categoryId:"", price:"", stock:"", icon:"Package", description:"" };
  const [form,    setForm]    = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [open,    setOpen]    = useState(false);
  const [search,  setSearch]  = useState("");

  const save = () => {
    if (!form.name || !form.price || !form.categoryId)
      return notify("Preencha os campos obrigatórios!", "err");
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing
        ? { ...p, ...form, price:+form.price, stock:+form.stock } : p));
      notify("Produto atualizado!");
    } else {
      setProducts(prev => [...prev,
        { ...form, id:"p"+Date.now(), price:+form.price, stock:+(form.stock||0) }]);
      notify("Produto criado!");
    }
    setForm(BLANK); setEditing(null); setOpen(false);
  };

  const editP = p => {
    setForm({ ...p, price:p.price.toString(), stock:p.stock.toString() });
    setEditing(p.id); setOpen(true);
    window.scrollTo({ top:0, behavior:"smooth" });
  };
  const delP = id => { setProducts(prev => prev.filter(p => p.id !== id)); notify("Produto removido."); };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const selCat   = categories.find(c => c.id === form.categoryId);
  const fCol     = selCat?.color || T.goldL;

  return (
    <div className="fade">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div className="sttl">Produtos</div>
        <button className="btn btn-gold" onClick={() => { setForm(BLANK); setEditing(null); setOpen(true); }}>
          <Plus size={15}/> Novo Produto
        </button>
      </div>

      {open && (
        <div className="card slideUp" style={{ padding:"26px 30px", marginBottom:26, borderColor:T.goldBd }}>
          <div style={{ fontSize:16, fontWeight:700, color:T.goldL, marginBottom:22,
            display:"flex", alignItems:"center", gap:9 }}>
            {editing ? <Pencil size={16}/> : <Plus size={16}/>}
            {editing ? "Editar Produto" : "Novo Produto"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
            {[
              { k:"name",        label:"NOME *",       placeholder:"Ex: Headphone Pro X" },
              { k:"categoryId",  label:"CATEGORIA *",  type:"select" },
              { k:"price",       label:"PREÇO (R$) *", placeholder:"0,00",  type:"number" },
              { k:"stock",       label:"ESTOQUE",      placeholder:"0",     type:"number" },
              { k:"description", label:"DESCRIÇÃO",    placeholder:"Breve descrição", full:true },
            ].map(({ k, label, placeholder, type, full }) => (
              <div key={k} style={full ? { gridColumn:"1/-1" } : {}}>
                <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
                  display:"block", marginBottom:8 }}>{label}</label>
                {type === "select"
                  ? <select className="sel" value={form[k]}
                      onChange={e => setForm(f => ({ ...f, [k]:e.target.value }))}>
                      <option value="">Selecione uma categoria...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  : <input className="field" type={type || "text"} value={form[k]}
                      onChange={e => setForm(f => ({ ...f, [k]:e.target.value }))}
                      placeholder={placeholder} step={type === "number" ? "0.01" : undefined}/>
                }
              </div>
            ))}
          </div>

          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
              display:"block", marginBottom:12 }}>ÍCONE DO PRODUTO</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {PROD_ICONS.map(ico => {
                const sel = form.icon === ico;
                return (
                  <button key={ico} onClick={() => setForm(f => ({ ...f, icon:ico }))}
                    style={{ background:sel ? `${fCol}18` : T.bg3,
                      border:`1px solid ${sel ? fCol+"45" : T.bd}`,
                      borderRadius:11, padding:"10px 12px", cursor:"pointer",
                      display:"flex", flexDirection:"column", alignItems:"center",
                      gap:5, transition:"all .15s",
                      transform: sel ? "scale(1.05)" : "scale(1)" }}>
                    <Ic n={ico} s={22} c={sel ? fCol : T.t3}/>
                    <span style={{ fontSize:9, color:sel?fCol:T.t3, fontWeight:700 }}>{ico}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button className="btn btn-gold" onClick={save}><Check size={15}/> Salvar</button>
            <button className="btn btn-ghost"
              onClick={() => { setOpen(false); setEditing(null); setForm(BLANK); }}>
              <X size={15}/> Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{ position:"relative", marginBottom:14 }}>
        <Search size={15} style={{ position:"absolute", left:14, top:"50%",
          transform:"translateY(-50%)", color:T.t3, pointerEvents:"none" }}/>
        <input className="field has-left" value={search}
          onChange={e => setSearch(e.target.value)} placeholder="Filtrar produtos..."/>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {filtered.map(p => {
          const cat = categories.find(c => c.id === p.categoryId);
          const col = cat?.color || T.t2;
          return (
            <div key={p.id} className="row">
              <div style={{ width:46, height:46, borderRadius:12, flexShrink:0,
                background:`${col}16`, border:`1px solid ${col}28`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ic n={p.icon} s={21} c={col}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:T.t1 }}>{p.name}</div>
                <div style={{ fontSize:12, color:T.t3, marginTop:2 }}>
                  {cat && <span style={{ color:col, fontWeight:600 }}>{cat.name}</span>}
                  {cat && " · "}{p.description}
                </div>
              </div>
              <div style={{ textAlign:"right", marginRight:6 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",
                  fontSize:22, color:T.goldL, fontWeight:600, lineHeight:1 }}>
                  R$ {p.price.toFixed(2)}
                </div>
                <div style={{ fontSize:11.5, marginTop:2, fontWeight:500,
                  color: p.stock>5 ? T.t3 : p.stock>0 ? T.amber : T.err }}>
                  {p.stock} em estoque
                </div>
              </div>
              <button className="icoBtn" onClick={() => editP(p)} title="Editar"><Pencil size={15}/></button>
              <button className="icoBtn danger" onClick={() => delP(p.id)} title="Excluir"><Trash2 size={15}/></button>
            </div>
          );
        })}
        {!filtered.length && (
          <div style={{ textAlign:"center", padding:"50px 24px", color:T.t3 }}>
            <Package size={32} style={{ display:"block", margin:"0 auto 12px", opacity:.18 }}/>
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN CATEGORIES ─────────────────────────────────────────────────────────
function AdminCategoriesView({ categories, setCategories, notify }) {
  const BLANK = { name:"", icon:"Tag", color:T.blue };
  const [form,    setForm]    = useState(BLANK);
  const [editing, setEditing] = useState(null);

  const save = () => {
    if (!form.name) return notify("Nome obrigatório!", "err");
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing ? { ...c, ...form } : c));
      notify("Categoria atualizada!");
    } else {
      setCategories(prev => [...prev, { ...form, id:"c"+Date.now() }]);
      notify("Categoria criada!");
    }
    setForm(BLANK); setEditing(null);
  };

  return (
    <div className="fade" style={{ maxWidth:760 }}>
      <div className="sttl" style={{ marginBottom:26 }}>Categorias</div>
      <div className="card" style={{ padding:"24px 28px", marginBottom:24 }}>
        <div style={{ fontSize:16, fontWeight:700, color:T.goldL, marginBottom:22 }}>
          {editing ? "Editar Categoria" : "Nova Categoria"}
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
            display:"block", marginBottom:8 }}>NOME *</label>
          <input className="field" value={form.name}
            onChange={e => setForm({ ...form, name:e.target.value })}
            placeholder="Ex: Eletrônicos"/>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
            display:"block", marginBottom:10 }}>ÍCONE</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {CAT_ICONS.map(ico => {
              const sel = form.icon === ico;
              return (
                <button key={ico} onClick={() => setForm(f => ({ ...f, icon:ico }))}
                  style={{ background:sel ? `${form.color}18` : T.bg3,
                    border:`1px solid ${sel ? form.color+"45" : T.bd}`,
                    borderRadius:10, padding:"9px 12px", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:6, transition:"all .15s",
                    transform: sel ? "scale(1.06)" : "scale(1)" }}>
                  <Ic n={ico} s={17} c={sel ? form.color : T.t2}/>
                  <span style={{ fontSize:11, color:sel?form.color:T.t3, fontWeight:600 }}>{ico}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
            display:"block", marginBottom:10 }}>COR</label>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {PALETTE.map(col => (
              <button key={col} onClick={() => setForm(f => ({ ...f, color:col }))}
                style={{ width:34, height:34, borderRadius:"50%", background:col,
                  cursor:"pointer", transition:"all .15s",
                  border:`3px solid ${form.color === col ? "#fff" : "transparent"}`,
                  transform: form.color === col ? "scale(1.18)" : "scale(1)",
                  boxShadow: form.color === col ? `0 0 14px ${col}66` : "none" }}/>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-gold" onClick={save}><Check size={15}/> Salvar</button>
          {editing && (
            <button className="btn btn-ghost" onClick={() => { setForm(BLANK); setEditing(null); }}>
              <X size={15}/> Cancelar
            </button>
          )}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {categories.map(c => (
          <div key={c.id} className="row">
            <div style={{ width:46, height:46, borderRadius:12, flexShrink:0,
              background:`${c.color}18`, border:`1px solid ${c.color}30`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ic n={c.icon} s={21} c={c.color}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14.5, color:T.t1 }}>{c.name}</div>
              <div style={{ fontSize:12, color:T.t3, marginTop:2 }}>Ícone: {c.icon}</div>
            </div>
            <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
              background:c.color, border:`2px solid ${c.color}70`,
              boxShadow:`0 0 10px ${c.color}44` }}/>
            <button className="icoBtn"
              onClick={() => { setForm(c); setEditing(c.id); }} title="Editar"><Pencil size={15}/></button>
            <button className="icoBtn danger" title="Excluir"
              onClick={() => { setCategories(prev => prev.filter(ct => ct.id !== c.id)); notify("Categoria removida."); }}>
              <Trash2 size={15}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN USERS ──────────────────────────────────────────────────────────────
function AdminUsersView({ users, setUsers, session, notify }) {
  const BLANK = { name:"", email:"", password:"", role:"cliente" };
  const [form,    setForm]    = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [showPw,  setShowPw]  = useState(false);

  const save = () => {
    if (!form.name || !form.email) return notify("Nome e email obrigatórios!", "err");
    if (!editing && !form.password) return notify("Senha obrigatória!", "err");
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing
        ? { ...u, ...form, ...(form.password ? { password:form.password } : {}) } : u));
      notify("Usuário atualizado!");
    } else {
      if (users.find(u => u.email === form.email))
        return notify("Este email já está em uso!", "err");
      setUsers(prev => [...prev,
        { ...form, id:"u"+Date.now(), createdAt:new Date().toLocaleDateString("pt-BR") }]);
      notify("Usuário criado!");
    }
    setForm(BLANK); setEditing(null);
  };

  const editU = u => { setForm({ ...u, password:"" }); setEditing(u.id); };
  const delU  = id => {
    if (id === session?.id) return notify("Você não pode excluir sua própria conta!", "err");
    setUsers(prev => prev.filter(u => u.id !== id));
    notify("Usuário removido.");
  };

  return (
    <div className="fade" style={{ maxWidth:780 }}>
      <div className="sttl" style={{ marginBottom:26 }}>Usuários</div>
      <div className="card" style={{ padding:"26px 30px", marginBottom:24 }}>
        <div style={{ fontSize:16, fontWeight:700, color:T.goldL, marginBottom:22 }}>
          {editing ? "Editar Usuário" : "Novo Usuário"}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
          {[
            { k:"name",  label:"NOME *",  placeholder:"Nome completo"       },
            { k:"email", label:"EMAIL *", placeholder:"email@exemplo.com", type:"email" },
          ].map(({ k, label, placeholder, type }) => (
            <div key={k}>
              <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
                display:"block", marginBottom:8 }}>{label}</label>
              <input className="field" type={type || "text"} value={form[k]}
                onChange={e => setForm(f => ({ ...f, [k]:e.target.value }))}
                placeholder={placeholder}/>
            </div>
          ))}
          <div>
            <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
              display:"block", marginBottom:8 }}>
              {editing ? "NOVA SENHA (vazio = manter)" : "SENHA *"}
            </label>
            <div style={{ position:"relative" }}>
              <input className="field" type={showPw ? "text" : "password"} value={form.password}
                onChange={e => setForm(f => ({ ...f, password:e.target.value }))}
                placeholder="••••••••" style={{ paddingRight:44 }}/>
              <button onClick={() => setShowPw(v => !v)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", color:T.t3,
                  display:"flex", alignItems:"center", padding:4 }}>
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
          <div>
            <label style={{ fontSize:10, color:T.t3, fontWeight:700, letterSpacing:1.8,
              display:"block", marginBottom:8 }}>PERFIL</label>
            <select className="sel" value={form.role}
              onChange={e => setForm(f => ({ ...f, role:e.target.value }))}>
              <option value="cliente">Cliente</option>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-gold" onClick={save}><Check size={15}/> Salvar</button>
          {editing && (
            <button className="btn btn-ghost" onClick={() => { setForm(BLANK); setEditing(null); }}>
              <X size={15}/> Cancelar
            </button>
          )}
        </div>
      </div>

      <div style={{ background:T.bg3, border:`1px solid ${T.bd}`, borderRadius:12,
        padding:"13px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:10 }}>
        <Shield size={15} color={T.goldL}/>
        <span style={{ fontSize:12.5, color:T.t2 }}>
          <strong style={{ color:T.goldL }}>Hierarquia:</strong> Admin {'>'} Vendedor {'>'} Cliente.
          Apenas o Admin acessa a gestão de usuários.
        </span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {users.map(u => {
          const rm   = ROLE_META[u.role] || ROLE_META.cliente;
          const isMe = u.id === session?.id;
          return (
            <div key={u.id} className="row"
              style={{ background:isMe ? T.goldBg : T.bg2, borderColor:isMe ? T.goldBd : T.bd }}>
              <div style={{ width:44, height:44, borderRadius:"50%", flexShrink:0,
                background:`linear-gradient(145deg,${T.bg4},${T.bg3})`,
                border:`1px solid ${rm.bd}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, fontWeight:700, color:rm.c }}>
                {u.name[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:T.t1,
                  display:"flex", gap:8, alignItems:"center" }}>
                  {u.name}
                  {isMe && (
                    <span style={{ fontSize:10, color:T.goldL, background:T.goldBg,
                      border:`1px solid ${T.goldBd}`, borderRadius:4,
                      padding:"1px 6px", fontWeight:600 }}>você</span>
                  )}
                </div>
                <div style={{ fontSize:12, color:T.t3, marginTop:2 }}>
                  {u.email} · desde {u.createdAt}
                </div>
              </div>
              <span className="pill" style={{ background:rm.bg, border:`1px solid ${rm.bd}`, color:rm.c }}>
                <Ic n={rm.ico} s={11}/> {rm.label}
              </span>
              <button className="icoBtn" onClick={() => editU(u)} title="Editar"><Pencil size={15}/></button>
              <button className="icoBtn danger" onClick={() => delU(u.id)} title="Excluir"><Trash2 size={15}/></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ORDER LIST ───────────────────────────────────────────────────────────────
function OrderList({ orders, products, categories }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
      {orders.map(o => {
        const sm = STATUS_META[o.status] || STATUS_META.pendente;
        return (
          <div key={o.id} className="card" style={{ padding:"18px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ fontFamily:"monospace", fontSize:11, color:T.t3, letterSpacing:1, marginBottom:2 }}>
                  PEDIDO #{o.id.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontSize:12, color:T.t3 }}>{o.createdAt}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span className="pill" style={{ background:sm.bg, border:`1px solid ${sm.bd}`, color:sm.c }}>
                  <Ic n={sm.ico} s={11}/> {sm.label}
                </span>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",
                  fontSize:26, color:T.goldL, fontWeight:600 }}>
                  R$ {o.total.toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {o.items.map(item => {
                const p   = products.find(pr => pr.id === item.productId);
                const cat = p && categories.find(c => c.id === p.categoryId);
                const col = cat?.color || T.t2;
                return p ? (
                  <span key={item.productId} style={{ fontSize:12.5, color:T.t2,
                    background:T.bg3, border:`1px solid ${T.bd}`, borderRadius:8,
                    padding:"4px 11px", display:"flex", alignItems:"center", gap:5 }}>
                    <Ic n={p.icon} s={11} c={col}/> {p.name} ×{item.qty}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
