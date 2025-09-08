import { Button } from "@/components/ui/button";
import { Dashcards } from "./components/lcard";
import { Bdashcard } from "./components/bcard";
import { Bell } from "lucide-react";

const Home = () => {
  return (
    <>
      <header>
        <div className="left-0 flex w-full justify-end p-6">
          <Button>
            <Bell />
          </Button>
        </div>
        <div className="flex items-center justify-between p-6">
          {" "}
          <div className="">
            <p className="text-4xl font-bold">Dashboard</p>
            <h1 className="text-muted-foreground">Bem-Vindo</h1>
          </div>
          <div>
            <Button>+ Novo Servico</Button>
          </div>
        </div>
      </header>

      <div>
        <div>
          <Dashcards />
          <Bdashcard />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Home;
