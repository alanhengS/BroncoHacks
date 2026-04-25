import { ensureSocketServer } from '../../lib/server/socket';

export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  ensureSocketServer(res);
  res.end();
}
