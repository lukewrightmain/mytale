// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Custom Layout
// Full-screen layout without header/footer for the editor experience
// ═══════════════════════════════════════════════════════════════════════════

export default function UIBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without any wrapper
  // This bypasses the default main/header/footer from root layout
  return children;
}

