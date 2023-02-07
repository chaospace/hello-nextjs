export default function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3>블로그 레이아웃</h3>
      <article>{children}</article>
    </section>
  );
}
