import bcrypt from "bcryptjs";
import { ensureDatabase, connectToDatabase, runSchema } from "./dbSetup.js";

export async function autoBootstrap() {
  await ensureDatabase();

  const connection = await connectToDatabase();

  await runSchema(connection);

  const { EDUCADORA_NAME, EDUCADORA_EMAIL, EDUCADORA_PASSWORD } = process.env;

  if (EDUCADORA_NAME && EDUCADORA_EMAIL && EDUCADORA_PASSWORD) {
    const [[existing]] = await connection.query(
      "SELECT id FROM users WHERE role = 'educadora' LIMIT 1"
    );

    if (!existing) {
      const passwordHash = await bcrypt.hash(EDUCADORA_PASSWORD, 10);

      await connection.query(
        "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'educadora')",
        [EDUCADORA_EMAIL.trim().toLowerCase(), passwordHash, EDUCADORA_NAME]
      );

      console.log(`Cuenta de educadora creada automáticamente: ${EDUCADORA_EMAIL}`);
    }
  }

  await connection.end();
}
