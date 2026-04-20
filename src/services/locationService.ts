import axios from 'axios';

const LOCATION_API_BASE = 'https://provinces.open-api.vn/api';

export interface Province {
  code: number;
  name: string;
}

export interface District {
  code: number;
  name: string;
}

export interface Ward {
  code: number;
  name: string;
}

export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/p`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

export const getDistricts = async (provinceCode: number): Promise<District[]> => {
  if (!provinceCode) return [];
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/p/${provinceCode}?depth=2`);
    return response.data.districts;
  } catch (error) {
    console.error(`Error fetching districts for province ${provinceCode}:`, error);
    return [];
  }
};

export const getWards = async (districtCode: number): Promise<Ward[]> => {
  if (!districtCode) return [];
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/d/${districtCode}?depth=2`);
    return response.data.wards;
  } catch (error) {
    console.error(`Error fetching wards for district ${districtCode}:`, error);
    return [];
  }
};
