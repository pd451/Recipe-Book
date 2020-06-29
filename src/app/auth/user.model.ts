export class User {
    constructor(
        public email: string, 
        public password : string, 
        private _token : string, 
        private _tokenExpiration: Date
    ) {}

    get token() {
        if (!this._tokenExpiration || this._tokenExpiration < new Date()) {
            return null;
        }
        return this._token;
    }
}