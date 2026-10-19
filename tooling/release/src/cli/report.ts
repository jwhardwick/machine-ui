// pnpm api:report — regenerate the API and token reports in api/.
import { writeReports } from '../reports.ts';

for (const file of writeReports()) console.log(`wrote api/${file}`);
