import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import TrajectoryMap from './pages/Map/TrajectoryMap';
import FootprintRankings from './pages/Statistics/FootprintRankings';
import StayRankings from './pages/Statistics/StayRankings';
import ExtremeEvents from './pages/Statistics/ExtremeEvents';
import GeocodingTasks from './pages/Admin/GeocodingTasks';
import AnalysisTasks from './pages/Admin/AnalysisTasks';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<TrajectoryMap />} />
            <Route path="/stats/footprint" element={<FootprintRankings />} />
            <Route path="/stats/stay" element={<StayRankings />} />
            <Route path="/stats/extreme" element={<ExtremeEvents />} />
            <Route path="/admin/geocoding" element={<GeocodingTasks />} />
            <Route path="/admin/analysis" element={<AnalysisTasks />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
