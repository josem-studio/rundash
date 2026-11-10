import React, { useState } from 'react';
import type { Activity, Goals } from '../types';
import { analyzePerformance } from '../services/coachService';
import { Bot, Send, Sparkles } from 'lucide-react';

interface CoachChatProps {
  activities: Activity[];
  goals: Goals;
}

interface Message {
  id: number;
  text: string;
  sender: 'coach' | 'user';
  type?: 'recommendation' | 'analysis';
}

export const CoachChat: React.FC<CoachChatProps> = ({ activities, goals }) => {
  const analysis = analyzePerformance(activities, goals);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'coach',
      type: 'analysis',
      text: analysis.message,
    },
    ...(analysis.recommendation ? [{
      id: 2,
      sender: 'coach' as const,
      type: 'recommendation' as const,
      text: `Sugerencia del coach: "${analysis.recommendation}". ¿Deseas aplicarla a tu plan?`
    }] : [])
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let replyText = "He revisado tus registros de Strava. Mantén tu plan actual y descansa cuando lo necesites.";

      if (query.includes('kilómetros') || query.includes('km') || query.includes('cuantos')) {
        const total = activities.reduce((acc, a) => acc + a.distance, 0);
        replyText = `Llevas un total de ${total.toFixed(1)} km registrados en tus últimas actividades. Tu ritmo medio es excelente.`;
      } else if (query.includes('descanso') || query.includes('cansado')) {
        replyText = "El descanso es vital para asimilar el entrenamiento. Te sugiero posponer la sesión de intensidad hasta que recuperes la frescura.";
      } else if (query.includes('maratón') || query.includes('carrera')) {
        replyText = "Para preparar una carrera de larga distancia, prioriza la constancia sobre la intensidad en cada sesión individual.";
      }

      const coachMsg: Message = { id: Date.now() + 1, text: replyText, sender: 'coach' };
      setMessages((prev) => [...prev, coachMsg]);
    }, 800);
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-[2rem] flex flex-col h-[520px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111111]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#ff0000]/10 flex items-center justify-center border border-[#ff0000]/30 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            <Sparkles className="text-[#ff0000]" size={24} />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight">SG RUNNING Coach</h3>
            <p className="text-[10px] text-[#ff0000] font-bold uppercase tracking-[0.2em]">Vacila y Corre</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'coach' && (
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-3 mt-1 flex-shrink-0 border border-[#ff0000]/30 shadow-[0_0_10px_rgba(255,0,0,0.2)]">
                <Bot size={16} className="text-[#ff0000]" />
              </div>
            )}
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.sender === 'user'
                ? 'bg-[#ff0000] text-white rounded-tr-none font-medium shadow-[0_4px_20px_rgba(255,0,0,0.3)]'
                : 'bg-[#141414] text-[#cccccc] rounded-tl-none border border-[#221515]'
            }`}>
              {m.text}
              {m.type === 'recommendation' && (
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => alert("¡Propuesta aplicada al calendario!")} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                    Aceptar propuesta
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111111] border-t border-[#1a1a1a]">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregúntale sobre tus km, fatiga o planificación..."
            className="w-full bg-[#0a0a0a] border border-[#222222] rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#ff0000]/50 transition-colors"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 p-2 bg-[#ff0000] text-white rounded-xl hover:bg-[#cc0000] transition-all shadow-lg shadow-[#ff0000]/20"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachChat;
