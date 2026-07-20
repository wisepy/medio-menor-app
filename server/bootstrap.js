import "dotenv/config";
import bcrypt from "bcryptjs";
import { ensureDatabase, connectToDatabase, runSchema } from "./dbSetup.js";

async function bootstrap() {
  const name = process.env.EDUCADORA_NAME;
  const email = process.env.EDUCADORA_EMAIL;
  const password = process.env.EDUCADORA_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      "Faltan variables. Uso:\n" +
        '  EDUCADORA_NAME="Tía Carolina" EDUCADORA_EMAIL="carolina@tudominio.cl" EDUCADORA_PASSWORD="claveSegura123" node bootstrap.js'
    );
    process.exit(1);
  }

  await ensureDatabase();

  const connection = await connectToDatabase();

  await runSchema(connection);

  const [[existing]] = await connection.query(
    "SELECT id FROM users WHERE role = 'educadora' LIMIT 1"
  );

  if (existing) {
    console.log("Ya existe una cuenta de educadora, no se crea otra.");
    await connection.end();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await connection.query(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'educadora')",
    [email.trim().toLowerCase(), passwordHash, name]
  );

  await connection.end();

  console.log(`Cuenta de educadora creada: ${email}`);
  console.log("Ya puedes iniciar sesión y agregar familias reales desde el panel.");
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
