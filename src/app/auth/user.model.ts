export class User {
  constructor(
    public email:string,
    public lastLogin: Date,
    public token: string,
    public expiresIn: number,
    public uid: string,
  ) {}
}
