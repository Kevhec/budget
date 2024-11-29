import { cn } from '@/lib/utils';

interface Props {
  className?: string
}

export default function Footer({ className }: Props) {
  return (
    <footer className={cn('py-6 bg-[#343A40] text-white text-center', className)}>
      Ahorrify por
      {' '}
      <a href="https://kevhec.dev/" target="_blank" rel="noreferrer" className="underline underline-offset-4">KevHec</a>
    </footer>
  );
}
