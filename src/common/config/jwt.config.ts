import jwt from 'jsonwebtoken';


export class JwtAdapter {

    constructor(private readonly seed: string){}

  static generateToken(
    seed: string,
    payload: any,
    duration: jwt.SignOptions['expiresIn'] = '2h',
  ) {
    return new Promise((resolve) => {
      jwt.sign(payload, seed, { expiresIn: duration }, (error, token) => {
        if (error) return resolve(null);

        return resolve(token);
      });
    });
  }

  static validateToken(token: string, seed: string) {
    return new Promise((resolve) => {
      jwt.verify(token, seed, (error, decoded) => {
        if (error) return resolve(null);

        resolve(decoded);
      });
    });
  }
}
