/**
 * AuthModule Data - 统一数据导出
 * 
 * 集中导出所有数据文件和类型
 */

// #region Countries
export {
  COUNTRIES,
  DEFAULT_COUNTRY,
  HOT_COUNTRIES,
  HOT_COUNTRIES_COUNT,
  TOTAL_COUNTRIES,
  filterCountries,
  findCountryByCode,
  findCountryById,
  getDefaultCountry,
  getFirstLetter,
  getHotCountries,
  getHotCountriesCount,
  getTotalCountries,
  groupCountries,
  isValidCountryCode,
  type Country,
  type CountrySection,
} from './countries';
// #endregion

// 默认导出
export { default } from './countries';

