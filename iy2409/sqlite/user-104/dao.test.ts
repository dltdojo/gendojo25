// dao.test.ts - Tests for the UserDao class

import { UserDao, User, userSchema, passwordSchema } from './dao';
import Database from 'libsql';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

describe('UserDao', () => {
    let dao: UserDao;

    beforeEach(() => {
        dao = new UserDao(':memory:');
    });

    afterEach(() => {
        dao.close(); // Close the test database connection
    });

    it('should add a new user', () => {
        const result = dao.addUser('testuser', 'hashedPassword');
        expect(result.success).toBe(true);
        expect(result.userId).toBeGreaterThan(0);

        const user = dao.findUserByUsername('testuser');
        expect(user).toBeDefined();
        expect(user?.username).toBe('testuser');
    });

    it('should handle duplicate usernames', () => {
        dao.addUser('testuser', 'hashedPassword');
        const result = dao.addUser('testuser', 'anotherPassword');
        expect(result.success).toBe(false);
        expect(result.message).toBe('Username already exists');
    });


    it('should update last login', () => {
        dao.addUser('testuser', 'hashedPassword');
        const user = dao.findUserByUsername('testuser');

        if (user) {
            const result = dao.updateLastLogin(user.id);
            expect(result.success).toBe(true);
            const updatedUser = dao.findUserById(user.id);
            expect(updatedUser?.lastLogin).toBeDefined();
        } else {
            // Handle the case where the user isn't found (shouldn't happen in this test, but good practice)
            expect(user).toBeDefined(); // Will fail the test
        }
    });

    it('should find a user by ID', () => {
        const result = dao.addUser('testuser', 'hashedPassword');
        if (result.success) {
            const user = dao.findUserById(result.userId!);
            expect(user).toBeDefined();
            expect(user?.username).toBe('testuser');
        }
    });


    it('should update the updatedAt field', async () => {
        const { userId } = dao.addUser('testuser', 'hashedPassword');
        expect(userId).toBeTruthy();
        if (userId) {
            const userBeforeUpdate = dao.findUserById(userId);
            expect(userBeforeUpdate).toBeDefined();
            console.log(JSON.stringify(userBeforeUpdate))
            await delay(1000);
            dao.updateUserPassword(userId, 'newHashedPassword');
            const userAfterUpdate = dao.findUserById(userId);
            expect(userAfterUpdate).toBeDefined();
            console.log(JSON.stringify(userAfterUpdate))
            expect(userAfterUpdate?.updatedAt?.getTime()).toBeGreaterThan(userBeforeUpdate?.updatedAt?.getTime());
        }
    });


    it('should increment and reset failed login attempts', () => {
        const { userId } = dao.addUser('testuser', 'password');
        expect(userId).toBeTruthy();
        if (userId) {
            expect(dao.incrementFailedLoginAttempts(userId).success).toBe(true);
            let user = dao.findUserById(userId);
            expect(user!.failedLoginAttempts).toBe(1);

            expect(dao.incrementFailedLoginAttempts(userId).success).toBe(true);
            user = dao.findUserById(userId);
            expect(user!.failedLoginAttempts).toBe(2);

            expect(dao.resetFailedLoginAttempts(userId).success).toBe(true);
            user = dao.findUserById(userId);
            expect(user!.failedLoginAttempts).toBe(0);
        }
    });

    it('should check if account is locked', () => {
        const { userId } = dao.addUser('testuser', 'password');
        expect(userId).toBeTruthy();
        if (userId) {
            expect(dao.isAccountLocked(userId)).toBe(false);
            dao.incrementFailedLoginAttempts(userId);
            dao.incrementFailedLoginAttempts(userId);
            dao.incrementFailedLoginAttempts(userId);
            expect(dao.isAccountLocked(userId)).toBe(true);
        }
    });

    it('should add and get roles', () => {
        let result = dao.addRole('testrole');
        expect(result.success).toBe(true);

        result = dao.addRole('testrole2'); // Add another role
        expect(result.success).toBe(true);

        const role = dao.getRoleByName('testrole');
        expect(role).toBeDefined();
        expect(role?.name).toBe('testrole');
    });

    it('should assign and retrieve user roles', () => {
        const { userId } = dao.addUser('testuser', 'password');
        dao.addRole('testrole'); // Assuming 'testrole' doesn't already exist
        const role = dao.getRoleByName('testrole');
        expect(role).toBeDefined();
        if (userId && role) {
            const assignResult = dao.assignRoleToUser(userId, role.id);
            expect(assignResult.success).toBe(true);
            const userRoles = dao.getUserRoles(userId);
            expect(userRoles.length).toBe(1);
            expect(userRoles[0].name).toBe('testrole');


            // Test assigning duplicate role
            const duplicateAssignResult = dao.assignRoleToUser(userId, role.id);
            expect(duplicateAssignResult.success).toBe(false);
            expect(duplicateAssignResult.message).toBe('User already has this role');


            // Add another role and assign it to the user
            dao.addRole('testrole2');
            const role2 = dao.getRoleByName('testrole2');
            if (role2) {
                dao.assignRoleToUser(userId, role2.id);
                const updatedUserRoles = dao.getUserRoles(userId);
                expect(updatedUserRoles.length).toBe(2); // User now has two roles
                expect(updatedUserRoles.some(r => r.name === 'testrole')).toBe(true);
                expect(updatedUserRoles.some(r => r.name === 'testrole2')).toBe(true);

            }

        }
    });

    it('should find users by username like', () => {
        dao.addUser('testuser1', 'password');
        dao.addUser('testuser2', 'password');
        dao.addUser('anotheruser', 'password');
        const users = dao.findUsersByUsernameLike('testuser');
        expect(users.length).toBe(2);
        expect(users.some((user) => user.username === 'testuser1')).toBe(true);
        expect(users.some((user) => user.username === 'testuser2')).toBe(true);

        // Empty result case
        const emptyResult = dao.findUsersByUsernameLike('nonexistent');
        expect(emptyResult.length).toBe(0);

    });

    it('should validate password using passwordSchema', () => {
        const validPassword = 'ValidPassword123!';
        const invalidPassword = 'short';

        const validResult = passwordSchema.safeParse(validPassword);
        expect(validResult.success).toBe(true);

        const invalidResult = passwordSchema.safeParse(invalidPassword);
        expect(invalidResult.success).toBe(false);
        if (!invalidResult.success) {
            expect(invalidResult.error.issues[0].message).toBe('Password must be at least 8 characters');
        }
    });

});