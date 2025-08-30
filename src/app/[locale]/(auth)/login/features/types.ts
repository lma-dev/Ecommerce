export interface AuthUser {
    access_token: string
    token_type: string
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at?: string | null;
        account_status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
        role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST' | string;
        provider_name?: string | null;
        provider_id?: string | null;
        provider_username?: string | null;
        created_at: string | null;
        updated_at: string | null;
    }
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}

export interface LoginResponse {
    message: string;
    user: AuthUser;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}