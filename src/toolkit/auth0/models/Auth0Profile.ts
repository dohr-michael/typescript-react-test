export default class Auth0Profile {
    email:string;
    name:string;
    locale:string;
    picture:string;

    // TODO to it with annotation.

    toJson():string {
        return JSON.stringify({
            email: this.email,
            name: this.name,
            locale: this.locale,
            picture: this.picture,
        })
    }

    static fromJson(jsonStr:string):Auth0Profile {
        if(!jsonStr) {
            return null;
        }
        const json = JSON.parse(jsonStr);
        return Auth0Profile.fromJsonObj(json)
    }

    static fromJsonObj(json:any):Auth0Profile {
        if (!json) {
            return null;
        }
        const result = new Auth0Profile();
        result.email = json.email;
        result.name = json.name;
        result.locale = json.locale;
        result.picture = json.picture;
        return result;
    }
}