# 轨迹分析系统

GPS轨迹数据分析与可视化平台前端

## 项目简介

本项目是个人数据分析平台的轨迹分析模块，用于处理和可视化GPS轨迹数据，支持轨迹分类、停留检测、行政区划统计等功能。

## 技术栈

- React 18.2.0 + TypeScript 5.2.2
- Vite 5.0.8 (构建工具)
- Tailwind CSS 3.4.0 (样式框架)
- Ant Design 6.3.0 (UI组件库)
- Mapbox GL JS 3.18.1 (地图渲染)
- ECharts 6.0.0 (图表库)
- React Router 7.13.0 (路由)
- Axios 1.13.5 (HTTP客户端)
- Zustand 5.0.11 (状态管理)

## 数据说明

### 数据来源
- GPS轨迹点数据（Excel格式）
- 包含经纬度、速度、海拔、时间戳等字段
- 过滤条件：stepType=0

### 数据存储
- SQLite数据库（tracks.db）
- 表名：一生足迹
- WAL模式开启

## 核心功能

### 已实现功能

1. **管理后台**
   - 地理编码任务管理（创建、监控、取消）
   - 数据分析任务管理（触发分析链、查看进度）
   - 实时进度跟踪和ETA显示

2. **轨迹地图可视化**
   - 基于Mapbox GL JS的交互式地图
   - 轨迹线渲染（按交通方式着色）
   - 热力图可视化（点密度/时长）
   - 停留点标注（按类别着色和大小）
   - 时间范围筛选
   - 交通方式筛选
   - 图层控制（轨迹/热力图/停留点）

3. **统计分析**
   - 足迹排名（省/市/区县/乡镇/网格）
   - 停留排名（省/市/区县/类别）
   - 极值事件展示（最高海拔、最快速度、空间极值）
   - Top 10 图表可视化（柱状图/饼图）
   - 多维度排序（点数/访问次数/时长/距离）

4. **首页概览**
   - 实时统计数据（总点数、总距离、省份数、城市数）
   - 快速导航入口

### 规划中功能

1. 高级空间分析可视化
2. 时空压缩可视化
3. 空间人格画像展示
4. 数据导出功能（CSV/JSON/KML）
5. 移动端响应式设计

## 项目结构

```
src/
├── pages/                    # 页面组件
│   ├── Admin/               # 管理后台
│   │   ├── GeocodingTasks.tsx
│   │   └── AnalysisTasks.tsx
│   ├── Map/                 # 地图可视化
│   │   └── TrajectoryMap.tsx
│   ├── Statistics/          # 统计分析
│   │   ├── FootprintRankings.tsx
│   │   ├── StayRankings.tsx
│   │   └── ExtremeEvents.tsx
│   └── Home.tsx             # 首页
├── components/              # 可复用组件
│   ├── Layout/              # 布局组件
│   │   └── MainLayout.tsx
│   ├── Map/                 # 地图组件
│   │   ├── MapViewer.tsx
│   │   ├── TrajectoryLayer.tsx
│   │   ├── HeatmapLayer.tsx
│   │   ├── TimeAxisFilter.tsx
│   │   ├── ModeFilter.tsx
│   │   └── StayAnnotation.tsx
│   ├── Charts/              # 图表组件
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   └── LineChart.tsx
│   ├── Statistics/          # 统计组件
│   │   └── RankingTable.tsx
│   └── Admin/               # 管理组件
│       └── TaskStatus.tsx
├── services/                # API服务
│   ├── api.ts
│   ├── trackService.ts
│   ├── statsService.ts
│   └── adminService.ts
├── types/                   # TypeScript类型定义
│   ├── track.ts
│   ├── segment.ts
│   ├── stay.ts
│   ├── trip.ts
│   └── statistics.ts
├── hooks/                   # 自定义Hooks
│   └── useApi.ts
├── utils/                   # 工具函数
│   ├── formatters.ts
│   └── constants.ts
├── App.tsx                  # 应用入口
└── main.tsx                 # 主入口
```

## 运行方式

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 环境变量

创建 `.env` 文件配置环境变量：

```env
# API基础URL
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Mapbox访问令牌（可选，使用默认公共令牌）
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

## API集成

前端通过RESTful API与Go后端通信：

- **基础URL**: `http://localhost:8080/api/v1`
- **管理接口**: `/admin/geocoding/*`, `/admin/analysis/*`
- **轨迹接口**: `/tracks/segments`, `/tracks/stays`, `/tracks/trips`
- **可视化接口**: `/viz/rendering`, `/viz/grid-cells`, `/viz/time-slices`
- **统计接口**: `/stats/footprint/rankings`, `/stats/stay/rankings`, `/stats/extreme-events`

详细API文档见 `go-backend/docs/tracks/api-endpoints.md`

## 部署说明

- 部署路径：record.yzup.top/tracks
- 基础路径配置：/tracks/
- 构建输出：dist/
- 推荐使用nginx反向代理

## 更新日志

### 2026-02-20
- ✅ 完成Phase 6.3: 地图可视化功能
  - 实现MapViewer基础地图组件
  - 实现TrajectoryLayer轨迹渲染
  - 实现HeatmapLayer热力图可视化
  - 实现TimeAxisFilter时间筛选
  - 实现ModeFilter交通方式筛选
  - 实现StayAnnotation停留点标注
- ✅ 完成Phase 6.4: 统计分析功能
  - 实现BarChart/PieChart/LineChart图表组件
  - 实现RankingTable排名表格组件
  - 实现TaskStatus任务状态组件
  - 完善FootprintRankings足迹排名页面
  - 完善StayRankings停留排名页面
  - 完善ExtremeEvents极值事件页面
- ✅ 完成Phase 6.5: 首页优化
  - 首页实时统计数据展示
  - 快速导航链接
  - 响应式布局优化

### 2026-02-19
- ✅ 完成Phase 6.1: 项目基础设施
  - 安装所有依赖包
  - 创建目录结构
  - 配置API集成层
  - 定义TypeScript类型
  - 配置路由系统
  - 创建布局组件
- ✅ 完成Phase 6.2: 管理后台UI
  - 实现地理编码任务管理页面
  - 实现数据分析任务管理页面
  - 实时进度跟踪和自动刷新
  - 任务创建和取消功能
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架
