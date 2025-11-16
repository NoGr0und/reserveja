import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const plans = [
  {
    id: "basico",
    name: "Básico",
    price: "R$ 29,90/mês",
    description: "Para quem está começando a organizar reservas on-line.",
    items: ["Calendário essencial", "Painel simplificado", "Suporte via email"],
  },
  {
    id: "profissional",
    name: "Profissional",
    price: "R$ 59,90/mês",
    description: "Ideal para empresas que precisam de automações e equipe.",
    items: [
      "Tudo do Básico",
      "Relatórios avançados",
      "Integração com WhatsApp",
    ],
  },
  {
    id: "empresarial",
    name: "Empresarial",
    price: "R$ 99,90/mês",
    description: "Operações em escala com suporte dedicado.",
    items: [
      "Onboarding guiado",
      "APIs personalizadas",
      "SLA com resposta prioritária",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold tracking-tight"
          >
            <span className="rounded bg-blue-500/20 p-1 text-blue-300">▸</span>
            Reserve Ja
          </Link>
          <nav className="hidden gap-8 text-sm font-medium text-slate-200 md:flex">
            <a href="#planos" className="transition hover:text-white">
              Planos
            </a>
            <a href="#contato" className="transition hover:text-white">
              Contato
            </a>
            <a href="#historia" className="transition hover:text-white">
              História
            </a>
            <Link href="/cadastro" className="transition hover:text-white">
              Cadastrar
            </Link>
          </nav>
          <Button asChild className="bg-white text-slate-900 hover:bg-slate-200">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-16">
        <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]" id="historia">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
              Plataforma de reservas
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Logo Reserve Ja
            </h1>
            <p className="mt-4 text-lg text-slate-200">
              Nasceu em 2020 para ajudar empresas brasileiras a automatizar
              atendimento e lotação de agendas com poucos cliques. Hoje somos
              parceiros de centenas de negócios que administram reservas,
              pagamentos e comunicação em um único painel.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-blue-500 text-white hover:bg-blue-600">
                <Link href="#planos">Conhecer planos</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-100">
            <h2 className="text-xl font-semibold text-white">
              Nossa história
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              A Reserveja LTDA começou como uma equipe de especialistas em
              hospitalidade. Identificamos que agendamentos eram feitos em
              planilhas sem contexto, desperdiçando tempo e dinheiro. Criamos um
              template inteligente, conectamos notificações e evoluímos para o
              painel completo que você vê hoje.
            </p>
            <p className="mt-4 text-sm text-blue-200">
              Estamos prontos para hospedar seu negócio no EasyPanel e escalar
              com segurança.
            </p>
          </div>
        </section>

        <section id="planos" className="space-y-8">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
              Planos
            </p>
            <h2 className="text-3xl font-bold text-white">
              Planos para cada estágio do seu negócio
            </h2>
            <p className="text-slate-200">
              Todos incluem autenticação segura, dashboard completo e suporte
              para importar seu template de banco no EasyPanel.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-500/5"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-300">
                    {plan.name}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {plan.price}
                  </p>
                  <p className="mt-3 text-sm text-slate-200">
                    {plan.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-100">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-blue-300">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  asChild
                  className="mt-6 bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Link href={`/cadastro?plano=${plan.id}`}>
                    Escolher plano
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contato"
          className="grid gap-8 rounded-3xl border border-white/10 bg-slate-950/70 p-10 md:grid-cols-2"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
              Contato
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Atendimento humano para te ajudar
            </h2>
            <p className="mt-4 text-slate-200">
              Envie um email para{" "}
              <a
                className="font-semibold text-blue-300"
                href="mailto:contato@reserveja.com.br"
              >
                contato@reserveja.com.br
              </a>{" "}
              ou fale no WhatsApp (11) 99999-9999. Respondemos em até um dia útil.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-white">Horários</p>
                <p>Seg-Sex das 09h às 18h</p>
              </div>
              <div>
                <p className="font-semibold text-white">Endereço</p>
                <p>Av. Paulista, 1000 - São Paulo/SP</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900/60 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
              Atualizações
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Receba novidades
            </h3>
            <p className="mt-2 text-sm text-slate-200">
              Fique por dentro de novos recursos, integrações e guias de uso.
              Enviamos só o necessário.
            </p>
            <form className="mt-6 flex flex-col gap-3">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="border-white/20 bg-transparent text-white placeholder:text-slate-400"
              />
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Quero receber
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="rounded bg-blue-500/20 p-1 text-blue-300">▸</span>
              Reserve Ja
            </div>
            <p className="text-sm text-slate-300">
              Sistema de reservas completo para seu negócio.
            </p>
          </div>
          <div className="flex flex-1 justify-center gap-10 text-sm text-slate-300">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-white">Navegação</span>
              <a href="#planos" className="hover:text-white">
                Planos
              </a>
              <a href="#contato" className="hover:text-white">
                Contato
              </a>
              <Link href="/cadastro" className="hover:text-white">
                Cadastrar
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-white">Acesso rápido</span>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <a href="#historia" className="hover:text-white">
                História
              </a>
            </div>
          </div>
          <div className="max-w-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
              Newsletter
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Receba dicas e atualizações diretamente no seu email.
            </p>
            <form className="mt-4 flex flex-col gap-3">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="border-white/20 bg-transparent text-white placeholder:text-slate-400"
              />
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Inscrever
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-slate-400">
          © 2025 direitos reservados a Reserveja LTDA
        </div>
      </footer>
    </div>
  );
}
