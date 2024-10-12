// authnz.test.ts - Tests for the AuthnzService class

import { AuthnzService } from './authnz';
import { UserDao } from './dao';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { hashSync } from 'bcrypt';

describe('AuthnzService', () => {
    let dao: UserDao;
    let authnz: AuthnzService;

    beforeEach(() => {
        dao = new UserDao(':memory:');
        authnz = new AuthnzService(dao);
    });

    afterEach(() => {
        dao.close();
    });

    it('should register a new user', () => {
        const result = authnz.registerUser('testuser', 'TestPassword1!');
        expect(result.success).toBe(true);
        expect(result.message).toBe('User registered successfully!');
        const user = dao.findUserByUsername('testuser');
        expect(user).toBeDefined();

        const defaultRole = dao.getUserRoles(user!.id)[0]
        expect(defaultRole).toBeTruthy()
        expect(defaultRole.name).toBe("admin")


    });


    it('should assign user role', () => {
        authnz.registerUser('testuser1', 'TestPassword1!');
        const user1 = dao.findUserByUsername('testuser1');

        const registerUser2Result = authnz.registerUser('testuser2', 'TestPassword1!');
        expect(registerUser2Result.success).toBe(true);
        const user2 = dao.findUserByUsername('testuser2');
        expect(user2).toBeDefined();

        const user2Role = dao.getUserRoles(user2!.id)[0]
        expect(user2Role).toBeTruthy()
        expect(user2Role.name).toBe("user")

    });

    it('should reject registration for invalid passwords', () => {
        const result = authnz.registerUser('testuser', 'short'); // Password too short
        expect(result.success).toBe(false);
        expect(result.message).toContain('Password must be at least 8 characters');
    });


    it('should log in a user', () => {
        authnz.registerUser('testuser', 'TestPassword1!');
        const result = authnz.loginUser('testuser', 'TestPassword1!');
        expect(result.success).toBe(true);
        expect(authnz.getAuthenticatedUser()).toBeDefined();
    });

    it('should reject login with incorrect password', () => {
        authnz.registerUser('testuser', 'TestPassword1!');
        const result = authnz.loginUser('testuser', 'wrongpassword');
        expect(result.success).toBe(false);
        expect(result.message).toContain('Incorrect password.');
        expect(authnz.getAuthenticatedUser()).toBeNull();
    });

    it('should log out a user', () => {
        authnz.registerUser('testuser', 'TestPassword1!');
        authnz.loginUser('testuser', 'TestPassword1!');
        authnz.logoutUser();
        expect(authnz.getAuthenticatedUser()).toBeNull();
    });


    it('should increment failed login attempts and lock account', () => {
        authnz.registerUser('testuser', 'TestPassword1!');

        authnz.loginUser('testuser', 'wrongpassword');
        authnz.loginUser('testuser', 'wrongpassword');
        const result = authnz.loginUser('testuser', 'wrongpassword');
        expect(result.success).toBe(false);
        expect(result.message).toBe("Account locked due to too many failed attempts.");
        expect(dao.isAccountLocked(dao.findUserByUsername('testuser')!.id)).toBe(true);

        const lockedLoginResult = authnz.loginUser('testuser', 'TestPassword1!'); // Even with correct password
        expect(lockedLoginResult.success).toBe(false);
        expect(lockedLoginResult.message).toBe('Account is locked. Please contact support.');
    });


    it('should check user roles', () => {
        const { userId } = dao.addUser('testuser', hashSync('password', 10));
        dao.addRole('testrole');
        const role = dao.getRoleByName('testrole');
        if (userId && role) {
            dao.assignRoleToUser(userId, role.id);
            authnz.loginUser('testuser', 'password');
            expect(authnz.checkUserHasRole(userId, 'testrole')).toBe(true);
            expect(authnz.checkUserHasRole(userId, 'nonexistentrole')).toBe(false);
        }
    });




    it('should check if authenticated user matches ID', () => {
      authnz.registerUser('testuser', 'TestPassword1!');
      const user = dao.findUserByUsername('testuser');
      if (user) {
        authnz.loginUser('testuser', 'TestPassword1!');
        expect(authnz.isAuthenticatedUserMatchingId(user.id)).toBe(true);
        expect(authnz.isAuthenticatedUserMatchingId(999)).toBe(false); // Non-existent ID

        authnz.logoutUser();
        expect(authnz.isAuthenticatedUserMatchingId(user.id)).toBe(false); // After logout
      }
    });


    it('should check if authenticated user is admin', () => {
        authnz.registerUser('adminuser', 'AdminPassword1!');
        authnz.loginUser('adminuser', 'AdminPassword1!');
        expect(authnz.isAuthenticatedUserAdmin()).toBe(true); // First user is admin by default
      
        authnz.logoutUser();
        expect(authnz.isAuthenticatedUserAdmin()).toBe(false); // After logout
      
        authnz.registerUser('regularuser', 'RegularPassword1!');
        authnz.loginUser('regularuser', 'RegularPassword1!');
        expect(authnz.isAuthenticatedUserAdmin()).toBe(false); // Second user should not be admin
    });
      


});