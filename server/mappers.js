export function mapChild(row) {
  if (!row) return row;

  return {
    id: row.id,
    name: row.name,
    course: row.course,
    garden: row.garden,
    status: row.status,
    statusIcon: row.status_icon,
    snack: row.snack,
    nap: row.nap,
    sleepRating: row.sleep_rating,
    teacherComment: row.teacher_comment,
    activityTitle: row.activity_title,
    activityDescription: row.activity_description,
    updatedAt: row.updated_at,
  };
}
