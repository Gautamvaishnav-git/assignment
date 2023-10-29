import app from './app';
import { bootstrap } from './app/bootstrap';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  bootstrap();
  console.log('Server is listening on port ' + port);
});
