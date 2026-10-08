// Dijalankan sebelum dev/build. React Router 8 dan supabase-js (WebSocket bawaan
// Node) butuh Node >= 22.22; di versi lama error-nya membingungkan, jadi stop di sini.
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 22)) {
  console.error(`\n✖ Node ${process.versions.node} terdeteksi, project ini butuh Node >= 22.22 (lihat .nvmrc).`);
  console.error('  Jalankan: nvm use   (lalu ulangi perintahnya)\n');
  process.exit(1);
}
