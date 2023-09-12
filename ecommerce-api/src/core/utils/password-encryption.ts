import * as bcrypt from "bcrypt";
import getConfig from '../config/configurations'

export function passwordEncrypt(password: string){
    const salt = getConfig().BCRYPT.passwordSalt;
    return bcrypt.hashSync(password, salt);
}


export function comparePassword(password: string, hashPassword: string): Promise<boolean>{
    return bcrypt.compare(password, hashPassword);
}

