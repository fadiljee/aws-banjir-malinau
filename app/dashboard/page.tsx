import prisma from "@/lib/prisma";
import SensorChart from "@/components/SensorChart";
import ThemeToggle from "@/components/ThemeToggle";

const SENSOR_CONFIG: any = {
  "WL-001": { name: "Sungai Malinau", location: "Malinau Kota", siaga: 200, waspada: 250, awas: 300 },
  "WL-002": { name: "Sungai Sesayap", location: "Mentarang", siaga: 180, waspada: 230, awas: 280 },
  "WL-003": { name: "Sungai Bahau", location: "Bahau Hulu", siaga: 170, waspada: 220, awas: 270 },
};

const getStatus = (value: number, config: any) => {
  if (value >= config.awas) return { label: "AWAS", color: "bg-red-500", text: "text-red-600", gradient: "from-red-500 to-red-600" };
  if (value >= config.waspada) return { label: "WASPADA", color: "bg-orange-500", text: "text-orange-600", gradient: "from-orange-500 to-orange-600" };
  if (value >= config.siaga) return { label: "SIAGA", color: "bg-yellow-400", text: "text-yellow-600", gradient: "from-yellow-400 to-yellow-500" };
  return { label: "AMAN", color: "bg-emerald-500", text: "text-emerald-600", gradient: "from-emerald-500 to-emerald-600" };
};

export default async function Home() {
  const latestRecord = await prisma.reading.findFirst({ orderBy: { timestamp: 'desc' } });
  const maxDate = latestRecord?.timestamp || new Date();
  const twentyFourHoursAgo = new Date(maxDate.getTime() - 24 * 60 * 60 * 1000);

  const allReadings = await prisma.reading.findMany({
    where: { timestamp: { gte: twentyFourHoursAgo } },
    orderBy: { timestamp: 'asc' },
  });

  const sensors = ["WL-001", "WL-002", "WL-003"];

  const sensorData = sensors.map((id) => {
    const readings = allReadings.filter((r) => r.sensor_id === id);
    const latest = readings[readings.length - 1];
    const previous = readings[readings.length - 2];
    const config = SENSOR_CONFIG[id];
    const status = getStatus(latest?.value || 0, config);
    const isRising = previous ? latest.value > previous.value : false;
    const change = previous ? ((latest.value - previous.value) / previous.value * 100) : 0;
    
    return { id, latest, config, status, readings, isRising, change };
  });

  const criticalSensors = sensorData.filter(s => s.status.label === 'AWAS' || s.status.label === 'WASPADA');
  const activeSensors = sensorData.filter(s => s.latest).length;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-blue-200 dark:shadow-none shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard EWS</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monitoring Ketinggian Air Kabupaten Malinau</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-slate-900 dark:bg-blue-600 rounded-2xl px-5 py-3 text-white">
                <p className="text-[10px] font-bold opacity-60 uppercase">Sensor Aktif</p>
                <p className="text-xl font-bold">{activeSensors}/3</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl px-5 py-3 border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Update Terakhir</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{maxDate.toLocaleTimeString('id-ID')}</p>
              </div>
              <ThemeToggle /> 
            </div>
          </div>
        </div>

        {criticalSensors.length > 0 && (
          <div className="mb-8 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 rounded-2xl p-5 animate-pulse-smooth">
            <div className="flex items-center gap-4">
              <div className="text-red-600 dark:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-red-800 dark:text-red-400 uppercase tracking-wide text-sm">Peringatan Kritis!</h3>
                <p className="text-sm text-red-700 dark:text-red-300/80">
                  {criticalSensors.map(s => s.config.name).join(', ')} dalam kondisi bahaya. Segera pantau lokasi.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {sensorData.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className={`h-2 w-full bg-gradient-to-r ${s.status.gradient}`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{s.config.name}</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{s.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black text-white shadow-sm ${s.status.color}`}>
                    {s.status.label}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className={`text-6xl font-black tracking-tighter ${s.status.text} dark:brightness-125`}>
                    {s.latest?.value.toFixed(1)}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600 font-bold text-xl">cm</span>
                  
                  <div className={`ml-auto flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                    s.isRising ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  }`}>
                    {s.isRising ? 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" /></svg> 
                      : 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" /></svg>
                    }
                    {Math.abs(s.change).toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Siaga</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.config.siaga}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Waspada</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.config.waspada}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Awas</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.config.awas}</p>
                  </div>
                </div>

                <div className="h-[160px] w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
                  <SensorChart 
                    data={s.readings} 
                    color={s.status.label === 'AMAN' ? '#10b981' : (s.status.label === 'SIAGA' ? '#fbbf24' : '#ef4444')} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-slate-400 dark:text-slate-600 text-[11px] font-medium tracking-widest uppercase">
          EWS Banjir Malinau &bull; Data Real-time &bull; Built with Docker & Prisma
        </div>
      </div>
    </main>
  );
}