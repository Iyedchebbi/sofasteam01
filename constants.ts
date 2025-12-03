
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'SofaSteam Deep Clean',
    description: 'The ultimate solution for revitalizing your fabric sofas. Removes deep-set stains and odors instantly.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400',
    category: 'Furniture',
    in_stock: true
  },
  {
    id: '2',
    name: 'Crystal Clear Glass',
    description: 'Streak-free shine for your windows and mirrors. formulated with ammonia-free ingredients.',
    price: 45.50,
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400',
    category: 'Surface',
    in_stock: true
  },
  {
    id: '3',
    name: 'Hardwood Hero',
    description: 'Nourish and protect your wooden floors with our natural beeswax-enriched formula.',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400',
    category: 'Floors',
    in_stock: true
  },
  {
    id: '4',
    name: 'Tile & Grout Power',
    description: 'Blast away mold and grime from bathroom tiles with this heavy-duty eco-friendly cleaner.',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    category: 'Bathroom',
    in_stock: true
  },
];

export const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      contact: 'Contact',
      admin: 'Admin Dashboard',
      login: 'Sign In',
      logout: 'Log Out',
    },
    hero: {
      badge: 'New Formula',
      titleStart: 'Clean Living,',
      titleEnd: 'Simplified.',
      subtitle: 'Discover Romania\'s premium selection of eco-friendly home cleaning products. Powerful on dirt, gentle on your home.',
      ctaPrimary: 'Shop Collection',
      ctaSecondary: 'Read Our Story',
    },
    about: {
      title: 'Why Choose SofaSteam?',
      features: [
        { title: "Eco-Friendly", desc: "Biodegradable ingredients safe for pets and kids." },
        { title: "Premium Quality", desc: "Formulated by experts for maximum cleaning power." },
        { title: "Fast Delivery", desc: "Next-day shipping across all of Romania." }
      ]
    },
    products: {
      title: 'Our Best Sellers',
      subtitle: 'From living room fabrics to kitchen tiles, we have the perfect solution for every surface in your home.',
      addToCart: 'Add to Cart',
      currency: 'RON',
      outOfStock: 'Unavailable',
      hidden: 'Hidden from Store'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Revolutionizing home cleaning in Romania with advanced formulas and eco-conscious practices.',
      address: 'Bulevardul Iuliu Maniu 71, Bucharest',
      copyright: 'All rights reserved.'
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty.',
      startShopping: 'Start Shopping',
      subtotal: 'Subtotal',
      checkout: 'Checkout Now'
    },
    auth: {
      welcomeBack: 'Welcome Back',
      joinUs: 'Join SofaSteam',
      loginDesc: 'Login to manage your cart',
      signupDesc: 'Sign up for exclusive offers',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      switchLogin: "Log in",
      switchSignup: "Sign up"
    },
    profile: {
      title: 'My Profile',
      email: 'Email',
      role: 'Account Type'
    }
  },
  ro: {
    nav: {
      home: 'Acasă',
      about: 'Despre',
      products: 'Produse',
      contact: 'Contact',
      admin: 'Panou Admin',
      login: 'Autentificare',
      logout: 'Deconectare',
    },
    hero: {
      badge: 'Formulă Nouă',
      titleStart: 'Curățenie',
      titleEnd: 'Simplificată.',
      subtitle: 'Descoperă selecția premium de produse de curățenie ecologice din România. Puternice cu murdăria, blânde cu casa ta.',
      ctaPrimary: 'Cumpără Acum',
      ctaSecondary: 'Povestea Noastră',
    },
    about: {
      title: 'De ce SofaSteam?',
      features: [
        { title: "Eco-Friendly", desc: "Ingrediente biodegradabile, sigure pentru animale și copii." },
        { title: "Calitate Premium", desc: "Formulate de experți pentru o putere maximă de curățare." },
        { title: "Livrare Rapidă", desc: "Livrare a doua zi în toată România." }
      ]
    },
    products: {
      title: 'Cele Mai Vândute',
      subtitle: 'De la țesăturile din sufragerie la gresia din bucătărie, avem soluția perfectă pentru fiecare suprafață.',
      addToCart: 'Adaugă în Coș',
      currency: 'RON',
      outOfStock: 'Indisponibil',
      hidden: 'Ascuns din Magazin'
    },
    contact: {
      title: 'Contact',
      subtitle: 'Revoluționăm curățenia în România cu formule avansate și practici ecologice.',
      address: 'Bulevardul Iuliu Maniu 71, București',
      copyright: 'Toate drepturile rezervate.'
    },
    cart: {
      title: 'Coșul Tău',
      empty: 'Coșul tău este gol.',
      startShopping: 'Începe Cumpărăturile',
      subtotal: 'Subtotal',
      checkout: 'Finalizează Comanda'
    },
    auth: {
      welcomeBack: 'Bine ai revenit',
      joinUs: 'Alătură-te SofaSteam',
      loginDesc: 'Autentifică-te pentru a gestiona coșul',
      signupDesc: 'Înscrie-te pentru oferte exclusive',
      email: 'Adresă Email',
      password: 'Parolă',
      signIn: 'Autentificare',
      createAccount: 'Creare Cont',
      noAccount: "Nu ai cont?",
      hasAccount: "Ai deja cont?",
      switchLogin: "Autentificare",
      switchSignup: "Înregistrare"
    },
    profile: {
      title: 'Profilul Meu',
      email: 'Email',
      role: 'Tip Cont'
    }
  }
};
