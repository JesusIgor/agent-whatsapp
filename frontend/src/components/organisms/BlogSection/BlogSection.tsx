import { SectionHeader } from '@/components/molecules/SectionHeader'
import { BlogCard } from '@/components/molecules/BlogCard'

const posts = [
  {
    author: 'Nome do escritor',
    date: '29 de Janeiro, 2024',
    title: 'Secretária menos sobrecarregada',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
    tag: 'SOBRE',
  },
  {
    author: 'Nome do escritor',
    date: '29 de Janeiro, 2024',
    title: 'Secretária menos sobrecarregada',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
    tag: 'SOBRE',
  },
  {
    author: 'Nome do escritor',
    date: '29 de Janeiro, 2024',
    title: 'Secretária menos sobrecarregada',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
    tag: 'SOBRE',
  },
  {
    author: 'Nome do escritor',
    date: '29 de Janeiro, 2024',
    title: 'Secretária menos sobrecarregada',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
    tag: 'SOBRE',
  },
  {
    author: 'Nome do escritor',
    date: '29 de Janeiro, 2024',
    title: 'Secretária menos sobrecarregada',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
    tag: 'SOBRE',
  },
]

export function BlogSection() {
  const doubled = [...posts, ...posts]

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 lg:px-10">
      <div className="flex flex-col gap-8">
        <SectionHeader
          label="BLOG"
          title="Acompanhe nossa Newsletter"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />

        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <div className="animate-marquee flex w-max gap-[18px] py-2 pointer-events-none">
            {doubled.map((post, i) => (
              <BlogCard key={i} {...post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
