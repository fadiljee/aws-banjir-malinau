import prisma from '@/lib/prisma';
import SensorChart from '@/components/SensorChart';

const thresholds = {
  'WL-001': { siaga: 200, waspada: 250, awas: 300 },
  'WL-002': { siaga: 180, waspada: 230, awas: 280 },
  'WL-003': { siaga: 170, waspada: 220, awas: 270 },
};

function getStatus(sensorId: string, value: number) {
  const t = thresholds[sensorId as keyof typeof thresholds];
  if (value >= t.awas) return { status: 'AWAS', badge: 'bg-red-100 text-red-800 border-red-500', outline: 'ring-4 ring-red-500 shadow-red-200' };
  if (value >= t.waspada) return { status: 'WASPADA', badge: 'bg-orange-100 text-orange-800 border-orange-500', outline: 'ring-4 ring-orange-400 shadow-orange-200' };
  if (value >= t.siaga) return { status: 'SIAGA', badge: 'bg-blue-100 text-blue-800 border-blue-500', outline: 'border-gray-200' };
  return { status: 'AMAN', badge: 'bg-green-100 text-green-800 border-green-500', outline: 'border-gray-200' };
}

export default async function Home() {
  const sensors = ['WL-001', 'WL-002', 'WL-003'];

  const latestRecord = await prisma.reading.findFirst({ orderBy: { timestamp: 'desc' } });
  const maxDate = latestRecord?.timestamp || new Date();
  const twentyFourHoursAgo = new Date(maxDate.getTime() - 24 * 60 * 60 * 1000);
  const dashboardData = await Promise.all(sensors.map(async (id) => {
    const latest = await prisma.reading.findFirst({
      where: { sensor_id: id },
      orderBy: { timestamp: 'desc' }
    });

    const history = await prisma.reading.findMany({
      where: {
        sensor_id: id,
        timestamp: { gte: twentyFourHoursAgo }
      },
      orderBy: { timestamp: 'asc' }
    });

    return {
      id,
      latest,
      history: history.map(h => ({ ...h, timestamp: h.timestamp.toISOString() })) 
    };
  }));

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EWS Banjir Malinau</h1>
          <p className="text-gray-500 mt-2">Live Monitoring System - 24 Jam Terakhir</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {dashboardData.map((sensor) => {
            const currentVal = sensor.latest?.value || 0;
            const { status, badge, outline } = getStatus(sensor.id, currentVal);

            return (
              <div 
                key={sensor.id} 
                className={`bg-white rounded-2xl border-2 p-6 shadow-lg transition-all duration-300 ${outline}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{sensor.id}</h2>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badge}`}>
                    {status}
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Water Level Terkini</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-gray-900">{currentVal.toFixed(2)}</span>
                    <span className="text-lg font-semibold text-gray-500">cm</span>
                  </div>
                </div>

                <SensorChart 
                  data={sensor.history} 
                  threshold={thresholds[sensor.id as keyof typeof thresholds]} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}