// Extrai o ID de um vídeo do YouTube de várias formas de URL:
// youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, /shorts/ID.
// Retorna null se não reconhecer.
export function youtubeId(url: string): string | null {
  const s = url.trim();
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  // Se já for só o ID cru.
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return null;
}

// URL de embed sem cookies, usada no player da área de membros.
export function youtubeEmbedUrl(url: string): string | null {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
