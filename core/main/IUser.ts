export interface IUser {
    username: string,
    password: string | false,
    admin: boolean,
    style: {
        background: string
    }
}
