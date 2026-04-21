import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') });


export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000, 
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};