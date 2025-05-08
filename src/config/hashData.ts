import bcrypt from 'bcrypt';

const saltRounds = 10;

export class HashData {
  public static async hashData(data: string) {
    try {
      const hash = await bcrypt.hash(data, saltRounds);
      console.log('Hashed Password:', hash);
      return hash;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    }
  }

  public static async hashDataPasswordCompare(data: string, password: string) {
    try {
      const isMatch = await bcrypt.compare(data, password);
      console.log('Password Match:', isMatch);
      return isMatch;
    } catch (error) {
      console.error('Error compare password:', error);
      throw error;
    }
  }
}
