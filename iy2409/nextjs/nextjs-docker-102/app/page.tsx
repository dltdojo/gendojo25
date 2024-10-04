import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
     <h1 className="text-3xl font-semibold">Home Page</h1>
     <Link href="/foo">Foo</Link>
    </main>
  );
}