export class SignUpInfo {
    name: string;
    username: string;
    email: string;
    role: string[];
    password: string;
    tel: number;

    // constructor(name: string, username: string, email: string, password: string) {
    //     this.name = name;
    //     this.username = username;
    //     this.email = email;
    //     this.password = password;
    //     this.role = ['user'];
    // }

    constructor(name: string, username: string, email: string, password: string, tel: number, role: string[]) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.tel = tel;
        this.role = role;
    }
}
