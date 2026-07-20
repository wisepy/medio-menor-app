import "dotenv/config";
import bcrypt from "bcryptjs";
import { ensureDatabase, connectToDatabase, runSchema } from "./dbSetup.js";

async function seed() {
  await ensureDatabase();

  const connection = await connectToDatabase();

  await runSchema(connection);

  const [[{ count }]] = await connection.query(
    "SELECT COUNT(*) AS count FROM users"
  );

  if (count > 0) {
    console.log("La base ya tiene datos, no se vuelve a sembrar.");
    await connection.end();
    return;
  }

  const educadoraHash = await bcrypt.hash("educa1234", 10);
  const apoderadoHash = await bcrypt.hash("demo1234", 10);

  await connection.query(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'educadora')",
    ["educadora@mylittleworld.cl", educadoraHash, "Tía Carolina"]
  );

  const parents = [
    { name: "Juan Aceituno", email: "apoderado@email.com", child: "Nicolás" },
    { name: "María Pérez", email: "maria.perez@email.com", child: "Sofía" },
    { name: "Pedro Soto", email: "pedro.soto@email.com", child: "Martín" },
  ];

  const parentIds = [];

  for (const parent of parents) {
    const [parentResult] = await connection.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'apoderado')",
      [parent.email, apoderadoHash, parent.name]
    );

    const [childResult] = await connection.query(
      `INSERT INTO children (name, status, status_icon, snack, nap, sleep_rating, teacher_comment, activity_title, activity_description)
       VALUES (?, 'Excelente', '⭐', 'Comió toda la colación', 'Durmió 1 hora 25 minutos', '⭐⭐⭐⭐⭐', ?, 'Exploración de colores', 'Trabajamos mezclas de colores utilizando pintura y materiales sensoriales.')`,
      [
        parent.child,
        "Hoy participó muy bien en las actividades musicales y mostró mucho interés por compartir con sus compañeros.",
      ]
    );

    await connection.query(
      "INSERT INTO family_children (parent_user_id, child_id) VALUES (?, ?)",
      [parentResult.insertId, childResult.insertId]
    );

    parentIds.push(parentResult.insertId);
  }

  await connection.query(
    "INSERT INTO directiva_roles (user_id, role) VALUES (?, 'tesorera')",
    [parentIds[1]]
  );

  await connection.query(
    `INSERT INTO announcements (icon, title, text, important) VALUES
     ('📢', 'Reunión de apoderados', 'Se recuerda reunión este jueves a las 18:30 hrs para revisar actividades del mes.', 1),
     ('🎒', 'Traer delantal', 'Para la actividad artística del viernes, cada niño debe traer su delantal marcado.', 0),
     ('🍎', 'Colación saludable', 'Se solicita enviar colación simple, saludable y fácil de manipular.', 0)`
  );

  const currentYear = new Date().getFullYear();

  await connection.query(
    `INSERT INTO events (event_date, title, description, confirm) VALUES
     (?, 'Salida pedagógica', 'Visita educativa al parque.', 1),
     (?, 'Cumpleaños del mes', 'Celebración interna del curso.', 0),
     (?, 'Reunión de apoderados', 'Revisión de actividades y acuerdos.', 0)`,
    [
      `${currentYear}-06-12`,
      `${currentYear}-06-18`,
      `${currentYear}-06-25`,
    ]
  );

  await connection.query(
    `INSERT INTO photos (emoji, title, description, activity, likes) VALUES
     ('🎨', 'Exploración sensorial', 'Hoy los niños trabajaron texturas, colores y coordinación motriz fina mediante una actividad guiada por las educadoras.', 'Actividad de aprendizaje', 18),
     ('🌈', 'Colores', NULL, 'Actividad de aprendizaje', 6),
     ('🧩', 'Motricidad', NULL, 'Actividad de aprendizaje', 4),
     ('🐥', 'Juego libre', NULL, 'Actividad de aprendizaje', 9)`
  );

  await connection.query(
    "INSERT INTO treasury_movements (type, title, detail, amount) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)",
    [
      "income", "Cuota mensual", "Ingreso · Sofía Díaz", 20000,
      "expense", "Decoración actividad", "Gasto · Tesorera", 15500,
      "income", "Aporte voluntario", "Ingreso · Apoderado", 10000,
    ]
  );

  await connection.query(
    "INSERT INTO treasury_fund (name, goal, current) VALUES ('Día del niño', 200000, 150000)"
  );

  const [voteResult] = await connection.query(
    "INSERT INTO votes (title, status, closes_label, active) VALUES ('Regalo educadoras', 'Votación activa', 'Cierra el viernes', 1)"
  );

  await connection.query(
    `INSERT INTO vote_options (vote_id, icon, label) VALUES
     (?, '🎁', 'Giftcard'), (?, '🧺', 'Canasta personalizada'), (?, '📚', 'Libro + flores')`,
    [voteResult.insertId, voteResult.insertId, voteResult.insertId]
  );

  await connection.query(
    "INSERT INTO marketplace_listings (user_id, emoji, title, description, price) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)",
    [
      parentIds[0], "👕", "Uniforme talla 4", "Buen estado", 8000,
      parentIds[1], "🧸", "Juguetes didácticos", "Intercambio o donación", null,
    ]
  );

  await connection.query(
    `INSERT INTO documents (icon, title, subtitle) VALUES
     ('📄', 'Acta reunión de apoderados', 'PDF · Junio'),
     ('📝', 'Autorización salida pedagógica', 'Documento pendiente'),
     ('💰', 'Rendición mensual', 'Archivo de tesorería')`
  );

  await connection.query(
    `INSERT INTO community_posts (user_id, icon, title, text) VALUES
     (NULL, '🎂', 'Cumpleaños del mes', 'Nicolás, Sofía y Martín celebran este mes.'),
     (NULL, '🎁', 'Regalo educadoras', 'La directiva está organizando opciones para votar.'),
     (NULL, '🤝', 'Voluntarios', 'Se necesitan apoderados para apoyar actividades.')`
  );

  await connection.end();

  console.log("Seed completado.");
  console.log("Educadora: educadora@mylittleworld.cl / educa1234");
  console.log("Apoderado: apoderado@email.com / demo1234");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
