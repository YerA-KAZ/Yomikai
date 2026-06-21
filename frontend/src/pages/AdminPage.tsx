import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Search, Trash2, Users, RotateCcw } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'AlexTheStudent', email: 'alex@example.com', xp: 1250, role: 'user' },
  { id: '2', name: 'SakuraFan', email: 'sakura@example.com', xp: 340, role: 'user' },
  { id: '3', name: 'AdminSensei', email: 'admin@yomikai.ru', xp: 9999, role: 'admin' },
];

// This is a simple Admin Panel UI meant to be wired up to the backend later.
export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'kanji' | 'tests' | 'users'>('users');

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 max-w-5xl mx-auto w-full">
      
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text">Профиль Администратора</h1>
          <p className="text-text-secondary">Управление пользователями и контентом приложения</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-surface border border-border/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'dictionary' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Словарь
        </button>
        <button
          onClick={() => setActiveTab('kanji')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'kanji' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Кандзи
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'tests' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Тесты
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}
        >
          Пользователи
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">
            {activeTab === 'dictionary' ? 'Добавить новое слово' : 
             activeTab === 'kanji' ? 'Добавить новый кандзи' : 
             activeTab === 'tests' ? 'Создать вопрос для теста' : 'Управление пользователями'}
          </h2>
          {activeTab !== 'users' && (
            <button className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2">
              <Search className="w-5 h-5" />
              База {activeTab === 'dictionary' ? 'слов' : activeTab === 'kanji' ? 'кандзи' : 'тестов'}
            </button>
          )}
        </div>

        {activeTab === 'dictionary' ? (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Слово (Кандзи/Кана)</label>
              <input type="text" placeholder="Пример: 食べる" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Чтение (Фуригана/Ромадзи)</label>
              <input type="text" placeholder="Пример: たべる" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-secondary">Значение на русском</label>
              <input type="text" placeholder="Пример: есть, кушать" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Часть речи</label>
              <select className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary">
                <option value="verb">Глагол (verb)</option>
                <option value="noun">Существительное (noun)</option>
                <option value="adjective">Прилагательное (adjective)</option>
                <option value="adverb">Наречие (adverb)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Уровень JLPT</label>
              <select className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary">
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </select>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
                <Plus className="w-5 h-5" />
                Сохранить слово в БД
              </button>
            </div>
          </form>
        ) : activeTab === 'kanji' ? (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Иероглиф</label>
              <input type="text" placeholder="Пример: 水" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Значение</label>
              <input type="text" placeholder="Пример: Вода" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Онъёми (китайские чтения)</label>
              <input type="text" placeholder="Пример: スイ (разделять запятой)" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Кунъёми (японские чтения)</label>
              <input type="text" placeholder="Пример: みず (разделять запятой)" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            
            <div className="md:col-span-2 mt-4">
              <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
                <Plus className="w-5 h-5" />
                Сохранить кандзи в БД
              </button>
            </div>
          </form>
        ) : activeTab === 'tests' ? (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Символ (Кандзи или Кана)</label>
              <input type="text" placeholder="Пример: あ или 水" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary">Правильный ответ (на ромадзи)</label>
              <input type="text" placeholder="Пример: a или mizu" className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-secondary">Привязать к уроку/тесту</label>
              <select className="bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary">
                <option value="hiragana_1">Хирагана: Ряд А</option>
                <option value="kanji_n5">Кандзи N5: Природа</option>
                <option value="new">+ Создать новый тест</option>
              </select>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
                <Plus className="w-5 h-5" />
                Добавить вопрос в тест
              </button>
            </div>
          </form>
        ) : activeTab === 'users' ? (
          <div className="flex flex-col gap-4">
            {MOCK_USERS.map((user) => (
              <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-bg border border-border/50 rounded-2xl gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{user.name}</span>
                      {user.role === 'admin' && (
                        <span className="text-[10px] bg-red-500/10 text-red-500 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                      )}
                    </div>
                    <span className="text-sm text-text-secondary">{user.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Опыт</span>
                    <span className="font-black text-emerald-500">{user.xp} XP</span>
                  </div>
                  
                  {user.role !== 'admin' && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`XP пользователя ${user.name} обнулен!`)}
                        className="p-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl transition-colors"
                        title="Обнулить XP"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => alert(`Пользователь ${user.name} удален!`)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors"
                        title="Удалить аккаунт"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default AdminPage;
