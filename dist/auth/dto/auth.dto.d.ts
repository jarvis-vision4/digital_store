export declare class RegisterDto {
    username: string;
    email?: string;
    password: string;
    referralCode?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class OAuthDto {
    email: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
}
