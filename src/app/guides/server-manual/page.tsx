import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Server,
  Terminal,
  Shield,
  Network,
  Cpu,
  Settings,
  Book,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Hytale Server Manual - Complete Setup Guide",
  description:
    "Complete guide to setting up and running a Hytale dedicated server. Learn about Java installation, server files, authentication, ports, firewall configuration, multiserver architecture, and performance optimization.",
  keywords: [
    "Hytale server",
    "Hytale server setup",
    "how to run Hytale server",
    "Hytale dedicated server",
    "Hytale server manual",
    "Hytale server guide",
    "Hytale Java 25",
    "Hytale server configuration",
    "Hytale QUIC",
    "Hytale multiserver",
    "Hytale server hosting",
    "Hytale port forwarding",
    "Hytale server authentication",
    "Hytale server mods",
  ],
  openGraph: {
    title: "Hytale Server Manual - Complete Setup Guide | Mytale",
    description:
      "Learn how to set up and run your own Hytale dedicated server with our comprehensive guide.",
  },
};

// Table of Contents
const tableOfContents = [
  { id: "server-setup", title: "Server Setup", icon: Server },
  { id: "running-server", title: "Running a Hytale Server", icon: Terminal },
  { id: "tips-tricks", title: "Tips & Tricks", icon: Lightbulb },
  {
    id: "multiserver-architecture",
    title: "Multiserver Architecture",
    icon: Network,
  },
  { id: "misc-details", title: "Misc Details", icon: Settings },
  { id: "future-additions", title: "Future Additions", icon: Cpu },
];

export default function ServerManualPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/assets/5e7b92a950cbcd001176c4e9_5___temple_of_gaia_dungeon.jpg"
            alt="Hytale Server"
            fill
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-6">
            <Book className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">
              Server Guide
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Hytale </span>
            <span className="gradient-text">Server Manual</span>
          </h1>

          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-8">
            Complete guide to setting up, configuring, and operating dedicated
            Hytale servers.
          </p>

          {/* Source Attribution */}
          <p className="text-sm text-foreground-subtle">
            Based on the{" "}
            <a
              href="https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              Official Hytale Server Manual
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-b border-border sticky top-16 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center gap-2">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-lighter text-foreground-muted hover:text-foreground transition-colors text-sm"
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Server Setup */}
          <section id="server-setup" className="mb-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Server Setup
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-foreground-muted text-lg mb-6">
                The Hytale server can run on any device with at least{" "}
                <strong>4GB of memory</strong> and <strong>Java 25</strong>.
                Both x64 and arm64 architectures are supported.
              </p>

              <Card className="p-6 mb-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary-400" />
                  General Guidance
                </h4>
                <ul className="space-y-2 text-foreground-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>
                      Monitor RAM and CPU usage while the server is in use
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>
                      Resource usage heavily depends on player behavior
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>
                      Understand typical consumption for your player count and
                      playstyle
                    </span>
                  </li>
                </ul>
              </Card>

              <h3
                className="text-xl font-semibold text-foreground mb-4"
                id="installing-java"
              >
                Installing Java 25
              </h3>
              <p className="text-foreground-muted mb-4">
                Install Java 25. We recommend{" "}
                <a
                  href="https://adoptium.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  Adoptium
                </a>
                .
              </p>

              <h4 className="text-lg font-medium text-foreground mb-3">
                Confirm Installation
              </h4>
              <p className="text-foreground-muted mb-4">
                Verify the installation by running:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-green-400">java --version</code>
              </pre>
              <p className="text-foreground-muted mb-4">Expected output:</p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-6">
                <code className="text-foreground-subtle">
                  openjdk 25 2025-09-16
                  {"\n"}OpenJDK Runtime Environment Temurin-25+...
                </code>
              </pre>

              <h3
                className="text-xl font-semibold text-foreground mb-4"
                id="server-files"
              >
                Server Files
              </h3>
              <p className="text-foreground-muted mb-4">
                Two options to obtain server files:
              </p>
              <ul className="list-disc list-inside text-foreground-muted mb-6 space-y-2">
                <li>Manually copy from your Launcher installation</li>
                <li>Use the Hytale Downloader CLI</li>
              </ul>

              <h4 className="text-lg font-medium text-foreground mb-3">
                Manually Copy from Launcher
              </h4>
              <p className="text-foreground-muted mb-4">
                Find the files in your launcher installation folder:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-green-400">
                  # Windows{"\n"}cd %LOCALAPPDATA%\Hytale\versions\0.5.X\{"\n"}
                  {"\n"}# macOS{"\n"}cd ~/Library/Application\
                  Support/Hytale/versions/0.5.X/{"\n"}
                  {"\n"}# Linux{"\n"}cd ~/.local/share/Hytale/versions/0.5.X/
                </code>
              </pre>
              <p className="text-foreground-muted mb-4">
                Copy the <code className="text-primary-400">Server</code> folder
                and <code className="text-primary-400">Assets.zip</code> to your
                destination server folder.
              </p>

              <h4 className="text-lg font-medium text-foreground mb-3">
                Hytale Downloader CLI
              </h4>
              <p className="text-foreground-muted mb-4">
                A command-line tool to download Hytale server and asset files
                with OAuth2 authentication. See QUICKSTART.md inside the
                archive.
              </p>
              <Card className="p-4 bg-primary-500/10 border-primary-500/30 mb-6">
                <p className="text-foreground-muted">
                  <strong className="text-foreground">Download:</strong>{" "}
                  hytale-downloader.zip (Linux & Windows) - Available from
                  official Hytale support.
                </p>
              </Card>
            </div>
          </section>

          {/* Running a Hytale Server */}
          <section id="running-server" className="mb-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Running a Hytale Server
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-foreground-muted mb-4">
                Start the server with:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-6">
                <code className="text-green-400">
                  java -jar HytaleServer.jar
                </code>
              </pre>

              <h3
                className="text-xl font-semibold text-foreground mb-4"
                id="authentication"
              >
                Authentication
              </h3>
              <p className="text-foreground-muted mb-4">
                After first launch, authenticate your server. Once
                authenticated, your server can accept player connections.
              </p>

              <Card className="p-4 bg-yellow-500/10 border-yellow-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-medium mb-1">
                      Authentication Required
                    </p>
                    <p className="text-foreground-muted text-sm">
                      Hytale Servers require authentication to enable
                      communication with Hytale service APIs and to counter
                      abuse. If you need to authenticate many servers or
                      dynamically authenticate servers, read the Server Provider
                      Authentication Guide.
                    </p>
                  </div>
                </div>
              </Card>

              <h4 className="text-lg font-medium text-foreground mb-3">Help</h4>
              <p className="text-foreground-muted mb-4">
                Review all available arguments:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-6">
                <code className="text-green-400">
                  java -jar HytaleServer.jar --help
                </code>
              </pre>

              <h3
                className="text-xl font-semibold text-foreground mb-4"
                id="ports"
              >
                Ports
              </h3>
              <p className="text-foreground-muted mb-4">
                Default port is <code className="text-primary-400">5520</code>.
                Change it with the --bind argument:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-6">
                <code className="text-green-400">
                  java -jar HytaleServer.jar --bind 0.0.0.0:5520
                </code>
              </pre>

              <h3
                className="text-xl font-semibold text-foreground mb-4"
                id="firewall"
              >
                Firewall & Network Configuration
              </h3>
              <Card className="p-4 bg-blue-500/10 border-blue-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-medium mb-1">
                      QUIC Protocol
                    </p>
                    <p className="text-foreground-muted text-sm">
                      Hytale uses the <strong>QUIC protocol over UDP</strong>{" "}
                      (not TCP). Configure your firewall and port forwarding
                      accordingly.
                    </p>
                  </div>
                </div>
              </Card>

              <h4 className="text-lg font-medium text-foreground mb-3">
                Port Forwarding
              </h4>
              <p className="text-foreground-muted mb-4">
                If hosting behind a router, forward{" "}
                <strong>UDP port 5520</strong> (or your custom port) to your
                server machine. TCP forwarding is not required.
              </p>

              <h4 className="text-lg font-medium text-foreground mb-3">
                Firewall Rules
              </h4>
              <p className="text-foreground-muted mb-2">
                Windows Defender Firewall:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-green-400">
                  netsh advfirewall firewall add rule name="Hytale Server"
                  dir=in action=allow protocol=UDP localport=5520
                </code>
              </pre>

              <p className="text-foreground-muted mb-2">Linux (iptables):</p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-green-400">
                  sudo iptables -A INPUT -p udp --dport 5520 -j ACCEPT
                </code>
              </pre>

              <p className="text-foreground-muted mb-2">Linux (ufw):</p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-6">
                <code className="text-green-400">
                  sudo ufw allow 5520/udp
                </code>
              </pre>

              <h4 className="text-lg font-medium text-foreground mb-3">
                NAT Considerations
              </h4>
              <p className="text-foreground-muted mb-4">
                QUIC handles NAT traversal well in most cases. If players have
                trouble connecting:
              </p>
              <ul className="list-disc list-inside text-foreground-muted mb-6 space-y-2">
                <li>
                  Ensure the port forward is specifically for{" "}
                  <strong>UDP</strong>, not TCP
                </li>
                <li>
                  Symmetric NAT configurations may cause issues - consider a VPS
                  or dedicated server
                </li>
                <li>
                  Players behind carrier-grade NAT (common on mobile networks)
                  should connect fine as clients
                </li>
              </ul>
            </div>
          </section>

          {/* Tips & Tricks */}
          <section id="tips-tricks" className="mb-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Tips & Tricks
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3
                className="text-xl font-semibold text-foreground mb-4"
                id="installing-mods"
              >
                Installing Mods
              </h3>
              <p className="text-foreground-muted mb-4">
                Download mods (.zip or .jar) from sources like{" "}
                <Link
                  href="/mods"
                  className="text-primary-400 hover:underline"
                >
                  Mytale
                </Link>{" "}
                or CurseForge and drop them into the{" "}
                <code className="text-primary-400">mods/</code> folder.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Disable Sentry Crash Reporting
              </h3>
              <p className="text-foreground-muted mb-4">
                Hytale uses Sentry to track crashes. Disable it with{" "}
                <code className="text-primary-400">--disable-sentry</code> to
                avoid submitting your development errors:
              </p>
              <pre className="bg-surface-darker p-4 rounded-lg overflow-x-auto mb-6">
                <code className="text-green-400">
                  java -jar HytaleServer.jar --disable-sentry
                </code>
              </pre>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Leverage Ahead-Of-Time Cache
              </h3>
              <p className="text-foreground-muted mb-4">
                The server ships with a pre-trained AOT cache (HytaleServer.aot)
                that improves boot times by skipping JIT warmup. See{" "}
                <a
                  href="https://openjdk.org/jeps/514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  JEP-514
                </a>
                .
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Recommended Plugins
              </h3>
              <p className="text-foreground-muted mb-4">
                Development partners at Nitrado and Apex Hosting maintain
                plugins for common server hosting needs:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-foreground font-semibold">
                        Plugin
                      </th>
                      <th className="py-3 px-4 text-foreground font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-primary-400">
                        Nitrado:WebServer
                      </td>
                      <td className="py-3 px-4 text-foreground-muted">
                        Base plugin for web applications and APIs
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-primary-400">
                        Nitrado:Query
                      </td>
                      <td className="py-3 px-4 text-foreground-muted">
                        Exposes server status (player counts, etc.) via HTTP
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-primary-400">
                        Nitrado:PerformanceSaver
                      </td>
                      <td className="py-3 px-4 text-foreground-muted">
                        Dynamically limits view distance based on resource usage
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-primary-400">
                        ApexHosting:PrometheusExporter
                      </td>
                      <td className="py-3 px-4 text-foreground-muted">
                        Exposes detailed server and JVM metrics
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                View Distance
              </h3>
              <p className="text-foreground-muted mb-4">
                View distance is the main driver for RAM usage. We recommend
                limiting maximum view distance to{" "}
                <strong>12 chunks (384 blocks)</strong> for both performance and
                gameplay.
              </p>
              <Card className="p-4 bg-surface-lighter mb-6">
                <p className="text-foreground-muted text-sm">
                  <strong className="text-foreground">For comparison:</strong>{" "}
                  Minecraft servers default to 10 chunks (160 blocks). Hytale's
                  default of 384 blocks is roughly equivalent to 24 Minecraft
                  chunks. Expect higher RAM usage with default settings - tune
                  accordingly.
                </p>
              </Card>
            </div>
          </section>

          {/* Multiserver Architecture */}
          <section id="multiserver-architecture" className="mb-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Network className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Multiserver Architecture
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-foreground-muted mb-6 text-lg">
                Hytale supports native mechanisms for routing players between
                servers.{" "}
                <strong>
                  No reverse proxy like BungeeCord is required.
                </strong>
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Player Referral
              </h3>
              <p className="text-foreground-muted mb-4">
                Transfers a connected player to another server. The server sends
                a referral packet containing the target host, port, and an
                optional 4KB payload. The client opens a new connection to the
                target and presents the payload.
              </p>
              <Card className="p-4 bg-surface-lighter mb-6">
                <p className="text-foreground-muted text-sm">
                  <strong className="text-foreground">Use cases:</strong>{" "}
                  Transferring players between game servers, passing session
                  context, gating access behind matchmaking.
                </p>
              </Card>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Connection Redirects
              </h3>
              <p className="text-foreground-muted mb-4">
                During connection handshake, a server can reject the player and
                redirect them to a different server. The client automatically
                connects to the redirected address.
              </p>
              <Card className="p-4 bg-surface-lighter mb-6">
                <p className="text-foreground-muted text-sm">
                  <strong className="text-foreground">Use cases:</strong> Load
                  balancing, regional server routing, enforcing lobby-first
                  connections.
                </p>
              </Card>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Disconnect Fallback
              </h3>
              <p className="text-foreground-muted mb-4">
                When a player is unexpectedly disconnected (server crash,
                network interruption), the client automatically reconnects to a
                pre-configured fallback server instead of returning to the main
                menu.
              </p>
              <Card className="p-4 bg-surface-lighter mb-6">
                <p className="text-foreground-muted text-sm">
                  <strong className="text-foreground">Use cases:</strong>{" "}
                  Returning players to a lobby after game server crash,
                  maintaining engagement during restarts.
                </p>
              </Card>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Building a Proxy
              </h3>
              <p className="text-foreground-muted mb-4">
                Build custom proxy servers using{" "}
                <a
                  href="https://github.com/netty/netty-incubator-codec-quic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  Netty QUIC
                </a>
                . Hytale uses QUIC exclusively for client-server communication.
              </p>
              <p className="text-foreground-muted mb-4">
                Packet definitions and protocol structure are available in
                HytaleServer.jar. Use these to decode, inspect, modify, or
                forward traffic between clients and backend servers.
              </p>
            </div>
          </section>

          {/* Misc Details */}
          <section id="misc-details" className="mb-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Misc Details
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Java Command-Line Arguments
              </h3>
              <p className="text-foreground-muted mb-4">
                See{" "}
                <a
                  href="https://www.baeldung.com/jvm-parameters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  Guide to the Most Important JVM Parameters
                </a>{" "}
                for topics like -Xms and -Xmx to control heap size.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Protocol Updates
              </h3>
              <p className="text-foreground-muted mb-4">
                The Hytale protocol uses a hash to verify client-server
                compatibility. If hashes don't match exactly, the connection is
                rejected.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Configuration Files
              </h3>
              <p className="text-foreground-muted mb-4">
                Configuration files (config.json, permissions.json, etc.) are
                read on server startup and written to when in-game actions occur
                (e.g., assigning permissions via command). Manual changes while
                the server is running may be overwritten.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">
                Maven Central Artifacts
              </h3>
              <p className="text-foreground-muted mb-4">
                The HytaleServer jar will be published to Maven Central for use
                as a dependency in modding projects. Exact details including
                versioning are pending for launch.
              </p>
            </div>
          </section>

          {/* Future Additions */}
          <section id="future-additions" className="mb-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Future Additions
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-foreground-muted mb-6">
                Hytale has announced several upcoming features for server
                operators:
              </p>

              <div className="grid gap-4">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Server & Minigame Discovery
                  </h4>
                  <p className="text-foreground-muted text-sm">
                    A discovery catalogue accessible from the main menu where
                    players can browse and find servers and minigames. Server
                    operators can opt into the catalogue to promote their
                    content directly to players.
                  </p>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Parties
                  </h4>
                  <p className="text-foreground-muted text-sm">
                    A party system enabling players to group up and stay
                    together across server transfers and minigame queues.
                    Players can browse servers with their party and join
                    together.
                  </p>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Integrated Payment System
                  </h4>
                  <p className="text-foreground-muted text-sm">
                    A payment gateway built into the client that servers can use
                    to accept payments from players. Accept payments without
                    handling payment details or building infrastructure.
                  </p>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    First-Party API Endpoints
                  </h4>
                  <p className="text-foreground-muted text-sm">
                    Authenticated servers will have access to official API
                    endpoints for player data, versioning, and server
                    operations. These endpoints reduce the need for third-party
                    services.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Back to Guides */}
          <div className="border-t border-border pt-8">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to all guides
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

