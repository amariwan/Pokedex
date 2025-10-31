"use client";

import { capitalize, cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type Props = {
  name: string;
  imageUrl?: string;
  className?: string;
  imageClassName?: string;
};

async function probeImage(url: string) {
  return new Promise<boolean>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export default function PokemonImageWithShiny({ name, imageUrl, className, imageClassName }: Props) {
  const [shinyUrl, setShinyUrl] = useState<string | null>(null);
  const [showShiny, setShowShiny] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;
    let mounted = true;

    (async () => {
      // try to extract numeric id from URL
      const idMatch = imageUrl.match(/\/(\d+)\.(png|jpg|jpeg)$/);
      const candidates: string[] = [];
      if (idMatch) {
        const id = idMatch[1];
        // common shiny sprites repo
        candidates.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`);
        candidates.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`);
      }

      // Fallback: replace 'other/official-artwork' by 'sprites/pokemon/shiny' heuristically
      try {
        const u = new URL(imageUrl);
        const nameCandidate = u.pathname;
        candidates.push(imageUrl.replace('/other/official-artwork/', '/sprites/pokemon/shiny/'));
      } catch (e) {
        // ignore
      }

      for (const c of candidates) {
        if (!mounted) return;
        try {
          // eslint-disable-next-line no-await-in-loop
          const ok = await probeImage(c);
          if (ok) {
            setShinyUrl(c);
            break;
          }
        } catch (e) {
          // ignore
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [imageUrl]);

  const currentSrc = showShiny && shinyUrl ? shinyUrl : imageUrl;

  return (
    <div className={cn('relative h-36 w-36', className)}>
      {currentSrc ? (
        // use native img to allow external URLs without next/image optimization issues in dev
        // keep size class from parent
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentSrc} alt={capitalize(name)} className={cn('h-full w-full object-contain', imageClassName)} />
      ) : (
        <div className='h-full w-full rounded bg-gray-200/60' />
      )}

      <div className='absolute top-1 right-1 flex gap-2'>
        {shinyUrl ? (
          <button
            aria-pressed={showShiny}
            onClick={() => setShowShiny((s) => !s)}
            className='bg-white/10 text-white px-2 py-1 rounded text-xs backdrop-blur'
            title='Toggle shiny'
          >
            {showShiny ? 'Normal' : 'Shiny'}
          </button>
        ) : null}
        <button onClick={() => setGalleryOpen(true)} className='bg-white/10 text-white px-2 py-1 rounded text-xs backdrop-blur'>Gallery</button>
      </div>

      {galleryOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60' onClick={() => setGalleryOpen(false)}>
          <div className='bg-white/5 p-4 rounded max-w-lg' onClick={(e) => e.stopPropagation()}>
            <div className='flex gap-4 items-center'>
              <img src={imageUrl} alt={`${name} default`} className='w-40 h-40 object-contain' />
              {shinyUrl ? <img src={shinyUrl} alt={`${name} shiny`} className='w-40 h-40 object-contain' /> : <div className='text-sm text-white/70'>No shiny found</div>}
            </div>
            <div className='mt-3 text-right'>
              <button onClick={() => setGalleryOpen(false)} className='bg-white/10 text-white px-3 py-1 rounded'>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
