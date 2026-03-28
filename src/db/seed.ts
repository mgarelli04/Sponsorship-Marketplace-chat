/**
 * Script que rellena las tablas master de la base de datos
 * npm run db:seed
 */

async function seed() {
  
}

seed().catch((error) => {
  console.error('Fallo en el seed:', error);
  process.exit(1);
});
