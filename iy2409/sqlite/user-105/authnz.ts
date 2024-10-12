import { hashSync, compareSync } from 'bcrypt';
import { UserDao } from './dao.ts';
import type { User } from './dao.ts';
import { passwordSchema } from './dao.ts';

const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes session timeout

type AuthenticationResult = {
    success: boolean;
    message?: string;
};

type UpdateAttemptsResult = {
    success: boolean;
    failedAttempts?: number;
    message?: string;
};

export class AuthnzService {
    private authenticatedUser: User | null = null;
    private sessionTimeout: NodeJS.Timeout | undefined;
    private dao: UserDao;

    constructor(dao: UserDao) {
        this.dao = dao;
    }

    getAuthenticatedUser(): User | null {
        return this.authenticatedUser;
    }

    checkUserHasRole(userId: number, roleName: string): boolean {
        const roles = this.dao.getUserRoles(userId);
        return roles.some(role => role.name === roleName);
    }

    isAuthenticatedUserMatchingId(userId: number): boolean {
        return this.authenticatedUser?.id == userId;
    }

    isAuthenticatedUserAdmin(): boolean {
        return this.authenticatedUser != null && this.checkUserHasRole(this.authenticatedUser.id, 'admin');
    }

    loginUser(username: string, password: string): AuthenticationResult {
        const user = this.dao.findUserByUsername(username);
        if (user) {
            const isAccountLocked = this.dao.isAccountLocked(user.id);
            if (isAccountLocked) {
                return { success: false, message: "Account is locked. Please contact support." };
            }
            if (compareSync(password, user.passwordHash)) {
                this.authenticatedUser = user;
                this.dao.updateLastLogin(user.id);
                this.startSessionTimeout();
                this.dao.resetFailedLoginAttempts(user.id);
                return { success: true };
            } else {
                const updateResult: UpdateAttemptsResult = this.dao.incrementFailedLoginAttempts(user.id);
                if (updateResult.success) {
                    if (updateResult.failedAttempts && updateResult.failedAttempts >= 3) {
                        return { success: false, message: "Account locked due to too many failed attempts." };
                    }
                    return { success: false, message: `Incorrect password. Failed attempts: ${updateResult.failedAttempts}` };
                } else {
                    return { success: false, message: `Error updating failed login attempts: ${updateResult.message}` };
                }
            }
        } else {
            return { success: false, message: 'User not found.' };
        }
    }

    registerUser(username: string, password: string): AuthenticationResult {
        const validationResult = passwordSchema.safeParse(password);
        if (!validationResult.success) {
            return { success: false, message: validationResult.error.errors.map(e => e.message).join('\n') };
        }

        const passwordHash = hashSync(password, 10);
        const result = this.dao.addUser(username, passwordHash);

        if (result.success) {
            const newUser = this.dao.findUserByUsername(username);
            if (newUser) {
                const users = this.dao.getAllUsers();
                const roleName = users.length === 1 ? 'admin' : 'user';
                const role = this.dao.getRoleByName(roleName);

                if (role) {
                    this.dao.assignRoleToUser(newUser.id, role.id);
                } else {
                    console.error(`${roleName} role not found. This should not happen.`);
                    return { success: false, message: `${roleName} role not found.` };
                }
            }
            return { success: true, message: 'User registered successfully!' };
        } else {
            return { success: false, message: result.message };
        }
    }

    logoutUser(): void {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = undefined;
        this.authenticatedUser = null;
    }

    private startSessionTimeout(): void {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = setTimeout(() => {
            this.logoutUser();
        }, SESSION_TIMEOUT_MS);
    }

    resetSessionTimeout(): void {
        if (this.authenticatedUser) {
            this.startSessionTimeout();
        }
    }
}