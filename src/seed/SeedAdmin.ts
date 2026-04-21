import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import config from '../config';

const adminData = {
  name: 'Super Admin',
  email: 'admin@medistore.com', 
  password: 'admin123password', 
  role: UserRole.ADMIN,
 
};

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(
      adminData.password, 
      Number(config.bcrypt_salt_rounds) || 12
    );

   
    await prisma.user.upsert({
      where: { email: adminData.email },
      update: {}, 
      create: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      },
    });
    // ---------------------------------------

    console.log('✅ Admin seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } 
  
};

export default seedAdmin;