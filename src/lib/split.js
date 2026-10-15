// Divide um texto em palavras e letras para as animações letra por letra.
// Retorna [{ chars: [{ ch, i }] }], onde i é o índice global da letra
// (usado nas classes .cdN de atraso). Palavras nunca quebram no meio.
export function splitText(text, max = 239) {
  let i = 0;
  return text
    .trim()
    .split(/\s+/)
    .map((word) => ({
      chars: [...word].map((ch) => ({ ch, i: Math.min(i++, max) })),
    }));
}
