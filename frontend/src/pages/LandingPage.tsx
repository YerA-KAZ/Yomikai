import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, User, Lock, Mail, Star, GraduationCap, Languages } from 'lucide-react';
import { authApi } from '../services/api/authApi';

export const LandingPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = isLogin
        ? await authApi.login({ email, password })
        : await authApi.register({ email, password, name });

      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_role', result.user.role);
      navigate('/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Ошибка авторизации');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center relative overflow-hidden font-sans pb-10">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit">
            <Star className="w-5 h-5 fill-primary" />
            <span className="font-bold">Платформа нового поколения</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-text leading-tight">
            Изучай <span className="text-primary">Японский</span><br />
            Легко и Быстро
          </h1>
          
          <p className="text-xl text-text-secondary max-w-lg">
            Ваш персональный путеводитель в мир кандзи, хираганы и японской лексики. Интерактивные уроки, тесты и умный словарь в одном месте.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                <Languages className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text">Кана и Кандзи</h3>
                <p className="text-sm text-text-muted">От N5 до N1</p>
              </div>
            </div>
            
            <div className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 text-accent rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text">Умные уроки</h3>
                <p className="text-sm text-text-muted">Система повторений</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="glass p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-text mb-2">
                {isLogin ? 'С возвращением!' : 'Начни свой путь'}
              </h2>
              <p className="text-text-muted">
                {isLogin ? 'Войдите, чтобы продолжить обучение' : 'Создайте аккаунт и начните изучать язык'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    className="relative"
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Ваше имя" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="w-full bg-surface/50 border border-border/50 text-text rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="Email адрес" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface/50 border border-border/50 text-text rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="Пароль" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface/50 border border-border/50 text-text rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

                            <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? '...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-text-secondary hover:text-primary transition-colors text-sm"
              >
                {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
