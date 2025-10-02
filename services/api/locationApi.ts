/**
 * Location API - 位置相关API接口
 */

import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS, buildQueryParams } from './config';

// 坐标信息类型
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
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

// 位置信息类型
export interface LocationInfo {
  city: string;
  district: string;
  address?: string;
  coordinates?: Coordinates;
  accuracy?: string;
  timestamp: number;
}

// 地理编码响应类型
export interface GeocodeResponse {
  address: string;
  city: string;
  district: string;
  province: string;
  coordinates: Coordinates;
  formatted: string;
}

// Location API类
class LocationAPI {
  /**
   * 获取城市列表
   */
  async getCityList(): Promise<ApiResponse<{
    hot: CityInfo[];
    all: CityInfo[];
    provinces: Array<{
      name: string;
      cities: CityInfo[];
    }>;
  }>> {
    return apiClient.get(API_ENDPOINTS.LOCATION.CITIES);
  }

  /**
   * 获取区域列表
   */
  async getDistricts(cityCode: string): Promise<ApiResponse<DistrictInfo[]>> {
    const queryParams = buildQueryParams({ cityCode });
    return apiClient.get<DistrictInfo[]>(`${API_ENDPOINTS.LOCATION.DISTRICTS}?${queryParams}`);
  }

  /**
   * 地理编码（地址转坐标）
   */
  async geocode(address: string): Promise<ApiResponse<GeocodeResponse>> {
    return apiClient.post<GeocodeResponse>(API_ENDPOINTS.LOCATION.GEOCODE, { address });
  }

  /**
   * 逆地理编码（坐标转地址）
   */
  async reverseGeocode(coordinates: Coordinates): Promise<ApiResponse<GeocodeResponse>> {
    return apiClient.post<GeocodeResponse>(API_ENDPOINTS.LOCATION.REVERSE_GEOCODE, coordinates);
  }

  /**
   * 获取当前位置
   */
  async getCurrentLocation(): Promise<ApiResponse<LocationInfo>> {
    return apiClient.get<LocationInfo>(API_ENDPOINTS.LOCATION.CURRENT);
  }

  /**
   * 搜索城市
   */
  async searchCities(query: string): Promise<ApiResponse<CityInfo[]>> {
    const queryParams = buildQueryParams({ q: query });
    return apiClient.get<CityInfo[]>(`/location/cities/search?${queryParams}`);
  }

  /**
   * 计算距离
   */
  async calculateDistance(from: Coordinates, to: Coordinates): Promise<ApiResponse<{
    distance: number; // 单位：米
    duration: number; // 预估时长：秒
    route?: {
      type: 'walking' | 'driving' | 'transit';
      steps: Array<{
        instruction: string;
        distance: number;
        duration: number;
      }>;
    };
  }>> {
    return apiClient.post('/location/distance', { from, to });
  }

  /**
   * 获取附近的兴趣点
   */
  async getNearbyPOI(coordinates: Coordinates, category?: string, radius?: number): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    category: string;
    address: string;
    coordinates: Coordinates;
    distance: number;
    rating?: number;
  }>>> {
    return apiClient.post('/location/nearby', {
      coordinates,
      category,
      radius: radius || 1000,
    });
  }
}

// 创建并导出Location API实例
export const locationApi = new LocationAPI();

// 导出类型
export type {
    CityInfo, Coordinates, DistrictInfo, GeocodeResponse, LocationInfo
};

