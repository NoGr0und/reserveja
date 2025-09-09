import { Cardser } from "@/app/components/cards";
import { Notificationbt } from "@/app/components/notficationh";
import { Button } from "@/components/ui/button";

const services = () => {
  return (
    <>
      {" "}
      <header>
        <Notificationbt />
        <div className="flex items-center justify-between p-6">
          {" "}
          <div className="">
            <p className="text-4xl font-bold">Meus Servicos</p>
            <h1 className="text-muted-foreground">
              Gerencie os serviços que você oferece
            </h1>
          </div>
          <div>
            <Button className="bg-blue-400 text-white">+ Novo Servico</Button>
          </div>
        </div>
      </header>
      <div>
        <div>
          <Cardser />
        </div>
      </div>
    </>
  );
};

export default services;
