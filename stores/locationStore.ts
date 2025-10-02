/**
 * Location Store - 位置信息状态管理
 * 使用Zustand实现位置相关状态管理
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSafeStorage } from './storage-config';

// 坐标信息类型
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

// 位置信息类型
export interface LocationInfo {
  city: string;
  district: string;
  address?: string;
  coordinates?: Coordinates;
  accuracy?: string;
  timestamp: number;
}

// 城市信息类型
export interface CityInfo {
  id: string;
  name: string;
  code: string;
  province: string;
  pinyin: string;
  firstLetter: string;
  isHot: boolean;
  districts?: DistrictInfo[];
}

// 区域信息类型
export interface DistrictInfo {
  id: string;
  name: string;
  code: string;
  cityCode: string;
  pinyin: string;
}

// 权限状态类型
export type PermissionStatus = 'pending' | 'granted' | 'denied' | 'restricted';

// 位置权限状态类型
interface PermissionState {
  status: PermissionStatus;
  requestTime: number | null;
  canAskAgain: boolean;
  message?: string;
}

// 城市数据状态类型
interface CityData {
  hot: CityInfo[];
  all: CityInfo[];
  recent: CityInfo[];
  loading: boolean;
  error: string | null;
  lastUpdateTime: number;
}

// Location Store状态类型
interface LocationState {
  // 当前位置
  currentLocation: LocationInfo | null;
  
  // 权限状态
  permission: PermissionState;
  
  // 城市数据
  cities: CityData;
  
  // 定位状态
  locating: boolean;
  locationError: string | null;
  
  // 已选择的城市
  selectedCity: CityInfo | null;
  selectedDistrict: DistrictInfo | null;
  
  // Actions
  requestPermission: () => Promise<PermissionStatus>;
  getCurrentLocation: () => Promise<LocationInfo | null>;
  updateLocation: (location?: LocationInfo) => Promise<void>;
  
  loadCityList: () => Promise<void>;
  searchCities: (query: string) => CityInfo[];
  selectCity: (city: CityInfo) => void;
  selectDistrict: (district: DistrictInfo) => void;
  addRecentCity: (city: CityInfo) => void;
  
  reverseGeocode: (coordinates: Coordinates) => Promise<LocationInfo | null>;
  calculateDistance: (from: Coordinates, to: Coordinates) => number;
  
  resetLocationState: () => void;
}

// 初始状态
const initialState = {
  currentLocation: null,
  permission: {
    status: 'pending' as PermissionStatus,
    requestTime: null,
    canAskAgain: true,
  },
  cities: {
    hot: [],
    all: [],
    recent: [],
    loading: false,
    error: null,
    lastUpdateTime: 0,
  },
  locating: false,
  locationError: null,
  selectedCity: null,
  selectedDistrict: null,
};

// 模拟城市数据
const mockCityData: CityInfo[] = [
  {
    id: 'beijing',
    name: '北京',
    code: '110000',
    province: '北京市',
    pinyin: 'beijing',
    firstLetter: 'B',
    isHot: true,
    districts: [
      { id: 'chaoyang', name: '朝阳区', code: '110105', cityCode: '110000', pinyin: 'chaoyang' },
      { id: 'haidian', name: '海淀区', code: '110108', cityCode: '110000', pinyin: 'haidian' },
      { id: 'dongcheng', name: '东城区', code: '110101', cityCode: '110000', pinyin: 'dongcheng' },
    ],
  },
  {
    id: 'shanghai',
    name: '上海',
    code: '310000',
    province: '上海市',
    pinyin: 'shanghai',
    firstLetter: 'S',
    isHot: true,
    districts: [
      { id: 'huangpu', name: '黄浦区', code: '310101', cityCode: '310000', pinyin: 'huangpu' },
      { id: 'xuhui', name: '徐汇区', code: '310104', cityCode: '310000', pinyin: 'xuhui' },
      { id: 'changning', name: '长宁区', code: '310105', cityCode: '310000', pinyin: 'changning' },
    ],
  },
  {
    id: 'guangzhou',
    name: '广州',
    code: '440100',
    province: '广东省',
    pinyin: 'guangzhou',
    firstLetter: 'G',
    isHot: true,
    districts: [
      { id: 'tianhe', name: '天河区', code: '440106', cityCode: '440100', pinyin: 'tianhe' },
      { id: 'yuexiu', name: '越秀区', code: '440104', cityCode: '440100', pinyin: 'yuexiu' },
      { id: 'haizhu', name: '海珠区', code: '440105', cityCode: '440100', pinyin: 'haizhu' },
    ],
  },
  {
    id: 'shenzhen',
    name: '深圳',
    code: '440300',
    province: '广东省',
    pinyin: 'shenzhen',
    firstLetter: 'S',
    isHot: true,
    districts: [
      { id: 'futian', name: '福田区', code: '440304', cityCode: '440300', pinyin: 'futian' },
      { id: 'nanshan', name: '南山区', code: '440305', cityCode: '440300', pinyin: 'nanshan' },
      { id: 'luohu', name: '罗湖区', code: '440303', cityCode: '440300', pinyin: 'luohu' },
    ],
  },
  {
    id: 'hangzhou',
    name: '杭州',
    code: '330100',
    province: '浙江省',
    pinyin: 'hangzhou',
    firstLetter: 'H',
    isHot: true,
    districts: [
      { id: 'xihu', name: '西湖区', code: '330106', cityCode: '330100', pinyin: 'xihu' },
      { id: 'shangcheng', name: '上城区', code: '330102', cityCode: '330100', pinyin: 'shangcheng' },
      { id: 'xiacheng', name: '下城区', code: '330103', cityCode: '330100', pinyin: 'xiacheng' },
    ],
  },
];

// 计算两点距离的函数（单位：km）
const calculateDistanceHelper = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // 地球半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Location Store实现
export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 请求位置权限
        requestPermission: async (): Promise<PermissionStatus> => {
          try {
            set(prevState => ({
              permission: {
                ...prevState.permission,
                requestTime: Date.now(),
              },
            }));
            
            // TODO: 实际权限请求实现
            // 这里需要根据平台（iOS/Android）调用相应的权限API
            // import * as Location from 'expo-location';
            // const { status } = await Location.requestForegroundPermissionsAsync();
            
            // 模拟权限请求
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockStatus: PermissionStatus = 'granted'; // 模拟授权成功
            
            set(prevState => ({
              permission: {
                ...prevState.permission,
                status: mockStatus,
                canAskAgain: mockStatus === 'granted',
              },
            }));
            
            return mockStatus;
          } catch (error) {
            const status: PermissionStatus = 'denied';
            set(prevState => ({
              permission: {
                ...prevState.permission,
                status,
                message: error instanceof Error ? error.message : '权限请求失败',
              },
            }));
            return status;
          }
        },

        // 获取当前位置
        getCurrentLocation: async (): Promise<LocationInfo | null> => {
          const { permission } = get();
          
          if (permission.status !== 'granted') {
            const newStatus = await get().requestPermission();
            if (newStatus !== 'granted') {
              return null;
            }
          }
          
          set({ locating: true, locationError: null });
          
          try {
            // TODO: 实际定位实现
            // import * as Location from 'expo-location';
            // const location = await Location.getCurrentPositionAsync({
            //   accuracy: Location.Accuracy.High,
            // });
            
            // 模拟定位
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockLocation: LocationInfo = {
              city: '北京',
              district: '朝阳区',
              address: '朝阳区某某街道',
              coordinates: {
                latitude: 39.9042,
                longitude: 116.4074,
                accuracy: 10,
              },
              accuracy: 'high',
              timestamp: Date.now(),
            };
            
            set({ 
              currentLocation: mockLocation,
              locating: false,
            });
            
            return mockLocation;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '定位失败';
            set({ 
              locating: false,
              locationError: errorMessage,
            });
            return null;
          }
        },

        // 更新位置信息
        updateLocation: async (location?: LocationInfo) => {
          if (location) {
            set({ currentLocation: location });
          } else {
            await get().getCurrentLocation();
          }
        },

        // 加载城市列表
        loadCityList: async () => {
          const { cities } = get();
          
          // 检查缓存是否有效（24小时）
          if (cities.all.length > 0 && Date.now() - cities.lastUpdateTime < 24 * 60 * 60 * 1000) {
            return;
          }
          
          set(prevState => ({
            cities: {
              ...prevState.cities,
              loading: true,
              error: null,
            },
          }));
          
          try {
            // TODO: 替换为实际API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const hotCities = mockCityData.filter(city => city.isHot);
            
            set(prevState => ({
              cities: {
                ...prevState.cities,
                hot: hotCities,
                all: mockCityData,
                loading: false,
                lastUpdateTime: Date.now(),
              },
            }));
          } catch (error) {
            set(prevState => ({
              cities: {
                ...prevState.cities,
                loading: false,
                error: error instanceof Error ? error.message : '城市列表加载失败',
              },
            }));
          }
        },

        // 搜索城市
        searchCities: (query: string): CityInfo[] => {
          const { cities } = get();
          if (!query.trim()) return [];
          
          const lowerQuery = query.toLowerCase();
          return cities.all.filter(city => 
            city.name.includes(query) ||
            city.pinyin.includes(lowerQuery) ||
            city.firstLetter.toLowerCase().includes(lowerQuery)
          );
        },

        // 选择城市
        selectCity: (city: CityInfo) => {
          set({ 
            selectedCity: city,
            selectedDistrict: null, // 重置区域选择
          });
          
          // 添加到最近使用
          get().addRecentCity(city);
        },

        // 选择区域
        selectDistrict: (district: DistrictInfo) => {
          set({ selectedDistrict: district });
        },

        // 添加最近使用的城市
        addRecentCity: (city: CityInfo) => {
          set(prevState => {
            const recentCities = prevState.cities.recent.filter(c => c.id !== city.id);
            return {
              cities: {
                ...prevState.cities,
                recent: [city, ...recentCities].slice(0, 10), // 保留最近10个
              },
            };
          });
        },

        // 逆地理编码
        reverseGeocode: async (coordinates: Coordinates): Promise<LocationInfo | null> => {
          try {
            // TODO: 实际逆地理编码实现
            // import * as Location from 'expo-location';
            // const result = await Location.reverseGeocodeAsync(coordinates);
            
            // 模拟逆地理编码
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockResult: LocationInfo = {
              city: '北京',
              district: '朝阳区',
              address: '朝阳区某某街道',
              coordinates,
              accuracy: 'high',
              timestamp: Date.now(),
            };
            
            return mockResult;
          } catch (error) {
            console.error('逆地理编码失败:', error);
            return null;
          }
        },

        // 计算距离
        calculateDistance: (from: Coordinates, to: Coordinates): number => {
          return calculateDistanceHelper(from.latitude, from.longitude, to.latitude, to.longitude);
        },

        // 重置位置状态
        resetLocationState: () => {
          set(initialState);
        },
      }),
      {
        name: 'location-store',
        storage: createSafeStorage(),
        partialize: (state) => ({
          currentLocation: state.currentLocation,
          selectedCity: state.selectedCity,
          selectedDistrict: state.selectedDistrict,
          cities: {
            hot: state.cities.hot,
            all: state.cities.all,
            recent: state.cities.recent,
            lastUpdateTime: state.cities.lastUpdateTime,
          },
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('[LocationStore] 存储恢复成功');
          }
        },
      }
    ),
    {
      name: 'LocationStore',
    }
  )
);

// 选择器函数
export const useCurrentLocation = () => useLocationStore(state => state.currentLocation);
export const useLocationPermission = () => useLocationStore(state => state.permission);
export const useCityData = () => useLocationStore(state => state.cities);
export const useSelectedLocation = () => useLocationStore(state => ({
  city: state.selectedCity,
  district: state.selectedDistrict,
}));
export const useLocationLoading = () => useLocationStore(state => state.locating);
