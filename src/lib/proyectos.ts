export type Categoria = 'sumobot' | 'micromouse' | 'futbot' | 'ajedrez' | 'otro';

const NOMBRES: Record<Categoria, string> = {
  sumobot: 'Sumobot',
  micromouse: 'Micromouse',
  futbot: 'Futbot',
  ajedrez: 'Ajedrez inteligente',
  otro: 'Proyecto',
};

export function etiqueta(categoria: Categoria, nivel?: string): string {
  if (categoria === 'otro') return nivel ?? NOMBRES.otro;
  return nivel ? `${NOMBRES[categoria]} · ${nivel}` : NOMBRES[categoria];
}

type Ordenable = { id: string; data: { extra: boolean; orden: number } };

export function separarYOrdenar<T extends Ordenable>(lista: T[]): { competencia: T[]; extras: T[] } {
  const ordenada = [...lista].sort((a, b) => a.data.orden - b.data.orden || a.id.localeCompare(b.id));
  return {
    competencia: ordenada.filter((p) => !p.data.extra),
    extras: ordenada.filter((p) => p.data.extra),
  };
}
