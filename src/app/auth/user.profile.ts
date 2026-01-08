export interface UserProfile {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    enabled?: boolean;
    emailVerified?: boolean;
    createdTimestamp?: number;
    realmId?: string;

    clientId?: string;
    clientRoles?: string[];

    realmRoles?: string[];
    groups?: string[];
    token?: string;
}