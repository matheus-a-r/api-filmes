import { Document } from 'mongoose';
export interface User extends Document{
    readonly name: string;
    readonly email: string;
    readonly confirmedEmail: boolean;
    readonly password: string;
}