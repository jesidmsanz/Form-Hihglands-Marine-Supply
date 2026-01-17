require('dotenv').config();
const UsersSeeder = require('./users.seeder');

async function runSeeders() {
  console.log(`== [Init runSeeders] ==`);
  const seeders = [UsersSeeder];

  try {
    for (let index = 0; index < seeders.length; index++) {
      const SeedClass = seeders[index];
      const seedInstance = new SeedClass();
      const shouldRun = await seedInstance.shouldRun();

      if (shouldRun) {
        await seedInstance.run();
      }
    }
  } catch (error) {
    console.log(`runSeeders error`, error);
  }
  console.log(`== [End runSeeders] ==`);
  process.exit(0);
}

runSeeders();
