/**
 * AuthModule API - 统一导出
 * 
 * 导出所有认证相关的API服务
 */

// 认证API
export {
    API_CONFIG, API_ENDPOINTS, authApi, errorHandler, mockAuthApi, retryHandler,
    validator
} from './authApi';

export type {
    ApiResponse, CheckUserExistsRequest,
    CheckUserExistsResponse, LoginRequest,
    LoginResponse, LogoutRequest, RefreshTokenRequest,
    RefreshTokenResponse, SendCodeRequest,
    SendCodeResponse
} from './authApi';

