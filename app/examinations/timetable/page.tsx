import { redirect } from 'next/navigation';

export default function TimetableRoot() {
  redirect('/examinations/timetable/external');
}
