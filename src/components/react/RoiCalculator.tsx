import React, { useState } from 'react';

export default function RoiCalculator() {
  const [resalePrice, setResalePrice] = useState(50);
  const [selectedPack, setSelectedPack] = useState({ name: 'Pro', credits: 50, cost: 600 });

  const packs = [
    { name: 'Starter', credits: 10, cost: 140 },
    { name: 'Pro', credits: 50, cost: 600 },
    { name: 'VIP', credits: 100, cost: 1000 },
  ];

  const revenue = resalePrice * selectedPack.credits;
  const netProfit = revenue - selectedPack.cost;
  const roi = ((netProfit / selectedPack.cost) * 100).toFixed(0);

  return (
    <div className="glass rounded-xl p-8 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <h3 className="text-2xl font-bold text-white mb-6 font-['Clash_Display'] relative z-10">
        Calculez votre marge nette
      </h3>

      <div className="mb-6 relative z-10">
        <label className="block text-gray-400 text-sm mb-2">Choix de l'investissement</label>
        <select
          className="w-full bg-obsidian border border-white/10 rounded-lg p-3 text-white focus:border-indigo outline-none transition-colors"
          value={selectedPack.name}
          onChange={(e) => setSelectedPack(packs.find(p => p.name === e.target.value) || packs[1])}
        >
          {packs.map(pack => (
            <option key={pack.name} value={pack.name}>
              Pack {pack.name} ({pack.credits} crédits) - {pack.cost}€
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <label className="block text-gray-400 text-sm">Votre prix de revente client :</label>
          <span className="text-white font-bold text-xl">{resalePrice} € <span className="text-sm text-gray-400 font-normal">/ an</span></span>
        </div>
        <input
          type="range"
          min="30"
          max="120"
          step="5"
          value={resalePrice}
          onChange={(e) => setResalePrice(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-coral"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>30€</span>
          <span>120€</span>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Chiffre d'Affaires</span>
          <span className="text-xl text-white font-bold">{revenue} €</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
          <span className="text-emerald font-bold">Bénéfice Net</span>
          <span className="text-2xl text-emerald font-bold">+{netProfit} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Retour sur Investissement</span>
          <span className="text-lg text-indigo font-bold">{roi}%</span>
        </div>
      </div>
    </div>
  );
}