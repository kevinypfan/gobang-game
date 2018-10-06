class User {
    constructor() {
        this.users = []
    }


    get userList() {
        return this.users;
    }
    addUser(id, name) {
        let user = { id, name }
        this.users.push(user);
        return user
    }
    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]
    }

}
const user = new User()
module.exports = user