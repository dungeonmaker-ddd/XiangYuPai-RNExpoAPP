// #region 1. File Banner & TOC
/**
 * countries.ts - 国家/地区数据文件
 * 
 * 功能描述：
 * - 定义Country接口
 * - 提供14个国家/地区数据
 * - 标记热门地区
 * - 支持按首字母分组
 * - Flutter数据100%迁移
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Types & Interfaces
 * [3] Country Data
 * [4] Helper Functions
 * [5] Exports
 */
// #endregion

// #region 2. Types & Interfaces
/**
 * 国家/地区接口
 */
export interface Country {
  /** 唯一标识 */
  id: string;
  
  /** 中文名称 */
  name: string;
  
  /** 英文名称 */
  nameEn: string;
  
  /** 区号/国际电话代码 */
  code: string;
  
  /** 国旗emoji */
  flag: string;
  
  /** 是否为热门地区 */
  popular?: boolean;
  
  /** 手机号长度（可选） */
  phoneLength?: number;
}

/**
 * 分组后的国家列表接口
 */
export interface CountrySection {
  /** 分组标题（首字母） */
  title: string;
  
  /** 该分组下的国家列表 */
  data: Country[];
}
// #endregion

// #region 3. Country Data
/**
 * 国家/地区数据列表
 * 
 * 包含14个常用国家和地区：
 * - 6个热门地区（中国大陆、香港、台湾、美国、日本、韩国）
 * - 8个其他常用地区
 * 
 * 数据来源：Flutter原版数据
 * 复刻度：100%
 */
export const COUNTRIES: Country[] = [
  // 🔥 热门地区
  {
    id: '1',
    name: '中国大陆',
    nameEn: 'China',
    code: '+86',
    flag: '🇨🇳',
    popular: true,
    phoneLength: 11,
  },
  {
    id: '2',
    name: '中国香港',
    nameEn: 'Hong Kong',
    code: '+852',
    flag: '🇭🇰',
    popular: true,
    phoneLength: 8,
  },
  {
    id: '3',
    name: '中国澳门',
    nameEn: 'Macao',
    code: '+853',
    flag: '🇲🇴',
    popular: false,
    phoneLength: 8,
  },
  {
    id: '4',
    name: '中国台湾',
    nameEn: 'Taiwan',
    code: '+886',
    flag: '🇹🇼',
    popular: true,
    phoneLength: 10,
  },
  {
    id: '5',
    name: '美国',
    nameEn: 'United States',
    code: '+1',
    flag: '🇺🇸',
    popular: true,
    phoneLength: 10,
  },
  {
    id: '6',
    name: '日本',
    nameEn: 'Japan',
    code: '+81',
    flag: '🇯🇵',
    popular: true,
    phoneLength: 11,
  },
  {
    id: '7',
    name: '韩国',
    nameEn: 'South Korea',
    code: '+82',
    flag: '🇰🇷',
    popular: true,
    phoneLength: 11,
  },
  
  // 其他常用地区
  {
    id: '8',
    name: '英国',
    nameEn: 'United Kingdom',
    code: '+44',
    flag: '🇬🇧',
    popular: false,
    phoneLength: 10,
  },
  {
    id: '9',
    name: '法国',
    nameEn: 'France',
    code: '+33',
    flag: '🇫🇷',
    popular: false,
    phoneLength: 9,
  },
  {
    id: '10',
    name: '德国',
    nameEn: 'Germany',
    code: '+49',
    flag: '🇩🇪',
    popular: false,
    phoneLength: 11,
  },
  {
    id: '11',
    name: '澳大利亚',
    nameEn: 'Australia',
    code: '+61',
    flag: '🇦🇺',
    popular: false,
    phoneLength: 9,
  },
  {
    id: '12',
    name: '加拿大',
    nameEn: 'Canada',
    code: '+1',
    flag: '🇨🇦',
    popular: false,
    phoneLength: 10,
  },
  {
    id: '13',
    name: '新加坡',
    nameEn: 'Singapore',
    code: '+65',
    flag: '🇸🇬',
    popular: false,
    phoneLength: 8,
  },
  {
    id: '14',
    name: '马来西亚',
    nameEn: 'Malaysia',
    code: '+60',
    flag: '🇲🇾',
    popular: false,
    phoneLength: 10,
  },
];
// #endregion

// #region 4. Helper Functions
/**
 * 获取首字母
 * 
 * @param nameEn - 英文名称
 * @returns 大写首字母
 * 
 * @example
 * getFirstLetter('China') // 'C'
 * getFirstLetter('United States') // 'U'
 */
export const getFirstLetter = (nameEn: string): string => {
  return nameEn.charAt(0).toUpperCase();
};

/**
 * 按首字母分组国家列表
 * 
 * @param countries - 国家列表
 * @returns 分组后的国家列表
 * 
 * @example
 * groupCountries(COUNTRIES)
 * // [
 * //   { title: 'A', data: [Australia] },
 * //   { title: 'C', data: [China, Canada] },
 * //   ...
 * // ]
 */
export const groupCountries = (countries: Country[]): CountrySection[] => {
  const grouped: Record<string, Country[]> = {};
  
  countries.forEach(country => {
    const letter = getFirstLetter(country.nameEn);
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(country);
  });
  
  // 按字母排序
  const sorted = Object.keys(grouped)
    .sort()
    .map(letter => ({
      title: letter,
      data: grouped[letter],
    }));
  
  return sorted;
};

/**
 * 过滤国家列表
 * 
 * 支持按中文名、英文名、区号搜索
 * 
 * @param countries - 国家列表
 * @param keyword - 搜索关键词
 * @returns 过滤后的国家列表
 * 
 * @example
 * filterCountries(COUNTRIES, '中国')
 * // [中国大陆, 中国香港, 中国澳门, 中国台湾]
 * 
 * filterCountries(COUNTRIES, 'united')
 * // [United States, United Kingdom]
 * 
 * filterCountries(COUNTRIES, '+86')
 * // [中国大陆]
 */
export const filterCountries = (
  countries: Country[],
  keyword: string
): Country[] => {
  if (!keyword) return countries;
  
  const lowerKeyword = keyword.toLowerCase();
  
  return countries.filter(country =>
    country.name.toLowerCase().includes(lowerKeyword) ||
    country.nameEn.toLowerCase().includes(lowerKeyword) ||
    country.code.includes(keyword)
  );
};

/**
 * 获取热门地区列表
 * 
 * @param countries - 国家列表
 * @returns 热门地区列表
 * 
 * @example
 * getHotCountries(COUNTRIES)
 * // [中国大陆, 中国香港, 中国台湾, 美国, 日本, 韩国]
 */
export const getHotCountries = (countries: Country[]): Country[] => {
  return countries.filter(c => c.popular === true);
};

/**
 * 根据区号查找国家
 * 
 * @param countries - 国家列表
 * @param code - 区号
 * @returns 国家对象，未找到返回null
 * 
 * @example
 * findCountryByCode(COUNTRIES, '+86')
 * // { id: '1', name: '中国大陆', ... }
 * 
 * findCountryByCode(COUNTRIES, '+999')
 * // null
 */
export const findCountryByCode = (
  countries: Country[],
  code: string
): Country | null => {
  return countries.find(c => c.code === code) || null;
};

/**
 * 根据ID查找国家
 * 
 * @param countries - 国家列表
 * @param id - 国家ID
 * @returns 国家对象，未找到返回null
 * 
 * @example
 * findCountryById(COUNTRIES, '1')
 * // { id: '1', name: '中国大陆', ... }
 */
export const findCountryById = (
  countries: Country[],
  id: string
): Country | null => {
  return countries.find(c => c.id === id) || null;
};

/**
 * 获取默认国家（中国大陆）
 * 
 * @returns 默认国家对象
 * 
 * @example
 * getDefaultCountry()
 * // { id: '1', name: '中国大陆', code: '+86', ... }
 */
export const getDefaultCountry = (): Country => {
  return COUNTRIES[0]; // 中国大陆
};

/**
 * 验证区号是否存在
 * 
 * @param code - 区号
 * @returns 是否存在
 * 
 * @example
 * isValidCountryCode('+86') // true
 * isValidCountryCode('+999') // false
 */
export const isValidCountryCode = (code: string): boolean => {
  return COUNTRIES.some(c => c.code === code);
};

/**
 * 获取国家总数
 * 
 * @returns 国家总数
 */
export const getTotalCountries = (): number => {
  return COUNTRIES.length;
};

/**
 * 获取热门地区总数
 * 
 * @returns 热门地区总数
 */
export const getHotCountriesCount = (): number => {
  return getHotCountries(COUNTRIES).length;
};
// #endregion

// #region 5. Exports
export default COUNTRIES;

// 导出常量
export const DEFAULT_COUNTRY = getDefaultCountry();
export const HOT_COUNTRIES = getHotCountries(COUNTRIES);
export const TOTAL_COUNTRIES = getTotalCountries();
export const HOT_COUNTRIES_COUNT = getHotCountriesCount();

// 导出类型
export type { Country, CountrySection };
// #endregion

