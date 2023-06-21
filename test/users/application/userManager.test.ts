import { UserResponse } from '../../../src/users/domain/userResponseModel';
import { UserRequest } from '../../../src/users/domain/userRequestModel';
import { UserManager } from '../../../src/users/application/userManager';
import MysqlConnection from '../../../src/shared/infrastructure/mysqlConnection';
import { MysqlUserRepository } from '../../../src/users/infrastructure/mysqlRepository/mysqlUserRepository';

jest.mock('../../../src/users/domain/userRequestModel');

jest.mock('../../../src/shared/infrastructure/mysqlConnection');
jest.mock('../../../src/users/infrastructure/mysqlRepository/mysqlUserRepository');


describe("UserManager", () => {
    let userManager: UserManager;

    const mockMysqlConnection = MysqlConnection.getInstance() as jest.Mocked<MysqlConnection>;
    const mockUserRepository = new MysqlUserRepository(mockMysqlConnection) as jest.Mocked<MysqlUserRepository>;

    mockUserRepository.findAll.mockReturnValue([new UserResponse(1, 'admin', true)] as any);
    mockUserRepository.create.mockReturnValue(new UserResponse(2, 'username', false) as any);
    mockUserRepository.findById.mockImplementation((userId): any => {
        if (userId === 1) return new UserResponse(1, 'admin', true);
        return null;
    });
    mockUserRepository.updateById.mockImplementation((userId, user): any => {
        if (userId === 2) return new UserResponse(2, user.username, user.admin);
        return null;
    });
    mockUserRepository.createWithId.mockImplementation((userId, user): any => {
        return new UserResponse(userId, user.username, user.admin);
    });
    mockUserRepository.deleteById.mockReturnValue([new UserResponse(1, 'admin', true)] as any);

    const mockedReturnUserDbRequest = jest.fn().mockReturnValue({
        username: 'username',
        password: 'password',
        admin: false
    });

    (UserRequest as jest.Mock).mockImplementation(() => ({
        returnUserDbRequest: mockedReturnUserDbRequest,
    }));

    beforeEach(() => {
        userManager = new UserManager(mockUserRepository);
    });

    describe("findAllUsers", () => {
        test("should return an user array", async () => {
            const result = await userManager.findUsers();
            expect(result).toBeInstanceOf(Array);
            expect(result!.every((user) => user instanceof UserResponse)).toBe(true);
        });
    });

    describe("createUser", () => {
        test("should return an user if the user information is correct", async () => {

            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            expect(await userManager.createUser(user)).toBeInstanceOf(UserResponse);
            expect(mockedReturnUserDbRequest).toHaveBeenCalled();
        });
    });

    describe("findUserById", () => {
        test("should return the user when a user with that id exists", async () => {
            const existingUserId = 1;
            expect(await userManager.findUserById(existingUserId)).toBeInstanceOf(UserResponse);
        });

        test("should return null when the user does not exist", async () => {
            const nonExistingUserId = 10;
            expect(await userManager.findUserById(nonExistingUserId)).toBeNull();
        });
    });

    describe("updateUserById", () => {
        test("should return the user modified when a user with that id exists", async () => {
            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const existingUserId = 2;
            expect(await userManager.updateUserById(existingUserId, user)).toBeInstanceOf(UserResponse);
            expect(mockedReturnUserDbRequest).toHaveBeenCalled();
        });

        test("should return null when the user does not exist", async () => {
            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const nonExistingUserId = 10;
            expect(await userManager.updateUserById(nonExistingUserId, user)).toBeNull();
            expect(mockedReturnUserDbRequest).toHaveBeenCalled();
        });
    });

    describe("createUserWithId", () => {
        test("should return the user created when a user with the given id", async () => {
            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const userId = 2;
            expect(await userManager.updateUserById(userId, user)).toBeInstanceOf(UserResponse);
            expect(mockedReturnUserDbRequest).toHaveBeenCalled();
        });
    });

    describe("deleteById", () => {
        test("should return null", async () => {
            const userId = 1;
            expect(await userManager.deleteUserById(userId)).toBeNull();
            expect(mockedReturnUserDbRequest).toHaveBeenCalled();
        });
    });
});