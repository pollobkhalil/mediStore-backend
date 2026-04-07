import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';




let server: Server;

async function main() {
  try {
    
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    await prisma.$disconnect(); // কানেকশন ফেইল করলে ডিসকানেক্ট করা
    process.exit(1);
  }
}

main();

// --- Graceful Handling & DB Disconnect ---

const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);
  
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      
      
      try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected safely.');
      } catch (dbErr) {
        console.error('Error during DB disconnection:', dbErr);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Unhandled Rejection (Async errors)
process.on('unhandledRejection', (error) => {
  console.error('🌊 Unhandled Rejection detected:', error);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Uncaught Exception (Sync errors)
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception detected:', error);
 
  prisma.$disconnect().finally(() => process.exit(1));
});

// Termination Signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));