import { ObjectId } from "mongodb";

export class User {

    _id?: ObjectId;
    email: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    password: string;

    constructor(email: string, displayName: string, password: string) {
        this.email = email;
        this.displayName = displayName;
        this.password = password;
    }

}


// User used by the API to not send the password to the caller
export class UserWithoutPassword {

    _id?: ObjectId;
    email: string;
    displayName: string;
    firstName?: string;
    lastName?: string;

    constructor(user: User) {
        this.email = user.email;
        this.displayName = user.displayName;
        if (user._id) { this._id = user._id; }
        if (user.firstName) { this.firstName = user.firstName; }
        if (user.lastName) { this.lastName = user.lastName; }
    }

}
