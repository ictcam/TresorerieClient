export class SignUpInfo {
    // name: string;
    username: string;
    // email: string;
    role: string[];
    password: string;

    // constructor(name: string, username: string, email: string, password: string) {
    //     this.name = name;
    //     this.username = username;
    //     this.email = email;
    //     this.password = password;
    //     this.role = ['user'];
    // }

    constructor( username: string, password: string, role: string[]) {
        // this.name = name;
        this.username = username;
        // this.email = email;
        this.password = password;
        this.role = role;
    }
}
