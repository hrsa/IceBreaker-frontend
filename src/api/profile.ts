import { Profile } from '@/src/types/entities';
import axios from 'axios';
import { getApiClient } from './apiClient';

interface ProfileRequest {
  name: string;
}

export const getProfiles = async (): Promise<Profile[]> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<Profile[]>('/profiles');
    return response.data;
  } catch (error) {
    console.error('Profiles request error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Profile request failed');
    }
    throw error;
  }
};

export const createProfile = async (data: ProfileRequest): Promise<Profile> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<Profile>('/profiles', data);
    return response.data;
  } catch (error) {
    console.error('Profile creation error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Profile creation failed');
    }
    throw error;
  }
};

export const updateProfile = async (profileId: string, data: ProfileRequest): Promise<Profile> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.patch<Profile>(`/profiles/${profileId}`, data);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Profile update failed');
    }
    throw error;
  }
};

export const deleteProfile = async (profileId: string): Promise<boolean> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.delete<boolean>(`/profiles/${profileId}`);
    return response.status === 204;
  } catch (error) {
    console.error('Profile update error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Profile update failed');
    }
    throw error;
  }
};
