# 轨迹分析系统 - 前端

GPS轨迹数据分析与可视化平台前端 (React + TypeScript)

## 项目简介

Records轨迹分析系统的前端应用,提供交互式数据可视化、统计分析和任务管理功能。对接Go后端API,展示29个分析技能的结果。

## 最新更新 (2026-02-23)

- ✅ 添加停留类型筛选功能(SPATIAL/ADMIN_AREA/ALL)
- ✅ 创建高级分析页面(速度空间/方向偏好/重访模式/海拔维度)
- ✅ 增强首页仪表板(停留统计/最近任务)
- ✅ 完善API集成(50+端点)

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

### 已实现页面 (9个)

1. **首页仪表板** ✅
   - 6个核心指标(轨迹点/距离/省份/城市/停留次数/停留时长)
   - 最近任务时间线
   - 8个快速导航入口

2. **轨迹地图可视化** ✅
   - 基于Mapbox GL JS的交互式地图
   - 轨迹线渲染（按交通方式着色）
   - 热力图可视化（点密度/时长）
   - 停留点标注（按类别着色和大小）
   - 时间范围筛选
   - 交通方式筛选
   - 图层控制（轨迹/热力图/停留点）

3. **足迹排名** ✅
   - 省/市/区县/类别统计
   - 多维度排序（点数/访问次数/时长/距离）
   - Top 10 图表可视化（柱状图/饼图）
   - 数据导出(CSV/JSON)

4. **停留排名** ✅ (2026-02-23更新)
   - 停留类型筛选(SPATIAL/ADMIN_AREA/ALL)
   - 省/市/区县/类别统计
   - 停留次数和时长排序
   - Top 10 饼图展示

5. **极值事件** ✅
   - 最高海拔、最快速度
   - 空间极值(最东/西/南/北点)
   - 卡片式展示,支持地图定位
   - 数据导出

6. **高级分析** ✅ (2026-02-23新增)
   - 速度空间耦合(高速区域/慢生活区)
   - 方向偏好(主导方向/双向通行)
   - 重访模式(习惯性/周期性/偶尔)
   - 海拔维度(最高/最低/平均/跨度)

7. **数据导入管理** ✅
   - 文件上传（Excel格式）
   - 增量/全量导入模式
   - 去重配置
   - 自动触发分析管道

8. **地理编码任务** ✅
   - 任务创建和监控
   - 实时进度跟踪
   - ETA显示
   - 任务取消

9. **分析任务管理** ✅
   - 触发分析链
   - 查看任务状态
   - 进度跟踪

### 待完善功能

1. 地图可视化增强(停留标注动画、轨迹回放)
2. 更多图表类型(时间序列、散点图)
3. 用户偏好设置
4. 移动端响应式优化

## 项目结构

```
src/
├── pages/                    # 页面组件
│   ├── Admin/               # 管理后台
│   │   ├── DataImport.tsx
│   │   ├── GeocodingTasks.tsx
│   │   └── AnalysisTasks.tsx
│   ├── Map/                 # 地图可视化
│   │   └── TrajectoryMap.tsx
│   ├── Statistics/          # 统计分析
│   │   ├── FootprintRankings.tsx
│   │   ├── StayRankings.tsx
│   │   ├── ExtremeEvents.tsx
│   │   └── AdvancedAnalytics.tsx  # 新增
│   └── Home.tsx             # 首页仪表板
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
│       ├── FileUpload.tsx
│       ├── ImportTaskList.tsx
│       └── TaskStatus.tsx
├── services/                # API服务
│   ├── api.ts
│   ├── trackService.ts
│   ├── statsService.ts
│   ├── adminService.ts
│   └── importService.ts
├── types/                   # TypeScript类型定义
│   ├── track.ts
│   ├── segment.ts
│   ├── stay.ts
│   ├── trip.ts
│   ├── statistics.ts
│   ├── admin.ts
│   └── import.ts
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
- **管理接口**: `/admin/geocoding/*`, `/admin/analysis/*`, `/admin/tracks/import`, `/admin/pipeline/trigger`
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

### 2026-02-23
- ✅ 完成Phase 4: 数据导入界面实现
  - 创建类型定义（import.ts）
  - 实现API服务（importService.ts）
  - 实现FileUpload文件上传组件（支持拖拽、格式验证、配置选项）
  - 实现ImportTaskList任务列表组件（自动刷新、统计展示）
  - 实现DataImport数据导入页面（完整布局、状态管理）
  - 添加路由和菜单项（/admin/import）
  - 支持增量/全量导入模式
  - 支持去重和自动触发分析流水线
  - 实时显示导入进度和统计信息

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

## 更新日志

### 2026-02-23 - 前端功能完善

#### 新增功能

1. **数据导出功能**
   - 支持CSV和JSON两种格式导出
   - 足迹排名、停留排名、极值事件均可导出
   - 自动生成带时间戳的文件名
   - CSV文件添加UTF-8 BOM支持Excel
   - 导出时显示加载提示和成功/失败消息

2. **移动端响应式优化**
   - 导航菜单改为抽屉式（移动端）
   - 表格改为卡片布局（移动端）
   - 响应式调整内边距和字体大小
   - 优化按钮和控件尺寸

3. **错误处理增强**
   - 全局错误边界捕获React错误
   - 友好的错误页面和重试机制
   - 骨架屏加载状态（表格/地图/图表/卡片）
   - 空状态提示组件

4. **图表交互增强**
   - 图表导出为PNG图片（高清2x）
   - 图表数据导出为CSV
   - ECharts内置工具栏（保存图片、区域缩放）
   - 右上角导出下拉菜单

#### 新增文件

- `src/utils/export.ts` - 导出工具函数
- `src/services/exportService.ts` - 导出服务
- `src/hooks/useMediaQuery.ts` - 响应式Hook
- `src/components/ErrorBoundary.tsx` - 错误边界
- `src/components/Loading/Skeleton.tsx` - 骨架屏
- `src/components/Empty/EmptyState.tsx` - 空状态

#### 修改文件

- `src/pages/Statistics/FootprintRankings.tsx` - 添加导出按钮
- `src/pages/Statistics/StayRankings.tsx` - 添加导出按钮
- `src/pages/Statistics/ExtremeEvents.tsx` - 添加导出按钮
- `src/components/Charts/BarChart.tsx` - 增强交互
- `src/components/Charts/PieChart.tsx` - 增强交互
- `src/components/Statistics/RankingTable.tsx` - 响应式优化
- `src/components/Layout/MainLayout.tsx` - 响应式菜单
- `src/App.tsx` - 集成错误边界

#### 技术亮点

- CSV导出添加UTF-8 BOM确保Excel正确识别中文
- 使用媒体查询Hook实现响应式设计
- 移动端优化：抽屉菜单、卡片布局、简化UI
- 图表高清导出（pixelRatio: 2）
- 全局错误边界防止白屏

#### 完成度

- 整体完成度：从70% → 约85%
- 用户体验：显著提升，接近生产级别
