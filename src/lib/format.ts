const dateFmt = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const shortDateFmt = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => dateFmt.format(d);
export const formatShortDate = (d: Date) => shortDateFmt.format(d);

/** ISO yyyy-mm-dd for <time datetime> */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Events are day-granular, so "upcoming" holds until the end of the event day. */
export const isUpcoming = (d: Date, now = new Date()) =>
  d.getTime() + 24 * 60 * 60 * 1000 > now.getTime();
