import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Activity, Users, Flame, Dumbbell, Cpu } from 'lucide-react';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } }
};

function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const marqueeText = Array(4).fill("Push Limits . Break Boundaries . Ignite Greatness . ");

  return (
    <div className="home-container">
      
      {/* Epic Hero Section */}
      <section className="hero-epic">
        <motion.div className="hero-epic-bg" style={{ y }} />
        <div className="hero-epic-overlay"></div>

        <div className="hero-content w-100">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="premium-badge mb-3">
              Premium Fitness Experience
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="hero-title-main">
              Forge Your <br />
              <span className="text-gradient">Legacy</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="hero-subtitle">
              Join the elite. Train with world-class equipment, elite coaching, and a community built on relentless progress. 
            </motion.p>
            
            <motion.div variants={fadeUp} className="d-flex gap-3 flex-wrap mt-5">
              <Link to="/register" className="btn-premium" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
                Start Journey <ChevronRight size={22} className="ms-1" />
              </Link>
              <Link to="/machines" className="btn-outline" style={{ padding: '16px 36px', fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.2)' }}>
                View Machines
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Divider */}
      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeText.map((text, i) => (
            <div key={i} className="marquee-item">
              {text} <Activity size={28} className="mx-3" />
            </div>
          ))}
          {marqueeText.map((text, i) => (
            <div key={i + 4} className="marquee-item" aria-hidden="true">
              {text} <Activity size={28} className="mx-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="section-padding position-relative">
        <div className="container">
          <motion.div 
            className="section-header-centered"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="display-title">The GoldFit <span className="text-gradient">Standard</span></h2>
            <p className="text-secondary lead mx-auto" style={{ maxWidth: '600px' }}>We don't do basic. Every square foot is optimized for peak performance.</p>
          </motion.div>

          <div className="row g-4">
            {[
              { icon: <Dumbbell size={32} />, title: 'Pro Equipment', desc: 'Arsenal of hand-picked machines designed for optimal biomechanics and heavy lifting.' },
              { icon: <Users size={32} />, title: 'Elite Trainers', desc: 'Learn from industry veterans who have walked the path and know how to get results.' },
              { icon: <Cpu size={32} />, title: 'AI Fitness Coach', desc: 'Synthesize custom, science-backed workout splits & macronutrient targets using our advanced AI engine.' }
            ].map((feature, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <motion.div 
                  className="feature-glass-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                >
                  <div className="feature-icon-box">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc mb-0">{feature.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Functionalities / How it Works */}
      <section className="section-padding position-relative ecosystem-section">
        <div className="container">
          <motion.div 
            className="section-header-centered"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="display-title">Complete <span className="text-gradient">Ecosystem</span></h2>
            <p className="text-secondary lead mx-auto mb-0" style={{ maxWidth: '600px' }}>Your ultimate fitness hub. Manage your entire gym experience from a single unified portal.</p>
          </motion.div>

          <div className="row g-4 justify-content-center">
            {[
              { num: '01', title: 'Load Wallet & Buy Plans', desc: 'Securely fund your digital wallet to purchase flexible Gym, Diet, or Combo subscription packages instantly.' },
              { num: '02', title: 'Consult Certified Experts', desc: 'Get matched with certified personal coaches and clinical nutritionists who design and manage your progress.' },
              { num: '03', title: 'Live Machine Check-ins', desc: 'Browse the gym floor catalog, check machine occupancy, and check into equipment to secure your workout slot.' },
              { num: '04', title: 'Book 1-on-1 or Group Sessions', desc: 'Schedule private workouts, book clinical diet checks, or join high-energy group fitness classes with one click.' },
              { num: '05', title: 'Instant AI Training Plans', desc: 'Submit your body metrics to get science-backed macronutrient targets, calorie splits, and customized exercises.' }
            ].map((step, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <motion.div 
                  className="ecosystem-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <span className="ecosystem-number">
                    {step.num}
                  </span>
                  <div className="ecosystem-badge">
                    Step {step.num}
                  </div>
                  <h4 className="ecosystem-card-title">{step.title}</h4>
                  <p className="ecosystem-card-desc">{step.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Pathways */}
      <section className="section-padding" style={{ background: 'var(--bg-dark-900)' }}>
        <div className="container">
          <motion.div 
            className="row g-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { title: 'The Arsenal', desc: 'Explore our floor', link: '/machines', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop' },
              { title: 'The Coaches', desc: 'Meet your mentors', link: '/trainers', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop' }
            ].map((path, idx) => (
              <div key={idx} className="col-md-6">
                <motion.div variants={fadeUp}>
                  <Link to={path.link} className="d-block text-decoration-none">
                    <div className="quick-access-card">
                      <img src={path.img} alt={path.title} className="quick-access-img" />
                      <div className="quick-access-overlay">
                        <h3 className="quick-access-title">{path.title}</h3>
                        <p className="quick-access-desc mb-0 d-flex align-items-center">
                          {path.desc} <ChevronRight size={18} className="ms-2 text-accent" />
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="section-padding position-relative text-center" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(255,122,0,0.1) 0%, transparent 60%)', zIndex: 0 }}></div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="display-title mb-4">Ready To <span className="text-gradient">Commit?</span></h2>
            <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '500px' }}>Stop making excuses. Your future self is waiting.</p>
            <Link to="/register" className="btn-premium btn-lg" style={{ padding: '18px 50px', fontSize: '1.2rem' }}>
              Claim Your Spot
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default Home;