import styles from './calendar.module.scss';

/* eslint-disable-next-line */
export interface CalendarProps {}

export function Calendar(props: CalendarProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Calendar!</h1>
    </div>
  );
}

export default Calendar;
