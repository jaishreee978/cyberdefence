import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Play, 
  BarChart3, 
  Home, 
  Activity, 
  Terminal as TerminalIcon,
  AlertCircle,
  CheckCircle2,
  Lock,
  Zap,
  Cpu,
  Network,
  Database,
  ChevronRight,
  ArrowRight,
  History
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- TYPES ---
type Page = 'Overview' | 'Control' | 'Analytics';

interface TrainingData {
  episode: number;
  reward: number;
  loss: number;
  resourceUsage: number;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  reward: number;
  stopRate: number;
  episodes: number;
}

// --- COMPONENTS ---

const NavItem = ({ id, icon: Icon, active, onClick }: { id: string, icon: any, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
      ? 'bg-accent-primary/10 text-accent-primary' 
      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : ''}`} />
    <span className="font-semibold tracking-tight">{id}</span>
    {active && (
      <motion.div 
        layoutId="nav-glow"
        className="absolute inset-0 bg-accent-primary/5 rounded-xl blur-md -z-10"
      />
    )}
  </button>
);

const BentoCard = ({ children, title, icon: Icon, className = "", delay = 0 }: { children: React.ReactNode, title?: string, icon?: any, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bento-card group ${className}`}
  >
    {title && (
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-4 h-4 text-accent-primary opacity-70" />}
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">{title}</h3>
      </div>
    )}
    {children}
  </motion.div>
);

const Metric = ({ label, value, trend, color = "text-accent-primary" }: { label: string, value: string | number, trend?: string, color?: string }) => (
  <div className="space-y-1">
    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</div>
    <div className="flex items-baseline gap-2">
      <div className={`text-3xl font-black tracking-tighter ${color}`}>{value}</div>
      {trend && <div className="text-[10px] font-bold text-accent-success">{trend}</div>}
    </div>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [activePage, setActivePage] = useState<Page>('Overview');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [totalEpisodes] = useState(200);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Core initialized. Waiting for command...']);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showResultsBtn, setShowResultsBtn] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Training Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && currentEpisode < totalEpisodes) {
      interval = setInterval(() => {
        setCurrentEpisode(prev => {
          const next = prev + 1;
          const progress = next / totalEpisodes;
          const baseReward = 2 + (Math.log1p(next) * 2.5);
          const noise = (Math.random() - 0.5) * 4;
          const reward = parseFloat((baseReward + noise).toFixed(2));
          const loss = parseFloat((Math.max(0.01, 0.6 - (progress * 0.55))).toFixed(4));
          const resourceUsage = parseFloat((35 + Math.random() * 45).toFixed(1));
          
          setTrainingData(prevData => [...prevData, { episode: next, reward, loss, resourceUsage }]);
          
          if (next % 10 === 0) {
            const events = [
              'Mitigated DDoS Flood', 
              'Blocked Brute Force Attempt', 
              'Detected Stealth Exfiltration', 
              'Policy Optimization Complete',
              'Resource Reallocation Successful'
            ];
            const event = events[Math.floor(Math.random() * events.length)];
            setLogs(prev => [...prev, `[LOG] EPISODE ${next}: ${event} | REWARD: ${reward}`]);
          }
          
          if (next === totalEpisodes) {
            setIsTraining(false);
            const newItem: HistoryItem = {
              id: `ACD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
              timestamp: new Date().toLocaleTimeString(),
              reward: reward,
              stopRate: parseFloat((96 + Math.random() * 3.5).toFixed(1)),
              episodes: totalEpisodes
            };
            setHistory(prev => [newItem, ...prev]);
            setShowResultsBtn(true);
            setLogs(prev => [...prev, '[SUCCESS] Mission Complete. Policy ACD-V2.5 deployed to edge nodes.']);
          }
          
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isTraining, currentEpisode, totalEpisodes]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const startTraining = () => {
    setTrainingData([]);
    setCurrentEpisode(0);
    setIsTraining(true);
    setShowResultsBtn(false);
    setLogs(['[SYSTEM] Initializing Cyber-Defense Environment...', '[SYSTEM] Loading Attack Profiles: [DDoS, BruteForce, Exfil]']);
  };

  return (
    <div className="min-h-screen flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-bg-card border-r border-white/5 p-8 flex flex-col fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
            <Shield className="w-6 h-6 text-accent-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-white">ACD<span className="text-accent-primary">.</span>CORE</h1>
            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.3em]">Cyber Defense RL</div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="Overview" icon={Home} active={activePage === 'Overview'} onClick={() => setActivePage('Overview')} />
          <NavItem id="Control" icon={Activity} active={activePage === 'Control'} onClick={() => setActivePage('Control')} />
          <NavItem id="Analytics" icon={BarChart3} active={activePage === 'Analytics'} onClick={() => setActivePage('Analytics')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Online</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed">
              Agent: DQN-V2.5<br />
              Status: Idle
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activePage === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Zap className="w-3 h-3" />
                  Autonomous Defense Environment
                </div>
                <h2 className="text-6xl font-black tracking-tighter text-white leading-none mb-6">
                  Adaptive Cyber<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Defense System</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                  A high-fidelity reinforcement learning environment designed to train agents in autonomous network defense against multi-vector cyber threats.
                </p>
              </header>

              {/* Bento Grid */}
              <div className="grid grid-cols-12 gap-6">
                <BentoCard title="Environment State" icon={Network} className="col-span-8 h-64">
                  <div className="grid grid-cols-3 gap-8 mt-4">
                    <Metric label="Attack Vectors" value="04" />
                    <Metric label="State Dimensions" value="12" />
                    <Metric label="Action Space" value="08" />
                    <Metric label="Resource Cap" value="100%" color="text-accent-secondary" />
                    <Metric label="Detection Rate" value="98.2%" trend="+2.4%" color="text-accent-success" />
                    <Metric label="False Positives" value="0.8%" trend="-0.2%" color="text-accent-danger" />
                  </div>
                </BentoCard>

                <BentoCard title="Agent Config" icon={Cpu} className="col-span-4 h-64">
                  <div className="space-y-4 mt-2">
                    {[
                      { label: 'Algorithm', val: 'DQN' },
                      { label: 'Network', val: 'Dense [128, 128]' },
                      { label: 'Optimizer', val: 'AdamW' },
                      { label: 'Buffer', val: '20k' }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{item.label}</span>
                        <span className="text-xs font-bold text-white">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard title="Simulated Threats" icon={AlertCircle} className="col-span-4 h-80">
                  <div className="space-y-4 mt-2">
                    {[
                      { name: 'DDoS Flood', risk: 'High', color: 'text-accent-danger' },
                      { name: 'Brute Force', risk: 'Medium', color: 'text-accent-secondary' },
                      { name: 'Exfiltration', risk: 'Critical', color: 'text-accent-danger' },
                      { name: 'Stealth Scan', risk: 'Low', color: 'text-accent-success' }
                    ].map(threat => (
                      <div key={threat.name} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center group/item hover:bg-white/[0.05] transition-colors">
                        <span className="text-xs font-bold text-slate-300">{threat.name}</span>
                        <span className={`text-[8px] font-mono uppercase tracking-widest ${threat.color}`}>{threat.risk}</span>
                      </div>
                    ))}
                  </div>
                </BentoCard>

                <BentoCard title="Reward Function" icon={Database} className="col-span-8 h-80">
                  <div className="mt-4 space-y-6">
                    <div className="bg-bg-main/50 rounded-xl p-6 border border-white/5 font-mono text-xs leading-relaxed">
                      <div className="text-slate-500 mb-2">// Objective: Maximize Security & Efficiency</div>
                      <div className="text-white">
                        R = <span className="text-accent-success">StopBonus</span> × (4 - Stage) + <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(1 - <span className="text-accent-secondary">ResourceUsage</span>) - <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;(<span className="text-accent-danger">FalsePos</span> × 5.0) - (<span className="text-accent-danger">MissedAttack</span> × 20.0)
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      The reward function incentivizes early detection (Stage 1) while penalizing resource overhead and false positives, forcing the agent to learn precise, efficient defense policies.
                    </p>
                  </div>
                </BentoCard>
              </div>
            </motion.div>
          )}

          {activePage === 'Control' && (
            <motion.div
              key="control"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Mission Control</h2>
                  <p className="text-slate-500 text-sm">Execute and monitor autonomous training sessions.</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={startTraining}
                    disabled={isTraining}
                    className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
                      isTraining 
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                      : 'bg-accent-primary text-bg-main hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    {isTraining ? 'Training in Progress...' : 'Initialize Training'}
                  </button>
                  {showResultsBtn && (
                    <button
                      onClick={() => setActivePage('Analytics')}
                      className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3 bg-accent-success/10 text-accent-success border border-accent-success/20 hover:bg-accent-success/20 transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                      View Analytics
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8">
                {/* Main Visualization */}
                <BentoCard title="Live Reward Curve" className="col-span-8 h-[480px]">
                  <div className="h-full w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trainingData}>
                        <defs>
                          <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="episode" hide />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#22d3ee' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="reward" 
                          stroke="#22d3ee" 
                          strokeWidth={3} 
                          fill="url(#glow)" 
                          animationDuration={300}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </BentoCard>

                {/* Right Panel */}
                <div className="col-span-4 space-y-8">
                  <BentoCard title="Real-time Metrics">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Episode</span>
                        <span className="text-2xl font-black text-white">{currentEpisode} <span className="text-slate-600 text-sm">/ {totalEpisodes}</span></span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Resource Usage</span>
                          <span className="text-sm font-bold text-accent-primary">{trainingData.length > 0 ? trainingData[trainingData.length-1].resourceUsage : '0.0'}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-accent-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${trainingData.length > 0 ? trainingData[trainingData.length-1].resourceUsage : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </BentoCard>

                  <BentoCard title="Command Log" icon={TerminalIcon} className="h-[280px]">
                    <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide font-mono text-[10px] space-y-2 pt-2">
                      {logs.map((log, i) => (
                        <div key={i} className={`flex gap-2 ${log.includes('[SUCCESS]') ? 'text-accent-success' : 'text-slate-400'}`}>
                          <span className="text-accent-primary opacity-50">❯</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {isTraining && <div className="w-1.5 h-3 bg-accent-primary animate-pulse inline-block" />}
                    </div>
                  </BentoCard>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === 'Analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Post-Mission Analytics</h2>
                <p className="text-slate-500 text-sm">Detailed performance breakdown and historical data.</p>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <BentoCard>
                  <Metric label="Avg. Stop Rate" value="99.2%" color="text-accent-success" />
                </BentoCard>
                <BentoCard>
                  <Metric label="Avg. Reward" value="14.8" color="text-accent-primary" />
                </BentoCard>
                <BentoCard>
                  <Metric label="False Positives" value="0.4%" color="text-accent-danger" />
                </BentoCard>
                <BentoCard>
                  <Metric label="CPU Efficiency" value="94%" color="text-accent-secondary" />
                </BentoCard>
              </div>

              <div className="grid grid-cols-12 gap-8">
                <BentoCard title="Comparative Performance" className="col-span-12">
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="text-slate-500 border-b border-white/5">
                          <th className="pb-4 font-normal uppercase tracking-widest">Scenario</th>
                          <th className="pb-4 font-normal uppercase tracking-widest">DQN-V2.5</th>
                          <th className="pb-4 font-normal uppercase tracking-widest">Rule-Based</th>
                          <th className="pb-4 font-normal uppercase tracking-widest">Random</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {[
                          { s: 'DDoS Mitigation', d: '99.8%', r: '98.2%', ran: '15%' },
                          { s: 'Exfil Detection', d: '94.2%', r: '42.0%', ran: '02%' },
                          { s: 'Brute Force', d: '98.5%', r: '95.0%', ran: '10%' },
                          { s: 'Resource Overhead', d: '08%', r: '22%', ran: 'N/A' }
                        ].map((row) => (
                          <tr key={row.s} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="py-4 font-bold text-white">{row.s}</td>
                            <td className="py-4 text-accent-primary font-bold">{row.d}</td>
                            <td className="py-4">{row.r}</td>
                            <td className="py-4 opacity-50">{row.ran}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </BentoCard>

                {history.length > 0 && (
                  <BentoCard title="Mission History" icon={History} className="col-span-12">
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-white/5">
                            <th className="pb-4 font-normal uppercase tracking-widest">Mission ID</th>
                            <th className="pb-4 font-normal uppercase tracking-widest">Timestamp</th>
                            <th className="pb-4 font-normal uppercase tracking-widest">Final Reward</th>
                            <th className="pb-4 font-normal uppercase tracking-widest">Stop Rate</th>
                            <th className="pb-4 font-normal uppercase tracking-widest">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300">
                          {history.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 font-bold text-accent-primary">{item.id}</td>
                              <td className="py-4 text-slate-500">{item.timestamp}</td>
                              <td className="py-4 text-white font-bold">{item.reward}</td>
                              <td className="py-4 text-accent-success font-bold">{item.stopRate}%</td>
                              <td className="py-4">
                                <span className="px-2 py-1 rounded-full bg-accent-success/10 text-accent-success text-[8px] font-bold uppercase tracking-widest">Archived</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </BentoCard>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
            ACD.CORE // Autonomous Cyber Defense System
          </div>
          <div className="flex gap-8">
            <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Edge Node: 0x4F2A</div>
            <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Protocol: RL-SEC-V2</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
