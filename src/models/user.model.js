export class UserModel  {
    constructor({id, name, email,role,location,skills}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role || 'user';
        this.location = location || 'unknown';
        this.skills = skills || [];
    }
}