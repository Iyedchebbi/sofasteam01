
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Plus, Star, ShieldCheck, Truck, ArrowRight, Instagram, Facebook, Twitter, Globe, Loader2, UserCircle, CheckCircle2, Sparkles, Zap, Leaf, Eye, EyeOff, ImageOff, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, CartItem, User, AuthView, Language } from './types';
import { TRANSLATIONS } from './constants';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './services/supabaseClient';

// Fix for framer-motion type errors
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionSpan = motion.span as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;
const MotionNav = motion.nav as any;

// Asset URLs (Using thumbnail endpoint for reliability)
const ASSETS = {
  // Updated Logo URL
  logo: 'https://drive.google.com/thumbnail?id=1BacA0IQieo9xB9cuIGHNtHGOxtSHYx8A&sz=w1000',
  hero: 'https://drive.google.com/thumbnail?id=1XniVkqDMJrJA5P87LRdx7DsV7qZlNmCa&sz=w1920',
  showcase1: 'https://drive.google.com/thumbnail?id=1cg-dCwF2dw_E2c-59OiYjWQn83hOSkSn&sz=w1000',
  showcase2: 'https://drive.google.com/thumbnail?id=14VD1-6G5lZYAB4YT-C95UC7tSeIGjArW&sz=w1000'
};

// --- Components ---

const AuthModal: React.FC<{
  view: AuthView;
  onClose: () => void;
  onSwitchView: (view: AuthView) => void;
  t: any;
}> = ({ view, onClose, onSwitchView, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setLoading(false);
    setShowPassword(false);
  }, [view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    
    const emailTrimmed = email.trim().toLowerCase();

    // Validation
    if (view === AuthView.SIGNUP) {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }
    }

    try {
      if (view === AuthView.SIGNUP) {
        // Sign Up Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: emailTrimmed,
          password,
          options: {
            data: { full_name: fullName },
          }
        });

        if (signUpError) {
             if (signUpError.message.includes("registered") || signUpError.message.includes("already")) {
                 throw new Error("User already registered");
             }
             throw signUpError;
        }
        
        // Handle User Existing but showing successful (Supabase security feature)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            throw new Error("User already registered");
        }

        if (data.session) {
            setSuccess("Account created! Accessing store...");
            setTimeout(() => onClose(), 1500);
        } else {
             setSuccess("Account created. Please log in.");
             setTimeout(() => {
               onSwitchView(AuthView.LOGIN);
             }, 1500);
        }

      } else {
        // Sign In Flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: emailTrimmed,
          password,
        });
        
        if (signInError) throw signInError;

        setSuccess("Welcome back!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "An error occurred.";
      
      if (msg.includes("Invalid login")) {
          msg = "Incorrect email or password.";
      } else if (msg.includes("User already registered")) {
          msg = "Account already exists. Please log in.";
      }
      
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <MotionDiv 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-20">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {view === AuthView.LOGIN ? t.auth.welcomeBack : t.auth.joinUs}
            </h2>
            <p className="text-gray-500">
                {view === AuthView.LOGIN ? t.auth.loginDesc : t.auth.signupDesc}
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {view === AuthView.SIGNUP && (
            <div>
                <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Full Name"
                    autoComplete="name"
                    className="w-full px-5 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    disabled={loading || !!success}
                />
            </div>
          )}

          <div>
            <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@address.com"
                autoComplete="email"
                className="w-full px-5 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                disabled={loading || !!success}
            />
          </div>
          
          <div className="relative">
             <input 
               type={showPassword ? "text" : "password"} 
               required 
               value={password}
               onChange={e => setPassword(e.target.value)}
               placeholder="Password"
               autoComplete={view === AuthView.LOGIN ? "current-password" : "new-password"}
               className="w-full px-5 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-gray-900 placeholder:text-gray-400 pr-12" 
               disabled={loading || !!success}
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
             >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
             </button>
          </div>

          {view === AuthView.SIGNUP && (
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    className={`w-full px-5 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 ${password && confirmPassword && password !== confirmPassword ? 'focus:ring-red-500 ring-2 ring-red-100' : 'focus:ring-brand-500'} transition-all font-medium text-gray-900 placeholder:text-gray-400`}
                    disabled={loading || !!success}
                />
            </div>
          )}

          <AnimatePresence>
            {error && (
                <MotionDiv initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg">
                {error}
                </MotionDiv>
            )}
            {success && (
                <MotionDiv initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="text-green-600 text-sm font-medium text-center bg-green-50 p-3 rounded-lg flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {success}
                </MotionDiv>
            )}
          </AnimatePresence>
          
          <button 
            type="submit" 
            disabled={loading || !!success}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-brand-500/20 flex justify-center items-center mt-4"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (view === AuthView.LOGIN ? t.auth.signIn : t.auth.createAccount)}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
          <button 
            onClick={() => onSwitchView(view === AuthView.LOGIN ? AuthView.SIGNUP : AuthView.LOGIN)}
            className="hover:text-brand-600 font-semibold transition-colors"
            disabled={loading || !!success}
          >
            {view === AuthView.LOGIN ? "Create an account" : "Log in to existing account"}
          </button>
        </div>
      </MotionDiv>
    </div>
  );
};

const CartSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  t: any;
}> = ({ isOpen, onClose, items, onUpdateQuantity, t }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" 
            onClick={onClose} 
          />
          <MotionDiv 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-gray-900">{t.cart.title}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <ShoppingCart className="w-16 h-16 opacity-20" />
                        <p className="font-medium">{t.cart.empty}</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex gap-4 group">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/e2e8f0/64748b?text=No+Image'; }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                                <p className="text-brand-600 font-bold mt-1">{item.price.toFixed(2)} {t.products.currency}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">-</button>
                                    <span className="font-semibold text-gray-900 w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-medium">{t.cart.subtotal}</span>
                        <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)} {t.products.currency}</span>
                    </div>
                    <button className="w-full bg-brand-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-800 transition-all hover:-translate-y-1">
                        {t.cart.checkout}
                    </button>
                </div>
            )}
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main Application ---

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>(AuthView.NONE);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  const t = TRANSLATIONS[language];

  // Fetch Data
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Fetch products error:", error);
      } else if (data) {
        setProducts(data);
      }
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  // Auth Listener
  useEffect(() => {
    fetchProducts();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
        const metaName = session.user.user_metadata?.full_name;
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: metaName || session.user.email?.split('@')[0] || 'User',
          role: (profile?.role as 'admin' | 'customer') || 'customer'
        });
      } else {
        setUser(null);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Handlers
  const handleAddToCart = (product: Product) => {
    if (!user) {
      setAuthView(AuthView.LOGIN);
      return;
    }
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      return exists 
        ? prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
        : [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 100, behavior: "smooth" });
    }
  };

  // Admin CRUD with Error Handling
  const handleAdminAction = async (action: () => Promise<any>) => {
      try {
        const { error } = await action();
        if (error) {
            throw error;
        }
        await fetchProducts();
      } catch (e: any) {
        console.error("Admin action failed:", e);
        alert(`Operation failed: ${e.message || "Unknown error"}`);
      }
  };

  const displayedProducts = products.filter(p => user?.role === 'admin' || p.in_stock);

  return (
    <div className="min-h-screen bg-brand-50/30 font-sans text-brand-950 selection:bg-brand-200 selection:text-brand-900">
      
      {/* --- Navbar --- */}
      <MotionNav 
        initial={{ y: -100 }} animate={{ y: 0 }}
        className="fixed top-4 left-0 right-0 z-40 px-4 md:px-0"
      >
        <div className="glass max-w-5xl mx-auto rounded-full px-4 py-2 flex items-center justify-between shadow-lg shadow-brand-900/5">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
             {/* Logo Container - Circular White Badge */}
             <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden transition-transform group-hover:scale-105">
                <img src={ASSETS.logo} alt="SofaSteam Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             <span className="text-xl font-extrabold tracking-tight text-brand-900 hidden sm:block">SofaSteam</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['home', 'about', 'products', 'contact'].map(item => (
                <button key={item} onClick={() => scrollToSection(item)} className="text-sm font-semibold text-gray-500 hover:text-brand-600 transition-colors capitalize">
                    {t.nav[item as keyof typeof t.nav]}
                </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setLanguage(l => l === 'en' ? 'ro' : 'en')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-brand-100 transition-colors">
                {language === 'en' ? 'RO' : 'EN'}
             </button>
             
             {user?.role === 'admin' && (
                <button onClick={() => setIsAdminOpen(true)} className="hidden md:flex px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold hover:bg-brand-200">
                    Dashboard
                </button>
             )}

             <div className="h-6 w-px bg-gray-200 mx-1"></div>

             <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cart.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
             </button>

             {user ? (
                <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 pl-2">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                        {user.name[0].toUpperCase()}
                    </div>
                </button>
             ) : (
                <button onClick={() => setAuthView(AuthView.LOGIN)} className="bg-brand-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-brand-800 transition-all shadow-md">
                    {t.nav.login}
                </button>
             )}
          </div>
        </div>
      </MotionNav>

      {/* --- Hero Section --- */}
      <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 animate-blob" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-bold mb-6">
                        <Sparkles className="w-4 h-4" /> {t.hero.badge}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1] text-brand-950 mb-8">
                        Clean <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-500">Redefined.</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
                        {t.hero.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => scrollToSection('products')} className="px-8 py-4 bg-brand-900 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/30 transition-all flex items-center gap-2">
                            {t.hero.ctaPrimary} <ArrowRight className="w-5 h-5" />
                        </button>
                        <button onClick={() => scrollToSection('about')} className="px-8 py-4 bg-white text-brand-950 rounded-2xl font-bold text-lg border border-gray-100 hover:bg-gray-50 transition-all">
                            {t.hero.ctaSecondary}
                        </button>
                    </div>
                    
                    <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-gray-500">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 2,000+ homes</p>
                    </div>
                </MotionDiv>

                <MotionDiv 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-purple-500 rounded-[3rem] opacity-20 rotate-6 blur-2xl"></div>
                        <img 
                            src={ASSETS.hero}
                            alt="Hero Product" 
                            className="relative z-10 w-full h-full object-cover rounded-[3rem] shadow-2xl animate-float"
                            referrerPolicy="no-referrer"
                        />
                        
                        {/* Floating Cards */}
                        <div className="absolute top-10 -right-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Leaf className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Formula</p>
                                <p className="font-bold text-brand-950">100% Eco</p>
                            </div>
                        </div>

                        <div className="absolute bottom-10 -left-8 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-float" style={{ animationDelay: '2.5s' }}>
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Zap className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Action</p>
                                <p className="font-bold text-brand-950">Fast Acting</p>
                            </div>
                        </div>
                    </div>
                </MotionDiv>
            </div>
        </div>
      </section>

      {/* --- About (Bento Grid) --- */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-950 mb-6">{t.about.title}</h2>
                <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.about.features.map((feature: any, i: number) => (
                    <MotionDiv 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-10 rounded-[2.5rem] bg-gray-50 hover:bg-brand-50 transition-colors border border-gray-100 group ${i === 1 ? 'md:bg-brand-900 md:text-white md:hover:bg-brand-800' : ''}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${i === 1 ? 'bg-white/10 text-white' : 'bg-white text-brand-600 shadow-sm'}`}>
                            {i === 0 ? <Leaf /> : i === 1 ? <ShieldCheck /> : <Truck />}
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 ${i === 1 ? 'text-white' : 'text-brand-950'}`}>{feature.title}</h3>
                        <p className={`leading-relaxed ${i === 1 ? 'text-brand-100' : 'text-gray-500'}`}>{feature.desc}</p>
                    </MotionDiv>
                ))}
            </div>
        </div>
      </section>

      {/* --- Showcase Section (New) --- */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-950 skew-y-3 transform origin-bottom-right z-0"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold">Professional Results.<br/>Every Time.</h2>
                    <p className="text-brand-200 text-lg">We don't just sell products; we provide solutions used by professionals. See the difference high-quality, targeted cleaning agents make in real homes.</p>
                    <div className="flex gap-4 pt-4">
                        <img src={ASSETS.showcase1} alt="Before After 1" className="w-full h-64 object-cover rounded-2xl shadow-2xl border-2 border-white/10" referrerPolicy="no-referrer" />
                    </div>
                </div>
                <div className="md:pt-20">
                     <img src={ASSETS.showcase2} alt="Before After 2" className="w-full h-80 object-cover rounded-2xl shadow-2xl border-2 border-white/10" referrerPolicy="no-referrer" />
                </div>
            </div>
        </div>
      </section>

      {/* --- Products --- */}
      <section id="products" className="py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-950 mb-4">{t.products.title}</h2>
                    <p className="text-gray-500 max-w-md">{t.products.subtitle}</p>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600 w-10 h-10" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedProducts.length === 0 ? (
                        <div className="col-span-4 text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                             <p className="text-gray-400 font-medium">No products found.</p>
                             {user?.role === 'admin' && <p className="text-sm text-gray-400 mt-2">Add some from the dashboard.</p>}
                        </div>
                    ) : (
                        displayedProducts.map((product, idx) => (
                            <MotionDiv
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group relative bg-white rounded-[2rem] p-4 pb-6 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-900/10 ${!product.in_stock ? 'opacity-60' : ''}`}
                            >
                                <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 bg-gray-100">
                                    <img 
                                        src={product.image || 'https://placehold.co/400x500/e2e8f0/64748b?text=No+Image'} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/e2e8f0/64748b?text=No+Image'; }}
                                    />
                                    
                                    {!product.in_stock && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">{t.products.outOfStock}</span>
                                        </div>
                                    )}
                                    
                                    {/* Quick Add Button */}
                                    {product.in_stock && (
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-950 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-900 hover:text-white"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>

                                <div className="px-2">
                                    <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">{product.category}</p>
                                    <h3 className="text-lg font-bold text-brand-950 mb-2 leading-tight line-clamp-2 min-h-[3rem]">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xl font-bold text-brand-900">{product.price?.toFixed(2) || '0.00'} <span className="text-sm text-gray-400">{t.products.currency}</span></span>
                                    </div>
                                </div>
                            </MotionDiv>
                        ))
                    )}
                </div>
            )}
        </div>
      </section>

      {/* --- Footer (Re-Designed) --- */}
      <footer id="contact" className="relative bg-[#0B1120] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                {/* Brand Column */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="flex items-center gap-6">
                        {/* Footer Logo - White Background Circle */}
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl overflow-hidden">
                           <img src={ASSETS.logo} alt="SofaSteam" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                             <h3 className="text-4xl font-extrabold tracking-tighter text-white">SofaSteam</h3>
                             <div className="h-1 w-12 bg-brand-500 rounded-full mt-1"></div>
                        </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed max-w-md text-lg">
                        {t.contact.subtitle}
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/sofasteambucuresti/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-white hover:bg-brand-600 hover:border-brand-500 transition-all group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">Instagram</span>
                        </a>
                        <a href="https://wa.me/40745275324" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-white hover:bg-green-600 hover:border-green-500 transition-all group">
                            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">WhatsApp</span>
                        </a>
                    </div>
                </div>

                {/* Navigation Column */}
                <div className="lg:col-span-3 lg:col-start-7">
                    <h4 className="font-bold text-xl mb-8 text-white">Explore</h4>
                    <ul className="space-y-4">
                        {['home', 'about', 'products', 'contact'].map(item => (
                            <li key={item}>
                                <button 
                                    onClick={() => scrollToSection(item)} 
                                    className="text-slate-400 hover:text-brand-400 hover:translate-x-2 transition-all capitalize flex items-center gap-2"
                                >
                                   <div className="w-1.5 h-1.5 rounded-full bg-brand-500 opacity-0 hover:opacity-100 transition-opacity"></div>
                                   {t.nav[item as keyof typeof t.nav]}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info Column */}
                <div className="lg:col-span-3">
                    <h4 className="font-bold text-xl mb-8 text-white">Contact Info</h4>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4 text-slate-400 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-white font-medium mb-1">Headquarters</span>
                                {t.contact.address}
                            </div>
                        </li>
                        <li className="flex items-start gap-4 text-slate-400 group">
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-white font-medium mb-1">Email Us</span>
                                contact@sofasteam.ro
                            </div>
                        </li>
                        <li className="flex items-start gap-4 text-slate-400 group">
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-white font-medium mb-1">Call Us</span>
                                +40 745 275 324
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium">
                <p>&copy; {new Date().getFullYear()} SofaSteam. All rights reserved.</p>
                <div className="flex gap-6">
                    <button className="hover:text-white transition-colors">Privacy Policy</button>
                    <button className="hover:text-white transition-colors">Terms of Service</button>
                </div>
            </div>
        </div>
      </footer>

      {/* --- Floating Action Button (WhatsApp) --- */}
      <a 
        href="https://wa.me/40745275324" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:-translate-y-1 hover:shadow-green-500/30 flex items-center gap-2 font-bold"
      >
        <Phone className="w-6 h-6 fill-current" />
        <span className="hidden md:inline">Chat on WhatsApp</span>
      </a>

      {/* --- Modals --- */}
      <AnimatePresence>
        {authView !== AuthView.NONE && (
            <AuthModal view={authView} onClose={() => setAuthView(AuthView.NONE)} onSwitchView={setAuthView} t={t} />
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={handleUpdateCartQuantity} t={t} />
      
      {isProfileOpen && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsProfileOpen(false)}>
              <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
                   <div className="flex flex-col items-center mb-6">
                       <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-3xl mb-4">{user.name[0].toUpperCase()}</div>
                       <h3 className="text-xl font-bold">{user.name}</h3>
                       <p className="text-gray-500 text-sm">{user.email}</p>
                       <span className="mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase">{user.role}</span>
                   </div>
                   <button onClick={async () => { await supabase.auth.signOut(); setIsProfileOpen(false); setCart([]); }} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                       <LogOut className="w-4 h-4" /> {t.nav.logout}
                   </button>
              </div>
          </div>
      )}

      {isAdminOpen && (
          <AdminPanel 
            products={products} 
            onAddProduct={(p) => handleAdminAction(() => supabase.from('products').insert([{
               name: p.name,
               description: p.description,
               price: p.price,
               image: p.image,
               category: p.category,
               in_stock: p.in_stock
            }]))} 
            onUpdateProduct={(p) => handleAdminAction(() => supabase.from('products').update({
               name: p.name,
               description: p.description,
               price: p.price,
               image: p.image,
               category: p.category,
               in_stock: p.in_stock
            }).eq('id', p.id))}
            onDeleteProduct={async (id) => {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) {
                    alert("Delete failed: " + error.message);
                    return false;
                }
                await fetchProducts();
                return true;
            }}
            onClose={() => setIsAdminOpen(false)} 
          />
      )}
    </div>
  );
};

export default App;
