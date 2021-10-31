import { IUser } from "../../main/IUser";
export declare namespace Login {
    function getAllUsers(): IUser[];
    function selectUserByName(username: string): IUser | false;
    function selectUserByIndex(index: number): IUser | false;
    function loadUser(usr: IUser): void;
}
//# sourceMappingURL=login.d.ts.map