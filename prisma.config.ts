import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  // Prisma 7 uses 'schema' as a direct string path
  schema: "prisma/schema.prisma",


  
  


  
  migrate: {
    url: process.env.DATABASE_URL as string,
  },

 
  
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});