import argon2 from 'argon2';

export const Password = {
  hash(plain: string) {
    return argon2.hash(plain);
  },
  verify(hash: string, plain: string) {
    return argon2.verify(hash, plain);
  }
};

