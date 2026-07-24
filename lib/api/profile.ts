import { post, put, upload } from './client';
import { ENDPOINTS } from './endpoints';

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string; // If supported
}

export async function updateProfile(data: UpdateProfileRequest): Promise<any> {
    return put(ENDPOINTS.ACTORS.ME, data);
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    return upload(ENDPOINTS.ACTORS.AVATAR, file);
}

export async function becomeBusinessOwner(): Promise<any> {
    return post(ENDPOINTS.ACTORS.BECOME_BUSINESS_OWNER);
}
